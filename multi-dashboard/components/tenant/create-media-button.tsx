"use client";

import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { MediaUploader } from "@/components/uploader";
import { useApiCredentialList } from "@/hooks/api/tenant";
import { IApiKey } from "@/types/domain/api-credential";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Combobox, { SearchResult } from "../combo-box";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { Label } from "../ui/label";

export function CreateMediaButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] =
    useState<SearchResult<IApiKey> | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const onSelect = useCallback((item: SearchResult<IApiKey>) => {
    setSearch(item.title);
    setSelectedItem(item);
  }, []);

  const { data, isPending, error } = useApiCredentialList({
    queryParams: { search: debouncedSearch }
  });

  const results = data?.data?.results;

  const parsedResults: SearchResult<IApiKey>[] = useMemo(() => {
    const r: SearchResult<IApiKey>[] =
      results?.map((item) => ({
        data: item,
        id: item._id,
        description: item.folderName,
        title: item.name,
        is_disabled: !item.isActive,
        disabled_reason: item.isActive ? undefined : "This API key is inactive"
      })) || [];
    return r || [];
  }, [results]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalTrigger>
        <Button size="lg" className="shrink-0">
          Upload media
        </Button>
      </ModalTrigger>
      <ModalContent className="w-[min(100vw-2rem,44rem)] p-4">
        {selectedItem && (
          <MediaUploader
            apiKey={selectedItem?.data.key}
            onSuccess={async (media) => {
              setOpen(false);
              queryClient.invalidateQueries({
                queryKey: ["tenant", "list", "media"]
              });
            }}
            onError={() => undefined}
          />
        )}

        <div className="mt-4 space-y-1.5">
          <Label>Select API Key</Label>
          <Combobox
            onChange={setSearch}
            onSelect={onSelect}
            searchResults={parsedResults}
            value={search}
            states={{
              error: error?.message,
              loading: isPending
            }}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
