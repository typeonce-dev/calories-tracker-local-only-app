import { BeefIcon, MilkIcon, WheatIcon } from "lucide-react";
import { Group, Text } from "react-aria-components";
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
    <div className="flex gap-y-2 flex-col items-center justify-center">
      <Text className="text-sm">
        <span className="text-xl pr-1">{plan.calories}</span>
        kcal
      </Text>
      <Group className="flex items-center justify-evenly gap-x-8">
        <p>
          {plan.fatsRatio}
          <MilkIcon />
        </p>
        <p>
          {plan.carbohydratesRatio}
          <WheatIcon />
        </p>
        <p>
          {plan.proteinsRatio}
          <BeefIcon />
        </p>
      </Group>
      <UpdateDailyPlan date={date} />
    </div>
  );
}
