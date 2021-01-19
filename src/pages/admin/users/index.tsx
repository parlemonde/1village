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
import { userTypeNames } from "types/user.type";
import type { Village } from "types/village.type";

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

  const actions = (id: number) => (
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
              setDeleteIndex(users.findIndex((u) => u.id === id));
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
            { key: "pseudo", label: "Pseudo", sortable: true },
            { key: "email", label: "Email", sortable: true },
            { key: "school", label: "École", sortable: true },
            { key: "village", label: "Village", sortable: true },
            { key: "country", label: "Pays", sortable: true },
            { key: "type", label: "Rôle", sortable: true },
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
