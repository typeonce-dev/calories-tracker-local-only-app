import { Schema } from "effect";
import { DailyLogSelect } from "./daily-log";
import { Meal } from "./shared";

export class ServingInsert extends Schema.Class<ServingInsert>("ServingInsert")(
  {
    foodId: Schema.Number,
    quantity: Schema.Positive,
    meal: Meal,
    dailyLogDate: DailyLogSelect.fields.date,
  }
) {}

export class ServingUpdate extends Schema.Class<ServingUpdate>("ServingUpdate")(
  {
    id: Schema.Number,
    quantity: Schema.Positive,
  }
) {}

export class ServingRemove extends Schema.Class<ServingRemove>("ServingRemove")(
  {
    id: Schema.Number,
  }
) {}
