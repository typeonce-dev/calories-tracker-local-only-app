import { Schema } from "effect";
import {
  FloatQuantityInsert,
  FloatQuantityInsertPositive,
  PrimaryKeyIndex,
} from "./shared";

export class _PlanInsert extends Schema.Class<_PlanInsert>("_PlanInsert")({
  calories: FloatQuantityInsertPositive,
  fatsRatio: FloatQuantityInsert,
  carbohydratesRatio: FloatQuantityInsert,
  proteinsRatio: FloatQuantityInsert,
}) {
  static readonly WithValidation = this.pipe(
    Schema.filter((params) =>
      params.carbohydratesRatio + params.fatsRatio + params.proteinsRatio ===
      100
        ? true
        : "Macros ratio must be 100%"
    )
  );
}

export class _PlanUpdate extends Schema.Class<_PlanUpdate>("_PlanUpdate")({
  id: PrimaryKeyIndex,
  calories: FloatQuantityInsertPositive,
  fatsRatio: FloatQuantityInsert,
  carbohydratesRatio: FloatQuantityInsert,
  proteinsRatio: FloatQuantityInsert,
}) {
  static readonly WithValidation = this.pipe(
    Schema.filter((params) =>
      params.carbohydratesRatio + params.fatsRatio + params.proteinsRatio ===
      100
        ? true
        : "Macros ratio must be 100%"
    )
  );
}

export class PlanRemove extends Schema.Class<PlanRemove>("PlanRemove")({
  id: PrimaryKeyIndex,
}) {}

export class PlanSelectWithLogs extends Schema.Class<PlanSelectWithLogs>(
  "PlanSelectWithLogs"
)({
  id: PrimaryKeyIndex,
  calories: FloatQuantityInsertPositive,
  fatsRatio: FloatQuantityInsert,
  carbohydratesRatio: FloatQuantityInsert,
  proteinsRatio: FloatQuantityInsert,
  isCurrent: Schema.Boolean,
  logs: Schema.NonNegative,
}) {}
