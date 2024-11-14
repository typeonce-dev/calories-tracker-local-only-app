import type { DailyLogSelect } from "~/schema/daily-log";
import type { planTable } from "~/schema/drizzle";
import UpdateDailyPlan from "./UpdateDailyPlan";

export default function DailyPlanCard({
  plan,
  date,
}: {
  plan: typeof planTable.$inferSelect;
  date: typeof DailyLogSelect.fields.date.Type;
}) {
  return (
    <div className="flex gap-x-2">
      <p>Calories: {plan.calories}</p>
      <p>Fats: {plan.fatsRatio}</p>
      <p>Carbohydrates: {plan.carbohydratesRatio}</p>
      <p>Proteins: {plan.proteinsRatio}</p>
      <UpdateDailyPlan date={date} />
    </div>
  );
}
