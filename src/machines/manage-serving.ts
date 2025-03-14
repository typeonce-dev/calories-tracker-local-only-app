import { Effect } from "effect";
import { assertEvent, fromPromise, setup, type ActorRefFrom } from "xstate";
import { Pglite } from "~/services/pglite";
import { RuntimeClient } from "~/services/runtime-client";
import { numberFieldActor } from "./number-field";

export const machine = setup({
  types: {
    input: {} as { quantity: number | undefined },
    context: {} as {
      quantity: ActorRefFrom<typeof numberFieldActor>;
    },
    events: {} as
      | { type: "serving.update"; id: number }
      | { type: "serving.remove"; id: number },
  },
  actors: {
    updateServing: fromPromise(
      ({ input }: { input: { id: number; quantity: number } }) =>
        RuntimeClient.runPromise(
          Effect.gen(function* () {
            const api = yield* Pglite;
            yield* api.updateServing({
              id: input.id,
              quantity: input.quantity,
            });
          })
        )
    ),
    removeServing: fromPromise(({ input }: { input: { id: number } }) =>
      RuntimeClient.runPromise(
        Effect.gen(function* () {
          const api = yield* Pglite;
          yield* api.removeServing({ id: input.id });
        })
      )
    ),
  },
}).createMachine({
  id: "manage-serving",
  context: ({ spawn, input }) => ({
    quantity: spawn(numberFieldActor, {
      input: { initialValue: input.quantity },
    }),
  }),
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "serving.update": {
          target: "Updating",
        },
        "serving.remove": {
          target: "Removing",
        },
      },
    },
    Updating: {
      invoke: {
        src: "updateServing",
        input: ({ event, context }) => {
          assertEvent(event, "serving.update");
          return {
            id: event.id,
            quantity: context.quantity.getSnapshot().context.value,
          };
        },
        onError: { target: "Idle" },
        onDone: { target: "Idle" },
      },
    },
    Removing: {
      invoke: {
        src: "removeServing",
        input: ({ event }) => {
          assertEvent(event, "serving.remove");
          return { id: event.id };
        },
        onError: { target: "Idle" },
        onDone: { target: "Done" },
      },
    },
    Done: { type: "final" },
  },
});
