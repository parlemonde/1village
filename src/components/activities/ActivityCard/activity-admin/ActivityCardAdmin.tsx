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
}: {
  activity: Pick<Activity, 'images' | 'content' | 'phase' | 'data' | 'id' | 'status'>;
  modifiedDisabled?: boolean;
}) {
  const publishActivity = usePublishActivity({ activityId: activity.id });
  const howManyChildren = useGetChildrenActivitiesById({ id: Number(activity.id) });
  // eslint-disable-next-line
  // @ts-ignore
  const publishDate = new Date(activity.publishDate);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(publishDate);

  const subtitle = `Publié le ${formattedDate} dans ${howManyChildren.data?.length} Village-Monde`;
  const queryClient = useQueryClient();
  const router = useRouter();
  const title: string = activity?.data?.title ? (activity.data.title as string) : '';
  const isImageUrl = activity.content.find((e) => e.type === 'image')?.value;
  const imageUrl: string = isImageUrl ? isImageUrl : 'https://placehold.co/600x400?text=No Picture';
  const content: string = activity.content.reduce((acc, curr) => {
    if (curr.type === 'text') {
      acc += curr.value;
    }
    return acc;
  }, '');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDelete = () => {
    deleteActivity(activity.id);
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    router.reload();
    setAnchorEl(null);
  };
  const handleModified = () => {
    if (activity.status === 0) {
      router.push(`/admin/newportal/publier/prepublish/edit/${activity.id}`);
    } else {
      router.push(`/admin/newportal/contenulibre/edit/1/${activity.id}`);
    }
    setAnchorEl(null);
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
        title={title}
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
              <MenuItem onClick={handleModified} disabled={modifiedDisabled}>
                Modifier
              </MenuItem>
              <MenuItem onClick={handleDelete}>Supprimer</MenuItem>
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
            {/* eslint-disable-next-line */}
            {/* @ts-ignore */}
            {activity.data.title.length === 0 || activity.data.resume.length === 0 ? (
              // eslint-disable-next-line
              // @ts-ignore
              <Button disabled="true" size="small" sx={{ border: 1, marginRight: 1 }}>
                Publier
              </Button>
            ) : (
              <Button size="small" sx={{ border: 1, marginRight: 1 }}>
                Publier
              </Button>
            )}
          </Link>
        </CardActions>
      )}
    </Card>
  );
}
