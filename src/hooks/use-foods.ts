import { foodTable } from "~/schema/drizzle";
import { FoodSelect } from "~/schema/food";
import { useQuery } from "./use-query";

export const useFoods = () => {
  return useQuery((orm) => orm.select().from(foodTable).toSQL(), FoodSelect);
};
