import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Button, NoSsr, TextField, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import MaterialLink from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';

import { Modal } from 'src/components/Modal';
import { AdminTile } from 'src/components/admin/AdminTile';
import { OneVillageTable } from 'src/components/admin/OneVillageTable';
import { useVillages, useVillageRequests } from 'src/services/useVillages';
import { defaultContainedButtonStyle } from 'src/styles/variables.const';
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
            router.push(`/admin/villages/edit/${id}`);
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
    <div className="admin--container">
      <Link href="/admin/villages" passHref>
        <MaterialLink href="/admin/villages">
          <h1 style={{ marginBottom: '1rem' }}>Villages</h1>
        </MaterialLink>
      </Link>
      <AdminTile
        title="Liste des villages"
        toolbarButton={
          <>
            <Button
              color="inherit"
              sx={defaultContainedButtonStyle}
              variant="contained"
              style={{ flexShrink: 0, marginRight: '0.5rem' }}
              startIcon={<GetAppIcon />}
              onClick={onImportVillages}
            >
              Importer depuis {SSO_HOSTNAME}
            </Button>
            <Link href="/admin/newportal">
              <Button
                color="inherit"
                sx={defaultContainedButtonStyle}
                component="a"
                href="/admin/newportal"
                variant="contained"
                style={{ flexShrink: 0 }}
                startIcon={<AddCircleIcon />}
              >
                Ajouter un village
              </Button>
            </Link>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
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
        </div>
        <OneVillageTable
          admin
          emptyPlaceholder={
            <>
              {"Vous n'avez pas encore de villages ! "}
              <Link href="/admin/villages/new">
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
