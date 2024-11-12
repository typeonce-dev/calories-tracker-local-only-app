import { Data, Effect, flow, Schema } from "effect";
import { DailyLogInsert } from "~/schema/daily-log";
import {
  dailyLogTable,
  foodTable,
  planTable,
  servingTable,
} from "~/schema/drizzle";
import { FoodInsert } from "~/schema/food";
import { PlanInsert } from "~/schema/plan";
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
          query((_) => _.insert(dailyLogTable).values(values).returning())
        ),
        singleResult(
          () => new WriteApiError({ cause: "Daily log not created" })
        )
      ),

      createPlan: flow(
        Schema.decode(PlanInsert),
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
          query((_) => _.insert(servingTable).values(values))
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
