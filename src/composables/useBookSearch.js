import { ref } from 'vue'

export function useBookSearch() {
  const results = ref([])
  const loading = ref(false)
  let debounceTimer = null

  async function fetchFromOpenLibrary(query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Open Library request failed')
    const data = await res.json()

    return data.docs.map(doc => ({
      title: doc.title,
      author: doc.author_name?.[0] ?? 'Unknown Author',
      coverId: doc.cover_i ?? null,
      isbn: doc.isbn?.[0] ?? null,
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
    }))
  }

  async function fetchGoogleBooksCover(isbn) {
    if (!isbn) return null
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`
    try {
      const res = await fetch(url)
      if (!res.ok) return null
      const data = await res.json()
      return data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ?? null
    } catch {
      return null
    }
  }

  async function searchBooks(query) {
    const trimmed = query.trim()
    if (!trimmed) {
      results.value = []
      return
    }

    loading.value = true
    try {
      const books = await fetchFromOpenLibrary(trimmed)

      // Try Google Books fallback for books without covers
      const enhanced = await Promise.all(
        books.map(async (book) => {
          if (!book.coverUrl && book.isbn) {
            const googleCover = await fetchGoogleBooksCover(book.isbn)
            if (googleCover) {
              return { ...book, coverUrl: googleCover }
            }
          }
          return book
        })
      )

      results.value = enhanced
    } catch (err) {
      console.error('Search failed:', err)
      results.value = []
    } finally {
      loading.value = false
    }
  }

  function debouncedSearch(query) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => searchBooks(query), 300)
  }

  function clearResults() {
    results.value = []
    clearTimeout(debounceTimer)
  }

  return { results, loading, debouncedSearch, clearResults }
}
