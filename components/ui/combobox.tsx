"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

interface ComboboxOption {
  id: string;
  nome: string;
}

// Mesma escala de altura do Input/Select (`xl` = 48px, padrão de formulário
// em docs/forms.md).
const triggerVariants = cva(
  "w-full rounded-sm border border-foreground/15 bg-background px-3 placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50",
  {
    variants: {
      size: {
        xl: "h-12 text-sm",
        lg: "h-10 text-sm",
        md: "h-9 text-sm",
        sm: "h-6 text-xs",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

interface ComboboxProps extends VariantProps<typeof triggerVariants> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: ComboboxOption) => void;
  options: ComboboxOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function Combobox({
  label,
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  error,
  required,
  size,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();
  const blurTimeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(blurTimeout.current), []);

  function handleSelect(option: ComboboxOption) {
    onSelect(option);
    setIsOpen(false);
  }

  // Ao sair do campo (Tab, clique fora): completa com o primeiro resultado da
  // busca (ou o de nome exato, se houver). O timeout deixa um clique numa
  // opção resolver primeiro.
  function handleBlur() {
    window.clearTimeout(blurTimeout.current);
    blurTimeout.current = window.setTimeout(() => {
      setIsOpen(false);
      if (!value.trim() || options.length === 0) return;
      const termo = value.trim().toLowerCase();
      const alvo = options.find((option) => option.nome.toLowerCase() === termo) ?? options[0];
      if (alvo.nome !== value) onSelect(alvo);
    }, 150);
  }

  return (
    // `shouldFilter={false}`: a filtragem já acontece fora (busca via API
    // disparada em `onChange`) — o Command só exibe as `options` recebidas.
    <CommandPrimitive shouldFilter={false} className="flex flex-col gap-2">
      <PopoverPrimitive.Root open={isOpen && options.length > 0} onOpenChange={setIsOpen}>
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
        <PopoverPrimitive.Anchor asChild>
          <CommandPrimitive.Input
            id={inputId}
            autoComplete="off"
            value={value}
            placeholder={placeholder}
            onValueChange={(next) => {
              onChange(next);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
            className={cn(triggerVariants({ size }), error && "border-error focus:ring-error/50")}
          />
        </PopoverPrimitive.Anchor>
        {error && <span className="text-xs text-error">{error}</span>}
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-10 w-[var(--radix-popover-trigger-width)] rounded-sm border border-foreground/10 bg-background py-1 shadow-sm"
        >
          <CommandPrimitive.List className="max-h-56 overflow-y-auto">
            {options.map((option) => (
              <CommandPrimitive.Item
                key={option.id}
                value={option.id}
                onSelect={() => handleSelect(option)}
                className="cursor-pointer px-3 py-2 text-left text-sm text-foreground data-[selected=true]:bg-foreground/5"
              >
                {option.nome}
              </CommandPrimitive.Item>
            ))}
          </CommandPrimitive.List>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </CommandPrimitive>
  );
}
