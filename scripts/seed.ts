import { loadEnvConfig } from "@next/env";
import { products } from "../src/lib/catalog";

loadEnvConfig(process.cwd());

async function seed() {
  const [{ default: mongoose }, { default: bcrypt }, { connectDB }, { Category, ProductModel, StoreSettings, User }] = await Promise.all([
    import("mongoose"), import("bcryptjs"), import("../src/lib/db"), import("../src/lib/models"),
  ]);
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env.local before seeding.");
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { name: process.env.ADMIN_NAME || "Evana Owner", email, passwordHash, role: "admin" }, { upsert: true, new: true, runValidators: true });
  for (const product of products) {
    await ProductModel.updateOne({ slug: product.slug }, { $setOnInsert: {
      name: product.name, slug: product.slug, category: product.category, scent: product.scent,
      description: product.description, notes: product.notes, size: product.size, burnTime: product.burnTime,
      price: product.price, compareAt: product.compareAt, image: product.image, rating: product.rating,
      badge: product.badge,
      stock: 24, published: true, variants: [{ name: "Classic", size: product.size, price: product.price, stock: 24 }],
    } }, { upsert: true });
    await ProductModel.updateOne({ slug: product.slug, image: /^https:\/\/images\.unsplash\.com\// }, { $set: { image: product.image } });
    await ProductModel.updateOne({ slug: product.slug }, { $set: { price: product.price } });
    await ProductModel.updateOne(
      { slug: product.slug, "variants.name": "Classic", "variants.size": product.size },
      { $set: { "variants.$.price": product.price } },
    );
  }
  for (const name of ["Signature candles", "Ritual candles", "Gift sets", "Wax bars"]) {
    const slug = name.toLowerCase().replaceAll(" ", "-");
    await Category.updateOne({ slug }, { $setOnInsert: { name, slug } }, { upsert: true });
  }
  await StoreSettings.updateOne({ key: "default" }, { $setOnInsert: { key: "default", storeName: "Evana", shippingCharge: 99, freeShippingThreshold: 1999, codCharge: 0, whatsappNumber: "919999999999" } }, { upsert: true });
  console.info(`Seeded ${products.length} sample products and owner ${email}.`);
  await mongoose.disconnect();
}

seed().catch(error => { console.error("Seeding failed:", error); process.exitCode = 1; });
