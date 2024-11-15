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
  planId: Schema.Number,
}) {}
