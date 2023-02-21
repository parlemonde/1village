import { Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useReducer } from 'react';

import { Base } from 'src/components/Base';
import OverflowContainer from 'src/components/OverflowContainer';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Filters } from 'src/components/accueil/Filters';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { BackButton } from 'src/components/buttons/BackButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { useVillageUsers } from 'src/services/useVillageUsers';
import EyeClosed from 'src/svg/eye-closed.svg';
import EyeVisibility from 'src/svg/eye-visibility.svg';
import type { InitialStateOptionsProps } from 'types/classroom.type';

const content1 = {
  text1: 'les familles peuvent voir toutes les activités publiées sur 1Village, mais',
  text2: 'jours après leurs publication',
};
const content2 = {
  text1: 'les familles peuvent voir toutes les activités publiées sur 1Village, mais seulement celles publiées par notre classe et',
  text2: 'jours après leurs publication',
};

//TODO: ouvrir un nouvel onglet pour les activités
//TODO: factoriser le code méthode SOLID
//TODO: traiter les erreurs de react forward avec les activityCard

const initialStateOptions = {
  default: {
    delayedDays: 0,
    hasVisibilitySetToClass: false,
  },
  timeDelay: {
    delayedDays: 0,
    hasVisibilitySetToClass: false, // reset to default
  },
  ownClassTimeDelay: {
    delayedDays: 0,
    hasVisibilitySetToClass: true, //this is always true
  },
  ownClass: {
    delayedDays: 0, // reset to default
    hasVisibilitySetToClass: true, //this is always true
  },
};

function reducer(
  state: InitialStateOptionsProps,
  action: {
    type: string;
    data: number;
  },
) {
  switch (action.type) {
    case 'default':
      return {
        ...state,
        default: {
          ...state.default,
        },
      };
    case 'timeDelay':
      return {
        ...state,
        timeDelay: {
          ...state.timeDelay,
          delayedDays: action.data,
        },
      };
    case 'ownClass':
      return {
        ...state,
        ownClass: {
          ...state.ownClass,
        },
      };
    case 'ownClassTimeDelay':
      return {
        ...state,
        ownClassTimeDelay: {
          ...state.ownClassTimeDelay,
          delayedDays: action.data,
        },
      };
    default:
      return state;
  }
}

const ClassroomParamStep1Visibility = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialStateOptions);
  const [isDisabled, setIsDisabled] = React.useState({ timeDelay: true, ownClassTimeDelay: true });
  const [radioValue, setRadioValue] = React.useState('default');
  const { updateClassroomParameters } = React.useContext(ClassroomContext);

  const { village } = React.useContext(VillageContext);
  // filters logic
  const filterCountries = React.useMemo(() => (village ? village.countries.map((c) => c.isoCode) : []), [village]);
  const [filters, setFilters] = React.useState<FilterArgs>({
    selectedType: 0,
    types: 'all',
    status: 0,
    countries: filterCountries.reduce<{ [key: string]: boolean }>((acc, c) => {
      acc[c] = true;
      return acc;
    }, {}),
    pelico: true,
  });
  const { activities, refetch } = useActivities({
    limit: 300,
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.types === 'all' ? undefined : filters.types,
  });

  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const handleDaysDelay = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    key === 'timeDelay'
      ? dispatch({ type: 'timeDelay', data: Number((event.target as HTMLInputElement).value) })
      : dispatch({ type: 'ownClassTimeDelay', data: Number((event.target as HTMLInputElement).value) });
  };
  const handleRadioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
    (event.target as HTMLInputElement).value === 'default' ? dispatch({ type: 'default', data: 0 }) : dispatch({ type: 'ownClass', data: 0 });
  };

  const handleSelectionVisibility = (key: string) => {
    switch (key) {
      case 'default':
        updateClassroomParameters(state.default);
        break;
      case 'timeDelay':
        // state.ownClass.delayedDays !== 0 && updateClassroomParameters(state.timeDelay);
        updateClassroomParameters(state.timeDelay);
        break;
      case 'ownClass':
        updateClassroomParameters(state.ownClass);
        break;
      case 'ownClassTimeDelay':
        // state.ownClassTimeDelay.delayedDays !== 0 && updateClassroomParameters(state.ownClassTimeDelay);
        updateClassroomParameters(state.ownClassTimeDelay);
        break;
      default:
        updateClassroomParameters(state.default);
        break;
    }
  };

  const handleActivityVisibility = (id: number) => {
    axiosLoggedRequest({
      method: 'PUT',
      url: `/teachers/set-activity-visibility/${id}`,
    }).then(() => {
      refetch();
    });
  };
  const toggleInput = (key: string, bool: boolean) => {
    setIsDisabled({ ...isDisabled, [key]: bool });
  };
  const onNext = () => {
    router.push('/familles/2');
  };

  return (
    <Base>
      <BackButton href="/" />
      <Steps
        steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
        urls={['/familles/1?edit', '/familles/2', '/familles/3', '/familles/4']}
        activeStep={0}
      />

      {/* Main  */}
      <div className="width-900">
        <h1>Choisissez ce que voient les familles</h1>
        <p className="text">
          Vous allez inviter les familles de vos élèves à se connecter à 1Village. Ainsi, elles pourront observer les échanges qui ont lieu en ligne.
          Vous avez la possibilité de définir ce que les familles voient sur la plateforme. Choisissez parmi ces 4 options :
        </p>
        <FormControl>
          <RadioGroup aria-label="visibility" onChange={handleRadioSelect} value={radioValue}>
            <FormControlLabel
              value="default"
              name="default"
              control={<Radio />}
              label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication"
              onFocus={() => handleSelectionVisibility('default')}
            />
            <FormControlLabel
              value="timeDelay"
              name="timeDelay"
              control={<Radio />}
              label={
                <TextnInputContainer
                  {...content1}
                  onChange={(event) => handleDaysDelay('timeDelay', event)}
                  onBlur={() => handleSelectionVisibility('timeDelay')}
                  value={state.timeDelay.delayedDays}
                  disabled={isDisabled.timeDelay}
                />
              }
              onClick={() => toggleInput('timeDelay', false)}
              disabled={isDisabled.timeDelay}
            />
            <FormControlLabel
              value="ownClass"
              name="ownClass"
              control={<Radio />}
              label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication, mais seulement celles publiées par notre classe"
              onFocus={() => handleSelectionVisibility('ownClass')}
            />
            <FormControlLabel
              value="ownClassTimeDelay"
              name="ownClassTimeDelay"
              control={<Radio />}
              label={
                <TextnInputContainer
                  {...content2}
                  onChange={(event) => handleDaysDelay('ownClassTimeDelay', event)}
                  onBlur={() => handleSelectionVisibility('ownClassTimeDelay')}
                  value={state.ownClassTimeDelay.delayedDays}
                  disabled={isDisabled.ownClassTimeDelay}
                />
              }
              onClick={() => toggleInput('ownClassTimeDelay', false)}
              disabled={isDisabled.ownClassTimeDelay}
            />
          </RadioGroup>
        </FormControl>
        <div style={{ margin: '-1rem 0' }}>
          <StepsButton next={onNext} />
        </div>

        {/* Activity Container */}
        <p className="text">Indépendamment de ce réglage, vous pouvez réglez individuellement la visibilité des activités déjà publiées en ligne.</p>
        {/* phase is set to 4 to match the array with ALL activities */}
        <Filters countries={filterCountries} filters={filters} onChange={setFilters} phase={4} />
        <OverflowContainer
          style={{
            height: '30vh',
            overflowY: 'scroll',
            marginBottom: '3rem',
            border: '1px solid rgba(76, 62, 217, 0.5)',
            borderRadius: '3px',
            padding: '1rem 0 1rem .5rem',
          }}
        >
          {activities.map((activity) => (
            <Button
              key={activity.id}
              sx={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'space-evenly',
                width: '99%',
                padding: '0 1rem',
                marginBottom: '1rem',
                filter: activity.isVisibleToParent ? 'grayscale(0)' : 'grayscale(1)',
                backgroundColor: activity.isVisibleToParent ? '' : 'rgba(76, 62, 217, 0.37)',
              }}
              onClick={() => handleActivityVisibility(activity.id)}
            >
              {/* UI logic for activity disable */}
              {activity.isVisibleToParent ? (
                <EyeVisibility style={{ width: '8%', height: 'auto' }} />
              ) : (
                <EyeClosed style={{ width: '8%', height: 'auto' }} />
              )}
              <div style={{ width: '100%' }}>
                <ActivityCard
                  activity={activity}
                  isSelf={user !== null && activity.userId === user.id}
                  user={userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined}
                  noButtons={true}
                />
              </div>
            </Button>
          ))}
        </OverflowContainer>
      </div>
    </Base>
  );
};

export default ClassroomParamStep1Visibility;

type TextInputContainerProps = {
  text1: string;
  text2?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: number;
  disabled?: boolean;
};

/**
 * Container to display text and input inline
 * @param onChange function to handle changes
 * @param value value of the input
 * @param object text object containing text to display
 */
const TextnInputContainer = ({ onChange, onBlur, value, disabled, ...props }: TextInputContainerProps) => {
  const { text1, text2 } = props;
  const spanStyle = { flexShrink: 0, marginRight: '0.5rem' };
  return (
    <div className="textnInputContainer__line" style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <span style={spanStyle}>{text1}</span>
      <TextField
        className="textnInputContainer__textfield"
        variant="standard"
        type="number"
        inputProps={{ min: 0 }}
        size="small"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        sx={{
          width: '2rem',
          marginRight: '5px',
        }}
      />
      <span style={spanStyle}>{text2}</span>
    </div>
  );
};
