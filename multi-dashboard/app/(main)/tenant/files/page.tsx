"use client";
import { withListing } from "@/components/hoc/with-listing";
import { ColumnDef } from "@/components/table-listing";
import { useTenantList } from "@/hooks/api/admin";
import { config } from "@/configs/schema/tenant";
import { ITenant } from "@/types/domain/tenant";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<ITenant>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    valueFormatter: formatDate
  }
];

export default withListing<ITenant>({
  title: "Files",
  description: "Manage all of your files and documents",
  searchPlaceholder: "Search files by name or description...",
  columns,
  initialFilters: [],
  schemaConfig: config,
  useFetchList: useTenantList,
  getRowKey: (item) => item._id,
  getRowHref: (item) => `/tenant/files/${item._id}`
});
