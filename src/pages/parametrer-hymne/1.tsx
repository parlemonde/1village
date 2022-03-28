import { useRouter } from 'next/router';
import React from 'react';
import Button from '@mui/material/Button';

import { isAnthem } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import SoundIcon from 'src/svg/editor/sound_icon.svg';
import { DEFAULT_ANTHEM_DATA } from 'src/activity-types/anthem.constants';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityType } from 'types/activity.type';
import { AnthemEditor } from 'src/components/activities/content/editors/AnthemEditor';

const AnthemStep1 = () => {
  const router = useRouter();
  const { activity, createNewActivity, updateActivity, deleteContent } = React.useContext(ActivityContext);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content });
  };

  const onChangeContent = (index: number) => (newValue: string) => {
    const newContent = [...activity.data.verseMix];
    newContent[index].value = newValue;
    updateContent(newContent);
  };

  const onNext = () => {
    router.push('/parametrer-hymne/2');
  };

  const created = React.useRef(false);
  React.useEffect(() => {
    console.log(activity)
    if (!created.current) {
      if (!activity && !('activity-id' in router.query) && localStorage.getItem('activity') === null && !('edit' in router.query)) {
        created.current = true;
        createNewActivity(
          ActivityType.ANTHEM,
          undefined,
          DEFAULT_ANTHEM_DATA
        );
        console.log(activity)
      } else if (activity && (!isAnthem(activity))) {
        created.current = true;
        createNewActivity(
          ActivityType.ANTHEM,
          undefined,
          DEFAULT_ANTHEM_DATA
        );
      }
    }
  }, [activity, createNewActivity, router]);


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
        <Steps
          steps={['Mix Couplet', 'Intro Outro', "Couplet", "Refrain", 'Prévisualiser']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Mettre en ligne les pistes sonores du couplet</h1>
          <p> Commencez le paramétrage en mettant en ligne les différentes pistes sonores du couplet : </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activity && activity?.data?.verseMix?.map((c, idx) => {
              return (
                <div style={{ display: 'flex', jusitifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '200px'}}>{c.label} : </div>
                  <div>{activity.data.verseMix[idx].display && <AnthemEditor
                    key={c.id}
                    id={c.id}
                    value={c.value}
                    onChange={onChangeContent(idx)}
                    onDelete={() => {
                      deleteContent(idx);
                    }}
                  />}{!c.value &&
                    <Button
                      onClick={() => updateActivity(activity.data.verseMix[idx].display = true)}

                      variant="text"
                      className="navigation__button full-width"
                      style={{
                        justifyContent: 'flex-start',
                        width: 'auto',
                        boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.1)',
                        color: 'black',
                        fontWeight: 'bold'
                      }}
                      endIcon={<SoundIcon />}
                    >
                      Ajouter un son
                    </Button>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <StepsButton next={onNext} />
    </Base>
  );
};

export default AnthemStep1;
