import dynamic from 'next/dynamic';

const ContentEditor = dynamic(() => import('./ContentEditor'), { ssr: false });

export { ContentEditor };
