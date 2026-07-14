"use client";
import { withListing } from "@/components/hoc/with-listing";
import { ColumnDef } from "@/components/table-listing";
import { IMedia } from "@/types/domain/system/media";
import { useMediaList } from "@/hooks/api/tenant";
import { config } from "@/configs/schema/media";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MediaRowActions } from "@/components/tenant/media-row-actions";
import { CreateMediaButton } from "@/components/tenant/create-media-button";

const columns: ColumnDef<IMedia>[] = [
  {
    header: "File name",
    accessorKey: "fileName",
    Cell: ({ fileName }) => (
      <p
        className="truncate font-medium max-[1600px]:max-w-100"
        title={fileName}
      >
        {fileName}
      </p>
    )
  },
  {
    header: "Type",
    accessorKey: "mimeType"
  },
  {
    accessorKey: "sizeInBytes",
    header: "Size",
    valueFormatter: (value) => {
      const sizeInKB = value / 1024;
      if (sizeInKB < 1024) {
        return `${sizeInKB.toFixed(2)} KB`;
      } else {
        const sizeInMB = sizeInKB / 1024;
        return `${sizeInMB.toFixed(2)} MB`;
      }
    }
  },
  {
    header: "Status",
    accessorKey: "uploadingStatus",
    Cell: ({ uploadingStatus }) => <Badge>{uploadingStatus}</Badge>
  },
  {
    header: "Uploaded At",
    accessorKey: "createdAt",
    valueFormatter: formatDate
  },
  {
    header: "Actions",
    accessorKey: "_id",
    variant: "actions",
    Cell: (item) => <MediaRowActions media={item} />
  }
];

export default withListing<IMedia>({
  title: "Files",
  description: "Manage all of your files and documents",
  searchPlaceholder: "Search files by name or description...",
  columns,
  initialFilters: [],
  schemaConfig: config,
  useFetchList: useMediaList,
  HeaderUtils: <CreateMediaButton />,
  getRowKey: (item) => item._id,
  getRowHref: (item) => `/tenant/files/${item._id}`
});
