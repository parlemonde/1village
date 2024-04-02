import { useRouter } from 'next/router';
import React from 'react';
import type { Activity } from 'server/entities/activity';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Card, CardHeader, Avatar, CardMedia, CardContent, Typography, Button, CardActions, Menu, MenuItem } from '@mui/material';

import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { htmlToText } from 'src/utils';

export default function ActivityCard(activity: Pick<Activity, 'images' | 'content' | 'phase' | 'data' | 'id' | 'status'>) {
  const title: string = activity?.data?.title ? (activity.data.title as string) : '';
  const imageUrl: string =
    activity?.images?.length && activity.images[0].imageUrl ? activity.images[0].imageUrl : 'https://placehold.co/600x400?text=No Picture';
  const content: string = activity.content.reduce((acc, curr) => {
    if (curr.type === 'text') {
      acc += curr.value;
    }
    return acc;
  }, '');
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card variant="outlined" sx={{ padding: 1, margin: 2, borderRadius: 4, borderColor: '#ebebeb' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <PelicoSouriant />
          </Avatar>
        }
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
        sx={{
          // refer to mui content only classname
          '.MuiCardHeader-content': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          },
        }}
        action={
          <>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon color="inherit" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Modifier</MenuItem>
              <MenuItem onClick={handleClose}>Supprimer</MenuItem>
            </Menu>
          </>
        }
      />
      <CardMedia
        sx={{ padding: '1em 1em 0 1em', objectFit: 'cover', objectPosition: 'center' }}
        component="img"
        height="194"
        image={imageUrl}
        alt="Activity picture"
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxHeight: '60px',
            overflow: 'clip',
            whiteSpace: 'break-spaces',
          }}
        >
          {htmlToText(content)}
        </Typography>
      </CardContent>
      {/* display publish button only if activity is not published yet (status = 1) */}
      {activity.status !== 0 && (
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button size="small" sx={{ border: 1 }} onClick={() => router.push(`/admin/newportal/publish/settings-interface/${activity.id}`)}>
            Publier
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
