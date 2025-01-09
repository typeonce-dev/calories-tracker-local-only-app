import { useMachine } from "@xstate/react";
import { machine } from "~/machines/manage-food";
import FoodEditing from "./FoodEditing";
import { Button } from "./ui/Button";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { Modal, ModalOverlay } from "./ui/Modal";

export default function CreateFood() {
  const [snapshot, send] = useMachine(machine, { input: undefined });
  return (
    <DialogTrigger>
      <Button className="w-full">Create food</Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) => (
              <FoodEditing
                brandActor={snapshot.context.brand}
                caloriesActor={snapshot.context.calories}
                carbohydratesActor={snapshot.context.carbohydrates}
                fibersActor={snapshot.context.fibers}
                nameActor={snapshot.context.name}
                proteinsActor={snapshot.context.proteins}
                saltActor={snapshot.context.salt}
                sugarsActor={snapshot.context.sugars}
                fatsActor={snapshot.context.fats}
                fatsSaturatedActor={snapshot.context.fatsSaturated}
                onSubmit={() => send({ type: "food.create" })}
              >
                <Button
                  action="update"
                  type="submit"
                  isDisabled={snapshot.matches("Creating")}
                >
                  {snapshot.matches("Creating") ? "Creating..." : "Create"}
                </Button>

                {snapshot.context.submitError !== null && (
                  <p>{snapshot.context.submitError}</p>
                )}
              </FoodEditing>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
