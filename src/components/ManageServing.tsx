import { useMachine } from "@xstate/react";
import { Button as AriaButton, Group } from "react-aria-components";
import { machine } from "~/machines/manage-serving";
import { ServingUpdate } from "~/schema/serving";
import type { ServingFood } from "~/type";
import { Button } from "./Button";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import QuantityField from "./QuantityField";

export default function ManageServing({
  children,
  log,
}: {
  log: ServingFood;
  children: React.ReactNode;
}) {
  const [snapshot, send] = useMachine(machine, {
    input: { quantity: log.quantity },
  });
  return (
    <DialogTrigger>
      <AriaButton className="inline-block w-full focus:outline-none">
        {children}
      </AriaButton>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <div className="flex flex-col gap-y-6">
                <Group>
                  <QuantityField
                    actor={snapshot.context.quantity}
                    schema={ServingUpdate.fields.quantity}
                    label="Quantity"
                    name="quantity"
                  />
                </Group>
                <Group className="flex items-center gap-x-4">
                  <Button
                    action="remove"
                    className="flex-1"
                    isDisabled={
                      snapshot.matches("Updating") ||
                      snapshot.matches("Removing")
                    }
                    onPress={() => send({ type: "serving.remove", id: log.id })}
                  >
                    Remove
                  </Button>
                  <Button
                    action="update"
                    className="flex-1"
                    isDisabled={
                      snapshot.matches("Updating") ||
                      snapshot.matches("Removing")
                    }
                    onPress={() => send({ type: "serving.update", id: log.id })}
                  >
                    Update
                  </Button>
                </Group>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
