"use client";

import { useId, useState } from "react";
import { cn } from "@/utils/cn";

interface ComboboxOption {
  id: string;
  nome: string;
}

interface ComboboxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: ComboboxOption) => void;
  options: ComboboxOption[];
  placeholder?: string;
  error?: string;
}

export function Combobox({ label, value, onChange, onSelect, options, placeholder, error }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();

  function handleSelect(option: ComboboxOption) {
    onSelect(option);
    setIsOpen(false);
  }

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        className={cn(
          "h-10 rounded-lg border border-foreground/15 bg-background px-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50",
          error && "border-error focus:ring-error/50"
        )}
      />
      {error && <span className="text-xs text-error">{error}</span>}
      {isOpen && options.length > 0 && (
        <ul className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-foreground/10 bg-background py-1 shadow-sm">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-foreground/5"
              >
                {option.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
