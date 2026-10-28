import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useBooks} from '../context/BooksContext';
import {Book} from '../types/Book';
import colors from '../theme/colors';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

const categories = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
];

const BookFormScreen = ({navigation, route}: Props) => {
  const {books, saveBook} = useBooks();
  const existing = books.find(b => b.id === route.params?.bookId);
  const isEdit = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [author, setAuthor] = useState(existing?.author ?? '');
  const [category, setCategory] = useState(
    existing?.category ?? 'Giáo trình',
  );
  const [year, setYear] = useState(
    existing ? String(existing.year) : String(new Date().getFullYear()),
  );
  const [quantity, setQuantity] = useState(
    existing ? String(existing.quantity) : '1',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    const y = Number(year);
    const q = Number(quantity);
    const currentYear = new Date().getFullYear();

    if (!title.trim()) next.title = 'Vui lòng nhập tên sách.';
    if (!author.trim()) next.author = 'Vui lòng nhập tác giả.';

    if (
      !year.trim() ||
      !Number.isInteger(y) ||
      y < 1900 ||
      y > currentYear
    ) {
      next.year = `Năm phải từ 1900 đến ${currentYear}.`;
    }

    if (!quantity.trim() || !Number.isInteger(q) || q <= 0) {
      next.quantity = 'Số lượng phải là số nguyên lớn hơn 0.';
    } else if (existing && q < existing.borrowed) {
      next.quantity =
        `Số lượng không được nhỏ hơn ${existing.borrowed} cuốn đang mượn.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    const book: Book = {
      id: existing?.id ?? Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      category,
      year: Number(year),
      quantity: Number(quantity),
      borrowed: existing?.borrowed ?? 0,
    };

    saveBook(book);
    Alert.alert('Thành công', isEdit ? 'Đã cập nhật sách.' : 'Đã thêm sách.', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const field = (
    label: string,
    value: string,
    setter: (v: string) => void,
    key: string,
    options?: {numeric?: boolean; placeholder?: string},
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={v => {
          setter(v);
          setErrors(prev => ({...prev, [key]: ''}));
        }}
        placeholder={options?.placeholder ?? label}
        placeholderTextColor={colors.secondaryText}
        keyboardType={options?.numeric ? 'number-pad' : 'default'}
        style={[styles.input, errors[key] ? styles.invalid : null]}
      />
      {Boolean(errors[key]) && (
        <Text style={styles.error}>{errors[key]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        {field('Tên sách *', title, setTitle, 'title')}
        {field('Tác giả *', author, setAuthor, 'author')}

        <Text style={styles.label}>Thể loại</Text>
        <View style={styles.categories}>
          {categories.map(item => {
            const active = item === category;

            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  styles.categoryButton,
                  active && styles.categoryActive,
                ]}>
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {field('Năm xuất bản *', year, setYear, 'year', {
          numeric: true,
        })}
        {field('Tổng số cuốn *', quantity, setQuantity, 'quantity', {
          numeric: true,
        })}

        {existing && (
          <Text style={styles.borrowed}>
            Đang có {existing.borrowed} cuốn được mượn.
          </Text>
        )}

        <Pressable
          onPress={submit}
          style={({pressed}) => [
            styles.saveButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.saveText}>
            {isEdit ? 'Lưu thay đổi' : 'Thêm sách'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: 16, paddingBottom: 32},
  field: {marginBottom: 15},
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 7,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: colors.text,
  },
  invalid: {borderColor: colors.danger},
  error: {color: colors.danger, fontSize: 12, marginTop: 5},
  categories: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18},
  categoryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {fontSize: 12, color: colors.text},
  categoryTextActive: {color: '#FFFFFF', fontWeight: '700'},
  borrowed: {color: colors.secondaryText, marginBottom: 12},
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  pressed: {opacity: 0.75},
});

export default BookFormScreen;