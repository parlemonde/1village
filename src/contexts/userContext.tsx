import { useRouter } from 'next/router';
import React from 'react';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';

type UserContextFunc = Promise<{ success: boolean; errorCode: number }>;

interface UserContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login(username: string, password: string, remember: boolean): UserContextFunc;
  loginWithSso(code: string): UserContextFunc;
  signup(user: User, inviteCode?: string): UserContextFunc;
  updatePassword(user: Partial<User>): UserContextFunc;
  verifyEmail(user: Partial<User>): UserContextFunc;
  logout(): Promise<void>;
  deleteAccount(): Promise<boolean>;
  setUser: (value: React.SetStateAction<User | null>) => void;
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  isLoggedIn: false,
  login: async () => ({ success: false, errorCode: 0 }),
  loginWithSso: async () => ({ success: false, errorCode: 0 }),
  signup: async () => ({ success: false, errorCode: 0 }),
  updatePassword: async () => ({ success: false, errorCode: 0 }),
  verifyEmail: async () => ({ success: false, errorCode: 0 }),
  logout: async () => {},
  deleteAccount: async () => false,
  setUser: () => {},
});

interface UserContextProviderProps {
  user: User | null;
  setUser(user: React.SetStateAction<User | null>): void;
}

export const UserContextProvider = ({ user, setUser, children }: React.PropsWithChildren<UserContextProviderProps>) => {
  const router = useRouter();

  React.useEffect(() => {
    if (user === null && router.pathname !== '/login' && router.pathname !== '/') {
      router.push('/login');
    }
  }, [user, router]);

  /**
   * Login the user with username and password.
   * Return a number 0 -> success or not.
   * @param username
   * @param password
   * @param remember
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const login = React.useCallback(
    async (username: string, password: string, remember: boolean = false): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/login',
        data: {
          username,
          password,
          getRefreshToken: remember,
        },
        baseURL: '',
      });
      if (response.error) {
        return {
          success: false,
          errorCode: response.data?.errorCode || 0,
        };
      }

      setUser(response.data.user || null);
      return {
        success: true,
        errorCode: 0,
      };
    },
    [setUser],
  );

  const loginWithSso = React.useCallback(
    async (code: string): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/login-sso-plm',
        data: {
          code,
        },
        baseURL: '',
      });
      if (response.error) {
        return {
          success: false,
          errorCode: response.data?.errorCode || 0,
        };
      }
      setUser(response.data.user || null);
      return {
        success: true,
        errorCode: 0,
      };
    },
    [setUser],
  );

  const logout = React.useCallback(async (): Promise<void> => {
    // reject access token and server will delete cookies
    await axiosRequest({
      method: 'POST',
      url: '/logout',
      baseURL: '',
    });
    setUser(null);
    router.push('/');
  }, [router, setUser]);

  const deleteAccount = React.useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }
    const response = await axiosRequest({
      method: 'DELETE',
      url: `users/${user.id}`,
    });
    if (response.error) {
      return false;
    }
    setUser(null);
    router.push('/');
    return true;
  }, [router, user, setUser]);

  /**
   * Signup the user.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const signup = React.useCallback(
    async (user: User, inviteCode?: string): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/users',
        data: {
          inviteCode,
          ...user,
        },
      });
      if (response.error) {
        return {
          success: false,
          errorCode: response.data?.errorCode || 0,
        };
      }
      setUser(response.data.user || null);
      return {
        success: true,
        errorCode: 0,
      };
    },
    [setUser],
  );

  /**
   * Updates the user password.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const updatePassword = React.useCallback(
    async (user: Partial<User>): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/users/update-password',
        data: {
          ...user,
        },
      });
      if (response.error) {
        return {
          success: false,
          errorCode: response.data?.errorCode || 0,
        };
      }
      setUser(response.data.user || null);
      return {
        success: true,
        errorCode: 0,
      };
    },
    [setUser],
  );

  /**
   * Verifies the user email.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const verifyEmail = React.useCallback(
    async (user: Partial<User>): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/users/verify-email',
        data: {
          ...user,
        },
      });
      if (response.error) {
        return {
          success: false,
          errorCode: response.data?.errorCode || 0,
        };
      }
      setUser(response.data.user || null);
      return {
        success: true,
        errorCode: 0,
      };
    },
    [setUser],
  );

  const isLoggedIn = React.useMemo(() => user !== null, [user]);

  /**
   * Do an Axios logged request to the backend with the csrf token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */

  const value = React.useMemo(
    () => ({
      user,
      isLoggedIn,
      login,
      loginWithSso,
      signup,
      updatePassword,
      verifyEmail,
      logout,
      deleteAccount,
      setUser,
    }),
    [user, isLoggedIn, login, loginWithSso, signup, updatePassword, verifyEmail, logout, deleteAccount, setUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
