/* eslint-disable no-console */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import type { Activity } from 'server/entities/activity';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Card, CardHeader, Avatar, CardMedia, CardContent, Typography, Button, CardActions, Menu, MenuItem } from '@mui/material';

import { deleteActivity } from 'src/api/activities/activities.admin.delete';
import { useGetChildrenActivitiesById } from 'src/api/activities/activities.adminGetChildren';
import { usePublishActivity } from 'src/api/activities/activities.put';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { htmlToText } from 'src/utils';

export default function ActivityCard({
  activity,
  modifiedDisabled,
  actions = ['configure', 'update', 'delete'],
}: {
  activity: Pick<Activity, 'images' | 'content' | 'phase' | 'data' | 'id' | 'status' | 'type'>;
  modifiedDisabled?: boolean;
  actions?: ('configure' | 'update' | 'delete')[];
}) {
  const publishActivity = usePublishActivity({ activityId: activity.id });
  const howManyChildren = useGetChildrenActivitiesById({ id: Number(activity.id) });
  const queryClient = useQueryClient();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const title: string = activity?.data?.title ? (activity.data.title as string) : '';
  const isImageUrl = activity.content.find((e) => e.type === 'image')?.value;
  const imageUrl: string = isImageUrl ? isImageUrl : 'https://placehold.co/600x400?text=No Picture';
  const content: string = activity.content.reduce((acc, curr) => {
    if (curr.type === 'text') {
      acc += curr.value;
    }
    return acc;
  }, '');

  // eslint-disable-next-line
  // @ts-ignore
  const publishDate = new Date(activity.publishDate);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(publishDate);
  const subtitle = `Publié le ${formattedDate} dans ${howManyChildren.data?.length} Village-Monde`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDelete = () => {
    deleteActivity(activity.id);
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    router.reload();
    setAnchorEl(null);
  };
  const handleUpdate = () => {
    console.log(activity);
    if (activity.type === 5) {
      router.push(`/admin/newportal/contenulibre/edit/1/${activity.id}`);
    }
    setAnchorEl(null);
  };

  const handleConfigure = () => {
    router.push(`/admin/newportal/publier/prepublish/edit/${activity.id}`);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (publishActivity.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  }, [publishActivity.isSuccess, queryClient]);
  return (
    <Card variant="outlined" sx={{ padding: 1, margin: 2, borderRadius: 4, borderColor: '#ebebeb' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <PelicoSouriant />
          </Avatar>
        }
        // eslint-disable-next-line
        // @ts-ignore
        title={activity.type === 11 ? 'Hymne' : title}
        subheader={activity.status === 0 ? subtitle : ''}
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
              {actions.includes('configure') && (
                <MenuItem onClick={handleConfigure} disabled={modifiedDisabled}>
                  Configurer
                </MenuItem>
              )}
              {actions.includes('delete') && <MenuItem onClick={handleUpdate}>Modifier</MenuItem>}
              {actions.includes('delete') && <MenuItem onClick={handleDelete}>Supprimer</MenuItem>}
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
      {activity.status !== 0 && (
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link href={`/admin/newportal/publier/prepublish/${activity.id}`}>
            <Button size="small" sx={{ border: 1, marginRight: 1 }}>
              Publier
            </Button>
          </Link>
        </CardActions>
      )}
    </Card>
  );
}
