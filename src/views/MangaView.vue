<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookshelfStore } from '@/stores/bookshelf'
import { useCustomCategoryStore } from '@/stores/customCategory'
import { useAuthStore } from '@/stores/auth'
import { useReadingHistoryStore } from '@/stores/readingHistory'
import { MangaService } from '@/services/mangaService'

interface AdminChapter {
  id: number
  number: number
  title: string
  imageCount: number
}

const route = useRoute()
const router = useRouter()
const bookshelfStore = useBookshelfStore()
const customCategoryStore = useCustomCategoryStore()
const authStore = useAuthStore()
const readingHistoryStore = useReadingHistoryStore()
const mangaService = new MangaService()

/* ========================================
   Load Reading History
======================================== */
readingHistoryStore.load()

/* ========================================
   Current Manga
======================================== */
const mangaId = computed(() => Number(route.params.id))

const manga = computed(() => {
  return mangaService.getMangaById(mangaId.value)
})

/* ========================================
   Chapters
======================================== */
const chapterStorageKey = computed(() => {
  return `mangaverse_chapters_${mangaId.value}`
})

const chapters = computed<AdminChapter[]>(() => {
  const saved = localStorage.getItem(chapterStorageKey.value)

  if (!saved) {
    return []
  }

  try {
    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((chapter) => ({
        id: Number(chapter.id),
        number: Number(chapter.number),
        title: String(chapter.title ?? ''),
        imageCount: Number(chapter.imageCount ?? 0),
      }))
      .filter(
        (chapter) =>
          Number.isFinite(chapter.id) &&
          Number.isFinite(chapter.number),
      )
      .sort((a, b) => b.number - a.number)
  } catch {
    return []
  }
})

/* ========================================
   Last Reading History
======================================== */
const lastReadingHistory = computed(() => {
  if (!authStore.isLoggedIn) {
    return undefined
  }

  if (authStore.userId <= 0) {
    return undefined
  }

  return readingHistoryStore.getLastChapter(
    authStore.userId,
    mangaId.value,
  )
})

/* ========================================
   Last Read Chapter
======================================== */
const lastReadChapter = computed(() => {
  const history = lastReadingHistory.value

  if (!history) {
    return undefined
  }

  return chapters.value.find(
    (chapter) => chapter.id === history.chapterId,
  )
})

/* ========================================
   Read Button Text
======================================== */
const readButtonText = computed(() => {
  if (lastReadChapter.value) {
    return `อ่านต่อ ตอนที่ ${lastReadChapter.value.number}`
  }

  if (chapters.value.length > 0) {
    return 'อ่านตอนล่าสุด'
  }

  return 'ยังไม่มีตอน'
})

/* ========================================
   Bookshelf
======================================== */
const isInBookshelf = computed(() => {
  if (!authStore.isLoggedIn) {
    return false
  }

  return bookshelfStore.isInBookshelf(mangaId.value)
})

/* ========================================
   Custom Folder & Message Modal
======================================== */
const showFolderModal = ref(false)
const showMessageModal = ref(false)

const messageModalTitle = ref('')
const messageModalText = ref('')
const messageModalAction = ref<'close' | 'bookshelf'>('close')

const selectedCategoryId = ref<number | null>(null)

/* ========================================
   Navigation
======================================== */
function goHome() {
  router.push('/')
}

function goToLogin() {
  router.push('/login')
}

/* ========================================
   Read Chapter
======================================== */
function readChapter(chapter: number) {
  if (!manga.value) {
    return
  }

  // อนุญาตให้อ่านได้ แต่บันทึกความคืบหน้า
  // ลงชั้นหนังสือเฉพาะผู้ที่เข้าสู่ระบบแล้ว
  if (authStore.isLoggedIn) {
    bookshelfStore.updateChapter(
      manga.value.id,
      chapter,
    )
  }

  router.push(
    `/manga/${manga.value.id}/chapter/${chapter}`,
  )
}

/* ========================================
   Read Latest / Continue Reading
======================================== */
function readLatest() {
  if (!manga.value) {
    return
  }

  if (lastReadChapter.value) {
    readChapter(lastReadChapter.value.number)
    return
  }

  const latestChapter = chapters.value[0]

  if (!latestChapter) {
    return
  }

  readChapter(latestChapter.number)
}

/* ========================================
   Add / Remove Bookshelf
======================================== */
function toggleBookshelf() {
  // ป้องกันผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ
  if (!authStore.isLoggedIn) {
    goToLogin()
    return
  }

  if (!manga.value) {
    return
  }

  if (isInBookshelf.value) {
    bookshelfStore.removeFromBookshelf(manga.value.id)
    return
  }

  bookshelfStore.addToBookshelf({
    id: manga.value.id,
    title: manga.value.title,
    cover: manga.value.cover,
    chapter: 1,
  })
}

/* ========================================
   Message Modal
======================================== */
function openMessageModal(
  title: string,
  message: string,
  action: 'close' | 'bookshelf' = 'close',
) {
  messageModalTitle.value = title
  messageModalText.value = message
  messageModalAction.value = action
  showMessageModal.value = true
}

function closeMessageModal() {
  showMessageModal.value = false
}

function handleMessageModalAction() {
  const action = messageModalAction.value

  closeMessageModal()

  if (action === 'bookshelf') {
    router.push('/bookshelf')
  }
}

/* ========================================
   Open Folder Modal
======================================== */
function openFolderModal() {
  // ต้องเข้าสู่ระบบก่อนจึงจะใช้งานโฟลเดอร์ได้
  if (!authStore.isLoggedIn) {
    goToLogin()
    return
  }

  if (!manga.value) {
    return
  }

  if (customCategoryStore.categories.length === 0) {
    openMessageModal(
      'ยังไม่มีโฟลเดอร์',
      'กรุณาสร้างโฟลเดอร์ในชั้นหนังสือก่อน',
      'bookshelf',
    )
    return
  }

  selectedCategoryId.value = null
  showFolderModal.value = true
}

/* ========================================
   Close Folder Modal
======================================== */
function closeFolderModal() {
  showFolderModal.value = false
  selectedCategoryId.value = null
}

/* ========================================
   Add Manga To Folder
======================================== */
function addMangaToFolder() {
  // ตรวจสอบซ้ำอีกครั้งก่อนเพิ่มข้อมูล
  if (!authStore.isLoggedIn) {
    closeFolderModal()
    goToLogin()
    return
  }

  if (!manga.value) {
    return
  }

  if (selectedCategoryId.value === null) {
    openMessageModal(
      'กรุณาเลือกโฟลเดอร์',
      'กรุณาเลือกโฟลเดอร์ที่ต้องการเพิ่มมังงะก่อน',
    )
    return
  }

  const added = customCategoryStore.addMangaToCategory(
    selectedCategoryId.value,
    manga.value.id,
  )

  if (!added) {
    openMessageModal(
      'มังงะอยู่ในโฟลเดอร์แล้ว',
      'มังงะเรื่องนี้มีอยู่ในโฟลเดอร์นี้แล้ว',
    )
    return
  }

  closeFolderModal()

  openMessageModal(
    'เพิ่มมังงะสำเร็จ',
    'เพิ่มมังงะเข้าโฟลเดอร์เรียบร้อยแล้ว',
  )
}
</script>

<template>
  <div
    v-if="manga"
    class="manga-page"
  >
    <main class="main-content">
      <!-- Back -->
      <button
        type="button"
        class="back-button"
        @click="goHome"
      >
        ← กลับหน้าแรก
      </button>

      <!-- Manga Detail -->
      <section class="manga-detail">
        <!-- Cover -->
        <div class="cover-section">
          <div class="cover-wrapper">
            <img
              :src="manga.cover"
              :alt="manga.title"
              class="manga-cover"
            />
          </div>
        </div>

        <!-- Information -->
        <div class="manga-info">
          <p class="section-label">
            MANGA DETAIL
          </p>

          <h1>
            {{ manga.title }}
          </h1>

          <div class="meta-list">
            <div class="meta-item">
              <span>ผู้เขียน</span>
              <strong>{{ manga.author }}</strong>
            </div>

            <div class="meta-item">
              <span>หมวดหมู่</span>
              <strong>{{ manga.category }}</strong>
            </div>

            <div class="meta-item">
              <span>สถานะ</span>
              <strong>{{ manga.status }}</strong>
            </div>

            <div class="meta-item">
              <span>จำนวนตอน</span>
              <strong>{{ chapters.length }} ตอน</strong>
            </div>
          </div>

          <p class="description">
            {{ manga.description }}
          </p>

          <!-- Main Buttons -->
          <div class="main-actions">
            <button
              type="button"
              class="read-button"
              :disabled="chapters.length === 0"
              @click="readLatest"
            >
              {{ readButtonText }}
            </button>

            <button
              type="button"
              class="bookshelf-button"
              :class="{ added: isInBookshelf }"
              @click="toggleBookshelf"
            >
              <template v-if="isInBookshelf">
                ✓ อยู่ในชั้นหนังสือ
              </template>
              <template v-else>
                ＋ เพิ่มเข้าชั้นหนังสือ
              </template>
            </button>

            <button
              type="button"
              class="folder-button"
              @click="openFolderModal"
            >
              ＋ เพิ่มเข้าโฟลเดอร์
            </button>
          </div>
        </div>
      </section>

      <!-- Chapters -->
      <section class="chapter-section">
        <div class="section-heading">
          <div>
            <p class="section-label">
              CHAPTERS
            </p>

            <h2>
              รายชื่อตอน
            </h2>
          </div>

          <span class="chapter-count">
            {{ chapters.length }} ตอน
          </span>
        </div>

        <div
          v-if="chapters.length > 0"
          class="chapter-grid"
        >
          <button
            v-for="chapter in chapters"
            :key="chapter.id"
            type="button"
            class="chapter-button"
            @click="readChapter(chapter.number)"
          >
            <span>
              ตอนที่ {{ chapter.number }}
            </span>

            <small v-if="chapter.title">
              {{ chapter.title }}
            </small>
          </button>
        </div>

        <div
          v-else
          class="empty-chapter"
        >
          <h3>ยังไม่มีตอน</h3>
          <p>มังงะเรื่องนี้ยังไม่มีตอนให้อ่าน</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo">
          Manga<span>Verse</span>
        </div>

        <p>
          MangaVerse — Online Manga Reading System
        </p>
      </div>
    </footer>

    <!-- Folder Modal -->
    <div
      v-if="showFolderModal"
      class="modal-overlay"
      @click.self="closeFolderModal"
    >
      <div class="folder-modal">
        <div class="modal-header">
          <div>
            <p class="section-label">
              ADD TO FOLDER
            </p>

            <h2>
              เลือกโฟลเดอร์
            </h2>
          </div>

          <button
            type="button"
            class="modal-close"
            aria-label="ปิด"
            @click="closeFolderModal"
          >
            ×
          </button>
        </div>

        <div class="folder-list">
          <label
            v-for="folder in customCategoryStore.categories"
            :key="folder.id"
            class="folder-option"
            :class="{
              selected: selectedCategoryId === folder.id,
            }"
          >
            <input
              v-model="selectedCategoryId"
              type="radio"
              name="folder"
              :value="folder.id"
            />

            <div class="folder-option-icon">
              F
            </div>

            <div class="folder-option-info">
              <strong>
                {{ folder.name }}
              </strong>

              <span>
                {{ folder.mangaIds.length }} เรื่อง
              </span>
            </div>
          </label>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="modal-cancel"
            @click="closeFolderModal"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            class="modal-confirm"
            @click="addMangaToFolder"
          >
            เพิ่มเข้าโฟลเดอร์
          </button>
        </div>
      </div>
    </div>

    <!-- Message Modal -->
    <div
      v-if="showMessageModal"
      class="modal-overlay message-modal-overlay"
      @click.self="closeMessageModal"
    >
      <div
        class="message-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="messageModalTitle"
      >
        <div class="message-modal-icon">
          F
        </div>

        <h2>
          {{ messageModalTitle }}
        </h2>

        <p>
          {{ messageModalText }}
        </p>

        <div class="message-modal-actions">
          <button
            v-if="messageModalAction === 'bookshelf'"
            type="button"
            class="message-modal-cancel"
            @click="closeMessageModal"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            class="message-modal-confirm"
            @click="handleMessageModalAction"
          >
            {{
              messageModalAction === 'bookshelf'
                ? 'ไปสร้างโฟลเดอร์'
                : 'ตกลง'
            }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div
    v-else
    class="not-found"
  >
    <h1>ไม่พบมังงะ</h1>

    <p>
      ไม่พบมังงะที่มี ID {{ mangaId }}
    </p>

    <button
      type="button"
      @click="goHome"
    >
      กลับหน้าแรก
    </button>
  </div>
</template>

<style scoped>
/* ========================================
   Page
======================================== */
.manga-page {
  min-height: 100vh;
  background: #f7f7f9;
  color: #171717;
}

/* ========================================
   Main
======================================== */
.main-content {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 70px;
}

/* ========================================
   Back Button
======================================== */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #555;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 0;
  margin-bottom: 24px;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.back-button:hover {
  color: #7138df;
  transform: translateX(-3px);
}

/* ========================================
   Manga Detail
======================================== */
.manga-detail {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 55px;
  background: #fff;
  border: 1px solid #e8e8ed;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.05);
}

/* ========================================
   Cover
======================================== */
.cover-section {
  display: flex;
  justify-content: center;
}

.cover-wrapper {
  width: 100%;
  max-width: 340px;
  overflow: hidden;
  border-radius: 18px;
  background: #eee;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.15);
}

.manga-cover {
  display: block;
  width: 100%;
  height: 480px;
  object-fit: cover;
}

/* ========================================
   Information
======================================== */
.manga-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-label {
  margin: 0 0 10px;
  color: #7138df;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
}

.manga-info h1 {
  margin: 0 0 25px;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.1;
  color: #151515;
}

/* ========================================
   Meta
======================================== */
.meta-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 25px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  background: #f7f5fc;
  border-radius: 12px;
}

.meta-item span {
  color: #777;
  font-size: 13px;
}

.meta-item strong {
  color: #222;
  font-size: 15px;
}

/* ========================================
   Description
======================================== */
.description {
  margin: 0 0 30px;
  color: #666;
  font-size: 15px;
  line-height: 1.8;
}

/* ========================================
   Main Actions
======================================== */
.main-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.main-actions button {
  min-height: 46px;
  border-radius: 12px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.main-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.main-actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Read */
.read-button {
  border: none;
  background: #7138df;
  color: #fff;
  box-shadow: 0 8px 20px rgba(113, 56, 223, 0.25);
}

.read-button:hover:not(:disabled) {
  background: #6027cf;
}

/* Bookshelf */
.bookshelf-button {
  border: 1px solid #7138df;
  background: #fff;
  color: #7138df;
}

.bookshelf-button.added {
  background: #f1ebff;
}

/* Folder */
.folder-button {
  border: 1px solid #ddd;
  background: #fff;
  color: #444;
}

.folder-button:hover {
  border-color: #7138df;
  color: #7138df;
}

/* ========================================
   Chapters
======================================== */
.chapter-section {
  margin-top: 45px;
  background: #fff;
  border: 1px solid #e8e8ed;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.04);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.section-heading h2 {
  margin: 0;
  font-size: 30px;
}

.chapter-count {
  color: #777;
  font-size: 14px;
  font-weight: 600;
}

/* ========================================
   Chapter Grid
======================================== */
.chapter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.chapter-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-height: 75px;
  padding: 17px;
  border: 1px solid #e5e5ea;
  border-radius: 14px;
  background: #fff;
  color: #222;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.chapter-button:hover {
  border-color: #7138df;
  background: #faf8ff;
  transform: translateY(-2px);
  box-shadow: 0 7px 18px rgba(0, 0, 0, 0.06);
}

.chapter-button span {
  font-size: 15px;
  font-weight: 800;
}

.chapter-button small {
  max-width: 100%;
  overflow: hidden;
  color: #888;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ========================================
   Empty Chapter
======================================== */
.empty-chapter {
  padding: 50px 20px;
  border: 1px dashed #ddd;
  border-radius: 16px;
  text-align: center;
}

.empty-chapter h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.empty-chapter p {
  margin: 0;
  color: #888;
}

/* ========================================
   Footer
======================================== */
.footer {
  border-top: 1px solid #e5e5e5;
  background: #fff;
}

.footer-inner {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.footer-logo {
  font-size: 22px;
  font-weight: 900;
}

.footer-logo span {
  color: #7138df;
}

.footer-inner p {
  margin: 0;
  color: #888;
  font-size: 13px;
}

/* ========================================
   Modal
======================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
}

.folder-modal {
  width: min(500px, 100%);
  max-height: 85vh;
  overflow: auto;
  background: #fff;
  border-radius: 22px;
  padding: 28px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.modal-header h2 {
  margin: 0;
  font-size: 25px;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f2f2f2;
  color: #555;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.modal-close:hover {
  background: #e9e9e9;
}

/* Folder List */
.folder-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
}

.folder-option {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.folder-option:hover {
  border-color: #b9a2ee;
}

.folder-option.selected {
  border-color: #7138df;
  background: #f7f2ff;
}

.folder-option input {
  width: 17px;
  height: 17px;
  accent-color: #7138df;
}

.folder-option-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: #eee7ff;
  color: #7138df;
  font-weight: 800;
}

.folder-option-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.folder-option-info strong {
  font-size: 14px;
}

.folder-option-info span {
  color: #888;
  font-size: 12px;
}

/* Modal Buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions button {
  min-height: 42px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.modal-cancel {
  border: 1px solid #ddd;
  background: #fff;
  color: #555;
}

.modal-confirm {
  border: none;
  background: #7138df;
  color: #fff;
}

.modal-confirm:hover {
  background: #6027cf;
}

/* ========================================
   Message Modal
======================================== */
.message-modal-overlay {
  z-index: 1100;
}

.message-modal {
  width: min(430px, 100%);
  padding: 30px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 22px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.message-modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #f1ecff;
  color: #7138df;
  font-size: 26px;
  font-weight: 800;
}

.message-modal h2 {
  margin: 0 0 10px;
  color: #18181b;
  font-size: 23px;
  font-weight: 800;
}

.message-modal p {
  margin: 0 0 24px;
  color: #777;
  font-size: 14px;
  line-height: 1.7;
}

.message-modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.message-modal-actions button {
  min-height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.message-modal-cancel {
  border: 1px solid #ddd;
  background: #fff;
  color: #555;
}

.message-modal-cancel:hover {
  background: #f5f5f5;
}

.message-modal-confirm {
  border: 1px solid #7138df;
  background: #7138df;
  color: #fff;
}

.message-modal-confirm:hover {
  border-color: #6027cf;
  background: #6027cf;
}

/* ========================================
   Not Found
======================================== */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 30px;
  background: #f7f7f9;
  text-align: center;
}

.not-found h1 {
  margin: 0;
  font-size: 40px;
}

.not-found p {
  margin: 0;
  color: #777;
}

.not-found button {
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  background: #7138df;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

/* ========================================
   Responsive
======================================== */
@media (max-width: 900px) {
  .manga-detail {
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 30px;
    padding: 25px;
  }

  .manga-cover {
    height: 390px;
  }

  .chapter-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .main-content {
    width: min(100% - 24px, 600px);
    padding-top: 18px;
  }

  .manga-detail {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 20px;
  }

  .cover-wrapper {
    max-width: 280px;
  }

  .manga-cover {
    height: 390px;
  }

  .manga-info h1 {
    font-size: 34px;
  }

  .meta-list {
    grid-template-columns: 1fr;
  }

  .main-actions {
    flex-direction: column;
  }

  .main-actions button {
    width: 100%;
  }

  .chapter-section {
    padding: 20px;
  }

  .chapter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 430px) {
  .chapter-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>