import React from "react";

import { Base } from "src/components/Base";

const PresentationStep1: React.FC = () => {
  return (
    <Base>
      <div style={{ width: "100%", padding: "0.5rem 1rem 1rem 1rem" }}>
        <div style={{ margin: "0 auto", width: "100%", maxWidth: "800px" }}>
          <h1>Choisissez le thème de votre présentation</h1>
          <p className="text" style={{ fontSize: "1.1rem" }}>
            Dans cette activité, nous vous proposons de faire une présentation générale aux Pélicopains sur le thème de votre choix.
          </p>
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep1;
