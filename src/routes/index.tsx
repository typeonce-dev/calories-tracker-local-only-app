import { createFileRoute } from "@tanstack/react-router";
import { DateTime } from "effect";
import DailyLogOverview from "~/components/DailyLogOverview";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: () => RuntimeClient.runPromise(DateTime.now),
  errorComponent: (error) => <pre>{JSON.stringify(error, null, 2)}</pre>,
});

function RouteComponent() {
  const date = Route.useLoaderData();
  return <DailyLogOverview date={date} />;
}
