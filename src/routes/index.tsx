import { createFileRoute } from "@tanstack/react-router";
import { Effect, Option } from "effect";
import { Button, Form, Group } from "react-aria-components";
import { NumberField } from "~/components/NumberField";
import { Input, Label } from "~/components/TextField";
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
  return (
    <main>
      <Form>
        <NumberField
          name="calories"
          step={10}
          defaultValue={2000}
          minValue={100}
        >
          <Label>Calories</Label>
          <Group>
            <Button slot="decrement">-</Button>
            <Input />
            <Button slot="increment">+</Button>
          </Group>
        </NumberField>

        <Button type="submit">Submit</Button>
      </Form>
    </main>
  );
}
