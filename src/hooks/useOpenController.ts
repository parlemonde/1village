import { useCallback, useState } from 'react';

interface UseOpenController {
  isOpen: boolean;
  toggle: () => void;
}

export default function useOpenController(initialState: boolean): UseOpenController {
  const [isOpen, setOpenState] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setOpenState((state) => !state);
  }, [setOpenState]);

  return { isOpen, toggle };
}
