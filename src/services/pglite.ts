import * as _PGlite from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { and, eq, not } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { Config, Data, DateTime, Effect, flow, Schema } from "effect";
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
} from "~/schema/drizzle";
import { FoodInsert, FoodUpdate } from "~/schema/food";
import { _PlanInsert, _PlanUpdate, PlanRemove } from "~/schema/plan";
import { ServingInsert, ServingRemove, ServingUpdate } from "~/schema/serving";
import { singleResult } from "~/utils";

class PgliteError extends Data.TaggedError("PgliteError")<{
  cause: unknown;
}> {}

const execute = <A, I, T, E>(
  schema: Schema.Schema<A, I>,
  exec: (values: I) => Effect.Effect<T, E>
) =>
  flow(
    Schema.decode(schema),
    Effect.flatMap(Schema.encode(schema)),
    Effect.tap((encoded) => Effect.log("Insert", encoded)),
    Effect.mapError((error) => new PgliteError({ cause: error })),
    Effect.flatMap(exec)
  );

export class Pglite extends Effect.Service<Pglite>()("Pglite", {
  effect: Effect.gen(function* () {
    const indexDb = yield* Config.string("INDEX_DB");

    const client = yield* Effect.tryPromise({
      try: () =>
        _PGlite.PGlite.create(`idb://${indexDb}`, {
          extensions: { live },
        }),
      catch: (error) => new PgliteError({ cause: error }),
    });

    const orm = drizzle({ client });

    const query = <R>(execute: (_: typeof orm) => Promise<R>) =>
      Effect.tryPromise({
        try: () => execute(orm),
        catch: (error) => new PgliteError({ cause: error }),
      });

    return {
      client,
      orm,
      query,

      getCurrentDateLog: (date: string) =>
        query((_) =>
          _.select()
            .from(dailyLogTable)
            .where(eq(dailyLogTable.date, date))
            .limit(1)
        ).pipe(
          singleResult(() => new PgliteError({ cause: "No log found" })),
          Effect.flatMap(Schema.decode(DailyLogSelect))
        ),

      getCurrentPlan: query((_) =>
        _.select().from(planTable).where(eq(planTable.isCurrent, true)).limit(1)
      ).pipe(singleResult(() => new PgliteError({ cause: "No log found" }))),

      createDailyLog: flow(
        execute(DailyLogInsert, (values) =>
          query((_) => _.insert(dailyLogTable).values(values).returning())
        ),
        singleResult(() => new PgliteError({ cause: "Daily log not created" })),
        Effect.flatMap(Schema.decode(DailyLogSelect))
      ),

      createPlan: flow(
        execute(_PlanInsert.WithValidation, (values) =>
          query((_) =>
            _.insert(planTable).values(values).returning({ id: planTable.id })
          )
        ),
        singleResult(() => new PgliteError({ cause: "Plan not created" }))
      ),

      createServing: execute(ServingInsert, ({ dailyLogDate, ...values }) =>
        query((_) =>
          _.insert(servingTable).values({
            ...values,
            dailyLogDate: DateTime.formatIsoDateUtc(dailyLogDate),
          })
        )
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
    };
  }),
}) {}
