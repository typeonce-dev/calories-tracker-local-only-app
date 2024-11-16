import { Link } from "@tanstack/react-router";
import { DateTime } from "effect";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { Group, Text } from "react-aria-components";
import { useDailyLog } from "~/hooks/use-daily-log";
import { useDailyPlan } from "~/hooks/use-daily-plan";
import { DailyLogSelect } from "~/schema/daily-log";
import { Meal } from "~/schema/shared";
import DailyPlanCard from "./DailyPlanCard";
import SelectFood from "./SelectFood";
import ServingCard from "./ServingCard";

export default function DailyLogOverview({
  date,
}: {
  date: typeof DailyLogSelect.fields.date.Type;
}) {
  const dailyLog = useDailyLog(date);
  const dailyPlan = useDailyPlan(date);
  const totalCalories =
    dailyLog?.rows.reduce(
      (acc, log) => acc + (log.calories / 100) * log.quantity,
      0
    ) ?? 0;
  return (
    <div>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between px-6">
          <Link
            to={`/${DailyLogSelect.formatDate(DateTime.subtract(date, { days: 1 }))}`}
          >
            <MoveLeftIcon />
          </Link>
          <Text className="text-xl font-medium">
            {DailyLogSelect.displayDate(date)}
          </Text>
          <Link
            to={`/${DailyLogSelect.formatDate(DateTime.add(date, { days: 1 }))}`}
          >
            <MoveRightIcon />
          </Link>
        </div>

        {dailyPlan !== undefined && (
          <DailyPlanCard
            plan={dailyPlan}
            date={date}
            totalCalories={totalCalories}
          />
        )}
      </div>

      {Meal.literals.map((meal) => {
        const servings =
          dailyLog?.rows.filter((log) => log.meal === meal) ?? [];
        return (
          <div
            key={meal}
            className="flex flex-col items-center justify-center gap-y-4 border border-slate-400 bg-white py-6"
          >
            <Group className="flex items-center justify-between w-full px-6">
              <h2 className="font-bold capitalize">{meal}</h2>
              <SelectFood dailyLogDate={date} meal={meal} />
            </Group>
            {servings.length > 0 && (
              <div className="w-full flex flex-col divide-y divide-slate-200">
                {servings.map((log) => (
                  <ServingCard key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
