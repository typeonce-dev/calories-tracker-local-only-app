import { useMachine } from "@xstate/react";
import { Button } from "react-aria-components";
import { machine } from "~/machines/manage-food";
import type { foodTable } from "~/schema/drizzle";
import { Dialog, DialogTrigger } from "./Dialog";
import FoodEditing from "./FoodEditing";
import { Modal, ModalOverlay } from "./Modal";

export default function UpdateFood({
  food,
}: {
  food: typeof foodTable.$inferSelect;
}) {
  const [snapshot, send] = useMachine(machine, { input: food });
  return (
    <DialogTrigger>
      <Button>Update food</Button>
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
                <Button type="submit" isDisabled={snapshot.matches("Updating")}>
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
