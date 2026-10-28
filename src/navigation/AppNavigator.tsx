import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useBooks} from '../context/BooksContext';
import BookListScreen from '../screens/BookListScreen';
import BookFormScreen from '../screens/BookFormScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import colors from '../theme/colors';

export type RootStackParamList = {
  BookList: undefined;
  BookForm: {bookId?: string} | undefined;
  BookDetail: {bookId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {loading} = useBooks();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.primary},
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {fontWeight: '700'},
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{title: 'Quản lý thư viện'}}
        />
        <Stack.Screen
          name="BookForm"
          component={BookFormScreen}
          options={({route}) => ({
            title: route.params?.bookId ? 'Sửa sách' : 'Thêm sách',
          })}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{title: 'Chi tiết sách'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;