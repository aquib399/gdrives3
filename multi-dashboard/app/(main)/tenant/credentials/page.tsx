"use client";
import { withListing } from "@/components/hoc/with-listing";
import { useApiCredentialList } from "@/hooks/api/tenant";
import { IApiKey } from "@/types/domain/api-crendential";
import { config } from "@/configs/schema/api-credential";
import { ColumnDef } from "@/components/table-listing";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<IApiKey>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Active",
    accessorKey: "isActive",
    variant: "badge",
    Cell: ({ isActive }) => (
      <Badge variant={isActive ? "success" : "destructive"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    )
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    valueFormatter: formatDate
  }
];

export default withListing<IApiKey>({
  title: "Api Credentials",
  description: "Manage your API credentials",
  searchPlaceholder: "Search credentials by name or key...",
  columns,
  initialFilters: [],
  schemaConfig: config,
  useFetchList: useApiCredentialList,
  getRowKey: (item) => item._id,
  getRowHref: (item) => `/tenant/credentials/${item._id}`
});
