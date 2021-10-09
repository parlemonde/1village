import classnames from 'classnames';
import React from 'react';

import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import { DeleteButton } from 'src/components/buttons/DeleteButton';

interface EditorContainerProps {
  deleteButtonProps: {
    confirmLabel?: string;
    confirmTitle?: string;
    onDelete(): void;
  };
  className?: string;
  noPadding?: boolean;
  noMinHeight?: boolean;
}

export const EditorContainer: React.FC<EditorContainerProps> = ({
  deleteButtonProps,
  children,
  className,
  noPadding = false,
  noMinHeight = false,
}: React.PropsWithChildren<EditorContainerProps>) => {
  return (
    <div className="editor editor--with-drag-handle">
      <DeleteButton {...deleteButtonProps} color="primary" style={{ position: 'absolute', zIndex: 20, right: '0.5rem', top: '0.5rem' }} />
      <div className="drag-handle">
        <DragIndicatorIcon />
      </div>
      <div
        className={classnames(className, 'editor__container', {
          'editor__container--without-padding': noPadding,
          'editor__container--without-min-height': noMinHeight,
        })}
      >
        {children}
      </div>
    </div>
  );
};
