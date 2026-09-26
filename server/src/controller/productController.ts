import type { Request, Response } from "express";
import { prisma } from "../app/db.js";
import { z } from "zod";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../model/productModel.js";

// Helper regex ketat: Hanya mengizinkan angka, menolak string kosong, spasi, atau huruf
const isValidId = (id: string) => /^\d+$/.test(id);

// CREATE
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const parsed = productCreateSchema.parse(req.body);

    // Buang property yang bernilai undefined (misal imageUrl tidak dikirim)
    const dataToCreate = Object.fromEntries(
      Object.entries(parsed).filter(([_, value]) => value !== undefined),
    );

    const newProduct = await prisma.product.create({
      data: dataToCreate as any, // Tambahkan 'as any' agar TypeScript berhenti protes soal exactOptionalPropertyTypes
    });

    return res
      .status(201)
      .json({ message: "Produk berhasil ditambahkan", data: newProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Data produk tidak valid", details: error.issues });
    }
    console.error("ERROR CREATE PRODUCT:", error);
    return res.status(500).json({ error: "Gagal membuat produk" });
  }
};

// READ ALL (Paginasi + Search + Metadata)
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string; // Tangkap query search
    const skip = (page - 1) * limit;

    // Buat kondisi where jika search diisi
    // Catatan: MariaDB/MySQL secara default sudah case-insensitive
    const where = search ? { name: { contains: search } } : {};

    // Mengambil data dan total baris secara bersamaan
    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where, // Masukkan filter pencarian ke query data
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.product.count({
        where, // Masukkan filter pencarian ke penghitung total agar halaman akurat
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      data: products,
      metadata: {
        page,
        limit,
        totalItems,
        totalPages,
        search: search || null,
      },
    });
  } catch (error) {
    console.error("ERROR GET PRODUCTS:", error);
    return res.status(500).json({ error: "Gagal mengambil data produk" });
  }
};

// READ BY ID
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // FIX ERROR 1: Cast sebagai string
    const id = req.params.id as string;

    if (!id || !isValidId(id)) {
      return res.status(400).json({ error: "Format ID produk tidak valid" });
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    return res.status(200).json({ data: product });
  } catch (error) {
    console.error("ERROR GET PRODUCT BY ID:", error);
    return res.status(500).json({ error: "Gagal mengambil detail produk" });
  }
};

// UPDATE
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // FIX ERROR 1: Cast sebagai string
    const id = req.params.id as string;

    if (!id || !isValidId(id)) {
      return res.status(400).json({ error: "Format ID produk tidak valid" });
    }

    const parsed = productUpdateSchema.parse(req.body);

    // FIX ERROR 2: Buang semua property yang bernilai undefined agar Prisma tidak marah
    const dataToUpdate = Object.fromEntries(
      Object.entries(parsed).filter(([_, value]) => value !== undefined),
    );

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: dataToUpdate, // Gunakan data yang sudah dibersihkan dari undefined
    });

    return res
      .status(200)
      .json({ message: "Produk berhasil diubah", data: updatedProduct });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Data produk tidak valid", details: error.issues });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    console.error("ERROR UPDATE PRODUCT:", error);
    return res.status(500).json({ error: "Gagal mengubah produk" });
  }
};

// DELETE
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // FIX ERROR 1: Cast sebagai string
    const id = req.params.id as string;

    if (!id || !isValidId(id)) {
      return res.status(400).json({ error: "Format ID produk tidak valid" });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    console.error("ERROR DELETE PRODUCT:", error);
    return res.status(500).json({ error: "Gagal menghapus produk" });
  }
};
