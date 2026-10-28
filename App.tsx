import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BooksProvider} from './src/context/BooksContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => (
  <SafeAreaProvider>
    <BooksProvider>
      <AppNavigator />
    </BooksProvider>
  </SafeAreaProvider>
);

export default App;