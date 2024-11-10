import type { redirect } from "@tanstack/react-router";
import { Array, Data, Effect, pipe } from "effect";

export class RedirectLoaderError extends Data.TaggedError(
  "RedirectLoaderError"
)<Parameters<typeof redirect>[0]> {}

export const singleResult = <A, E>(orFail: () => E) =>
  Effect.flatMap((results: A[]) =>
    pipe(results, Array.head, Effect.mapError(orFail))
  );
