"use client";
import { ITenant } from "@/types/domain/tenant";
import { withListing } from "@/components/hoc/with-listing";
import { ColumnDef } from "@/components/table-listing";
import { useTenantList } from "@/hooks/api/admin";
import { config } from "@/configs/schema/tenant";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  title: "Tenant",
  description: "Manage tenant information",
  searchPlaceholder: "Search tenants by name or email...",
  columns,
  initialFilters: [],
  schemaConfig: config,
  useFetchList: useTenantList,
  getRowKey: (item) => item._id,
  getRowHref: (item) => `/admin/tenants/${item._id}`
});
