import type { PhaseHistory } from 'server/entities/phaseHistory';

import { axiosRequest } from 'src/utils/axiosRequest';

export async function postPhaseHistory(data: Partial<PhaseHistory> & { villageId: number }): Promise<PhaseHistory> {
  const response = await axiosRequest<PhaseHistory>({
    method: 'POST',
    url: '/phase-history',
    data,
  });
  if (response.error) {
    throw new Error("Erreur lors de la création de l'historique des phases. Veuillez réessayer.");
  }

  return response.data;
}
