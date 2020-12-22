import Link from "next/link";
import React from "react";

import { UserServiceContext } from "src/contexts/userContext";

const Home: React.FC = () => {
  const { isLoggedIn, user } = React.useContext(UserServiceContext);

  return (
    <div>
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
    </div>
  );
};

export default Home;
