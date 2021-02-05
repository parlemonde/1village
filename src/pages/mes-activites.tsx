import React from "react";

import { Activities } from "src/components/Activities";
import { Base } from "src/components/Base";

const MesActivites: React.FC = () => {
  return (
    <Base>
      <h1>{"Mes activités"}</h1>
      <Activities onlySelf={true} />
    </Base>
  );
};

export default MesActivites;
