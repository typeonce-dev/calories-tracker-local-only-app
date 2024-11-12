import { eq } from "drizzle-orm";
import { Data, Effect, flow, Schema } from "effect";
import {
  dailyLogTable,
  foodTable,
  planTable,
  servingTable,
} from "~/schema/drizzle";
import { FoodInsert } from "~/schema/food";
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
      getDailyLog: (date: string) =>
        query((_) =>
          _.select()
            .from(dailyLogTable)
            .where(eq(dailyLogTable.date, date))
            .limit(1)
        ).pipe(
          singleResult(
            () => new WriteApiError({ cause: "Daily log not found" })
          )
        ),

      createDailyLog:
        // TODO: Make this date a brand!
        (params: { date: string; planId: number }) =>
          query((_) => _.insert(dailyLogTable).values(params).returning()).pipe(
            singleResult(
              () => new WriteApiError({ cause: "Daily log not created" })
            )
          ),

      createPlan: (params: {
        calories: number;
        fatsRatio: number;
        carbohydratesRatio: number;
        proteinsRatio: number;
      }) =>
        // TODO: Schema instead of `liftPredicate`
        Effect.liftPredicate(
          params,
          (params) =>
            params.carbohydratesRatio +
              params.fatsRatio +
              params.proteinsRatio ===
            100,
          () => new WriteApiError({ cause: "Macros ratio must be 100%" })
        ).pipe(
          Effect.andThen(
            query((_) =>
              _.insert(planTable).values(params).returning({ id: planTable.id })
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
