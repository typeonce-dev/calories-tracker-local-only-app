import { Schema } from "effect";
import { DailyLogSelect } from "./daily-log";
import { FoodSelect } from "./food";
import { FloatQuantityPositive, Meal, PrimaryKeyIndex } from "./shared";

export class ServingInsert extends Schema.Class<ServingInsert>("ServingInsert")(
  {
    foodId: PrimaryKeyIndex,
    quantity: FloatQuantityPositive,
    meal: Meal,
    dailyLogDate: DailyLogSelect.fields.date,
  }
) {}

export class ServingUpdate extends Schema.Class<ServingUpdate>("ServingUpdate")(
  {
    id: PrimaryKeyIndex,
    quantity: FloatQuantityPositive,
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
  quantity: FloatQuantityPositive,
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
