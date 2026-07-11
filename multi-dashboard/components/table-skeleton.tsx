import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef, ColumnVariant } from "./table-listing";

interface TableSkeletonProps {
  rowCount?: number;
  columns?: ColumnDef<any>[];
  showPaginationSkeleton?: boolean;
}

const DEFAULT_COLUMNS: ColumnDef<any>[] = [
  { header: "Name", variant: "media", accessorKey: "name" },
  { header: "Details", variant: "text", accessorKey: "details" },
  { header: "Status", variant: "badge", accessorKey: "status" },
  {
    header: "Actions",
    variant: "actions",
    headerClassName: "text-right",
    accessorKey: "actions"
  }
];

function renderCellSkeleton(variant: ColumnVariant = "text") {
  switch (variant) {
    case "media":
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      );
    case "badge":
      return <Skeleton className="h-5 w-24 rounded-full" />;
    case "actions":
      return <Skeleton className="ml-auto h-8 w-24 rounded-md" />;
    case "text-sm":
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      );
    case "text":
    default:
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      );
  }
}

export function TableSkeleton({
  rowCount = 20,
  columns = DEFAULT_COLUMNS,
  showPaginationSkeleton = true
}: TableSkeletonProps) {
  return (
    <div className="mx-auto flex min-h-0 w-full flex-1 flex-col px-6 pb-6">
      <div className="border-border bg-card relative min-h-0 flex-1 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-muted/50 border-border border-b text-xs tracking-wider uppercase">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${column.header}-${index}`}
                  className={`px-6 py-4 font-medium ${column.headerClassName || ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {Array.from({ length: rowCount }).map((_, i) => (
              <tr key={i}>
                {columns.map((column, colIndex) => (
                  <td
                    key={`${column.header}-${colIndex}`}
                    className={`px-6 py-4 ${column.cellClassName || ""}`}
                  >
                    {renderCellSkeleton(column.variant)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPaginationSkeleton && (
        <div className="mt-4 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>
      )}
    </div>
  );
}

export const StoreTableSkeleton = TableSkeleton;
