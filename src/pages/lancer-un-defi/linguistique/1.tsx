import { useRouter } from 'next/router';
import React from 'react';

import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Select, Chip, NativeSelect } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { DEFI, isLanguage, LANGUAGE_SCHOOL } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import type { MascotteData } from 'src/activity-types/mascotte.types';
// import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import { LanguageSelector } from 'src/components/selectors/LanguageSelector';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/services/useActivity';
import { useLanguages } from 'src/services/useLanguages';
// import { secondaryColor } from 'src/styles/variables.const';
import { capitalize } from 'src/utils';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const getArticle = (language: string) => {
  if (language.length === 0) {
    return '';
  }
  if ('aeiou'.includes(language[0])) {
    return "l'";
  }
  return 'le ';
};

const DefiStep1 = () => {
  const router = useRouter();
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { selectedPhase } = React.useContext(VillageContext);
  const { activity, save, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const { languages } = useLanguages();
  const [mascotteId, setMascotteId] = React.useState(0);
  const { activity: mascotte } = useActivity(mascotteId);
  const [otherValue, setOtherValue] = React.useState('');
  const data = (activity?.data as LanguageDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.LANGUAGE, {
          languageCode: '',
          language: '',
          languageIndex: 0,
          objectIndex: -1,
          defiIndex: null,
          explanationContentIndex: 1,
        });
      } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.LANGUAGE, {
          languageCode: '',
          language: '',
          languageIndex: 0,
          objectIndex: -1,
          defiIndex: null,
          explanationContentIndex: 1,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  React.useEffect(() => {
    if (data !== null && 'languageCode' in data && data.languageCode.length > 2) {
      setOtherValue(data.languageCode.slice(0, 3).toLowerCase());
    }
  }, [data]);

  const getMascotteId = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/activities/mascotte',
    });
    if (!response.error) {
      setMascotteId(response.data.id === -1 ? 0 : response.data.id);
    }
  }, [axiosLoggedRequest]);
  React.useEffect(() => {
    getMascotteId().catch(console.error);
  }, [getMascotteId]);

  const mascotteLanguages = React.useMemo(() => {
    if (!mascotte || !languages) {
      return [
        {
          label: 'Français',
          value: 'fr',
        },
      ];
    }
    const l = (mascotte?.data as MascotteData)?.fluentLanguages ?? [];
    return l.reduce<{ label: string; value: string }[]>(
      (acc, l) => {
        if (l === 'fre') {
          return acc;
        }
        const language = languages.find((o) => o.alpha3_b === l);
        if (language) {
          acc.push({
            label: capitalize(language.french),
            value: language.alpha3_b,
          });
        }
        return acc;
      },
      [
        {
          label: 'Français',
          value: 'fr',
        },
      ],
    );
  }, [mascotte, languages]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/linguistique/2');
  };

  const setLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const languageCode = (event.target as HTMLInputElement).value;
    const language = languages.find((l) => l.alpha3_b.toLowerCase() === languageCode.slice(0, 2))?.french ?? '';
    updateActivity({ data: { ...data, languageCode, language } });
  };
  const setLanguageIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateActivity({ data: { ...data, languageIndex: parseInt((event.target as HTMLInputElement).value, 10) } });
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        {!isEdit && <BackButton href="/lancer-un-defi" />}
        <Steps
          steps={['Langue', 'Thème', 'Présentation', 'Défi', 'Prévisualisation']}
          urls={[
            '/lancer-un-defi/linguistique/1?edit',
            '/lancer-un-defi/linguistique/2',
            '/lancer-un-defi/linguistique/3',
            '/lancer-un-defi/linguistique/4',
            '/lancer-un-defi/linguistique/5',
          ]}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Choisissez dans quelle langue vous souhaitez lancer le défi</h1>
          <div>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} md={4} style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  {user && <AvatarImg user={user} size="large" />}
                </div>
              </Grid> */}
              <FormControl fullWidth>
                <p className="text">Vous pourrez ensuite choisir le thème de votre défi.</p>
                <Select native chip aria-label="gender" name="gender1" value={data.languageCode} onChange={setLanguage}>
                  <h1>Langues parlées par votre mascotte</h1>
                  {mascotteLanguages.map((l) => (
                    <option native key={l.value} value={l.value} label={l.label} style={{ cursor: 'pointer' }} />
                  ))}
                  <h1>Autres langues</h1>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <option value={otherValue.toLowerCase()} style={{ cursor: 'pointer' }} />
                    <LanguageSelector
                      native
                      multiple={false}
                      style={{ flex: 1, minWidth: 0 }}
                      value={otherValue}
                      onChange={(v) => {
                        setOtherValue(v);
                        const language = languages.find((l) => l.alpha3_b.toLowerCase() === v.toLowerCase())?.french ?? '';
                        updateActivity({ data: { ...data, languageCode: `${v.toLowerCase()}_other`, language } });
                      }}
                    />
                  </div>
                </Select>
              </FormControl>
            </Grid>
            {data.languageCode && (
              <div style={{ margin: '1rem 0' }}>
                <p className="text">
                  Dans votre classe, {getArticle(data.language ?? '')}
                  {data.language} est une langue :
                </p>
                <RadioGroup aria-label="gender" name="gender1" value={data.languageIndex} onChange={setLanguageIndex}>
                  {LANGUAGE_SCHOOL.map((l, index) => (
                    <FormControlLabel key={index} value={index + 1} control={<Radio />} label={l} style={{ cursor: 'pointer' }} />
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
          {<StepsButton next={onNext} />}
        </div>
      </div>
    </Base>
  );
};

export default DefiStep1;
