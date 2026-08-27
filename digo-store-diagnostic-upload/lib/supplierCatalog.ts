import type { Product } from "./types";

type Group = {
  material: string;
  category: string;
  price: number;
  source: number;
  codes: string[];
};

const groups: Group[] = [
  { material: "100% Wool", category: "Scarf", price: 35, source: 1, codes: ["27","55","56","L15","36","46","49","51","58","59","66","31"] },
  { material: "Wool Blend", category: "Scarf", price: 35, source: 1, codes: ["5","61","65"] },
  { material: "100% Wool", category: "Scarf", price: 45, source: 1, codes: ["57"] },
  { material: "Wool Blend", category: "Triangle Scarf", price: 39, source: 1, codes: ["W30","W45","W46"] },
  { material: "100% Lambswool", category: "Wrap", price: 69, source: 1, codes: ["11","29"] },
  { material: "Wool Blend", category: "Wrap", price: 59, source: 1, codes: ["17"] },
  { material: "100% Wool", category: "Wrap", price: 59, source: 1, codes: ["25","68"] },
  { material: "100% Wool", category: "Scarf", price: 39, source: 1, codes: ["35","38"] },
  { material: "100% Wool", category: "Triangle Scarf", price: 39, source: 1, codes: ["43"] },
  { material: "100% Lambswool", category: "Scarf", price: 45, source: 1, codes: ["50","50B","60"] },
  { material: "Wool Blend", category: "Scarf", price: 39, source: 1, codes: ["03"] },
  { material: "Wool Blend", category: "Scarf", price: 42, source: 1, codes: ["WH015"] },
  { material: "100% Wool", category: "Scarf", price: 55, source: 1, codes: ["24"] },
  { material: "100% Lambswool", category: "Neckwarmer", price: 35, source: 1, codes: ["3","6"] },

  { material: "100% Wool", category: "Beanie", price: 29, source: 2, codes: ["M01","M02","M03","M04","M05","M06","M07","M08","M40","M41","M43","M45","M50","M52","M59","M60","M67","M81","M82","M83"] },
  { material: "Wool Blend", category: "Beanie", price: 29, source: 2, codes: ["M31","M42","M70","MN12"] },
  { material: "100% Wool", category: "Neckwarmer", price: 28, source: 2, codes: ["M61"] },
  { material: "100% Wool", category: "Beanie", price: 32, source: 2, codes: ["M62","M69"] },
  { material: "100% Wool", category: "Beanie", price: 39, source: 2, codes: ["M71"] },

  { material: "Wool Blend", category: "Touchscreen Gloves", price: 24, source: 3, codes: ["60-71","ST01"] },
  { material: "Wool Blend", category: "Arm Warmers", price: 26, source: 3, codes: ["50-1","50-2"] },
  { material: "Wool Blend", category: "Tights", price: 45, source: 3, codes: ["KW20"] },
  { material: "Wool Blend", category: "Socks", price: 22, source: 3, codes: ["WJF1","23","41","WJF2","42","52","92"] },
  { material: "Wool Blend", category: "Socks", price: 24, source: 3, codes: ["91"] },
  { material: "100% Wool", category: "Socks", price: 22, source: 3, codes: ["WZ42"] },
  { material: "100% Wool", category: "Socks", price: 24, source: 3, codes: ["72","WZ31","WZ32"] },
  { material: "100% Wool", category: "Socks", price: 32, source: 3, codes: ["82"] },

  { material: "Cashmere Wool Blend", category: "Scarf", price: 55, source: 4, codes: ["48"] },
  { material: "100% Cashmere", category: "Wrap", price: 129, source: 4, codes: ["70","90","94"] },
  { material: "Cashmere Wool Blend", category: "Triangle Scarf", price: 69, source: 4, codes: ["76"] },
  { material: "100% Cashmere", category: "Scarf", price: 85, source: 4, codes: ["87","95","98","99","WR20"] },
  { material: "100% Cashmere", category: "Printed Wrap", price: 119, source: 4, codes: ["93"] },
  { material: "100% Cashmere", category: "Triangle Scarf", price: 79, source: 4, codes: ["WR21"] },
  { material: "Cashmere Wool Blend", category: "Triangle Scarf", price: 59, source: 4, codes: ["RW51"] },
  { material: "100% Cashmere", category: "Neckwarmer", price: 65, source: 4, codes: ["WR30"] },
  { material: "Cashmere Wool Blend", category: "Beanie", price: 49, source: 4, codes: ["K23608","K23609","K23610","K23614","RM07","RM08","RM1143","RM1243","RM1343","RM1443","RM1543"] },
  { material: "100% Cashmere", category: "Beanie", price: 59, source: 4, codes: ["MR01","MR02","MR03","MR04","MR05","MR06","MR08","MR21","MR41"] },
  { material: "100% Cashmere", category: "Beanie", price: 69, source: 4, codes: ["MR07"] },
  { material: "100% Cashmere", category: "Convertible Neckwarmer", price: 69, source: 4, codes: ["MR50"] },
  { material: "100% Cashmere", category: "Gloves", price: 49, source: 4, codes: ["S13","S14","S15"] },
  { material: "Cashmere Wool Blend", category: "Gloves", price: 42, source: 4, codes: ["ST03"] },
  { material: "100% Cashmere", category: "Socks", price: 49, source: 4, codes: ["YRW01","YRW02"] },

  { material: "Yak Wool Blend", category: "Scarf", price: 55, source: 5, codes: ["NYW6"] },
  { material: "100% Yak", category: "Wrap", price: 129, source: 5, codes: ["N30"] },
  { material: "100% Yak", category: "Scarf", price: 75, source: 5, codes: ["N5"] },
  { material: "Yak Wool Blend", category: "Beanie", price: 45, source: 5, codes: ["NYM11","NYM12","NYM13","NYM14","NYM15","NYM16"] },
  { material: "Yak Wool Blend", category: "Balaclava", price: 55, source: 5, codes: ["NYM17","NYM18"] },
  { material: "Yak Wool Blend", category: "Gloves", price: 39, source: 5, codes: ["NST01","NST02"] },
  { material: "100% Alpaca", category: "Beanie", price: 55, source: 5, codes: ["YTM15","YTM16"] }
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const supplierCatalog: Product[] = groups.flatMap((group) =>
  group.codes.map((code) => ({
    id: `supplier-${group.source}-${code}`,
    name: `${group.material.replace("100% ", "")} ${group.category} — ${code}`,
    slug: `${slugify(group.material)}-${slugify(group.category)}-${slugify(code)}-s${group.source}`,
    description: `${group.material}. Curated by Digo from a China-based supplier. Style ${code}. Multiple colors may be available depending on supplier stock.`,
    price_cents: group.price * 100,
    currency: "usd",
    image_url: null,
    active: true,
    created_at: "2026-08-27T00:00:00.000Z"
  }))
);
