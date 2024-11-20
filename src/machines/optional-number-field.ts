import { Match } from "effect";
import { fromTransition } from "xstate";

interface Context {
  value: number | undefined;
}

type Event =
  | { type: "update"; value: number }
  | { type: "reset"; value?: number };

export const optionalNumberFieldMachine = fromTransition(
  (_: Context, event: Event): Context =>
    Match.value(event).pipe(
      Match.when({ type: "update" }, (event) => ({
        value:
          Number.isNaN(event.value) || event.value === 0
            ? undefined
            : event.value * 10,
      })),
      Match.when({ type: "reset" }, (event) => ({
        value: event.value ?? 0,
      })),
      Match.exhaustive
    ),
  ({ input }: { input?: { initialValue?: number } }) => ({
    value: input?.initialValue,
  })
);