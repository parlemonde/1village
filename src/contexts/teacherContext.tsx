import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TeacherContextValue {}

export const TeacherContext = React.createContext<TeacherContextValue>({});

//TODO : il faut alimenter l'interface et le TeaCherContext avec les fonctions et les bon types, les fonctions sont à titre d'exemple

export const TeacherContextProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => {
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
      setStudentList,
      getStudentList,
      deleteAccessTorRelatives,
    }),
    [deleteAccessTorRelatives, getStudentList, setStudentList],
  );
  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
};
