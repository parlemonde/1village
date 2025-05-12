import { useRouter } from 'next/router';
import type { SyntheticEvent } from 'react';
import React from 'react';

import { TextField, Autocomplete, FormControlLabel, Grid, Radio, RadioGroup, FormControl } from '@mui/material';

import { isDefi } from 'src/activity-types/anyActivity';
import { DEFI, isLanguage, LANGUAGE_SCHOOL } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import type { MascotteData } from 'src/activity-types/mascotte.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/services/useActivity';
import { useLanguages } from 'src/services/useLanguages';
import { capitalize } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { normalizeString } from 'src/utils/string';
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

  const { selectedPhase } = React.useContext(VillageContext);
  const { activity, save, createNewActivity, updateActivity } = React.useContext(ActivityContext);
  const { languages } = useLanguages();
  const [mascotteId, setMascotteId] = React.useState(0);
  const { activity: mascotte } = useActivity(mascotteId);
  const data = (activity?.data as LanguageDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const created = React.useRef(false);
  React.useEffect(() => {
    if (!created.current) {
      if (!('edit' in router.query)) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.LANGUAGE, {
          themeName: '',
          hasSelectedThemeNameOther: false,
          languageCode: '',
          language: '',
          languageIndex: 0,
          themeIndex: null,
          defiIndex: null,
          hasSelectedDefiNameOther: false,
          explanationContentIndex: 1,
        });
      } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
        created.current = true;
        createNewActivity(ActivityType.DEFI, selectedPhase, DEFI.LANGUAGE, {
          themeName: '',
          hasSelectedThemeNameOther: false,
          languageCode: '',
          language: '',
          languageIndex: 0,
          themeIndex: null,
          defiIndex: null,
          hasSelectedDefiNameOther: false,
          explanationContentIndex: 1,
        });
      }
    }
  }, [activity, createNewActivity, router, selectedPhase]);

  const getMascotteId = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/activities/mascotte',
    });
    if (!response.error) {
      setMascotteId(response.data.id === -1 ? 0 : response.data.id);
    }
  }, []);

  React.useEffect(() => {
    getMascotteId().catch(console.error);
  }, [getMascotteId]);

  const mascotteLanguages = React.useMemo(() => {
    if (!mascotte || !languages) return [];
    const mascotteData = mascotte.data as MascotteData;

    return [...mascotteData.fluentLanguages, ...mascotteData.minorLanguages, ...mascotteData.wantedForeignLanguages];
  }, [mascotte, languages]);

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  const onNext = () => {
    save().catch(console.error);
    router.push('/lancer-un-defi/linguistique/2');
  };

  const handleLanguage = (_event: SyntheticEvent, languageCode: string) => {
    const language =
      languageCode.length === 2
        ? languages.find((language) => languageCode === language.alpha2.toLowerCase())?.french
        : languages.find((language) => languageCode === language.alpha3_b.toLowerCase())?.french;
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
      <PageLayout>
        {!isEdit && <BackButton href="/lancer-un-defi" />}
        <Steps
          steps={[capitalize(data.language) || 'Langue', 'Thème', 'Présentation', 'Défi', 'Prévisualisation']}
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
              <Grid item xs={12} md={8}>
                <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }} className="text">
                  Vous pourrez ensuite choisir le thème de votre défi.
                </p>
                <FormControl variant="outlined" className="full-width" style={{ width: '100%', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
                  <Autocomplete
                    id="grouped-demo"
                    onChange={(e, value) => {
                      if (!value) return;
                      const formatedValue = value.alpha2.length > 0 ? value.alpha2 : value.alpha3_b;
                      handleLanguage(e, formatedValue); //TODO : Need to test this line
                    }}
                    options={languages.sort((a, b) => {
                      if (mascotteLanguages.includes(a.alpha3_b)) {
                        return mascotteLanguages.includes(b.alpha3_b) ? -b.french.localeCompare(a.french) : -1;
                      } else {
                        return mascotteLanguages.includes(b.alpha3_b) ? 1 : -b.french.localeCompare(a.french);
                      }
                    })}
                    groupBy={(option) =>
                      mascotteLanguages.find((mascotteLanguage) => mascotteLanguage === option.alpha2 || mascotteLanguage === option.alpha3_b)
                        ? 'Langues parlées par votre mascotte'
                        : 'Autres langues'
                    }
                    getOptionLabel={(option) => option.french}
                    filterOptions={(options, state) => {
                      return options.filter((option) =>
                        normalizeString(option.french).toLowerCase().startsWith(normalizeString(state.inputValue).toLowerCase()),
                      );
                    }}
                    renderInput={(params) => <TextField {...params} label="Langues" />}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {data.languageCode && (
              <div style={{ margin: '1rem 0' }}>
                <p className="text">
                  Dans votre classe, {getArticle(data.language ?? '')}
                  {data.language} est une langue :
                </p>
                <RadioGroup value={data.languageIndex} onChange={setLanguageIndex}>
                  {LANGUAGE_SCHOOL.map((l, index) => (
                    <FormControlLabel key={index} value={index + 1} control={<Radio />} label={l} style={{ cursor: 'pointer' }} />
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>

          {<StepsButton next={onNext} />}
        </div>
      </PageLayout>
    </Base>
  );
};

export default DefiStep1;
