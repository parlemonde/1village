import Link from "next/link";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const NewVillage: React.FC = () => {
  return (
    <div className="admin--container">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/villages">
          <MaterialLink href="/admin/villages">
            <h1>Villages</h1>
          </MaterialLink>
        </Link>
        <h1>Nouveau</h1>
      </Breadcrumbs>
    </div>
  );
};

export default NewVillage;
