import { Effect } from "effect";
import { assertEvent, fromPromise, setup, type ActorRefFrom } from "xstate";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";
import { numberFieldMachine } from "./number-field";

export const machine = setup({
  types: {
    input: {} as {
      calories: number;
      fatsRatio: number;
      carbohydratesRatio: number;
      proteinsRatio: number;
    },
    context: {} as {
      calories: ActorRefFrom<typeof numberFieldMachine>;
      fatsRatio: ActorRefFrom<typeof numberFieldMachine>;
      carbohydratesRatio: ActorRefFrom<typeof numberFieldMachine>;
      proteinsRatio: ActorRefFrom<typeof numberFieldMachine>;
    },
    events: {} as
      | { type: "plan.update"; id: number }
      | { type: "plan.remove"; id: number },
  },
  actors: {
    updatePlan: fromPromise(
      ({
        input,
      }: {
        input: {
          id: number;
          calories: number;
          fatsRatio: number;
          carbohydratesRatio: number;
          proteinsRatio: number;
        };
      }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* WriteApi;
            yield* Effect.log(input);
            yield* api.updatePlan(input);
          }).pipe(Effect.tapErrorCause(Effect.logError))
        )
    ),
    removePlan: fromPromise(({ input }: { input: { id: number } }) =>
      RuntimeClient.runPromise(
        Effect.gen(function* () {
          const api = yield* WriteApi;
          yield* Effect.log(input);
          yield* api.removePlan(input);
        }).pipe(Effect.tapErrorCause(Effect.logError))
      )
    ),
  },
}).createMachine({
  id: "manage-serving",
  context: ({ spawn, input }) => ({
    calories: spawn(numberFieldMachine, {
      input: { initialValue: input.calories },
    }),
    carbohydratesRatio: spawn(numberFieldMachine, {
      input: { initialValue: input.carbohydratesRatio },
    }),
    fatsRatio: spawn(numberFieldMachine, {
      input: { initialValue: input.fatsRatio },
    }),
    proteinsRatio: spawn(numberFieldMachine, {
      input: { initialValue: input.proteinsRatio },
    }),
  }),
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "plan.update": {
          target: "Updating",
        },
        "plan.remove": {
          target: "Removing",
        },
      },
    },
    Updating: {
      invoke: {
        src: "updatePlan",
        input: ({ event, context }) => {
          assertEvent(event, "plan.update");
          return {
            id: event.id,
            calories: context.calories.getSnapshot().context.value,
            fatsRatio: context.fatsRatio.getSnapshot().context.value,
            carbohydratesRatio:
              context.carbohydratesRatio.getSnapshot().context.value,
            proteinsRatio: context.proteinsRatio.getSnapshot().context.value,
          };
        },
        onError: { target: "Idle" },
        onDone: { target: "Idle" },
      },
    },
    Removing: {
      invoke: {
        src: "removePlan",
        input: ({ event }) => {
          assertEvent(event, "plan.remove");
          return { id: event.id };
        },
        onError: { target: "Idle" },
        onDone: { target: "Idle" },
      },
    },
  },
});
