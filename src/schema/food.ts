import { Schema } from "effect";
import { EmptyQuantityAsUndefined, EmptyStringAsUndefined } from "./shared";

export class Food extends Schema.Class<Food>("Food")({
  name: Schema.NonEmptyString,
  brand: EmptyStringAsUndefined,
  calories: Schema.NonNegative,
  carbohydrates: Schema.NonNegative,
  proteins: Schema.NonNegative,
  fats: Schema.NonNegative,
  fatsSaturated: EmptyQuantityAsUndefined,
  salt: EmptyQuantityAsUndefined,
  fibers: EmptyQuantityAsUndefined,
  sugars: EmptyQuantityAsUndefined,
}) {}
