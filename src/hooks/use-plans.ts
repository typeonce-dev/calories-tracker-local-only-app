import { useLiveQuery } from "@electric-sql/pglite-react";
import { count, eq } from "drizzle-orm";
import { dailyLogTable, planTable } from "~/schema/drizzle";
import type { PlanWithLogsCount } from "~/type";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const usePlans = () => {
  const orm = usePgliteDrizzle();
  const query = orm
    .select({
      id: planTable.id,
      calories: planTable.calories,
      fatsRatio: planTable.fatsRatio,
      carbohydratesRatio: planTable.carbohydratesRatio,
      proteinsRatio: planTable.proteinsRatio,
      logs: count(dailyLogTable.date).as("logs"),
    })
    .from(planTable)
    .groupBy(planTable.id)
    .leftJoin(dailyLogTable, eq(planTable.id, dailyLogTable.planId));
  const { params, sql } = query.toSQL();
  return useLiveQuery<PlanWithLogsCount>(sql, params);
};
