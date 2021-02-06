import dynamic from 'next/dynamic';

export const SuggestionCarousel = dynamic(() => import('./SuggestionCarousel'), { ssr: false });
