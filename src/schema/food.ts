import { Schema } from "effect";
import {
  EmptyStringAsUndefined,
  FloatQuantityInsert,
  FloatQuantityInsertPositive,
  FloatQuantityOrUndefined,
  PrimaryKeyIndex,
} from "./shared";

export class FoodInsert extends Schema.Class<FoodInsert>("FoodInsert")({
  name: Schema.NonEmptyString,
  brand: EmptyStringAsUndefined,
  calories: FloatQuantityInsertPositive,
  carbohydrates: FloatQuantityInsert,
  proteins: FloatQuantityInsert,
  fats: FloatQuantityInsert,
  fatsSaturated: FloatQuantityOrUndefined,
  salt: FloatQuantityOrUndefined,
  fibers: FloatQuantityOrUndefined,
  sugars: FloatQuantityOrUndefined,
}) {}

export class FoodUpdate extends Schema.Class<FoodUpdate>("FoodUpdate")({
  id: PrimaryKeyIndex,
  name: Schema.NonEmptyString,
  brand: EmptyStringAsUndefined,
  calories: FloatQuantityInsert,
  carbohydrates: FloatQuantityInsert,
  proteins: FloatQuantityInsert,
  fats: FloatQuantityInsert,
  fatsSaturated: FloatQuantityOrUndefined,
  salt: FloatQuantityOrUndefined,
  fibers: FloatQuantityOrUndefined,
  sugars: FloatQuantityOrUndefined,
}) {}

export class FoodSelect extends Schema.Class<FoodSelect>("FoodSelect")({
  id: PrimaryKeyIndex,
  name: Schema.NonEmptyString,
  brand: Schema.NullOr(Schema.NonEmptyString),
  calories: FloatQuantityInsert,
  carbohydrates: FloatQuantityInsert,
  proteins: FloatQuantityInsert,
  fats: FloatQuantityInsert,
  fatsSaturated: FloatQuantityOrUndefined,
  salt: FloatQuantityOrUndefined,
  fibers: FloatQuantityOrUndefined,
  sugars: FloatQuantityOrUndefined,
}) {}
