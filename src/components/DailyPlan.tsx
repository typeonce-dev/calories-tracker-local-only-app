import type { planTable } from "~/schema/drizzle";

export default function DailyPlan({
  plan,
}: {
  plan: typeof planTable.$inferSelect;
}) {
  return (
    <div className="flex gap-x-2">
      <p>Calories: {plan.calories}</p>
      <p>Fats: {plan.fatsRatio}</p>
      <p>Carbohydrates: {plan.carbohydratesRatio}</p>
      <p>Proteins: {plan.proteinsRatio}</p>
    </div>
  );
}
