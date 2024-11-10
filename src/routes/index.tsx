import { createFileRoute } from "@tanstack/react-router";
import { Effect, Option } from "effect";
import { useDailyLog } from "~/hooks/use-daily-log";
import { Migrations } from "~/services/migrations";
import { Profile } from "~/services/profile";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const dailyLog = useDailyLog();
  const startup = () => {
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
    );
  };
  return (
    <main>
      <pre>{JSON.stringify(dailyLog, null, 2)}</pre>
      <button type="button" onClick={startup}>
        Startup
      </button>
    </main>
  );
}
