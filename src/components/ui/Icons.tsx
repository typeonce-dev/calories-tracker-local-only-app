import { BeefIcon, EggFriedIcon, WheatIcon } from "lucide-react";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof BeefIcon>;

const ProteinIcon = (props: Props) => {
  return <BeefIcon {...props} />;
};

const CarbohydrateIcon = (props: Props) => {
  return <WheatIcon {...props} />;
};

const FatIcon = (props: Props) => {
  return <EggFriedIcon {...props} />;
};

export { CarbohydrateIcon, FatIcon, ProteinIcon };
