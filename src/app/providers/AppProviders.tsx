import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import { AuthProvider } from './AuthProvider';
import { GlobalOverlaysProvider } from '../../shared/context/GlobalOverlaysContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <GlobalOverlaysProvider>
          {children}
        </GlobalOverlaysProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};
export default AppProviders;
