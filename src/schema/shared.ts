import { Schema } from "effect";

const FloatQuantityInsert = Schema.Number.pipe(
  Schema.transform(Schema.Number, {
    decode: (value) => value / 10,
    encode: (value) => value * 10,
  })
);

export const Meal = Schema.Literal("breakfast", "lunch", "dinner", "snacks");

const FloatQuantityNonNegativeType = Symbol("@@FloatQuantityNonNegative");
export const FloatQuantityNonNegative = FloatQuantityInsert.pipe(
  Schema.nonNegative(),
  Schema.brand(FloatQuantityNonNegativeType)
);

const FloatQuantityPositiveType = Symbol("@@FloatQuantityPositive");
export const FloatQuantityPositive = FloatQuantityInsert.pipe(
  Schema.positive(),
  Schema.brand(FloatQuantityPositiveType)
);

const PrimaryKeyIndexType = Symbol("@@PrimaryKeyIndex");
export const PrimaryKeyIndex = Schema.NonNegative.pipe(
  Schema.brand(PrimaryKeyIndexType)
);

export const EmptyStringAsUndefined = Schema.String.pipe(
  Schema.transform(Schema.UndefinedOr(Schema.String), {
    decode: (value) => (value.trim().length === 0 ? undefined : value),
    encode: (value) => (value === undefined ? "" : value),
  })
);

export const EmptyQuantityAsUndefined = FloatQuantityNonNegative.pipe(
  Schema.transform(Schema.UndefinedOr(FloatQuantityNonNegative), {
    decode: (value) => (value === 0 ? undefined : value),
    encode: (value) =>
      FloatQuantityNonNegative.make(value === undefined ? 0 : value),
  })
);
