"use client";
import { CreateApiCredentialButton } from "@/components/tenant/create-api-credential-button";
import { ApiCredentialRowActions } from "@/components/tenant/api-credential-row-actions";
import { withListing } from "@/components/hoc/with-listing";
import { useApiCredentialList } from "@/hooks/api/tenant";
import { IApiKey } from "@/types/domain/api-credential";
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
  },
  {
    header: "Actions",
    accessorKey: "_id",
    variant: "actions",
    Cell: (item) => <ApiCredentialRowActions apiKey={item} />
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
  HeaderUtils: <CreateApiCredentialButton />,
  getRowKey: (item) => item._id,
  getRowHref: (item) => `/tenant/credentials/${item._id}`
});
