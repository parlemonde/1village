import React from 'react';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { Classroom, ClassroomAsFamilly } from 'types/classroom.type';
import type { Country } from 'types/country.type';
import type { Student, StudentForm } from 'types/student.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

interface ClassroomContextValue {
  classroom: Classroom | null;
  setClassroom: (value: React.SetStateAction<Classroom | null>) => void;
  parentClassroom: ClassroomAsFamilly | null;
  setParentClassroom: (value: React.SetStateAction<ClassroomAsFamilly | null>) => void;
  getClassroom(): Promise<void>;
  updateClassroomParameters(data: ClassroomUpdateData): Promise<void>;
  createStudent({ firstname, lastname }: StudentForm): Promise<void>;
  deleteStudent(id: number): Promise<void>;
  students: Student[];
  setStudents: (value: React.SetStateAction<Student[]>) => void;
  /*   getOneStudent(): Promise<void>; */
}
export const ClassroomContext = React.createContext<ClassroomContextValue>({
  classroom: null,
  setClassroom: () => {},
  parentClassroom: null,
  setParentClassroom: () => {},
  getClassroom: async () => {},
  updateClassroomParameters: async () => {},
  createStudent: async () => {},
  deleteStudent: async () => {},
  students: [],
  /*   getOneStudent: async () => {}, */
  setStudents: async () => {},
});

interface ClassroomContextProviderProps {
  children: React.ReactNode;
}

export const ClassroomContextProvider = ({ children }: ClassroomContextProviderProps) => {
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [classroom, setClassroom] = React.useState<Classroom | null>(null);
  const [parentClassroom, setParentClassroom] = React.useState<ClassroomAsFamilly | null>(null);

  const fetchClassroom = React.useCallback(async (user: User) => {
    if (user.type === UserType.TEACHER) {
      const response = await axiosRequest({
        method: 'GET',
        url: `/classrooms/${user.id}`,
      });
      if (response.error) return null;
      if (response.data === null) return null;
      return response.data;
    }

    if (user.type === UserType.FAMILY) {
      const response = await axiosRequest({
        method: 'GET',
        url: `/users/get-classroom/${user.id}`,
      });
      if (response.error) return null;
      if (response.data === null) return null;
      return response.data;
    }
  }, []);

  /**
   * Creation of the classroom
   */
  const createClassroom = React.useCallback(async () => {
    if (!user) return;
    if (user.type !== UserType.TEACHER) return;
    if (!village) return;
    await axiosRequest({
      method: 'POST',
      url: '/classrooms',
      data: {
        userId: user.id,
        villageId: village.id,
        countryCode: user.country?.isoCode,
      },
    })
      .then((response) => {
        setClassroom(response.data.classroom);
        return response.data.classroom;
      })
      .catch((err) => {
        return err.message;
      });
  }, [user, village]);

  /**
   * Get the list of students in the classroom
   * @param {number} classroomId classroom id
   */
  const getStudents = React.useCallback(async (classroomId: number) => {
    await axiosRequest({
      method: 'GET',
      url: `/students${serializeToQueryUrl({
        classroomId,
      })}`,
    })
      .then((response) => {
        setStudents(response.data as Student[]);
      })
      .catch((err) => {
        return err.message;
      });
  }, []);

  /**
   * Get teacher's classroom
   */
  const getClassroom = React.useCallback(async () => {
    if (!user) return;
    if (user.type !== UserType.TEACHER) return;
    await axiosRequest({
      method: 'GET',
      url: `/classrooms/${user.id}`,
    })
      .then((response) => {
        return response.data.classroom;
      })
      .catch((err) => {
        return err.message;
      });
  }, [user]);

  /**
   * Update teacher's classroom Parameters
   */
  const updateClassroomParameters = React.useCallback(
    async (data: ClassroomUpdateData) => {
      if (!user) return;
      if (user.type !== UserType.TEACHER) return;
      await axiosRequest({
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
    },
    [user],
  );

  /**
   * Add new students in the classrom
   */
  const createStudent = React.useCallback(
    async ({ firstname, lastname }: StudentForm) => {
      if (!user) return;
      if (user.type !== UserType.TEACHER) return;
      if (!classroom) return;
      if (!firstname && !lastname) return;

      await axiosRequest({
        method: 'POST',
        url: '/students',
        data: {
          classroomId: classroom.id,
          firstname,
          lastname,
        },
      })
        .then((response) => {
          setStudents([...students, response.data]);
        })
        .catch((err) => {
          return err.message;
        });
    },
    [classroom, students, user],
  );

  /**
   * Update one student
   */
  // const setStudent = React.useCallback(async (data: ClassroomUpdateData) => {
  //   if (user?.type !== UserType.TEACHER) return;
  //   await axiosRequest({
  //     method: 'PUT',
  //     url: `/students/${student.id}`,
  //     data: { ...data },
  //   })
  //     .then((response) => {
  //       return response.data.classroom;
  //     })
  //     .catch((err) => {
  //       return err.message;
  //     });
  // }, []);

  // const getOneStudent = React.useCallback(
  //   async (id: number) => {
  //     await axiosRequest({
  //       method: 'GET',
  //       url: `/students/${id}`,
  //     })
  //       .then((response) => {
  //         return response.data as Student;
  //       })
  //       .catch((err) => {
  //         return err.message;
  //       });
  //   },
  //   [],
  // );

  const deleteStudent = React.useCallback(
    async (studentId: number) => {
      if (!user) return;
      if (user.type !== UserType.TEACHER) return;
      if (!classroom) return;
      await axiosRequest({
        method: 'DELETE',
        url: `/students/${studentId}`,
      })
        .then(() => {
          const newStudents = students.filter((student) => student.id !== studentId);
          setStudents([...newStudents]);
        })
        .catch((err) => {
          return err.message;
        });
    },
    [classroom, students, user],
  );

  /**
   * Delete an access for a relative's student
   */
  // const deleteAccessTorRelatives = React.useCallback(() => {}, []);

  // * Classroom is create automatically for all teacher if it does not exit already
  React.useEffect(() => {
    if (user && user.type !== UserType.FAMILY) {
      fetchClassroom(user)
        .then((classroom) => {
          setClassroom(classroom);
          if (students.length === 0) {
            getStudents(classroom.id);
          }
        })
        .catch(() => {
          createClassroom();
        });
    } else {
      if (user) {
        fetchClassroom(user)
          .then((classroom) => {
            setParentClassroom(classroom);
          })
          .catch();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createClassroom, fetchClassroom, getStudents, user]);

  const value = React.useMemo(
    () => ({
      classroom,
      setClassroom,
      parentClassroom,
      setParentClassroom,
      getClassroom,
      updateClassroomParameters,
      students,
      setStudents,
      //getOneStudent,
      createStudent,
      deleteStudent,
      getStudents,
      // deleteAccessTorRelatives,
    }),
    [
      classroom,
      setClassroom,
      parentClassroom,
      setParentClassroom,
      getClassroom,
      updateClassroomParameters,
      students,
      createStudent,
      deleteStudent,
      getStudents,
      setStudents,
    ],
  );
  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>;
};

export interface ClassroomUpdateData {
  name?: string;
  avatar?: string;
  delayedDays?: number;
  country?: Country;
  hasVisibilitySetToClass?: boolean;
}
