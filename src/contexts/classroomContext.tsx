import type { ReactNode, SetStateAction } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Card, CircularProgress } from '@mui/material';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';
import { primaryColor } from 'src/styles/variables.const';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Classroom, ClassroomAsFamilly } from 'types/classroom.type';
import type { Country } from 'types/country.type';
import type { Student, StudentForm } from 'types/student.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

interface ClassroomContextValue {
  classroom: Classroom | null;
  setClassroom: (value: SetStateAction<Classroom | null>) => void;
  parentClassroom: ClassroomAsFamilly | null;
  setParentClassroom: (value: SetStateAction<ClassroomAsFamilly | null>) => void;
  getClassroom(): Promise<void>;
  updateClassroomParameters(data: ClassroomUpdateData): Promise<void>;
  createStudent({ firstname, lastname }: StudentForm): Promise<void>;
  deleteStudent(id: number): Promise<void>;
  students: Student[];
  setStudents: (value: SetStateAction<Student[]>) => void;
}
export const ClassroomContext = createContext<ClassroomContextValue>({
  classroom: null,
  setClassroom: () => {},
  parentClassroom: null,
  setParentClassroom: () => {},
  getClassroom: async () => {},
  updateClassroomParameters: async () => {},
  createStudent: async () => {},
  deleteStudent: async () => {},
  students: [],
  setStudents: async () => {},
});

interface ClassroomContextProviderProps {
  children: ReactNode;
}

export const ClassroomContextProvider = ({ children }: ClassroomContextProviderProps) => {
  const { user } = useContext(UserContext);
  const { village } = useContext(VillageContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalStep, setModalStep] = useState(0);
  const modalStepTimeout = useRef<number | undefined>(undefined);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [parentClassroom, setParentClassroom] = useState<ClassroomAsFamilly | null>(null);

  const fetchClassroom = useCallback(async (user: User) => {
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

  // Creation of the classroom
  const createClassroom = useCallback(async () => {
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
  const getStudents = useCallback(async (classroomId: number) => {
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

  // Get a teacher's classroom
  const getClassroom = useCallback(async () => {
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

  // Update teacher's classroom Parameters
  const updateClassroomParameters = useCallback(
    async (data: ClassroomUpdateData) => {
      if (!user) return;
      if (user.type !== UserType.TEACHER) return;
      await axiosRequest({
        method: 'PUT',
        url: `/classrooms/${user.id}`,
        data: { ...data },
      })
        .then((response) => {
          if (response.status === 200) {
            setModalStep(2);
            modalStepTimeout.current = window.setTimeout(() => {
              setModalStep(0);
            }, 2000);
            if (response.status !== 200) {
              clearTimeout(modalStepTimeout.current);
              setModalStep(1);
            }
          }
          return response.data.classroom;
        })
        .catch((err) => {
          return err.message;
        });
    },
    [user],
  );

  // Add new students in the classroom
  const createStudent = useCallback(
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
          if (response.status === 200) {
            setModalStep(3);
            modalStepTimeout.current = window.setTimeout(() => {
              setModalStep(0);
            }, 2000);
            if (response.status !== 200) {
              clearTimeout(modalStepTimeout.current);
              setModalStep(1);
            }
          }
        })
        .catch((err) => {
          return err.message;
        });
    },
    [classroom, students, user],
  );

  const deleteStudent = useCallback(
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

  // Classroom is created automatically for all teachers if it does not exit already
  useEffect(() => {
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

  const value = useMemo(
    () => ({
      classroom,
      setClassroom,
      parentClassroom,
      setParentClassroom,
      getClassroom,
      updateClassroomParameters,
      students,
      setStudents,
      createStudent,
      deleteStudent,
      getStudents,
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
  return (
    <ClassroomContext.Provider value={value}>
      {children}
      {modalStep > 0 && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '4.5rem' }}>
          <Card style={{ backgroundColor: primaryColor, color: 'white', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}>
            {modalStep === 1 && <CircularProgress color="inherit" size="1.25rem" />}
            {modalStep === 2 && <span className="text text--small">Paramètres enregistrés</span>}
            {modalStep === 3 && <span className="text text--small">Liste mise à jour</span>}
          </Card>
        </div>
      )}
    </ClassroomContext.Provider>
  );
};

export interface ClassroomUpdateData {
  name?: string;
  avatar?: string;
  delayedDays?: number;
  country?: Country;
  hasVisibilitySetToClass?: boolean;
}
