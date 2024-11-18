import { Schema } from "effect";
import { DailyLogSelect } from "./daily-log";
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
