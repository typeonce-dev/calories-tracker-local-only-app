import { useLiveQuery } from "@electric-sql/pglite-react";
import { eq } from "drizzle-orm";
import { servingTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const useDailyLog = (date: string) => {
  const orm = usePgliteDrizzle();
  const query = orm
    .select()
    .from(servingTable)
    .where(eq(servingTable.dailyLogDate, date));
  const { params, sql } = query.toSQL();
  return useLiveQuery<typeof servingTable.$inferSelect>(sql, params);
};
