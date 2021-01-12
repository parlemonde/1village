import React from "react";

import { RightNavigation } from "src/components/Accueil/RightNavigation";
import { SubHeader } from "src/components/Accueil/SubHeader";
import { VideoPresentation } from "src/components/Accueil/VideoPresentation";
import { Base } from "src/components/Base";
import { UserServiceContext } from "src/contexts/userContext";

const Home: React.FC = () => {
  const { isLoggedIn } = React.useContext(UserServiceContext);

  if (!isLoggedIn) {
    return <VideoPresentation />;
  }

  return (
    <Base subHeader={<SubHeader />} rightNav={<RightNavigation />}>
      <h1>Suggestions d’activités </h1>
    </Base>
  );
};

export default Home;
