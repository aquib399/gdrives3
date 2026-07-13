"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderMedia } from "@/components/render-media";
import { Button } from "@/components/ui/button";
import { useMedia } from "@/hooks/api/tenant";
import { Row } from "@/components/detail-row";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MediaDetailPage() {
  const params = useParams();
  const id = String(params?.id);
  const { data, isPending } = useMedia({ payload: { id } });
  const media = data?.data?.media;

  if (isPending) {
    return <div className="text-muted-foreground p-6">Loading…</div>;
  }

  if (!media) {
    return <div className="text-muted-foreground p-6">File not found.</div>;
  }

  return (
    <section className="w-full p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tenant/files">
                <ArrowLeft className="mr-1.5 size-4" />
                Back to list
              </Link>
            </Button>
            <h1 className="mt-4 text-2xl font-semibold">{media.fileName}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Full file details
            </p>
          </div>
          <Badge>{media.uploadingStatus}</Badge>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Preview</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pt-0 pb-4">
            <RenderMedia media={media} className="max-w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="divide-y px-6 pt-0 pb-4">
            <Row label="File name" value={media.fileName} />
            <Row label="Mime type" value={media.mimeType} />
            <Row
              label="Size"
              value={`${(media.sizeInBytes / 1024 / 1024).toFixed(2)} MB`}
            />
            <Row
              label="Drive file ID"
              value={media.gdriveFileId || "Pending"}
            />
            <Row
              label="File URL"
              value={
                <a
                  className="text-primary underline"
                  href={media.fullUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open file
                </a>
              }
            />
            <Row label="Created at" value={formatDate(media.createdAt)} />
            <Row label="Updated at" value={formatDate(media.updatedAt)} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
