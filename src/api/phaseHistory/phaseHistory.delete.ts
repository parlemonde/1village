import { axiosRequest } from 'src/utils/axiosRequest';

import type { PhaseHistory } from 'server/entities/phaseHistory';

export async function softDeletePhaseHistory(villageId: number, phase: number): Promise<PhaseHistory> {
  const response = await axiosRequest<PhaseHistory>({
    method: 'DELETE',
    url: `/phase-history/soft-delete/${villageId}/${phase}`,
  });
  if (response.error) {
    throw new Error("Erreur lors de la suppresion de l'historique des phases. Veuillez réessayer.");
  }

  return response.data;
}
