import { Effect } from "effect";
import { assign, fromPromise, setup } from "xstate";
import { Profile } from "~/services/profile";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";

export const machine = setup({
  types: {
    context: {} as {
      calories: number;
      fatsRatio: number;
      carbohydratesRatio: number;
      proteinsRatio: number;
      submitError: string | null;
    },
    events: {} as
      | { type: "calories.update"; value: number }
      | { type: "ratio.fats.update"; value: number }
      | { type: "ratio.carbohydrates.update"; value: number }
      | { type: "ratio.proteins.update"; value: number }
      | { type: "plan.create" },
  },
  guards: {
    canCreatePlan: ({ context }) =>
      context.carbohydratesRatio + context.fatsRatio + context.proteinsRatio ===
      100,
  },
  actors: {
    createPlan: fromPromise(
      ({
        input,
      }: {
        input: {
          calories: number;
          fatsRatio: number;
          carbohydratesRatio: number;
          proteinsRatio: number;
        };
      }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* WriteApi;
            const profile = yield* Profile;

            const { id } = yield* api.createPlan(input);
            yield* profile.setCurrentPlanId(id);
          })
        )
    ),
  },
}).createMachine({
  id: "create-plan",
  context: {
    calories: 2000,
    fatsRatio: 20,
    carbohydratesRatio: 40,
    proteinsRatio: 40,
    submitError: null,
  },
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "calories.update": {
          actions: assign(({ event }) => ({ calories: event.value })),
        },
        "ratio.fats.update": {
          actions: assign(({ event }) => ({ fatsRatio: event.value })),
        },
        "ratio.carbohydrates.update": {
          actions: assign(({ event }) => ({ carbohydratesRatio: event.value })),
        },
        "ratio.proteins.update": {
          actions: assign(({ event }) => ({ proteinsRatio: event.value })),
        },
        "plan.create": {
          target: "CreatingPlan",
          guard: "canCreatePlan",
          actions: assign({ submitError: null }),
        },
      },
    },
    CreatingPlan: {
      invoke: {
        src: "createPlan",
        input: ({ context }) => ({
          calories: context.calories,
          fatsRatio: context.fatsRatio,
          carbohydratesRatio: context.carbohydratesRatio,
          proteinsRatio: context.proteinsRatio,
        }),
        onError: {
          target: "Idle",
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
    Created: { after: { 5000: "Idle" } },
  },
});
