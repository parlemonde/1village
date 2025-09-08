import React from 'react';

import { Checkbox } from '@mui/material';

import type { MascotteData } from 'src/activity-types/mascotte.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/mascotteChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';

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
            <h1>Les règles d’1Village !</h1>
            <p>
              {data?.mascotteName ?? 'Votre mascotte'} est votre mascotte sur 1Village. C’est grâce à elle que les autres classes vous reconnaîtront
              toute l’année !
            </p>

            <p>
              {data?.mascotteName ?? 'Votre mascotte'}, tout comme moi Pélico, est désormais un citoyen d’internet ! Et comme à la maison ou à
              l’école, il y a certaines règles à respecter sur internet et sur 1Village. Pour les découvrir, vous pouvez réaliser l’activité “La
              citoyenneté sur internet” de notre catalogue d’activités !
            </p>

            <p>Mais en attendant, j’ai quelques conseils à vous donner ! Sur internet et 1Village :</p>

            <ul className="mascotte-rules-list">
              <li data-emoji="📝">
                Il faut faire attention à ce que nous partageons et à ce que nous disons car cela impacte les autres citoyens d’internet.
              </li>

              <li data-emoji="🕶"> Il ne faut pas partager des photos de ses camarades et des pélicopains sans leur permission.</li>

              <li data-emoji="🤔">
                Enfin, il ne faut pas croire tout ce qu’on peut lire, voir ou écouter car certaines informations peuvent être fausses.
              </li>
            </ul>

            <p>Avez-vous bien compris mes conseils les pélicopains ?</p>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', textAlign: 'right' }}>
              <label style={{ cursor: 'pointer' }}>
                <Checkbox
                  checked={cguChecked}
                  onChange={(event) => {
                    setCguChecked(event.target.checked);
                  }}
                />
                <span>{'Nous avons compris et nous sommes d’accord avec les conseils de Pélico !'}</span>
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
