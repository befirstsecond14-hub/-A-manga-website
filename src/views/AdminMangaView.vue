<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'
import { MangaService } from '../services/MangaService'

type MangaStatus =
  | 'กำลังดำเนินเรื่อง'
  | 'จบแล้ว'

interface ChapterFile {
  id: string
  name: string
  type: string
  size: number
  dataUrl: string
  isImage: boolean
}

interface AdminChapter {
  id: number
  number: number
  title: string
  imageCount: number
  images: string[]
  files: ChapterFile[]
}

const router = useRouter()
const route = useRoute()
const mangaService = new MangaService()

/* =========================
   Manga
========================= */

const mangaId = Number(route.params.id)

const manga =
  mangaService.getMangaById(mangaId)

if (!manga) {
  router.push('/admin')
}

/* =========================
   Manga Form
========================= */

const mangaForm = reactive<{
  title: string
  author: string
  category: string
  status: MangaStatus
  cover: string
  description: string
}>({
  title: manga?.title ?? '',
  author: manga?.author ?? '',
  category: manga?.category ?? '',
  status:
    manga?.status === 'จบแล้ว'
      ? 'จบแล้ว'
      : 'กำลังดำเนินเรื่อง',
  cover: manga?.cover ?? '',
  description: manga?.description ?? '',
})

/* =========================
   Toast
========================= */

const showToast = ref(false)
const toastMessage = ref('')

let toastTimer:
  ReturnType<typeof setTimeout> | null = null

function toast(message: string) {
  toastMessage.value = message
  showToast.value = true

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 2500)
}

/* =========================
   Chapter Storage
========================= */

const chapterStorageKey =
  `mangaverse_chapters_${mangaId}`

/* =========================
   Create File ID
========================= */

function createFileId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

/* =========================
   Data URL MIME
========================= */

function getMimeFromDataUrl(
  dataUrl: string
) {
  const match = dataUrl.match(
    /^data:([^;,]+)[;,]/
  )

  return match?.[1] ??
    'application/octet-stream'
}

/* =========================
   Get File Extension
========================= */

function getFileExtension(
  fileName: string
) {
  const parts = fileName.split('.')

  if (parts.length <= 1) {
    return 'FILE'
  }

  return (
    parts[parts.length - 1] ?? 'FILE'
  ).toUpperCase()
}

/* =========================
   Format File Size
========================= */

function formatFileSize(
  size: number
) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`
  }

  return `${(
    size /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`
}

/* =========================
   Convert Old Image
========================= */

function convertOldImageToFile(
  image: string,
  index: number
): ChapterFile {
  const type =
    getMimeFromDataUrl(image)

  return {
    id: `old-image-${index}-${Date.now()}`,
    name: `image-${index + 1}`,
    type,
    size: 0,
    dataUrl: image,
    isImage: true,
  }
}

/* =========================
   Load Chapters
========================= */

function loadChapters(): AdminChapter[] {
  const saved = localStorage.getItem(
    chapterStorageKey
  )

  if (!saved) {
    return []
  }

  try {
    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((chapter) => {
        const oldImages =
          Array.isArray(chapter.images)
            ? chapter.images
                .map((image: unknown) =>
                  String(image)
                )
                .filter(
                  (image: string) =>
                    image.length > 0
                )
            : []

        let files: ChapterFile[] = []

        if (
          Array.isArray(chapter.files)
        ) {
          files = chapter.files
            .map((file: any) => {
              const dataUrl =
                String(
                  file.dataUrl ?? ''
                )

              if (!dataUrl) {
                return null
              }

              const type =
                String(
                  file.type ??
                    getMimeFromDataUrl(
                      dataUrl
                    )
                )

              return {
                id: String(
                  file.id ??
                    createFileId()
                ),
                name: String(
                  file.name ??
                    'file'
                ),
                type,
                size: Number(
                  file.size ?? 0
                ),
                dataUrl,
                isImage:
                  Boolean(
                    file.isImage
                  ) ||
                  type.startsWith(
                    'image/'
                  ),
              }
            })
            .filter(
              (
                file: ChapterFile | null
              ): file is ChapterFile =>
                file !== null
            )
        }

        /*
         * รองรับข้อมูลเก่า
         * ที่มีเฉพาะ images
         */
        if (
          files.length === 0 &&
          oldImages.length > 0
        ) {
          files = oldImages.map(
            (
              image: string,
              index: number
            ) =>
              convertOldImageToFile(
                image,
                index
              )
          )
        }

        const images =
          files.length > 0
            ? files
                .filter(
                  (file) =>
                    file.isImage
                )
                .map(
                  (file) =>
                    file.dataUrl
                )
            : oldImages

        const imageCount =
          images.length > 0
            ? images.length
            : Number(
                chapter.imageCount ?? 0
              )

        return {
          id: Number(chapter.id),
          number: Number(
            chapter.number
          ),
          title: String(
            chapter.title ?? ''
          ),
          imageCount,
          images,
          files,
        }
      })
      .filter(
        (chapter) =>
          Number.isFinite(
            chapter.id
          ) &&
          Number.isFinite(
            chapter.number
          )
      )
  } catch {
    return []
  }
}

/* =========================
   Chapters
========================= */

const chapters =
  ref<AdminChapter[]>(
    loadChapters()
  )

/* =========================
   Save Chapters
========================= */

function saveChapters() {
  try {
    localStorage.setItem(
      chapterStorageKey,
      JSON.stringify(
        chapters.value
      )
    )

    return true
  } catch (error) {
    console.error(
      'ไม่สามารถบันทึก Chapter ได้:',
      error
    )

    return false
  }
}

/* =========================
   Sorted Chapters
========================= */

const sortedChapters =
  computed(() => {
    return [...chapters.value].sort(
      (a, b) =>
        b.number - a.number
    )
  })

/* =========================
   Chapter Form
========================= */

const chapterForm = reactive<{
  number: number
  title: string
  imageCount: number
}>({
  number: 1,
  title: '',
  imageCount: 0,
})

/* =========================
   Modal
========================= */

const showChapterModal =
  ref(false)

const editingChapterId =
  ref<number | null>(null)

const isSavingChapter =
  ref(false)

/* =========================
   File Upload
========================= */

const fileInput =
  ref<HTMLInputElement | null>(
    null
  )

const selectedFiles =
  ref<File[]>([])

const previewUrls =
  ref<string[]>([])

/* =========================
   Existing Files
========================= */

const existingFiles =
  ref<ChapterFile[]>([])

/* =========================
   Back
========================= */

function goBack() {
  router.back()
}

/* =========================
   Save Manga
========================= */

function saveManga() {
  if (!manga) {
    return
  }

  if (!mangaForm.title.trim()) {
    toast('กรุณากรอกชื่อมังงะ')
    return
  }

  if (!mangaForm.author.trim()) {
    toast('กรุณากรอกชื่อผู้แต่ง')
    return
  }

  if (!mangaForm.category.trim()) {
    toast('กรุณากรอกหมวดหมู่')
    return
  }

  manga.title =
    mangaForm.title.trim()

  manga.author =
    mangaForm.author.trim()

  manga.category =
    mangaForm.category.trim()

  manga.status =
    mangaForm.status

  manga.cover =
    mangaForm.cover

  manga.description =
    mangaForm.description.trim()

  const updated =
    mangaService.updateManga(
      manga
    )

  if (!updated) {
    toast(
      'ไม่สามารถบันทึกข้อมูลได้'
    )
    return
  }

  toast(
    'บันทึกข้อมูลมังงะเรียบร้อยแล้ว'
  )
}

/* =========================
   File To Data URL
========================= */

function fileToDataURL(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader()

      reader.onload = () => {
        resolve(
          String(
            reader.result
          )
        )
      }

      reader.onerror = () => {
        reject(
          new Error(
            'ไม่สามารถอ่านไฟล์ได้'
          )
        )
      }

      reader.readAsDataURL(file)
    }
  )
}

/* =========================
   Cover Upload
========================= */

async function handleCoverUpload(
  event: Event
) {
  const input =
    event.target as HTMLInputElement

  const file =
    input.files?.[0]

  if (!file) {
    return
  }

  if (
    !file.type.startsWith(
      'image/'
    )
  ) {
    toast(
      'กรุณาเลือกไฟล์รูปภาพเท่านั้น'
    )

    input.value = ''
    return
  }

  try {
    const imageData =
      await fileToDataURL(file)

    mangaForm.cover =
      imageData

    toast(
      'เปลี่ยนรูปปกแล้ว กดบันทึกข้อมูลเพื่อบันทึก'
    )
  } catch {
    toast(
      'ไม่สามารถอ่านรูปปกได้'
    )
  }

  input.value = ''
}

/* =========================
   Add Chapter
========================= */

function openAddChapterForm() {
  editingChapterId.value =
    null

  const maxChapter =
    chapters.value.length > 0
      ? Math.max(
          ...chapters.value.map(
            (chapter) =>
              chapter.number
          )
        )
      : 0

  chapterForm.number =
    Number(
      (maxChapter + 1).toFixed(
        1
      )
    )

  chapterForm.title = ''
  chapterForm.imageCount = 0

  selectedFiles.value = []
  existingFiles.value = []

  clearPreviewUrls()

  showChapterModal.value =
    true
}

/* =========================
   Edit Chapter
========================= */

function openEditChapterForm(
  chapter: AdminChapter
) {
  editingChapterId.value =
    chapter.id

  chapterForm.number =
    chapter.number

  chapterForm.title =
    chapter.title

  chapterForm.imageCount =
    chapter.imageCount

  selectedFiles.value = []

  /*
   * ถ้ามี files ให้ใช้ files
   * ถ้าไม่มี ใช้ images แบบเก่า
   */
  existingFiles.value =
    chapter.files.length > 0
      ? [...chapter.files]
      : chapter.images.map(
          (
            image,
            index
          ) =>
            convertOldImageToFile(
              image,
              index
            )
        )

  clearPreviewUrls()

  showChapterModal.value =
    true
}

/* =========================
   Convert Selected Files
========================= */

async function convertSelectedFiles(
  files: File[]
): Promise<ChapterFile[]> {
  const result: ChapterFile[] =
    []

  for (
    const file of files
  ) {
    const dataUrl =
      await fileToDataURL(file)

    const isImage =
      file.type.startsWith(
        'image/'
      )

    result.push({
      id: createFileId(),
      name: file.name,
      type:
        file.type ||
        'application/octet-stream',
      size: file.size,
      dataUrl,
      isImage,
    })
  }

  return result
}

/* =========================
   Save Chapter
========================= */

async function saveChapter() {
  if (isSavingChapter.value) {
    console.log(
      '[saveChapter] กำลังบันทึกอยู่แล้ว ข้ามการเรียกซ้ำ'
    )
    return
  }

  const number =
    Number(chapterForm.number)

  const title =
    chapterForm.title.trim()

  if (
    !Number.isFinite(number) ||
    number < 1
  ) {
    console.warn(
      '[saveChapter] เลขตอนไม่ถูกต้อง:',
      chapterForm.number
    )
    toast(
      'กรุณากรอกเลขตอนให้ถูกต้อง'
    )
    return
  }

  if (!title) {
    console.warn(
      '[saveChapter] ไม่ได้กรอกชื่อตอน'
    )
    toast('กรุณากรอกชื่อตอน')
    return
  }

  /* =========================
     Check Duplicate
  ========================= */

  const duplicate =
    chapters.value.some(
      (chapter) => {
        if (
          editingChapterId.value !==
            null &&
          chapter.id ===
            editingChapterId.value
        ) {
          return false
        }

        return (
          chapter.number ===
          number
        )
      }
    )

  if (duplicate) {
    console.warn(
      '[saveChapter] เลขตอนซ้ำ:',
      number
    )
    toast('เลขตอนนี้มีอยู่แล้ว')
    return
  }

  isSavingChapter.value =
    true

  try {
    /* =========================
       Convert Files
    ========================= */

    let files: ChapterFile[] =
      []

    /*
     * ถ้ามีการเลือกไฟล์ใหม่
     * ใช้ไฟล์ใหม่แทนไฟล์เดิม
     */
    if (
      selectedFiles.value.length >
      0
    ) {
      files =
        await convertSelectedFiles(
          selectedFiles.value
        )
    }

    /*
     * ถ้าแก้ไขตอน
     * และไม่ได้เลือกไฟล์ใหม่
     * ใช้ไฟล์เดิมที่เหลืออยู่
     */
    else if (
      editingChapterId.value !==
      null
    ) {
      files = [
        ...existingFiles.value,
      ]
    }

    /*
     * สร้าง images จากไฟล์รูป
     * เพื่อให้ Reader เดิมยังใช้ได้
     */
    const images =
      files
        .filter(
          (file) =>
            file.isImage
        )
        .map(
          (file) =>
            file.dataUrl
        )

    /* =========================
       Edit Existing Chapter
    ========================= */

    if (
      editingChapterId.value !==
      null
    ) {
      const chapter =
        chapters.value.find(
          (item) =>
            item.id ===
            editingChapterId.value
        )

      if (!chapter) {
        console.error(
          '[saveChapter] ไม่พบตอนที่ต้องการแก้ไข id:',
          editingChapterId.value
        )
        toast(
          'ไม่พบตอนที่ต้องการแก้ไข'
        )
        return
      }

      chapter.number =
        number

      chapter.title =
        title

      chapter.files =
        files

      chapter.images =
        images

      chapter.imageCount =
        images.length
    }

    /* =========================
       Add New Chapter
    ========================= */

    else {
      const newId =
        chapters.value.length >
        0
          ? Math.max(
              ...chapters.value.map(
                (chapter) =>
                  chapter.id
              )
            ) + 1
          : 1

      chapters.value.push({
        id: newId,
        number,
        title,
        imageCount:
          images.length,
        images,
        files,
      })
    }

    /* =========================
       Save
    ========================= */

    const saved =
      saveChapters()

    if (!saved) {
      console.error(
        '[saveChapter] saveChapters() คืนค่า false — localStorage อาจเต็ม'
      )
      toast(
        'พื้นที่จัดเก็บไม่เพียงพอ กรุณาใช้ไฟล์ขนาดเล็กลง'
      )

      return
    }

    /*
     * สำคัญ:
     * เก็บสถานะก่อนปิด Modal
     */
    const isEditing =
      editingChapterId.value !==
      null

    /*
     * แยก try/catch ตรงนี้
     * เผื่อ updateManga() ที่เรียกใน
     * updateLatestChapter() error
     * แล้วทำให้ popup ไม่ปิด
     */
    try {
      updateLatestChapter()
    } catch (err) {
      console.error(
        '[saveChapter] updateLatestChapter() error:',
        err
      )
    }

    console.log(
      '[saveChapter] บันทึกสำเร็จ ปิด popup',
      {
        isEditing,
        chaptersCount:
          chapters.value.length,
      }
    )

    /*
     * บันทึกสำเร็จแล้ว
     * ปิด Modal ทันที
     */
    closeChapterModal()

    toast(
      isEditing
        ? 'แก้ไขตอนเรียบร้อยแล้ว'
        : 'เพิ่มตอนเรียบร้อยแล้ว'
    )
  } catch (error) {
    console.error(
      '[saveChapter] Save chapter error:',
      error
    )

    toast(
      'ไม่สามารถบันทึกไฟล์ได้'
    )
  } finally {
    isSavingChapter.value =
      false
  }
}

/* =========================
   Delete Chapter
========================= */

function deleteChapter(
  chapterId: number
) {
  const chapter =
    chapters.value.find(
      (item) =>
        item.id === chapterId
    )

  if (!chapter) {
    return
  }

  const confirmed =
    window.confirm(
      `ต้องการลบตอนที่ ${chapter.number} ใช่หรือไม่?`
    )

  if (!confirmed) {
    return
  }

  const index =
    chapters.value.findIndex(
      (item) =>
        item.id === chapterId
    )

  if (index === -1) {
    return
  }

  chapters.value.splice(
    index,
    1
  )

  saveChapters()

  updateLatestChapter()

  toast(
    'ลบตอนเรียบร้อยแล้ว'
  )
}

/* =========================
   Update Latest Chapter
========================= */

function updateLatestChapter() {
  if (!manga) {
    return
  }

  const latest =
    chapters.value.length > 0
      ? Math.max(
          ...chapters.value.map(
            (chapter) =>
              chapter.number
          )
        )
      : 0

  manga.latestChapter =
    latest

  mangaService.updateManga(
    manga
  )
}

/* =========================
   File Input
========================= */

function triggerFileInput() {
  fileInput.value?.click()
}

/* =========================
   Chapter Files
========================= */

function handleChapterImages(
  event: Event
) {
  const input =
    event.target as HTMLInputElement

  const files =
    input.files
      ? Array.from(input.files)
      : []

  if (files.length === 0) {
    input.value = ''
    return
  }

  /*
   * ถ้าเลือกชุดใหม่
   * ให้แทนชุดที่เลือกก่อนหน้า
   */
  selectedFiles.value =
    files

  clearPreviewUrls()

  /*
   * สร้าง Preview เฉพาะรูป
   * ไฟล์อื่นจะใช้ file card
   */
  previewUrls.value =
    files.map((file) => {
      if (
        file.type.startsWith(
          'image/'
        )
      ) {
        return URL.createObjectURL(
          file
        )
      }

      return ''
    })

  chapterForm.imageCount =
    files.filter(
      (file) =>
        file.type.startsWith(
          'image/'
        )
    ).length

  input.value = ''
}

/* =========================
   Remove Selected File
========================= */

function removeSelectedFile(
  index: number
) {
  if (
    index < 0 ||
    index >=
      selectedFiles.value.length
  ) {
    return
  }

  const url =
    previewUrls.value[index]

  if (url) {
    URL.revokeObjectURL(url)
  }

  selectedFiles.value.splice(
    index,
    1
  )

  previewUrls.value.splice(
    index,
    1
  )

  chapterForm.imageCount =
    selectedFiles.value.filter(
      (file) =>
        file.type.startsWith(
          'image/'
        )
    ).length
}

/* =========================
   Remove Existing File
========================= */

function removeExistingFile(
  index: number
) {
  if (
    index < 0 ||
    index >=
      existingFiles.value.length
  ) {
    return
  }

  existingFiles.value.splice(
    index,
    1
  )

  chapterForm.imageCount =
    existingFiles.value.filter(
      (file) =>
        file.isImage
    ).length
}

/* =========================
   Clear Preview
========================= */

function clearPreviewUrls() {
  previewUrls.value.forEach(
    (url) => {
      if (url) {
        URL.revokeObjectURL(
          url
        )
      }
    }
  )

  previewUrls.value = []
}

/* =========================
   Close Modal
========================= */

function closeChapterModal() {
  if (isSavingChapter.value) {
    console.warn(
      '[closeChapterModal] ยังบันทึกอยู่ ปิดไม่ได้'
    )
    return
  }

  showChapterModal.value =
    false

  editingChapterId.value =
    null

  chapterForm.number = 1
  chapterForm.title = ''
  chapterForm.imageCount = 0

  selectedFiles.value = []
  existingFiles.value = []

  clearPreviewUrls()

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/* =========================
   Cleanup
========================= */

onBeforeUnmount(() => {
  clearPreviewUrls()

  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-left">
        <button
          class="back-btn"
          @click="goBack"
        >
          ← กลับ
        </button>

        <div>
          <h1>
            จัดการมังงะ
          </h1>

          <p>
            จัดการข้อมูลมังงะและตอนทั้งหมด
          </p>
        </div>
      </div>
    </header>

    <main class="admin-container">
      <!-- Manga Information -->
      <section class="manga-section">
        <div class="section-header">
          <div>
            <h2>
              ข้อมูลมังงะ
            </h2>

            <p>
              แก้ไขข้อมูลพื้นฐานของมังงะ
            </p>
          </div>

          <button
            class="primary-btn"
            @click="saveManga"
          >
            บันทึกข้อมูล
          </button>
        </div>

        <div class="manga-content">
          <!-- Cover -->
          <div class="cover-section">
            <img
              :src="mangaForm.cover"
              :alt="mangaForm.title"
              class="manga-cover"
            />

            <label
              class="upload-cover-btn"
            >
              เปลี่ยนรูปปก

              <input
                type="file"
                accept="image/*"
                @change="handleCoverUpload"
                hidden
              />
            </label>
          </div>

          <!-- Form -->
          <div class="manga-form">
            <div class="form-group">
              <label>
                ชื่อเรื่อง
              </label>

              <input
                v-model="mangaForm.title"
                type="text"
                placeholder="ชื่อมังงะ"
              />
            </div>

            <div class="form-group">
              <label>
                ผู้แต่ง
              </label>

              <input
                v-model="mangaForm.author"
                type="text"
                placeholder="ชื่อผู้แต่ง"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>
                  หมวดหมู่
                </label>

                <input
                  v-model="mangaForm.category"
                  type="text"
                  placeholder="หมวดหมู่"
                />
              </div>

              <div class="form-group">
                <label>
                  สถานะ
                </label>

                <select
                  v-model="mangaForm.status"
                >
                  <option
                    value="กำลังดำเนินเรื่อง"
                  >
                    กำลังดำเนินเรื่อง
                  </option>

                  <option
                    value="จบแล้ว"
                  >
                    จบแล้ว
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>
                คำอธิบาย
              </label>

              <textarea
                v-model="mangaForm.description"
                rows="5"
                placeholder="คำอธิบายมังงะ"
              ></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- Chapter Section -->
      <section class="chapter-section">
        <div class="section-header">
          <div>
            <h2>
              จัดการตอน
            </h2>

            <p>
              จำนวนทั้งหมด
              {{ chapters.length }}
              ตอน
            </p>
          </div>

          <button
            class="primary-btn"
            @click="openAddChapterForm"
          >
            + เพิ่มตอน
          </button>
        </div>

        <!-- Chapter List -->
        <div
          v-if="chapters.length > 0"
          class="chapter-list"
        >
          <div
            v-for="chapter in sortedChapters"
            :key="chapter.id"
            class="chapter-card"
          >
            <div class="chapter-info">
              <div
                class="chapter-number"
              >
                ตอน {{ chapter.number }}
              </div>

              <div
                class="chapter-title"
              >
                {{ chapter.title }}
              </div>

              <div
                class="chapter-images"
              >
                {{ chapter.imageCount }}
                รูป
                /
                {{ chapter.files.length }}
                ไฟล์
              </div>
            </div>

            <div class="chapter-actions">
              <button
                class="edit-btn"
                @click="
                  openEditChapterForm(
                    chapter
                  )
                "
              >
                แก้ไข
              </button>

              <button
                class="delete-btn"
                @click="
                  deleteChapter(
                    chapter.id
                  )
                "
              >
                ลบ
              </button>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-else
          class="empty-state"
        >
          <h3>
            ยังไม่มีตอน
          </h3>

          <p>
            กดปุ่ม "เพิ่มตอน"
            เพื่อเพิ่มตอนแรก
          </p>

          <button
            class="primary-btn"
            @click="openAddChapterForm"
          >
            + เพิ่มตอนแรก
          </button>
        </div>
      </section>
    </main>

    <!-- Chapter Modal -->
    <div
      v-if="showChapterModal"
      class="modal-overlay"
      @click.self="closeChapterModal"
    >
      <div class="modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <div>
            <h2>
              {{
                editingChapterId !== null
                  ? 'แก้ไขตอน'
                  : 'เพิ่มตอนใหม่'
              }}
            </h2>

            <p>
              {{
                editingChapterId !== null
                  ? 'แก้ไขข้อมูลของตอน'
                  : 'เพิ่มตอนใหม่ลงในมังงะ'
              }}
            </p>
          </div>

          <button
            class="close-btn"
            :disabled="isSavingChapter"
            @click="closeChapterModal"
          >
            ×
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Chapter Number -->
          <div class="form-group">
            <label>
              เลขตอน
            </label>

            <input
              v-model.number="
                chapterForm.number
              "
              type="number"
              min="1"
              step="0.1"
              placeholder="เช่น 1, 2, 3, 10.5, 101"
            />

            <small>
              สามารถเพิ่มตอนต่อไปได้ไม่จำกัด
            </small>
          </div>

          <!-- Chapter Title -->
          <div class="form-group">
            <label>
              ชื่อตอน
            </label>

            <input
              v-model="
                chapterForm.title
              "
              type="text"
              placeholder="เช่น การเริ่มต้น"
            />
          </div>

          <!-- Files -->
          <div class="form-group">
            <label>
              ไฟล์ในตอน
            </label>

            <div class="upload-area">
              <input
                ref="fileInput"
                type="file"
                accept="*/*"
                multiple
                @change="
                  handleChapterImages
                "
                hidden
              />

              <button
                type="button"
                class="upload-btn"
                @click="
                  triggerFileInput
                "
              >
                เลือกไฟล์
              </button>

              <p>
                {{
                  selectedFiles.length > 0
                    ? `เลือกแล้ว ${selectedFiles.length} ไฟล์`
                    : editingChapterId !== null &&
                      existingFiles.length > 0
                      ? `ใช้ไฟล์เดิม ${existingFiles.length} ไฟล์`
                      : 'ยังไม่ได้เลือกไฟล์'
                }}
              </p>

              <small class="upload-hint">
                รองรับรูปภาพ, PDF, PNG, JPG,
                WebP, GIF, ZIP, CBZ, TXT
                และไฟล์ประเภทอื่น ๆ
              </small>
            </div>
          </div>

          <!-- Existing Files -->
          <div
            v-if="
              editingChapterId !== null &&
              existingFiles.length > 0 &&
              selectedFiles.length === 0
            "
            class="preview-section"
          >
            <h3>
              ไฟล์ปัจจุบัน
            </h3>

            <div class="preview-grid">
              <div
                v-for="(
                  file,
                  index
                ) in existingFiles"
                :key="file.id"
                class="preview-item"
              >
                <!-- Image -->
                <img
                  v-if="file.isImage"
                  :src="file.dataUrl"
                  :alt="
                    file.name
                  "
                />

                <!-- Other File -->
                <div
                  v-else
                  class="file-preview"
                >
                  <div
                    class="file-extension"
                  >
                    {{
                      getFileExtension(
                        file.name
                      )
                    }}
                  </div>

                  <div
                    class="file-name"
                    :title="file.name"
                  >
                    {{ file.name }}
                  </div>

                  <div
                    class="file-size"
                  >
                    {{
                      formatFileSize(
                        file.size
                      )
                    }}
                  </div>
                </div>

                <span>
                  {{ index + 1 }}
                </span>

                <button
                  type="button"
                  class="remove-image-btn"
                  @click="
                    removeExistingFile(
                      index
                    )
                  "
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- New Files Preview -->
          <div
            v-if="
              selectedFiles.length > 0
            "
            class="preview-section"
          >
            <h3>
              ตัวอย่างไฟล์ใหม่
            </h3>

            <div class="preview-grid">
              <div
                v-for="(
                  file,
                  index
                ) in selectedFiles"
                :key="
                  `${file.name}-${index}`
                "
                class="preview-item"
              >
                <!-- Image Preview -->
                <img
                  v-if="
                    file.type.startsWith(
                      'image/'
                    ) &&
                    previewUrls[index]
                  "
                  :src="
                    previewUrls[index]
                  "
                  :alt="
                    file.name
                  "
                />

                <!-- Other File -->
                <div
                  v-else
                  class="file-preview"
                >
                  <div
                    class="file-extension"
                  >
                    {{
                      getFileExtension(
                        file.name
                      )
                    }}
                  </div>

                  <div
                    class="file-name"
                    :title="file.name"
                  >
                    {{ file.name }}
                  </div>

                  <div
                    class="file-size"
                  >
                    {{
                      formatFileSize(
                        file.size
                      )
                    }}
                  </div>
                </div>

                <span>
                  {{ index + 1 }}
                </span>

                <button
                  type="button"
                  class="remove-image-btn"
                  @click="
                    removeSelectedFile(
                      index
                    )
                  "
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            class="secondary-btn"
            :disabled="isSavingChapter"
            @click="
              closeChapterModal
            "
          >
            ยกเลิก
          </button>

          <button
            class="primary-btn"
            :disabled="isSavingChapter"
            @click="saveChapter"
          >
            {{
              isSavingChapter
                ? 'กำลังบันทึก...'
                : editingChapterId !== null
                  ? 'บันทึกการแก้ไข'
                  : 'เพิ่มตอน'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div
        v-if="showToast"
        class="toast"
      >
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* =========================
   Page
========================= */

.admin-page {
  min-height: 100vh;
  background: #f7f7f8;
  color: #18181b;
}

/* =========================
   Header
========================= */

.admin-header {
  background: #18181b;
  border-bottom: 1px solid #27272a;
  padding: 20px 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-left h1 {
  margin: 0;
  font-size: 28px;
  color: #ffffff;
}

.header-left p {
  margin: 5px 0 0;
  color: #d4d4d8;
}

/* =========================
   Back Button
========================= */

.back-btn {
  border: 1px solid #71717a;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 8px;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.back-btn:hover {
  background: #27272a;
  border-color: #a1a1aa;
}

/* =========================
   Container
========================= */

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 60px;
}

/* =========================
   Sections
========================= */

.manga-section,
.chapter-section {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 22px;
  color: #18181b;
}

.section-header p {
  margin: 5px 0 0;
  color: #777777;
}

/* =========================
   Buttons
========================= */

.primary-btn,
.secondary-btn,
.edit-btn,
.delete-btn,
.upload-btn,
.upload-cover-btn {
  border: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-family: inherit;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.primary-btn {
  background: #7c3aed;
  color: #ffffff;
}

.primary-btn:hover:not(:disabled) {
  background: #6d28d9;
  transform: translateY(-1px);
}

.primary-btn:disabled,
.secondary-btn:disabled,
.close-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.secondary-btn {
  background: #eeeeee;
  color: #18181b;
}

.secondary-btn:hover:not(:disabled) {
  background: #e5e5e5;
}

.edit-btn {
  background: #eeeeee;
  color: #18181b;
}

.edit-btn:hover {
  background: #e5e5e5;
}

.delete-btn {
  background: #eeeeee;
  color: #555555;
}

.delete-btn:hover {
  background: #e5e5e5;
}

.upload-btn,
.upload-cover-btn {
  background: #7c3aed;
  color: #ffffff;
}

.upload-btn:hover,
.upload-cover-btn:hover {
  background: #6d28d9;
}

/* =========================
   Manga Content
========================= */

.manga-content {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 30px;
}

/* =========================
   Cover
========================= */

.cover-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.manga-cover {
  width: 190px;
  height: 270px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  background: #eeeeee;
}

.upload-cover-btn {
  text-align: center;
}

/* =========================
   Form
========================= */

.manga-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #18181b;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 11px 12px;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  color: #18181b;
  font-family: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a1a1aa;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #7c3aed;
  box-shadow:
    0 0 0 3px
    rgba(124, 58, 237, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.form-group small {
  color: #888888;
  font-size: 12px;
}

/* =========================
   Chapter List
========================= */

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 15px 18px;
  background: #ffffff;
  transition:
    background 0.3s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.chapter-card:hover {
  background: #f7f7f8;
  border-color: #d4d4d8;
  transform: translateY(-1px);
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.chapter-number {
  font-weight: 700;
  min-width: 80px;
  color: #18181b;
}

.chapter-title {
  font-weight: 500;
  color: #18181b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-images {
  color: #888888;
  font-size: 13px;
}

.chapter-actions {
  display: flex;
  gap: 8px;
}

/* =========================
   Empty State
========================= */

.empty-state {
  text-align: center;
  padding: 50px 20px;
  border: 1px dashed #d4d4d8;
  border-radius: 10px;
  background: #fafafa;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: #18181b;
}

.empty-state p {
  color: #777777;
  margin-bottom: 20px;
}

/* =========================
   Modal
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 14px;
  box-shadow:
    0 20px 60px
    rgba(0, 0, 0, 0.2);
  border: 1px solid #e5e5e5;
}

/* =========================
   Modal Header
========================= */

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 22px 24px;
  border-bottom: 1px solid #eeeeee;
}

.modal-header h2 {
  margin: 0;
  color: #18181b;
}

.modal-header p {
  margin: 5px 0 0;
  color: #777777;
}

.close-btn {
  border: none;
  background: transparent;
  color: #18181b;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  transition:
    background 0.2s ease;
}

.close-btn:hover:not(:disabled) {
  background: #eeeeee;
}

/* =========================
   Modal Body
========================= */

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* =========================
   Modal Footer
========================= */

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 18px 24px;
  border-top: 1px solid #eeeeee;
}

/* =========================
   Upload Area
========================= */

.upload-area {
  border: 1px dashed #d4d4d8;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  background: #fafafa;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.upload-area:hover {
  border-color: #7c3aed;
  background: #fafafa;
}

.upload-area p {
  margin: 10px 0 0;
  color: #777777;
  font-size: 13px;
}

.upload-hint {
  display: block;
  margin-top: 8px;
  color: #999999;
  font-size: 12px;
}

/* =========================
   Preview
========================= */

.preview-section h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #18181b;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.preview-item {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 8px;
  background: #eeeeee;
  border: 1px solid #e5e5e5;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-item span {
  position: absolute;
  left: 6px;
  top: 6px;
  background: rgba(24, 24, 27, 0.75);
  color: #ffffff;
  border-radius: 5px;
  padding: 3px 7px;
  font-size: 11px;
  z-index: 1;
}

/* =========================
   File Preview
========================= */

.file-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  text-align: center;
}

.file-extension {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 10px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
}

.file-name {
  width: 100%;
  color: #18181b;
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  margin-top: 5px;
  color: #888888;
  font-size: 11px;
}

/* =========================
   Remove File Button
========================= */

.remove-image-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background: #dc2626;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.remove-image-btn:hover {
  background: #b91c1c;
  transform: scale(1.05);
}

/* =========================
   Toast
========================= */

.toast {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 2000;
  padding: 13px 18px;
  background: #18181b;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  box-shadow:
    0 10px 25px
    rgba(0, 0, 0, 0.15);
}

.toast-enter-active,
.toast-leave-active {
  transition: 0.25s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* =========================
   Responsive
========================= */

@media (max-width: 768px) {
  .admin-header {
    padding: 16px;
  }

  .admin-container {
    padding: 20px 12px 40px;
  }

  .manga-section,
  .chapter-section {
    padding: 18px;
  }

  .manga-content {
    grid-template-columns: 1fr;
  }

  .cover-section {
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chapter-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .chapter-info {
    width: 100%;
    flex-wrap: wrap;
  }

  .chapter-actions {
    width: 100%;
  }

  .chapter-actions button {
    flex: 1;
  }

  .preview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>