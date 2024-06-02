import { axiosRequest } from 'src/utils/axiosRequest';

export async function deleteAudio(audioUrl: string): Promise<void> {
  const response = await axiosRequest<never>({
    method: 'DELETE',
    baseURL: '',
    url: audioUrl,
  });
  if (response.error) {
    throw new Error('Could not Delete audio');
  }
}
