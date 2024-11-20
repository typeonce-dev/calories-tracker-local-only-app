import { Link } from "@tanstack/react-router";
import { DateTime, Either, Match, pipe } from "effect";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { Group, Text } from "react-aria-components";
import { useDailyLog } from "~/hooks/use-daily-log";
import { useDailyPlan } from "~/hooks/use-daily-plan";
import { usePlans } from "~/hooks/use-plans";
import { DailyLogSelect } from "~/schema/daily-log";
import { ServingSelectWithFoods } from "~/schema/serving";
import { Meal } from "~/schema/shared";
import DailyPlanCard from "./DailyPlanCard";
import SelectFood from "./SelectFood";
import ServingCard from "./ServingCard";
import Spinner from "./Spinner";

export default function DailyLogOverview({
  date,
}: {
  date: typeof DailyLogSelect.fields.date.Type;
}) {
  const dailyLog = useDailyLog(date);
  const dailyPlan = useDailyPlan(date);
  const plans = usePlans();

  if (Either.isLeft(plans)) {
    return pipe(
      plans.left,
      Match.valueTags({
        MissingData: () => (
          <div className="flex items-center justify-center inset-0 bg-white">
            <Spinner />
          </div>
        ),
        InvalidData: ({ parseError }) => (
          <div className="flex items-center justify-center inset-0 bg-white">
            <p className="text-sm">
              Invalid data: {JSON.stringify(parseError, null, 2)}
            </p>
          </div>
        ),
      })
    );
  } else if (plans.right.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-4">
        <Text>No plan yet created</Text>
        <Link to="/plan">Go to create plan</Link>
      </div>
    );
  }

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

        <div>
          {Either.isRight(dailyPlan) &&
            Either.match(dailyLog, {
              onLeft: Match.valueTags({
                MissingData: () => <p>No logs found</p>,
                InvalidData: ({ parseError }) => (
                  <p>Invalid data: {JSON.stringify(parseError, null, 2)}</p>
                ),
              }),
              onRight: (_) => (
                <DailyPlanCard
                  plan={dailyPlan.right}
                  date={date}
                  totalCalories={ServingSelectWithFoods.totalCalories(_)}
                  totalCarbohydrates={ServingSelectWithFoods.totalCarbohydrates(
                    _
                  )}
                  totalFats={ServingSelectWithFoods.totalFats(_)}
                  totalProteins={ServingSelectWithFoods.totalProteins(_)}
                />
              ),
            })}
        </div>
      </div>

      {Either.match(dailyLog, {
        onLeft: Match.valueTags({
          MissingData: () => <p>No logs found</p>,
          InvalidData: ({ parseError }) => (
            <p>Invalid data: {JSON.stringify(parseError, null, 2)}</p>
          ),
        }),
        onRight: (_) => (
          <>
            {Meal.literals.map((meal) => {
              const servings = _.filter((log) => log.meal === meal) ?? [];
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
          </>
        ),
      })}
    </div>
  );
}
