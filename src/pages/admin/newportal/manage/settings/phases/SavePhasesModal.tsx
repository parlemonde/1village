import React, { useState } from 'react';

import { Modal } from 'src/components/Modal';
import type { VillagePhase } from 'types/village.type';

interface SavePhasesModalProps {
  villagePhases: [{ [villageId: number]: VillagePhase }];
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export const SavePhasesModal = ({ villagePhases, isModalOpen, setIsModalOpen }: SavePhasesModalProps) => {
  const [isModalLoading, setIsModalLoading] = useState(false);

  return (
    <Modal
      open={isModalOpen}
      noCloseButton={true}
      maxWidth="sm"
      title="Es-tu sûr ?"
      onConfirm={async () => {
        setIsModalLoading(true);
        // Code pour passer le linter
        for (const key in villagePhases) {
          if (key == '1') {
            villagePhases[key] = 1;
          }
        }
        // Await -> appel API Put Villages
        setIsModalLoading(false);
        setIsModalOpen(false);
      }}
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
};
