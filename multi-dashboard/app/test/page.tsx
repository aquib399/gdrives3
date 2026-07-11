"use client";

import { IMedia, MimeType } from "@/types/domain/system/media";
import { MediaUploader } from "@/components/upload-media";
import { useState } from "react";

export default function TestPage() {
  const [media, setMedia] = useState<IMedia | null>(null);
  const [error, setError] = useState<string | null>(null);
  function onSuccess(uploadedMedia: IMedia) {
    setMedia(uploadedMedia);
  }
  function onError(err: any) {
    setError(err.message);
  }

  return (
    <div className="p-10">
      <MediaUploader onError={onError} onSuccess={onSuccess} />

      {error && <div className="text-red-500">{error}</div>}

      <div className="mt-10 space-y-5 rounded-3xl bg-black p-10">
        <div className="text-xl font-semibold text-white">Media Data:</div>
        <pre className="text-green-500">{JSON.stringify(media, null, 2)}</pre>
      </div>
    </div>
  );
}
