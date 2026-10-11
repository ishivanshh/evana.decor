import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(100), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  category: z.string().trim().min(2).max(80), scent: z.string().trim().min(2).max(80), size: z.string().trim().min(1).max(40),
  burnTime: z.string().trim().min(1).max(40), price: z.coerce.number().positive().max(1000000), stock: z.coerce.number().int().min(0).max(100000),
  image: z.string().trim().min(1).max(1000).refine(value => {
    if (!value.startsWith("http")) return /^[a-zA-Z0-9_-]+$/.test(value);
    try {
      const url = new URL(value);
      return url.protocol === "https:" && ["images.unsplash.com", "res.cloudinary.com"].includes(url.hostname);
    } catch { return false; }
  }, "Use an Unsplash photo ID or HTTPS image hosted by Unsplash or Cloudinary."),
  description: z.string().trim().min(10).max(2000),
});

export const productUpdateSchema = productSchema.omit({ slug: true }).extend({ published: z.boolean().optional() }).partial().refine(value => Object.keys(value).length > 0);
