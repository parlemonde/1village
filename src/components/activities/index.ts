import dynamic from 'next/dynamic';

import { SimpleActivityView } from './SimpleActivityView';

const SimpleActivityEditor = dynamic(() => import('./SimpleActivityEditor'), { ssr: false });

export { SimpleActivityEditor, SimpleActivityView };
