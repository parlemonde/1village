import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MaterialLink from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { AdminTile } from 'src/components/admin/AdminTile';
import { CountrySelector } from 'src/components/selectors/CountrySelector';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { getQueryString } from 'src/utils';
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

const EditUser = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { villages } = useVillages();
  const { editUser } = useUserRequests();
  const { enqueueSnackbar } = useSnackbar();
  const userId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) || 0, [router]);
  const [user, setUser] = React.useState<User | null>(null);
  const initialPseudo = React.useRef('');

  const [errors, setErrors] = React.useState({
    email: false,
    pseudo: false,
  });

  const getUser = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/users/${userId}`,
    });
    if (response.error) {
      router.push('/admin/users');
    } else {
      setUser(response.data);
      initialPseudo.current = response.data.pseudo || '';
    }
  }, [axiosLoggedRequest, router, userId]);

  React.useEffect(() => {
    getUser().catch((e) => console.error(e));
  }, [getUser]);

  const checkEmailAndPseudo = async () => {
    if (user === null) {
      return;
    }
    const pseudoValid = await isPseudoValid(user.pseudo, initialPseudo.current);
    setErrors((e) => ({
      ...e,
      email: user.email !== undefined && !isEmailValid(user.email),
      pseudo: user.pseudo !== undefined && !pseudoValid,
    }));
  };

  if (user === null) {
    return <div></div>;
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields: Extract<keyof User, string>[] = ['email', 'pseudo', 'country'];
    if (user.type === UserType.TEACHER) {
      requiredFields.push('villageId');
    }
    for (const field of requiredFields) {
      if (!user[field]) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { position: _ignore, ...updatedValues } = user;
    const result = await editUser({ ...updatedValues, villageId: user.villageId || null });
    if (result !== null) {
      router.push('/admin/users');
    }
  };

  const updateUserField = (field: Extract<keyof User, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((u) => (!u ? null : { ...u, [field]: event.target.value }));
  };

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/users" passHref>
          <MaterialLink href="/admin/users">
            <h1>Utilisateurs</h1>
          </MaterialLink>
        </Link>
        <h1>{user.email}</h1>
      </Breadcrumbs>
      <AdminTile title="Modifier un utilisateur">
        <form autoComplete="off" style={{ width: '100%', padding: '1rem' }} onSubmit={onSubmit}>
          <TextField
            className="full-width"
            variant="standard"
            label={Required('Email')}
            value={user.email}
            onChange={updateUserField('email')}
            style={{ marginBottom: '1rem' }}
            helperText={errors.email ? 'Email invalide' : ''}
            error={errors.email}
            onBlur={checkEmailAndPseudo}
          />
          <TextField
            className="full-width"
            variant="standard"
            label={Required('Pseudo')}
            value={user.pseudo}
            onChange={updateUserField('pseudo')}
            style={{ marginBottom: '1rem' }}
            helperText={errors.pseudo ? 'Pseudo indisponible' : ''}
            error={errors.pseudo}
            onBlur={checkEmailAndPseudo}
          />
          <TextField
            className="full-width"
            variant="standard"
            label="Adresse de l'école"
            value={user.address}
            onChange={updateUserField('address')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            className="full-width"
            variant="standard"
            label="Ville de l'école"
            value={user.city}
            onChange={updateUserField('city')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            className="full-width"
            variant="standard"
            label="Code postal"
            value={user.postalCode}
            onChange={updateUserField('postalCode')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            className="full-width"
            variant="standard"
            label="École"
            value={user.school}
            onChange={updateUserField('school')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            className="full-width"
            variant="standard"
            label="Niveau de la classe"
            value={user.level}
            onChange={updateUserField('level')}
            style={{ marginBottom: '1rem' }}
          />
          <FormControl variant="standard" style={{ width: '100%', marginBottom: '1rem' }}>
            <InputLabel id="type-select">Rôle</InputLabel>
            <Select
              variant="standard"
              labelId="type-select"
              id="type-simple-select"
              value={user.type}
              onChange={(event) => {
                setUser((u) => (!u ? null : { ...u, type: event.target.value as number }));
              }}
            >
              {[UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MEDIATOR, UserType.TEACHER, UserType.FAMILY, UserType.OBSERVATOR].map((type) => (
                <MenuItem key={type} value={type}>
                  {userTypeNames[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" style={{ width: '100%', marginBottom: '1rem' }}>
            <InputLabel id="village-select">{user.type === UserType.TEACHER ? Required('Village') : 'Village'}</InputLabel>
            <Select
              variant="standard"
              labelId="village-select"
              id="village-simple-select"
              value={user.villageId}
              onChange={(event) => {
                setUser((u) => (!u ? null : { ...u, villageId: event.target.value as number }));
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
            value={user.country.isoCode}
            onChange={(countryCode) => {
              setUser((u) => (!u ? null : { ...u, country: { isoCode: countryCode, name: '' } }));
            }}
            filterCountries={
              user.villageId ? villages.find((v) => v.id === user.villageId)?.countries?.map((c) => c.isoCode) || undefined : undefined
            }
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div className="text-center" style={{ margin: '2rem 0 1rem 0' }}>
            <Button color="primary" variant="contained" type="submit">
              {"Modifier l'utilisateur"}
            </Button>
          </div>
        </form>
      </AdminTile>
    </div>
  );
};

export default EditUser;
