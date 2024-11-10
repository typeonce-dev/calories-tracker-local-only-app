// @ts-expect-error: import
import v0000 from "../drizzle/0000_illegal_jamie_braddock.sql?raw";

import type { PGlite } from "@electric-sql/pglite";
import { Data, Effect } from "effect";
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
  effect: Effect.gen(function* () {
    const db = yield* Pglite;
    return {
      0: execute(db.client)(v0000),
    };
  }),
  dependencies: [Pglite.Default],
}) {}