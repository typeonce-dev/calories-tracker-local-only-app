import { Effect } from "effect";
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate";
import { Pglite } from "~/services/pglite";
import { RuntimeClient } from "~/services/runtime-client";
import { numberFieldActor } from "./number-field";

interface Context {
  calories: ActorRefFrom<typeof numberFieldActor>;
  fatsRatio: ActorRefFrom<typeof numberFieldActor>;
  carbohydratesRatio: ActorRefFrom<typeof numberFieldActor>;
  proteinsRatio: ActorRefFrom<typeof numberFieldActor>;
  submitError: string | null;
}

export const machine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "plan.create" },
  },
  actors: {
    createPlan: fromPromise(
      ({ input }: { input: Omit<Context, "submitError"> }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* Pglite;

            const { id } = yield* api.createPlan({
              calories: input.calories.getSnapshot().context.value,
              fatsRatio: input.fatsRatio.getSnapshot().context.value,
              proteinsRatio: input.proteinsRatio.getSnapshot().context.value,
              carbohydratesRatio:
                input.carbohydratesRatio.getSnapshot().context.value,
            });
            yield* api.updateCurrentPlan(id);
          })
        )
    ),
  },
}).createMachine({
  id: "create-plan",
  context: ({ spawn }) => ({
    calories: spawn(numberFieldActor),
    fatsRatio: spawn(numberFieldActor),
    carbohydratesRatio: spawn(numberFieldActor),
    proteinsRatio: spawn(numberFieldActor),
    submitError: null,
  }),
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "plan.create": {
          target: "CreatingPlan",
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
