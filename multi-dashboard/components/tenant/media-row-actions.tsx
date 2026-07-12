"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/field";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { IMedia } from "@/types/domain/system/media";
import { useDeleteMedia, useUpdateMedia } from "@/hooks/api/tenant";

export function MediaRowActions({ media }: { media: IMedia }) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState(media.fileName);
  const [copied, setCopied] = useState(false);
  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();

  useEffect(() => {
    setFileName(media.fileName);
  }, [media.fileName]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(media.fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMedia.mutateAsync({ id: media._id, fileName });
    setOpen(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete file \"${media.fileName}\"? This cannot be undone.`
    );
    if (!confirmed) return;

    await deleteMedia.mutateAsync({ id: media._id });
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalTrigger>
        <Button variant="ghost" size="icon-sm" aria-label="Edit media">
          <PencilLine className="size-4" />
        </Button>
      </ModalTrigger>
      <ModalContent anchor className="w-[min(100vw-2rem,28rem)] p-5">
        <form className="space-y-4" onSubmit={handleUpdate}>
          <div>
            <h3 className="text-base font-semibold">Edit file name</h3>
            <p className="text-muted-foreground text-sm">
              Update the filename only.
            </p>
          </div>

          <Field
            name="fileName"
            label="File name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMedia.isPending}
            >
              {deleteMedia.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="size-4" />
                    Copied
                  </>
                ) : (
                  "Copy URL"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMedia.isPending}>
                {updateMedia.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
