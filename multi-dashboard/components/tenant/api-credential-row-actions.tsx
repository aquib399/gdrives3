"use client";

import { useState } from "react";
import { Loader2, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/field";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IApiKey } from "@/types/domain/api-credential";
import {
  useDeleteApiCredential,
  useUpdateApiCredential
} from "@/hooks/api/tenant";

export function ApiCredentialRowActions({ apiKey }: { apiKey: IApiKey }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(apiKey.name);
  const [isActive, setIsActive] = useState(apiKey.isActive);
  const updateApiCredential = useUpdateApiCredential();
  const deleteApiCredential = useDeleteApiCredential();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateApiCredential.mutateAsync({
      id: apiKey._id,
      name,
      isActive
    });
    setOpen(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete API credential "${apiKey.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    await deleteApiCredential.mutateAsync({ id: apiKey._id });
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalTrigger>
        <Button variant="ghost" size="icon-sm" aria-label="Edit API credential">
          <PencilLine className="size-4" />
        </Button>
      </ModalTrigger>
      <ModalContent anchor className="w-[min(100vw-2rem,26rem)] p-5">
        <form className="space-y-4" onSubmit={handleUpdate}>
          <div>
            <h3 className="text-base font-semibold">Edit credential</h3>
            <p className="text-muted-foreground text-sm">
              Update the name or toggle whether this key is active.
            </p>
          </div>

          <Field
            name="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <div>
              <Label>Active</Label>
              <p className="text-muted-foreground text-xs">
                Inactive credentials will stop working.
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteApiCredential.isPending}
            >
              {deleteApiCredential.isPending ? (
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateApiCredential.isPending}>
                {updateApiCredential.isPending ? (
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
