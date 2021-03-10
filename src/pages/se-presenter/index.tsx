import React from 'react';

import { Base } from 'src/components/Base';
import { SuggestionCarousel } from 'src/components/SuggestionCarousel';
import { ActivityChoice } from 'src/components/activities/ActivityChoice';
import { UserContext } from 'src/contexts/userContext';
import ImageIcon from 'src/svg/image.svg';
import { UserType } from 'types/user.type';

const suggestions = [
  {
    title: 'Créer sa mascotte',
    button: 'Mascotte',
    href: '/se-presenter/mascotte/1',
    text:
      'Créez votre mascotte pour présenter votre classe à vos Pélicopains. Créez-la à votre image, elle vous représentera dans votre village-monde !',
    icon: ImageIcon,
  },
  {
    title: 'Présentation thématique',
    button: 'Présentation thématique',
    href: '/se-presenter/thematique/1',
    text:
      'Partagez un aspect de votre quotidien ou de votre culture aux Pelicopains ! Présentez en vidéo, image, texte et son votre école, votre environnement, votre plat favori, vos jeux de récréation et plus encore.',
    icon: ImageIcon,
  },
];

const mascotte = {
  label: 'Créer sa mascotte',
  href: '/se-presenter/mascotte/1',
  icon: ImageIcon,
};

const activities = [
  {
    label: 'Présentation thématique',
    href: '/se-presenter/thematique/1',
    icon: ImageIcon,
  },
];

const Presentation: React.FC = () => {
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const [hasMascotte, setHasMascotte] = React.useState(false);

  const getMascotte = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities/mascotte`,
    });
    if (response.error) {
      setHasMascotte(true);
    }
  }, [axiosLoggedRequest]);

  React.useEffect(() => {
    if (user && user.type <= UserType.MEDIATOR) {
      getMascotte().catch();
    }
  }, [user, getMascotte]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          {hasMascotte && (
            <>
              <h1>{"Suggestions d'activités"}</h1>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <SuggestionCarousel suggestions={suggestions} />
              </div>
            </>
          )}
          <h1>Choisissez votre présentation</h1>
          <ActivityChoice activities={hasMascotte ? [mascotte, ...activities] : activities} />
        </div>
      </div>
    </Base>
  );
};

export default Presentation;
