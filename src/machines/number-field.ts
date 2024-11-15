import { Match } from "effect";
import { fromTransition } from "xstate";

interface Context {
  value: number;
}

type Event =
  | { type: "update"; value: number }
  | { type: "reset"; value?: number };

export const numberFieldMachine = fromTransition(
  (state: Context, event: Event): Context => ({
    ...state,
    ...(Match.value(event).pipe(
      Match.when({ type: "update" }, (event) => ({ value: event.value })),
      Match.when({ type: "reset" }, (event) => ({ value: event.value ?? 0 })),
      Match.exhaustive
    ) satisfies Partial<Context>),
  }),
  ({ input }: { input?: { initialValue?: number } }) => ({
    value: input?.initialValue ?? 0,
  })
);
