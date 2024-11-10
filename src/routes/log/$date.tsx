import { createFileRoute } from "@tanstack/react-router";
import { useDailyLog } from "~/hooks/use-daily-log";

export const Route = createFileRoute("/log/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  const { date } = Route.useParams();
  const dailyLog = useDailyLog(date);
  return (
    <div>
      <p>Log for {date}</p>
      <pre>{JSON.stringify(dailyLog, null, 2)}</pre>
    </div>
  );
}
