import type { ComponentProps } from "react";
import * as Aria from "react-aria-components";
import { cn } from "~/utils";

const ModalOverlay = ({ className, ...props }: Aria.ModalOverlayProps) => {
  return (
    <Aria.ModalOverlay
      className={cn(
        "fixed inset-0 z-50 w-dvw h-dvh bg-black/30 flex items-end justify-center",
        className
      )}
      {...props}
    />
  );
};

const Modal = ({ className, ...props }: ComponentProps<typeof Aria.Modal>) => {
  return (
    <Aria.Modal
      className={cn(
        "bg-white outline-none rounded-t-md overflow-hidden",
        className
      )}
      {...props}
    />
  );
};

export { Modal, ModalOverlay };
