import Link from "next/link";
import React from "react";

import MaterialLink from "@material-ui/core/Link";

const Users: React.FC = () => {
  return (
    <div className="admin--container">
      <Link href="/admin/users">
        <MaterialLink href="/admin/users">
          <h1 style={{ marginBottom: "1rem" }}>Utilisateurs</h1>
        </MaterialLink>
      </Link>
    </div>
  );
};

export default Users;
