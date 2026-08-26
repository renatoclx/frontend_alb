"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
}

type CascaderSize = "xl" | "lg" | "md" | "sm";

interface CascaderProps {
  label: string;
  options: CascaderOption[];
  value: string[] | null;
  onChange: (path: string[], labels: string[]) => void;
  placeholder?: string;
  size?: CascaderSize;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<CascaderSize, string> = {
  xl: "h-12 text-sm",
  lg: "h-10 text-sm",
  md: "h-9 text-sm",
  sm: "h-6 text-xs",
};

// Monta as colunas progressivas a partir do caminho selecionado até agora.
function buildColumns(options: CascaderOption[], path: CascaderOption[]): CascaderOption[][] {
  const columns: CascaderOption[][] = [options];
  let current = options;
  for (const step of path) {
    const found = current.find((option) => option.value === step.value);
    if (found?.children?.length) {
      columns.push(found.children);
      current = found.children;
    } else {
      break;
    }
  }
  return columns;
}

function findPathByValues(options: CascaderOption[], values: string[]): CascaderOption[] {
  const path: CascaderOption[] = [];
  let current = options;
  for (const value of values) {
    const found = current.find((option) => option.value === value);
    if (!found) break;
    path.push(found);
    current = found.children ?? [];
  }
  return path;
}

export function Cascader({
  label,
  options,
  value,
  onChange,
  placeholder,
  size = "lg",
  error,
  disabled,
  className,
}: CascaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<CascaderOption[]>([]);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const selectedPath = value ? findPathByValues(options, value) : [];
  const columns = buildColumns(options, isOpen ? activePath : selectedPath);

  useEffect(() => {
    if (!isOpen) return;
    setActivePath(selectedPath);

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ top: rect.bottom + 4, left: rect.left });
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSelectAt(columnIndex: number, option: CascaderOption) {
    const nextPath = [...activePath.slice(0, columnIndex), option];
    if (option.children?.length) {
      setActivePath(nextPath);
      return;
    }
    onChange(
      nextPath.map((step) => step.value),
      nextPath.map((step) => step.label)
    );
    setIsOpen(false);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label id={`${inputId}-label`} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${inputId}-label`}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between rounded-sm border border-foreground/15 bg-background px-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          selectedPath.length === 0 && "text-foreground/40",
          error && "border-error focus:ring-error/50"
        )}
      >
        <span className="truncate">
          {selectedPath.length > 0
            ? selectedPath.map((step) => step.label).join(" / ")
            : (placeholder ?? "Selecione...")}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-foreground/50 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {error && <span className="text-xs text-error">{error}</span>}

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 flex overflow-hidden rounded-sm border border-foreground/10 bg-surface shadow-sm"
          >
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="max-h-56 w-40 overflow-y-auto border-r border-foreground/10 py-1 last:border-r-0"
              >
                {column.map((option) => {
                  const isActive = activePath[columnIndex]?.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelectAt(columnIndex, option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/5",
                        isActive ? "bg-primary/10 text-primary" : "text-foreground"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {option.children?.length ? (
                        <ChevronRight className="size-3.5 shrink-0 text-foreground/40" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export type { CascaderOption };
