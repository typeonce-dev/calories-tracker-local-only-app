// @ts-expect-error: import
import v0000 from "../drizzle/0000_illegal_jamie_braddock.sql?raw";

import { Data, Effect } from "effect";
import { Pglite } from "./pglite";

class MigrationsError extends Data.TaggedError("MigrationsError")<{
  cause: unknown;
}> {}

export class Migrations extends Effect.Service<Migrations>()("Migrations", {
  effect: Effect.gen(function* () {
    const db = yield* Pglite;
    return {
      v0000: Effect.tryPromise({
        try: () => db.client.exec(v0000),
        catch: (error) => new MigrationsError({ cause: error }),
      }),
    };
  }),
  dependencies: [Pglite.Default],
}) {}
