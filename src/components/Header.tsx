import md5 from "md5";
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";

import { UserServiceContext } from "src/contexts/userContext";
import Logo from "src/svg/logo.svg";

const getGravatarUrl = (email: string): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s40&r=g&d=identicon`;
};

export const Header: React.FC = () => {
  const { user } = React.useContext(UserServiceContext);

  return (
    <header>
      <div className="header__container with-shadow">
        <Logo style={{ width: "40px", height: "auto" }} />
        <h1 className="title" style={{ margin: "0 0 0 0.5rem" }}>
          1 Village
        </h1>
        <div className="header__search">
          <IconButton aria-label="search" size="small">
            <SearchIcon />
          </IconButton>
          <InputBase placeholder="Rechercher" />
        </div>
        {user && (
          <div className="header__user">
            <IconButton aria-label="search">
              <SettingsIcon />
            </IconButton>
            <img src={getGravatarUrl(user.email)} width="40px" height="40px" style={{ borderRadius: "20px" }} />
          </div>
        )}
      </div>
    </header>
  );
};
