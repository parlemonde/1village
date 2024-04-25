import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

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

  const handleConfirm = (villagePhases: { [villageId: number]: VillagePhase }) => {
    setIsModalLoading(true);
    for (const key in villagePhases) {
      const villageId: number = +key;
      updateVillages.mutate({ id: villageId, villageData: { activePhase: villagePhases[villageId] } });
    }
    if (updateVillages.isSuccess) {
      enqueueSnackbar('Modifications enregistrées !', {
        variant: 'success',
      });
    }
    if (updateVillages.isError) {
      enqueueSnackbar("Une erreur s'est produite lors de la modifications !", {
        variant: 'error',
      });
    }
    setIsModalOpen(false);
    setIsModalLoading(false);
  };

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
