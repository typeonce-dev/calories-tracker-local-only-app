import { Schema } from "effect";
import {
  FloatQuantityNonNegative,
  FloatQuantityPositive,
  PrimaryKeyIndex,
} from "./shared";

export class _PlanInsert extends Schema.Class<_PlanInsert>("_PlanInsert")({
  calories: FloatQuantityPositive,
  fatsRatio: FloatQuantityNonNegative,
  carbohydratesRatio: FloatQuantityNonNegative,
  proteinsRatio: FloatQuantityNonNegative,
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
  calories: FloatQuantityPositive,
  fatsRatio: FloatQuantityNonNegative,
  carbohydratesRatio: FloatQuantityNonNegative,
  proteinsRatio: FloatQuantityNonNegative,
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
