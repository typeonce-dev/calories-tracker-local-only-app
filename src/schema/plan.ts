import { Schema } from "effect";

export const PlanInsert = Schema.Struct({
  calories: Schema.Positive,
  fatsRatio: Schema.Positive,
  carbohydratesRatio: Schema.Positive,
  proteinsRatio: Schema.Positive,
}).pipe(
  Schema.filter((params) =>
    params.carbohydratesRatio + params.fatsRatio + params.proteinsRatio === 100
      ? false
      : "Macros ratio must be 100%"
  )
);
