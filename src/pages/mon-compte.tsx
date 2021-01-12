import md5 from "md5";
import React from "react";

import Button from "@material-ui/core/Button";

import { Base } from "src/components/Base";
import { EditButton } from "src/components/buttons/EditButton";
import { HelpButton } from "src/components/buttons/HelpButton";
import { RedButton } from "src/components/buttons/RedButton";
import { UserServiceContext } from "src/contexts/userContext";

const getGravatarUrl = (email: string): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s40&r=g&d=identicon`;
};

const Presentation: React.FC = () => {
  const { user } = React.useContext(UserServiceContext);

  if (!user) {
    return <div></div>;
  }

  return (
    <Base rightNav={<HelpButton />}>
      <h1>Paramètres du compte</h1>
      <div className="account__panel">
        <h2>Paramètres du profil</h2>
        <div className="account__panel-edit-button">
          <EditButton />
        </div>

        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold" style={{ display: "block" }}>
            Photo de profil :
          </label>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: "0.5rem" }}>
            <img alt="Image de profil" src={getGravatarUrl(user.email)} width="50px" height="50px" style={{ borderRadius: "25px" }} />
          </div>
        </div>

        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold">École : </label>
          <span>{user.school || "non renseignée"}</span>
        </div>
        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold">Niveau de la classe : </label>
          <span>{user.level || "non renseigné"}</span>
        </div>
        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold">Nom du professeur : </label>
          <span>{"Non renseigné"}</span>
        </div>
      </div>

      <div className="account__panel">
        <h2>Identifiants de connection</h2>
        <div className="account__panel-edit-button">
          <EditButton />
        </div>
        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold">Pseudo de la classe : </label>
          <span>{user.pseudo}</span>
        </div>
        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold">Email du professeur : </label>
          <span>{user.email}</span>
        </div>
        <div style={{ margin: "1rem 0.5rem" }}>
          <Button variant="contained" color="secondary" size="small">
            Modifier le mot de passe
          </Button>
        </div>
      </div>

      <div className="account__panel">
        <h2>Données et confidentialité</h2>
        <div style={{ margin: "1rem 0.5rem" }}>
          <Button variant="contained" color="secondary" size="small">
            Télécharger toutes mes données
          </Button>
        </div>
        <div style={{ margin: "1rem 0.5rem" }}>
          <RedButton variant="contained" color="secondary" size="small">
            Supprimer mon compte
          </RedButton>
        </div>
      </div>
    </Base>
  );
};

export default Presentation;
