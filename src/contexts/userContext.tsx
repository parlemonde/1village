import type { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

import type { AxiosReturnType } from 'src/utils/axiosRequest';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { User, UserForm } from 'types/user.type';

type UserContextFunc = Promise<{ success: boolean; errorCode: number }>;

interface UserContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login(username: string, password: string, remember: boolean): UserContextFunc;
  loginWithSso(code: string): UserContextFunc;
  axiosLoggedRequest(req: AxiosRequestConfig): Promise<AxiosReturnType>;
  signup(user: UserForm, inviteCode?: string): UserContextFunc;
  updatePassword(user: Partial<User>): UserContextFunc;
  verifyEmail(user: Partial<User>): UserContextFunc;
  logout(): Promise<void>;
  deleteAccount(): Promise<boolean>;
  setUser: (value: React.SetStateAction<User | null>) => void;
  linkStudent(hashedCode: string): UserContextFunc;
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  isLoggedIn: false,
  login: async () => ({ success: false, errorCode: 0 }),
  loginWithSso: async () => ({ success: false, errorCode: 0 }),
  axiosLoggedRequest: async () => ({ data: null, error: true, status: 500 }),
  signup: async () => ({ success: false, errorCode: 0 }),
  updatePassword: async () => ({ success: false, errorCode: 0 }),
  verifyEmail: async () => ({ success: false, errorCode: 0 }),
  logout: async () => {},
  deleteAccount: async () => false,
  setUser: () => {},
  linkStudent: async () => ({ success: false, errorCode: 0 }),
});

interface UserContextProviderProps {
  user: User | null;
  setUser(user: React.SetStateAction<User | null>): void;
  csrfToken: string;
}

export const UserContextProvider = ({ user, setUser, csrfToken, children }: React.PropsWithChildren<UserContextProviderProps>) => {
  const router = useRouter();
  const headers = React.useMemo(
    () => ({
      'csrf-token': csrfToken,
    }),
    [csrfToken],
  );

  React.useEffect(() => {
    if (
      user === null &&
      router.pathname !== '/' &&
      router.pathname !== '/inscription' &&
      router.pathname !== '/connexion' &&
      router.pathname !== '/professeur' &&
      router.pathname !== '/user-verified' &&
      router.pathname !== '/reset-password' &&
      router.pathname !== '/update-password'
    )
      router.push('/');
  }, [user, router]);

  /**
   * Login the user with username and password.
   * Return a number 0 -> success or not.
   * @param username
   * @param password
   * @param remember
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  //reset-password
  const login = React.useCallback(
    async (username: string, password: string, remember: boolean = false): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/login',
        headers,
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
    [headers, setUser],
  );

  const loginWithSso = React.useCallback(
    async (code: string): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/login-sso-plm',
        headers,
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
    [headers, setUser],
  );

  const logout = React.useCallback(async (): Promise<void> => {
    // reject access token and server will delete cookies
    await axiosRequest({
      method: 'POST',
      headers,
      url: '/logout',
      baseURL: '',
    });
    setUser(null);
    router.push('/');
  }, [headers, router, setUser]);

  const deleteAccount = React.useCallback(async (): Promise<boolean> => {
    if (!user) {
      return false;
    }
    const response = await axiosRequest({
      method: 'DELETE',
      headers,
      url: `users/${user.id}`,
    });
    if (response.error) {
      return false;
    }
    setUser(null);
    router.push('/');
    return true;
  }, [router, user, headers, setUser]);

  /**
   * Signup the user.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const signup = React.useCallback(
    async (user: UserForm, inviteCode?: string): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        headers,
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
    [headers, setUser],
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
        headers,
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
    [headers, setUser],
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
        headers,
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
    [headers, setUser],
  );

  /**
   * Function to associate a child for user Parents
   * @param hashedCode string code givent to parent
   */
  const linkStudent = React.useCallback(
    async (hashedCode: string) => {
      const response = await axiosRequest({
        method: 'POST',
        headers,
        url: '/students/link-student',
        data: {
          hashedCode,
        },
      });
      if (response.error) {
        return {
          success: false,
          errorCode: response.data?.errorCode || 0,
        };
      }
      return {
        success: true,
        errorCode: 0,
      };
    },
    [headers],
  );

  const isLoggedIn = React.useMemo(() => user !== null, [user]);

  /**
   * Do an Axios logged request to the backend with the csrf token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */
  const axiosLoggedRequest = React.useCallback(
    async (req: AxiosRequestConfig): Promise<AxiosReturnType> => {
      const response = await axiosRequest({
        ...req,
        headers: {
          ...headers,
          ...(req.headers ?? {}),
        },
      });
      // if (response.error) ...
      return response;
    },
    [headers],
  );

  const value = React.useMemo(
    () => ({
      user,
      isLoggedIn,
      login,
      loginWithSso,
      axiosLoggedRequest,
      signup,
      updatePassword,
      verifyEmail,
      logout,
      deleteAccount,
      setUser,
      linkStudent,
    }),
    [user, isLoggedIn, login, loginWithSso, axiosLoggedRequest, signup, updatePassword, verifyEmail, logout, deleteAccount, setUser, linkStudent],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
