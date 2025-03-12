import { useMachine } from "@xstate/react";
import { Button } from "react-aria-components";
import { usePlans } from "~/hooks/use-plans";
import { machine } from "~/machines/manage-daily-log";
import type { DailyLogSelect } from "~/schema/daily-log";
import { cn } from "~/utils";
import PlanInfo from "./PlanInfo";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { Modal, ModalOverlay } from "./ui/Modal";

export default function UpdateDailyPlan({
  date,
}: {
  date: typeof DailyLogSelect.fields.date.Type;
}) {
  const [snapshot, send] = useMachine(machine);
  const plans = usePlans();
  return (
    <DialogTrigger>
      <Button>Update daily plan</Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <div>
                <div>
                  {plans.empty ? (
                    <p>No plans found</p>
                  ) : plans.data ? (
                    <>
                      {plans.data.map((plan) => (
                        <div
                          key={plan.id}
                          className={cn(
                            snapshot.context.selectedPlanId === plan.id &&
                              "bg-slate-200"
                          )}
                        >
                          <PlanInfo plan={plan} />
                          <Button
                            onPress={() =>
                              send({ type: "plan.select", planId: plan.id })
                            }
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <Button
                  isDisabled={!snapshot.can({ type: "log.update", date })}
                  onPress={() => send({ type: "log.update", date })}
                >
                  Update
                </Button>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
