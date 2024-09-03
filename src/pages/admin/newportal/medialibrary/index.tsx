import React, { useContext, useState } from 'react';

import React, { useContext, useState } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import MediaCard from 'src/components/admin/mediatheque/CardMediatheque';
import CheckboxAdmin from 'src/components/admin/mediatheque/CheckboxAdmin';
import DownloadButton from 'src/components/admin/mediatheque/DownloadButton';
import FiltersActivities from 'src/components/admin/mediatheque/FiltersActivities';
import ModalFilter from 'src/components/admin/mediatheque/ModalFilter';
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
    setFilters({});
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
