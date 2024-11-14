import { DateTime, Schema } from "effect";

export class DailyLogInsert extends Schema.Class<DailyLogInsert>(
  "DailyLogInsert"
)({
  date: Schema.DateTimeUtcFromSelf,
  planId: Schema.Number,
}) {}

export class DailyLogSelect extends Schema.Class<DailyLogSelect>(
  "DailyLogSelect"
)({
  date: Schema.DateTimeUtc,
  planId: Schema.Number,
}) {
  static readonly formatDate = DateTime.formatIsoDateUtc;
}

export class DailyLogUpdate extends Schema.Class<DailyLogUpdate>(
  "DailyLogUpdate"
)({
  date: Schema.DateTimeUtcFromSelf,
  planId: Schema.Number,
}) {}
