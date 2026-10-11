export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  scent: string;
  description: string;
  notes: string[];
  burnTime: string;
  size: string;
  price: number;
  compareAt?: number;
  image: string;
  color?: string;
  badge?: string;
  rating: number;
  published?: boolean;
};

export const products: Product[] = [
  { _id: "p1", name: "Sandalwood & Amber", slug: "sandalwood-amber", category: "Signature candles", scent: "Woody", description: "A grounding blend that feels like the last light of an unhurried evening. Hand-poured with natural soy wax and a cotton wick.", notes: ["Creamy sandalwood", "Golden amber", "Soft musk"], burnTime: "45 hours", size: "220 g", price: 1299, image: "photo-1603006905003-be475563bc59", color: "#c6ab8d", badge: "Bestseller", rating: 4.9 },
  { _id: "p2", name: "Rosewood & Fig", slug: "rosewood-fig", category: "Signature candles", scent: "Floral", description: "Green fig and velvety rosewood come together in a soft, quietly indulgent fragrance for slow mornings.", notes: ["Wild fig", "Rosewood", "Black tea"], burnTime: "45 hours", size: "220 g", price: 1399, image: "photo-1602523961358-f9f03dd557db", color: "#b68b78", rating: 4.8 },
  { _id: "p3", name: "Coastal Neroli", slug: "coastal-neroli", category: "Signature candles", scent: "Fresh", description: "A bright, airy escape inspired by sun-warmed citrus groves and the salt-soft breeze of the coast.", notes: ["Neroli", "Bergamot", "Sea salt"], burnTime: "40 hours", size: "220 g", price: 1299, image: "photo-1602874801007-bd458bb1b8b6", color: "#c3c9ba", badge: "New", rating: 4.7 },
  { _id: "p4", name: "Vanilla Dusk", slug: "vanilla-dusk", category: "Signature candles", scent: "Sweet", description: "Warm vanilla bean meets smoky cedar for a comforting fragrance that makes coming home feel special.", notes: ["Vanilla bean", "Cedar", "Tonka"], burnTime: "50 hours", size: "220 g", price: 1199, image: "photo-1603006905003-be475563bc59", color: "#d2bba1", rating: 4.9 },
  { _id: "p5", name: "Quiet Morning", slug: "quiet-morning", category: "Ritual candles", scent: "Fresh", description: "An invitation to pause. Clean linen and delicate lavender create a gentle start to the day.", notes: ["Lavender", "Cotton", "White tea"], burnTime: "35 hours", size: "160 g", price: 899, image: "photo-1602523961358-f9f03dd557db", color: "#c9c7b4", rating: 4.6 },
  { _id: "p6", name: "Cedar & Smoke", slug: "cedar-smoke", category: "Signature candles", scent: "Woody", description: "A fireside fragrance with the character of dry cedar, glowing embers and a hint of spice.", notes: ["Cedarwood", "Clove", "Smoked vetiver"], burnTime: "45 hours", size: "220 g", price: 1399, image: "photo-1602874801007-bd458bb1b8b6", color: "#9f8975", rating: 4.8 },
  { _id: "p7", name: "Garden After Rain", slug: "garden-after-rain", category: "Ritual candles", scent: "Floral", description: "The fresh stillness after a summer shower, with crushed leaves and the quiet sweetness of jasmine.", notes: ["Jasmine", "Green leaf", "Petrichor"], burnTime: "35 hours", size: "160 g", price: 999, image: "photo-1603006905003-be475563bc59", color: "#aab6a1", rating: 4.7 },
  { _id: "p8", name: "The Slow Sunday Set", slug: "slow-sunday-set", category: "Gift sets", scent: "Mixed", description: "Three small rituals in one thoughtful gift. Our most-loved fragrances, made for sharing or keeping close.", notes: ["Three signature scents"], burnTime: "3 × 18 hours", size: "3 × 80 g", price: 1899, compareAt: 2299, image: "photo-1602523961358-f9f03dd557db", color: "#bd9e84", badge: "Save 17%", rating: 5 },
  { _id: "p9", name: "Cardamom Chai", slug: "cardamom-chai", category: "Signature candles", scent: "Spicy", description: "A nostalgic cup of chai translated into fragrance: aromatic green cardamom, ginger and creamy milk.", notes: ["Cardamom", "Ginger", "Cream"], burnTime: "45 hours", size: "220 g", price: 1299, image: "photo-1602874801007-bd458bb1b8b6", color: "#bc9b72", rating: 4.8 },
  { _id: "p10", name: "Jasmine Moon", slug: "jasmine-moon", category: "Ritual candles", scent: "Floral", description: "Soft jasmine blooms in the night air, balanced by a gentle, comforting base of sandalwood.", notes: ["Night jasmine", "Sandalwood", "Cashmere"], burnTime: "35 hours", size: "160 g", price: 999, image: "photo-1603006905003-be475563bc59", color: "#d1c4b9", rating: 4.6 },
  { _id: "p11", name: "Golden Hour", slug: "golden-hour", category: "Signature candles", scent: "Citrus", description: "Golden citrus peel and sunlit woods capture the small magic of the hour before sunset.", notes: ["Mandarin", "Neroli", "Blonde woods"], burnTime: "45 hours", size: "220 g", price: 1299, image: "photo-1602523961358-f9f03dd557db", color: "#c8a879", rating: 4.7 },
  { _id: "p12", name: "Homebody Duo", slug: "homebody-duo", category: "Gift sets", scent: "Mixed", description: "A pair made for home: one grounding, one bright. Arrives gift-ready in our signature box.", notes: ["Sandalwood & Amber", "Coastal Neroli"], burnTime: "2 × 45 hours", size: "2 × 220 g", price: 2299, compareAt: 2598, image: "photo-1602874801007-bd458bb1b8b6", color: "#c5ac99", badge: "Gift favourite", rating: 4.9 },
];

export const productImage = (id: string, width = 900) => id.startsWith("https://") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
export const productHref = (slug: string) => `/products/${slug}`;
