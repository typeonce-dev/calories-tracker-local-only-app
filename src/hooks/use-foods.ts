import { useLiveQuery } from "@electric-sql/pglite-react";
import { foodTable } from "~/schema/drizzle";
import { usePgliteDrizzle } from "./use-pglite-drizzle";

export const useFoods = () => {
  const orm = usePgliteDrizzle();
  const query = orm.select().from(foodTable);
  const { params, sql } = query.toSQL();
  return useLiveQuery<typeof foodTable.$inferSelect>(sql, params);
};
