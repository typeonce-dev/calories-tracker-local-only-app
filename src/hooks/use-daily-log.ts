import { eq, sql as sqlOrm } from "drizzle-orm";
import { DailyLogSelect } from "~/schema/daily-log";
import { foodTable, servingTable } from "~/schema/drizzle";
import { ServingSelectWithFoods } from "~/schema/serving";
import { useQuery } from "./use-query";

export const useDailyLog = (date: typeof DailyLogSelect.fields.date.Type) => {
  return useQuery(
    (orm) =>
      orm
        .select({
          id: servingTable.id,
          meal: servingTable.meal,
          quantity: servingTable.quantity,
          foodId: sqlOrm`${foodTable.id}`.as("foodId"),
          name: foodTable.name,
          brand: foodTable.brand,
          calories: foodTable.calories,
          fats: foodTable.fats,
          carbohydrates: foodTable.carbohydrates,
          proteins: foodTable.proteins,
        })
        .from(servingTable)
        .where(eq(servingTable.dailyLogDate, DailyLogSelect.formatDate(date)))
        .leftJoin(foodTable, eq(servingTable.foodId, foodTable.id))
        .toSQL(),
    ServingSelectWithFoods
  );
};
