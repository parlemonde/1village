import React from "react";

import { Base } from "src/components/Base";
import { SubHeader } from "src/components/SubHeader";

const Home: React.FC = () => {
  return (
    <Base subHeader={<SubHeader />} style={{ padding: "0 1.2rem" }}>
      <h1>Suggestions d’activités </h1>
    </Base>
  );
};

export default Home;
