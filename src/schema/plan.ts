import { Schema } from "effect";

export class _PlanInsert extends Schema.Class<_PlanInsert>("_PlanInsert")({
  calories: Schema.Positive,
  fatsRatio: Schema.Positive,
  carbohydratesRatio: Schema.Positive,
  proteinsRatio: Schema.Positive,
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
  id: Schema.Number,
  calories: Schema.Positive,
  fatsRatio: Schema.Positive,
  carbohydratesRatio: Schema.Positive,
  proteinsRatio: Schema.Positive,
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
  id: Schema.Number,
}) {}
