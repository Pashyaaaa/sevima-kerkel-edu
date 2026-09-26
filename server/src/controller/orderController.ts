import type { Request, Response } from "express";
import { prisma } from "../app/db.js";
import { z } from "zod";
import { orderCreateSchema } from "../model/orderModel.js";

// Helper regex ketat
const isValidId = (id: string) => /^\d+$/.test(id);

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const parsed = orderCreateSchema.parse(req.body);

    // 1. Kumpulkan semua productId yang di-request
    const productIds = parsed.items.map((item) => item.productId);

    // 2. Tarik data harga asli dari database secara paralel
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }, // Cari produk yang ID-nya ada di dalam list
      },
      select: {
        id: true,
        price: true, // Kita cuma butuh ID dan harga aslinya
      },
    });

    // 3. Cek kalau ada produk fiktif (ID dikirim tapi ga ada di DB)
    if (dbProducts.length !== productIds.length) {
      return res
        .status(400)
        .json({ error: "Satu atau lebih produk tidak ditemukan di database" });
    }

    // 4. Map items: Gabungkan quantity dari FE dengan harga asli dari DB
    const formattedItems = parsed.items.map((item) => {
      // Cari harga produk dari hasil query database tadi
      const realProduct = dbProducts.find((p) => p.id === item.productId);
      const realPrice = realProduct!.price;
      const subtotal = item.quantity * realPrice;

      return {
        productId: item.productId,
        quantity: item.quantity,
        // HAPUS BARIS PRICE DI SINI
        subtotal: subtotal,
      };
    });

    // 5. Hitung total keseluruhan
    const totalAmount = formattedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    // 6. Simpan ke database
    const newOrder = await prisma.order.create({
      data: {
        paymentType: parsed.paymentType,
        totalAmount: totalAmount, // Sesuaikan lagi jika namamu 'total' atau 'totalAmount'
        orderItems: {
          create: formattedItems,
        },
      } as any,
      include: {
        orderItems: true,
      },
    });

    return res
      .status(201)
      .json({ message: "Pesanan berhasil dibuat", data: newOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Data pesanan tidak valid", details: error.issues });
    }
    console.error("ERROR CREATE ORDER:", error);
    return res.status(500).json({ error: "Gagal membuat pesanan" });
  }
};

// READ ALL (Paginasi + Metadata)
export const getOrders = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, totalItems] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          orderItems: true, // Opsional: Tampilkan item di list
        },
      }),
      prisma.order.count(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      data: orders,
      metadata: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("ERROR GET ORDERS:", error);
    return res.status(500).json({ error: "Gagal mengambil data pesanan" });
  }
};

// READ BY ID
export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = req.params.id as string;

    if (!id || !isValidId(id)) {
      return res.status(400).json({ error: "Format ID pesanan tidak valid" });
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: {
          include: {
            product: true, // Ambil detail produk sekalian biar frontend gampang nampilin nama produknya
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    }
    return res.status(200).json({ data: order });
  } catch (error) {
    console.error("ERROR GET ORDER BY ID:", error);
    return res.status(500).json({ error: "Gagal mengambil detail pesanan" });
  }
};

// DELETE ORDER (Transaksi Aman)
export const deleteOrder = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = req.params.id as string;

    if (!id || !isValidId(id)) {
      return res.status(400).json({ error: "Format ID pesanan tidak valid" });
    }

    // Gunakan transaksi agar OrderItem dan Order terhapus berbarengan
    // OrderItem dihapus lebih dulu agar tidak melanggar aturan database
    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { orderId: Number(id) }, // Sesuaikan kalau nama relasinya beda di skemamu
      }),
      prisma.order.delete({
        where: { id: Number(id) },
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Pesanan beserta detail item berhasil dihapus" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pesanan tidak ditemukan" });
    }
    console.error("ERROR DELETE ORDER:", error);
    return res.status(500).json({ error: "Gagal menghapus pesanan" });
  }
};
