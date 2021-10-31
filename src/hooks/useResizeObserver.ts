import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Dimensions = {
  width: number;
  height: number;
  scrollHeight: number;
  scrollWidth: number;
};

/**
 * Hook to return the dimensions of a component. Use with noSSR!
 * @param ref
 */
export const useResizeObserver = (): [(node: HTMLElement | null) => void, Dimensions] => {
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0,
    scrollHeight: 0,
    scrollWidth: 0,
  });
  const observedNode = React.useRef<HTMLElement | null>();
  const resizeObserver = React.useRef<ResizeObserver>();
  const animationFrame = React.useRef<number | null>(null);

  const onResize = React.useCallback(() => {
    if (!observedNode.current) {
      return;
    }
    setDimensions({
      width: observedNode.current.offsetWidth,
      height: observedNode.current.offsetHeight,
      scrollHeight: observedNode.current.scrollHeight,
      scrollWidth: observedNode.current.scrollWidth,
    });
  }, []);

  const onObserveResize = React.useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(() => {
      onResize();
    });
  }, [onResize]);

  const removeObserver = React.useCallback(() => {
    if (resizeObserver.current) {
      resizeObserver.current.disconnect();
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);
  React.useEffect(() => removeObserver, [removeObserver]);

  const observeNode = React.useCallback(
    (node?: HTMLElement | null) => {
      if (node === undefined || node === null) {
        removeObserver();
        return;
      }
      const currentNode = observedNode.current;
      if (currentNode === node) {
        return;
      }
      removeObserver();
      try {
        const observer = new ResizeObserver(onObserveResize);
        observer.observe(node);
        observedNode.current = node;
        resizeObserver.current = observer;
      } catch {
        removeObserver();
        return;
      }
    },
    [removeObserver, onObserveResize],
  );

  return [observeNode, dimensions];
};
