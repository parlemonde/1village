// TODO : keep this import for delayed days logic
// import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import type { Country } from 'server/entities/country';

import { Button, Card, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import AccessControl from 'src/components/AccessControl';
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
import { primaryColor } from 'src/styles/variables.const';
import EyeClosed from 'src/svg/eye-closed.svg';
import EyeVisibility from 'src/svg/eye-visibility.svg';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import type { Classroom, InitialStateOptionsProps } from 'types/classroom.type';
import { UserType } from 'types/user.type';

type StateType = {
  delayedDays: number;
  hasVisibilitySetToClass: boolean;
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

const ClassroomParamStep1 = () => {
  const router = useRouter();
  const { classroom, setClassroom } = useContext(ClassroomContext);

  const [state, dispatch] = useReducer(reducer, {
    default: { delayedDays: 0, hasVisibilitySetToClass: false },
    timeDelay: { delayedDays: classroom?.delayedDays || 1, hasVisibilitySetToClass: false },
    ownClass: { delayedDays: 0, hasVisibilitySetToClass: true },
    ownClassTimeDelay: { delayedDays: classroom?.delayedDays || 1, hasVisibilitySetToClass: true },
  });

  const [radioValue, setRadioValue] = React.useState('default');
  const [modalStep, setModalStep] = React.useState(0);
  const modalStepTimeout = React.useRef<number | undefined>(undefined);
  const { updateClassroomParameters } = React.useContext(ClassroomContext);
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const { users } = useVillageUsers();

  useEffect(() => {
    if (classroom?.delayedDays !== undefined && classroom?.hasVisibilitySetToClass === false) {
      setRadioValue(classroom.delayedDays > 0 ? 'timeDelay' : 'default');
      dispatch({ type: 'timeDelay', data: classroom.delayedDays || 1 });
    } else if (classroom?.hasVisibilitySetToClass === false) {
      setRadioValue('default');
    } else if (classroom?.delayedDays !== undefined && classroom?.hasVisibilitySetToClass === true) {
      setRadioValue(classroom.delayedDays > 0 ? 'ownClassTimeDelay' : 'ownClass');
      dispatch({ type: 'ownClassTimeDelay', data: classroom.delayedDays || 1 });
    } else if (classroom?.hasVisibilitySetToClass === true) {
      setRadioValue('ownClass');
    }
  }, [classroom?.delayedDays, classroom?.hasVisibilitySetToClass]);

  const isMediatorOrFamily =
    user !== null &&
    (user.type === UserType.MEDIATOR || user.type === UserType.ADMIN || user.type === UserType.SUPER_ADMIN || user.type === UserType.FAMILY);

  const filterCountries: Country[] = React.useMemo(() => {
    if (!village || (selectedPhase === 1 && !isMediatorOrFamily)) {
      return user && user.country && user.country !== null ? [user.country] : [];
    } else {
      return village.countries;
    }
  }, [selectedPhase, village, user, isMediatorOrFamily]);

  const [filters, setFilters] = React.useState<FilterArgs>({
    selectedType: 0,
    selectedPhase: 0,
    types: 'all',
    status: 0,
    countries: filterCountries.reduce<{ [key: string]: boolean }>((acc, c) => {
      acc[c.isoCode] = true;
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

  const handleRadioSelect = (key: string): void => {
    setRadioValue(key);

    let newState: StateType;

    switch (key) {
      case 'default':
        newState = state.default;
        dispatch({ type: 'default', data: 0 });
        // setIsDisabled({ ...isDisabled, timeDelay: true, ownClass: true, ownClassTimeDelay: true });
        break;
      case 'timeDelay':
        newState = state.timeDelay;
        dispatch({ type: 'timeDelay', data: classroom?.delayedDays || 1 });
        // handleDaysDelay()
        // setIsDisabled({ ...isDisabled, default: true, ownClass: true, ownClassTimeDelay: true });
        break;
      case 'ownClass':
        newState = state.ownClass;
        dispatch({ type: 'ownClass', data: 0 });
        // setIsDisabled({ ...isDisabled, default: true, timeDelay: true, ownClassTimeDelay: true });
        break;
      case 'ownClassTimeDelay':
        newState = state.ownClassTimeDelay;
        dispatch({ type: 'ownClassTimeDelay', data: classroom?.delayedDays || 1 });
        // handleDaysDelay()
        // setIsDisabled({ ...isDisabled, default: true, timeDelay: true, ownClass: true });
        break;
      default:
        newState = state.default;
        break;
    }
    //debouncedhandleRadioSelect(newState);
    updateClassroomParameters(newState);

    if (activities) {
      const isVisibleToParent = newState.hasVisibilitySetToClass || key === 'default';
      activities.forEach((activity) => {
        if (activity.isVisibleToParent !== isVisibleToParent) {
          handleActivityVisibility(activity.id);
        }
      });
    }

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

  const handleActivityVisibility = (id: number) => {
    axiosRequest({
      method: 'PUT',
      url: `/teachers/set-activity-visibility/${id}`,
    }).then((response) => {
      if (response.status === 204) {
        setModalStep(2);
        modalStepTimeout.current = window.setTimeout(() => {
          setModalStep(0);
        }, 2000);
        if (response.status !== 204) {
          clearTimeout(modalStepTimeout.current);
          setModalStep(1);
        }
      }
      refetch();
    });
  };

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
      <AccessControl featureName="id-family" redirectToWIP>
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
              ligne. Vous avez la possibilité de définir ce que les familles voient sur la plateforme. Choisissez parmi ces 2 options :
            </p>
            <FormControl>
              <RadioGroup
                aria-label="visibility"
                onChange={(e: { target: { value: string } }) => handleRadioSelect(e.target.value)}
                value={radioValue}
              >
                <FormControlLabel
                  value="default"
                  name="default"
                  control={<Radio />}
                  label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication"
                  // onFocus={() => handleSelectionVisibility('default')}
                  style={radioValue !== 'default' ? { color: '#CCC' } : {}}
                />

                <FormControlLabel
                  value="ownClass"
                  name="ownClass"
                  control={<Radio />}
                  label="les familles peuvent voir toutes les activités publiées sur 1Village, dès leur publication, mais seulement celles publiées par notre classe"
                  style={radioValue !== 'ownClass' ? { color: '#CCC' } : {}}
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
                  {sortedActivities
                    .map((activity) => (
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
                    ))
                    .reverse()}
                  {modalStep > 0 && (
                    <div style={{ position: 'fixed', bottom: '1rem', right: '4.5rem' }}>
                      <Card
                        style={{ backgroundColor: primaryColor, color: 'white', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                      >
                        {modalStep === 1 && <CircularProgress color="inherit" size="1.25rem" />}
                        {modalStep === 2 && <span className="text text--small">Paramètres enregistrés</span>}
                      </Card>
                    </div>
                  )}
                </>
              )}
            </OverflowContainer>
          </div>
        </div>
      </AccessControl>
    </Base>
  );
};

export default ClassroomParamStep1;
