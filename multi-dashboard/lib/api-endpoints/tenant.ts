export const TENANT_ENDPOINTS = () => {
  const version = "v1";
  const base = `/api/tenant/${version}`;
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
    }
  };
};
