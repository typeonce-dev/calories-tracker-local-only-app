import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import CreatePlan from "~/components/CreatePlan";
import PlanCard from "~/components/PlanCard";
import { usePlans } from "~/hooks/use-plans";
import { Migrations } from "~/services/migrations";
import { ReadApi } from "~/services/read-api";
import { RuntimeClient } from "~/services/runtime-client";
import { WriteApi } from "~/services/write-api";

export const Route = createFileRoute("/")({
  component: HomeComponent,
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
      }).pipe(Effect.tapErrorCause(Effect.logError))
    ),
  errorComponent: () => <p>Error loading migrations</p>,
});

function HomeComponent() {
  const plans = usePlans();
  return (
    <main>
      <div>
        {plans?.rows.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
      </div>
      <CreatePlan />
    </main>
  );
}
