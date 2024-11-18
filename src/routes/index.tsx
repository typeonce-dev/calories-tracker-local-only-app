import { createFileRoute } from "@tanstack/react-router";
import { DateTime, Effect } from "effect";
import DailyLogOverview from "~/components/DailyLogOverview";
import { Migrations } from "~/services/migrations";
import { ReadApi } from "~/services/read-api";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: () =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const migrations = yield* Migrations;
        const readApi = yield* ReadApi;
        const api = yield* WriteApi;

        const latestMigration = migrations.length;
        const { version } = yield* readApi.getSystem.pipe(
          Effect.catchTags({
            PgliteError: () => Effect.succeed({ version: 0 }), // No db yet
          })
        );

        // Make this step reversible, they must both complete, or none (`acquireRelease`)
        yield* Effect.all(migrations.slice(version));

        if (version === 0) {
          yield* api.createSystem;
        }

        yield* api.updateSystemVersion(latestMigration);

        yield* Effect.log(
          version === latestMigration
            ? "Database up to date"
            : `Migrations done (from ${version} to ${latestMigration})`
        );

        return yield* DateTime.now;
      }).pipe(Effect.tapErrorCause(Effect.logError))
    ),
  errorComponent: (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
});

function RouteComponent() {
  const date = Route.useLoaderData();
  return <DailyLogOverview date={date} />;
}
