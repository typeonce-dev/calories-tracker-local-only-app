import { Context } from "effect";
import { createContext, useContext } from "react";
import { Pglite } from "~/services/pglite";

export const PgliteDrizzleContext = createContext<
  Context.Tag.Service<typeof Pglite>["orm"] | null
>(null);

export const usePgliteDrizzle = () => {
  const orm = useContext(PgliteDrizzleContext);
  if (orm === null) {
    throw new Error(
      "usePgliteDrizzle must be used within PgliteDrizzleProvider"
    );
  }
  return orm;
};
