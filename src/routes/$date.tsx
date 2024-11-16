import { createFileRoute } from "@tanstack/react-router";
import { Schema } from "effect";
import DailyLogOverview from "~/components/DailyLogOverview";
import { DailyLogSelect } from "~/schema/daily-log";
import { RuntimeClient } from "~/services/runtime-client";

export const Route = createFileRoute("/$date")({
  component: RouteComponent,
  loader: ({ params }) =>
    RuntimeClient.runPromise(
      Schema.decode(DailyLogSelect.fields.date)(params.date)
    ),
});

function RouteComponent() {
  const date = Route.useLoaderData();
  return <DailyLogOverview date={date} />;
}
