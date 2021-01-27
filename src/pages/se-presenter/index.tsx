import React from "react";

import { ActivityChoice } from "src/components/ActivityChoice";
import { Base } from "src/components/Base";
import { SuggestionCarousel } from "src/components/SuggestionCarousel";
import ImageIcon from "src/svg/image.svg";

const suggestions = [
  {
    title: "Créer sa mascotte",
    button: "Mascotte",
    href: "/se-presenter/mascotte/1",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed gravida risus. Nullam gravida cursus efficitur. Cras euismod purus non libero elementum pulvinar. Cras id tempus dui, ac lacinia augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque quam nisi, vehicula nec lobortis id, rhoncus blandit est.",
    icon: ImageIcon,
  },
  {
    title: "Présentation thématique",
    button: "Présentation thématique",
    href: "/se-presenter/thematique/1",
    text:
      "Nulla nec dolor sed nisl maximus suscipit ut at eros. Proin vitae neque a nulla ullamcorper pretium. Proin eget vehicula elit. Etiam non ipsum in quam placerat vestibulum fringilla vel quam. Sed finibus, augue non tristique rhoncus, leo felis imperdiet turpis, id congue turpis diam at magna. Mauris ut ligula porta, elementum elit quis, rutrum turpis.",
    icon: ImageIcon,
  },
];

const activities = [
  {
    label: "Créer sa mascotte",
    href: "/se-presenter/mascotte/1",
    icon: ImageIcon,
  },
  {
    label: "Présentation thématique",
    href: "/se-presenter/thematique/1",
    icon: ImageIcon,
  },
];

const Presentation: React.FC = () => {
  return (
    <Base>
      <h1>{"Suggestions d'activités"}</h1>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <SuggestionCarousel suggestions={suggestions} />
      </div>
      <h1>Choisissez votre présentation</h1>
      <ActivityChoice activities={activities} />
    </Base>
  );
};

export default Presentation;
