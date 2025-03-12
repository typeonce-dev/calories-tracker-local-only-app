import { eq } from "drizzle-orm";
import { dailyLogTable, planTable } from "~/schema/drizzle";
import { PlanSelectDaily } from "~/schema/plan";
import { useQuerySingle } from "./use-query";

export const useDailyPlan = (date: string) => {
  return useQuerySingle(
    (orm) =>
      orm
        .select({
          id: planTable.id,
          calories: planTable.calories,
          fatsRatio: planTable.fatsRatio,
          carbohydratesRatio: planTable.carbohydratesRatio,
          proteinsRatio: planTable.proteinsRatio,
          isCurrent: planTable.isCurrent,
        })
        .from(planTable)
        .groupBy(planTable.id)
        .leftJoin(dailyLogTable, eq(dailyLogTable.planId, planTable.id))
        .where(eq(dailyLogTable.date, date))
        .toSQL(),
    PlanSelectDaily
  );
};
