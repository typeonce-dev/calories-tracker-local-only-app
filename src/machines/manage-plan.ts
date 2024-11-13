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
    events: {} as { type: "plan.update"; id: number },
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
  },
}).createMachine({
  id: "manage-serving",
  context: ({ spawn, input }) => {
    const machineCalories = spawn(numberFieldMachine);
    const machineFatsRatio = spawn(numberFieldMachine);
    const machineCarbohydratesRatio = spawn(numberFieldMachine);
    const machineProteinsRatio = spawn(numberFieldMachine);

    machineCalories.send({ type: "update", value: input.calories });
    machineFatsRatio.send({ type: "update", value: input.fatsRatio });
    machineCarbohydratesRatio.send({
      type: "update",
      value: input.carbohydratesRatio,
    });
    machineProteinsRatio.send({ type: "update", value: input.proteinsRatio });
    return {
      calories: machineCalories,
      carbohydratesRatio: machineCarbohydratesRatio,
      fatsRatio: machineFatsRatio,
      proteinsRatio: machineProteinsRatio,
    };
  },
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "plan.update": {
          target: "Updating",
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
  },
});