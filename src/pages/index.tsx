import React from 'react';

import { Accueil } from 'src/components/accueil/Accueil';
import { VideoPresentation } from 'src/components/accueil/VideoPresentation';
import { UserContext } from 'src/contexts/userContext';

const Home = () => {
  const { isLoggedIn, loginWithSso } = React.useContext(UserContext);

  if (!isLoggedIn) {
    return <VideoPresentation />;
  }

  if (!loginWithSso) {
    return <VideoPresentation />;
  }

  return <Accueil />;
};

export default Home;
