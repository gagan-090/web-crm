import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import { AuthProvider } from './AuthProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ReduxProvider>
  );
};
export default AppProviders;
