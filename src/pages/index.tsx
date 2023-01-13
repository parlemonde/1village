import React from 'react';

import { Accueil } from 'src/components/accueil/Accueil';
import { NewHome } from 'src/components/accueil/NewHome';
import { UserContext } from 'src/contexts/userContext';

const Home = () => {
  const { isLoggedIn } = React.useContext(UserContext);

  if (!isLoggedIn) {
    return <NewHome />;
  }

  return <Accueil />;
};

export default Home;
