import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Student } from 'types/student.type';
import type { User, UserForm } from 'types/user.type';
import { UserType } from 'types/user.type';

type UserContextFunc = Promise<{ success: boolean; errorCode: number }>;

interface UserContextValue {
  user: User | null;
  selectedStudent: number;
  isLoggedIn: boolean;
  login(username: string, password: string, remember: boolean): UserContextFunc;
  loginWithSso(code: string): UserContextFunc;
  signup(user: UserForm, inviteCode?: string): UserContextFunc;
  updatePassword(user: Partial<User>): UserContextFunc;
  verifyEmail(user: Partial<User>): UserContextFunc;
  logout(): Promise<void>;
  deleteAccount(): Promise<boolean>;
  setUser: (value: React.SetStateAction<User | null>) => void;
  setSelectedStudent(student: Student | null): void;
  linkStudent(hashedCode: string): UserContextFunc;
  linkedStudents(hashedCode: string, firstname: string, lastname: string): UserContextFunc;
  getLinkedStudentsToUser(userId: number): Promise<Student[]>;
  deleteLinkedStudent(userId: number, studentId: number): UserContextFunc;
  students: Student[];
  getClassroomAsFamily(userId: number): UserContextFunc;
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  selectedStudent: 1,
  isLoggedIn: false,
  login: async () => ({ success: false, errorCode: 0 }),
  loginWithSso: async () => ({ success: false, errorCode: 0 }),
  signup: async () => ({ success: false, errorCode: 0 }),
  updatePassword: async () => ({ success: false, errorCode: 0 }),
  verifyEmail: async () => ({ success: false, errorCode: 0 }),
  logout: async () => {},
  deleteAccount: async () => false,
  setUser: () => {},
  setSelectedStudent: () => {},
  linkStudent: async () => ({ success: false, errorCode: 0 }),
  linkedStudents: async () => ({ success: false, errorCode: 0 }),
  getLinkedStudentsToUser: async () => [] as Student[],
  students: [],
  deleteLinkedStudent: async () => ({ success: false, errorCode: 0 }),
  getClassroomAsFamily: async () => ({ success: false, errorCode: 0 }),
});

interface UserContextProviderProps {
  user: User | null;
  setUser(user: React.SetStateAction<User | null>): void;
}

export const UserContextProvider = ({ user, setUser, children }: React.PropsWithChildren<UserContextProviderProps>) => {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = React.useState<number>(1);

  React.useEffect(() => {
    if (
      user === null &&
      router.pathname !== '/' &&
      router.pathname !== '/inscription' &&
      router.pathname !== '/connexion' &&
      router.pathname !== '/login' &&
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
    async (email: string, password: string, remember: boolean = false): Promise<{ success: boolean; errorCode: number }> => {
      const response = await axiosRequest({
        method: 'POST',
        url: '/login',
        data: {
          email,
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
    async (user: UserForm, inviteCode?: string): Promise<{ success: boolean; errorCode: number }> => {
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

  /**
   * Function to associate a child for user Parents
   * @param hashedCode string code givent to parent
   */
  const linkStudent = React.useCallback(async (hashedCode: string) => {
    const response = await axiosRequest({
      method: 'POST',
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
  }, []);

  /**
   * Get the user's linked student
   */
  const getLinkedStudentsToUser = React.useCallback(
    async (userId: number) => {
      try {
        if (!user) return [];
        const response = await axiosRequest({
          method: 'GET',
          url: `/users/${userId}/linked-students`,
        });
        return response.data as Student[];
      } catch (error) {
        console.error('Error fetching linked students:', error);
        return [];
      }
    },
    [user],
  );

  const deleteLinkedStudent = React.useCallback(async (userId: number, studentId: number) => {
    return axiosRequest({
      method: 'DELETE',
      url: `/users/${userId}/linked-students/${studentId}`,
    })
      .then((response) => {
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
      })
      .catch((error) => {
        console.error("Une erreur s'est produite lors de la suppression du lien avec l'élève :", error);
        return {
          success: false,
          errorCode: 0,
        };
      });
  }, []);
  const isLoggedIn = React.useMemo(() => user !== null, [user]);

  /**
   * Do an Axios logged request to the backend with the csrf token.
   * @param req
   * @returns {Promise<{data, pending, error, complete}>}
   */

  /**
   * Get classroom as familly
   */
  const getClassroomAsFamily = React.useCallback(
    async (userId: number) => {
      if (!user) return;
      if (user.type !== UserType.FAMILY) return;
      const response = await axiosRequest({
        method: 'GET',
        url: `/users/get-classroom/${userId}`,
      });
      if (response.error) return null;
      if (response.data === null) return null;
      return response.data;
    },
    [user],
  );

  useEffect(() => {
    console.log('user===', user);
  }, [user]);

  const value = React.useMemo(
    () => ({
      user,
      selectedStudent,
      isLoggedIn,
      login,
      loginWithSso,
      signup,
      updatePassword,
      verifyEmail,
      logout,
      deleteAccount,
      setUser,
      setSelectedStudent,
      linkStudent,
      getLinkedStudentsToUser,
      deleteLinkedStudent,
      getClassroomAsFamily,
    }),
    [
      user,
      selectedStudent,
      isLoggedIn,
      login,
      loginWithSso,
      signup,
      updatePassword,
      verifyEmail,
      logout,
      deleteAccount,
      setUser,
      setSelectedStudent,
      linkStudent,
      getLinkedStudentsToUser,
      deleteLinkedStudent,
      getClassroomAsFamily,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
