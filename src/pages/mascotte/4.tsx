import React from 'react';

import type { MascotteData } from 'src/activity-types/presentation.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep4 = () => {
  const { activity } = React.useContext(ActivityContext);
  const data = (activity?.data as MascotteData) || null;

  return (
    activity && (
      <Base>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <Steps
            steps={[
              'Votre classe',
              `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
              'Langues et monnaies',
              'Le web de Pelico',
              'Prévisualiser',
            ]}
            activeStep={3}
          />
          <div className="width-900">
            <h1>Le web de Pelico, et ses règles</h1>
            <p>Bonjour {data ? data.mascotteName : 'Votre mascotte'}, bienvenue sur 1Village !</p>

            <p>
              {data ? data.mascotteName : 'Votre mascotte'} est votre mascotte de classe, il s’agit de votre profil, c’est grâce à lui que les autres
              classes vous reconnaîtront sur 1Village, notre espace d’échange sécurisé en ligne.
            </p>

            <p>{data ? data.mascotteName : 'Votre mascotte'}, tout comme moi Pelico, est désormais un citoyen numérique.</p>

            <p>
              C&apos;est-à-dire ? : Un citoyen numérique est une personne qui interagit avec d’autres personnes en ligne. Sur 1Village, ces personnes
              sont tes Pélicopains, des enfants comme toi qui ont soif de découvertes !
            </p>

            <p>
              Comme à la maison, à l’école ou dans la rue, certaines règles permettent de mieux vivre-ensemble. Alors, comme nous allons échanger
              ensemble sur 1Village durant toute l’année scolaire. Je vous propose de respecter quelques règles, pour éviter toute prise de bec !
            </p>

            <p>
              📝 Adoptez une attitude responsable vis-à-vis de ce que vous écrivez et de ce que vous dites sur 1Village. Veillez à utiliser un langage
              poli sans grossièretés, injures ou mots méchants, envers vos Pélicopains.
            </p>

            <p>
              🔏 Respectez la loi sur la propriété des œuvres Copiez et utilisez uniquement des textes, des images, des sons que vous avez créé, ou
              dont vous disposez des droits après les avoir demandés à l’auteur.
            </p>

            <p>
              🗣 Interrogez-vous sur la portée de vos propos avant de publier du contenu sur 1Village. Sur 1Village, la publication de contenu (photo,
              texte, vidéo etc.) se fait toujours sous le contrôle de votre professeur.
            </p>

            <p>
              🤔 Vérifiez toujours les informations transmises sur internet. Tout ce qui est partagé sur le web n’est pas nécessairement vrai.. y
              compris sur 1Village !
            </p>

            <p>
              📸 Ne publiez jamais une photo ou une vidéo sur laquelle apparaît un camarade sans lui avoir préalablement demandé l’autorisation. Le
              consentement des individus est essentiel pour publier sur le web, y compris sur 1Village.
            </p>

            <p>
              🕶 Ne partagez pas en dehors d’1Village les photos, vidéos et textes publiés par vos Pélicopains… à moins qu’ils ne donnent leur accord !
            </p>

            <p>
              Alors, {data ? data.mascotteName : 'Votre mascotte'} avec ta classe, êtes-vous d’accord pour respecter les règles du web de Pelico ?
            </p>
            <p>En passant à l&apos;étape suivante vous acceptez ces conditions d&apos;utilisation.</p>
            <StepsButton prev="/mascotte/3" next="/mascotte/5" />
          </div>
        </div>
      </Base>
    )
  );
};

export default MascotteStep4;
