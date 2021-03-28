import Link from 'next/link';
import React from 'react';

import { Button, Card } from '@material-ui/core';

import { ENIGME_DATA, ENIGME_TYPES, getEnigmeTimeLeft } from 'src/activities/enigme.const';
import { EnigmeActivity } from 'src/activities/enigme.types';
import ArrowRight from 'src/svg/arrow-right.svg';
import Timer from 'src/svg/enigme/timer.svg';

import { SimpleActivityView } from './SimpleActivityView';
import { ActivityViewProps } from './editing.types';

type EnigmeActivityViewProps = ActivityViewProps<EnigmeActivity> & {
  isAnswer: boolean;
};

export const EnigmeActivityView: React.FC<EnigmeActivityViewProps> = ({ activity, isAnswer }: EnigmeActivityViewProps) => {
  const [showClue, setShowClue] = React.useState(false);
  const enigmeType = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];
  const enigmeData = ENIGME_DATA[activity.subType ?? 0] ?? ENIGME_DATA[0];
  const timeLeft = getEnigmeTimeLeft(activity);

  if (isAnswer && timeLeft > 0) {
    return (
      <div style={{ margin: '1rem 0', width: '100%', textAlign: 'center' }}>
        <p className="text text--error" style={{ margin: '1rem 0' }}>
          {"La réponse à l'énigme n'est pas encore disponible !"}
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Timer style={{ width: '3rem', height: 'auto', marginRight: '0.5rem' }} />
          <span className="text text--error" style={{ fontSize: '2.5rem' }}>
            {timeLeft}j
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      <h3 style={{ marginBottom: '1rem' }}>{isAnswer ? "Réponse à l'énigme" : enigmeType.title}</h3>
      <SimpleActivityView
        activity={activity}
        content={
          isAnswer
            ? activity.processedContent.slice(0, activity.data.indiceContentIndex)
            : activity.processedContent.slice(activity.data.indiceContentIndex, activity.processedContent.length)
        }
      />
      {!isAnswer && (
        <>
          <div style={{ width: '100%' }}>
            <Button
              color="primary"
              onClick={() => {
                setShowClue(!showClue);
              }}
            >
              Obtenir un autre indice{' '}
              <ArrowRight
                style={{
                  fill: 'currentcolor',
                  width: '0.8rem',
                  height: 'auto',
                  marginLeft: '0.5rem',
                  transform: showClue ? 'rotate(90deg)' : 'none',
                  transition: '100ms ease-in-out',
                }}
              />
            </Button>
            <Link href={`/activite/${activity.id}?reponse=true`}>
              <Button
                style={{ float: 'right' }}
                disabled={timeLeft > 0}
                color="primary"
                variant="outlined"
                component="a"
                size="small"
                href={`/activite/${activity.id}?reponse=true`}
              >
                {"Voir la réponse à l'énigme"}
                {timeLeft > 0 && (
                  <>
                    <Timer style={{ marginLeft: '0.6rem', width: '1rem', height: 'auto' }} />
                    <span className="text text--error" style={{ margin: '0 0.2rem' }}>
                      {timeLeft}j
                    </span>
                  </>
                )}
              </Button>
            </Link>
          </div>
          {showClue && (
            <Card style={{ display: 'block', margin: '0.5rem 0', padding: '0.25rem 0.5rem' }}>
              <h3>Indice supplémentaire</h3>
              <p className="text" style={{ margin: 0, padding: 0 }}>
                {`${enigmeType.title2} est `}
                <strong>
                  {(activity.data.theme === -1 ? activity.data.themeName ?? '' : enigmeData[activity.data.theme]?.step ?? '').toLowerCase()}
                </strong>{' '}
                !
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
