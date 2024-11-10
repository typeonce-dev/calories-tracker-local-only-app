import { createFileRoute } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import { Effect, Option } from "effect";
import { Button, Form, Group } from "react-aria-components";
import { NumberField } from "~/components/NumberField";
import { Input, Label } from "~/components/TextField";
import { machine } from "~/machines/create-plan";
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
  const canCreatePlan = snapshot.can({ type: "plan.create" });

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
        <NumberField
          name="calories"
          step={10}
          minValue={100}
          value={snapshot.context.calories}
          onChange={(value) => send({ type: "calories.update", value })}
        >
          <Label>Calories</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>
        <NumberField
          name="fats"
          step={1}
          minValue={0}
          maxValue={100}
          value={snapshot.context.fatsRatio}
          onChange={(value) => send({ type: "ratio.fats.update", value })}
        >
          <Label>Fats</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>
        <NumberField
          name="proteins"
          step={1}
          minValue={0}
          maxValue={100}
          value={snapshot.context.proteinsRatio}
          onChange={(value) => send({ type: "ratio.proteins.update", value })}
        >
          <Label>Proteins</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>
        <NumberField
          name="carbohydrates"
          step={1}
          minValue={0}
          maxValue={100}
          value={snapshot.context.carbohydratesRatio}
          onChange={(value) =>
            send({ type: "ratio.carbohydrates.update", value })
          }
        >
          <Label>Carbohydrates</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>

        <Button
          type="submit"
          isDisabled={!canCreatePlan || snapshot.matches("CreatingPlan")}
        >
          Submit
        </Button>

        {!canCreatePlan && <p>Macros ratio must be 100%</p>}
      </Form>
    </main>
  );
}
