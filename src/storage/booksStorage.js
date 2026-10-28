
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@library_books';

export async function loadBooks() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveBooks(books) {
  await AsyncStorage.setItem(KEY, JSON.stringify(books));
}
