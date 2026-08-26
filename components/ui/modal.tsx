"use client";

import { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const contentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-sm bg-surface p-6 shadow-sm animate-modal-panel focus:outline-none",
  {
    variants: {
      size: {
        sm: "max-w-[400px]",
        md: "max-w-[600px]",
        lg: "max-w-[800px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface ModalProps extends VariantProps<typeof contentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer, size }: ModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 animate-modal-backdrop" />
        <DialogPrimitive.Content className={contentVariants({ size })}>
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Fechar"
              className="flex size-8 items-center justify-center rounded-sm text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>
          <div className="overflow-y-auto">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
