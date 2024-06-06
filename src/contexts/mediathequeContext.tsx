// import React, { createContext, useState, useMemo, useEffect } from 'react';

// import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
// import type { Filter } from 'types/mediatheque.type';

// type MediathequeProviderProps = {
//   children: React.ReactNode;
// };

// type MediathequeContextType = {
//   filters: Array<Filter[]>;
//   setFilters: React.Dispatch<React.SetStateAction<Array<Filter[]>>>;
//   allFiltered: [];
//   useAdminData: boolean;
//   setUseAdminData: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const MediathequeContext = createContext<MediathequeContextType>({
//   filters: [],
//   setFilters: () => {},
//   allFiltered: [],
//   useAdminData: false,
//   setUseAdminData: () => {},
// });

// export const MediathequeProvider: React.FC<MediathequeProviderProps> = ({ children }) => {
//   const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
//   const [useAdminData, setUseAdminData] = useState(false);
//   console.log('filters', filters);

//   const { data: usersData } = useGetMediatheque(filters);
//   const [dataToUse, setDataToUse] = useState([]);

//   const activitiesMediaFinder = dataToUse?.map(
//     ({
//       id,
//       content,
//       subType,
//       type,
//       villageId,
//       userId,
//     }: {
//       id: number;
//       content: object;
//       subType: number;
//       type: number;
//       villageId: number;
//       userId: number;
//     }) => {
//       const result = { id, subType, type, villageId, userId, content: [] };
//       if (content.game) {
//         content.game.map(({ inputs }) =>
//           inputs.map((input: { type: number; selectedValue: string }) => {
//             if (input.type === 3 || input.type === 4) {
//               result.content.push({ type: input.type === 3 ? 'image' : 'video', value: input.selectedValue });
//             }
//           }),
//         );
//       } else {
//         content.map(({ type, value }) => {
//           const wantedTypes = ['image', 'video', 'sound'];
//           if (wantedTypes.includes(type)) {
//             result.content.push({ type, value });
//           }
//         });
//       }
//       return result;
//     },
//   );

//   const activitiesWithMediaOnly = activitiesMediaFinder?.filter((a) => a.content.length > 0);
//   const activitiesFromPelico = usersData?.filter((a) => a.user.type === 0 || a.user.type === 1 || a.user.type === 2);

//   useEffect(() => {
//     if (useAdminData === true) {
//       setDataToUse(activitiesFromPelico);
//     } else {
//       setDataToUse(activitiesWithMediaOnly);
//     }
//   }, [activitiesFromPelico, activitiesWithMediaOnly, useAdminData]);

//   const value = useMemo(
//     () => ({
//       filters,
//       setFilters,
//       allFiltered: dataToUse || [],
//       useAdminData,
//       setUseAdminData,
//     }),
//     [filters, dataToUse, useAdminData],
//   );

//   return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
// };

// export default MediathequeContext;

import React, { createContext, useState, useMemo, useEffect } from 'react';

import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import type { Filter } from 'types/mediatheque.type';

type MediathequeProviderProps = {
  children: React.ReactNode;
};

type MediathequeContextType = {
  filters: Array<Filter[]>;
  setFilters: React.Dispatch<React.SetStateAction<Array<Filter[]>>>;
  allFiltered: any[];
  useAdminData: boolean;
  setUseAdminData: React.Dispatch<React.SetStateAction<boolean>>;
};

const MediathequeContext = createContext<MediathequeContextType>({
  filters: [],
  setFilters: () => {},
  allFiltered: [],
  useAdminData: false,
  setUseAdminData: () => {},
});

export const MediathequeProvider: React.FC<MediathequeProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<Array<Filter[]>>([[]]);
  const [useAdminData, setUseAdminData] = useState(false);

  const { data: usersData } = useGetMediatheque(filters);
  const [dataToUse, setDataToUse] = useState<any[]>([]);

  useEffect(() => {
    const activitiesMediaFinder = usersData?.map(
      ({
        id,
        content,
        subType,
        type,
        villageId,
        userId,
        user,
        village,
      }: {
        id: number;
        content: object;
        subType: number;
        type: number;
        villageId: number;
        userId: number;
        user: object;
        village: object;
      }) => {
        const result = { id, subType, type, villageId, userId, content: [], user, village };
        if (content.game) {
          content.game.map(({ inputs }) =>
            inputs.map((input: { type: number; selectedValue: string }) => {
              if (input.type === 3 || input.type === 4) {
                result.content.push({ type: input.type === 3 ? 'image' : 'video', value: input.selectedValue });
              }
            }),
          );
        } else {
          content.map(({ type, value }: { type: string; value: string }) => {
            const wantedTypes = ['image', 'video', 'sound'];
            if (wantedTypes.includes(type)) {
              result.content.push({ type, value });
            }
          });
        }
        return result;
      },
    );

    const activitiesWithMediaOnly = activitiesMediaFinder?.filter((a) => a.content.length > 0);
    const activitiesFromPelico = usersData?.filter((a) => [0, 1, 2].includes(a.user.type));

    if (useAdminData) {
      setDataToUse(activitiesFromPelico || []);
    } else {
      setDataToUse(activitiesWithMediaOnly || []);
    }
  }, [usersData, useAdminData]);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      allFiltered: dataToUse,
      useAdminData,
      setUseAdminData,
    }),
    [filters, dataToUse, useAdminData],
  );

  return <MediathequeContext.Provider value={value}>{children}</MediathequeContext.Provider>;
};

export default MediathequeContext;
