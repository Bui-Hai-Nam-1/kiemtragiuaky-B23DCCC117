import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Book} from '../types/Book';
import {sampleBooks} from '../data/sampleBooks';

type BooksContextType = {
  books: Book[];
  loading: boolean;
  saveBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  changeBorrowed: (id: string, delta: number) => void;
};

const STORAGE_KEY = '@library_books_v1';

const BooksContext = createContext<BooksContextType | undefined>(
  undefined,
);

export const BooksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setBooks(JSON.parse(raw) as Book[]);
        } else {
          setBooks(sampleBooks);
        }
      } catch {
        setBooks(sampleBooks);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch(
        error => console.warn('Không lưu được dữ liệu:', error),
      );
    }
  }, [books, loading]);

  const saveBook = (book: Book) => {
    setBooks(current => {
      const exists = current.some(item => item.id === book.id);

      if (exists) {
        return current.map(item =>
          item.id === book.id ? book : item,
        );
      }

      return [book, ...current];
    });
  };

  const deleteBook = (id: string) => {
    setBooks(current => current.filter(book => book.id !== id));
  };

  const changeBorrowed = (id: string, delta: number) => {
    setBooks(current =>
      current.map(book => {
        if (book.id !== id) {
          return book;
        }

        const next = book.borrowed + delta;

        if (next < 0 || next > book.quantity) {
          return book;
        }

        return {...book, borrowed: next};
      }),
    );
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        saveBook,
        deleteBook,
        changeBorrowed,
      }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);

  if (!context) {
    throw new Error('useBooks phải nằm bên trong BooksProvider');
  }

  return context;
};