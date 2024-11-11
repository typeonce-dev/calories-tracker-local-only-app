import { Effect, Schema } from "effect";
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate";
import { Food } from "~/schema/food";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";
import { numberFieldMachine } from "./number-field";
import { textFieldMachine } from "./text-field";

interface Context {
  name: ActorRefFrom<typeof textFieldMachine>;
  brand: ActorRefFrom<typeof textFieldMachine>;
  calories: ActorRefFrom<typeof numberFieldMachine>;
  fats: ActorRefFrom<typeof numberFieldMachine>;
  carbohydrates: ActorRefFrom<typeof numberFieldMachine>;
  proteins: ActorRefFrom<typeof numberFieldMachine>;
  fatsSaturated: ActorRefFrom<typeof numberFieldMachine>;
  salt: ActorRefFrom<typeof numberFieldMachine>;
  fibers: ActorRefFrom<typeof numberFieldMachine>;
  sugars: ActorRefFrom<typeof numberFieldMachine>;
  submitError: string | null;
}

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "food.create" },
  },
  actors: {
    createFood: fromPromise(({ input }: { input: Context }) =>
      RuntimeClient.runPromise(
        Effect.gen(function* () {
          const api = yield* WriteApi;

          const params = {
            name: input.name.getSnapshot().context.value,
            brand: input.brand.getSnapshot().context.value,
            calories: input.calories.getSnapshot().context.value,
            carbohydrates: input.carbohydrates.getSnapshot().context.value,
            fats: input.fats.getSnapshot().context.value,
            fatsSaturated: input.fatsSaturated.getSnapshot().context.value,
            proteins: input.proteins.getSnapshot().context.value,
            salt: input.salt.getSnapshot().context.value,
            fibers: input.fibers.getSnapshot().context.value,
            sugars: input.sugars.getSnapshot().context.value,
          } satisfies Food;

          const food = yield* Schema.decode(Food)(params).pipe(
            Effect.mapError((error) => error.message)
          );

          yield* Effect.log(food);

          yield* api
            .createFood(food)
            .pipe(Effect.mapError((error) => error.message));
        }).pipe(Effect.tapError(Effect.logError))
      )
    ),
  },
}).createMachine({
  id: "create-food",
  context: ({ spawn }) => ({
    submitError: null,
    name: spawn(textFieldMachine),
    brand: spawn(textFieldMachine),
    calories: spawn(numberFieldMachine),
    fats: spawn(numberFieldMachine),
    carbohydrates: spawn(numberFieldMachine),
    proteins: spawn(numberFieldMachine),
    fatsSaturated: spawn(numberFieldMachine),
    salt: spawn(numberFieldMachine),
    fibers: spawn(numberFieldMachine),
    sugars: spawn(numberFieldMachine),
  }),
  initial: "Editing",
  states: {
    Editing: {
      on: {
        "food.create": {
          target: "Creating",
          actions: assign({ submitError: null }),
        },
      },
    },
    Creating: {
      invoke: {
        src: "createFood",
        input: ({ context }) => context,
        onError: {
          target: "Editing",
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
