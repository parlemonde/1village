import React from 'react';

import { Stepper, Step, StepLabel, Box } from '@mui/material';

import ContentEditor from 'src/components/activities/content/ContentEditor';
import { ActivityContext } from 'src/contexts/activityContext';
import BackArrow from 'src/svg/back-arrow.svg';
// import { ActivityStatus } from 'types/activity.type';
// import type { ActivityContent } from 'types/activity.type';

interface CreerContenuLibreProps {
  onBackClick?: (() => void) | undefined;
}

const CreerContenuLibre = ({ onBackClick }: CreerContenuLibreProps) => {
  // const { activity, updateActivity, addContent, deleteContent, save } = React.useContext(ActivityContext);
  // const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const steps = ['Contenu', 'Forme', 'Pré-visualiser'];

  // const updateContent = (content: ActivityContent[]): void => {
  //   if (!activity) {
  //     return;
  //   }
  //   updateActivity({ content });
  // };

  const renderClickableTitle = () => (
    <div onClick={onBackClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <BackArrow />
      <h1 style={{ marginLeft: '10px' }}>Créer du contenu libre</h1>
    </div>
  );

  const renderDescription = () => <p>Un contenu libre est une activité publiée dans le fil d’activité par Pélico </p>;

  const renderSteps = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  // if (!activity) {
  //   return null;
  // }

  const renderContent = () => {
    return (
      <div className="width-900">
        <h1>Ecrivez le contenu de votre publication</h1>
        <p className="text">
          Utilisez l&apos;éditeur de bloc pour définir le contenu de votre publication. Dans l&apos;étape 2 vous pourrez définir l&apos;aspect de la
          carte résumée de votre publication.
        </p>
        {/* <ContentEditor content={activity?.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} /> */}
      </div>
    );
  };
  return (
    <div>
      {renderClickableTitle()}
      {renderDescription()}
      {renderSteps()}
    </div>
  );
};

export default CreerContenuLibre;
