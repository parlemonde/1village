import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import MaterialLink from "@material-ui/core/Link";
import NoSsr from "@material-ui/core/NoSsr";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { Modal } from "src/components/Modal";
import { AdminTable } from "src/components/admin/AdminTable";
import { AdminTile } from "src/components/admin/AdminTile";
import { UserContext } from "src/contexts/userContext";
import { useCountries } from "src/services/useCountries";
import { useUsers, useUserRequests } from "src/services/useUsers";
import { useVillages } from "src/services/useVillages";
import { countryToFlag } from "src/utils";

const userTypeNames = {
  0: "Professeur",
  1: "Observateur",
  2: "Médiateur",
  3: "Admin",
  4: "Super admin",
};

const Users: React.FC = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { users } = useUsers();
  const { countries } = useCountries();
  const countryMap = countries.reduce<{ [key: string]: string }>((acc, country) => {
    acc[country.isoCode] = country.name;
    return acc;
  }, {});
  const { villages } = useVillages();
  const villageMap = villages.reduce<{ [key: number]: Village }>((acc, village) => {
    acc[village.id] = village;
    return acc;
  }, {});
  const { deleteUser } = useUserRequests();
  const [deleteIndex, setDeleteIndex] = React.useState(-1);

  const actions = (id: number, index: number) => (
    <>
      <Tooltip title="Modifier">
        <IconButton
          aria-label="edit"
          onClick={() => {
            router.push(`/admin/users/edit/${id}`);
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      {user.id !== id && (
        <Tooltip title="Supprimer">
          <IconButton
            aria-label="delete"
            onClick={() => {
              setDeleteIndex(index);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <div className="admin--container">
      <Link href="/admin/users">
        <MaterialLink href="/admin/users">
          <h1 style={{ marginBottom: "1rem" }}>Utilisateurs</h1>
        </MaterialLink>
      </Link>
      <AdminTile
        title="Liste des utilisateurs"
        toolbarButton={
          <Link href="/admin/users/new">
            <Button component="a" href="/admin/users/new" variant="contained" style={{ flexShrink: 0 }} startIcon={<AddCircleIcon />}>
              Ajouter un utilisateur
            </Button>
          </Link>
        }
      >
        <AdminTable
          emptyPlaceholder="Vous n'avez pas encore d'utilisateur !"
          data={users.map((u) => ({
            id: u.id,
            pseudo: u.pseudo,
            email: u.email,
            school: u.school || <span style={{ color: "grey" }}>Non renseignée</span>,
            country: u.countryCode ? (
              `${countryToFlag(u.countryCode)} ${countryMap[u.countryCode.toUpperCase()] || ""}`
            ) : (
              <span style={{ color: "grey" }}>Non renseigné</span>
            ),
            village: u.villageId ? (
              villageMap[u.villageId]?.name || <span style={{ color: "grey" }}>Non assigné</span>
            ) : (
              <span style={{ color: "grey" }}>Non assigné</span>
            ),
            type: <Chip size="small" label={userTypeNames[u.type]} />,
          }))}
          columns={[
            { key: "pseudo", label: "Pseudo" },
            { key: "email", label: "Email" },
            { key: "school", label: "École" },
            { key: "village", label: "Village" },
            { key: "country", label: "Pays" },
            { key: "type", label: "Rôle" },
          ]}
          actions={actions}
        />
      </AdminTile>
      <NoSsr>
        <Modal
          title="Confirmer la suppression"
          open={deleteIndex !== -1}
          onClose={() => {
            setDeleteIndex(-1);
          }}
          onConfirm={async () => {
            await deleteUser(users[deleteIndex]?.id || -1);
            setDeleteIndex(-1);
          }}
          fullWidth
          maxWidth="sm"
          ariaLabelledBy="delete-village-id"
          ariaDescribedBy="delete-village-desc"
          error
        >
          <div id="delete-village-desc">
            {"Voulez vous vraiment supprimer l'utilisateur "}
            <strong>{users[deleteIndex]?.pseudo}</strong> ?
          </div>
        </Modal>
      </NoSsr>
    </div>
  );
};

export default Users;
