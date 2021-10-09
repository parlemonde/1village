import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';

import type { AnyActivity, AnyActivityData } from './anyActivity.types';
import type { DefiActivity } from './defi.types';
import type { EnigmeActivity } from './enigme.types';
import type { EditorContent } from './extendedActivity.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';

export const isPresentation = (activity: AnyActivity): activity is PresentationActivity => {
  return activity.type === ActivityType.PRESENTATION;
};
export const isQuestion = (activity: AnyActivity): activity is QuestionActivity => {
  return activity.type === ActivityType.QUESTION;
};
export const isEnigme = (activity: AnyActivity): activity is EnigmeActivity => {
  return activity.type === ActivityType.ENIGME;
};
export const isDefi = (activity: AnyActivity): activity is DefiActivity => {
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
