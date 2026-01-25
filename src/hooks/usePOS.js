import { useContext } from 'react';
import { POSContext } from '../context/createPOSContext';

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within POSProvider');
  }
  return context;
};