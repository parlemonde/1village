import Link from "next/link";
import React from "react";

import { Base } from "src/components/Base";
import { SubHeader } from "src/components/SubHeader";
import { UserServiceContext } from "src/contexts/userContext";

const Home: React.FC = () => {
  const { isLoggedIn, user } = React.useContext(UserServiceContext);

  return (
    <Base subHeader={<SubHeader />} style={{ padding: "0 1.2rem" }}>
      <h1>Suggestions d’activités </h1>
      {isLoggedIn ? (
        <p>Bonjour {user.pseudo}, tu es connecté !</p>
      ) : (
        <p>
          <Link href="/login">
            <a>Se connecter ?</a>
          </Link>
        </p>
      )}
    </Base>
  );
};

export default Home;
