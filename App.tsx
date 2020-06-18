import React from 'react';

import { UserProvider } from './src/hooks/user';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';

const App: React.FC = () => {
  return (
      <NavigationContainer>
        <UserProvider>
          <Routes />
        </UserProvider>
      </NavigationContainer>
  );
};

export default App;