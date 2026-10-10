import type { Product } from "./types";
export type Temperature = "cold" | "cool" | "mild" | "warm";
export type Conditions = "any" | "dry" | "rain" | "wind";
export type Look = {
  slug: string; title: string; subtitle: string; scene: string; panel: number;
  temperatures: Temperature[]; conditions: Conditions[]; style: string;
  story: string; tip: string; wardrobe: string[];
  slots: { label: string; slugs: string[] }[];
};
export const temperatures: { id: Temperature; label: string; note: string }[] = [
  { id: "cold", label: "0–5°C", note: "Winter layers" },
  { id: "cool", label: "5–15°C", note: "Cool days" },
  { id: "mild", label: "15–22°C", note: "Light layers" },
  { id: "warm", label: "22°C+", note: "Warm days" }
];
export const looks: Look[] = [
  { slug: "slow-mornings", title: "A slower kind of morning", subtitle: "A coffee, a little wandering, nowhere to rush.", scene: "Everyday", panel: 0,
    temperatures: ["cool", "mild"], conditions: ["dry"], style: "Soft & effortless",
    story: "An easy knit, relaxed trousers and a loosely draped scarf. Keep the base simple and let a touch of colour make it yours.",
    tip: "Start with a light scarf you can take off indoors. Add a coat when you need another layer; comfort depends on the whole outfit and your activity.",
    wardrobe: ["A favourite cream knit", "Relaxed trousers", "A coat for cooler mornings", "Everyday shoes"],
    slots: [{ label: "The finishing layer", slugs: ["lightweight-wool-scarf-55", "classic-wool-scarf-27", "fine-wool-scarf-56"] },
      { label: "A little extra warmth", slugs: ["wool-beret-m82", "classic-wool-beanie-m01"] }] },
  { slug: "rainy-city", title: "A little rain, a good day", subtitle: "For the walk between your favourite places.", scene: "City days", panel: 1,
    temperatures: ["cool", "mild"], conditions: ["rain"], style: "Quiet & practical",
    story: "A scarf tucked inside your raincoat adds a soft layer without getting in the way. Dark trousers and practical shoes keep the whole look grounded.",
    tip: "Wear wool under a separate rain shell and keep it dry. These accessories are not sold as waterproof; the umbrella and outerwear are styling references.",
    wardrobe: ["A waterproof outer layer", "Your everyday trousers", "Rain-ready shoes", "An umbrella"],
    slots: [{ label: "Under the raincoat", slugs: ["fine-wool-scarf-56", "lightweight-wool-scarf-55"] },
      { label: "For chilly hands", slugs: ["women-touchscreen-wool-gloves-60-71", "men-touchscreen-wool-gloves-st01"] }] },
  { slug: "coastal-weekend", title: "Take the long way home", subtitle: "Fresh air, warm layers, a change of pace.", scene: "Weekends", panel: 2,
    temperatures: ["cold", "cool"], conditions: ["wind", "dry"], style: "Relaxed & grounded",
    story: "A generous scarf and textured beanie bring softness to a dark coat. Add them to pieces you already love for a simple weekend combination.",
    tip: "Pair these accessories with an appropriate outer layer for wind and cold. Temperature bands are styling guides, not tested insulation or windproof ratings.",
    wardrobe: ["A warm, wind-appropriate coat", "Comfortable trousers", "Sturdy walking shoes"],
    slots: [{ label: "The generous scarf", slugs: ["oversized-wool-scarf-57", "classic-wool-scarf-27"] },
      { label: "The textured beanie", slugs: ["chunky-rib-wool-beanie-m41", "classic-wool-beanie-m01"] },
      { label: "One more warm layer", slugs: ["men-touchscreen-wool-gloves-st01", "women-touchscreen-wool-gloves-60-71"] }] }
];
export function getLookSlots(look: Look, products: Product[]) {
  return look.slots.map(slot => ({ ...slot, products: slot.slugs.flatMap(slug => {
    const product = products.find(p => p.slug === slug && p.active);
    return product ? [product] : [];
  }) }));
}
export function filterLooks(temperature: Temperature, conditions: Conditions, scene: string) {
  return looks.filter(look => look.temperatures.includes(temperature) &&
    (conditions === "any" || look.conditions.includes(conditions)) && (scene === "All days" || look.scene === scene));
}
