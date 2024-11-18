import { Schema } from "effect";
import {
  EmptyQuantityAsUndefined,
  EmptyStringAsUndefined,
  FloatQuantityNonNegative,
  PrimaryKeyIndex,
} from "./shared";

export class FoodInsert extends Schema.Class<FoodInsert>("FoodInsert")({
  name: Schema.NonEmptyString,
  brand: EmptyStringAsUndefined,
  calories: FloatQuantityNonNegative,
  carbohydrates: FloatQuantityNonNegative,
  proteins: FloatQuantityNonNegative,
  fats: FloatQuantityNonNegative,
  fatsSaturated: EmptyQuantityAsUndefined,
  salt: EmptyQuantityAsUndefined,
  fibers: EmptyQuantityAsUndefined,
  sugars: EmptyQuantityAsUndefined,
}) {}

export class FoodUpdate extends Schema.Class<FoodUpdate>("FoodUpdate")({
  id: PrimaryKeyIndex,
  name: Schema.NonEmptyString,
  brand: EmptyStringAsUndefined,
  calories: FloatQuantityNonNegative,
  carbohydrates: FloatQuantityNonNegative,
  proteins: FloatQuantityNonNegative,
  fats: FloatQuantityNonNegative,
  fatsSaturated: EmptyQuantityAsUndefined,
  salt: EmptyQuantityAsUndefined,
  fibers: EmptyQuantityAsUndefined,
  sugars: EmptyQuantityAsUndefined,
}) {}

export class FoodSelect extends Schema.Class<FoodSelect>("FoodSelect")({
  id: PrimaryKeyIndex,
  name: Schema.NonEmptyString,
  brand: Schema.NullOr(Schema.NonEmptyString),
  calories: FloatQuantityNonNegative,
  carbohydrates: FloatQuantityNonNegative,
  proteins: FloatQuantityNonNegative,
  fats: FloatQuantityNonNegative,
  fatsSaturated: EmptyQuantityAsUndefined,
  salt: EmptyQuantityAsUndefined,
  fibers: EmptyQuantityAsUndefined,
  sugars: EmptyQuantityAsUndefined,
}) {}
