import React from 'react';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';
import type { Classroom } from 'types/classroom.type';
import { UserType } from 'types/user.type';

interface ClassroomContextValue {
  classroom: Classroom | null;
  setClassroom: (value: React.SetStateAction<Classroom | null>) => void;
  getClassroom(): Promise<void>;
  updateClassroomParameters(data: ClassroomUpdateData): Promise<void>;
}

export const ClassroomContext = React.createContext<ClassroomContextValue>({
  classroom: null,
  setClassroom: () => {},
  getClassroom: async () => {},
  updateClassroomParameters: async () => {},
});

interface ClassroomContextProviderProps {
  classroom: Classroom | null;
  setClassroom(value: React.SetStateAction<Classroom | null>): void;
}

//TODO : il faut alimenter le ClassroomContext avec les fonctions

export const ClassroomContextProvider = ({ classroom, setClassroom, children }: React.PropsWithChildren<ClassroomContextProviderProps>) => {
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  console.log({ classroom });
  /**
   * Creation of the classroom
   */
  const createClassroom = React.useCallback(async () => {
    if (user?.type !== UserType.TEACHER) return;
    if (!village) return;
    await axiosLoggedRequest({
      method: 'POST',
      url: '/classrooms',
      data: {
        userId: user.id,
        villageId: village.id,
      },
    })
      .then((response) => {
        setClassroom(response.data.classroom);
        console.log({ response });
        return response.data.classroom;
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // * Classroom is create automatically for all teacher if it does not exit already
  React.useEffect(() => {
    if (classroom === null) {
      createClassroom();
    }
  }, [classroom, createClassroom]);

  /**
   * Get teacher's classroom
   */
  // * Might be useless if I have a classroom object
  const getClassroom = React.useCallback(async () => {
    if (user?.type !== UserType.TEACHER) return;
    await axiosLoggedRequest({
      method: 'GET',
      url: `/classrooms/${user.id}`,
    })
      .then((response) => {
        return response.data.classroom;
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Update teacher's classroom Parameters
   */
  const updateClassroomParameters = React.useCallback(async (data: ClassroomUpdateData) => {
    if (user?.type !== UserType.TEACHER) return;
    await axiosLoggedRequest({
      method: 'PUT',
      url: `/classrooms/${user.id}`,
      data: { ...data },
    })
      .then((response) => {
        return response.data.classroom;
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TODO : les fonctions sont à titre d'exemple ci-dessous
  /**
   * Set the list of students in the classrom
   */
  const setStudentList = React.useCallback(() => {}, []);

  /**
   * Get the list of students in the classroom
   */
  const getStudentList = React.useCallback(() => {}, []);

  /**
   * Delete an access for a relative's student
   */
  const deleteAccessTorRelatives = React.useCallback(() => {}, []);

  const value = React.useMemo(
    () => ({
      classroom,
      getClassroom,
      setClassroom,
      updateClassroomParameters,
      // setStudentList,
      // getStudentList,
      // deleteAccessTorRelatives,
    }),
    [classroom, getClassroom, setClassroom, updateClassroomParameters],
  );
  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>;
};

interface ClassroomUpdateData {
  name?: string;
  avatar?: string;
  delayedDays?: number;
  hasVisibilitySetToClass?: boolean;
}
