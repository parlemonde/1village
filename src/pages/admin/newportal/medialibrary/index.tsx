import React, { useContext, useState } from 'react';

// Tout doit être responsive

// STEP 1: les filtres (proposition modal sur les filtre)
// STEP 1.1: le filtre Pelico -> géré comme les autres filtres (cumulatif)
// STEP 1.2: conditionner le filtre thème en fonction du filtre activité
// STEP 2: la liste des médias
// STEP 2.0.1: créer une route API pour récupérer les médias en fonction de user.admin et qui récupère toute la table activity
// STEP 2.1: possibilité de dl un seul média (verifier si on a le droit de dl le media en question)
// STEP 2.2: La fonction copié est en GROSSE OPTION (pas obligatoire) (mais c po dur)
// STEP 2.3: gérer le cas où il n'y a pas de média et afficher un bouton réinitialiser les filtres (il faudrait toujours y avoir un bouton reset filter)
// STEP 3: la pagination ( limit et offet dans le requete)
// STEP 4: le bouton télécharger (image, vidéo, son) (lib jszip par exemple)
// STEP 4.1: comment on dl une vidéo youtube ? Souvent des vidéos Viméo (bah on dl pas)

import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import MediaCard from 'src/components/admin/mediatheque/CardMediatheque';
import CheckboxAdmin from 'src/components/admin/mediatheque/CheckboxAdmin';
import DownloadButton from 'src/components/admin/mediatheque/DownloadButton';
import Filters from 'src/components/admin/mediatheque/Filter';
import FiltersActivities from 'src/components/admin/mediatheque/FiltersActivities';
import FiltersUsers from 'src/components/admin/mediatheque/FiltersUsers';
import ModalFilter from 'src/components/admin/mediatheque/ModalFilter';
import { activitiesLabel } from 'src/config/mediatheque/dataFilters';
import MediathequeContext from 'src/contexts/mediathequeContext';
import { bgPage } from 'src/styles/variables.const';
import PelicoSearch from 'src/svg/pelico/pelico-search.svg';

const Mediatheque = () => {
  const { setFilters, setAllFiltered, allFiltered, allActivities, setUseAdminData, page, setPage, updatePageKey, setUpdatePageKey } =
    useContext(MediathequeContext);
  const [updateFiltersKey, setUpdateFiltersKey] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const handleResetFilters = () => {
    setUseAdminData(false);
    setFilters([[]]);
    setUpdateFiltersKey((prevKey) => prevKey + 1);
    setUpdatePageKey((prevKey) => prevKey + 1);
    setIsChecked(false);
    handleChangePage(undefined, 1);
    setAllFiltered(allActivities);
  };

  const handleChangePage = (_event?: React.ChangeEvent<unknown>, value?: number) => {
    if (value !== undefined) {
      setPage((value - 1) * 6);
    }
  };

  const howManyPages = Math.ceil(allFiltered?.length / 6);

  return (
    <>
      <h1 className="title-for-mediatheque">Médiathèque d&apos;1Village</h1>
      <div className="container-filtre-download">
        <div className="modal-view">
          <ModalFilter />
        </div>
        <DownloadButton data={allFiltered} />
      </div>
      <div className="desktop-view">
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }} key={updateFiltersKey}>
            <FiltersActivities />
          </div>
          <>
            {/* Ce filtre gère les différents village monde VMList */}
            {/* <Filters labels={activitiesLabel} placeholder="VM" /> */}
            {/* Ce filtre dépend du village monde choisi countryList */}
            {/* <Filters labels={activitiesLabel} placeholder="Pays" /> */}
            {/* Ce filtre dépend du pays choisi et du village monde classList */}
            {/* <Filters labels={activitiesLabel} placeholder="Classes" /> */}
          </>

          <CheckboxAdmin isChecked={isChecked} onCheckboxChange={setIsChecked} />
          <IconButton aria-label="delete" color="primary" onClick={handleResetFilters}>
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
      <div>
        {allFiltered && allFiltered.length === 0 ? (
          <>
            <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
              <p style={{ textAlign: 'center' }} className="text">
                {'Oups ! Aucun contenu ne correspond à ta recherche'}
              </p>
              <PelicoSearch style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
              <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleResetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          </>
        ) : (
          <div style={{ paddingTop: '10px' }}>
            <MediaCard page={page} />
          </div>
        )}
      </div>
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination key={updatePageKey} size="small" siblingCount={1} count={howManyPages} variant="outlined" onChange={handleChangePage} />
        </Stack>
      </div>
    </>
  );
};

export default Mediatheque;
