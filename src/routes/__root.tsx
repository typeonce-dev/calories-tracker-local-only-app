import { PGliteProvider } from "@electric-sql/pglite-react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { PgliteDrizzleContext } from "~/hooks/use-pglite-drizzle";
import { Pglite } from "~/services/pglite";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createRootRoute({
  component: RootComponent,
  loader: () => RuntimeClient.runPromise(Pglite),
  errorComponent: () => <p>Error</p>,
});

function RootComponent() {
  const { client, orm } = Route.useLoaderData();
  return (
    <PGliteProvider db={client}>
      <PgliteDrizzleContext.Provider value={orm}>
        <div className="max-w-xl mx-auto my-12">
          <Outlet />
        </div>
      </PgliteDrizzleContext.Provider>
    </PGliteProvider>
  );
}
