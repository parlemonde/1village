import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";

import { KeepRatio } from "src/components/KeepRatio";
import PelicoSearch from "src/svg/PelicoSearch.svg";

const Custom404: React.FunctionComponent = () => {
  const router = useRouter();
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/");
  };

  return (
    <div className="bg-gradiant">
      <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="LoginContainer">
        <div className="text-center" style={{ overflow: "auto" }}>
          <h1 className="text-primary" style={{ fontSize: "12vw", margin: 0, position: "relative", display: "inline-block" }}>
            404
            <div style={{ width: "15vw", position: "absolute", top: "10%", left: "120%" }}>
              <PelicoSearch width="100%" height="auto" />
            </div>
          </h1>
          <h2>{"Oups ! Pelico n'a pas trouvé la page."}</h2>
          <p>La page que vous cherchez est introuvable ou temporairement inaccessible.</p>
          <Button onClick={handleClick} color="primary" variant="outlined" style={{ marginTop: "3rem" }}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </KeepRatio>
    </div>
  );
};

export default Custom404;
