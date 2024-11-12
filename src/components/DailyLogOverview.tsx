import { Link } from "@tanstack/react-router";
import { DateTime } from "effect";
import { useDailyLog } from "~/hooks/use-daily-log";
import { DailyLogSelect } from "~/schema/daily-log";
import { Meal } from "~/schema/shared";
import SelectFood from "./SelectFood";

export default function DailyLogOverview({
  date,
}: {
  date: typeof DailyLogSelect.fields.date.Type;
}) {
  const dailyLog = useDailyLog(date);
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
      <div>
        {Meal.literals.map((meal) => (
          <div key={meal}>
            <h2>{meal}</h2>
            <SelectFood dailyLogDate={date} meal={meal} />
            <ul>
              {dailyLog?.rows
                .filter((log) => log.meal === meal)
                .map((log) => (
                  <li key={log.id} className="p-2 border border-slate-300">
                    <p className="font-bold">{log.name}</p>
                    <p>{log.quantity}g</p>
                    <p>{(log.quantity / 100) * log.calories}kcal</p>
                    <p>
                      {(log.quantity / 100) * log.carbohydrates}carbohydrates
                    </p>
                    <p>{(log.quantity / 100) * log.fats}fats</p>
                    <p>{(log.quantity / 100) * log.proteins}proteins</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
