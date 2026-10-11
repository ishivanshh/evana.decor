import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
export const metadata = { title: "Wax bars", description: "Discover Evana's hand-poured wax bars for home fragrance warmers." };
export default function WaxbarsPage() {
  const waxbars = products.filter(product => product.category === "Wax bars");
  return <div className="container-page min-h-[65vh] py-14"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Small melts, lovely moments</p><h1 className="font-display mt-3 text-6xl">Wax bars</h1><p className="mt-4 text-sm leading-7 text-[#82776d]">A little fragrance, ready for your favourite warmer. Every wax-bar set is ₹150.</p></div><div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">{waxbars.map(product => <ProductCard product={product} key={product._id} />)}</div></div>;
}
