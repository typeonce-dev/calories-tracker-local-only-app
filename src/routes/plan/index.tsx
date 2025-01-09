import { createFileRoute } from "@tanstack/react-router";
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
        {plans.empty ? (
          <p>No plans found</p>
        ) : plans.data ? (
          <>
            {plans.data.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
      <CreatePlan />
    </main>
  );
}
