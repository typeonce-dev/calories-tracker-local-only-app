import { createFileRoute } from "@tanstack/react-router";
import { DateTime, Effect } from "effect";
import { useDailyLog } from "~/hooks/use-daily-log";

export const Route = createFileRoute("/log/")({
  component: RouteComponent,
  loader: () =>
    Effect.runSync(DateTime.now.pipe(Effect.map(DateTime.formatIsoDate))),
});

function RouteComponent() {
  const date = Route.useLoaderData();
  const dailyLog = useDailyLog(date);
  return (
    <div>
      <p>Log for {date}</p>
      <pre>{JSON.stringify(dailyLog, null, 2)}</pre>
    </div>
  );
}
