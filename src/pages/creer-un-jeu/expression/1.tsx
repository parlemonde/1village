import { useRouter } from 'next/router';
import React from 'react';
import type { SyntheticEvent } from 'react';

import { TextField, Autocomplete, FormControlLabel, Grid, Radio, RadioGroup, FormControl } from '@mui/material';

import { isDefi, isGame } from 'src/activity-types/anyActivity';
import { DEFI, isLanguage, LANGUAGE_SCHOOL } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { isExpression, DEFAULT_EXPRESSION_DATA, isMimic, DEFAULT_MIMIC_DATA } from 'src/activity-types/game.constants';
import type { MascotteData } from 'src/activity-types/mascotte.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import Play from 'src/components/game/Play';
import MimicSelector from 'src/components/selectors/MimicSelector';
import { GAME_FIELDS_CONFIG } from 'src/config/games/game';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/services/useActivity';
import { useCurrencies } from 'src/services/useCurrencies';
import { useLanguages } from 'src/services/useLanguages';
import { capitalize, getUserDisplayName } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { normalizeString } from 'src/utils/isNormalizedStringEqual';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { MimicData, MimicsData, ExpressionData, ExpressionsData } from 'types/game.type';
import { GameType } from 'types/game.type';

// const getArticle = (language: string) => {
//   if (language.length === 0) {
//     return '';
//   }
//   if ('aeiou'.includes(language[0])) {
//     return "l'";
//   }
//   return 'le ';
// };

const ExpressionStep1 = () => {
  const router = useRouter();
  const { languages } = useLanguages();
  const { currencies } = useCurrencies();

  const onNext = () => {
    router.push('/creer-un-jeu/expression/2');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Langue', 'Thème', 'Présentation', 'Défi', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/expression/1?edit',
            '/creer-un-jeu/expression/2',
            '/creer-un-jeu/expression/3',
            '/creer-un-jeu/expression/4',
            '/creer-un-jeu/expression/5',
          ]}
          activeStep={0}
        />
        <div>
          <Play gameType={GameType.EXPRESSION} stepNumber={0} />
        </div>
        <div className="width-900">{<StepsButton next={onNext} />}</div>
      </div>
    </Base>
  );
};

export default ExpressionStep1;
