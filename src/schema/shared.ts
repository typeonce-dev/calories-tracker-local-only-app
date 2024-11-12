import { Schema } from "effect";

export const Meal = Schema.Literal("breakfast", "lunch", "dinner", "snacks");

export const EmptyStringAsUndefined = Schema.String.pipe(
  Schema.transform(Schema.UndefinedOr(Schema.String), {
    decode: (value) => (value.trim().length === 0 ? undefined : value),
    encode: (value) => (value === undefined ? "" : value),
  })
);

export const EmptyQuantityAsUndefined = Schema.NonNegative.pipe(
  Schema.transform(Schema.UndefinedOr(Schema.NonNegative), {
    decode: (value) => (value === 0 ? undefined : value),
    encode: (value) => (value === undefined ? 0 : value),
  })
);
