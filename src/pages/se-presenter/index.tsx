import React from 'react';

import { Base } from 'src/components/Base';
import { SuggestionCarousel } from 'src/components/SuggestionCarousel';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import { UserContext } from 'src/contexts/userContext';
import MascotteIcon from 'src/svg/presentation/mascotte.svg';
import ThematiqueIcon from 'src/svg/presentation/thematique.svg';
import { axiosRequest } from 'src/utils/axiosRequest';
import { UserType } from 'types/user.type';

const suggestions = [
  {
    title: 'Créer sa mascotte',
    button: 'Mascotte',
    href: '/mascotte/1',
    text: 'Créez votre mascotte pour présenter votre classe à vos Pélicopains. Créez-la à votre image, elle vous représentera dans votre village-monde !',
    icon: MascotteIcon,
    disabled: true,
  },
  {
    title: 'Créer une présentation thématique',
    button: 'Présentation thématique',
    href: '/se-presenter/thematique/1',
    text: 'Partagez un aspect de votre quotidien ou de votre culture aux Pelicopains ! Présentez en vidéo, image, texte et son, votre école, votre environnement, votre plat favori, vos jeux de récréation et plus encore.',
    icon: ThematiqueIcon,
    disabled: false,
  },
];

const activities = [
  {
    label: 'Créer sa mascotte',
    href: '/mascotte/1',
    icon: MascotteIcon,
    disabled: true,
    disabledText: 'Vous avez déjà créé votre mascotte ! Pour la modifier, rendez-vous dans le menu “mes activités“.',
  },
  {
    label: 'Créer une présentation thématique',
    href: '/se-presenter/thematique/1',
    icon: ThematiqueIcon,
    disabled: false,
    disabledText: '',
  },
];

const Presentation = () => {
  const { user } = React.useContext(UserContext);
  const [currentSuggestions, setCurrentSuggestions] = React.useState(suggestions);
  const [currentActivities, setCurrentActivities] = React.useState(activities);

  const getMascotte = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/activities/mascotte`,
    });
    if (!response.error && response.data.id === -1) {
      setCurrentSuggestions([{ ...suggestions[0], disabled: false }, suggestions[1]]);
      setCurrentActivities([{ ...activities[0], disabled: false }, activities[1]]);
    }
  }, []);

  React.useEffect(() => {
    if (user && user.type < UserType.MEDIATOR) {
      getMascotte().catch();
    }
    if (user && user.type >= UserType.MEDIATOR) {
      setCurrentActivities([{ ...activities[0], disabledText: 'Pelico ne peut pas créer de mascotte !' }, activities[1]]);
    }
  }, [user, getMascotte]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1>{"Suggestions d'activités"}</h1>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <SuggestionCarousel suggestions={currentSuggestions} />
          </div>
          <h1>Choisissez votre présentation</h1>
          <ActivityChoice activities={currentActivities} />
        </div>
      </div>
    </Base>
  );
};

export default Presentation;
