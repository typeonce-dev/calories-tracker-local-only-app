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

    const execute = <A, I, T, E>(
      schema: Schema.Schema<A, I>,
      exec: (values: I) => Effect.Effect<T, E>
    ) =>
      flow(
        Schema.decode(schema),
        Effect.flatMap(Schema.encode(schema)),
        Effect.mapError((error) => new WriteApiError({ cause: error })),
        Effect.flatMap(exec)
      );

    return {
      createDailyLog: flow(
        execute(DailyLogInsert, (values) =>
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
        execute(_PlanInsert.WithValidation, (values) =>
          query((_) =>
            _.insert(planTable).values(values).returning({ id: planTable.id })
          )
        ),
        singleResult(() => new WriteApiError({ cause: "Plan not created" }))
      ),

      createServing: execute(ServingInsert, (values) =>
        query((_) => _.insert(servingTable).values(values))
      ),

      createFood: execute(FoodInsert, (values) =>
        query((_) => _.insert(foodTable).values(values))
      ),

      updateServing: execute(ServingUpdate, ({ id, quantity }) =>
        query((_) =>
          _.update(servingTable)
            .set({ quantity })
            .where(eq(servingTable.id, id))
        )
      ),

      updatePlan: execute(_PlanUpdate.WithValidation, ({ id, ...values }) =>
        query((_) =>
          _.update(planTable).set(values).where(eq(planTable.id, id))
        )
      ),

      updateFood: execute(FoodUpdate, ({ id, ...values }) =>
        query((_) =>
          _.update(foodTable).set(values).where(eq(foodTable.id, id))
        )
      ),

      updateCurrentPlan: execute(Schema.Number, (id) =>
        Effect.all(
          [
            query((_) =>
              _.update(planTable)
                .set({ isCurrent: false })
                .where(
                  and(not(eq(planTable.id, id)), eq(planTable.isCurrent, true))
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
      ),

      updateDailyLog: execute(DailyLogUpdate, ({ date, ...values }) =>
        query((_) =>
          _.update(dailyLogTable)
            .set(values)
            .where(eq(dailyLogTable.date, DailyLogSelect.formatDate(date)))
        )
      ),

      removeServing: execute(ServingRemove, ({ id }) =>
        query((_) => _.delete(servingTable).where(eq(servingTable.id, id)))
      ),

      removePlan: execute(PlanRemove, ({ id }) =>
        query((_) => _.delete(planTable).where(eq(planTable.id, id)))
      ),

      createSystem: query((_) =>
        _.insert(systemTable).values({ version: 0 }).returning()
      ).pipe(
        singleResult(() => new WriteApiError({ cause: "System not created" }))
      ),

      updateSystemVersion: execute(Schema.Positive, (version) =>
        // Single row or multiple?
        query((_) => _.update(systemTable).set({ version }))
      ),
    };
  }),
  dependencies: [Pglite.Default],
}) {}
