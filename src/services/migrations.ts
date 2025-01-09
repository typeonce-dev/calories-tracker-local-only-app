// @ts-expect-error: import
import v0000 from "../drizzle/0000_thin_wilson_fisk.sql?raw";

import type { PGlite } from "@electric-sql/pglite";
import { Data, Effect } from "effect";
import { systemTable } from "~/schema/drizzle";
import { singleResult } from "~/utils";
import { Pglite } from "./pglite";

class MigrationsError extends Data.TaggedError("MigrationsError")<{
  cause: unknown;
}> {}

const execute = (client: PGlite) => (sql: string) =>
  Effect.tryPromise({
    try: () => client.exec(sql),
    catch: (error) => new MigrationsError({ cause: error }),
  });

export class Migrations extends Effect.Service<Migrations>()("Migrations", {
  dependencies: [Pglite.Default],
  effect: Effect.gen(function* () {
    const { query, client } = yield* Pglite;
    const migrate = execute(client);

    // Add new migrations here
    const migrations = [migrate(v0000)] as const;
    const latestMigration = migrations.length;

    return {
      apply: Effect.gen(function* () {
        const { version } = yield* query((_) =>
          _.select().from(systemTable)
        ).pipe(
          singleResult(
            () => new MigrationsError({ cause: "System not found" })
          ),
          Effect.catchTags({
            PgliteError: () => Effect.succeed({ version: 0 }), // No db yet
          })
        );

        yield* Effect.all(migrations.slice(version));

        if (version === 0) {
          yield* query((_) => _.insert(systemTable).values({ version: 0 }));
        }

        yield* query((_) =>
          _.update(systemTable).set({ version: latestMigration })
        );

        yield* Effect.log(
          version === latestMigration
            ? "Database up to date"
            : `Migrations done (from ${version} to ${latestMigration})`
        );
      }),
    };
  }),
}) {}
