import { createFileRoute } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import { Effect, Option } from "effect";
import { Button, Form } from "react-aria-components";
import QuantityField from "~/components/QuantityField";
import { machine } from "~/machines/create-plan";
import { _PlanInsert } from "~/schema/plan";
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
  const [snapshot, send] = useMachine(machine);

  if (snapshot.matches("Created")) {
    return <p>Plan created!</p>;
  }

  return (
    <main>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          send({ type: "plan.create" });
        }}
      >
        <QuantityField
          actor={snapshot.context.calories}
          schema={_PlanInsert.fields.calories}
          label="Calories"
          name="calories"
        />

        <QuantityField
          actor={snapshot.context.carbohydratesRatio}
          schema={_PlanInsert.fields.carbohydratesRatio}
          label="Carbohydrates Ratio"
          name="carbohydrates"
        />

        <QuantityField
          actor={snapshot.context.proteinsRatio}
          schema={_PlanInsert.fields.proteinsRatio}
          label="Proteins Ratio"
          name="proteins"
        />

        <QuantityField
          actor={snapshot.context.fatsRatio}
          schema={_PlanInsert.fields.fatsRatio}
          label="Fats Ratio"
          name="fats"
        />

        <Button type="submit" isDisabled={snapshot.matches("CreatingPlan")}>
          Submit
        </Button>

        {snapshot.context.submitError !== null && (
          <p>{snapshot.context.submitError}</p>
        )}
      </Form>
    </main>
  );
}
