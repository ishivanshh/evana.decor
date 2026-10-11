import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, role: { type: String, enum: ["admin"], default: "admin" },
}, { timestamps: true });
const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true }, category: { type: String, required: true }, scent: { type: String, required: true },
  notes: { type: [String], default: [] }, size: { type: String, required: true }, burnTime: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, compareAt: Number, image: { type: String, required: true },
  variants: [{ name: String, size: String, price: Number, stock: Number }],
  stock: { type: Number, default: 0, min: 0 }, published: { type: Boolean, default: true }, rating: { type: Number, default: 0 }, badge: String,
}, { timestamps: true });
const CategorySchema = new Schema({ name: { type: String, unique: true, required: true }, slug: { type: String, unique: true, required: true }, image: String, description: String }, { timestamps: true });
const OrderSchema = new Schema({
  orderNumber: { type: String, unique: true, required: true, index: true },
  customer: { name: String, email: String, phone: String },
  address: { line1: String, line2: String, city: String, state: String, pincode: String, country: { type: String, default: "India" } },
  items: [{ productId: { type: Schema.Types.ObjectId, ref: "Product" }, name: String, slug: String, image: String, price: Number, quantity: Number }],
  subtotal: Number, shipping: Number, discount: { type: Number, default: 0 }, total: Number, couponCode: String,
  paymentMethod: { type: String, enum: ["COD"], default: "COD" },
  status: { type: String, enum: ["PENDING", "ACCEPTED", "SHIPPED", "DELIVERED", "REJECTED", "CANCELLED"], default: "PENDING", index: true },
  statusHistory: [{ status: String, note: String, at: { type: Date, default: Date.now } }],
  rejectionReason: String, stockAdjusted: { type: Boolean, default: false },
}, { timestamps: true });
const CouponSchema = new Schema({ code: { type: String, unique: true, uppercase: true }, type: { type: String, enum: ["PERCENT", "FLAT"] }, value: Number, minimum: Number, active: { type: Boolean, default: true }, expiresAt: Date }, { timestamps: true });
const ReviewSchema = new Schema({ productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, name: String, rating: { type: Number, min: 1, max: 5 }, body: String, approved: { type: Boolean, default: false } }, { timestamps: true });
const ContactSchema = new Schema({ name: String, email: String, subject: String, message: String, read: { type: Boolean, default: false } }, { timestamps: true });
const NewsletterSchema = new Schema({ email: { type: String, unique: true, lowercase: true, trim: true } }, { timestamps: true });
const SettingsSchema = new Schema({ key: { type: String, unique: true }, storeName: String, shippingCharge: Number, freeShippingThreshold: Number, codCharge: Number, whatsappNumber: String }, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactSchema);
export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);
export const StoreSettings = mongoose.models.StoreSettings || mongoose.model("StoreSettings", SettingsSchema);
