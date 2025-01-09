import { Effect } from "effect";
import { assertEvent, assign, fromPromise, setup } from "xstate";
import type { DailyLogSelect } from "~/schema/daily-log";
import { Pglite } from "~/services/pglite";
import { RuntimeClient } from "~/services/runtime-client";

export const machine = setup({
  types: {
    context: {} as {
      selectedPlanId: number | null;
    },
    events: {} as
      | { type: "plan.select"; planId: number }
      | {
          type: "log.update";
          date: typeof DailyLogSelect.fields.date.Type;
        },
  },
  guards: {
    isSelected: ({ context }) => context.selectedPlanId !== null,
  },
  actors: {
    updateDailyLog: fromPromise(
      ({
        input: { planId, ...input },
      }: {
        input: {
          planId: number | null;
          date: typeof DailyLogSelect.fields.date.Type;
        };
      }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* Pglite;
            yield* Effect.log(input);

            if (planId === null) {
              return yield* Effect.fail("No plan selected");
            }

            yield* api.updateDailyLog({ planId, ...input });
          }).pipe(Effect.tapErrorCause(Effect.logError))
        )
    ),
  },
}).createMachine({
  id: "manage-daily-log",
  context: { selectedPlanId: null },
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "plan.select": {
          actions: assign(({ event }) => ({ selectedPlanId: event.planId })),
        },
        "log.update": {
          target: "Updating",
          guard: "isSelected",
        },
      },
    },
    Updating: {
      invoke: {
        src: "updateDailyLog",
        input: ({ event, context }) => {
          assertEvent(event, "log.update");
          return { planId: context.selectedPlanId, date: event.date };
        },
        onError: { target: "Idle" },
        onDone: { target: "Idle" },
      },
    },
  },
});
