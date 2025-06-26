export const FamiliesWithoutAccountHeaders = [
  { key: 'student', label: 'Nom Prénom Enfant', sortable: true },
  { key: 'vm', label: 'Village-Monde', sortable: true },
  { key: 'classroom', label: 'Classe', sortable: true },
  { key: 'country', label: 'Pays', sortable: true },
  { key: 'creationDate', label: 'Date de création identifiant', sortable: true },
];

export const FloatingAccountsHeaders = [
  { key: 'family', label: 'Nom Prénom Famille', sortable: true },
  { key: 'language', label: 'Langue', sortable: true },
  { key: 'email', label: 'Mail', sortable: true },
  { key: 'creationDate', label: 'Date de création compte', sortable: true },
];

export const CountryActivityTableHeaders = [
  { key: 'name', label: 'Classe', sortable: true },
  { key: 'totalPublications', label: 'Publications', sortable: true },
  { key: 'commentCount', label: 'Commentaires', sortable: true },
  { key: 'draftCount', label: 'Brouillons', sortable: true },
  { key: 'mascotCount', label: 'Mascottes', sortable: true },
  { key: 'videoCount', label: 'Vidéos', sortable: true },
];

export const CountryActivityTableCountryHeaders = [
  { key: 'name', label: 'Nom du pays', sortable: true },
  { key: 'mascotCount', label: 'Mascottes', sortable: true },
  { key: 'videoCount', label: 'Vidéos', sortable: true },
  { key: 'draftCount', label: 'Brouillons non publiés', sortable: true },
  { key: 'commentCount', label: 'Commentaires', sortable: true },
];

export function getCountryActivityTableHeaders(phaseId: number) {
  switch (phaseId) {
    case 1:
      return [
        { key: 'name', label: 'Nom du pays', sortable: true },
        { key: 'enigmaCount', label: 'Indices', sortable: true },
        { key: 'mascotCount', label: 'Mascottes', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
      ];
    case 2:
      return [
        { key: 'name', label: 'Nom du pays', sortable: true },
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
        { key: 'name', label: 'Nom du pays', sortable: true },
        { key: 'anthemCount', label: 'Hymne', sortable: true },
        { key: 'storyCount', label: 'Histoire', sortable: true },
        { key: 'reinventStoryCount', label: 'Réécriture', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
      ];
    default:
      return [];
  }
}
