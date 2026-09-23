import { Manga } from '../models/Manga'

const STORAGE_KEY = 'mangaverse_manga'

export class MangaService {
  private mangaList: Manga[]

  constructor() {
    this.mangaList = this.loadManga()
  }

  // ========================================
  // LOAD
  // ========================================

  private loadManga(): Manga[] {
    const saved = localStorage.getItem(STORAGE_KEY)

    // ถ้ายังไม่มีข้อมูล ให้เริ่มต้นเป็นข้อมูลว่าง
    if (!saved) {
      return []
    }

    try {
      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed.map((manga) => {
        return new Manga(
          manga.id ?? manga._id,
          manga.title ?? manga._title,
          manga.author ?? manga._author,
          manga.description ?? manga._description,
          manga.category ?? manga._category,
          manga.latestChapter ?? manga._latestChapter ?? 0,
          manga.status ?? manga._status,
          manga.cover ?? manga._cover ?? '',
        )
      })
    } catch (error) {
      console.error(
        'ไม่สามารถโหลดข้อมูลมังงะได้',
        error,
      )

      return []
    }
  }

  // ========================================
  // SAVE
  // ========================================

  private saveManga(): void {
    const data = this.mangaList.map((manga) => ({
      id: manga.id,
      title: manga.title,
      author: manga.author,
      description: manga.description,
      category: manga.category,
      latestChapter: manga.latestChapter,
      status: manga.status,
      cover: manga.cover,
    }))

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    )
  }

  // ========================================
  // CREATE
  // ========================================

  createManga(manga: Manga): void {
    this.mangaList.push(manga)
    this.saveManga()
  }

  // ========================================
  // READ
  // ========================================

  getAllManga(): Manga[] {
    return [...this.mangaList]
  }

  // ========================================
  // READ BY ID
  // ========================================

  getMangaById(
    id: number,
  ): Manga | undefined {
    return this.mangaList.find(
      (manga) => manga.id === id,
    )
  }

  // ========================================
  // UPDATE
  // ========================================

  updateManga(
    updatedManga: Manga,
  ): boolean {
    const index =
      this.mangaList.findIndex(
        (manga) =>
          manga.id === updatedManga.id,
      )

    if (index === -1) {
      return false
    }

    this.mangaList[index] = updatedManga

    this.saveManga()

    return true
  }

  // ========================================
  // DELETE
  // ========================================

  deleteManga(
    id: number,
  ): boolean {
    const index =
      this.mangaList.findIndex(
        (manga) => manga.id === id,
      )

    if (index === -1) {
      return false
    }

    this.mangaList.splice(index, 1)

    this.saveManga()

    return true
  }
}