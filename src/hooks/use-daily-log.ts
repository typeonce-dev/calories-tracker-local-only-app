import { useLiveQuery } from "@electric-sql/pglite-react";
import { dailyLogTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const useDailyLog = () => {
  const orm = usePgliteDrizzle();
  return useLiveQuery(orm.select().from(dailyLogTable).toSQL().sql);
};
