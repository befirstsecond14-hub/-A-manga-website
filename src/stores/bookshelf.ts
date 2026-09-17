import { defineStore } from 'pinia'

export interface BookshelfManga {
  id: number
  title: string
  cover: string
  chapter: number
}

export const useBookshelfStore = defineStore('bookshelf', {
  state: () => ({
    mangaList: [
      {
        id: 1,
        title: 'One Piece',
        cover:
          'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600',
        chapter: 100,
      },
    ] as BookshelfManga[],
  }),

  getters: {
    isInBookshelf: (state) => {
      return (mangaId: number) => {
        return state.mangaList.some(
          (manga) => manga.id === mangaId,
        )
      }
    },
  },

  actions: {
    addToBookshelf(manga: BookshelfManga) {
      const exists = this.mangaList.some(
        (item) => item.id === manga.id,
      )

      if (exists) {
        return false
      }

      this.mangaList.push({
        ...manga,
      })

      return true
    },

    removeFromBookshelf(mangaId: number) {
      this.mangaList = this.mangaList.filter(
        (manga) => manga.id !== mangaId,
      )
    },

    updateChapter(
      mangaId: number,
      chapter: number,
    ) {
      const manga = this.mangaList.find(
        (item) => item.id === mangaId,
      )

      if (!manga) return

      manga.chapter = chapter
    },
  },
})