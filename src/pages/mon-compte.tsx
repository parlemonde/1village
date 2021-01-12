import md5 from "md5";
import { useSnackbar } from "notistack";
import React from "react";

import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert, AlertTitle } from "@material-ui/lab";

import { Base } from "src/components/Base";
import { EditButton } from "src/components/buttons/EditButton";
import { HelpButton } from "src/components/buttons/HelpButton";
import { RedButton } from "src/components/buttons/RedButton";
import { PanelInput } from "src/components/mon-compte/PanelInput";
import { UserServiceContext } from "src/contexts/userContext";
import type { User } from "types/user.type";

const getGravatarUrl = (email: string): string => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s40&r=g&d=identicon`;
};

const Presentation: React.FC = () => {
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { enqueueSnackbar } = useSnackbar();
  const [newUser, setNewUser] = React.useState<User>(user);
  const [editMode, setEditMode] = React.useState(-1);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!user) {
    return <div></div>;
  }

  const updateEditMode = (newEditMode: number, save: boolean = false) => async () => {
    if (save) {
      await updateUser();
    } else {
      setNewUser(user);
    }
    setEditMode(newEditMode);
  };

  const updateUser = async () => {
    setIsLoading(true);
    const updatedValues = {
      school: newUser.school,
      level: newUser.level,
      teacherName: newUser.teacherName,
      pseudo: newUser.pseudo,
      email: newUser.email,
    };
    const response = await axiosLoggedRequest({
      method: "PUT",
      url: `/users/${user.id}`,
      data: updatedValues,
    });
    if (response.error) {
      setNewUser(user);
      enqueueSnackbar("Une erreur inconnue est survenue...", {
        variant: "error",
      });
    } else {
      setUser({ ...user, ...updatedValues });
      enqueueSnackbar("Compte mis à jour avec succès !", {
        variant: "success",
      });
    }
    setIsLoading(false);
  };

  return (
    <Base rightNav={<HelpButton />}>
      <h1>Paramètres du compte</h1>
      <div className="account__panel">
        <h2>Paramètres du profil</h2>
        <div className="account__panel-edit-button">{editMode !== 0 && <EditButton onClick={updateEditMode(0)} />}</div>

        <div style={{ margin: "0.5rem" }}>
          <label className="text text--bold" style={{ display: "block" }}>
            Photo de profil :
          </label>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: "0.5rem" }}>
            <img alt="Image de profil" src={getGravatarUrl(user.email)} width="50px" height="50px" style={{ borderRadius: "25px" }} />
          </div>
        </div>

        <PanelInput
          value={newUser.school}
          defaultValue={"non renseignée"}
          label="École :"
          placeholder="Nom de votre école"
          isEditMode={editMode === 0}
          onChange={(school) => {
            setNewUser((u) => ({ ...u, school }));
          }}
        />
        <PanelInput
          value={newUser.level}
          defaultValue={"non renseigné"}
          label="Niveau de la classe :"
          placeholder="Niveau de votre classe"
          isEditMode={editMode === 0}
          onChange={(level) => {
            setNewUser((u) => ({ ...u, level }));
          }}
        />
        <PanelInput
          value={newUser.teacherName}
          defaultValue={"non renseigné"}
          label="Nom du professeur :"
          placeholder="Nom du professeur"
          isEditMode={editMode === 0}
          onChange={(teacherName) => {
            setNewUser((u) => ({ ...u, teacherName }));
          }}
        />
        {editMode === 0 && (
          <div className="text-center">
            <Button size="small" variant="contained" style={{ margin: "0.5rem" }} onClick={updateEditMode(-1)}>
              Annuler
            </Button>
            <Button size="small" variant="contained" color="secondary" style={{ margin: "0.2rem" }} onClick={updateEditMode(-1, true)}>
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      <div className="account__panel">
        <h2>Identifiants de connection</h2>
        <div className="account__panel-edit-button">{editMode !== 1 && <EditButton onClick={updateEditMode(1)} />}</div>
        {editMode === 1 && (
          <Alert severity="warning" style={{ margin: "0.5rem 0", backgroundColor: "white", border: "1px solid #E1C7D1" }}>
            <AlertTitle>Attention !</AlertTitle>
            Votre <strong>pseudo</strong> et votre <strong>email</strong> sont vos identifiants de connection.
          </Alert>
        )}
        <PanelInput
          value={newUser.pseudo}
          defaultValue={""}
          label="Pseudo de la classe :"
          placeholder="Pseudo de la classe"
          isEditMode={editMode === 1}
          onChange={(pseudo) => {
            setNewUser((u) => ({ ...u, pseudo }));
          }}
        />
        <PanelInput
          value={newUser.email}
          defaultValue={""}
          label="Email du professeur :"
          placeholder="Email du professeur"
          isEditMode={editMode === 1}
          onChange={(email) => {
            setNewUser((u) => ({ ...u, email }));
          }}
        />
        <div style={{ margin: "1rem 0.5rem" }}>
          <Button variant="contained" color="secondary" size="small">
            Modifier le mot de passe
          </Button>
        </div>
        {editMode === 1 && (
          <div className="text-center">
            <Button size="small" variant="contained" style={{ margin: "0.5rem" }} onClick={updateEditMode(-1)}>
              Annuler
            </Button>
            <Button size="small" variant="contained" color="secondary" style={{ margin: "0.2rem" }} onClick={updateEditMode(-1, true)}>
              Enregistrer
            </Button>
          </div>
        )}
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

      <Backdrop style={{ zIndex: 100, color: "#fff" }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default Presentation;
