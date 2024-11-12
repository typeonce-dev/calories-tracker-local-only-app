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
