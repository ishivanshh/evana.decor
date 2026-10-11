import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!await requireAdmin()) return unauthorized();
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Choose an image under 5 MB." }, { status: 400 });
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "evana/products", resource_type: "image" }, (error, result) => {
      if (error || !result) reject(error ?? new Error("Cloudinary returned no image."));
      else resolve(result);
    }).end(buffer);
  });
  return NextResponse.json({ url: uploaded.secure_url });
}
