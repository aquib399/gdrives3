import { MimeType } from "@/types/domain/system/media";

export const getImageMimeTypes = (): MimeType[] => [
  MimeType.JPEG,
  MimeType.PNG,
  MimeType.GIF,
  MimeType.WEBP,
  MimeType.SVG,
  MimeType.BMP,
  MimeType.TIFF,
  MimeType.AVIF,
  MimeType.HEIC,
  MimeType.HEIF,
  MimeType.ICO,
  MimeType.APNG,
  MimeType.JP2
];

export const getVideoMimeTypes = (): MimeType[] => [
  MimeType.MP4,
  MimeType.WEBM,
  MimeType.OGG_VIDEO,
  MimeType.QUICKTIME,
  MimeType.AVI,
  MimeType.MKV,
  MimeType.MPEG,
  MimeType.THREE_GPP,
  MimeType.THREE_GPP2,
  MimeType.FLV,
  MimeType.WMV,
  MimeType.M4V,
  MimeType.TS
];

export const getAudioMimeTypes = (): MimeType[] => [
  MimeType.AAC,
  MimeType.MPEG_AUDIO,
  MimeType.WAV,
  MimeType.OGG_AUDIO,
  MimeType.M4A,
  MimeType.FLAC,
  MimeType.OPUS,
  MimeType.MIDI,
  MimeType.WEBA,
  MimeType.AMR,
  MimeType.AIF,
  MimeType.WMA
];

export const getDocumentMimeTypes = (): MimeType[] => [
  MimeType.PDF,
  MimeType.TXT,
  MimeType.CSV,
  MimeType.HTML,
  MimeType.CSS,
  MimeType.XML,
  MimeType.JSON,
  MimeType.YAML,
  MimeType.DOC,
  MimeType.DOCX,
  MimeType.XLS,
  MimeType.XLSX,
  MimeType.PPT,
  MimeType.PPTX,
  MimeType.ODT,
  MimeType.ODS,
  MimeType.ODP
];

export const getArchiveMimeTypes = (): MimeType[] => [
  MimeType.ZIP,
  MimeType.RAR,
  MimeType.SEVEN_Z,
  MimeType.TAR,
  MimeType.GZIP,
  MimeType.BZIP2
];

export const getFontMimeTypes = (): MimeType[] => [
  MimeType.TTF,
  MimeType.OTF,
  MimeType.WOFF,
  MimeType.WOFF2
];

export const getSubtitleMimeTypes = (): MimeType[] => [
  MimeType.VTT,
  MimeType.SRT
];

export const getTextMimeTypes = (): MimeType[] => [
  MimeType.TXT,
  MimeType.CSV,
  MimeType.HTML,
  MimeType.CSS,
  MimeType.XML,
  MimeType.JSON,
  MimeType.YAML
];

export const getOfficeMimeTypes = (): MimeType[] => [
  MimeType.DOC,
  MimeType.DOCX,
  MimeType.XLS,
  MimeType.XLSX,
  MimeType.PPT,
  MimeType.PPTX
];

export const getOpenDocumentMimeTypes = (): MimeType[] => [
  MimeType.ODT,
  MimeType.ODS,
  MimeType.ODP
];

export const isImageMimeType = (mimeType: string): boolean =>
  getImageMimeTypes().includes(mimeType as MimeType);

export const isVideoMimeType = (mimeType: string): boolean =>
  getVideoMimeTypes().includes(mimeType as MimeType);

export const isAudioMimeType = (mimeType: string): boolean =>
  getAudioMimeTypes().includes(mimeType as MimeType);

export const isDocumentMimeType = (mimeType: string): boolean =>
  getDocumentMimeTypes().includes(mimeType as MimeType);
