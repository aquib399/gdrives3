export const SYSTEM_ENDPOINTS = () => {
  const version = "v1";
  const base = `/api/system/${version}`;

  const media = `${base}/media`;

  return {
    base,
    media: {
      initUpload: `${media}/init`,
      completeUpload: `${media}/complete`
    }
  };
};
