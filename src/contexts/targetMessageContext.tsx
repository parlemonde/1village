import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { VillageContext } from 'src/contexts/villageContext';

interface TargetMessageContextType {
  targetMessage: string;
  setTargetMessage: (message: string) => void;
}

const TargetMessageContext = createContext<TargetMessageContextType | undefined>(undefined);

export function useTargetMessage() {
  const context = useContext(TargetMessageContext);
  if (!context) {
    throw new Error('useTargetMessage must be used within a TargetMessageProvider');
  }
  return context;
}

interface TargetMessageProviderProps {
  children: ReactNode;
}

export function TargetMessageProvider({ children }: TargetMessageProviderProps) {
  const { village } = useContext(VillageContext);

  const countriesIsocode = React.useMemo(() => {
    return !village ? [] : village.countries.map((c) => c.isoCode);
  }, [village]);

  const countriesIsocodeDefaultValue = countriesIsocode.join(' ');

  const [targetMessage, setTargetMessage] = useState<string>(countriesIsocodeDefaultValue);

  // Permet de remettre la valeur par défaut
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetMessage(countriesIsocodeDefaultValue);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [countriesIsocodeDefaultValue]);

  return <TargetMessageContext.Provider value={{ targetMessage, setTargetMessage }}>{children}</TargetMessageContext.Provider>;
}
