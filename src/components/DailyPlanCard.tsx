import { Match } from "effect";
import { Group, Text } from "react-aria-components";
import type { DailyLogSelect } from "~/schema/daily-log";
import type { planTable } from "~/schema/drizzle";
import { cn } from "~/utils";
import { CarbohydrateIcon, FatIcon, ProteinIcon } from "./Icons";

type Label = "fats" | "carbohydrate" | "protein";
const GramsForCalorie = Match.type<Label>().pipe(
  Match.when("fats", () => 9),
  Match.when("carbohydrate", () => 4),
  Match.when("protein", () => 4),
  Match.exhaustive
);
const SegmentColor = Match.type<Label>().pipe(
  Match.when("fats", () => "border-fat text-fat-dark bg-fat/30"),
  Match.when(
    "carbohydrate",
    () => "border-carbohydrate text-carbohydrate-dark bg-carbohydrate/30"
  ),
  Match.when("protein", () => "border-protein text-protein-dark bg-protein/30"),
  Match.exhaustive
);
const SegmentIcon = Match.type<Label>().pipe(
  Match.when("fats", () => <FatIcon size={12} />),
  Match.when("carbohydrate", () => <CarbohydrateIcon size={12} />),
  Match.when("protein", () => <ProteinIcon size={12} />),
  Match.exhaustive
);

const Segment = ({
  value,
  label,
  totalCalories,
}: {
  value: number;
  label: Label;
  totalCalories: number;
}) => {
  return (
    <div style={{ width: `${value}%` }}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}`}
        className={cn(
          SegmentColor(label),
          "border-y-2 w-full p-1 flex gap-x-2 items-center justify-center"
        )}
      >
        <span className="text-center font-mono text-xs font-bold">
          {(((value / 100) * totalCalories) / GramsForCalorie(label)).toFixed(
            0
          )}
          g
        </span>
        {SegmentIcon(label)}
      </div>
    </div>
  );
};

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
      <Group className="w-full overflow-hidden flex">
        <Segment
          totalCalories={plan.calories}
          value={plan.carbohydratesRatio}
          label="carbohydrate"
        />
        <Segment
          totalCalories={plan.calories}
          value={plan.proteinsRatio}
          label="protein"
        />
        <Segment
          totalCalories={plan.calories}
          value={plan.fatsRatio}
          label="fats"
        />
      </Group>
      {/* <UpdateDailyPlan date={date} /> */}
    </div>
  );
}
