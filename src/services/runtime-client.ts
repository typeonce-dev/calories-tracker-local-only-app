import { ConfigProvider, Layer, ManagedRuntime } from "effect";
import { Migrations } from "./migrations";
import { Pglite } from "./pglite";
import { ReadApi } from "./read-api";
import { WriteApi } from "./write-api";

const CustomConfigProvider = Layer.setConfigProvider(
  ConfigProvider.fromMap(new Map([["INDEX_DB", "v1"]]))
);

const MainLayer = Layer.mergeAll(
  WriteApi.Default,
  ReadApi.Default,
  Migrations.Default,
  Pglite.Default
).pipe(Layer.provide(CustomConfigProvider));

export const RuntimeClient = ManagedRuntime.make(MainLayer);
