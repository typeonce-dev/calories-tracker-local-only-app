import { Link } from "@tanstack/react-router";
import { DateTime } from "effect";
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
    <div>
      <div className="flex items-center">
        <Link
          to={`/log/${DailyLogSelect.formatDate(DateTime.subtract(date, { days: 1 }))}`}
        >
          Previous
        </Link>
        <p>Log for {DailyLogSelect.formatDate(date)}</p>
        <Link
          to={`/log/${DailyLogSelect.formatDate(DateTime.add(date, { days: 1 }))}`}
        >
          Next
        </Link>
      </div>
      {dailyPlan !== undefined ? (
        <DailyPlanCard plan={dailyPlan} date={date} />
      ) : (
        <p>No plan</p>
      )}
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
