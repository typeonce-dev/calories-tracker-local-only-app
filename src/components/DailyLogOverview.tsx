import { Link } from "@tanstack/react-router";
import { DateTime } from "effect";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { Text } from "react-aria-components";
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
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <Link
          to={`/log/${DailyLogSelect.formatDate(DateTime.subtract(date, { days: 1 }))}`}
        >
          <MoveLeftIcon />
        </Link>
        <Text className="text-2xl">{DailyLogSelect.displayDate(date)}</Text>
        <Link
          to={`/log/${DailyLogSelect.formatDate(DateTime.add(date, { days: 1 }))}`}
        >
          <MoveRightIcon />
        </Link>
      </div>

      <div>
        {dailyPlan !== undefined ? (
          <DailyPlanCard plan={dailyPlan} date={date} />
        ) : (
          <p>No plan</p>
        )}
      </div>

      <div>
        {Meal.literals.map((meal) => (
          <div key={meal}>
            <h2>{meal}</h2>
            <SelectFood dailyLogDate={date} meal={meal} />
            <ul>
              {dailyLog?.rows
                .filter((log) => log.meal === meal)
                .map((log) => (
                  <li key={log.id}>
                    <ServingCard log={log} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
