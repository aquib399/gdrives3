import { BaseEntity } from "@/types/base-entity";
import type { PaginatedResponse } from "@/types/pagination";
export type {
  CompleteUploadPayload,
  InitUploadPayload
} from "@/validations/v1/system/media/index";

export enum MimeType {
  // Images
  JPEG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  WEBP = "image/webp",
  SVG = "image/svg+xml",
  BMP = "image/bmp",
  TIFF = "image/tiff",
  AVIF = "image/avif",
  HEIC = "image/heic",
  HEIF = "image/heif",
  ICO = "image/x-icon",
  APNG = "image/apng",
  JP2 = "image/jp2",

  // Videos
  MP4 = "video/mp4",
  WEBM = "video/webm",
  OGG_VIDEO = "video/ogg",
  QUICKTIME = "video/quicktime",
  AVI = "video/x-msvideo",
  MKV = "video/x-matroska",
  MPEG = "video/mpeg",
  THREE_GPP = "video/3gpp",
  THREE_GPP2 = "video/3gpp2",
  FLV = "video/x-flv",
  WMV = "video/x-ms-wmv",
  M4V = "video/x-m4v",
  TS = "video/mp2t",

  // Audio
  AAC = "audio/aac",
  MPEG_AUDIO = "audio/mpeg",
  WAV = "audio/wav",
  OGG_AUDIO = "audio/ogg",
  M4A = "audio/mp4",
  FLAC = "audio/flac",
  OPUS = "audio/opus",
  MIDI = "audio/midi",
  WEBA = "audio/webm",
  AMR = "audio/amr",
  AIF = "audio/aiff",
  WMA = "audio/x-ms-wma",

  // Documents
  PDF = "application/pdf",
  TXT = "text/plain",
  CSV = "text/csv",
  HTML = "text/html",
  CSS = "text/css",
  XML = "application/xml",
  JSON = "application/json",
  YAML = "application/yaml",

  // Microsoft Office
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLS = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PPT = "application/vnd.ms-powerpoint",
  PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // OpenDocument
  ODT = "application/vnd.oasis.opendocument.text",
  ODS = "application/vnd.oasis.opendocument.spreadsheet",
  ODP = "application/vnd.oasis.opendocument.presentation",

  // Archives
  ZIP = "application/zip",
  RAR = "application/vnd.rar",
  SEVEN_Z = "application/x-7z-compressed",
  TAR = "application/x-tar",
  GZIP = "application/gzip",
  BZIP2 = "application/x-bzip2",

  // Fonts
  TTF = "font/ttf",
  OTF = "font/otf",
  WOFF = "font/woff",
  WOFF2 = "font/woff2",

  // Subtitles
  VTT = "text/vtt",
  SRT = "application/x-subrip",

  // Other
  OCTET_STREAM = "application/octet-stream"
}

export enum MediaUploadingStatus {
  FAILED = "FAILED",
  UPLOADING = "UPLOADING",
  COMPLETED = "COMPLETED"
}

export interface IMedia extends BaseEntity {
  fileName: string;
  fullUrl: string;
  previewUrl: string;
  mimeType: MimeType;
  gdriveFileId?: string;
  sizeInBytes: number;
  uploadingStatus: MediaUploadingStatus;
}

export interface GetMediaResponse {
  media: IMedia;
}

export interface UpdateMediaPayload {
  id: string;
  fileName?: string;
}

export interface UpdateMediaResponse {
  media: IMedia;
}

export interface DeleteMediaResponse {
  mediaId: string;
}

export type ListMediaResponse = PaginatedResponse<IMedia>;

export type InitUploadResponse = {
  uploadUrl: string;
  media: IMedia;
};

export interface MultipartUploadResult {
  uploadId: string;
  key: string;
  partSize: number;
  urls: string[];
}
export type CompleteUploadResponse = { media: IMedia };

export interface UploadMediaProps {
  file: File;
  thumbnailUrl?: string;
  onProgress: (pct: number) => void;
}
