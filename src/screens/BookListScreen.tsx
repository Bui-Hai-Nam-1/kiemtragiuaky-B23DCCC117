import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useBooks } from '../context/BooksContext';
import BookCard from '../components/BookCard';
import colors from '../theme/colors';
import type { Book } from '../types/Book';
import type { RootStackParamList } from '../navigation/AppNavigator';

const CATEGORIES = [
  'Tất cả',
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BookList'
>;

export default function BookListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { books, deleteBook } = useBooks();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('Tất cả');

  const filteredBooks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return books.filter((book: Book) => {
      const matchesKeyword =
        book.title.toLowerCase().includes(normalizedKeyword) ||
        book.author.toLowerCase().includes(normalizedKeyword);

      const matchesCategory =
        category === 'Tất cả' || book.category === category;

      return matchesKeyword && matchesCategory;
    });
  }, [books, keyword, category]);

  const totalBorrowed = books.reduce(
    (total, book) => total + book.borrowed,
    0,
  );

  const handleDelete = (book: Book) => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xóa',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn được mượn. Vui lòng nhận trả sách trước.`,
      );
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa sách "${book.title}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => deleteBook(book.id),
        },
      ],
    );
  };

  const renderCategory = ({ item }: { item: string }) => {
    const selected = category === item;

    return (
      <Pressable
        onPress={() => setCategory(item)}
        style={({ pressed }) => [
          styles.categoryButton,
          selected && styles.categoryButtonActive,
          pressed && styles.categoryButtonPressed,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.categoryText,
            selected && styles.categoryTextActive,
          ]}
        >
          {item}
        </Text>
      </Pressable>
    );
  };

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
      onLongPress={() => handleDelete(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>QUẢN LÝ THƯ VIỆN</Text>
        <Text style={styles.headerSubtitle}>
          Tra cứu và quản lý sách dễ dàng
        </Text>
      </View>

      <View style={styles.content}>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm tên sách hoặc tác giả..."
          placeholderTextColor={colors.secondaryText}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{books.length}</Text>
            <Text style={styles.summaryLabel}>Đầu sách</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalBorrowed}</Text>
            <Text style={styles.summaryLabel}>Sách đang mượn</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Danh mục sách</Text>

        <FlatList
          horizontal
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          style={styles.categoryFlatList}
          extraData={category}
        />

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Danh sách sách</Text>
          <Text style={styles.resultCount}>{filteredBooks.length} kết quả</Text>
        </View>

        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.bookList,
            filteredBooks.length === 0 && styles.emptyBookList,
          ]}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Không tìm thấy sách</Text>
              <Text style={styles.emptySubtitle}>
                Hãy thử từ khóa hoặc danh mục khác nhé.
              </Text>
            </View>
          }
        />
      </View>

      <Pressable
        onPress={() => navigation.navigate('BookForm')}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <Text style={styles.addButtonText}>＋  Thêm sách mới</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  headerSubtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  searchInput: {
    height: 44,
    marginHorizontal: 14,
    marginBottom: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 14,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    minHeight: 70,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  summaryNumber: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '800',
  },
  summaryLabel: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 3,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  categoryFlatList: {
    flexGrow: 0,
    marginTop: 8,
    marginBottom: 14,
  },
  categoryList: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    alignItems: 'center',
    gap: 8,
  },
  categoryButton: {
    height: 36,
    minWidth: 68,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonPressed: {
    opacity: 0.75,
  },
  categoryText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  resultCount: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  bookList: {
    paddingHorizontal: 14,
    paddingBottom: 90,
  },
  emptyBookList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: colors.secondaryText,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  addButton: {
    position: 'absolute',
    right: 18,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 14,
    elevation: 5,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
