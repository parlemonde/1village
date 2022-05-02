import type React from 'react';

type DragHandlerProps = {
  onDragStart(event: MouseEvent): boolean | undefined;
  onDrag(event: MouseEvent): void;
  onDragEnd(event: MouseEvent): void;
};
export const useDragHandler = ({ onDragStart, onDrag, onDragEnd }: DragHandlerProps) => {
  const onMouseMove = (event: MouseEvent) => {
    onDrag(event);
  };

  const onMouseUp = (event: MouseEvent) => {
    onDragEnd(event);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseDown = (event: React.MouseEvent<HTMLElement | SVGElement>) => {
    const result = onDragStart(event.nativeEvent);
    if (result !== undefined && result === false) {
      return;
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return {
    onMouseDown,
  };
};
