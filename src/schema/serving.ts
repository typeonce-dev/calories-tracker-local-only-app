import { Schema } from "effect";
import { FoodSelect } from "./food";
import { FloatQuantityInsertPositive, Meal, PrimaryKeyIndex } from "./shared";

// https://effect.website/play#2538c3ae8d4f
export class ServingInsert extends Schema.Class<ServingInsert>("ServingInsert")(
  {
    foodId: PrimaryKeyIndex,
    quantity: FloatQuantityInsertPositive,
    meal: Meal,
    dailyLogDate: Schema.DateTimeUtcFromSelf,
  }
) {}

export class ServingUpdate extends Schema.Class<ServingUpdate>("ServingUpdate")(
  {
    id: PrimaryKeyIndex,
    quantity: FloatQuantityInsertPositive,
  }
) {}

export class ServingRemove extends Schema.Class<ServingRemove>("ServingRemove")(
  {
    id: PrimaryKeyIndex,
  }
) {}

export class ServingSelectWithFoods extends Schema.Class<ServingSelectWithFoods>(
  "ServingSelectWithFoods"
)({
  id: PrimaryKeyIndex,
  meal: Meal,
  quantity: FloatQuantityInsertPositive,
  foodId: FoodSelect.fields.id,
  name: FoodSelect.fields.name,
  brand: FoodSelect.fields.brand,
  calories: FoodSelect.fields.calories,
  fats: FoodSelect.fields.fats,
  carbohydrates: FoodSelect.fields.carbohydrates,
  proteins: FoodSelect.fields.proteins,
}) {
  static readonly totalCalories = (_: readonly ServingSelectWithFoods[]) =>
    _.reduce((acc, log) => acc + (log.calories / 100) * log.quantity, 0) ?? 0;

  static readonly totalFats = (_: readonly ServingSelectWithFoods[]) =>
    _.reduce((acc, log) => acc + (log.fats / 100) * log.quantity, 0) ?? 0;

  static readonly totalCarbohydrates = (_: readonly ServingSelectWithFoods[]) =>
    _.reduce((acc, log) => acc + (log.carbohydrates / 100) * log.quantity, 0) ??
    0;

  static readonly totalProteins = (_: readonly ServingSelectWithFoods[]) =>
    _.reduce((acc, log) => acc + (log.proteins / 100) * log.quantity, 0) ?? 0;
}
