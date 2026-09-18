import { Manga } from '../models/Manga'

const STORAGE_KEY = 'mangaverse_manga'

export class MangaService {
  private mangaList: Manga[]

  constructor() {
    this.mangaList = this.loadManga()
  }

  // ========================================
  // DEFAULT DATA
  // ========================================

  private getDefaultManga(): Manga[] {
    return [
      new Manga(
        1,
        'One Piece',
        'Eiichiro Oda',
        'เรื่องราวของโจรสลัดและการผจญภัย',
        'Action',
        100,
        'กำลังดำเนินเรื่อง',
        'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600'
      ),

      new Manga(
        2,
        'Solo Leveling',
        'Chugong',
        'เรื่องราวของซองจินอู ผู้ที่เริ่มต้นจากนักล่าที่อ่อนแอ',
        'Fantasy',
        100,
        'จบแล้ว',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600'
      ),

      new Manga(
        3,
        'Naruto',
        'Masashi Kishimoto',
        'เรื่องราวของนินจาหนุ่มนารูโตะ',
        'Action',
        100,
        'จบแล้ว',
        'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600'
      ),

      new Manga(
        4,
        'Demon Slayer',
        'Koyoharu Gotouge',
        'เรื่องราวของทันจิโร่ที่ออกเดินทางเพื่อช่วยน้องสาว',
        'Action',
        100,
        'จบแล้ว',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600'
      )
    ]
  }

  // ========================================
  // LOAD
  // ========================================

  private loadManga(): Manga[] {
    const saved = localStorage.getItem(STORAGE_KEY)

    // ถ้ายังไม่มีข้อมูล ให้สร้างข้อมูลเริ่มต้น
    if (!saved) {
      const defaultManga = this.getDefaultManga()

      // บันทึกข้อมูลเริ่มต้นลง localStorage
      this.mangaList = defaultManga
      this.saveManga()

      return defaultManga
    }

    try {
      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        const defaultManga = this.getDefaultManga()

        this.mangaList = defaultManga
        this.saveManga()

        return defaultManga
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
          manga.cover ?? manga._cover ?? ''
        )
      })
    } catch (error) {
      console.error(
        'ไม่สามารถโหลดข้อมูลมังงะได้',
        error
      )

      const defaultManga = this.getDefaultManga()

      this.mangaList = defaultManga
      this.saveManga()

      return defaultManga
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
      cover: manga.cover
    }))

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
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
    id: number
  ): Manga | undefined {
    return this.mangaList.find(
      (manga) => manga.id === id
    )
  }

  // ========================================
  // UPDATE
  // ========================================

  updateManga(
    updatedManga: Manga
  ): boolean {
    const index =
      this.mangaList.findIndex(
        (manga) =>
          manga.id === updatedManga.id
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
    id: number
  ): boolean {
    const index =
      this.mangaList.findIndex(
        (manga) => manga.id === id
      )

    if (index === -1) {
      return false
    }

    this.mangaList.splice(index, 1)

    this.saveManga()

    return true
  }
}