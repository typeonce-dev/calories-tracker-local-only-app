import { useMachine } from "@xstate/react";
import { Button } from "react-aria-components";
import { machine } from "~/machines/manage-food";
import { Dialog, DialogTrigger } from "./Dialog";
import FoodEditing from "./FoodEditing";
import { Modal, ModalOverlay } from "./Modal";

export default function CreateFood() {
  const [snapshot, send] = useMachine(machine, { input: undefined });
  return (
    <DialogTrigger>
      <Button>Create food</Button>
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
                <Button type="submit" isDisabled={snapshot.matches("Creating")}>
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
