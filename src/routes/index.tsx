import { createFileRoute } from "@tanstack/react-router";
import { Effect, Option } from "effect";
import { Migrations } from "~/services/migrations";
import { Profile } from "~/services/profile";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const startup = () => {
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const migrations = yield* Migrations;
        const profile = yield* Profile;
        const dbVersion = yield* profile.dbVersion;
        if (Option.isNone(dbVersion)) {
          yield* migrations.v0000;
          yield* profile.setDbVersion(0);
          yield* Effect.log("Startup database");
        } else {
          if (dbVersion.value > 0) {
            yield* profile.setDbVersion(0);
          }

          yield* Effect.log("Migrations done, version " + dbVersion.value);
        }
      }).pipe(Effect.tapErrorCause(Effect.logError))
    );
  };
  return (
    <main>
      <button type="button" onClick={startup}>
        Startup
      </button>
    </main>
  );
}
