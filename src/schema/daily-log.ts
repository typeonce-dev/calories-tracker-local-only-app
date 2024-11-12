import { Schema } from "effect";
import { DailyLogDate } from "./shared";

export class DailyLogInsert extends Schema.Class<DailyLogInsert>(
  "DailyLogInsert"
)({
  date: DailyLogDate,
  planId: Schema.Number,
}) {}
