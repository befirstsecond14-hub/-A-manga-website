import { Chapter } from '../models/Chapter'
import { ChapterImage } from '../models/ChapterImage'

interface StoredChapter {
  id: number
  mangaId: number
  chapterNumber: number
  title: string
}

interface StoredChapterImage {
  id: number
  chapterId: number
  imageUrl: string
  imageOrder: number
}

export class ChapterService {
  private chapters: Chapter[]
  private chapterImages: ChapterImage[]

  private getChapterStorageKey(
    mangaId: number,
  ): string {
    return `mangaverse_chapters_${mangaId}`
  }

  private getImageStorageKey(
    chapterId: number,
  ): string {
    return `mangaverse_chapter_images_${chapterId}`
  }

  constructor() {
    this.chapters = []
    this.chapterImages = []
  }

  // ========================================
  // CHAPTER - LOAD
  // ========================================

  private loadChapters(
    mangaId: number,
  ): Chapter[] {
    const storageKey =
      this.getChapterStorageKey(mangaId)

    const saved =
      localStorage.getItem(storageKey)

    if (!saved) {
      return []
    }

    try {
      const parsed: unknown =
        JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed
        .map((item: unknown) => {
          const chapter =
            item as Partial<StoredChapter>

          return new Chapter(
            Number(chapter.id),
            Number(chapter.mangaId),
            Number(chapter.chapterNumber),
            String(chapter.title ?? ''),
          )
        })
        .filter((chapter) => {
          return (
            Number.isFinite(chapter.id) &&
            Number.isFinite(chapter.mangaId) &&
            Number.isFinite(
              chapter.chapterNumber,
            )
          )
        })
    } catch (error) {
      console.error(
        'ไม่สามารถโหลดข้อมูล Chapter ได้',
        error,
      )

      return []
    }
  }

  // ========================================
  // CHAPTER - SAVE
  // ========================================

  private saveChapters(
    mangaId: number,
    chapters: Chapter[],
  ): boolean {
    try {
      const data: StoredChapter[] =
        chapters.map((chapter) => ({
          id: chapter.id,
          mangaId: chapter.mangaId,
          chapterNumber:
            chapter.chapterNumber,
          title: chapter.title,
        }))

      localStorage.setItem(
        this.getChapterStorageKey(mangaId),
        JSON.stringify(data),
      )

      return true
    } catch (error) {
      console.error(
        'ไม่สามารถบันทึกข้อมูล Chapter ได้',
        error,
      )

      return false
    }
  }

  // ========================================
  // CHAPTER - CREATE
  // ========================================

  createChapter(
    chapter: Chapter,
  ): boolean {
    const chapters =
      this.loadChapters(chapter.mangaId)

    const duplicate =
      chapters.some(
        (item) =>
          item.chapterNumber ===
          chapter.chapterNumber,
      )

    if (duplicate) {
      return false
    }

    chapters.push(chapter)

    return this.saveChapters(
      chapter.mangaId,
      chapters,
    )
  }

  // ========================================
  // CHAPTER - READ ALL
  // ========================================

  getAllChapters(
    mangaId: number,
  ): Chapter[] {
    return this.loadChapters(mangaId)
  }

  // ========================================
  // CHAPTER - READ BY ID
  // ========================================

  getChapterById(
    mangaId: number,
    chapterId: number,
  ): Chapter | undefined {
    const chapters =
      this.loadChapters(mangaId)

    return chapters.find(
      (chapter) =>
        chapter.id === chapterId,
    )
  }

  // ========================================
  // CHAPTER - UPDATE
  // ========================================

  updateChapter(
    chapter: Chapter,
  ): boolean {
    const chapters =
      this.loadChapters(chapter.mangaId)

    const index =
      chapters.findIndex(
        (item) =>
          item.id === chapter.id,
      )

    if (index === -1) {
      return false
    }

    const duplicate =
      chapters.some(
        (item) =>
          item.id !== chapter.id &&
          item.chapterNumber ===
            chapter.chapterNumber,
      )

    if (duplicate) {
      return false
    }

    chapters[index] = chapter

    return this.saveChapters(
      chapter.mangaId,
      chapters,
    )
  }

  // ========================================
  // CHAPTER - DELETE
  // ========================================

  deleteChapter(
    mangaId: number,
    chapterId: number,
  ): boolean {
    const chapters =
      this.loadChapters(mangaId)

    const index =
      chapters.findIndex(
        (chapter) =>
          chapter.id === chapterId,
      )

    if (index === -1) {
      return false
    }

    chapters.splice(index, 1)

    const saved =
      this.saveChapters(
        mangaId,
        chapters,
      )

    if (!saved) {
      return false
    }

    // ลบข้อมูลรูปของ Chapter นี้ด้วย
    this.deleteChapterImages(chapterId)

    return true
  }

  // ========================================
  // CHAPTER IMAGE - LOAD
  // ========================================

  private loadChapterImages(
    chapterId: number,
  ): ChapterImage[] {
    const storageKey =
      this.getImageStorageKey(chapterId)

    const saved =
      localStorage.getItem(storageKey)

    if (!saved) {
      return []
    }

    try {
      const parsed: unknown =
        JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed
        .map((item: unknown) => {
          const image =
            item as Partial<StoredChapterImage>

          return new ChapterImage(
            Number(image.id),
            Number(image.chapterId),
            String(
              image.imageUrl ?? '',
            ),
            Number(
              image.imageOrder ?? 0,
            ),
          )
        })
        .filter((image) => {
          return (
            Number.isFinite(image.id) &&
            Number.isFinite(
              image.chapterId,
            ) &&
            Number.isFinite(
              image.imageOrder,
            )
          )
        })
        .sort(
          (a, b) =>
            a.imageOrder -
            b.imageOrder,
        )
    } catch (error) {
      console.error(
        'ไม่สามารถโหลดข้อมูลรูป Chapter ได้',
        error,
      )

      return []
    }
  }

  // ========================================
  // CHAPTER IMAGE - SAVE
  // ========================================

  private saveChapterImages(
    chapterId: number,
    images: ChapterImage[],
  ): boolean {
    try {
      const data: StoredChapterImage[] =
        images.map((image) => ({
          id: image.id,
          chapterId: image.chapterId,
          imageUrl: image.imageUrl,
          imageOrder: image.imageOrder,
        }))

      localStorage.setItem(
        this.getImageStorageKey(
          chapterId,
        ),
        JSON.stringify(data),
      )

      return true
    } catch (error) {
      console.error(
        'ไม่สามารถบันทึกข้อมูลรูป Chapter ได้',
        error,
      )

      return false
    }
  }

  // ========================================
  // CHAPTER IMAGE - CREATE
  // ========================================

  addChapterImage(
    image: ChapterImage,
  ): boolean {
    const images =
      this.loadChapterImages(
        image.chapterId,
      )

    images.push(image)

    const saved =
      this.saveChapterImages(
        image.chapterId,
        images,
      )

    if (!saved) {
      return false
    }

    this.chapterImages =
      images

    return true
  }

  // ========================================
  // CHAPTER IMAGE - READ
  // ========================================

  getChapterImages(
    chapterId: number,
  ): ChapterImage[] {
    const images =
      this.loadChapterImages(
        chapterId,
      )

    this.chapterImages =
      images

    return [...images]
  }

  // ========================================
  // CHAPTER IMAGE - DELETE
  // ========================================

  deleteChapterImage(
    chapterId: number,
    imageId: number,
  ): boolean {
    const images =
      this.loadChapterImages(
        chapterId,
      )

    const index =
      images.findIndex(
        (image) =>
          image.id === imageId,
      )

    if (index === -1) {
      return false
    }

    images.splice(index, 1)

    const saved =
      this.saveChapterImages(
        chapterId,
        images,
      )

    if (!saved) {
      return false
    }

    this.chapterImages =
      images

    return true
  }

  // ========================================
  // CHAPTER IMAGE - DELETE ALL
  // ========================================

  private deleteChapterImages(
    chapterId: number,
  ): void {
    localStorage.removeItem(
      this.getImageStorageKey(
        chapterId,
      ),
    )

    this.chapterImages = []
  }
}