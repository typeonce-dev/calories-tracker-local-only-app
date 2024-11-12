import type { redirect } from "@tanstack/react-router";
import { clsx, type ClassValue } from "clsx";
import { Array, Data, Effect, Either, flow, pipe, Schema } from "effect";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validate = <A, I>(schema: Schema.Schema<A, I>) =>
  flow(
    Schema.decodeEither(schema),
    Either.flip,
    Either.map((error) => error.message),
    Either.getOrNull
  );

export class RedirectLoaderError extends Data.TaggedError(
  "RedirectLoaderError"
)<Parameters<typeof redirect>[0]> {}

export const singleResult = <A, E>(orFail: () => E) =>
  Effect.flatMap((results: A[]) =>
    pipe(results, Array.head, Effect.mapError(orFail))
  );
