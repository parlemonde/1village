import React, { useState, useEffect } from 'react';
import { Modal } from 'src/components/Modal';
import { VillagePhase, Village } from 'types/village.type';

interface SavePhasesModalProps {
  villagePhases: [{ [villageId: number]: VillagePhase }];
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export const SavePhasesModal = ({ villagePhases, isModalOpen, setIsModalOpen}: SavePhasesModalProps) => {
  
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  return (
    <Modal
      open={isModalOpen}
      fullWidth
      noCloseOutsideModal
      maxWidth="md"
      title="Es-tu sûr ?"
      onConfirm={async () => {console.log('États des checkboxes :', villagePhases)}}
      onClose={() => { setIsModalOpen(false); } }
      loading={isModalLoading}
      cancelLabel="Annuler"
      confirmLabel="Enregistrer"
    >
      <div id="brouillon-desc" style={{ padding: '0.5rem' }}>
        <p>Les modifications que tu souhaites apporter vont modifier les phases actives</p>
      </div>
    </Modal>
  );
};
