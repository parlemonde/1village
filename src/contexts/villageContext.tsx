import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Modal } from 'src/components/Modal';
import PelicoVacances from 'src/svg/pelico/pelico_vacances.svg';
import { getCookie, setCookie } from 'src/utils/cookies';
import { UserType } from 'types/user.type';
import type { Village } from 'types/village.type';

import { UserContext } from './userContext';

interface VillageContextValue {
  village: Village | null;
  selectedPhase: number;
  showSelectVillageModal(): void;
  setSelectedPhase: (phase: number) => void;
}

export const VillageContext = React.createContext<VillageContextValue>({
  village: null,
  selectedPhase: -1,
  showSelectVillageModal: () => {},
  setSelectedPhase: () => {},
});

type VillageContextProviderProps = React.PropsWithChildren<{
  initialVillage: Village | null;
}>;
export const VillageContextProvider = ({ initialVillage, children }: VillageContextProviderProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, axiosLoggedRequest, logout } = React.useContext(UserContext);
  const [village, setVillage] = React.useState<Village | null>(initialVillage);
  const [villages, setVillages] = React.useState<Village[]>([]);
  const [selectedVillageIndex, setSelectedVillageIndex] = React.useState(-1);
  const [selectedPhase, setSelectedPhase] = React.useState(
    initialVillage && ((user?.type || UserType.TEACHER) >= UserType.OBSERVATOR || initialVillage.activePhase <= (user?.firstLogin || 1))
      ? initialVillage.activePhase
      : 1,
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showUnassignedModal, setShowUnassignedModal] = React.useState(
    initialVillage === null && user && user.type === UserType.TEACHER ? true : false,
  );
  const currentVillageId = village ? village.id : -1;

  const isOnAdmin = React.useMemo(() => router.pathname.slice(1, 6) === 'admin' && user !== null, [router.pathname, user]);

  const getVillage = React.useCallback(
    async (villageId: number) => {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/villages/${villageId}`,
      });
      if (response.error) {
        return null;
      }
      return response.data as Village;
    },
    [axiosLoggedRequest],
  );
  const getVillages = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/villages',
    });
    if (response.error) {
      setVillages([]);
      return;
    }
    setVillages(response.data as Village[]);
  }, [axiosLoggedRequest]);

  const hasFetchVillages = React.useRef(false);
  const showSelectVillageModal = React.useCallback(() => {
    if (hasFetchVillages.current === false) {
      hasFetchVillages.current = true;
      getVillages().catch();
    }
    setSelectedVillageIndex(-1);
    setIsModalOpen(true);
  }, [getVillages]);

  const setUserVillage = React.useCallback(async () => {
    if (user === null) {
      // should not happen
      return;
    }

    const userVillageId = user.villageId || parseInt(getCookie('village-id'), 10) || -1;
    if (userVillageId !== currentVillageId) {
      const newVillage = userVillageId === -1 ? null : await getVillage(userVillageId);
      setVillage(newVillage);
      setSelectedPhase(newVillage ? newVillage.activePhase : 1);
    }
    if (userVillageId === -1 && user.type > UserType.TEACHER) {
      showSelectVillageModal();
    }
    if (userVillageId === -1 && user.type === UserType.TEACHER) {
      setShowUnassignedModal(true);
    }
  }, [currentVillageId, getVillage, showSelectVillageModal, user]);
  React.useEffect(() => {
    if (user === null) {
      setIsModalOpen(false);
      setShowUnassignedModal(false);
      setVillage(null);
      setSelectedPhase(1);
    } else if (isOnAdmin) {
      setIsModalOpen(false);
      setShowUnassignedModal(false);
    } else {
      setUserVillage().catch();
    }
  }, [user, isOnAdmin, setUserVillage]);

  const alreadyAsked = React.useRef(false);
  const onAskVillage = async () => {
    if (alreadyAsked.current) {
      enqueueSnackbar("Votre demande d'assignation à un village a bien été envoyé à un administrateur !", {
        variant: 'success',
      });
    } else {
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/users/ask-update',
        data: {
          error: 'village',
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur inconnue est survenue...', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar("Votre demande d'assignation à un village a bien été envoyé à un administrateur !", {
          variant: 'success',
        });
        alreadyAsked.current = true;
      }
    }
  };

  const value = React.useMemo(
    () => ({ village, selectedPhase, showSelectVillageModal, setSelectedPhase }),
    [village, selectedPhase, showSelectVillageModal, setSelectedPhase],
  );

  return (
    <VillageContext.Provider value={value}>
      {children}
      <Modal
        open={isModalOpen}
        title="Sélectionner un village"
        confirmLabel="Choisir"
        fullWidth
        maxWidth="sm"
        ariaLabelledBy="selection-village"
        ariaDescribedBy="selection-village-desc"
        disabled={selectedVillageIndex === -1}
        noCloseButton={village === null}
        noCloseOutsideModal={village === null}
        noCancelButton={village !== null}
        onClose={() => {
          if (village === null) {
            logout();
          } else {
            setIsModalOpen(false);
          }
        }}
        cancelLabel="Se déconnecter"
        onConfirm={() => {
          if (selectedVillageIndex !== -1) {
            setVillage(villages[selectedVillageIndex]);
            setSelectedPhase(villages[selectedVillageIndex].activePhase);
            setCookie('village-id', `${villages[selectedVillageIndex].id}`);
          }
          setIsModalOpen(false);
        }}
      >
        {(villages || []).length === 0 ? (
          <>
            <p>Aucun village existe !</p>
            {user !== null && user.type >= UserType.ADMIN ? (
              <Link href="/admin/villages" passHref>
                <Button component="a" href="/admin/villages" variant="contained" color="primary" size="small">
                  {"Créer un village sur l'interface admin"}
                </Button>
              </Link>
            ) : (
              <p>Demander un administrateur de créer les villages !</p>
            )}
          </>
        ) : (
          <>
            <FormControl variant="outlined" className="full-width">
              <InputLabel id="select-village">Village</InputLabel>
              <Select
                labelId="select-village"
                id="select-village-outlined"
                value={selectedVillageIndex === -1 ? '' : selectedVillageIndex}
                onChange={(event) => {
                  setSelectedVillageIndex(event.target.value as number);
                }}
                label="Village"
              >
                {(villages || []).map((v, index) => (
                  <MenuItem value={index} key={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {village === null && user !== null && user.type >= UserType.ADMIN && (
              <>
                <Divider style={{ margin: '1rem 0' }} />
                <Link href="/admin/villages" passHref>
                  <Button component="a" href="/admin/villages" variant="contained" color="primary" size="small">
                    {"Aller à l'interface admin"}
                  </Button>
                </Link>
              </>
            )}
          </>
        )}
      </Modal>
      <Modal
        open={showUnassignedModal}
        fullWidth
        maxWidth="sm"
        ariaLabelledBy="demande-village"
        ariaDescribedBy="demande-village-desc"
        noCloseButton={village === null}
        noCloseOutsideModal={village === null}
        noTitle
        cancelLabel="Se déconnecter"
        onClose={logout}
        id="village-demande-modal"
      >
        <div id="demande-village-desc" style={{ position: 'relative' }}>
          <PelicoVacances style={{ height: '6rem', width: '6rem', position: 'absolute', top: '-0.5rem', left: '-4rem' }} />
          <div style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
            <h2>{"Mince, votre classe n'est pas dans un village !"}</h2>
            <Button variant="contained" color="primary" size="small" style={{ margin: '1rem' }} onClick={onAskVillage}>
              {'Demander à être assigné à un village'}
            </Button>
          </div>
        </div>
      </Modal>
    </VillageContext.Provider>
  );
};
