import Image from 'next/image';
import React, { useContext } from 'react';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import { useAllStandardGameByType } from 'src/api/game/game.getAllBySubtype';
import { UserContext } from 'src/contexts/userContext';
import type { GameType } from 'types/game.type';

type SubTypeProps = {
  subType: GameType;
};
const List = ({ subType }: SubTypeProps) => {
  const { user } = useContext(UserContext);

  const villageId = user?.villageId;
  const { data: allStandardGameByType } = useAllStandardGameByType(subType, villageId as number);
  console.log(allStandardGameByType);

  return (
    <ImageList sx={{ width: 500, height: 450 }}>
      {allStandardGameByType &&
        allStandardGameByType.map((item) => (
          <ImageListItem key={item.img}>
            {console.log(item.content)}
            <Image
              src={item.content.game[0].inputs[0].selectedValue}
              alt="Image"
              layout="fill" // or "fixed" or "intrinsic" based on your needs
              width={248}
              height={450} // Adjust height if needed
              loading="lazy"
            />
            <ImageListItemBar title={item.content.labelPresentation} position="below" />
          </ImageListItem>
        ))}
    </ImageList>
  );
};
export default List;
