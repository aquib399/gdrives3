export const ADMIN_ENDPOINTS = () => {
  const version = "v1";
  const base = `/api/admin/${version}`;

  const tenant = `${base}/tenant`;
  return {
    base,
    admin: {
      // without auth
      signIn: `${base}/auth/signin`,
      signUp: `${base}/auth/signup`,
      signOut: `${base}/auth/signout`,

      // with auth
      verifyToken: `${base}/verify-token`,
      getProfile: `${base}/profile`,
      updateProfile: `${base}/profile`
    },
    tenant: {
      list: `${tenant}`,
      get: (tenantId: string) => `${tenant}/${tenantId}`
    }
  };
};
