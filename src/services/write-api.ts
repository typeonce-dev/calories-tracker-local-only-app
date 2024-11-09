import { Effect } from "effect";
import { Pglite } from "./pglite";

export class WriteApi extends Effect.Service<WriteApi>()("WriteApi", {
  effect: Effect.gen(function* () {
    const db = yield* Pglite;
    return {
      get: "",
    };
  }),
  dependencies: [Pglite.Default],
}) {}
