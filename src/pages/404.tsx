import { useRouter } from "next/router";
import React from "react";

const Custom404: React.FunctionComponent = () => {
  const router = useRouter();
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/");
  };

  return (
    <div>
      <div className="text-center">
        <h1 style={{ marginTop: "2rem" }}>Oups, cette page n&apos;existe pas !</h1>
        <a onClick={handleClick} style={{ marginTop: "3rem" }}>
          Revenir à l&apos;accueil
        </a>
      </div>
    </div>
  );
};

export default Custom404;
