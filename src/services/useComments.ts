import { useSnackbar } from 'notistack';
import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Comment } from 'types/comment.type';

export const useComments = (activityId: number | null): { comments: Comment[]; setComments(newComments: Comment[]): void } => {
  const queryClient = useQueryClient();

  const getComments: QueryFunction<Comment[]> = React.useCallback(async () => {
    if (activityId === null) {
      return [];
    }
    const response = await axiosRequest({
      method: 'GET',
      url: `/activities/${activityId}/comments`,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [activityId]);
  const { data, isLoading, error } = useQuery<Comment[], unknown>(['comments', { activityId }], getComments);

  const setComments = React.useCallback(
    (newComments: Comment[]) => {
      queryClient.setQueryData(['comments'], newComments);
    },
    [queryClient],
  );

  return {
    comments: isLoading || error ? [] : data || [],
    setComments,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCommentRequests = (activityId: number | null) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const addComment = React.useCallback(
    async (text: string) => {
      if (!activityId) {
        return null;
      }
      const response = await axiosRequest({
        method: 'POST',
        url: `/activities/${activityId}/comments`,
        data: {
          text,
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      queryClient.invalidateQueries('comments');
      queryClient.invalidateQueries('activities');
      return response.data as Comment;
    },
    [activityId, queryClient, enqueueSnackbar],
  );

  const editComment = React.useCallback(
    async (id: number, text: string) => {
      if (!activityId) {
        return null;
      }
      const response = await axiosRequest({
        method: 'PUT',
        url: `/activities/${activityId}/comments/${id}`,
        data: {
          text,
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return null;
      }
      queryClient.invalidateQueries('comments');
      return response.data as Comment;
    },
    [activityId, queryClient, enqueueSnackbar],
  );

  const deleteComment = React.useCallback(
    async (id: number) => {
      if (!activityId) {
        return;
      }
      const response = await axiosRequest({
        method: 'DELETE',
        url: `/activities/${activityId}/comments/${id}`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      queryClient.invalidateQueries('comments');
      queryClient.invalidateQueries('activities');
    },
    [activityId, queryClient, enqueueSnackbar],
  );

  return {
    addComment,
    editComment,
    deleteComment,
  };
};
