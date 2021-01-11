import md5 from "md5";
import { useRouter } from "next/router";
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";

import { UserServiceContext } from "src/contexts/userContext";
import Logo from "src/svg/logo.svg";

const getGravatarUrl = (email: string): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s40&r=g&d=identicon`;
};

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = React.useContext(UserServiceContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const goToAccount = () => {
    setAnchorEl(null);
    router.push("/mon-compte");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header>
      <div className="header__container with-shadow">
        <Logo style={{ width: "40px", height: "auto" }} />
        <h1 className="title" style={{ margin: "0 0 0 0.5rem" }}>
          1Village
        </h1>
        <div className="header__search">
          <IconButton aria-label="search" size="small">
            <SearchIcon />
          </IconButton>
          <InputBase placeholder="Rechercher" />
        </div>
        {user && (
          <div className="header__user">
            <div>
              <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu}>
                <SettingsIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                getContentAnchorEl={null}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={goToAccount}> Mon compte</MenuItem>
                <MenuItem onClick={logout}>
                  <span className="text text--alert">Se déconnecter</span>
                </MenuItem>
              </Menu>
            </div>
            <img src={getGravatarUrl(user.email)} width="40px" height="40px" style={{ borderRadius: "20px" }} />
          </div>
        )}
      </div>
    </header>
  );
};
