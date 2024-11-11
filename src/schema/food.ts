import { Schema } from "effect";

export class Food extends Schema.Class<Food>("Food")({
  name: Schema.NonEmptyString,
  brand: Schema.String,
  calories: Schema.NonNegative,
  fats: Schema.NonNegative,
  fatsSaturated: Schema.NonNegative,
  salt: Schema.NonNegative,
  carbohydrates: Schema.NonNegative,
  fibers: Schema.NonNegative,
  sugars: Schema.NonNegative,
  proteins: Schema.NonNegative,
}) {}
