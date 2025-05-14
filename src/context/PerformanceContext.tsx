import React, { createContext, useContext, useState } from 'react';

type PerformanceContextType = {
  performanceScore: number;
  setPerformanceScore: (score: number) => void;
};

const PerformanceContext = createContext<PerformanceContextType>({
  performanceScore: 100,
  setPerformanceScore: () => {},
});

export const PerformanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [performanceScore, setPerformanceScore] = useState(100);

  return (
    <PerformanceContext.Provider value={{ performanceScore, setPerformanceScore }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);