import { Console, Effect } from "effect";
import {
  assertEvent,
  assign,
  fromPromise,
  setup,
  type ActorRefFrom,
} from "xstate";
import type { foodTable } from "~/schema/drizzle";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";
import { numberFieldMachine } from "./number-field";
import { optionalNumberFieldMachine } from "./optional-number-field";
import { textFieldMachine } from "./text-field";

interface Context {
  name: ActorRefFrom<typeof textFieldMachine>;
  brand: ActorRefFrom<typeof textFieldMachine>;
  calories: ActorRefFrom<typeof numberFieldMachine>;
  fats: ActorRefFrom<typeof numberFieldMachine>;
  carbohydrates: ActorRefFrom<typeof numberFieldMachine>;
  proteins: ActorRefFrom<typeof numberFieldMachine>;
  fatsSaturated: ActorRefFrom<typeof optionalNumberFieldMachine>;
  salt: ActorRefFrom<typeof optionalNumberFieldMachine>;
  fibers: ActorRefFrom<typeof optionalNumberFieldMachine>;
  sugars: ActorRefFrom<typeof optionalNumberFieldMachine>;
  submitError: string | null;
}

export const machine = setup({
  types: {
    input: {} as Partial<typeof foodTable.$inferSelect>,
    context: {} as Context,
    events: {} as { type: "food.create" } | { type: "food.update"; id: number },
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
          };

          yield* Effect.log(params);

          yield* api.createFood(params).pipe(
            Effect.tapError(Console.log),
            Effect.mapError((error) => error.message)
          );
        })
      )
    ),
    updateFood: fromPromise(
      ({ input: { id, ...input } }: { input: Context & { id: number } }) =>
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
            };

            yield* Effect.log(params);

            yield* api
              .updateFood({ id, ...params })
              .pipe(Effect.mapError((error) => error.message));
          }).pipe(Effect.tapError(Effect.logError))
        )
    ),
  },
}).createMachine({
  id: "create-food",
  context: ({ spawn, input }) => ({
    submitError: null,
    name: spawn(textFieldMachine, { input: { initialValue: input?.name } }),
    brand: spawn(textFieldMachine, {
      input: { initialValue: input?.brand ?? undefined },
    }),
    calories: spawn(numberFieldMachine, {
      input: { initialValue: input?.calories },
    }),
    fats: spawn(numberFieldMachine, { input: { initialValue: input?.fats } }),
    carbohydrates: spawn(numberFieldMachine, {
      input: { initialValue: input?.carbohydrates },
    }),
    proteins: spawn(numberFieldMachine, {
      input: { initialValue: input?.proteins },
    }),
    fatsSaturated: spawn(optionalNumberFieldMachine, {
      input: { initialValue: input?.fatsSaturated },
    }),
    salt: spawn(optionalNumberFieldMachine, {
      input: { initialValue: input?.salt },
    }),
    fibers: spawn(optionalNumberFieldMachine, {
      input: { initialValue: input?.fibers },
    }),
    sugars: spawn(optionalNumberFieldMachine, {
      input: { initialValue: input?.sugars },
    }),
  }),
  initial: "Editing",
  states: {
    Editing: {
      on: {
        "food.update": {
          target: "Updating",
          actions: assign({ submitError: null }),
        },
        "food.create": {
          target: "Creating",
          actions: assign({ submitError: null }),
        },
      },
    },
    Updating: {
      invoke: {
        src: "updateFood",
        input: ({ context, event }) => {
          assertEvent(event, "food.update");
          return { id: event.id, ...context };
        },
        onError: {
          target: "Editing",
          actions: assign(({ event }) => ({
            submitError:
              event.error instanceof Error
                ? event.error.message
                : "Unknown error",
          })),
        },
        onDone: { target: "Editing" },
      },
    },
    Creating: {
      invoke: {
        src: "createFood",
        input: ({ context, event }) => {
          assertEvent(event, "food.create");
          return context;
        },
        onError: {
          target: "Editing",
          actions: assign(({ event }) => ({
            submitError:
              event.error instanceof Error
                ? event.error.message
                : "Unknown error",
          })),
        },
        onDone: {
          target: "Editing",
          actions: ({ context }) => {
            context.name.send({ type: "reset" });
            context.brand.send({ type: "reset" });
            context.calories.send({ type: "reset" });
            context.fats.send({ type: "reset" });
            context.carbohydrates.send({ type: "reset" });
            context.proteins.send({ type: "reset" });
            context.fatsSaturated.send({ type: "reset" });
            context.salt.send({ type: "reset" });
            context.fibers.send({ type: "reset" });
            context.sugars.send({ type: "reset" });
          },
        },
      },
    },
  },
});
