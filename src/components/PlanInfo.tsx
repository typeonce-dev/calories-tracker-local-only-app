import { Group } from "react-aria-components";
import type { planTable } from "~/schema/drizzle";

export default function PlanInfo({
  plan,
}: {
  plan: typeof planTable.$inferSelect;
}) {
  return (
    <div>
      <p>{plan.calories}</p>
      <Group>
        <p>{plan.carbohydratesRatio}</p>
        <p>{plan.proteinsRatio}</p>
        <p>{plan.fatsRatio}</p>
      </Group>
    </div>
  );
}
