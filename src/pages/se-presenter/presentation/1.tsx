import React from "react";

import { Base } from "src/components/Base";
import { Steps } from "src/components/Steps";
import { ThemeChoiceButton } from "src/components/buttons/ThemeChoiceButton";

const themes = [
  {
    label: "Présentation de l’école",
    description: "Présentez votre école à vos Pélicopains",
  },
  {
    label: "Présentation de votre environnement",
    description: "Présentez vos paysages, votre nature à vos Pélicopains",
  },
  {
    label: "Présentation de votre lieu de vie",
    description: "Présentez votre ville/village/quartier à vos Pélicopains",
  },
  {
    label: "Présentation d’un loisir",
    description: "Présentez votre activité préférée à vos Pélicopains",
  },
  {
    label: "Présentation d’un plat",
    description: "Présentez votre plat préféré ou emblématique à vos Pélicopains",
  },
];

const PresentationStep1: React.FC = () => {
  return (
    <Base>
      <div style={{ width: "100%", padding: "0.5rem 1rem 1rem 1rem" }}>
        <Steps steps={["Choix du thème", "Présentation", "Prévisualisation"]} />
        <div style={{ margin: "0 auto 1rem auto", width: "100%", maxWidth: "900px" }}>
          <h1>Choisissez le thème de votre présentation</h1>
          <p className="text" style={{ fontSize: "1.1rem" }}>
            Dans cette activité, nous vous proposons de faire une présentation générale aux Pélicopains sur le thème de votre choix.
          </p>
          <div>
            {themes.map((t, index) => (
              <ThemeChoiceButton key={index} label={t.label} description={t.description} />
            ))}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep1;
