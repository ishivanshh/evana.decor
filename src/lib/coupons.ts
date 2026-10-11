import { Coupon } from "@/lib/models";

export async function getCouponDiscount(code: string, subtotal: number) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true }).lean();
  if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date()) || subtotal < (coupon.minimum ?? 0)) return null;
  const discount = coupon.type === "PERCENT" ? Math.round(subtotal * coupon.value / 100) : coupon.value;
  return { code: coupon.code, discount: Math.min(discount, subtotal) };
}
