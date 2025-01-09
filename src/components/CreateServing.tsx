import { useMachine } from "@xstate/react";
import { FilePlus2Icon } from "lucide-react";
import { Form } from "react-aria-components";
import { machine } from "~/machines/create-serving";
import { ServingInsert } from "~/schema/serving";
import type { Meal } from "~/schema/shared";
import { Button } from "./Button";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import QuantityField from "./QuantityField";

export default function CreateServing({
  meal,
  dailyLogDate,
  foodId,
}: {
  foodId: number;
  meal: typeof Meal.Type;
  dailyLogDate: string;
}) {
  const [snapshot, send] = useMachine(machine);
  return (
    <DialogTrigger>
      <Button>
        <FilePlus2Icon size={16} />
      </Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <Form
                className="flex flex-col gap-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  send({
                    type: "quantity.confirm",
                    meal,
                    dailyLogDate,
                    foodId,
                  });
                }}
              >
                <QuantityField
                  actor={snapshot.context.quantity}
                  schema={ServingInsert.fields.quantity}
                  label="Quantity"
                  name="quantity"
                />

                <Button
                  action="update"
                  type="submit"
                  isDisabled={snapshot.matches("Creating")}
                >
                  Create serving
                </Button>

                {snapshot.context.submitError !== null && (
                  <p>{snapshot.context.submitError}</p>
                )}
              </Form>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
