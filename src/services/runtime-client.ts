import { Layer, ManagedRuntime } from "effect";
import { ReadApi } from "./read-api";
import { WriteApi } from "./write-api";

const MainLayer = Layer.mergeAll(WriteApi.Default, ReadApi.Default);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
