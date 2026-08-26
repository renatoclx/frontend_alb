import { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "Nenhum registro encontrado.",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-sm">
      <table className="w-full text-sm">
        <thead className="bg-foreground/3">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-table-header"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-foreground/50"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-t border-foreground/5 hover:bg-foreground/3"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-table-cell">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
