import { useMachine } from "@xstate/react";
import { Match } from "effect";
import { Button } from "react-aria-components";
import { useFoods } from "~/hooks/use-foods";
import { machine } from "~/machines/select-food";
import { ServingInsert } from "~/schema/serving";
import type { Meal } from "~/schema/shared";
import CreateFood from "./CreateFood";
import { Dialog, DialogTrigger } from "./Dialog";
import { Modal, ModalOverlay } from "./Modal";
import QuantityField from "./QuantityField";

export default function SelectFood({
  meal,
  dailyLogDate,
}: {
  meal: typeof Meal.Type;
  dailyLogDate: string;
}) {
  const [snapshot, send] = useMachine(machine);
  const foods = useFoods();
  return (
    <DialogTrigger>
      <Button>Select food</Button>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            {({ close }) =>
              Match.value(snapshot.value).pipe(
                Match.when("Unselected", () => (
                  <div>
                    <CreateFood />
                    <div className="flex flex-col">
                      {foods?.rows.map((food) => (
                        <Button
                          key={food.id}
                          onPress={() =>
                            send({ type: "food.select", id: food.id })
                          }
                        >
                          {food.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )),
                Match.when("Selected", () => (
                  <div>
                    <QuantityField
                      actor={snapshot.context.quantity}
                      schema={ServingInsert.fields.quantity}
                      label="Quantity"
                      name="quantity"
                    />

                    <Button
                      onPress={() =>
                        send({ type: "quantity.confirm", meal, dailyLogDate })
                      }
                    >
                      Confirm
                    </Button>
                  </div>
                )),
                Match.when("Creating", () => <p>...</p>),
                Match.when("Created", () => (
                  <div>
                    <p>Done</p>
                    <Button onPress={close}>Close</Button>
                  </div>
                )),
                Match.exhaustive
              )
            }
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
