import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";

import { UserContext } from "src/contexts/userContext";
import { VillageContext } from "src/contexts/villageContext";
import { secondaryColor } from "src/styles/variables.const";
import Logo from "src/svg/logo.svg";
import { getGravatarUrl } from "src/utils";
import { UserType } from "types/user.type";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = React.useContext(UserContext);
  const { village, showSelectVillageModal } = React.useContext(VillageContext);
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
          <InputBase placeholder="Rechercher" inputProps={{ "aria-label": "search" }} />
        </div>
        {user && (
          <div className="header__user">
            {user.type > UserType.TEACHER && (
              <div style={{ border: `1px solid ${secondaryColor}`, borderRadius: "12px" }}>
                <span className="text text--small" style={{ margin: "0 0.6rem" }}>
                  {village ? village.name : "Village non choisi !"}
                </span>
                <Button variant="contained" color="secondary" size="small" style={{ margin: "-1px -1px 0 0" }} onClick={showSelectVillageModal}>
                  {village ? "Changer" : "Choisir un village"}
                </Button>
              </div>
            )}
            {user.type >= UserType.ADMIN && (
              <Link href="/admin/villages">
                <Button component="a" href="/admin/villages" variant="contained" color="primary" size="small" style={{ marginLeft: "1rem" }}>
                  {"Aller à l'interface Admin"}
                </Button>
              </Link>
            )}
            <div>
              <IconButton
                style={{ width: "40px", height: "40px", margin: "0 0.2rem" }}
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
            <img alt="Image de profil" src={getGravatarUrl(user.email)} width="40px" height="40px" style={{ borderRadius: "20px" }} />
          </div>
        )}
      </div>
    </header>
  );
};
