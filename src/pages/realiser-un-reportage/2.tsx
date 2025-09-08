import { useRouter } from 'next/router';
import React from 'react';

import { isReportage } from 'src/activity-types/anyActivity';
import { getReportage } from 'src/activity-types/reportage.constants';
import type { ReportageData } from 'src/activity-types/reportage.types';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentEditor } from 'src/components/activities/content';
import { getErrorSteps } from 'src/components/activities/reportageChecks';
import { ActivityContext } from 'src/contexts/activityContext';
import type { ActivityContent } from 'types/activity.type';

const ReportageStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  const data = (activity?.data as ReportageData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null && activity?.subType === -1) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [activity?.subType, data]);

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
      <PageLayout>
        <Steps
          steps={[getReportage(activity.subType, data).step1, 'Le reportage', 'Prévisualiser']}
          urls={['/realiser-un-reportage/1?edit', '/realiser-un-reportage/2', '/realiser-un-reportage/3']}
          activeStep={1}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Importez votre reportage.</h1>
          <ContentEditor content={activity.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
          <StepsButton prev="/realiser-un-reportage/1?edit" next={onNext} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default ReportageStep2;
