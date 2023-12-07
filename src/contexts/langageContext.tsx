import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface ExpressionGameContextType {
  langageValue: string;
  setLangageValue: (message: string) => void;
}

const ExpressionGameContext = createContext<ExpressionGameContextType | undefined>(undefined);

export function useLangageValue() {
  const context = useContext(ExpressionGameContext);
  if (!context) {
    throw new Error('useLangageValue must be used within a LangageValueProvider');
  }
  return context;
}

interface ExpressionGameProviderProps {
  children: ReactNode;
}

export const ExpressionGameProvider = ({ children }: ExpressionGameProviderProps) => {
  const [langageValue, setLangageValue] = useState<string>('');

  return <ExpressionGameContext.Provider value={{ langageValue, setLangageValue }}>{children}</ExpressionGameContext.Provider>;
};
