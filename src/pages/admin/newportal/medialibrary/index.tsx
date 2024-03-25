import React from 'react';

// Tout doit être responsive

// STEP 1: les filtres
// STEP 1.1: le filtre Pelico -> Si Louise Clique, ça affiche TOUS les médias de Pelico peut importe le village
// STEP 1.2: conditionner le filtre thème en fonction du filtre activité
// STEP 2: la liste des médias
// STEP 2.0.1: créer une route API pour récupérer les médias en fonction de user.admin et qui récupère toute la table activity
// STEP 2.1: possibilité de dl un seul média
// STEP 2.2: La fonction copié est en GROSSE OPTION (pas obligatoire)
// STEP 2.3: gérer le cas où il n'y a pas de média et afficher un bouton réinitialiser les filtres
// STEP 3: la pagination
// STEP 4: le bouton télécharger (image, vidéo, son)
// STEP 4.1: comment on dl une vidéo youtube ? Souvent des vidéos Viméo

const Mediatheque = () => {
  return (
    <>
      <div>
        <h1>Médiatheque</h1>
      </div>
    </>
  );
};

export default Mediatheque;
