import { eq } from "drizzle-orm";
import { Data, Effect, Schema } from "effect";
import { DailyLogSelect } from "~/schema/daily-log";
import { dailyLogTable, planTable, systemTable } from "~/schema/drizzle";
import { singleResult } from "~/utils";
import { Pglite } from "./pglite";

class ReadApiError extends Data.TaggedError("ReadApiError")<{
  cause: unknown;
}> {}

export class ReadApi extends Effect.Service<ReadApi>()("ReadApi", {
  effect: Effect.gen(function* () {
    const { query } = yield* Pglite;
    return {
      getSystem: query((_) => _.select().from(systemTable)).pipe(
        singleResult(() => new ReadApiError({ cause: "System not found" }))
      ),

      getCurrentDateLog: (date: typeof DailyLogSelect.fields.date.Type) =>
        query((_) =>
          _.select()
            .from(dailyLogTable)
            .where(eq(dailyLogTable.date, DailyLogSelect.formatDate(date)))
            .limit(1)
        ).pipe(
          singleResult(() => new ReadApiError({ cause: "No log found" })),
          Effect.flatMap(Schema.decode(DailyLogSelect))
        ),

      getCurrentPlan: query((_) =>
        _.select().from(planTable).where(eq(planTable.isCurrent, true)).limit(1)
      ).pipe(singleResult(() => new ReadApiError({ cause: "No log found" }))),
    };
  }),
  dependencies: [Pglite.Default],
}) {}
