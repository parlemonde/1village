import { Checkbox } from '@mui/material';

import { ActivityStatus } from 'types/activity.type';

import React from 'react';

import type { MascotteData } from 'src/activity-types/mascotte.types';
import { getErrorSteps } from 'src/components/activities/mascotteChecks';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep4 = () => {
  const { activity } = React.useContext(ActivityContext);
  const [cguChecked, setCguChecked] = React.useState(false);

  const data = (activity?.data as MascotteData) || null;
  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 3);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity && activity.status === ActivityStatus.PUBLISHED) {
      setCguChecked(true);
    }
  }, [activity]);

  return (
    activity && (
      <Base>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <Steps
            steps={[
              'Votre classe',
              `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
              'Langues et monnaies',
              'Le web de Pélico',
              'Prévisualiser',
            ]}
            urls={['/mascotte/1?edit', '/mascotte/2', '/mascotte/3', '/mascotte/4', '/mascotte/5']}
            activeStep={3}
            errorSteps={errorSteps}
          />
          <div className="width-900" style={{ textAlign: 'justify' }}>
            <h1>Le web de Pélico, et ses règles</h1>
            <p>Bonjour {data?.mascotteName}, bienvenue sur 1Village !</p>

            <p>
              {data?.mascotteName ?? 'Votre mascotte'} est votre mascotte de classe, il s’agit de votre profil, c’est grâce à lui que les autres
              classes vous reconnaîtront sur 1Village, notre espace d’échange sécurisé en ligne.
            </p>

            <p>{data?.mascotteName ?? 'Votre mascotte'}, tout comme moi Pélico, est désormais un citoyen numérique.</p>

            <p>
              C&apos;est-à-dire ? Un citoyen numérique est une personne qui interagit avec d’autres personnes en ligne. Sur 1Village, ces personnes
              sont tes pélicopains, des enfants comme toi qui ont soif de découvertes !
            </p>

            <p>
              Comme à la maison, à l’école ou dans la rue, certaines règles permettent de mieux vivre-ensemble. Alors, comme nous allons échanger
              ensemble sur 1Village durant toute l’année scolaire. Je me suis demandé quelles règles pourrions nous adopter cette année sur 1Village.
              Voilà les questions que je me suis posées :
            </p>

            <ul className="mascotte-rules-list">
              <li data-emoji="📝">
                Avons-nous le droit d’écrire et de publier ce que l’on veut sur internet ? Y compris des insultes, grossièretés ou méchancetés ?
              </li>

              <li data-emoji="🔏">Pouvons-nous utiliser librement des œuvres (image, texte, son…) dont nous ne sommes pas les auteurs ?</li>

              <li data-emoji="🗣">
                Devons-nous nous questionner sur la portée de nos propos sur internet ? ? Et peut-on décider seul de ce que l’on publie ?
              </li>

              <li data-emoji="🤔">Lors d’une recherche sur internet, les informations que l’on trouve sont-elles toutes vraies ?</li>

              <li data-emoji="📸">Peut-on filmer et publier du contenu sur lequel apparaissent nos camarades sans leur permission ?</li>

              <li data-emoji="🕶">Avons-nous le droit de partager les photos, vidéos et textes publiés par nos pélicopains en dehors d’1Village ?</li>
            </ul>

            <p>
              D’ailleurs, savez-vous s’il existe des règles dans votre pays qui décrivent nos droits et devoirs sur le web ? Existe-t-il un droit
              mondial, commun à tous les pays ?
            </p>

            <p>Êtes-vous d’accord pour réfléchir à ces questions avec votre classe et tous vos nouveaux pélicopains ?</p>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', textAlign: 'right' }}>
              <label style={{ cursor: 'pointer' }}>
                <Checkbox
                  checked={cguChecked}
                  onChange={(event) => {
                    setCguChecked(event.target.checked);
                  }}
                />
                <span>{"Oui, nous l'acceptons !"}</span>
              </label>
            </div>
            <StepsButton prev="/mascotte/3" next={cguChecked ? '/mascotte/5' : undefined} />
          </div>
        </div>
      </Base>
    )
  );
};

export default MascotteStep4;
