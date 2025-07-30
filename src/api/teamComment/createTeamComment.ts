import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { TeamComment, TeamCommentType } from 'types/teamComment.type';

export async function createTeamComment(type: TeamCommentType, comment: string): Promise<TeamComment> {
  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/team-comments',
      data: { type, comment },
    })
  ).data;
}

type CreateTeamCommentParams = {
  type: number;
  comment: string;
};

export const useCreateTeamComment = (params: CreateTeamCommentParams) => {
  const { type, comment } = params;

  return useMutation({
    mutationFn: () => {
      return createTeamComment(type, comment);
    },
  });
};
