import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Book} from '../types/Book';
import colors from '../theme/colors';

type Props = {
  book: Book;
  onPress?: () => void;
  onLongPress?: () => void;
};

const BookCard = ({
  book,
  onPress,
  onLongPress,
}: Props) => {
  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining === 0;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {book.title}
        </Text>

        {isOutOfStock && (
          <Text style={styles.outOfStock}>
            Hết sách
          </Text>
        )}
      </View>

      <Text style={styles.author}>
        Tác giả: {book.author}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.category}>
          {book.category}
        </Text>

        <Text style={styles.quantity}>
          Còn lại: {remaining}/{book.quantity}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  outOfStock: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  author: {
    marginTop: 8,
    fontSize: 14,
    color: colors.secondaryText,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  quantity: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default BookCard;