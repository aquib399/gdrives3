"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { MediaUploader } from "@/components/upload-media";

export function CreateMediaButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalTrigger>
        <Button size="lg" className="shrink-0">
          Upload media
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[min(100vw-2rem,44rem)] p-4">
        <MediaUploader
          onSuccess={async (media) => {
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["tenant", "list", "media"]
            });
            router.push(`/tenant/files/${media._id}`);
          }}
          onError={() => undefined}
        />
      </ModalContent>
    </Modal>
  );
}
