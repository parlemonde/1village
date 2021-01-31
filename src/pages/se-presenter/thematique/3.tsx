import { useRouter } from "next/router";
import React from "react";

import { Button } from "@material-ui/core";

import { Base } from "src/components/Base";
import { Steps } from "src/components/Steps";
import { SimpleActivityPreview } from "src/components/activityEditor";
import { BackButton } from "src/components/buttons/BackButton";
import { ActivityContext } from "src/contexts/activityContext";

const PresentationStep3: React.FC = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);

  const data = activity?.data || null;

  React.useEffect(() => {
    if (data === null || !("theme" in data) || data.theme === -1) {
      router.push("/");
    }
  }, [data, router]);

  if (data === null || !("theme" in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: "100%", padding: "0.5rem 1rem 1rem 1rem" }}>
        <BackButton />
        <Steps steps={["Choix du thème", "Présentation", "Prévisualisation"]} activeStep={2} />
        <div style={{ margin: "0 auto 1rem auto", width: "100%", maxWidth: "900px" }}>
          <h1>Pré-visualisez votre présentation et publiez la</h1>
          <p className="text" style={{ fontSize: "1.1rem" }}>
            Voici une pré-visualisation de votre présentation. Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde
            !
          </p>
          <div style={{ width: "100%", textAlign: "right", margin: "1rem 0" }}>
            <Button variant="outlined" color="primary">
              Publier
            </Button>
          </div>
          <SimpleActivityPreview />
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep3;
