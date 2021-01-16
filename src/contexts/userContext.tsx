import type { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import React from "react";

import { AxiosReturnType, axiosRequest } from "src/utils/axiosRequest";
import type { User } from "types/user.type";

type UserContextFunc = Promise<{ success: boolean; errorCode: number }>;

interface UserContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login(username: string, password: string, remember: boolean): UserContextFunc;
  axiosLoggedRequest(req: AxiosRequestConfig): Promise<AxiosReturnType>;
  signup(user: User, inviteCode?: string): UserContextFunc;
  updatePassword(user: Partial<User>): UserContextFunc;
  verifyEmail(user: Partial<User>): UserContextFunc;
  logout(): Promise<void>;
  deleteAccount(): Promise<boolean>;
  setUser: (value: React.SetStateAction<User | null>) => void;
}

export const UserContext = React.createContext<UserContextValue>(undefined);

interface UserContextProviderProps {
  user: User | null;
  setUser(user: React.SetStateAction<User | null>): void;
  csrfToken: string;
  children: React.ReactNode;
}

export const UserContextProvider: React.FunctionComponent<UserContextProviderProps> = ({
  user,
  setUser,
  csrfToken,
  children,
}: UserContextProviderProps) => {
  const router = useRouter();
  const headers = React.useMemo(
    () => ({
      "csrf-token": csrfToken,
    }),
    [csrfToken],
  );

  React.useEffect(() => {
    if (user === null && router.pathname !== "/login" && router.pathname !== "/") {
      router.push("/login");
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
  const login = async (username: string, password: string, remember: boolean = false): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      url: "/login",
      headers,
      data: {
        username,
        password,
        getRefreshToken: remember,
      },
      baseURL: "",
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
  };

  const logout = async (): Promise<void> => {
    // reject access token and server will delete cookies
    await axiosRequest({
      method: "POST",
      headers,
      url: "/logout",
      baseURL: "",
    });
    setUser(null);
    router.push("/");
  };

  const deleteAccount = async (): Promise<boolean> => {
    const response = await axiosRequest({
      method: "DELETE",
      headers,
      url: `users/${user.id}`,
    });
    if (response.error) {
      return false;
    }
    setUser(null);
    router.push("/");
    return true;
  };

  /**
   * Signup the user.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const signup = async (user: User, inviteCode?: string): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      headers,
      url: "/users",
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
  };

  /**
   * Updates the user password.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const updatePassword = async (user: Partial<User>): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      headers,
      url: "/users/update-password",
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
  };

  /**
   * Verifies the user email.
   * Return a number 0 -> success or not.
   * @param user
   * @returns {Promise<{success: boolean, errorCode: number}>}
   */
  const verifyEmail = async (user: Partial<User>): Promise<{ success: boolean; errorCode: number }> => {
    const response = await axiosRequest({
      method: "POST",
      headers,
      url: "/users/verify-email",
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
  };

  /**
   * Do an Axios logged request to the backend with the csrf token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */
  const axiosLoggedRequest = React.useCallback(
    async (req: AxiosRequestConfig): Promise<AxiosReturnType> => {
      const response = await axiosRequest({
        ...req,
        headers,
      });
      // if (response.error) ...
      return response;
    },
    [headers],
  );

  const isLoggedIn = user !== null;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        axiosLoggedRequest,
        signup,
        updatePassword,
        verifyEmail,
        logout,
        deleteAccount,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
