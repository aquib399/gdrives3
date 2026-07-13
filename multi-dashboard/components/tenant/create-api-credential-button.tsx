"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/field";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { useCreateApiCredential } from "@/hooks/api/tenant";

export function CreateApiCredentialButton() {
  const router = useRouter();
  const createApiCredential = useCreateApiCredential();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [folderName, setFolderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createApiCredential.mutateAsync({
      name,
      folderName
    });
    const id = response.data?.apiKey?._id;

    setOpen(false);
    setName("");
    setFolderName("");

    if (id) {
      router.push(`/tenant/credentials/${id}`);
    }
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalTrigger>
        <Button size="lg" className="shrink-0">
          <Plus className="size-4" />
          Create API Credential
        </Button>
      </ModalTrigger>
      <ModalContent anchor className="w-80 p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-semibold">New credential</h2>
          </div>

          <Field
            name="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Billing integration"
          />

          <Field
            name="folderName"
            label="Google Drive Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. billing_uploads"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createApiCredential.isPending}>
              {createApiCredential.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
