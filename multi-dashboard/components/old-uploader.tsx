import { useEffect, useRef, useState, useCallback } from "react";
import * as mediaTypes from "@/types/domain/system/media";
import { TenantAPI } from "@/api/tenant";
import {
  X,
  Upload,
  FileText,
  FileAudio,
  FileImage,
  FileVideo,
  FileArchive
} from "lucide-react";

const Icons: Record<string, React.ReactNode> = {
  X: <X />,
  Upload: <Upload />,
  FileText: <FileText />,
  FileAudio: <FileAudio />,
  FileImage: <FileImage />,
  FileVideo: <FileVideo />,
  FileArchive: <FileArchive />
};

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

function useDriveUpload(props: {
  acceptMimeTypes: mediaTypes.MimeType[];
  onSuccess?: (media: mediaTypes.IMedia) => void;
  onError?: (err: any) => void;
  onProgress?: (pct: number) => void;
  disablePreview?: boolean;
  clearFileCb?: () => void;
  apiKey: string;
}) {
  const {
    acceptMimeTypes,
    onSuccess,
    apiKey,
    clearFileCb,
    disablePreview,
    onError,
    onProgress
  } = props;

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

      const { data: initData } = await TenantAPI.media.initUpload({
        payload: initPayload,
        forceReturn: true,
        toastConfig: { error: { enabled: true } },
        headers: {
          "x-api-key": apiKey
        }
      });

      if (initData.error)
        throw new Error(initData.message || "Failed to initialize upload.");
      if (!initData.data)
        throw new Error("No data returned from upload initialization.");

      const { uploadUrl, media } = initData.data;
      const uploadStartTime = Date.now();

      const googleFileId = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const uploadedBytes = event.loaded;
            const totalBytes = event.total;

            const elapsedSec = (Date.now() - uploadStartTime) / 1000;
            const bps = elapsedSec > 0 ? uploadedBytes / elapsedSec : 0;
            const remainingBytes = totalBytes - uploadedBytes;
            const etaSec = bps > 0 ? remainingBytes / bps : Infinity;

            setUploadSpeed(formatSpeed(bps));
            setTimeRemaining(formatTimeRemaining(etaSec));

            const pct = Math.round((uploadedBytes / totalBytes) * 100);
            setProgress(pct);
            onProgress?.(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.id) resolve(response.id);
              else reject(new Error("Google Drive did not return a file ID."));
            } catch (e) {
              reject(new Error("Failed to parse Google Drive response."));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(file);
      });

      const completePayload: mediaTypes.CompleteUploadPayload = {
        mediaId: media._id,
        gdriveFileId: googleFileId
      };

      const completeResponse = await TenantAPI.media.completeUpload({
        payload: completePayload,
        forceReturn: true,
        toastConfig: { error: { enabled: true } }
      });

      if (completeResponse.data.error) {
        throw new Error(
          completeResponse.data.message || "Failed to complete upload."
        );
      }

      const completeMedia = completeResponse.data.data?.media;
      if (!completeMedia)
        throw new Error("No media data returned after completing upload.");

      onSuccess?.(completeMedia);
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
  apiKey: string;
}

export function MediaUploader({
  onSuccess,
  onError,
  onProgress,
  apiKey,
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
  } = useDriveUpload({
    acceptMimeTypes,
    onSuccess,
    onError,
    onProgress,
    disablePreview,
    apiKey,
    clearFileCb: clearFile
  });

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
    if (mime.startsWith("image/"))
      return (
        <span className="flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
          {Icons.FileImage}
        </span>
      );
    if (mime.startsWith("video/"))
      return (
        <span className="flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
          {Icons.FileVideo}
        </span>
      );
    if (mime.startsWith("audio/"))
      return (
        <span className="flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
          {Icons.FileAudio}
        </span>
      );
    if (
      mime.includes("zip") ||
      mime.includes("rar") ||
      mime.includes("tar") ||
      mime.includes("7z")
    ) {
      return (
        <span className="flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
          {Icons.FileArchive}
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
        {Icons.FileText}
      </span>
    );
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
        <div
          className={`bg-card text-card-foreground cursor-pointer rounded-xl border-2 border-dashed shadow-sm transition-all ${
            dragStatus === "valid" ? "border-primary bg-primary/5" : ""
          } ${
            dragStatus === "invalid"
              ? "border-destructive bg-destructive/5 cursor-not-allowed"
              : ""
          } ${
            dragStatus === "idle"
              ? "border-muted-foreground/20 hover:border-primary/50"
              : ""
          }`}
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
              <span className="flex items-center justify-center [&>svg]:h-6 [&>svg]:w-6">
                {Icons.Upload}
              </span>
            </div>

            <div>
              <p className="font-medium">Upload media</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Drag & drop or click to browse
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="bg-card text-card-foreground relative overflow-hidden rounded-xl border shadow-sm">
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

                <div className="bg-secondary relative h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full flex-1 transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
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
                  <span className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors">
                    {formatFileSize(selectedFile.size)}
                  </span>

                  <span className="text-foreground inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
                    {selectedFile.type}
                  </span>
                </div>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
                    {Icons.X}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
