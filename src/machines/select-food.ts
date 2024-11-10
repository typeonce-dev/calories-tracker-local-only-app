import { Effect } from "effect";
import { assertEvent, assign, fromPromise, setup } from "xstate";
import type { Meal } from "~/schema/shared";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";

export const machine = setup({
  types: {
    context: {} as {
      foodId: number | null;
      quantity: number | null;
    },
    events: {} as
      | { type: "food.select"; id: number }
      | { type: "quantity.update"; value: number }
      | {
          type: "quantity.confirm";
          meal: typeof Meal.Type;
          dailyLogDate: string;
        },
  },
  guards: {
    isNotSelected: ({ context }) => context.foodId === null,
    isValidQuantity: ({ context }) =>
      context.quantity !== null && context.quantity > 0,
  },
  actors: {
    createServing: fromPromise(
      ({
        input,
      }: {
        input: {
          foodId: number;
          quantity: number;
          meal: typeof Meal.Type;
          dailyLogDate: string;
        };
      }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* WriteApi;
            yield* api.createServing(input);
          })
        )
    ),
  },
}).createMachine({
  id: "select-food",
  context: { foodId: null, quantity: null },
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
        guard: "isNotSelected",
      },
      on: {
        "quantity.update": {
          actions: assign(({ event }) => ({ quantity: event.value })),
        },
        "quantity.confirm": {
          target: "Creating",
          guard: "isValidQuantity",
        },
      },
    },
    Creating: {
      invoke: {
        src: "createServing",
        input: ({ context, event }) => {
          assertEvent(event, "quantity.confirm");
          // TODO: Avoid null assertion
          return {
            foodId: context.foodId!,
            quantity: context.quantity!,
            meal: event.meal,
            dailyLogDate: event.dailyLogDate,
          };
        },
        onError: { target: "Selected" },
        onDone: { target: "Created" },
      },
    },
    Created: { type: "final" },
  },
});
