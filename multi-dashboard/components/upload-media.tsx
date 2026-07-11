import * as mediaTypes from "@/types/domain/system/media";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SystemAPI } from "@/api/system";
import { cn } from "@/lib/utils";
import {
  X,
  Upload,
  FileText,
  FileAudio,
  FileImage,
  FileVideo,
  FileArchive
} from "lucide-react";

// --- Hooks ---

function useFilePreview() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const createPreview = (file: File) => {
    if (
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/")
    ) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const setFile = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(file ? createPreview(file) : null);
  };

  return { selectedFile, previewUrl, setFile };
}

function useDragAndDrop(
  acceptMimeTypes: mediaTypes.MimeType[],
  onFileDrop: (file: File) => void
) {
  const [dragStatus, setDragStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragStatus("idle");

      const file = e.dataTransfer.files?.[0];
      if (!file || !acceptMimeTypes.includes(file.type as mediaTypes.MimeType))
        return;

      onFileDrop(file);
    },
    [acceptMimeTypes, onFileDrop]
  );

  return { dragStatus, setDragStatus, handleDrop };
}

function useMultipartUpload(
  acceptMimeTypes: mediaTypes.MimeType[],
  onSuccess?: (media: mediaTypes.IMedia) => void,
  onError?: (err: any) => void,
  onProgress?: (pct: number) => void,
  disablePreview?: boolean,
  clearFileCb?: () => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  const formatSpeed = (bytesPerSec: number): string => {
    if (bytesPerSec < 1024) return `${Math.round(bytesPerSec)} B/s`;
    if (bytesPerSec < 1024 * 1024)
      return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSec / 1024 / 1024).toFixed(2)} MB/s`;
  };

  const formatTimeRemaining = (seconds: number): string => {
    if (!isFinite(seconds) || seconds <= 0) return "calculating…";
    const buffered = Math.ceil(seconds * 1.1);
    if (buffered < 60) return `about ${buffered} s left`;
    const m = Math.floor(buffered / 60);
    const s = buffered % 60;
    return s === 0 ? `about ${m} min left` : `about ${m} m ${s} s left`;
  };

  const resetState = () => {
    setIsUploading(false);
    setProgress(0);
    setUploadSpeed("");
    setTimeRemaining("");
  };

  const uploadFile = async (file: File) => {
    if (!acceptMimeTypes.includes(file.type as mediaTypes.MimeType)) {
      onError?.(new Error("Unsupported file type."));
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setUploadSpeed("");
    setTimeRemaining("");

    try {
      const initPayload: mediaTypes.InitUploadPayload = {
        fileName: file.name,
        mimeType: file.type as any,
        sizeInBytes: file.size
      };

      const { data: initData } = await SystemAPI.media.initUpload({
        payload: initPayload,
        forceReturn: true,
        toastConfig: { error: { enabled: true } }
      });

      if (initData.error)
        throw new Error(initData.message || "Failed to initialize upload.");
      if (!initData.data)
        throw new Error("No data returned from upload initialization.");

      const { config, media } = initData.data;
      const { uploadId, partSize, urls } = config;

      const totalParts = urls.length;
      let uploadedChunks = 0;
      let uploadedBytes = 0;
      const uploadStartTime = Date.now();

      const executeChunk = async (url: string, index: number) => {
        const start = index * Number(partSize);
        const end = Math.min(start + Number(partSize), file.size);
        const chunk = file.slice(start, end);

        const s3Response = await fetch(url, {
          method: "PUT",
          body: chunk
        });

        if (!s3Response.ok) throw new Error(`Chunk ${index + 1} failed`);
        const etag = s3Response.headers.get("ETag");
        if (!etag) throw new Error("S3 ETag missing - check CORS");

        uploadedBytes += end - start;
        const elapsedSec = (Date.now() - uploadStartTime) / 1000;
        const bps = elapsedSec > 0 ? uploadedBytes / elapsedSec : 0;
        const remainingBytes = file.size - uploadedBytes;
        const etaSec = bps > 0 ? remainingBytes / bps : Infinity;

        setUploadSpeed(formatSpeed(bps));
        setTimeRemaining(formatTimeRemaining(etaSec));

        uploadedChunks++;
        const pct = Math.round((uploadedChunks / totalParts) * 100);
        setProgress(pct);
        onProgress?.(pct);

        return {
          ETag: etag.replace(/"/g, ""),
          PartNumber: index + 1
        };
      };

      // Concurrency limit of 4 to prevent network choking
      const CONCURRENCY_LIMIT = 4;
      const partPromises: Promise<{ ETag: string; PartNumber: number }>[] = [];
      const executing = new Set<Promise<any>>();

      for (let i = 0; i < urls.length; i++) {
        const p = executeChunk(urls[i], i).then((res) => {
          executing.delete(p);
          return res;
        });
        executing.add(p);
        partPromises.push(p);

        if (executing.size >= CONCURRENCY_LIMIT) {
          await Promise.race(executing);
        }
      }

      const parts = await Promise.all(partPromises);

      const completePayload: mediaTypes.CompleteUploadPayload = {
        mediaId: (media as any).id || (media as any)._id,
        uploadId,
        parts
      };

      const completeResponse = await SystemAPI.media.completeUpload({
        payload: completePayload,
        forceReturn: true,
        toastConfig: { error: { enabled: true } }
      });

      if (completeResponse.data.error) {
        throw new Error(
          completeResponse.data.message || "Failed to complete upload."
        );
      }

      const completeMedia = completeResponse.data.data;
      if (!completeMedia)
        throw new Error("No media data returned after completing upload.");

      onSuccess?.(completeMedia);

      if (disablePreview && clearFileCb) {
        clearFileCb();
      }
    } catch (err) {
      onError?.(err);
    } finally {
      resetState();
      if (disablePreview && clearFileCb) {
        clearFileCb();
      }
    }
  };

  return {
    isUploading,
    progress,
    uploadSpeed,
    timeRemaining,
    uploadFile,
    resetState
  };
}

// --- Component ---

interface MediaUploaderProps {
  onSuccess?: (media: mediaTypes.IMedia) => void;
  onError?: (err: any) => void;
  onProgress?: (pct: number) => void;
  acceptMimeTypes?: mediaTypes.MimeType[];
  disablePreview?: boolean;
}

export function MediaUploader({
  onSuccess,
  onError,
  onProgress,
  acceptMimeTypes = Object.values(mediaTypes.MimeType),
  disablePreview = false
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedFile, previewUrl, setFile } = useFilePreview();

  const clearFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setFile]);

  const {
    isUploading,
    progress,
    uploadSpeed,
    timeRemaining,
    uploadFile,
    resetState
  } = useMultipartUpload(
    acceptMimeTypes,
    onSuccess,
    onError,
    onProgress,
    disablePreview,
    clearFile
  );

  const handleFile = async (file: File) => {
    setFile(file);
    await uploadFile(file);
  };

  const { dragStatus, setDragStatus, handleDrop } = useDragAndDrop(
    acceptMimeTypes,
    handleFile
  );

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    }
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  const isImage = (file?: File | null) =>
    !!file && file.type.startsWith("image/");
  const isVideo = (file?: File | null) =>
    !!file && file.type.startsWith("video/");
  const isAudio = (file?: File | null) =>
    !!file && file.type.startsWith("audio/");

  const getFileIcon = (file: File) => {
    const mime = file.type;
    if (mime.startsWith("image/")) return <FileImage className="h-5 w-5" />;
    if (mime.startsWith("video/")) return <FileVideo className="h-5 w-5" />;
    if (mime.startsWith("audio/")) return <FileAudio className="h-5 w-5" />;
    if (
      mime.includes("zip") ||
      mime.includes("rar") ||
      mime.includes("tar") ||
      mime.includes("7z")
    ) {
      return <FileArchive className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  const handleClear = () => {
    clearFile();
    resetState();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMimeTypes.join(",")}
        onChange={handleInputChange}
        disabled={isUploading}
        className="hidden"
      />

      {!selectedFile && (
        <Card
          className={cn(
            `cursor-pointer border-2 border-dashed transition-all`,
            dragStatus === "valid" && "border-primary bg-primary/5",
            dragStatus === "invalid" &&
              "border-destructive bg-destructive/5 cursor-not-allowed",
            dragStatus === "idle" &&
              "border-muted-foreground/20 hover:border-primary/50"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            const hasValidType = Array.from(e.dataTransfer.items).some((item) =>
              acceptMimeTypes.includes(item.type as mediaTypes.MimeType)
            );
            if (!hasValidType) {
              e.dataTransfer.dropEffect = "none";
              setDragStatus("invalid");
              return;
            }
            e.dataTransfer.dropEffect = "copy";
            setDragStatus("valid");
          }}
          onDragLeave={() => setDragStatus("idle")}
          onDrop={handleDrop}
        >
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="bg-muted rounded-full p-3">
              <Upload className="h-6 w-6" />
            </div>

            <div>
              <p className="font-medium">Upload media</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Drag & drop or click to browse
              </p>
            </div>
          </div>
        </Card>
      )}

      {selectedFile && (
        <Card className="relative overflow-hidden">
          {isUploading && (
            <div className="bg-background/85 absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
              <div className="w-64 space-y-3">
                <div className="text-center">
                  <p className="font-medium">Uploading</p>
                  <p className="text-muted-foreground text-sm">
                    {progress}% completed
                  </p>
                  {uploadSpeed && (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {uploadSpeed} · {timeRemaining}
                    </p>
                  )}
                </div>

                <Progress value={progress} />
              </div>
            </div>
          )}

          {(isImage(selectedFile) || isVideo(selectedFile)) && previewUrl && (
            <div className="bg-muted aspect-video overflow-hidden">
              {isImage(selectedFile) && (
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  className="h-full w-full object-cover"
                />
              )}

              {isVideo(selectedFile) && (
                <video
                  src={previewUrl}
                  controls={!isUploading}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          )}

          <div className="p-4">
            {isAudio(selectedFile) && previewUrl && (
              <audio
                controls={!isUploading}
                src={previewUrl}
                className="mb-4 w-full"
              />
            )}

            <div className="flex items-start gap-3">
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                {getFileIcon(selectedFile)}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {formatFileSize(selectedFile.size)}
                  </Badge>

                  <Badge variant="outline" className="max-w-full truncate">
                    {selectedFile.type}
                  </Badge>
                </div>
              </div>

              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
