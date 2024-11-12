import { Data, DateTime, Effect, flow, Schema } from "effect";
import { DailyLogInsert, DailyLogSelect } from "~/schema/daily-log";
import {
  dailyLogTable,
  foodTable,
  planTable,
  servingTable,
} from "~/schema/drizzle";
import { FoodInsert } from "~/schema/food";
import { _PlanInsert } from "~/schema/plan";
import { ServingInsert } from "~/schema/serving";
import { singleResult } from "~/utils";
import { Pglite } from "./pglite";

class WriteApiError extends Data.TaggedError("WriteApiError")<{
  cause: unknown;
}> {}

export class WriteApi extends Effect.Service<WriteApi>()("WriteApi", {
  effect: Effect.gen(function* () {
    const { query } = yield* Pglite;
    return {
      createDailyLog: flow(
        Schema.decode(DailyLogInsert),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap((values) =>
          query((_) =>
            _.insert(dailyLogTable)
              .values({
                ...values,
                date: DateTime.formatIsoDateUtc(values.date),
              })
              .returning()
          )
        ),
        singleResult(
          () => new WriteApiError({ cause: "Daily log not created" })
        ),
        Effect.flatMap(Schema.decode(DailyLogSelect))
      ),

      createPlan: flow(
        Schema.decode(_PlanInsert.WithValidation),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap((values) =>
          query((_) =>
            _.insert(planTable).values(values).returning({ id: planTable.id })
          )
        ),
        singleResult(() => new WriteApiError({ cause: "Plan not created" }))
      ),

      createServing: flow(
        Schema.decode(ServingInsert),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap((values) =>
          query((_) =>
            _.insert(servingTable).values({
              ...values,
              dailyLogDate: DailyLogSelect.formatDate(values.dailyLogDate),
            })
          )
        )
      ),

      createFood: flow(
        Schema.decode(FoodInsert),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap((values) =>
          query((_) => _.insert(foodTable).values(values))
        )
      ),
    };
  }),
  dependencies: [Pglite.Default],
}) {}
