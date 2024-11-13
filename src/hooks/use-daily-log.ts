import { useLiveQuery } from "@electric-sql/pglite-react";
import { eq, sql as sqlOrm } from "drizzle-orm";
import { DailyLogSelect } from "~/schema/daily-log";
import { foodTable, servingTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";
import type { ServingFood } from "~/type";

export const useDailyLog = (date: typeof DailyLogSelect.fields.date.Type) => {
  const orm = usePgliteDrizzle();
  const query = orm
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
    .leftJoin(foodTable, eq(servingTable.foodId, foodTable.id));
  const { params, sql } = query.toSQL();
  return useLiveQuery<ServingFood>(sql, params);
};
