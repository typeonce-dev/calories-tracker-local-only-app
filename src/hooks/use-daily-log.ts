import { useLiveQuery } from "@electric-sql/pglite-react";
import { eq } from "drizzle-orm";
import { dailyLogTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const useDailyLog = (date: string) => {
  const orm = usePgliteDrizzle();
  const { params, sql } = orm
    .select()
    .from(dailyLogTable)
    .where(eq(dailyLogTable.date, date))
    .limit(1)
    .toSQL();
  return useLiveQuery(sql, params);
};
