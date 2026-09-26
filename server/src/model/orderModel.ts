import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.number().int().positive("ID Produk harus valid"),
  quantity: z.number().int().positive("Kuantitas minimal 1"),
});

export const orderCreateSchema = z.object({
  paymentType: z.string().optional().default("CASH"),
  items: z
    .array(orderItemSchema)
    .min(1, "Pesanan harus memiliki minimal 1 produk"),
});
