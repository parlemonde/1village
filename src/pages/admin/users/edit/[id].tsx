import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialLink from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { AdminTile } from 'src/components/admin/AdminTile';
import { CountrySelector } from 'src/components/selectors/CountrySelector';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import { useVillages } from 'src/services/useVillages';
import { isPseudoValid, isEmailValid } from 'src/utils/accountChecks';
import { getQueryString } from 'src/utils';
import { User, UserType, userTypeNames } from 'types/user.type';

const Required = (label: string) => (
  <>
    {label}
    <span className="text text--error" style={{ marginLeft: '0.2rem' }}>
      *
    </span>
  </>
);

const EditUser: React.FC = () => {
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
      email: user.email && !isEmailValid(user.email),
      pseudo: user.pseudo && !pseudoValid,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields: Extract<keyof User, string>[] = ['email', 'pseudo', 'countryCode'];
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
    const result = await editUser({ ...user, villageId: user.villageId || null });
    if (result !== null) {
      router.push('/admin/users');
    }
  };

  if (user === null) {
    return <div></div>;
  }

  const updateUserField = (field: Extract<keyof User, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((u) => ({ ...u, [field]: event.target.value }));
  };

  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: '1rem' }}>
        <Link href="/admin/users">
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
            label="Adresse de l'école"
            value={user.address}
            onChange={updateUserField('address')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            className="full-width"
            label="Ville de l'école"
            value={user.city}
            onChange={updateUserField('city')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField
            className="full-width"
            label="Code postal"
            value={user.postalCode}
            onChange={updateUserField('postalCode')}
            style={{ marginBottom: '1rem' }}
          />
          <TextField className="full-width" label="École" value={user.school} onChange={updateUserField('school')} style={{ marginBottom: '1rem' }} />
          <TextField
            className="full-width"
            label="Niveau de la classe"
            value={user.level}
            onChange={updateUserField('level')}
            style={{ marginBottom: '1rem' }}
          />
          <FormControl style={{ width: '100%', marginBottom: '1rem' }}>
            <InputLabel id="type-select">Rôle</InputLabel>
            <Select
              labelId="type-select"
              id="type-simple-select"
              value={user.type}
              onChange={(event) => {
                setUser((u) => ({ ...u, type: event.target.value as number }));
              }}
            >
              {[UserType.TEACHER, UserType.OBSERVATOR, UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN].map((type) => (
                <MenuItem key={type} value={type}>
                  {userTypeNames[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ width: '100%', marginBottom: '1rem' }}>
            <InputLabel id="village-select">{user.type === UserType.TEACHER ? Required('Village') : 'Village'}</InputLabel>
            <Select
              labelId="village-select"
              id="village-simple-select"
              value={user.villageId}
              onChange={(event) => {
                setUser((u) => ({ ...u, villageId: event.target.value as number }));
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
            value={user.countryCode}
            onChange={(countryCode) => {
              setUser((u) => ({ ...u, countryCode }));
            }}
            filterCountries={user.villageId ? villages.find((v) => v.id === user.villageId)?.countries || undefined : undefined}
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
