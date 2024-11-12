import { Either, Schema } from "effect";

const DailyLogDateType = Symbol.for("@@DailyLogDate");
export const DailyLogDate = Schema.NonEmptyString.pipe(
  Schema.filter((str, options) =>
    Schema.decodeEither(Schema.DateFromString)(str, options).pipe(
      Either.flip,
      Either.map((error) => error.issue),
      Either.getOrUndefined
    )
  ),
  Schema.brand(DailyLogDateType)
);

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
