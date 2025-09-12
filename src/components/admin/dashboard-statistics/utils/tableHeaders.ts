interface PhaseTableHeader {
  key: string;
  label: string;
  sortable: boolean;
}

export const FamiliesWithoutAccountHeaders: PhaseTableHeader[] = [
  { key: 'student', label: 'Nom Prénom Enfant', sortable: true },
  { key: 'vm', label: 'Village-Monde', sortable: true },
  { key: 'classroom', label: 'Classe', sortable: true },
  { key: 'country', label: 'Pays', sortable: true },
  { key: 'creationDate', label: 'Date de création identifiant', sortable: true },
];

export const FloatingAccountsHeaders: PhaseTableHeader[] = [
  { key: 'family', label: 'Nom Prénom Famille', sortable: true },
  { key: 'language', label: 'Langue', sortable: true },
  { key: 'email', label: 'Mail', sortable: true },
  { key: 'creationDate', label: 'Date de création compte', sortable: true },
];

export const CountryActivityTableHeaders: PhaseTableHeader[] = [
  { key: 'name', label: 'Classe', sortable: true },
  { key: 'totalPublications', label: 'Publications', sortable: true },
  { key: 'commentCount', label: 'Commentaires', sortable: true },
  { key: 'draftCount', label: 'Brouillons', sortable: true },
  { key: 'indiceCount', label: 'Indices', sortable: true },
  { key: 'mascotCount', label: 'Mascottes', sortable: true },
  { key: 'videoCount', label: 'Vidéos', sortable: true },
];

export const CountryActivityTableCountryHeaders: PhaseTableHeader[] = [
  { key: 'name', label: 'Nom du pays', sortable: true },
  { key: 'indiceCount', label: 'Indices', sortable: true },
  { key: 'mascotCount', label: 'Mascottes', sortable: true },
  { key: 'videoCount', label: 'Vidéos', sortable: true },
  { key: 'draftCount', label: 'Brouillons non publiés', sortable: true },
  { key: 'commentCount', label: 'Commentaires', sortable: true },
];

export function getPhaseTableHeaders(phaseId: number, baseHeaders: PhaseTableHeader[]) {
  switch (phaseId) {
    case 1:
      return [
        ...baseHeaders,
        { key: 'indiceCount', label: 'Indices', sortable: true },
        { key: 'mascotCount', label: 'Mascottes', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
      ];
    case 2:
      return [
        ...baseHeaders,
        { key: 'reportingCount', label: 'Reportages', sortable: true },
        { key: 'challengeCount', label: 'Défis', sortable: true },
        { key: 'enigmaCount', label: 'Énigmes', sortable: true },
        { key: 'gameCount', label: 'Jeux', sortable: true },
        { key: 'questionCount', label: 'Questions', sortable: true },
        { key: 'reactionCount', label: 'Réactions', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
      ];
    case 3:
      return [
        ...baseHeaders,
        { key: 'anthemCount', label: 'Hymnes', sortable: true },
        { key: 'contentLibreCount', label: 'Contenus libres', sortable: true },
        { key: 'storyCount', label: 'Histoires', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
      ];
    default:
      return baseHeaders;
  }
}

export function getVillageActivityTableHeaders(phaseId: number) {
  const baseHeaders = [{ key: 'villageName', label: 'Nom du village', sortable: true }];

  return getPhaseTableHeaders(phaseId, baseHeaders);
}

export function getCountryActivityTableHeaders(phaseId: number) {
  const baseHeaders = [{ key: 'name', label: 'Nom du pays', sortable: true }];

  return getPhaseTableHeaders(phaseId, baseHeaders);
}

export function getClassroomActivityTableHeaders(phaseId: number) {
  const baseHeaders = [{ key: 'name', label: 'Classe', sortable: true }];

  return getPhaseTableHeaders(phaseId, baseHeaders);
}
