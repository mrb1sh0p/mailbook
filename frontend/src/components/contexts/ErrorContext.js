import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext(undefined);

export const ErrorProvider= ({ children }) => {
  const [error] = useState(null);

  const logError = useCallback(async (errorDetails) => {
    // Implementação...
  }, []);

  const handleError = useCallback((error) => {
    // Implementação...
  }, []);

  return (
    <ErrorContext.Provider value={{ error, handleError, logError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};