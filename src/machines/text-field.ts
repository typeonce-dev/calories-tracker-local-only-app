import { Match } from "effect";
import { fromTransition } from "xstate";

interface Context {
  value: string;
}

type Event =
  | { type: "update"; value: string }
  | { type: "reset"; value?: string };

export const textFieldActor = fromTransition(
  (_: Context, event: Event): Context =>
    Match.value(event).pipe(
      Match.when({ type: "update" }, (event) => ({ value: event.value })),
      Match.when({ type: "reset" }, (event) => ({ value: event.value ?? "" })),
      Match.exhaustive
    ),
  ({ input }: { input?: { initialValue?: string } }) => ({
    value: input?.initialValue ?? "",
  })
);
