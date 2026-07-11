export const createErrorResponse = (
  message: string,
  data: any = null
): { error: true; message: string; data: any } => {
  return { error: true, message, data };
};

export const createSuccessResponse = <T>(
  message: string,
  data: T
): { error: false; message: string; data: T } => {
  return { error: false, message, data };
};
