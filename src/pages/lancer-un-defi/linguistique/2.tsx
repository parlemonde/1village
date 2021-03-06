import { useRouter } from 'next/router';
import React from 'react';

import { FormControlLabel, Grid, Radio, RadioGroup } from '@material-ui/core';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, LANGUAGE_SCHOOL } from 'src/activity-types/defi.const';
import { LanguageDefiData } from 'src/activity-types/defi.types';
import { MascotteData } from 'src/activity-types/presentation.types';
import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { LanguageSelector } from 'src/components/selectors/LanguageSelector';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useLanguages } from 'src/services/useLanguages';
import { secondaryColor } from 'src/styles/variables.const';
import { capitalize } from 'src/utils';
import { ActivityStatus } from 'types/activity.type';

const getArticle = (language: string) => {
  if (language.length === 0) {
    return '';
  }
  if ('aeiou'.includes(language[0])) {
    return "l'";
  }
  return 'le ';
};

const DefiStep2: React.FC = () => {
  const router = useRouter();
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, save, updateActivity } = React.useContext(ActivityContext);
  const { languages } = useLanguages();
  const [mascotteId, setMascotteId] = React.useState(0);
  const { activity: mascotte } = useActivity(mascotteId);
  const [otherValue, setOtherValue] = React.useState('');
  const data = (activity?.data as LanguageDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  React.useEffect(() => {
    if (data !== null && 'languageCode' in data && data.languageCode.length > 2) {
      setOtherValue(data.languageCode.slice(0, 2).toLowerCase());
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
    const l = (mascotte?.data as MascotteData)?.languages ?? [];
    return l.reduce<{ label: string; value: string }[]>(
      (acc, l) => {
        if (l === 'fre') {
          return acc;
        }
        const language = languages.find((o) => o.alpha3_b === l);
        if (language) {
          acc.push({
            label: capitalize(language.french),
            value: language.alpha2,
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

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const onNext = () => {
    if (!data.languageCode || data.languageIndex === 0) {
      return;
    }
    save().catch(console.error);
    router.push('/lancer-un-defi/linguistique/3');
  };

  const setLanguage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const languageCode = (event.target as HTMLInputElement).value;
    const language = languages.find((l) => l.alpha2.toLowerCase() === languageCode.slice(0, 2))?.french ?? '';
    updateActivity({ data: { ...data, languageCode, language } });
  };
  const setLanguageIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateActivity({ data: { ...data, languageIndex: parseInt((event.target as HTMLInputElement).value, 10) } });
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Choix de la langue', "Choix de l'objet", 'Explication', 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 0 : 1}
        />
        <div className="width-900">
          <h1>Choix de la langue</h1>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <AvatarImg user={user} size="large" />
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <p className="text">Votre mascotte sait parler ces langues, dans laquelle allez-vous créer votre défi ?</p>
                <div style={{ border: `1px dashed ${secondaryColor}`, padding: '1rem', borderRadius: '5px' }}>
                  <RadioGroup aria-label="gender" name="gender1" value={data.languageCode} onChange={setLanguage}>
                    {mascotteLanguages.map((l) => (
                      <FormControlLabel key={l.value} value={l.value} control={<Radio />} label={l.label} style={{ cursor: 'pointer' }} />
                    ))}
                    <div style={{ display: 'flex', width: '100%' }}>
                      <FormControlLabel
                        disabled={otherValue.length === 0}
                        value={`${otherValue.toLowerCase()}_other`}
                        control={<Radio />}
                        label="Autre :"
                        style={{ cursor: 'pointer' }}
                      />
                      <LanguageSelector
                        style={{ flex: 1, minWidth: 0 }}
                        value={otherValue}
                        onChange={(v) => {
                          setOtherValue(v);
                          const language = languages.find((l) => l.alpha2.toLowerCase() === v.toLowerCase())?.french ?? '';
                          updateActivity({ data: { ...data, languageCode: `${v.toLowerCase()}_other`, language } });
                        }}
                      />
                    </div>
                  </RadioGroup>
                </div>
              </Grid>
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
          {<StepsButton prev={isEdit ? undefined : `/lancer-un-defi/linguistique/1?edit=${activity.id}`} next={onNext} />}
        </div>
      </div>
    </Base>
  );
};

export default DefiStep2;
