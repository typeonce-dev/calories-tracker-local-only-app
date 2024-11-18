import { count, eq } from "drizzle-orm";
import { dailyLogTable, planTable } from "~/schema/drizzle";
import { PlanSelectWithLogs } from "~/schema/plan";
import { useQuery } from "./use-query";

export const usePlans = () => {
  return useQuery(
    (orm) =>
      orm
        .select({
          id: planTable.id,
          calories: planTable.calories,
          fatsRatio: planTable.fatsRatio,
          carbohydratesRatio: planTable.carbohydratesRatio,
          proteinsRatio: planTable.proteinsRatio,
          isCurrent: planTable.isCurrent,
          logs: count(dailyLogTable.date).as("logs"),
        })
        .from(planTable)
        .groupBy(planTable.id)
        .leftJoin(dailyLogTable, eq(planTable.id, dailyLogTable.planId))
        .toSQL(),
    PlanSelectWithLogs
  );
};
