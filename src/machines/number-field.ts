import { Match } from "effect";
import { fromTransition } from "xstate";

interface Context {
  value: number;
}

type Event = { type: "update"; value: number };

export const numberFieldMachine = fromTransition(
  (state: Context, event: Event): Context => ({
    ...state,
    ...(Match.value(event).pipe(
      Match.when({ type: "update" }, (event) => ({ value: event.value })),
      Match.exhaustive
    ) satisfies Partial<Context>),
  }),
  { value: 0 }
);
