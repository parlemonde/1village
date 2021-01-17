import Link from "next/link";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const NewUser: React.FC = () => {
  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/users">
          <MaterialLink href="/admin/users">
            <h1>Utilisateurs</h1>
          </MaterialLink>
        </Link>
        <h1>Nouveau</h1>
      </Breadcrumbs>
    </div>
  );
};

export default NewUser;
