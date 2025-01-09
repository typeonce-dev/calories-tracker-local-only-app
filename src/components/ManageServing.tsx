import { useMachine } from "@xstate/react";
import { Button as AriaButton, Group } from "react-aria-components";
import { machine } from "~/machines/manage-serving";
import { ServingUpdate, type ServingSelectWithFoods } from "~/schema/serving";
import QuantityField from "./QuantityField";
import { Button } from "./ui/Button";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { Modal, ModalOverlay } from "./ui/Modal";

export default function ManageServing({
  children,
  log,
}: {
  log: ServingSelectWithFoods;
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
              <div className="flex flex-col gap-y-4">
                <Group>
                  <QuantityField
                    actor={snapshot.context.quantity}
                    schema={ServingUpdate.fields.quantity}
                    label="Quantity"
                    name="quantity"
                  />
                </Group>
                <Group className="flex items-center gap-x-2">
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
