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
  static readonly displayDate = (date: DateTime.Utc) => {
    const nowDay = DateTime.toParts(DateTime.unsafeNow()).day;
    const dateDay = DateTime.toParts(date).day;
    if (nowDay === dateDay) {
      return "Today";
    } else {
      return DateTime.format(date, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };
}

export class DailyLogUpdate extends Schema.Class<DailyLogUpdate>(
  "DailyLogUpdate"
)({
  date: Schema.DateTimeUtcFromSelf,
  planId: PrimaryKeyIndex,
}) {}
