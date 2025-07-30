import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, IconButton, Menu, MenuItem, styled } from '@mui/material';

import AccessControl from './AccessControl';
import { VillageSelect } from './VillageSelect';
import { UserContext } from 'src/contexts/userContext';
import { primaryColorLight } from 'src/styles/variables.const';
import Logo from 'src/svg/logo.svg';
import { UserType } from 'types/user.type';

export const Header = () => {
  const router = useRouter();
  const { user, logout } = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const hasAccessToOldAdmin = user && [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR].includes(user.type);
  const hasAccessToNewAdmin = hasAccessToOldAdmin || user?.type === UserType.OBSERVATOR;
  const isUserTypeTeacher = user?.type === UserType.TEACHER;

  const open = Boolean(anchorEl);

  const NavButton = styled(Button)(() => ({
    borderRadius: '18px',
    '&:hover': {
      backgroundColor: primaryColorLight,
    },
    '@media (max-width: 900px)': {
      '&.MuiButtonBase-root': {
        '& > .MuiButton-icon': {
          margin: '0px',
        },
      },
      '.nav-btn-text': {
        display: 'none',
      },
    },
  }));

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
    <Box component="header">
      <Box
        sx={(theme) => ({
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          height: '60px',
          margin: {
            xs: '0',
            md: '10px 20px',
          },
          padding: '0 1rem',
          backgroundColor: 'white',
          borderRadius: {
            xs: '0',
            md: '10px',
          },
          overflow: 'hidden',
          [theme.breakpoints.down('md')]: {
            boxShadow: 'none !important',
            borderBottom: '1px solid',
            borderColor: 'background.default',
          },
        })}
        className="with-shadow"
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 0.5fr 0.5fr', md: 'repeat(3, 1fr)' }, gap: '4px' }}>
          <Link href="/">
            <a style={{ display: 'flex', alignItems: 'center' }}>
              <Logo style={{ width: '40px', height: 'auto' }} />
              <h1 className="title" style={{ margin: '0 0 0 0.5rem' }}>
                1Village
              </h1>
            </a>
          </Link>
          {isUserTypeTeacher && (
            <NavButton startIcon={<PushPinOutlinedIcon />} href="https://prof.parlemonde.org/les-ressources/">
              <span className="nav-btn-text">Mes ressources</span>
            </NavButton>
          )}
          {isUserTypeTeacher && (
            <NavButton startIcon={<ChatBubbleOutlineOutlinedIcon />} href="https://prof.parlemonde.org/la-salle/">
              <span className="nav-btn-text">Ma messagerie</span>
            </NavButton>
          )}
        </Box>
        {user && (
          <div className="header__user">
            <Box
              display={{
                xs: 'none',
                md: 'block',
              }}
            >
              <VillageSelect />
            </Box>
            <div>
              <IconButton
                style={{ width: '40px', height: '40px', marginLeft: '20px' }}
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
                {hasAccessToNewAdmin && <MenuItem onClick={() => goToPage('/admin/newportal/create')}>Portail admin</MenuItem>}
                {hasAccessToOldAdmin && <MenuItem onClick={() => goToPage('/admin/villages')}>Admin (old)</MenuItem>}
                <MenuItem onClick={() => goToPage('/mon-compte')}>Mon compte</MenuItem>
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
      </Box>
    </Box>
  );
};
