import type { Request, Response } from "express";
import { prisma } from "../app/db.js";

export const getDashboardSummary = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Jalankan semua query secara paralel biar API responsif
    const [revenue, totalOrders, totalProducts, recentOrders] =
      await Promise.all([
        // 1. Hitung total pendapatan (jumlahkan semua totalAmount)
        prisma.order.aggregate({
          _sum: { totalAmount: true },
        }),

        // 2. Hitung total transaksi
        prisma.order.count(),

        // 3. Hitung jumlah produk yang terdaftar
        prisma.product.count(),

        // 4. Ambil 5 transaksi terakhir untuk tabel "Recent Orders"
        prisma.order.findMany({
          take: 5,
          orderBy: { id: "desc" }, // Paling aman pakai ID desc untuk urutan terbaru
        }),
      ]);

    return res.status(200).json({
      data: {
        totalRevenue: revenue._sum.totalAmount || 0, // Fallback ke 0 kalau belum ada transaksi
        totalOrders,
        totalProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("ERROR GET DASHBOARD:", error);
    return res.status(500).json({ error: "Gagal mengambil data dashboard" });
  }
};
