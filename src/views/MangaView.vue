<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useBookshelfStore } from '@/stores/bookshelf'
import { useCustomCategoryStore } from '@/stores/customCategory'
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
const customCategoryStore =
  useCustomCategoryStore()

const mangaService = new MangaService()

/* ========================================
   Current Manga
======================================== */

const mangaId = computed(() => {
  return Number(route.params.id)
})

const manga = computed(() => {
  return mangaService.getMangaById(
    mangaId.value,
  )
})

/* ========================================
   Chapters
======================================== */

const chapterStorageKey = computed(() => {
  return `mangaverse_chapters_${mangaId.value}`
})

const chapters = computed<AdminChapter[]>(() => {
  const saved = localStorage.getItem(
    chapterStorageKey.value,
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
      .map((chapter) => ({
        id: Number(chapter.id),
        number: Number(chapter.number),
        title: String(
          chapter.title ?? '',
        ),
        imageCount: Number(
          chapter.imageCount ?? 0,
        ),
      }))
      .filter(
        (chapter) =>
          Number.isFinite(chapter.id) &&
          Number.isFinite(chapter.number),
      )
      .sort(
        (a, b) =>
          b.number - a.number,
      )
  } catch {
    return []
  }
})

/* ========================================
   Bookshelf
======================================== */

const isInBookshelf = computed(() => {
  return bookshelfStore.isInBookshelf(
    mangaId.value,
  )
})

/* ========================================
   Custom Folder
======================================== */

const showFolderModal = ref(false)

const selectedCategoryId =
  ref<number | null>(null)

/* ========================================
   Navigation
======================================== */

function goHome() {
  router.push('/')
}

/* ========================================
   Read Chapter
======================================== */

function readChapter(
  chapter: number,
) {
  if (!manga.value) {
    return
  }

  bookshelfStore.updateChapter(
    manga.value.id,
    chapter,
  )

  router.push(
    `/manga/${manga.value.id}/chapter/${chapter}`,
  )
}

/* ========================================
   Read Latest Chapter
======================================== */

function readLatest() {
  if (!manga.value) {
    return
  }

  const latestChapter = chapters.value[0]

  if (!latestChapter) {
    return
  }

  readChapter(
    latestChapter.number,
  )
}

/* ========================================
   Add / Remove Bookshelf
======================================== */

function toggleBookshelf() {
  if (!manga.value) {
    return
  }

  if (isInBookshelf.value) {
    bookshelfStore.removeFromBookshelf(
      manga.value.id,
    )

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
   Open Folder Modal
======================================== */

function openFolderModal() {
  if (!manga.value) {
    return
  }

  if (
    customCategoryStore.categories.length ===
    0
  ) {
    window.alert(
      'ยังไม่มีโฟลเดอร์ กรุณาสร้างโฟลเดอร์ในชั้นหนังสือก่อน',
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
  if (!manga.value) {
    return
  }

  if (
    selectedCategoryId.value === null
  ) {
    window.alert(
      'กรุณาเลือกโฟลเดอร์',
    )

    return
  }

  const added =
    customCategoryStore.addMangaToCategory(
      selectedCategoryId.value,
      manga.value.id,
    )

  if (!added) {
    window.alert(
      'มังงะเรื่องนี้มีอยู่ในโฟลเดอร์นี้แล้ว',
    )

    return
  }

  window.alert(
    'เพิ่มมังงะเข้าโฟลเดอร์เรียบร้อยแล้ว',
  )

  closeFolderModal()
}
</script>

<template>
  <div
    v-if="manga"
    class="manga-page"
  >
    <!-- Main -->
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
              <span>
                ผู้เขียน
              </span>

              <strong>
                {{ manga.author }}
              </strong>
            </div>

            <div class="meta-item">
              <span>
                หมวดหมู่
              </span>

              <strong>
                {{ manga.category }}
              </strong>
            </div>

            <div class="meta-item">
              <span>
                สถานะ
              </span>

              <strong>
                {{ manga.status }}
              </strong>
            </div>

            <div class="meta-item">
              <span>
                จำนวนตอน
              </span>

              <strong>
                {{ chapters.length }} ตอน
              </strong>
            </div>

          </div>

          <p class="description">
            {{ manga.description }}
          </p>

          <!-- Actions -->
          <div class="main-actions">

            <button
              type="button"
              class="read-button"
              :disabled="
                chapters.length === 0
              "
              @click="readLatest"
            >
              {{
                chapters.length > 0
                  ? 'อ่านตอนล่าสุด'
                  : 'ยังไม่มีตอน'
              }}
            </button>

            <button
              type="button"
              class="bookshelf-button"
              :class="{
                added: isInBookshelf
              }"
              @click="toggleBookshelf"
            >
              <template
                v-if="isInBookshelf"
              >
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

        <!-- Chapter List -->
        <div
          v-if="chapters.length > 0"
          class="chapter-grid"
        >
          <button
            v-for="chapter in chapters"
            :key="chapter.id"
            type="button"
            class="chapter-button"
            @click="
              readChapter(
                chapter.number,
              )
            "
          >
            <span>
              ตอนที่ {{ chapter.number }}
            </span>

            <small
              v-if="chapter.title"
            >
              {{ chapter.title }}
            </small>
          </button>
        </div>

        <!-- Empty -->
        <div
          v-else
          class="empty-chapter"
        >
          <h3>
            ยังไม่มีตอน
          </h3>

          <p>
            มังงะเรื่องนี้ยังไม่มีตอนให้อ่าน
          </p>
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
              selected:
                selectedCategoryId ===
                folder.id
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
                {{ folder.mangaIds.length }}
                เรื่อง
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
  </div>

  <!-- Not Found -->
  <div
    v-else
    class="not-found"
  >
    <h1>
      ไม่พบมังงะ
    </h1>

    <p>
      ไม่พบมังงะที่มี ID
      {{ mangaId }}
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
   Manga Page
======================================== */

.manga-page {
  min-height: 100vh;
  background: #f7f7f8;
  color: #18181b;
}

/* ========================================
   Main
======================================== */

.main-content {
  width: 86%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 35px 0 70px;
}

/* ========================================
   Back Button
======================================== */

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  padding: 9px 15px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background: #ffffff;
  color: #18181b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.back-button:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  color: #ffffff;
}

/* ========================================
   Manga Detail
======================================== */

.manga-detail {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 45px;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
}

/* ========================================
   Cover
======================================== */

.cover-section {
  width: 100%;
}

.cover-wrapper {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #eeeeee;
  border-radius: 10px;
}

.manga-cover {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* ========================================
   Manga Information
======================================== */

.manga-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-label {
  margin: 0 0 7px;
  color: #7c3aed;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.manga-info h1 {
  margin: 0 0 25px;
  color: #18181b;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
}

/* ========================================
   Meta
======================================== */

.meta-list {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px;
  background: #f7f7f8;
  border-radius: 8px;
}

.meta-item span {
  color: #777777;
  font-size: 12px;
}

.meta-item strong {
  color: #18181b;
  font-size: 14px;
}

/* ========================================
   Description
======================================== */

.description {
  max-width: 700px;
  margin: 0 0 25px;
  color: #555555;
  font-size: 15px;
  line-height: 1.8;
}

/* ========================================
   Main Actions
======================================== */

.main-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.read-button,
.bookshelf-button,
.folder-button {
  min-height: 44px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

/* ========================================
   Read Button
======================================== */

.read-button {
  border: 1px solid #7c3aed;
  background: #7c3aed;
  color: #ffffff;
}

.read-button:hover {
  background: #6d28d9;
  border-color: #6d28d9;
  transform: translateY(-1px);
}

.read-button:disabled {
  background: #d4d4d8;
  border-color: #d4d4d8;
  color: #777777;
  cursor: not-allowed;
  transform: none;
}

/* ========================================
   Bookshelf
======================================== */

.bookshelf-button {
  border: 1px solid #d4d4d8;
  background: #ffffff;
  color: #18181b;
}

.bookshelf-button:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

.bookshelf-button.added {
  border-color: #7c3aed;
  background: #f5f3ff;
  color: #7c3aed;
}

/* ========================================
   Folder Button
======================================== */

.folder-button {
  border: 1px solid #d4d4d8;
  background: #ffffff;
  color: #18181b;
}

.folder-button:hover {
  border-color: #7c3aed;
  background: #f5f3ff;
  color: #7c3aed;
}

/* ========================================
   Chapter Section
======================================== */

.chapter-section {
  margin-top: 45px;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
}

/* ========================================
   Section Heading
======================================== */

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 25px;
}

.section-heading h2 {
  margin: 0;
  color: #18181b;
  font-size: 28px;
  font-weight: 800;
}

.chapter-count {
  color: #777777;
  font-size: 13px;
}

/* ========================================
   Chapter Grid
======================================== */

.chapter-grid {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.chapter-button {
  min-height: 60px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid #e5e5e5;
  border-radius: 7px;
  background: #ffffff;
  color: #18181b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.chapter-button small {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #777777;
  font-size: 11px;
  font-weight: 400;
}

.chapter-button:hover {
  border-color: #7c3aed;
  background: #7c3aed;
  color: #ffffff;
  transform: translateY(-1px);
}

.chapter-button:hover small {
  color: #ffffff;
}

/* ========================================
   Empty Chapter
======================================== */

.empty-chapter {
  padding: 45px 20px;
  text-align: center;
  border: 1px dashed #d4d4d8;
  border-radius: 10px;
  background: #fafafa;
}

.empty-chapter h3 {
  margin: 0 0 8px;
  color: #18181b;
  font-size: 18px;
}

.empty-chapter p {
  margin: 0;
  color: #777777;
  font-size: 14px;
}

/* ========================================
   Folder Modal
======================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.45);
}

.folder-modal {
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.modal-header .section-label {
  margin-bottom: 5px;
}

.modal-header h2 {
  margin: 0;
  color: #18181b;
  font-size: 24px;
}

.modal-close {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: none;
  border-radius: 7px;
  background: #f5f5f5;
  color: #555555;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.modal-close:hover {
  background: #eeeeee;
  color: #18181b;
}

/* ========================================
   Folder List
======================================== */

.folder-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.folder-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 9px;
  background: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.folder-option:hover {
  border-color: #c4b5fd;
  background: #faf9ff;
}

.folder-option.selected {
  border-color: #7c3aed;
  background: #f5f3ff;
}

.folder-option input {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  accent-color: #7c3aed;
}

.folder-option-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #f1ecff;
  color: #7c3aed;
  font-weight: 800;
}

.folder-option-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.folder-option-info strong {
  overflow: hidden;
  color: #18181b;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-option-info span {
  color: #777777;
  font-size: 12px;
}

/* ========================================
   Modal Actions
======================================== */

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.modal-actions button {
  flex: 1;
  min-height: 42px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.modal-cancel {
  border: 1px solid #d4d4d8;
  background: #ffffff;
  color: #555555;
}

.modal-cancel:hover {
  background: #f5f5f5;
}

.modal-confirm {
  border: 1px solid #7c3aed;
  background: #7c3aed;
  color: #ffffff;
}

.modal-confirm:hover {
  background: #6d28d9;
}

/* ========================================
   Footer
======================================== */

.footer {
  margin-top: 20px;
  padding: 35px 0;
  background: #18181b;
  color: #aaaaaa;
}

.footer-inner {
  width: 86%;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-logo {
  color: #ffffff;
  font-size: 25px;
  font-weight: 800;
}

.footer-logo span {
  color: #7c3aed;
}

.footer p {
  margin: 0;
  font-size: 13px;
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
  gap: 12px;
  background: #f7f7f8;
  color: #18181b;
}

.not-found h1 {
  margin: 0;
  font-size: 32px;
}

.not-found p {
  margin: 0;
  color: #777777;
  font-size: 14px;
}

.not-found button {
  margin-top: 10px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.not-found button:hover {
  background: #6d28d9;
}

/* ========================================
   Responsive
======================================== */

@media (max-width: 1000px) {
  .main-content {
    width: 92%;
  }

  .manga-detail {
    grid-template-columns: 240px 1fr;
    gap: 30px;
  }

  .chapter-grid {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
  }
}

/* ========================================
   Tablet
======================================== */

@media (max-width: 750px) {
  .manga-detail {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 25px;
  }

  .cover-section {
    max-width: 280px;
    margin: 0 auto;
  }

  .manga-info h1 {
    font-size: 34px;
  }

  .chapter-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

/* ========================================
   Mobile
======================================== */

@media (max-width: 600px) {
  .main-content {
    width: 92%;
    padding-top: 25px;
  }

  .manga-detail {
    padding: 20px;
  }

  .manga-info h1 {
    font-size: 30px;
  }

  .meta-list {
    grid-template-columns: 1fr;
  }

  .description {
    font-size: 14px;
  }

  .main-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .read-button,
  .bookshelf-button,
  .folder-button {
    width: 100%;
  }

  .chapter-section {
    padding: 20px;
  }

  .section-heading {
    align-items: flex-start;
    gap: 10px;
  }

  .section-heading h2 {
    font-size: 24px;
  }

  .chapter-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .folder-modal {
    padding: 20px;
  }

  .footer-inner {
    width: 92%;
  }
}

/* ========================================
   Small Mobile
======================================== */

@media (max-width: 400px) {
  .manga-info h1 {
    font-size: 27px;
  }

  .chapter-grid {
    grid-template-columns: 1fr;
  }

  .chapter-button {
    min-height: 40px;
  }
}</style>