import { Effect } from "effect";
import {
  assertEvent,
  assign,
  fromPromise,
  setup,
  type ActorRefFrom,
} from "xstate";
import type { Meal } from "~/schema/shared";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";
import { numberFieldMachine } from "./number-field";

interface Context {
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
          dailyLogDate: string;
        },
  },
  actors: {
    createServing: fromPromise(
      ({
        input: { foodId, quantity, ...input },
      }: {
        input: Context & {
          meal: typeof Meal.Type;
          dailyLogDate: string;
        };
      }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* WriteApi;

            if (foodId === null) {
              return yield* Effect.fail("Food not selected");
            }

            yield* api.createServing({
              foodId,
              quantity: quantity.getSnapshot().context.value,
              ...input,
            });
          })
        )
    ),
  },
}).createMachine({
  id: "select-food",
  context: ({ spawn }) => ({
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
