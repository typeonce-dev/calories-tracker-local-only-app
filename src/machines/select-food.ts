import { Effect, Option } from "effect";
import {
  assertEvent,
  assign,
  fromPromise,
  setup,
  type ActorRefFrom,
} from "xstate";
import { DailyLogSelect } from "~/schema/daily-log";
import type { Meal } from "~/schema/shared";
import { ReadApi } from "~/services/read-api";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";
import { numberFieldMachine } from "./number-field";

interface Context {
  submitError: string | null;
  foodId: number | null;
  quantity: ActorRefFrom<typeof numberFieldMachine>;
}

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as
      | { type: "food.select"; id: number }
      | {
          type: "quantity.confirm";
          meal: typeof Meal.Type;
          dailyLogDate: typeof DailyLogSelect.fields.date.Type;
        },
  },
  actors: {
    createServing: fromPromise(
      ({
        input: { foodId, quantity, dailyLogDate, ...input },
      }: {
        input: {
          foodId: Context["foodId"];
          quantity: Context["quantity"];
          meal: typeof Meal.Type;
          dailyLogDate: typeof DailyLogSelect.fields.date.Type;
        };
      }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const readApi = yield* ReadApi;
            const api = yield* WriteApi;

            if (foodId === null) {
              return yield* Effect.fail("Food not selected");
            }

            return yield* readApi.getCurrentDateLog(dailyLogDate).pipe(
              Effect.catchTag("ReadApiError", () =>
                Effect.gen(function* () {
                  const planOption = yield* readApi.getCurrentPlan.pipe(
                    Effect.option
                  );
                  if (Option.isNone(planOption)) {
                    return yield* Effect.fail("No plan selected");
                  }

                  yield* Effect.log("Creating new daily log");

                  return yield* api.createDailyLog({
                    date: dailyLogDate,
                    planId: planOption.value.id,
                  });
                })
              ),
              Effect.flatMap((dailyLog) =>
                api.createServing({
                  foodId,
                  quantity: quantity.getSnapshot().context.value,
                  dailyLogDate: DailyLogSelect.formatDate(dailyLog.date),
                  ...input,
                })
              )
            );
          })
        )
    ),
  },
}).createMachine({
  id: "select-food",
  context: ({ spawn }) => ({
    submitError: null,
    foodId: null,
    quantity: spawn(numberFieldMachine),
  }),
  initial: "Unselected",
  states: {
    Unselected: {
      on: {
        "food.select": {
          target: "Selected",
          actions: assign(({ event }) => ({ foodId: event.id })),
        },
      },
    },
    Selected: {
      always: {
        target: "Unselected",
        guard: ({ context }) => context.foodId === null,
      },
      on: {
        "quantity.confirm": {
          target: "Creating",
          actions: assign({ submitError: null }),
        },
      },
    },
    Creating: {
      invoke: {
        src: "createServing",
        input: ({ context, event }) => {
          assertEvent(event, "quantity.confirm");
          return {
            foodId: context.foodId,
            quantity: context.quantity,
            meal: event.meal,
            dailyLogDate: event.dailyLogDate,
          };
        },
        onError: {
          target: "Selected",
          actions: assign(({ event }) => ({
            submitError:
              event.error instanceof Error
                ? event.error.message
                : "Unknown error",
          })),
        },
        onDone: { target: "Created" },
      },
    },
    Created: { type: "final" },
  },
});
