import { and, eq, not } from "drizzle-orm";
import { Data, DateTime, Effect, flow, Schema } from "effect";
import {
  DailyLogInsert,
  DailyLogSelect,
  DailyLogUpdate,
} from "~/schema/daily-log";
import {
  dailyLogTable,
  foodTable,
  planTable,
  servingTable,
  systemTable,
} from "~/schema/drizzle";
import { FoodInsert, FoodUpdate } from "~/schema/food";
import { _PlanInsert, _PlanUpdate, PlanRemove } from "~/schema/plan";
import { ServingInsert, ServingRemove, ServingUpdate } from "~/schema/serving";
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

      createSystem: query((_) =>
        _.insert(systemTable).values({ version: 0 }).returning()
      ).pipe(
        singleResult(() => new WriteApiError({ cause: "System not created" }))
      ),

      updateServing: flow(
        Schema.decode(ServingUpdate),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(({ id, quantity }) =>
          query((_) =>
            _.update(servingTable)
              .set({ quantity })
              .where(eq(servingTable.id, id))
          )
        )
      ),

      updatePlan: flow(
        Schema.decode(_PlanUpdate.WithValidation),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(({ id, ...values }) =>
          query((_) =>
            _.update(planTable).set(values).where(eq(planTable.id, id))
          )
        )
      ),

      updateFood: flow(
        Schema.decode(FoodUpdate),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(({ id, ...values }) =>
          query((_) =>
            _.update(foodTable).set(values).where(eq(foodTable.id, id))
          )
        )
      ),

      updateCurrentPlan: flow(
        Schema.decode(Schema.Number),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap((id) =>
          Effect.all(
            [
              query((_) =>
                _.update(planTable)
                  .set({ isCurrent: false })
                  .where(
                    and(
                      not(eq(planTable.id, id)),
                      eq(planTable.isCurrent, true)
                    )
                  )
              ),
              query((_) =>
                _.update(planTable)
                  .set({ isCurrent: true })
                  .where(eq(planTable.id, id))
              ),
            ],
            { concurrency: "unbounded" }
          )
        )
      ),

      updateDailyLog: flow(
        Schema.decode(DailyLogUpdate),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(({ date, ...values }) =>
          query((_) =>
            _.update(dailyLogTable)
              .set(values)
              .where(eq(dailyLogTable.date, DailyLogSelect.formatDate(date)))
          )
        )
      ),

      removeServing: flow(
        Schema.decode(ServingRemove),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(({ id }) =>
          query((_) => _.delete(servingTable).where(eq(servingTable.id, id)))
        )
      ),

      removePlan: flow(
        Schema.decode(PlanRemove),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(({ id }) =>
          query((_) => _.delete(planTable).where(eq(planTable.id, id)))
        )
      ),

      updateSystemVersion: flow(
        Schema.decode(Schema.Positive),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap((version) =>
          // Single row or multiple?
          query((_) => _.update(systemTable).set({ version }))
        )
      ),
    };
  }),
  dependencies: [Pglite.Default],
}) {}
