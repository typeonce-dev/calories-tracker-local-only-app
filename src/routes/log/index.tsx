import { createFileRoute, redirect } from "@tanstack/react-router";
import { DateTime, Effect, Option } from "effect";
import DailyLogOverview from "~/components/DailyLogOverview";
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

        const date = yield* DateTime.now;

        const currentDateLog = yield* readApi.getCurrentDateLog(date).pipe(
          Effect.catchTag("ReadApiError", () =>
            Effect.gen(function* () {
              const currentPlanId = yield* profile.currentPlanId;
              if (Option.isNone(currentPlanId)) {
                // This is not working!
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
  return <DailyLogOverview date={date} />;
}
