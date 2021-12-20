import { useRouter } from 'next/router';
import React from 'react';

import { isReportage } from 'src/activity-types/anyActivity';
import { getReportage } from 'src/activity-types/reportage.constants';
import type { ReportageData } from 'src/activity-types/reportage.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/reportageCheck';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const ReportageStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);

  const data = (activity?.data as ReportageData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/realiser-un-reportage');
    } else if (activity && !isReportage(activity)) {
      router.push('/realiser-un-reportage');
    }
  }, [activity, router]);

  const updateContent = (content: ActivityContent[]): void => {
    if (!activity) {
      return;
    }
    updateActivity({ content });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/realiser-un-reportage/3');
  };

  if (activity === null || data === null) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[getReportage(activity.subType, data).step1, 'Le reportage', 'Prévisualiser']}
          urls={['/realiser-un-reportage/1?edit', '/realiser-un-reportage/2', '/realiser-un-reportage/3']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Créez maintenant votre reportage multimédia.</h1>
          <p className="text">
            Si vous souhaitez réaliser un film, n&apos;hésitez pas à utiliser{' '}
            <a className="text" target="_blank" rel="noopener noreferrer" href="https://clap.parlemonde.org">
              Clap!
            </a>
            , un outil d&apos;aide à l&apos;écriture audiovisuel !
          </p>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} save={save} />
          <StepsButton prev="/realiser-un-reportage/1?edit" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default ReportageStep2;
