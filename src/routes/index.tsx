import { createFileRoute, Link } from "@tanstack/react-router";
import { DateTime, Effect, Schema } from "effect";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { Group, Text } from "react-aria-components";
import DailyPlanCard from "~/components/DailyPlanCard";
import SelectFood from "~/components/SelectFood";
import ServingCard from "~/components/ServingCard";
import Spinner from "~/components/ui/Spinner";
import { useDailyLog } from "~/hooks/use-daily-log";
import { useDailyPlan } from "~/hooks/use-daily-plan";
import { usePlans } from "~/hooks/use-plans";
import { DailyLogSelect } from "~/schema/daily-log";
import { ServingSelectWithFoods } from "~/schema/serving";
import { Meal } from "~/schema/shared";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: () => RuntimeClient.runPromise(DateTime.now),
  validateSearch: (params) =>
    Effect.runSync(
      Schema.decodeUnknown(Schema.Struct({ date: DailyLogSelect.fields.date }))(
        params
      ).pipe(
        Effect.orElse(() =>
          DateTime.now.pipe(Effect.map((date) => ({ date })))
        ),
        Effect.map((params) => ({
          date: DailyLogSelect.formatDate(params.date),
        }))
      )
    ),
});

function RouteComponent() {
  const { date } = Route.useSearch();
  const dailyLog = useDailyLog(date);
  const dailyPlan = useDailyPlan(date);
  const plans = usePlans();

  if (plans.loading) {
    return (
      <div className="flex items-center justify-center inset-0 bg-white">
        <Spinner />
      </div>
    );
  } else if (plans.error) {
    return (
      <div className="flex items-center justify-center inset-0 bg-white">
        <p className="text-sm">
          Invalid data: {JSON.stringify(plans.error, null, 2)}
        </p>
      </div>
    );
  } else if (plans.empty) {
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
            to="."
            search={() => ({
              date: DailyLogSelect.formatDate(
                DateTime.subtract(DateTime.unsafeFromDate(new Date(date)), {
                  days: 1,
                })
              ),
            })}
          >
            <MoveLeftIcon />
          </Link>
          <Text className="text-xl font-medium">{date}</Text>
          <Link
            to="."
            search={() => ({
              date: DailyLogSelect.formatDate(
                DateTime.add(DateTime.unsafeFromDate(new Date(date)), {
                  days: 1,
                })
              ),
            })}
          >
            <MoveRightIcon />
          </Link>
        </div>

        <div>
          {dailyPlan.empty ? (
            <p>No plan found</p>
          ) : dailyPlan.data && dailyLog.data ? (
            <DailyPlanCard
              plan={dailyPlan.data}
              totalCalories={ServingSelectWithFoods.totalCalories(
                dailyLog.data
              )}
              totalCarbohydrates={ServingSelectWithFoods.totalCarbohydrates(
                dailyLog.data
              )}
              totalFats={ServingSelectWithFoods.totalFats(dailyLog.data)}
              totalProteins={ServingSelectWithFoods.totalProteins(
                dailyLog.data
              )}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      {dailyLog.data ? (
        <>
          {Meal.literals.map((meal) => {
            const servings =
              dailyLog.data.filter((log) => log.meal === meal) ?? [];
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
      ) : (
        <></>
      )}
    </div>
  );
}
