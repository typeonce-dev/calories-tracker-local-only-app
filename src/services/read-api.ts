import { Effect } from "effect";
import { Pglite } from "./pglite";

export class ReadApi extends Effect.Service<ReadApi>()("ReadApi", {
  effect: Effect.gen(function* () {
    const db = yield* Pglite;
    return {
      get: "",
    };
  }),
  dependencies: [Pglite.Default],
}) {}
