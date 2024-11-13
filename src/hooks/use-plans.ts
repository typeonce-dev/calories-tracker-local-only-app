import { useLiveQuery } from "@electric-sql/pglite-react";
import { planTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const usePlans = () => {
  const orm = usePgliteDrizzle();
  const query = orm.select().from(planTable);
  const { params, sql } = query.toSQL();
  return useLiveQuery<typeof planTable.$inferSelect>(sql, params);
};
