import { cva, type VariantProps } from "class-variance-authority";
import * as Aria from "react-aria-components";
import { cn } from "~/utils";

const button = cva("rounded-md border px-4 py-2 text-sm", {
  variants: {
    action: {
      default: "border-slate-600/30 bg-white text-slate-600",
      update: "border-update/30 bg-white text-update",
      remove: "border-remove/30 bg-white text-remove",
    },
  },
  defaultVariants: {
    action: "default",
  },
});

const Button = ({
  className,
  action,
  ...props
}: Aria.ButtonProps & VariantProps<typeof button>) => {
  return (
    <Aria.Button className={cn(button({ action }), className)} {...props} />
  );
};

export { Button };
