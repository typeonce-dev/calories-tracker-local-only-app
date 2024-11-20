import { Group } from "react-aria-components";
import type { ServingSelectWithFoods } from "~/schema/serving";
import { CarbohydrateIcon, FatIcon, ProteinIcon } from "./Icons";
import ManageServing from "./ManageServing";

const format = (value: number, quantity: number) => (value / 100) * quantity;

export default function ServingCard({ log }: { log: ServingSelectWithFoods }) {
  const calories = format(log.calories, log.quantity);
  const carbohydrates = format(log.carbohydrates, log.quantity);
  const proteins = format(log.proteins, log.quantity);
  const fats = format(log.fats, log.quantity);
  return (
    <div className="pt-4 px-6 [&:not(:last-child)]:pb-6">
      <ManageServing log={log}>
        <div className="flex flex-col gap-y-2">
          <Group className="flex items-center justify-between">
            <p>{log.name}</p>
            <p className="text-xs">
              <span className="text-base font-medium">
                {calories.toFixed(1)}
              </span>
              kcal
            </p>
          </Group>
          <Group className="flex items-center justify-between text-slate-700 font-mono">
            <p>{log.quantity}g</p>
            <div className="flex gap-x-4 items-center justify-end">
              {carbohydrates >= 0.1 && (
                <p className="flex gap-x-1 items-center justify-center text-carbohydrate-dark">
                  <CarbohydrateIcon size={12} />
                  <span className="text-xs">{carbohydrates.toFixed(1)}g</span>
                </p>
              )}
              {proteins >= 0.1 && (
                <p className="flex gap-x-1 items-center justify-center text-protein-dark">
                  <ProteinIcon size={12} />
                  <span className="text-xs">{proteins.toFixed(1)}g</span>
                </p>
              )}
              {fats >= 0.1 && (
                <p className="flex gap-x-1 items-center justify-center text-fat-dark">
                  <FatIcon size={12} />
                  <span className="text-xs">{fats.toFixed(1)}g</span>
                </p>
              )}
            </div>
          </Group>
        </div>
      </ManageServing>
    </div>
  );
}
