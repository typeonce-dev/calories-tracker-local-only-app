import { useLiveQuery } from "@electric-sql/pglite-react";
import { eq } from "drizzle-orm";
import { DailyLogSelect } from "~/schema/daily-log";
import { dailyLogTable, planTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const useDailyPlan = (date: typeof DailyLogSelect.fields.date.Type) => {
  const orm = usePgliteDrizzle();
  const query = orm
    .select({
      id: planTable.id,
      calories: planTable.calories,
      fatsRatio: planTable.fatsRatio,
      carbohydratesRatio: planTable.carbohydratesRatio,
      proteinsRatio: planTable.proteinsRatio,
    })
    .from(planTable)
    .groupBy(planTable.id)
    .leftJoin(dailyLogTable, eq(dailyLogTable.planId, planTable.id))
    .where(eq(dailyLogTable.date, DailyLogSelect.formatDate(date)));
  const { params, sql } = query.toSQL();
  const result = useLiveQuery<typeof planTable.$inferSelect>(sql, params);
  return result?.rows[0];
};
