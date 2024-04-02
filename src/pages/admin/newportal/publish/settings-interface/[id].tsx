import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { Button, CircularProgress } from '@mui/material';

import { useGetActivityById } from 'src/api/activities/activities.get';
import { publishActivity } from 'src/api/activities/activities.put';
import BackArrow from 'src/svg/back-arrow.svg';

export default function ActivityTopublish() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (activityId: number) => {
      return publishActivity({ activityId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const { data, isIdle, isLoading, isError } = useGetActivityById({ id: Number(router.query.id) });
  if (isError) return <p>Bad request</p>;
  if (isLoading || isIdle) return <p>loading...</p>;
  const title: string = data.data?.title ? (data.data.title as string) : '[No title]';
  return (
    <div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        <Link href="/admin/newportal/publish">
          <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
            <BackArrow />
            <h1 style={{ marginLeft: 10 }}>{title}</h1>
          </div>
        </Link>
        <Button size="small" sx={{ border: 1 }} onClick={() => mutation.mutate(data.id)} disabled={mutation.isLoading}>
          {mutation.isLoading ? <CircularProgress size={20} /> : 'Publier'}
        </Button>
      </div>
    </div>
  );
}
