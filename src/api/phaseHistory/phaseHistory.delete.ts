import type { PhaseHistory } from 'server/entities/phaseHistory';

import { axiosRequest } from 'src/utils/axiosRequest';

export async function softDeletePhaseHistory(villageId: number, phase: number): Promise<PhaseHistory> {
  const response = await axiosRequest<PhaseHistory>({
    method: 'DELETE',
    url: `/phase-history/soft-delete/${villageId}/${phase}`,
  });
  if (response.error) {
    throw new Error("Erreur lors de la suppresion de l'historique des phases. Veuillez réessayer.");
  }
  // inviladate le cache de la liste des jeux
  return response.data;
}
