import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useBooks} from '../context/BooksContext';
import colors from '../theme/colors';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

const BookDetailScreen = ({navigation, route}: Props) => {
  const {books, changeBorrowed} = useBooks();
  const book = books.find(item => item.id === route.params.bookId);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy sách.</Text>
      </View>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const canBorrow = remaining > 0;
  const canReturn = book.borrowed > 0;

  const borrow = () => {
    if (!canBorrow) return;
    changeBorrowed(book.id, 1);
  };

  const returnBook = () => {
    if (!canReturn) return;
    changeBorrowed(book.id, -1);
  };

  const info = (label: string, value: string | number) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{book.title}</Text>

        {info('Tác giả', book.author)}
        {info('Thể loại', book.category)}
        {info('Năm xuất bản', book.year)}
        {info('Tổng số cuốn', book.quantity)}
        {info('Đang được mượn', book.borrowed)}
        {info('Còn lại', remaining)}

        {remaining === 0 && (
          <Text style={styles.outOfStock}>Hết sách</Text>
        )}
      </View>

      <Pressable
        onPress={() =>
          navigation.navigate('BookForm', {bookId: book.id})
        }
        style={({pressed}) => [
          styles.editButton,
          pressed && styles.pressed,
        ]}>
        <Text style={styles.buttonText}>Sửa thông tin</Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          disabled={!canBorrow}
          onPress={borrow}
          style={({pressed}) => [
            styles.actionButton,
            canBorrow ? styles.borrowButton : styles.disabled,
            pressed && canBorrow && styles.pressed,
          ]}>
          <Text style={styles.buttonText}>Cho mượn</Text>
        </Pressable>

        <Pressable
          disabled={!canReturn}
          onPress={returnBook}
          style={({pressed}) => [
            styles.actionButton,
            canReturn ? styles.returnButton : styles.disabled,
            pressed && canReturn && styles.pressed,
          ]}>
          <Text style={styles.buttonText}>Nhận trả</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        Mỗi lần nhấn sẽ cập nhật số cuốn đang mượn và tự lưu dữ liệu.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: colors.background},
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {fontSize: 12, color: colors.secondaryText, marginBottom: 4},
  value: {fontSize: 15, color: colors.text, fontWeight: '600'},
  outOfStock: {
    marginTop: 12,
    color: colors.danger,
    fontWeight: '700',
  },
  editButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  actions: {flexDirection: 'row', gap: 12, marginTop: 12},
  actionButton: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  borrowButton: {backgroundColor: colors.success},
  returnButton: {backgroundColor: colors.primary},
  disabled: {backgroundColor: colors.disabled},
  buttonText: {color: '#FFFFFF', fontWeight: '700'},
  pressed: {opacity: 0.75},
  note: {
    marginTop: 14,
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 18,
  },
});

export default BookDetailScreen;