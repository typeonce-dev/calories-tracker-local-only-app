import { Schema } from "effect";
import { EmptyQuantityAsUndefined, EmptyStringAsUndefined } from "./shared";

export class FoodInsert extends Schema.Class<FoodInsert>("FoodInsert")({
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

export class FoodUpdate extends Schema.Class<FoodUpdate>("FoodUpdate")({
  id: Schema.Number,
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
