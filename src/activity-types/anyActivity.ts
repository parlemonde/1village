import { Activity, ActivityType } from 'types/activity.type';

import type { AnyActivity, AnyActivityData } from './anyActivities.types';
import { ChallengeActivity } from './challenge.types';
import { EnigmeActivity } from './enigme.types';
import { EditorContent } from './extendedActivity.types';
import { PresentationActivity } from './presentation.types';
import { QuestionActivity } from './question.types';

export const isPresentation = (activity: AnyActivity): activity is PresentationActivity => {
  return activity.type === ActivityType.PRESENTATION;
};
export const isQuestion = (activity: AnyActivity): activity is QuestionActivity => {
  return activity.type === ActivityType.QUESTION;
};
export const isEnigme = (activity: AnyActivity): activity is EnigmeActivity => {
  return activity.type === ActivityType.ENIGME;
};
export const isChallenge = (activity: AnyActivity): activity is ChallengeActivity => {
  return activity.type === ActivityType.DEFI;
};

export const getAnyActivity = (activity: Activity): AnyActivity => {
  let data: AnyActivityData;
  let dataId = 0;
  const processedContent: Array<EditorContent> = [];
  activity.content.forEach((c) => {
    if (c.key === 'json') {
      const decodedValue = JSON.parse(c.value);
      if (decodedValue.type && decodedValue.type === 'data') {
        data = decodedValue.data || {};
        dataId = c.id;
      }
      // other json for not data not yet handled
    } else {
      processedContent.push({
        type: c.key,
        id: c.id,
        value: c.value,
      });
    }
  });
  return {
    ...activity,
    data,
    dataId,
    processedContent,
  } as AnyActivity;
};
