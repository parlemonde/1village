import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { TeamComment } from 'types/teamComment.type';

export async function updateTeamComment(commentId: number, comment: string): Promise<TeamComment> {
  return (
    await axiosRequest({
      method: 'PUT',
      baseURL: '/api',
      url: `/team-comments/${commentId}`,
      data: { comment },
    })
  ).data;
}

type UpdateTeamCommentParams = {
  commentId: number;
  comment: string;
};

export const useUpdateTeamComment = (params: UpdateTeamCommentParams) => {
  const { commentId, comment } = params;

  return useMutation({
    mutationFn: () => {
      return updateTeamComment(commentId, comment);
    },
  });
};
