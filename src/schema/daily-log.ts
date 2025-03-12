import { DateTime, Schema } from "effect";
import { PrimaryKeyIndex } from "./shared";

export class DailyLogInsert extends Schema.Class<DailyLogInsert>(
  "DailyLogInsert"
)({
  date: Schema.DateTimeUtc,
  planId: PrimaryKeyIndex,
}) {}

export class DailyLogSelect extends Schema.Class<DailyLogSelect>(
  "DailyLogSelect"
)({
  date: Schema.DateTimeUtc,
  planId: PrimaryKeyIndex,
}) {
  static readonly formatDate = DateTime.formatIsoDateUtc;
}

export class DailyLogUpdate extends Schema.Class<DailyLogUpdate>(
  "DailyLogUpdate"
)({
  date: Schema.DateTimeUtcFromSelf,
  planId: PrimaryKeyIndex,
}) {}
