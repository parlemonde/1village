import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AccessControl from './AccessControl';
import { VillageSelect } from './VillageSelect';
import { UserContext } from 'src/contexts/userContext';
import Logo from 'src/svg/logo.svg';
import { UserType } from 'types/user.type';

export const Header = () => {
  const router = useRouter();
  const { user, logout } = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const goToPage = (page: string) => {
    setAnchorEl(null);
    router.push(page);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header>
      <div className="header__container with-shadow">
        <Link href="/">
          <a style={{ display: 'flex', alignItems: 'center' }}>
            <Logo style={{ width: '40px', height: 'auto' }} />
            <h1 className="title" style={{ margin: '0 0 0 0.5rem' }}>
              1Village
            </h1>
          </a>
        </Link>
        {user && (
          <div className="header__user">
            <VillageSelect />
            <div>
              <IconButton
                style={{ width: '40px', height: '40px', margin: '0 1rem' }}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => goToPage('/mon-compte')}>Mon compte</MenuItem>
                {user.type !== UserType.FAMILY && <MenuItem onClick={() => goToPage('/mes-videos')}>Mes vidéos</MenuItem>}
                <AccessControl featureName="id-family" key={user?.id || 'default'}>
                  {user.type === UserType.TEACHER ? <MenuItem onClick={() => goToPage('/familles/1')}>Mes familles</MenuItem> : null}{' '}
                </AccessControl>
                <MenuItem onClick={logout}>
                  <span className="text text--alert">Se déconnecter</span>
                </MenuItem>
              </Menu>
            </div>
          </div>
        )}
        {user && (
          <div className="header__user">
            {user.type === UserType.ADMIN ||
            user.type === UserType.SUPER_ADMIN ||
            user.type === UserType.MEDIATOR ||
            user.type === UserType.OBSERVATOR ? (
              <Link href="/admin/newportal/create" passHref>
                <Button component="a" href="/admin/newportal/create" variant="contained" color="primary" size="small" style={{ marginLeft: '1rem' }}>
                  {'Portail admin'}
                </Button>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
};
