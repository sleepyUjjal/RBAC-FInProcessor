import { startTransition, useEffect, useState } from "react";
import { authApi, tokenStorage } from "../api";
import { AuthContext } from "./authContextInstance";

const normalizeUser = (profile) => {
  if (!profile) {
    return null;
  }

  const firstName = profile.first_name ?? profile.firstName ?? "";
  const lastName = profile.last_name ?? profile.lastName ?? "";
  const rawRole = String(profile.role ?? "User");
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    ...profile,
    firstName,
    lastName,
    rawRole,
    role: rawRole.toLowerCase(),
    name: fullName || profile.email || "User",
    isActive: profile.is_active ?? true,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const profile = await authApi.fetchCurrentUser();
    const normalizedUser = normalizeUser(profile);
    startTransition(() => setUser(normalizedUser));
    return normalizedUser;
  };

  const login = async (credentials) => {
    const response = await authApi.login(credentials);

    if (!response?.access) {
      throw new Error("Login response did not include an access token.");
    }

    return refreshUser();
  };

  const register = (payload) => authApi.register(payload);

  const logout = async () => {
    await authApi.logout();
    startTransition(() => setUser(null));
  };

  useEffect(() => {
    let mounted = true;

    authApi.setupAuthRefresh();

    const bootstrapAuth = async () => {
      try {
        const hasAccessToken = Boolean(tokenStorage.getAccessToken());

        if (!hasAccessToken) {
          const refreshed = await authApi.refreshAccessToken();
          if (!refreshed) {
            if (mounted) {
              setUser(null);
            }
            return;
          }
        }

        if (mounted) {
          await refreshUser();
        }
      } catch {
        tokenStorage.clearAllTokens();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
