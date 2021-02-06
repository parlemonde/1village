import dynamic from 'next/dynamic';

export const VideoView = dynamic(() => import('./VideoView'), { ssr: false });
