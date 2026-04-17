import { ref, watch } from 'vue'

const STORAGE_KEY = 'bookspinner-books'

export function useBookList() {
  const books = ref(loadBooks())

  function loadBooks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
  }

  function addBook(book) {
    books.value.push({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
    })
    save()
  }

  function removeBook(index) {
    books.value.splice(index, 1)
    save()
  }

  function clearAll() {
    books.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return { books, addBook, removeBook, clearAll }
}
