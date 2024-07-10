import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Box, Button, NoSsr, TextField, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Modal } from 'src/components/Modal';
import { AdminTable } from 'src/components/admin/AdminTable';
import { AdminTile } from 'src/components/admin/AdminTile';
import { useVillages, useVillageRequests } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
import BackArrow from 'src/svg/back-arrow.svg';
import { countryToFlag } from 'src/utils';
import { SSO_HOSTNAME } from 'src/utils/sso';
import type { Country } from 'types/country.type';

const Villages = () => {
  const router = useRouter();
  const { villages } = useVillages();
  const { deleteVillage, importVillages } = useVillageRequests();
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(-1);
  const [search, setSearch] = useState('');

  const filteredVillages = useMemo(
    () =>
      villages.filter((v) => {
        const searchMatch = [v.name, ...v.countries.map((c) => c.name)].some((field) => field.toLowerCase().includes(search.toLowerCase()));
        return searchMatch;
      }),
    [villages, search],
  );

  const countriesToText = (countries: Country[]) => {
    return countries.map((c) => `${countryToFlag(c.isoCode)} ${c.name}`).join(' - ');
  };

  const onImportVillages = async () => {
    setIsLoading(true);
    await importVillages();
    setIsLoading(false);
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const actions = (id: number) => (
    <>
      <Tooltip title="Modifier">
        <IconButton
          aria-label="edit"
          onClick={() => {
            router.push(`/admin/newportal/manage/villages/edit/${id}`);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton
          aria-label="delete"
          onClick={() => {
            setDeleteIndex(villages.findIndex((v) => v.id === id));
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <div style={{ overflow: 'auto' }}>
      <Link href="/admin/newportal/manage">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Villages-mondes</h1>
        </div>
      </Link>
      <AdminTile
        title="Liste des villages"
        toolbarButton={
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
            }}
          >
            <Button
              color="inherit"
              sx={(theme) => ({ ...defaultContainedButtonStyle, [theme.breakpoints.down('md')]: { margin: '0 0 1rem 0' } })}
              variant="contained"
              style={{ flexShrink: 0, marginRight: '0.5rem' }}
              startIcon={<GetAppIcon />}
              onClick={onImportVillages}
            >
              Importer depuis {SSO_HOSTNAME}
            </Button>
            <Link href="/admin/newportal/manage/villages/new">
              <Button
                color="inherit"
                sx={defaultContainedButtonStyle}
                component="a"
                href="/admin/newportal/manage/villages/new"
                variant="contained"
                style={{ flexShrink: 0 }}
                startIcon={<AddCircleIcon />}
              >
                Ajouter un village
              </Button>
            </Link>
          </Box>
        }
      >
        <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <Typography variant="subtitle1" style={{ marginRight: '1rem', marginLeft: '1rem' }}>
            Filtres villages :
          </Typography>
          <TextField
            label="Rechercher par nom de village ou pays"
            value={search}
            onChange={handleChange}
            variant="outlined"
            size="small"
            style={{ marginRight: '1rem' }}
          />
        </Box>
        <Box sx={{ overflow: 'auto' }}>
          <AdminTable
            emptyPlaceholder={
              <>
                {"Vous n'avez pas encore de villages ! "}
                <Link href="/admin/newportal/manage/villages/new">
                  <a className="text text--primary text--small">En créer un ?</a>
                </Link>
              </>
            }
            data={filteredVillages.map((v) => ({
              ...v,
              countries: countriesToText(v.countries),
              userCount: 0,
              postCount: 0,
            }))}
            columns={[
              { key: 'name', label: 'Nom du village', sortable: true },
              { key: 'countries', label: 'Pays' },
              { key: 'userCount', label: 'Nombre de classes', sortable: true },
              { key: 'postCount', label: 'Nombre de posts', sortable: true },
            ]}
            actions={actions}
          />
        </Box>
      </AdminTile>
      <NoSsr>
        <Modal
          title="Confirmer la suppression"
          open={deleteIndex !== -1}
          onClose={() => {
            setDeleteIndex(-1);
          }}
          onConfirm={async () => {
            await deleteVillage(villages[deleteIndex]?.id || -1);
            setDeleteIndex(-1);
          }}
          fullWidth
          maxWidth="sm"
          ariaLabelledBy="delete-village-id"
          ariaDescribedBy="delete-village-desc"
          error
        >
          <div id="delete-village-desc">
            Voulez vous vraiment supprimer le village <strong>{villages[deleteIndex]?.name}</strong> ?
          </div>
        </Modal>
      </NoSsr>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Villages;
