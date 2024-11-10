import { useMachine } from "@xstate/react";
import { Match } from "effect";
import { Button, Dialog, DialogTrigger, Modal } from "react-aria-components";
import { useFoods } from "~/hooks/use-foods";
import { machine } from "~/machines/select-food";
import type { Meal } from "~/schema/shared";

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
      <Modal>
        <Dialog>
          {({ close }) =>
            Match.value(snapshot.value).pipe(
              Match.when("Unselected", () => (
                <div>
                  <pre>{JSON.stringify(foods, null, 2)}</pre>
                </div>
              )),
              Match.when("Selected", () => (
                <div>
                  <Button
                    onPress={() =>
                      send({
                        type: "quantity.confirm",
                        meal,
                        dailyLogDate,
                      })
                    }
                  >
                    Confirm
                  </Button>
                </div>
              )),
              Match.when("Creating", () => <p>...</p>),
              Match.when("Created", () => <p>Done</p>),
              Match.exhaustive
            )
          }
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
