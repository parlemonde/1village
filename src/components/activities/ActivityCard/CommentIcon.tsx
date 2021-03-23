import Link from 'next/link';
import React from 'react';

import CommentBox from 'src/svg/comment_box.svg';

interface CommentIconProps {
  count?: number;
  activityId: number;
}

export const CommentIcon: React.FC<CommentIconProps> = ({ count = 0, activityId }: CommentIconProps) => {
  if (count === 0) {
    return null;
  }

  return (
    <Link href={`/activity/${activityId}`}>
      <a
        href={`/activity/${activityId}`}
        style={{ display: 'inline-block', position: 'relative', height: '2rem', verticalAlign: 'top', margin: '0.2rem 0.25rem' }}
      >
        <CommentBox style={{ width: 'auto', height: '100%' }} />
        <span
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '85%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <strong>{count}</strong>
        </span>
      </a>
    </Link>
  );
};
