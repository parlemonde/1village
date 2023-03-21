import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';

import { Button, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

import { Base } from 'src/components/Base';
import OverflowContainer from 'src/components/OverflowContainer';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import type { FilterArgs } from 'src/components/accueil/Filters';
import { Filters } from 'src/components/accueil/Filters';
import { filterActivitiesByTerm, filterActivitiesWithLastMimicGame } from 'src/components/accueil/Filters/FilterActivities';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { BackButton } from 'src/components/buttons/BackButton';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivities } from 'src/services/useActivities';
import { useVillageUsers } from 'src/services/useVillageUsers';
import EyeClosed from 'src/svg/eye-closed.svg';
import EyeVisibility from 'src/svg/eye-visibility.svg';
import type { Activity } from 'types/activity.type';
import type { Classroom, InitialStateOptionsProps } from 'types/classroom.type';
import { UserType } from 'types/user.type';

const content1 = {
  text1: 'les familles peuvent voir toutes les activités publiées sur 1Village, mais',
  text2: 'jours après leurs publication',
};
const content2 = {
  text1: 'les familles peuvent voir toutes les activités publiées sur 1Village, mais seulement celles publiées par notre classe et',
  text2: 'jours après leurs publication',
};

type StateType = {
  delayedDays: number;
  hasVisibilitySetToClass: boolean;
};

//TODO: ouvrir un nouvel onglet pour les activités
//TODO: factoriser le code méthode SOLID
//TODO: traiter les erreurs de react forward avec les activityCard

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
  const { classroom, setClassroom } = useContext(ClassroomContext);

  const [state, dispatch] = useReducer(reducer, {
    default: { delayedDays: 0, hasVisibilitySetToClass: false },
    timeDelay: { delayedDays: classroom?.delayedDays || 0, hasVisibilitySetToClass: false },
    ownClass: { delayedDays: 0, hasVisibilitySetToClass: true },
    ownClassTimeDelay: { delayedDays: classroom?.delayedDays || 0, hasVisibilitySetToClass: true },
  });

  const [isDisabled, setIsDisabled] = React.useState({
    default: false,
    timeDelay: false,
    ownClass: false,
    ownClassTimeDelay: false,
  });
  const [radioValue, setRadioValue] = React.useState('default');
  const { updateClassroomParameters } = React.useContext(ClassroomContext);
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { users } = useVillageUsers();

  useEffect(() => {
    if (classroom?.delayedDays !== undefined && classroom?.hasVisibilitySetToClass === false) {
      setRadioValue(classroom.delayedDays > 0 ? 'timeDelay' : 'default');
      dispatch({ type: 'timeDelay', data: classroom.delayedDays || 0 });
    } else if (classroom?.hasVisibilitySetToClass === false) {
      setRadioValue('default');
    } else if (classroom?.delayedDays !== undefined && classroom?.hasVisibilitySetToClass === true) {
      setRadioValue(classroom.delayedDays > 0 ? 'ownClassTimeDelay' : 'ownClass');
      dispatch({ type: 'ownClassTimeDelay', data: classroom.delayedDays || 0 });
    } else if (classroom?.hasVisibilitySetToClass === true) {
      setRadioValue('ownClass');
    }
  }, [classroom?.delayedDays, classroom?.hasVisibilitySetToClass]);

  const isMediatorOrFamily = user !== null && user.type === (UserType.MEDIATOR || UserType.ADMIN || UserType.SUPER_ADMIN || UserType.FAMILY);

  const filterCountries = React.useMemo(
    () =>
      !village || (selectedPhase === 1 && !isMediatorOrFamily)
        ? user && user.country !== null
          ? [user.country?.isoCode.toUpperCase()]
          : []
        : village.countries.map((c) => c.isoCode),
    [selectedPhase, village, user, isMediatorOrFamily],
  );

  //TODO: may be filterCountries should be with country form student > teacher
  const [filters, setFilters] = React.useState<FilterArgs>({
    selectedType: 0,
    selectedPhase: 0,
    types: 'all',
    status: 0,
    countries: filterCountries.reduce<{ [key: string]: boolean }>((acc, c) => {
      acc[c] = true;
      return acc;
    }, {}),
    pelico: true,
    searchTerm: '',
  });

  const { activities, refetch, isLoading } = useActivities({
    limit: 300,
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.types === 'all' ? undefined : filters.types,
  });

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
  const handleRadioSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = (event.target as HTMLInputElement).value;
    setRadioValue(value);

    switch (value) {
      case 'default':
        dispatch({ type: 'default', data: 0 });
        setIsDisabled({ ...isDisabled, timeDelay: true, ownClass: true, ownClassTimeDelay: true });
        break;
      case 'timeDelay':
        dispatch({ type: 'timeDelay', data: classroom?.delayedDays || 0 });
        setIsDisabled({ ...isDisabled, default: true, ownClass: true, ownClassTimeDelay: true });
        break;
      case 'ownClass':
        dispatch({ type: 'ownClass', data: 0 });
        setIsDisabled({ ...isDisabled, default: true, timeDelay: true, ownClassTimeDelay: true });
        break;
      case 'ownClassTimeDelay':
        dispatch({ type: 'ownClassTimeDelay', data: classroom?.delayedDays || 0 });
        setIsDisabled({ ...isDisabled, default: true, timeDelay: true, ownClass: true });
        break;
      default:
        dispatch({ type: 'default', data: 0 });
        setIsDisabled({ ...isDisabled, timeDelay: true, ownClass: true, ownClassTimeDelay: true });
        break;
    }
  };

  const handleSelectionVisibility = (key: string) => {
    let newState: StateType;
    switch (key) {
      case 'default':
        newState = state.default;
        break;
      case 'timeDelay':
        newState = state.timeDelay;
        break;
      case 'ownClass':
        newState = state.ownClass;
        break;
      case 'ownClassTimeDelay':
        newState = state.ownClassTimeDelay;
        break;
      default:
        newState = state.default;
        break;
    }
    updateClassroomParameters(newState);
    setClassroom((prevState) => {
      if (!prevState) {
        return {
          delayedDays: newState.delayedDays,
          hasVisibilitySetToClass: newState.hasVisibilitySetToClass,
        } as Classroom;
      }
      return { ...prevState, ...newState };
    });
  };

  // const isRadioSelected = (value: string): boolean | undefined => radioValue === value;

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

  // React.useEffect(() => {
  //     if (user && user.type === UserType.TEACHER) {
  //       updateClassroomValidator());
  // }
  //   }, [updateClassroomValidator]);

  const onNext = () => {
    router.push('/familles/2');
  };

  const activitiesFiltered = React.useMemo(() => {
    if (activities && activities.length > 0) {
      const activitiesWithLastMimic = filterActivitiesWithLastMimicGame(activities);
      const activitiesFilterBySearchTerm =
        filters.searchTerm.length > 0 ? filterActivitiesByTerm(activitiesWithLastMimic, filters.searchTerm) : activitiesWithLastMimic;
      return activitiesFilterBySearchTerm;
    } else {
      return [];
    }
  }, [activities, filters.searchTerm]);

  const sortedActivities: Activity[] = activitiesFiltered
    .filter((activity) => activity.createDate !== undefined)
    .sort((a, b) => {
      const dateA = new Date(a.createDate as string);
      const dateB = new Date(b.createDate as string);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
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
            Vous allez inviter les familles de vos élèves à se connecter à 1Village. Ainsi, elles pourront observer les échanges qui ont lieu en
            ligne. Vous avez la possibilité de définir ce que les familles voient sur la plateforme. Choisissez parmi ces 4 options :
          </p>
          <FormControl>
            <RadioGroup aria-label="visibility" onChange={handleRadioSelect} value={radioValue}>
              <FormControlLabel
                value="default"
                name="default"
                control={<Radio />}
                label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication"
                onFocus={() => handleSelectionVisibility('default')}
                style={radioValue !== 'default' ? { color: '#CCC' } : {}}
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
                    disabled={radioValue !== 'timeDelay'}
                  />
                }
                onClick={() => toggleInput('timeDelay', false)}
                disabled={isDisabled?.timeDelay}
                style={radioValue !== 'timeDelay' ? { color: '#CCC' } : {}}
              />
              <FormControlLabel
                value="ownClass"
                name="ownClass"
                control={<Radio />}
                label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication, mais seulement celles publiées par notre classe"
                onFocus={() => handleSelectionVisibility('ownClass')}
                style={radioValue !== 'ownClass' ? { color: '#CCC' } : {}}
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
                    disabled={radioValue !== 'ownClassTimeDelay'}
                  />
                }
                onClick={() => toggleInput('ownClassTimeDelay', false)}
                disabled={isDisabled?.ownClassTimeDelay}
                style={radioValue !== 'ownClassTimeDelay' ? { color: '#CCC' } : {}}
              />
            </RadioGroup>
          </FormControl>
          <div style={{ margin: '-1rem 0' }}>
            <StepsButton next={onNext} />
          </div>

          {/* Activity Container */}
          <p className="text">
            Indépendamment de ce réglage, vous pouvez réglez individuellement la visibilité des activités déjà publiées en ligne.
          </p>
          {/* phase is set to 4 to match the array with ALL activities */}
          <Filters countries={filterCountries} filters={filters} onChange={setFilters} phase={selectedPhase} isMesFamilles />
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
            {isLoading ? (
              <div className="loading-spinner">
                <CircularProgress />
                <p>Loading activities...</p>
              </div>
            ) : (
              <>
                {sortedActivities.map((activity) => (
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
              </>
            )}
          </OverflowContainer>
        </div>
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
