import { Schema } from "effect";
import { DailyLogDate, Meal } from "./shared";

export class ServingInsert extends Schema.Class<ServingInsert>("ServingInsert")(
  {
    foodId: Schema.Number,
    quantity: Schema.Positive,
    meal: Meal,
    dailyLogDate: DailyLogDate,
  }
) {}
