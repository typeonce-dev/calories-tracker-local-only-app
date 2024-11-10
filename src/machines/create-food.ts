import { Effect } from "effect";
import { assign, fromPromise, setup } from "xstate";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";

interface Context {
  name: string;
  brand: string | undefined;
  calories: number;
  fats: number;
  carbohydrates: number;
  proteins: number;
  fatsSaturated: number | undefined;
  salt: number | undefined;
  fibers: number | undefined;
  sugars: number | undefined;
}

export type ContextKey = keyof Omit<Context, "name" | "brand">;

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as
      | { type: "name.update"; name: string }
      | { type: "brand.update"; brand: string }
      | {
          type: "quantity.update";
          value: number;
          contextKey: ContextKey;
        }
      | { type: "food.create" },
  },
  guards: {
    isValidQuantities: ({ context }) =>
      context.calories > 0 &&
      context.fats > 0 &&
      context.carbohydrates > 0 &&
      context.proteins > 0,
  },
  actors: {
    createFood: fromPromise(({ input }: { input: Context }) =>
      RuntimeClient.runPromise(
        Effect.gen(function* () {
          const api = yield* WriteApi;
          yield* api.createFood(input);
        })
      )
    ),
  },
}).createMachine({
  id: "create-food",
  context: {
    name: "",
    brand: undefined,
    calories: 0,
    fats: 0,
    carbohydrates: 0,
    proteins: 0,
    fatsSaturated: undefined,
    salt: undefined,
    fibers: undefined,
    sugars: undefined,
  },
  initial: "Editing",
  states: {
    Editing: {
      on: {
        "brand.update": {
          actions: assign(({ event }) => ({ brand: event.brand })),
        },
        "name.update": {
          actions: assign(({ event }) => ({ name: event.name })),
        },
        "quantity.update": {
          actions: assign(({ event }) => ({ [event.contextKey]: event.value })),
        },
        "food.create": {
          target: "Creating",
          guard: "isValidQuantities",
        },
      },
    },
    Creating: {
      invoke: {
        src: "createFood",
        input: ({ context }) => context,
        onError: { target: "Editing" },
        onDone: { target: "Created" },
      },
    },
    Created: { type: "final" },
  },
});
