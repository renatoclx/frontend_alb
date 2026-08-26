import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", total];
  }
  if (current >= total - 3) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);
  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <span>
          {totalItems === 0
            ? "0 itens"
            : `${rangeStart} – ${rangeEnd} de ${totalItems} itens`}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="flex size-8 items-center justify-center rounded-sm text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-8 items-center justify-center text-sm text-text-secondary"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-sm text-sm transition-colors",
                item === page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-foreground/5",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
          className="flex size-8 items-center justify-center rounded-sm text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
