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
          <h1>จัดการมังงะ</h1>
          <p>จัดการข้อมูลมังงะและตอนทั้งหมด</p>
        </div>
      </div>
    </header>

    <main class="admin-container">

      <!-- Manga Information -->
      <section class="manga-section">
        <div class="section-header">
          <div>
            <h2>ข้อมูลมังงะ</h2>
            <p>แก้ไขข้อมูลพื้นฐานของมังงะ</p>
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

            <label class="upload-cover-btn">
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
              <label>ชื่อเรื่อง</label>

              <input
                v-model="mangaForm.title"
                type="text"
                placeholder="ชื่อมังงะ"
              />
            </div>

            <div class="form-group">
              <label>ผู้แต่ง</label>

              <input
                v-model="mangaForm.author"
                type="text"
                placeholder="ชื่อผู้แต่ง"
              />
            </div>

            <div class="form-row">

              <div class="form-group">
                <label>หมวดหมู่</label>

                <input
                  v-model="mangaForm.category"
                  type="text"
                  placeholder="หมวดหมู่"
                />
              </div>

              <div class="form-group">
                <label>สถานะ</label>

                <select v-model="mangaForm.status">
                  <option value="กำลังดำเนินเรื่อง">
                    กำลังดำเนินเรื่อง
                  </option>

                  <option value="จบแล้ว">
                    จบแล้ว
                  </option>
                </select>
              </div>

            </div>

            <div class="form-group">
              <label>คำอธิบาย</label>

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
            <h2>จัดการตอน</h2>

            <p>
              จำนวนทั้งหมด {{ chapters.length }} ตอน
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

              <div class="chapter-number">
                ตอน {{ chapter.number }}
              </div>

              <div class="chapter-title">
                {{ chapter.title }}
              </div>

              <div class="chapter-images">
                {{ chapter.imageCount }} รูป
              </div>

            </div>

            <div class="chapter-actions">

              <button
                class="edit-btn"
                @click="openEditChapterForm(chapter)"
              >
                แก้ไข
              </button>

              <button
                class="delete-btn"
                @click="deleteChapter(chapter.id)"
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
          <h3>ยังไม่มีตอน</h3>

          <p>
            กดปุ่ม "เพิ่มตอน" เพื่อเพิ่มตอนแรก
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

        <div class="modal-header">

          <div>
            <h2>
              {{
                editingChapterId
                  ? 'แก้ไขตอน'
                  : 'เพิ่มตอนใหม่'
              }}
            </h2>

            <p>
              {{
                editingChapterId
                  ? 'แก้ไขข้อมูลของตอน'
                  : 'เพิ่มตอนใหม่ลงในมังงะ'
              }}
            </p>
          </div>

          <button
            class="close-btn"
            @click="closeChapterModal"
          >
            ×
          </button>

        </div>

        <div class="modal-body">

          <!-- Chapter Number -->
          <div class="form-group">

            <label>เลขตอน</label>

            <input
              v-model.number="chapterForm.number"
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

            <label>ชื่อตอน</label>

            <input
              v-model="chapterForm.title"
              type="text"
              placeholder="เช่น การเริ่มต้น"
            />

          </div>

          <!-- Images -->
          <div class="form-group">

            <label>รูปภาพในตอน</label>

            <div class="upload-area">

              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleChapterImages"
                hidden
              />

              <button
                type="button"
                class="upload-btn"
                @click="triggerFileInput"
              >
                เลือกรูปภาพ
              </button>

              <p>
                {{
                  selectedFiles.length > 0
                    ? `เลือกแล้ว ${selectedFiles.length} รูป`
                    : 'ยังไม่ได้เลือกรูปภาพ'
                }}
              </p>

            </div>

          </div>

          <!-- Image Preview -->
          <div
            v-if="previewUrls.length > 0"
            class="preview-section"
          >

            <h3>ตัวอย่างรูปภาพ</h3>

            <div class="preview-grid">

              <div
                v-for="(url, index) in previewUrls"
                :key="url"
                class="preview-item"
              >

                <img
                  :src="url"
                  :alt="`รูปที่ ${index + 1}`"
                />

                <span>
                  {{ index + 1 }}
                </span>

              </div>

            </div>
          </div>

        </div>

        <div class="modal-footer">

          <button
            class="secondary-btn"
            @click="closeChapterModal"
          >
            ยกเลิก
          </button>

          <button
            class="primary-btn"
            @click="saveChapter"
          >
            {{
              editingChapterId
                ? 'บันทึกการแก้ไข'
                : 'เพิ่มตอน'
            }}
          </button>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  reactive,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

/* =========================
   Types
========================= */

type MangaStatus =
  | 'กำลังดำเนินเรื่อง'
  | 'จบแล้ว'

interface Manga {
  id: number
  title: string
  author: string
  category: string
  status: MangaStatus
  cover: string
  description: string
}

interface Chapter {
  id: number
  number: number
  title: string
  imageCount: number
}

/* =========================
   Router
========================= */

const router = useRouter()
const route = useRoute()

/* =========================
   Manga Data
========================= */

const mangaList: Manga[] = [
  {
    id: 1,
    title: 'One Piece',
    author: 'Chugong',
    category: 'Action',
    status: 'จบแล้ว',
    cover:
      'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600',
    description:
      'เรื่องราวของนักล่าที่อ่อนแอที่สุดและได้รับพลังจากระบบปริศนา'
  },

  {
    id: 2,
    title: 'Solo Leveling',
    author: 'Eiichiro Oda',
    category: 'Adventure',
    status: 'กำลังดำเนินเรื่อง',
    cover:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
    description:
      'การผจญภัยของลูฟี่และกลุ่มโจรสลัดหมวกฟาง'
  },

  {
    id: 3,
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    category: 'Action',
    status: 'จบแล้ว',
    cover:
      'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600',
    description:
      'เรื่องราวของนินจาหนุ่มที่ต้องการได้รับการยอมรับจากทุกคน'
  }
]

/* =========================
   Find Manga
========================= */

const mangaId = Number(route.params.id)

const foundManga = mangaList.find(
  manga => manga.id === mangaId
)

const manga = reactive<Manga>({
  ...(foundManga ?? mangaList[0]!)
})

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
  title: manga.title,
  author: manga.author,
  category: manga.category,
  status: manga.status,
  cover: manga.cover,
  description: manga.description
})

/* =========================
   Chapters
========================= */

const chapters = ref<Chapter[]>([
  {
    id: 1,
    number: 96,
    title: 'การต่อสู้ครั้งสุดท้าย',
    imageCount: 20
  },

  {
    id: 2,
    number: 97,
    title: 'จุดเริ่มต้นใหม่',
    imageCount: 22
  },

  {
    id: 3,
    number: 98,
    title: 'ความลับ',
    imageCount: 25
  },

  {
    id: 4,
    number: 99,
    title: 'ศัตรูคนใหม่',
    imageCount: 24
  },

  {
    id: 5,
    number: 100,
    title: 'บทสรุป',
    imageCount: 30
  }
])

/* =========================
   Sort Chapters
========================= */

const sortedChapters = computed(() => {
  return [...chapters.value].sort(
    (a, b) => b.number - a.number
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
  imageCount: 0
})

/* =========================
   Modal State
========================= */

const showChapterModal = ref(false)

const editingChapterId = ref<number | null>(null)

/* =========================
   File Upload
========================= */

const fileInput =
  ref<HTMLInputElement | null>(null)

const selectedFiles =
  ref<File[]>([])

const previewUrls =
  ref<string[]>([])

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
  if (!mangaForm.title.trim()) {
    return
  }

  if (!mangaForm.author.trim()) {
    return
  }

  manga.title = mangaForm.title.trim()
  manga.author = mangaForm.author.trim()
  manga.category = mangaForm.category.trim()
  manga.status = mangaForm.status
  manga.cover = mangaForm.cover
  manga.description =
    mangaForm.description.trim()
}

/* =========================
   Cover Upload
========================= */

function handleCoverUpload(
  event: Event
) {
  const input =
    event.target as HTMLInputElement

  const file = input.files?.[0]

  if (!file) {
    return
  }

  const url = URL.createObjectURL(file)

  mangaForm.cover = url
}

/* =========================
   Add Chapter
========================= */

function openAddChapterForm() {
  editingChapterId.value = null

  const maxChapter =
    chapters.value.length > 0
      ? Math.max(
          ...chapters.value.map(
            chapter => chapter.number
          )
        )
      : 0

  chapterForm.number =
    Number(
      (maxChapter + 1).toFixed(1)
    )

  chapterForm.title = ''
  chapterForm.imageCount = 0

  selectedFiles.value = []

  clearPreviewUrls()

  showChapterModal.value = true
}

/* =========================
   Edit Chapter
========================= */

function openEditChapterForm(
  chapter: Chapter
) {
  editingChapterId.value = chapter.id

  chapterForm.number =
    chapter.number

  chapterForm.title =
    chapter.title

  chapterForm.imageCount =
    chapter.imageCount

  selectedFiles.value = []

  clearPreviewUrls()

  showChapterModal.value = true
}

/* =========================
   Save Chapter
========================= */

function saveChapter() {
  const number =
    Number(chapterForm.number)

  const title =
    chapterForm.title.trim()

  if (
    !Number.isFinite(number) ||
    number < 1
  ) {
    return
  }

  if (!title) {
    return
  }

  /* =========================
     Check Duplicate Chapter
  ========================= */

  const duplicate =
    chapters.value.some(chapter => {
      if (
        editingChapterId.value !== null &&
        chapter.id ===
          editingChapterId.value
      ) {
        return false
      }

      return chapter.number === number
    })

  if (duplicate) {
    return
  }

  /* =========================
     Edit Existing Chapter
  ========================= */

  if (
    editingChapterId.value !== null
  ) {
    const chapter =
      chapters.value.find(
        item =>
          item.id ===
          editingChapterId.value
      )

    if (!chapter) {
      return
    }

    chapter.number = number
    chapter.title = title

    if (
      selectedFiles.value.length > 0
    ) {
      chapter.imageCount =
        selectedFiles.value.length
    }
  }

  /* =========================
     Add New Chapter
  ========================= */

  else {
    const newId =
      chapters.value.length > 0
        ? Math.max(
            ...chapters.value.map(
              chapter => chapter.id
            )
          ) + 1
        : 1

    const imageCount =
      selectedFiles.value.length > 0
        ? selectedFiles.value.length
        : chapterForm.imageCount

    chapters.value.push({
      id: newId,
      number,
      title,
      imageCount
    })
  }

  closeChapterModal()
}

/* =========================
   Delete Chapter
========================= */

function deleteChapter(
  chapterId: number
) {
  const chapter =
    chapters.value.find(
      item => item.id === chapterId
    )

  if (!chapter) {
    return
  }

  chapters.value =
    chapters.value.filter(
      item => item.id !== chapterId
    )
}

/* =========================
   File Input
========================= */

function triggerFileInput() {
  fileInput.value?.click()
}

/* =========================
   Chapter Images
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

  selectedFiles.value = files

  clearPreviewUrls()

  previewUrls.value =
    files.map(file =>
      URL.createObjectURL(file)
    )

  chapterForm.imageCount =
    files.length
}

/* =========================
   Clear Preview
========================= */

function clearPreviewUrls() {
  previewUrls.value.forEach(url => {
    URL.revokeObjectURL(url)
  })

  previewUrls.value = []
}

/* =========================
   Close Modal
========================= */

function closeChapterModal() {
  showChapterModal.value = false

  editingChapterId.value = null

  chapterForm.number = 1
  chapterForm.title = ''
  chapterForm.imageCount = 0

  selectedFiles.value = []

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

  if (
    mangaForm.cover.startsWith('blob:')
  ) {
    URL.revokeObjectURL(
      mangaForm.cover
    )
  }
})
</script>

<style scoped>
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

.primary-btn:hover {
  background: #6d28d9;
  transform: translateY(-1px);
}

.secondary-btn {
  background: #eeeeee;
  color: #18181b;
}

.secondary-btn:hover {
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
    0 0 0 3px rgba(124, 58, 237, 0.1);
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
  background: rgba(24, 24, 27, 0.65);
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
    0 20px 60px rgba(0, 0, 0, 0.2);
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
  transition: background 0.2s ease;
}

.close-btn:hover {
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