import dynamic from 'next/dynamic';

import { SimpleActivityPreview } from './SimpleActivityPreview';

const SimpleActivityEditor = dynamic(() => import('./SimpleActivityEditor'), { ssr: false });

export { SimpleActivityEditor, SimpleActivityPreview };
