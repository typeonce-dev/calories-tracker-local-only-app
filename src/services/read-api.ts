import { eq } from "drizzle-orm";
import { Array, Data, Effect, flow } from "effect";
import { DailyLogSelect } from "~/schema/daily-log";
import { dailyLogTable } from "~/schema/drizzle";
import { Pglite } from "./pglite";

class ReadApiError extends Data.TaggedError("ReadApiError")<{
  cause: unknown;
}> {}

export class ReadApi extends Effect.Service<ReadApi>()("ReadApi", {
  effect: Effect.gen(function* () {
    const { query } = yield* Pglite;
    return {
      getCurrentDateLog: (date: typeof DailyLogSelect.fields.date.Type) =>
        query((_) =>
          _.select()
            .from(dailyLogTable)
            .where(eq(dailyLogTable.date, DailyLogSelect.formatDate(date)))
            .limit(1)
        ).pipe(
          Effect.flatMap(
            flow(
              Array.head,
              Effect.mapError((error) => new ReadApiError({ cause: error }))
            )
          )
        ),
    };
  }),
  dependencies: [Pglite.Default],
}) {}
