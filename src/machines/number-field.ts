import { Match } from "effect";
import { fromTransition } from "xstate";

interface Context {
  value: number;
}

type Event =
  | { type: "update"; value: number }
  | { type: "reset"; value?: number };

export const numberFieldMachine = fromTransition(
  (_: Context, event: Event): Context =>
    Match.value(event).pipe(
      Match.when({ type: "update" }, (event) => ({
        value: Number.isNaN(event.value) ? 0 : event.value * 10,
      })),
      Match.when({ type: "reset" }, (event) => ({
        value: event.value ?? 0,
      })),
      Match.exhaustive
    ),
  ({ input }: { input?: { initialValue?: number } }) => ({
    value: input?.initialValue !== undefined ? input.initialValue * 10 : 0,
  })
);
