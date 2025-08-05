import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { TeamComment, TeamCommentType } from 'types/teamComment.type';

async function getTeamCommentByType(type: TeamCommentType): Promise<TeamComment[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/team-comments?type=${type}`,
    })
  ).data;
}

export const useGetTeamCommentByType = (type: TeamCommentType) => {
  return useQuery(['get-team-comment-by-type', type], () => getTeamCommentByType(type), {
    enabled: type !== undefined,
    cacheTime: 0,
    staleTime: 0,
  });
};
