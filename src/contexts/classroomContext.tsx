import router from 'next/router';
import React from 'react';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';
import type { Classroom } from 'types/classroom.type';
import type { Student } from 'types/student.type';
import { UserType } from 'types/user.type';

interface ClassroomContextValue {
  classroom: Classroom | null;
  setClassroom: (value: React.SetStateAction<Classroom | null>) => void;
  getClassroom(): Promise<void>;
  updateClassroomParameters(data: ClassroomUpdateData): Promise<void>;
  // student: Student | null;
  students: Student[] | null;
  setStudents: (value: React.SetStateAction<Student[]>) => void;
  /*   getStudent(): Promise<void>; */
}
export const ClassroomContext = React.createContext<ClassroomContextValue>({
  classroom: null,
  setClassroom: () => {},
  getClassroom: async () => {},
  updateClassroomParameters: async () => {},
  // student: null,
  students: null,
  /*   getStudent: async () => {}, */
  setStudents: async () => {},
  // setStudent: function (value: React.SetStateAction<Student | null>): void {
  //   throw new Error('Function not implemented.');
  // },
});

interface ClassroomContextProviderProps {
  classroom: Classroom | null;
  setClassroom(value: React.SetStateAction<Classroom | null>): void;
  // initialStudent: Student | null;
  students: Student[] | null;
  setStudents(value: React.SetStateAction<Student[]>): void;
}

//TODO : il faut alimenter le ClassroomContext avec les fonctions
export const ClassroomContextProvider = ({
  classroom,
  setClassroom,
  // initialStudent,
  children,
}: React.PropsWithChildren<ClassroomContextProviderProps>) => {
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  /*   const [student, setStudent] = React.useState<Student | null>(initialStudent); */
  const [students, setStudents] = React.useState<Student[]>([]);

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
        // console.log({ response });
        return response.data.classroom;
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // * Classroom is create automatically for all teacher if it not exits already
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
  /**
   * Add new students in the classrom
   */
  const createStudent = React.useCallback(async ({ firstname, lastname, hashedCode }: Student) => {
    if (user?.type !== UserType.TEACHER) return;
    if (!classroom) return;
    await axiosLoggedRequest({
      method: 'POST',
      url: '/students',
      data: {
        firstname,
        lastname,
        hashedCode,
      },
    })
      .then((response) => {
        // Add the new student to the array
        // const newStudents = [...students, response.data.student];
        // Update the state with the new array
        // setStudents(newStudents);
        setStudents(response.data.student);
        return response.data.student;
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const setStudent = React.useCallback(() => {}, []);

  /**
   * Update one student
   */
  // const setStudent = React.useCallback(async (data: ClassroomUpdateData) => {
  //   if (user?.type !== UserType.TEACHER) return;
  //   await axiosLoggedRequest({
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

  const getStudent = React.useCallback(
    async (id: number) => {
      await axiosLoggedRequest({
        method: 'GET',
        url: `/students/${id}`,
      })
        .then((response) => {
          return response.data as Student;
        })
        .catch((err) => {
          return err.message;
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [axiosLoggedRequest],
  );
  /**
   * Get the list of students in the classroom
   */
  const getStudents = React.useCallback(async () => {
    await axiosLoggedRequest({
      method: 'GET',
      url: `/students`,
    })
      .then((response) => {
        return setStudents(response.data as Student[]);
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosLoggedRequest]);

  const deleteStudent = React.useCallback(async (hashedCode: string) => {
    if (user?.type !== UserType.TEACHER) return;
    if (!classroom) return;
    await axiosLoggedRequest({
      method: 'DELETE',
      url: '/students',
      data: {
        hashedCode,
      },
    })
      .then((response) => {
        setStudents(response.data.student);
        // console.log({ response });
        return response.data.student;
      })
      .catch((err) => {
        return err.message;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Delete an access for a relative's student
   */
  // const deleteAccessTorRelatives = React.useCallback(() => {}, []);

  const value = React.useMemo(
    () => ({
      classroom,
      setClassroom,
      getClassroom,
      updateClassroomParameters,
      students,
      setStudents,
      //getStudent,
      createStudent,
      deleteStudent,
      getStudents,
      // setStudent: (value: React.SetStateAction<Student>) => setStudents(value),
      // getStudentList,
      // deleteAccessTorRelatives,
    }),
    [classroom, setClassroom, getClassroom, updateClassroomParameters, students, createStudent, deleteStudent, getStudents, setStudents],
  );
  //getStudent
  //setStudent
  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>;
};

export interface ClassroomUpdateData {
  name?: string;
  avatar?: string;
  delayedDays?: number;
  hasVisibilitySetToClass?: boolean;
}

// export interface StudentCreateData {
//   firstname: string;
//   lastname: string;
//   hashedCode: string;
// }
