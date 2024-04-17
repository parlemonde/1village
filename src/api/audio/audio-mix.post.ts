import { axiosRequest } from 'src/utils/axiosRequest';
import type { Track } from 'types/anthem.type';

type POST_AUDIO_RESPONSE = {
  url: string;
};

export async function postMixAudio(tracks: Track[]): Promise<string> {
  const result = await axiosRequest<POST_AUDIO_RESPONSE>({
    method: 'POST',
    url: '/audios/mix',
    data: {
      tracks,
    },
  });
  if (result.error) {
    return '';
  }
  return result.data.url;
}
