import { useRouter } from "next/router";
import React from "react";

import { Base } from "src/components/Base";
import { Steps } from "src/components/Steps";
import { BackButton } from "src/components/buttons/BackButton";
import { TextEditor } from "src/components/editing/TextEditor";
import { ActivityContext } from "src/contexts/activityContext";

const themes = [
  {
    title: "Faites une présentation libre de votre école",
  },
  {
    title: "Faites une présentation libre de votre environnement",
  },
  {
    title: "Faites une présentation libre de votre lieu de vie",
  },
  {
    title: "Faites une présentation libre d’un loisir",
  },
  {
    title: "Faites une présentation libre d’un plat",
  },
];

const PresentationStep2: React.FC = () => {
  const router = useRouter();
  const { activity } = React.useContext(ActivityContext);
  const [html, setHTML] = React.useState("");

  const data: { theme: number } = React.useMemo(() => JSON.parse(activity?.content?.find((c) => c.key === "data")?.value || null) || { theme: -1 }, [
    activity,
  ]);
  React.useEffect(() => {
    if (data.theme === -1) {
      router.push("/");
    }
  }, [data, router]);

  if (data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: "100%", padding: "0.5rem 1rem 1rem 1rem" }}>
        <BackButton />
        <Steps steps={["Choix du thème", "Présentation", "Prévisualisation"]} activeStep={1} />
        <div style={{ margin: "0 auto 1rem auto", width: "100%", maxWidth: "900px" }}>
          <h1>{themes[data.theme].title}</h1>
          <TextEditor value={html} onChange={setHTML} />
          {html.length}
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep2;
