import React from "react";

import { Base } from "src/components/Base";
import { RightNavigation } from "src/components/accueil/RightNavigation";
import { SubHeader } from "src/components/accueil/SubHeader";
import { VideoPresentation } from "src/components/accueil/VideoPresentation";
import { UserContext } from "src/contexts/userContext";

const Home: React.FC = () => {
  const { isLoggedIn } = React.useContext(UserContext);

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
