import { model, Types, Document, Schema, HydratedDocument } from "mongoose";
import { BaseEntity } from "./base.js";

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
  mimeType: MimeType;
  sizeInBytes: number;
  uploadingStatus: MediaUploadingStatus;
}

export type IMediaDocument = HydratedDocument<IMedia>;

const MediaSchema = new Schema<IMedia>(
  {
    fileName: { type: String, required: true },
    fullUrl: { type: String, required: true },
    mimeType: { type: String, required: true, enum: Object.values(MimeType) },
    sizeInBytes: { type: Number, required: true },
    uploadingStatus: {
      type: String,
      required: true,
      enum: Object.values(MediaUploadingStatus),
      default: MediaUploadingStatus.UPLOADING
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Media = model<IMedia>("Media", MediaSchema);
