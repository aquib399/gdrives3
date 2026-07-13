"use client";

import { IMedia, MimeType } from "@/types/domain/system/media";
import { Modal, ModalContent, ModalTrigger } from "./modal";
import { cn } from "@/lib/utils";
import {
  FileText,
  Download,
  Maximize,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  ExternalLink
} from "lucide-react";

interface OnlyMedia {
  media: string | IMedia;
  fullUrl?: never;
  fullUrlMimeType?: never;
}

interface OnlyFullUrl {
  media?: never;
  fullUrl: string;
  fullUrlMimeType?: MimeType;
}

interface BaseProps {
  variant?: "thumbnail" | "inline";
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  aspectRatio?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
}

type RenderMediaProps = BaseProps & (OnlyMedia | OnlyFullUrl);

/** Type-guard: is the value a populated IMedia object? */
function isPopulated(m: string | IMedia): m is IMedia {
  return typeof m === "object" && m !== null && "fullUrl" in m;
}

function mimeCategory(
  mime: string
): "image" | "video" | "audio" | "document" | "archive" | "other" {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";

  if (
    mime.includes("pdf") ||
    mime.includes("word") ||
    mime.includes("spreadsheet") ||
    mime.includes("presentation") ||
    mime.startsWith("text/")
  ) {
    return "document";
  }

  if (
    mime.includes("zip") ||
    mime.includes("rar") ||
    mime.includes("tar") ||
    mime.includes("7z") ||
    mime.includes("gzip")
  ) {
    return "archive";
  }

  return "other";
}

const categoryIcon: Record<
  ReturnType<typeof mimeCategory>,
  React.ElementType
> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  document: FileText,
  archive: FileArchive,
  other: FileText
};

export function RenderMedia(props: RenderMediaProps) {
  const {
    variant = "thumbnail",
    className,
    imageClassName,
    videoClassName,
    fit = "cover",
    aspectRatio = "aspect-video",
    imgProps,
    videoProps
  } = props;

  let m: {
    mimeType: string;
    fullUrl: string;
    driveUrl: string;
    previewUrl: string;
    fileName: string;
  };

  if ("media" in props && props.media !== undefined) {
    const media = props.media;

    if (!isPopulated(media)) {
      return (
        <div
          className={cn(
            "bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
            className
          )}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate font-mono">{String(media)}</span>
        </div>
      );
    }

    m = {
      mimeType: media.mimeType,
      fullUrl: media.fullUrl,
      driveUrl: media.driveUrl || media.fullUrl,
      previewUrl: media.previewUrl || media.fullUrl,
      fileName: media.fileName || "file"
    };
  } else {
    m = {
      mimeType: props.fullUrlMimeType?.toString() || "application/octet-stream",
      fullUrl: props.fullUrl,
      driveUrl: props.fullUrl,
      previewUrl: props.fullUrl,
      fileName: props.fullUrl.split("/").pop() || "file"
    };
  }

  const cat = mimeCategory(m.mimeType);
  const Icon = categoryIcon[cat];

  // ── Inline variant ────────────────────────────────────────
  if (variant === "inline") {
    return (
      <a
        href={m.driveUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline",
          className
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{m.fileName}</span>
        <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
      </a>
    );
  }

  const fitMap: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down"
  };

  const fitClass = fitMap[fit] || "object-cover";

  switch (cat) {
    case "image":
      return (
        <Modal>
          <ModalTrigger>
            <div
              className={cn(
                "bg-muted group relative block cursor-pointer overflow-hidden rounded-xl border",
                aspectRatio,
                className
              )}
            >
              <img
                src={m.previewUrl}
                alt={m.fileName}
                {...imgProps}
                className={cn("h-full w-full", fitClass, imageClassName)}
              />
              <div className="pointer-events-none absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-black/50 backdrop-blur-sm">
                  <Maximize className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </ModalTrigger>
          <ModalContent className="flex justify-center border-none bg-transparent shadow-none">
            <img
              src={m.previewUrl}
              alt={m.fileName}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          </ModalContent>
        </Modal>
      );

    case "video":
      return (
        <Modal>
          <ModalTrigger>
            <div
              className={cn(
                "bg-muted group relative block cursor-pointer overflow-hidden rounded-xl border",
                aspectRatio,
                className
              )}
            >
              <img
                src={m.previewUrl}
                alt={m.fileName}
                className={cn("h-full w-full", fitClass, imageClassName)}
              />
              <div className="pointer-events-none absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-black/50 backdrop-blur-sm">
                  <Maximize className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </ModalTrigger>
          <ModalContent className="flex justify-center border-none bg-transparent shadow-none">
            <iframe
              src={m.driveUrl}
              className="h-[75vh] w-[85vw] max-w-5xl rounded-lg border-none"
              allow="autoplay"
            />
          </ModalContent>
        </Modal>
      );

    case "audio":
      return (
        <div
          className={cn(
            "bg-muted/30 flex flex-col gap-2 rounded-xl border p-3",
            className
          )}
        >
          <div className="flex items-center gap-2 text-sm">
            <FileAudio className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium">{m.fileName}</span>
          </div>

          <iframe
            src={m.driveUrl}
            className="h-32 w-full rounded-lg border-none bg-black/5"
            allow="autoplay"
          />
        </div>
      );

    case "document":
      return (
        <Modal>
          <ModalTrigger>
            <div
              className={cn(
                "bg-muted group relative block cursor-pointer overflow-hidden rounded-xl border",
                aspectRatio,
                className
              )}
            >
              <img
                src={m.previewUrl}
                alt={m.fileName}
                className={cn("h-full w-full", fitClass, imageClassName)}
              />
              <div className="pointer-events-none absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-black/50 backdrop-blur-sm">
                  <Maximize className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </ModalTrigger>
          <ModalContent className="flex justify-center border-none bg-transparent shadow-none">
            <iframe
              src={m.driveUrl}
              className="h-[75vh] w-[85vw] max-w-5xl rounded-lg border-none"
            />
          </ModalContent>
        </Modal>
      );

    default:
      return (
        <a
          href={m.driveUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-4 transition-colors",
            className
          )}
        >
          <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{m.fileName}</p>

            <p className="text-muted-foreground text-xs uppercase">
              {m.mimeType.split("/").pop()}
            </p>
          </div>

          <Download className="text-muted-foreground h-4 w-4 shrink-0" />
        </a>
      );
  }
}

/**
 * Convenience: renders an array of media items in a responsive grid.
 */
export function MediaGallery({
  items,
  variant = "thumbnail",
  className,
  ...restProps
}: {
  items: (string | IMedia)[];
  variant?: "thumbnail" | "inline";
  className?: string;
  imageClassName?: string;
  videoClassName?: string;
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  aspectRatio?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
}) {
  if (items.length === 0) return null;

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {items.map((m, i) => (
          <RenderMedia
            key={isPopulated(m) ? m._id : `${m}-${i}`}
            media={m}
            variant="inline"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", className)}>
      {items.map((m, i) => (
        <RenderMedia
          key={isPopulated(m) ? m._id : `${m}-${i}`}
          media={m}
          variant="thumbnail"
          {...restProps}
        />
      ))}
    </div>
  );
}
