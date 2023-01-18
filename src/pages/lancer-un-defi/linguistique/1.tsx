import type { SelectChangeEvent } from '@mui/material';
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Select,
  Chip,
  NativeSelect,
  FormLabel,
  MenuItem,
  Box,
  InputLabel,
  FormControl,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { isDefi } from 'src/activity-types/anyActivity';
import { DEFI, isLanguage, LANGUAGE_SCHOOL } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import type { MascotteData } from 'src/activity-types/mascotte.types';
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
      console.log('je suis ici');
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

  const setLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCode = (event.target as HTMLSelectElement).value;
    const language = languages.find((l) => l.alpha3_b.toLowerCase() === languageCode.slice(0, 2))?.french ?? '';
    updateActivity({ data: { ...data, languageCode, language } });
  };
  const setLanguageIndex = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateActivity({ data: { ...data, languageIndex: parseInt((event.target as HTMLSelectElement).value, 10) } });
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  //   const mascotteLanguages = [
  // {label: 'Français', value: 'fr'},
  // {label: 'Afar', value: 'aar'},
  // {label: 'Acoli', value: 'ach'},
  // {label: 'Bengali', value: 'ben'},
  // {label: 'Avar', value: 'ava'}
  // ]

  const LanguagesToRemove = mascotteLanguages.reduce((list, currentValue) => {
    list.push(currentValue.label);
    return list;
  }, new Array<string>());

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
              <Grid item xs={12} md={8}>
                <p className="text">Vous pourrez ensuite choisir le thème de votre défi.</p>
                <FormControl variant="outlined" className="full-width" style={{ width: '100%' }}>
                  {/* <InputLabel id="demo-simple-select">Langue</InputLabel> */}
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    aria-label="gender"
                    name="gender1"
                    value={data.languageCode}
                    onChange={() => setLanguage}
                    label="Langue"
                  >
                    <h1>Langues parlées par votre mascotte</h1>
                    {mascotteLanguages.map(
                      (value) => (
                        <li key={value.label} style={{ cursor: 'pointer' }}>
                          {value.label}
                        </li>
                      ),
                      // <MenuItem key={l.value} value={l.value} style={{ cursor: 'pointer' }} />
                    )}
                    <Divider />
                    <h1>Autres langues</h1>
                    {languages
                      // .filter(filterLanguages ? (!mascotteLanguages) => filterLanguages.find((c3) => c3.toLowerCase() === c.alpha3_b.toLowerCase()) : () => true)
                      .filter((language) => !LanguagesToRemove.includes(language.french))
                      .map((language) => (
                        <p key={language.french} style={{ cursor: 'pointer' }}>
                          {language.french}
                        </p>
                      ))}
                    ,
                    {/* <LanguageSelector
                        key={otherValue.toLowerCase()}
                        value={otherValue.toLowerCase()}
                        style={{ height: '30vh', overflowY: 'scroll', cursor: 'pointer' }}
                        onChange={(v) => {
                          setOtherValue(v);
                          const language = languages.find((l) => l.alpha3_b.toLowerCase() === v.toLowerCase())?.french ?? '';
                          updateActivity({ data: { ...data, languageCode: `${v.toLowerCase()}_other`, language } });
                        }}
                      /> */}
                    {/* <h1>Autres langues</h1>
                      <LanguageSelector
                      // multiple={false}
                      style={{ flex: 1, minWidth: 0 }}
                      label={<h1>Autres langues</h1>}
                      value={otherValue}
                      onChange={(v) => {
                        setOtherValue(v);
                        const language = languages.find((l) => l.alpha3_b.toLowerCase() === v.toLowerCase())?.french ?? '';
                        updateActivity({ data: { ...data, languageCode: `${v.toLowerCase()}_other`, language } });
                      }}
                    />  */}
                  </Select>
                </FormControl>
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
          {<StepsButton next={onNext} />}
        </div>
      </div>
    </Base>
  );
};

export default DefiStep1;
