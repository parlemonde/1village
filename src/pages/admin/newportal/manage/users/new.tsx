import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MaterialLink from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import { AdminTile } from 'src/components/admin/AdminTile';
import { CountrySelector } from 'src/components/selectors/CountrySelector';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { defaultOutlinedButtonStyle } from 'src/styles/variables.const';
import { isPseudoValid, isEmailValid } from 'src/utils/accountChecks';
import type { User } from 'types/user.type';
import { UserType, userTypeNames } from 'types/user.type';

const Required = (label: string) => (
  <>
    {label}
    <span className="text text--error" style={{ marginLeft: '0.2rem' }}>
      *
    </span>
  </>
);

const NewUser = () => {
  const router = useRouter();
  const { villages } = useVillages();
  const { addUser } = useUserRequests();
  const { enqueueSnackbar } = useSnackbar();
  const [newUser, setNewUser] = React.useState<Partial<User>>({
    email: '',
    pseudo: '',
    city: '',
    address: '',
    postalCode: '',
    school: '',
    level: '',
    type: UserType.TEACHER,
    villageId: 0,
    country: {
      isoCode: '',
      name: '',
    },
  });
  const [errors, setErrors] = React.useState({
    email: false,
    pseudo: false,
  });

  const checkEmailAndPseudo = async () => {
    const pseudoValid = newUser.pseudo !== undefined && (await isPseudoValid(newUser.pseudo, ''));
    setErrors((e) => ({
      ...e,
      email: newUser.email !== undefined && !isEmailValid(newUser.email),
      pseudo: newUser.pseudo !== undefined && !pseudoValid,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields: Extract<keyof User, string>[] = ['email', 'pseudo', 'country'];
    if (newUser.type === UserType.TEACHER) {
      requiredFields.push('villageId');
    }
    for (const field of requiredFields) {
      if (!newUser[field]) {
        enqueueSnackbar('Certain champs requis (*) sont non remplis!', {
          variant: 'warning',
        });
        return;
      }
    }
    await checkEmailAndPseudo();
    if (errors.email || errors.pseudo) {
      enqueueSnackbar('Email et/ou pseudo invalide', {
        variant: 'warning',
      });
      return;
    }
    const result = await addUser({ ...newUser, villageId: newUser.villageId || null });
    if (result !== null) {
      router.push('/admin/newportal/manage/users');
    }
  };

  const updateUserField = (field: Extract<keyof User, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser((u) => ({ ...u, [field]: event.target.value }));
  };

  return (
    <div>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/newportal/manage/users" passHref>
          <MaterialLink href="/admin/newportal/manage/users">
            <h1>Utilisateurs</h1>
          </MaterialLink>
        </Link>
        <h1>Nouveau</h1>
      </Breadcrumbs>
      <AdminTile title="Ajouter un utilisateur">
        <form autoComplete="off" style={{ width: '100%', padding: '1rem' }} onSubmit={onSubmit}>
          <TextField
            variant="standard"
            className="full-width"
            label={Required('Email')}
            value={newUser.email}
            onChange={updateUserField('email')}
            style={{ marginBottom: '1rem' }}
            helperText={errors.email ? 'Email invalide' : ''}
            error={errors.email}
            onBlur={checkEmailAndPseudo}
          />
          <TextField
            variant="standard"
            className="full-width"
            label={Required('Pseudo')}
            value={newUser.pseudo}
            onChange={updateUserField('pseudo')}
            style={{ marginBottom: '1rem' }}
            helperText={errors.pseudo ? 'Pseudo indisponible' : ''}
            error={errors.pseudo}
            onBlur={checkEmailAndPseudo}
          />
          <TextField
            variant="standard"
            className="full-width"
            label="Adresse de l'école"
            value={newUser.address}
            onChange={updateUserField('address')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            variant="standard"
            className="full-width"
            label="Ville de l'école"
            value={newUser.city}
            onChange={updateUserField('city')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            variant="standard"
            className="full-width"
            label="Code postal"
            value={newUser.postalCode}
            onChange={updateUserField('postalCode')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            variant="standard"
            className="full-width"
            label="École"
            value={newUser.school}
            onChange={updateUserField('school')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            variant="standard"
            className="full-width"
            label="Niveau de la classe"
            value={newUser.level}
            onChange={updateUserField('level')}
            style={{ marginBottom: '1rem' }}
          />
          <FormControl variant="standard" style={{ width: '100%', marginBottom: '1rem' }}>
            <InputLabel id="type-select">Rôle</InputLabel>
            <Select
              variant="standard"
              labelId="type-select"
              id="type-simple-select"
              value={newUser.type}
              onChange={(event) => {
                setNewUser((u) => ({ ...u, type: event.target.value as number }));
              }}
            >
              {[UserType.TEACHER, UserType.OBSERVATOR, UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN].map((type) => (
                <MenuItem key={type} value={type}>
                  {userTypeNames[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" style={{ width: '100%', marginBottom: '1rem' }}>
            <InputLabel id="village-select">{newUser.type === UserType.TEACHER ? Required('Village') : 'Village'}</InputLabel>
            <Select
              variant="standard"
              labelId="village-select"
              id="village-simple-select"
              value={newUser.villageId}
              onChange={(event) => {
                setNewUser((u) => ({ ...u, villageId: event.target.value as number }));
              }}
            >
              <MenuItem value={0}>Aucun</MenuItem>
              {villages.map((village) => (
                <MenuItem key={village.id} value={village.id}>
                  {village.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CountrySelector
            label={Required('Pays')}
            value={newUser.country?.isoCode || ''}
            onChange={(countryCode) => {
              setNewUser((u) => ({ ...u, country: { isoCode: countryCode, name: '' } }));
            }}
            filterCountries={
              newUser.villageId ? villages.find((v) => v.id === newUser.villageId)?.countries?.map((c) => c.isoCode) || undefined : undefined
            }
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
            <Button color="primary" variant="contained" type="submit">
              {'Ajouter!'}
            </Button>
          </div>
        </form>
      </AdminTile>
      <Link href="/admin/newportal/manage/users" passHref>
        <Button
          color="inherit"
          variant="outlined"
          sx={defaultOutlinedButtonStyle}
          style={{ margin: '1rem 0' }}
          component="a"
          href="/admin/newportal/manage/users"
        >
          Retour
        </Button>
      </Link>
    </div>
  );
};

export default NewUser;
