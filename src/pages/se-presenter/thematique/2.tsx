import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Button } from "@material-ui/core";

import { Base } from "src/components/Base";
import { Steps } from "src/components/Steps";
import { BackButton } from "src/components/buttons/BackButton";
import ImageEditor from "src/components/editing/ImageEditor/ImageEditor";
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
  const { activity, updateActivity, addContent, deleteContent } = React.useContext(ActivityContext);

  const data = activity?.data || null;

  React.useEffect(() => {
    if (data === null || !("theme" in data) || data.theme === -1) {
      router.push("/");
    }
  }, [data, router]);

  const onChangeContent = (index: number) => (newValue: string) => {
    const newContent = [...activity.processedContent];
    newContent[index].value = newValue;
    updateActivity({ processedContent: newContent });
  };

  if (data === null || !("theme" in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: "100%", padding: "0.5rem 1rem 1rem 1rem" }}>
        <BackButton />
        <Steps steps={["Choix du thème", "Présentation", "Prévisualisation"]} activeStep={1} />
        <div style={{ margin: "0 auto 1rem auto", width: "100%", maxWidth: "900px" }}>
          <h1>{themes[data.theme as number].title}</h1>
          {activity.processedContent.map((p, index) => {
            if (p.type === "text") {
              return <TextEditor key={p.id} value={p.value} onChange={onChangeContent(index)} />;
            }
            if (p.type === "image") {
              return (
                <ImageEditor
                  key={p.id}
                  id={p.id}
                  value={p.value}
                  onChange={onChangeContent(index)}
                  onDelete={() => {
                    deleteContent(index);
                  }}
                />
              );
            }
            return null;
          })}

          <button
            onClick={() => {
              addContent("text");
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              addContent("image");
            }}
          >
            +i
          </button>
          <div style={{ width: "100%", textAlign: "right", margin: "1rem 0" }}>
            <Link href="/se-presenter/thematique/3">
              <Button component="a" href="/se-presenter/thematique/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default PresentationStep2;
