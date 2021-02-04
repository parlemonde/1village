import React from "react";

import { Base } from "src/components/Base";
import { FilterSelect } from "src/components/FilterSelect";
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
      <h1>Dernières activités</h1>
      <div style={{ display: "flex", alignItems: "center", margin: "0.5rem 0" }}>
        <span className="text text--bold">Filtres :</span>
        <FilterSelect
          name="Activitées"
          options={[
            { key: 0, label: "Toutes" },
            { key: 1, label: "Présentations" },
            { key: 2, label: "Énigmes" },
            { key: 3, label: "Défis" },
            { key: 4, label: "Jeux" },
            { key: 5, label: "Questions" },
          ]}
        />

        <FilterSelect
          name="Status"
          options={[
            { key: 0, label: "Tous" },
            { key: 1, label: "En cours" },
            { key: 2, label: "Terminées" },
          ]}
        />
      </div>
    </Base>
  );
};

export default Home;
