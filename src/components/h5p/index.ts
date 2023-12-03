import dynamic from 'next/dynamic';

export const H5pEditor = dynamic(() => import('./H5pEditor'), { ssr: false });
