import { createFileRoute } from "@tanstack/react-router";
import { Either, Match } from "effect";
import CreatePlan from "~/components/CreatePlan";
import PlanCard from "~/components/PlanCard";
import { usePlans } from "~/hooks/use-plans";

export const Route = createFileRoute("/plan/")({
  component: HomeComponent,
  errorComponent: () => <p>Error loading migrations</p>,
});

function HomeComponent() {
  const plans = usePlans();
  return (
    <main>
      <div>
        {Either.match(plans, {
          onLeft: Match.valueTags({
            MissingData: () => <p>No plans found</p>,
            InvalidData: ({ parseError }) => (
              <p>Invalid data: {JSON.stringify(parseError, null, 2)}</p>
            ),
          }),
          onRight: (_) => (
            <>
              {_.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </>
          ),
        })}
      </div>
      <CreatePlan />
    </main>
  );
}
