import { createFileRoute } from "@tanstack/react-router";
import { Effect, Option } from "effect";
import CreatePlan from "~/components/CreatePlan";
import PlanCard from "~/components/PlanCard";
import { usePlans } from "~/hooks/use-plans";
import { Migrations } from "~/services/migrations";
import { Profile } from "~/services/profile";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: () =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const migrations = yield* Migrations;
        const profile = yield* Profile;

        const dbVersion = yield* profile.dbVersion;

        if (Option.isNone(dbVersion)) {
          yield* migrations[0];
          yield* profile.setDbVersion(0);
          yield* Effect.log("Startup database");
        } else {
          if (dbVersion.value > 0) {
            yield* profile.setDbVersion(0);
          }

          yield* Effect.log("Migrations done, version " + dbVersion.value);
        }
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
