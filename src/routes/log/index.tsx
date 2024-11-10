import { createFileRoute, redirect } from "@tanstack/react-router";
import { DateTime, Effect, Option } from "effect";
import SelectFood from "~/components/SelectFood";
import { useDailyLog } from "~/hooks/use-daily-log";
import { Meal } from "~/schema/shared";
import { Profile } from "~/services/profile";
import { ReadApi } from "~/services/read-api";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";
import { RedirectLoaderError } from "~/utils";

export const Route = createFileRoute("/log/")({
  component: RouteComponent,
  loader: () =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const profile = yield* Profile;
        const readApi = yield* ReadApi;
        const api = yield* WriteApi;

        const date = yield* DateTime.now.pipe(
          Effect.map(DateTime.formatIsoDate)
        );

        const currentDateLog = yield* readApi.getCurrentDateLog(date).pipe(
          Effect.catchTag("ReadApiError", () =>
            Effect.gen(function* () {
              const currentPlanId = yield* profile.currentPlanId;
              if (Option.isNone(currentPlanId)) {
                return yield* new RedirectLoaderError({
                  to: "/",
                  replace: true,
                });
              }

              yield* Effect.log("Creating new daily log");

              return yield* api.createDailyLog({
                date,
                planId: currentPlanId.value,
              });
            })
          )
        );

        yield* Effect.log(currentDateLog);

        return date;
      }).pipe(
        Effect.catchTag("RedirectLoaderError", (params) =>
          Effect.dieSync(() => redirect(params))
        )
      )
    ),
  errorComponent: (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
});

function RouteComponent() {
  const date = Route.useLoaderData();
  const dailyLog = useDailyLog(date);
  return (
    <div>
      <p>Log for {date}</p>
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
