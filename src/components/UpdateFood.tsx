import { useMachine } from "@xstate/react";
import { UserPenIcon } from "lucide-react";
import { machine } from "~/machines/manage-food";
import type { FoodSelect } from "~/schema/food";
import FoodEditing from "./FoodEditing";
import { Button } from "./ui/Button";
import { Dialog, DialogTrigger } from "./ui/Dialog";
import { Modal, ModalOverlay } from "./ui/Modal";

export default function UpdateFood({ food }: { food: FoodSelect }) {
  const [snapshot, send] = useMachine(machine, { input: food });
  return (
    <DialogTrigger>
      <Button>
        <UserPenIcon size={16} />
      </Button>
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
                onSubmit={() => send({ type: "food.update", id: food.id })}
              >
                <Button
                  action="update"
                  type="submit"
                  isDisabled={snapshot.matches("Updating")}
                >
                  {snapshot.matches("Updating") ? "Updating..." : "Update"}
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
