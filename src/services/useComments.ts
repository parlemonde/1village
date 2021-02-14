import { useSnackbar } from 'notistack';
import { useQueryCache, useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { Comment } from 'types/comment.type';

export const useComments = (activityId: number | null): { comments: Comment[]; setComments(newComments: Comment[]): void } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryCache = useQueryCache();

  const getComments: QueryFunction<Comment[]> = React.useCallback(async () => {
    if (activityId === null) {
      return [];
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities/${activityId}/comments`,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [activityId, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Comment[], unknown>(['comments', { activityId }], getComments);

  const setComments = React.useCallback(
    (newComments: Comment[]) => {
      queryCache.setQueryData(['comments'], newComments);
    },
    [queryCache],
  );

  return {
    comments: isLoading || error ? [] : data,
    setComments,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCommentRequests = (activityId: number | null) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();

  const addComment = React.useCallback(
    async (text: string) => {
      if (!activityId) {
        return null;
      }
      const response = await axiosLoggedRequest({
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
      queryCache.invalidateQueries('comments');
      return response.data as Comment;
    },
    [activityId, axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  const editComment = React.useCallback(
    async (id: number, text: string) => {
      if (!activityId) {
        return null;
      }
      const response = await axiosLoggedRequest({
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
      queryCache.invalidateQueries('comments');
      return response.data as Comment;
    },
    [activityId, axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  const deleteComment = React.useCallback(
    async (id: number) => {
      if (!activityId) {
        return;
      }
      const response = await axiosLoggedRequest({
        method: 'DELETE',
        url: `/activities/${activityId}/comments/${id}`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      queryCache.invalidateQueries('comments');
    },
    [activityId, axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  return {
    addComment,
    editComment,
    deleteComment,
  };
};
