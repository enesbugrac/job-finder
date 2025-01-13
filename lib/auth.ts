export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
};
