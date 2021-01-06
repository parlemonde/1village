import Link from "next/link";
import React from "react";

import { Base } from "src/components/Base";
import { SubHeader } from "src/components/SubHeader";
import { UserServiceContext } from "src/contexts/userContext";

const Home: React.FC = () => {
  const { isLoggedIn, user } = React.useContext(UserServiceContext);

  return (
    <Base topMenu={<SubHeader />}>
      <h2>Hello, World!</h2>
      {isLoggedIn ? (
        <p>Hello {user.pseudo}, you are logged in!</p>
      ) : (
        <p>
          Not logged :/{" "}
          <Link href="/login">
            <a>loggin ?</a>
          </Link>
        </p>
      )}
    </Base>
  );
};

export default Home;
