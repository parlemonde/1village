import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import CreerContenuLibre from './CreerContenuLibre';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';

const COMPONENT_MAP = {
  CreerContenuLibre: CreerContenuLibre,
  // Autres composants peuvent être ajoutés ici
};

type Link = {
  name: string;
  componentKey: keyof typeof COMPONENT_MAP;
};
interface NavItemProps {
  key?: number;
  link: Link;
  primary: string;
  onSelect: (componentKey: keyof typeof COMPONENT_MAP) => void;
}

const Creer = () => {
  const [selectedComponentKey, setSelectedComponentKey] = React.useState<keyof typeof COMPONENT_MAP | null>(null);
  const links: Link[] = [
    { name: 'Créer du contenu libre', componentKey: 'CreerContenuLibre' },
    { name: 'Créer une activité H5P', componentKey: 'CreerContenuLibre' },
    { name: 'Paramétrer l’hymne', componentKey: 'CreerContenuLibre' },
    { name: 'Mixer l’hymne', componentKey: 'CreerContenuLibre' },
  ];

  const NavItem = ({ link, primary, onSelect }: NavItemProps) => (
    <ListItem className="like-button grey" component="a" button onClick={() => onSelect(link.componentKey)}>
      <ListItemText primary={primary} />
      <ListItemIcon>
        <DoubleChevronRightIcon />
      </ListItemIcon>
    </ListItem>
  );

  const renderSelectedComponent = () => {
    // Si aucun composant n'est sélectionné, ne rien rendre
    if (!selectedComponentKey) return null;

    // Obtenez le composant sélectionné à partir du mappage
    const SelectedComponent = COMPONENT_MAP[selectedComponentKey];
    // Rendre le composant sélectionné
    return <SelectedComponent onBackClick={() => setSelectedComponentKey(null)} />;
  };

  if (selectedComponentKey) {
    return renderSelectedComponent();
  }

  const renderTitle = () => {
    return (
      <div>
        <h1>Créer</h1>
        <p>
          C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les droits d’accès, la composition des
          villages-mondes et accéder à la liste complète des utilisateurs.{' '}
        </p>
      </div>
    );
  };

  const renderLinks = () => {
    return (
      links && (
        <List sx={{ padding: 0, margin: 0 }}>
          {links?.map((item, id) => (
            <NavItem key={id} link={item} primary={item.name} onSelect={setSelectedComponentKey} />
          ))}
        </List>
      )
    );
  };
  return (
    <>
      {renderTitle()}
      {renderLinks()}
    </>
  );
};

export default Creer;
