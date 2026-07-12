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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createApiCredential.mutateAsync({ name });
    const id = response.data?.apiKey?._id;

    setOpen(false);
    setName("");

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
      <ModalContent className="w-[min(100vw-2rem,32rem)] p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-semibold">New credential</h2>
            <p className="text-muted-foreground text-sm">
              Only the display name is required. The server will generate the
              key and secret.
            </p>
          </div>

          <Field
            name="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Billing integration"
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
