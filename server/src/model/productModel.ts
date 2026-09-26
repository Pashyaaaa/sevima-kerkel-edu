import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Nama produk tidak boleh kosong"),
  price: z.number().min(0, "Harga tidak boleh kurang dari 0"),
  imageUrl: z.string().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();
