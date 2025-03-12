import { PGliteProvider } from "@electric-sql/pglite-react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { PgliteDrizzleContext } from "~/hooks/use-pglite-drizzle";
import { Migrations } from "~/services/migrations";
import { Pglite } from "~/services/pglite";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createRootRoute({
  component: RootComponent,
  loader: () =>
    RuntimeClient.runPromise(
      Effect.gen(function* () {
        const migration = yield* Migrations;
        yield* migration.apply;
        return yield* Pglite;
      })
    ),
  errorComponent: (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
});

function RootComponent() {
  const { client, orm } = Route.useLoaderData();
  return (
    <PGliteProvider db={client}>
      <PgliteDrizzleContext.Provider value={orm}>
        <div className="max-w-xl mx-auto pt-12 bg-theme-background">
          <Outlet />
        </div>
      </PgliteDrizzleContext.Provider>
    </PGliteProvider>
  );
}
