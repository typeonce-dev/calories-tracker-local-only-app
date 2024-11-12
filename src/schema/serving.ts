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
