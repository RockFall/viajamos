import type { RestaurantCuisine } from "@/types";

export const RESTAURANT_CUISINES: RestaurantCuisine[] = [
  "japones",
  "brasileiro",
  "cubano",
  "italiano",
  "mexicano",
  "peruano",
  "mediterraneo",
  "tailandes",
  "frutos_do_mar",
  "contemporaneo",
];

export function isRestaurantCuisine(value: string): value is RestaurantCuisine {
  return RESTAURANT_CUISINES.includes(value as RestaurantCuisine);
}
