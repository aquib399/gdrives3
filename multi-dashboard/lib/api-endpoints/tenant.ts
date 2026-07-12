export const TENANT_ENDPOINTS = () => {
  const version = "v1";
  const base = `/api/tenant/${version}`;
  const google = `${base}/google`;
  const auth = `${base}/auth`;
  return {
    base,
    tenant: {
      signIn: `${auth}/signin`,
      signUpSendOtp: `${auth}/signup/send-otp`,
      signUp: `${auth}/signup`,
      signOut: `${auth}/signout`,
      verifyToken: `${base}/verify-token`,
      getProfile: `${base}/profile`,
      updateProfile: `${base}/profile`
    },
    google: {
      getAuthUrl: `${google}/auth/getAuthUrl`
    },
    apiCredential: {
      list: `${base}/api-credentials`,
      get: (id: string) => `${base}/api-credentials/${id}`,
      create: `${base}/api-credentials`,
      update: (id: string) => `${base}/api-credentials/${id}`,
      delete: (id: string) => `${base}/api-credentials/${id}`
    }
  };
};
