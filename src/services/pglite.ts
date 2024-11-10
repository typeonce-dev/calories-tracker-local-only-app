import * as _PGlite from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { drizzle } from "drizzle-orm/pglite";
import { Config, Data, Effect } from "effect";

class PgliteError extends Data.TaggedError("PgliteError")<{
  cause: unknown;
}> {}

export class Pglite extends Effect.Service<Pglite>()("Pglite", {
  effect: Effect.gen(function* () {
    const indexDb = yield* Config.string("INDEX_DB");

    const client = yield* Effect.tryPromise({
      try: () =>
        _PGlite.PGlite.create(`idb://${indexDb}`, {
          extensions: { live },
        }),
      catch: (error) => new PgliteError({ cause: error }),
    });

    const orm = drizzle({ client });

    const query = <R>(execute: (_: typeof orm) => Promise<R>) =>
      Effect.tryPromise({
        try: () => execute(orm),
        catch: (error) => new PgliteError({ cause: error }),
      });

    return { client, orm, query };
  }),
}) {}
