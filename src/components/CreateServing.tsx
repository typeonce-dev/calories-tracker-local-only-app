import { useMachine } from "@xstate/react";
import { Button, Form } from "react-aria-components";
import { machine } from "~/machines/create-serving";
import type { DailyLogSelect } from "~/schema/daily-log";
import { ServingInsert } from "~/schema/serving";
import type { Meal } from "~/schema/shared";
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
  dailyLogDate: typeof DailyLogSelect.fields.date.Type;
}) {
  const [snapshot, send] = useMachine(machine);
  return (
    <DialogTrigger>
      <Button>Create serving</Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <Form
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

                <Button type="submit" isDisabled={snapshot.matches("Creating")}>
                  Confirm
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
