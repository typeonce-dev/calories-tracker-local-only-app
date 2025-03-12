import { Match } from "effect";
import { Group, Label, ProgressBar } from "react-aria-components";
import type { PlanSelectDaily } from "~/schema/plan";
import { cn } from "~/utils";
import { CarbohydrateIcon, FatIcon, ProteinIcon } from "./ui/Icons";

type Label = "fat" | "carbohydrate" | "protein";
const GramsForCalorie = Match.type<Label>().pipe(
  Match.when("fat", () => 9),
  Match.when("carbohydrate", () => 4),
  Match.when("protein", () => 4),
  Match.exhaustive
);
const SegmentColor = Match.type<Label>().pipe(
  Match.when("fat", () => "border-fat text-fat-dark"),
  Match.when(
    "carbohydrate",
    () => "border-carbohydrate text-carbohydrate-dark"
  ),
  Match.when("protein", () => "border-protein text-protein-dark"),
  Match.exhaustive
);
const SegmentFillColor = Match.type<Label>().pipe(
  Match.when("fat", () => "bg-fat/30"),
  Match.when("carbohydrate", () => "bg-carbohydrate/30"),
  Match.when("protein", () => "bg-protein/30"),
  Match.exhaustive
);
const SegmentIcon = Match.type<Label>().pipe(
  Match.when("fat", () => <FatIcon size={12} />),
  Match.when("carbohydrate", () => <CarbohydrateIcon size={12} />),
  Match.when("protein", () => <ProteinIcon size={12} />),
  Match.exhaustive
);

const Segment = ({
  value,
  label,
  planCalories,
  ratio,
}: {
  value: number;
  ratio: number;
  label: Label;
  planCalories: number;
}) => {
  const maxValue = ((ratio / 100) * planCalories) / GramsForCalorie(label);
  return (
    <ProgressBar value={value} maxValue={maxValue} className="w-full">
      {({ percentage }) => (
        <>
          <div
            className={cn(
              SegmentColor(label),
              "w-full relative border-y py-0.5 flex items-center justify-between"
            )}
          >
            <Group className="flex items-center justify-between px-2 w-full z-[1]">
              <Label className="text-xs inline-flex items-center gap-x-2">
                {SegmentIcon(label)}
                <span className="font-bold">{value.toFixed(0)}g</span>
              </Label>
              <p className="text-xs text-right">
                <span className="pr-1">{maxValue.toFixed(0)}</span>g
              </p>
            </Group>
            <div
              className={cn(
                SegmentFillColor(label),
                "h-full absolute left-0 top-0 transition-[width] duration-300 ease-in-out"
              )}
              style={{ width: percentage + "%" }}
            />
          </div>
        </>
      )}
    </ProgressBar>
  );
};

export default function DailyPlanCard({
  plan,
  totalCalories,
  totalCarbohydrates,
  totalFats,
  totalProteins,
}: {
  plan: PlanSelectDaily;
  totalCalories: number;
  totalFats: number;
  totalCarbohydrates: number;
  totalProteins: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <ProgressBar
        value={totalCalories}
        maxValue={plan.calories}
        className="w-full"
      >
        {({ percentage }) => (
          <>
            <Group className="flex items-center justify-between px-2">
              <Label className="text-xs">
                <span className="pr-1 text-base font-medium">
                  {totalCalories.toFixed(0)}
                </span>
                kcal
              </Label>
              <p className="text-xs text-right w-full">
                <span className="pr-1 text-base">{plan.calories}</span>
                kcal
              </p>
            </Group>
            <div className="h-2 w-full bg-slate-200/10 border-t border-slate-300">
              <div
                className="h-full bg-slate-200"
                style={{ width: percentage + "%" }}
              />
            </div>
          </>
        )}
      </ProgressBar>

      <Segment
        label="carbohydrate"
        value={totalCarbohydrates}
        ratio={plan.carbohydratesRatio}
        planCalories={plan.calories}
      />
      <Segment
        label="protein"
        value={totalProteins}
        ratio={plan.proteinsRatio}
        planCalories={plan.calories}
      />
      <Segment
        label="fat"
        value={totalFats}
        ratio={plan.fatsRatio}
        planCalories={plan.calories}
      />
      {/* <UpdateDailyPlan date={date} /> */}
    </div>
  );
}
