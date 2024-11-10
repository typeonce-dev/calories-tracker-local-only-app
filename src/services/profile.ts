import { KeyValueStore } from "@effect/platform";
import { layerLocalStorage } from "@effect/platform-browser/BrowserKeyValueStore";
import { Effect, Number, Option } from "effect";

export class Profile extends Effect.Service<Profile>()("Profile", {
  effect: Effect.gen(function* () {
    const store = yield* KeyValueStore.KeyValueStore;
    return {
      dbVersion: store
        .get("dbVersion")
        .pipe(Effect.map(Option.flatMap(Number.parse))),

      setDbVersion: (currentVersion: number) =>
        store.set("dbVersion", currentVersion.toString()),

      currentPlanId: store
        .get("currentPlanId")
        .pipe(Effect.map(Option.flatMap(Number.parse))),

      setCurrentPlanId: (currentPlanId: number) =>
        store.set("currentPlanId", currentPlanId.toString()),
    };
  }),
  dependencies: [layerLocalStorage],
}) {}
