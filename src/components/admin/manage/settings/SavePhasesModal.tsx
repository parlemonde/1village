import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { softDeletePhaseHistory } from 'src/api/phaseHistory/phaseHistory.delete';
import { postPhaseHistory } from 'src/api/phaseHistory/phaseHistory.post';
import { useUpdateVillages } from 'src/api/villages/villages.put';
import { Modal } from 'src/components/Modal';
import type { VillagePhase } from 'types/village.type';

interface SavePhasesModalProps {
  villagePhases: { [villageId: number]: VillagePhase };
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export function SavePhasesModal({ villagePhases, isModalOpen, setIsModalOpen }: SavePhasesModalProps) {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const updateVillages = useUpdateVillages();
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async (villagePhases: { [villageId: number]: VillagePhase }) => {
    const promises = [];
    for (const key in villagePhases) {
      const villageId: number = +key;
      const updatedPhase = Math.min(villagePhases[villageId], 3);
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
      onConfirm={async () => handleConfirm(villagePhases)}
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
        <p>Les modifications que tu souhaites apporter vont modifier les phases actives.</p>
      </div>
    </Modal>
  );
}
