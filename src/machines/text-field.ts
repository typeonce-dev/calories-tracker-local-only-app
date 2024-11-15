import { Match } from "effect";
import { fromTransition } from "xstate";

interface Context {
  value: string;
}

type Event =
  | { type: "update"; value: string }
  | { type: "reset"; value?: string };

export const textFieldMachine = fromTransition(
  (state: Context, event: Event): Context => ({
    ...state,
    ...(Match.value(event).pipe(
      Match.when({ type: "update" }, (event) => ({ value: event.value })),
      Match.when({ type: "reset" }, (event) => ({ value: event.value ?? "" })),
      Match.exhaustive
    ) satisfies Partial<Context>),
  }),
  ({ input }: { input?: { initialValue?: string } }) => ({
    value: input?.initialValue ?? "",
  })
);
