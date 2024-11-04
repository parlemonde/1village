import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { softDeletePhaseHistory } from 'src/api/phaseHistory/phaseHistory.delete';
import { postPhaseHistory } from 'src/api/phaseHistory/phaseHistory.post';
import { useUpdateVillages } from 'src/api/villages/villages.put';
import { Modal } from 'src/components/Modal';
import type { VillagePhase } from 'types/village.type';

interface SavePhasesModalProps {
  villagesToUpdate: { [villageId: number]: VillagePhase };
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export function SavePhasesModal({ villagesToUpdate, isModalOpen, setIsModalOpen }: SavePhasesModalProps) {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const updateVillages = useUpdateVillages();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async (villagesToUpdate: { [villageId: number]: VillagePhase }) => {
    const promises = [];
    for (const key in villagesToUpdate) {
      const villageId: number = +key;
      const updatedPhase = Math.min(villagesToUpdate[villageId], 3);
      promises.push(
        updateVillages.mutateAsync({
          id: villageId,
          villageData: { activePhase: updatedPhase },
        }),
      );
      promises.push(
        postPhaseHistory({
          villageId,
          phase: updatedPhase,
        }),
      );
      promises.push(softDeletePhaseHistory(villageId, updatedPhase - 1));
    }
    try {
      await Promise.allSettled(promises);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (updateVillages.isLoading) {
      setIsModalLoading(true);
    }
    if (updateVillages.isSuccess) {
      enqueueSnackbar('Modifications enregistrées !', {
        variant: 'success',
      });
      setIsModalOpen(false);
      setIsModalLoading(false);
      window.location.reload();
    }
    if (updateVillages.isError) {
      enqueueSnackbar("Une erreur s'est produite lors de la modifications !", {
        variant: 'error',
      });
      setIsModalOpen(false);
      setIsModalLoading(false);
    }
  }, [updateVillages.isLoading, updateVillages.isSuccess, updateVillages.isError, setIsModalOpen, enqueueSnackbar]);

  return (
    <Modal
      open={isModalOpen}
      noCloseButton={true}
      maxWidth="sm"
      title="Es-tu sûr ?"
      onConfirm={async () => handleConfirm(villagesToUpdate)}
      onClose={() => {
        setIsModalOpen(false);
      }}
      loading={isModalLoading}
      cancelLabel="Annuler"
      confirmLabel="Enregistrer"
      color="primary"
      ariaLabelledBy="phaseModal"
      ariaDescribedBy="Modal de validation des phases"
    >
      <div id="brouillon-desc" style={{ padding: '0.5rem' }}>
        <p>
          Les modifications que tu souhaites apporter vont modifier les phases actives. <br />
          Attention, faire passer un village à l&apos;étape suivante est un choix définitif.
        </p>
      </div>
    </Modal>
  );
}
