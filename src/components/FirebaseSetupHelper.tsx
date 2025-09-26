import React from 'react';

const FirebaseSetupHelper = () => {
  const isDevEnvironment = import.meta.env.DEV;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'localhost:8082';
  
  if (!isDevEnvironment) return null;

  return (
   
  );
};

export default FirebaseSetupHelper;