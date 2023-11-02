import React, { useMemo } from 'react';

import { AvatarImg } from '../Avatar';
import { Flag } from '../Flag';
import type { GameResponse } from 'types/gameResponse.type';
import { UserType } from 'types/user.type';
import type { User } from 'types/user.type';

type GameStatsProps = {
  gameResponses: GameResponse[];
  choices: number[];
  country: string;
  userMap: { [key: number]: number };
  users: User[];
  position: number;
};

const POSITION = [
  ['d', 'e'],
  ['g', 'h'],
  ['j', 'k'],
];
const GameStats = ({ gameResponses, choices, country, userMap, users, position }: GameStatsProps) => {
  const countryResponses = useMemo(() => {
    return gameResponses.filter((responseGame) => users[userMap[responseGame.userId]]?.country?.isoCode === country);
  }, [country, gameResponses, userMap, users]);
  const responseCount = countryResponses.length;

  const responsesByChoice: { [key: number]: GameResponse[] } = {};
  countryResponses.forEach((response) => {
    const choice = parseInt(response.value, 10);
    if (!isNaN(choice)) {
      if (!responsesByChoice[choice]) {
        responsesByChoice[choice] = [];
      }
      responsesByChoice[choice].push(response);
    }
  });

  return (
    <>
      <div style={{ display: 'grid', gridArea: position === 0 ? 'a' : 'b', gap: '1rem', margin: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
          <span>{`${responseCount} réponse${responseCount > 1 ? 's' : ''}`} </span>
          <Flag country={country} size={'small'} />
        </div>
      </div>

      {responseCount > 0 &&
        choices &&
        choices.map((choice) => (
          <>
            {responsesByChoice[choice] ? (
              <div
                style={{
                  alignContent: 'center',
                  display: 'flex',
                  width: '100%',
                  gap: '10px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gridArea: POSITION[choice][position],
                }}
              >
                {responsesByChoice[choice]?.map((response) => {
                  const user = users[userMap[response.userId]];
                  const renderAvatar =
                    user.type >= UserType.MEDIATOR ? (
                      <div key={response.id}>
                        <AvatarImg user={user} style={{ width: '24px', height: '24px', margin: '10px 5px' }} />
                      </div>
                    ) : null;
                  return renderAvatar;
                })}
              </div>
            ) : (
              <div style={{ display: 'grid', gridArea: POSITION[choice][position] }}></div>
            )}
          </>
        ))}
    </>
  );
};
export default GameStats;
