<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// =========================
// Type
// =========================

type MangaStatus = 'กำลังดำเนินเรื่อง' | 'จบแล้ว'

interface Manga {
  id: number
  title: string
  author: string
  category: string
  status: MangaStatus
  description: string
  cover: string
  latestChapter: number
}

// =========================
// Storage
// =========================

const STORAGE_KEY = 'mangaverse_manga'

const defaultMangaList: Manga[] = [
  {
    id: 1,
    title: 'One Piece',
    author: 'Eiichiro Oda',
    category: 'Action',
    status: 'กำลังดำเนินเรื่อง',
    description:
      'เรื่องราวของการผจญภัยของลูฟี่และกลุ่มโจรสลัดหมวกฟาง',
    cover:
      'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600',
    latestChapter: 100,
  },
  {
    id: 2,
    title: 'Solo Leveling',
    author: 'Chugong',
    category: 'Fantasy',
    status: 'จบแล้ว',
    description:
      'เรื่องราวของซองจินอู ผู้ที่เริ่มต้นจากนักล่าที่อ่อนแอที่สุด',
    cover:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
    latestChapter: 100,
  },
  {
    id: 3,
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    category: 'Action',
    status: 'จบแล้ว',
    description:
      'เรื่องราวของนินจาหนุ่มนารูโตะที่ต้องการเป็นโฮคาเงะ',
    cover:
      'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600',
    latestChapter: 100,
  },
  {
    id: 4,
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    category: 'Action',
    status: 'จบแล้ว',
    description:
      'เรื่องราวของทันจิโร่ที่ออกเดินทางเพื่อช่วยน้องสาว',
    cover:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
    latestChapter: 100,
  },
]

// =========================
// Load / Save
// =========================

function loadManga(): Manga[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultMangaList),
    )

    return [...defaultMangaList]
  }

  try {
    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return [...defaultMangaList]
    }

    return parsed
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultMangaList),
    )

    return [...defaultMangaList]
  }
}

const mangaList = ref<Manga[]>(loadManga())

function saveManga() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(mangaList.value),
  )
}

// =========================
// Search
// =========================

const searchText = ref('')

const filteredManga = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()

  if (!keyword) {
    return mangaList.value
  }

  return mangaList.value.filter((manga) => {
    return (
      manga.title.toLowerCase().includes(keyword) ||
      manga.author.toLowerCase().includes(keyword) ||
      manga.category.toLowerCase().includes(keyword)
    )
  })
})

// =========================
// Statistics
// =========================

const mangaTotal = computed(() => {
  return mangaList.value.length
})

const totalChapters = computed(() => {
  return mangaList.value.reduce(
    (total, manga) => total + manga.latestChapter,
    0,
  )
})

const ongoingTotal = computed(() => {
  return mangaList.value.filter(
    (manga) => manga.status === 'กำลังดำเนินเรื่อง',
  ).length
})

const completedTotal = computed(() => {
  return mangaList.value.filter(
    (manga) => manga.status === 'จบแล้ว',
  ).length
})

// =========================
// Modal
// =========================

const showAddModal = ref(false)

const form = reactive<{
  title: string
  author: string
  category: string
  status: MangaStatus
  cover: string
  description: string
}>({
  title: '',
  author: '',
  category: '',
  status: 'กำลังดำเนินเรื่อง',
  cover: '',
  description: '',
})

// =========================
// Toast
// =========================

const showToast = ref(false)
const toastMessage = ref('')

function toast(message: string) {
  toastMessage.value = message
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2500)
}

// =========================
// Modal Functions
// =========================

function openAddModal() {
  form.title = ''
  form.author = ''
  form.category = ''
  form.status = 'กำลังดำเนินเรื่อง'
  form.cover = ''
  form.description = ''

  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}

// =========================
// Add Manga
// =========================

function addManga() {
  if (!form.title.trim()) {
    toast('กรุณากรอกชื่อมังงะ')
    return
  }

  if (!form.author.trim()) {
    toast('กรุณากรอกชื่อผู้แต่ง')
    return
  }

  if (!form.category.trim()) {
    toast('กรุณากรอกหมวดหมู่')
    return
  }

  const newManga: Manga = {
    id: Date.now(),
    title: form.title.trim(),
    author: form.author.trim(),
    category: form.category.trim(),
    status: form.status,
    cover:
      form.cover.trim() ||
      'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600',
    description: form.description.trim(),
    latestChapter: 0,
  }

  mangaList.value.push(newManga)

  saveManga()

  closeAddModal()

  toast('เพิ่มมังงะเรียบร้อยแล้ว')
}

// =========================
// Manage Manga
// =========================

function manageManga(id: number) {
  router.push(`/admin/manga/${id}`)
}

// =========================
// Delete Manga
// =========================

function deleteManga(id: number) {
  const manga = mangaList.value.find(
    (item) => item.id === id,
  )

  if (!manga) {
    return
  }

  const confirmDelete = window.confirm(
    `ต้องการลบ "${manga.title}" หรือไม่?`,
  )

  if (!confirmDelete) {
    return
  }

  mangaList.value = mangaList.value.filter(
    (item) => item.id !== id,
  )

  saveManga()

  toast('ลบมังงะเรียบร้อยแล้ว')
}

// =========================
// Navigation
// =========================

function backToWebsite() {
  router.push('/')
}
</script>

<template>
  <div class="admin-page">

    <!-- =========================
         Admin Header
    ========================== -->

    <header class="admin-header">
      <div class="header-inner">

        <div class="brand">
          <div class="brand-name">
            Manga<span>Verse</span>
          </div>

          <div class="admin-badge">
            ADMIN
          </div>
        </div>

        <button
          type="button"
          class="back-button"
          @click="backToWebsite"
        >
          ← กลับเว็บไซต์
        </button>

      </div>
    </header>

    <!-- =========================
         Main
    ========================== -->

    <main class="admin-main">

      <!-- Page Header -->

      <section class="page-header">

        <div>
          <p class="section-label">
            MANGAVERSE ADMIN
          </p>

          <h1>
            จัดการมังงะ
          </h1>

          <p class="page-description">
            เพิ่ม แก้ไข และจัดการข้อมูลมังงะภายในระบบ
          </p>
        </div>

        <button
          type="button"
          class="add-button"
          @click="openAddModal"
        >
          <span>＋</span>
          เพิ่มมังงะ
        </button>

      </section>

      <!-- =========================
           Statistics
      ========================== -->

      <section class="stats-grid">

        <div class="stat-card">
          <div class="stat-icon">
            M
          </div>

          <div>
            <p>มังงะทั้งหมด</p>
            <strong>{{ mangaTotal }}</strong>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            C
          </div>

          <div>
            <p>จำนวนตอน</p>
            <strong>{{ totalChapters }}</strong>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            O
          </div>

          <div>
            <p>กำลังดำเนินเรื่อง</p>
            <strong>{{ ongoingTotal }}</strong>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            ✓
          </div>

          <div>
            <p>จบแล้ว</p>
            <strong>{{ completedTotal }}</strong>
          </div>
        </div>

      </section>

      <!-- =========================
           Search
      ========================== -->

      <section class="toolbar">

        <div class="search-box">

          <span class="search-icon">
            🔍
          </span>

          <input
            v-model="searchText"
            type="text"
            placeholder="ค้นหาชื่อมังงะ ผู้แต่ง หรือหมวดหมู่..."
          />

        </div>

      </section>

      <!-- =========================
           Manga List
      ========================== -->

      <section class="manga-section">

        <div class="section-heading">

          <div>
            <h2>
              รายการมังงะ
            </h2>

            <p>
              มังงะที่อยู่ในระบบทั้งหมด
            </p>
          </div>

          <span class="result-count">
            {{ filteredManga.length }} รายการ
          </span>

        </div>

        <!-- Empty -->

        <div
          v-if="filteredManga.length === 0"
          class="empty-state"
        >

          <div class="empty-icon">
            📚
          </div>

          <h3>
            ไม่พบมังงะ
          </h3>

          <p>
            ลองเปลี่ยนคำค้นหาใหม่
          </p>

        </div>

        <!-- List -->

        <div
          v-else
          class="manga-list"
        >

          <article
            v-for="manga in filteredManga"
            :key="manga.id"
            class="manga-card"
          >

            <!-- Cover -->

            <div class="cover-wrapper">

              <img
                :src="manga.cover"
                :alt="manga.title"
                class="manga-cover"
              />

            </div>

            <!-- Information -->

            <div class="manga-info">

              <div class="manga-top">

                <div>
                  <h3>
                    {{ manga.title }}
                  </h3>

                  <p class="author">
                    {{ manga.author }}
                  </p>
                </div>

                <span
                  class="status-badge"
                  :class="{
                    ongoing:
                      manga.status === 'กำลังดำเนินเรื่อง',
                    completed:
                      manga.status === 'จบแล้ว',
                  }"
                >
                  {{ manga.status }}
                </span>

              </div>

              <div class="manga-meta">

                <span>
                  หมวดหมู่: {{ manga.category }}
                </span>

                <span>
                  ตอนล่าสุด:
                  {{ manga.latestChapter || 0 }}
                </span>

              </div>

              <p class="description">
                {{ manga.description || 'ยังไม่มีรายละเอียด' }}
              </p>

              <!-- Actions -->

              <div class="card-actions">

                <button
                  type="button"
                  class="manage-button"
                  @click="manageManga(manga.id)"
                >
                  จัดการตอน
                </button>

                <button
                  type="button"
                  class="delete-button"
                  @click="deleteManga(manga.id)"
                >
                  ลบ
                </button>

              </div>

            </div>

          </article>

        </div>

      </section>

    </main>

    <!-- =========================
         Add Manga Modal
    ========================== -->

    <div
      v-if="showAddModal"
      class="modal-overlay"
      @click.self="closeAddModal"
    >

      <div class="modal">

        <div class="modal-header">

          <div>

            <p class="section-label">
              NEW MANGA
            </p>

            <h2>
              เพิ่มมังงะใหม่
            </h2>

          </div>

          <button
            type="button"
            class="close-button"
            @click="closeAddModal"
          >
            ×
          </button>

        </div>

        <!-- Form -->

        <form
          class="manga-form"
          @submit.prevent="addManga"
        >

          <!-- Title -->

          <div class="form-group">

            <label>
              ชื่อมังงะ
              <span>*</span>
            </label>

            <input
              v-model="form.title"
              type="text"
              placeholder="เช่น One Piece"
            />

          </div>

          <!-- Author -->

          <div class="form-group">

            <label>
              ผู้แต่ง
              <span>*</span>
            </label>

            <input
              v-model="form.author"
              type="text"
              placeholder="ชื่อผู้แต่ง"
            />

          </div>

          <!-- Category -->

          <div class="form-group">

            <label>
              หมวดหมู่
              <span>*</span>
            </label>

            <input
              v-model="form.category"
              type="text"
              placeholder="เช่น Action"
            />

          </div>

          <!-- Status -->

          <div class="form-group">

            <label>
              สถานะ
            </label>

            <select v-model="form.status">

              <option value="กำลังดำเนินเรื่อง">
                กำลังดำเนินเรื่อง
              </option>

              <option value="จบแล้ว">
                จบแล้ว
              </option>

            </select>

          </div>

          <!-- Cover -->

          <div class="form-group">

            <label>
              URL รูปปก
            </label>

            <input
              v-model="form.cover"
              type="text"
              placeholder="https://..."
            />

          </div>

          <!-- Description -->

          <div class="form-group">

            <label>
              รายละเอียด
            </label>

            <textarea
              v-model="form.description"
              rows="4"
              placeholder="รายละเอียดของมังงะ"
            ></textarea>

          </div>

          <!-- Buttons -->

          <div class="modal-actions">

            <button
              type="button"
              class="cancel-button"
              @click="closeAddModal"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              class="save-button"
            >
              บันทึกมังงะ
            </button>

          </div>

        </form>

      </div>

    </div>

    <!-- =========================
         Toast
    ========================== -->

    <Transition name="toast">

      <div
        v-if="showToast"
        class="toast"
      >

        <span class="toast-check">
          ✓
        </span>

        {{ toastMessage }}

      </div>

    </Transition>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* =========================
   Theme
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
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-name {
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand-name span {
  color: #d4d4d8;
}

.admin-badge {
  padding: 5px 10px;
  border-radius: 6px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.back-button {
  border: 1px solid #71717a;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease,
    border-color 0.2s ease;
  padding: 9px 14px;
  border-radius: 8px;
}

.back-button:hover {
  background: #27272a;
  border-color: #a1a1aa;
}

/* =========================
   Main
========================= */

.admin-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 42px 32px 80px;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}

.section-label {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #7c3aed;
}

.page-header h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -1px;
}

.page-description {
  margin: 10px 0 0;
  color: #777777;
  font-size: 15px;
}

/* =========================
   Add Button
========================= */

.add-button {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: transform 0.2s ease,
    background 0.2s ease;
}

.add-button:hover {
  background: #6d28d9;
  transform: translateY(-1px);
}

.add-button span {
  font-size: 19px;
}

/* =========================
   Stats
========================= */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eeeeee;
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
}

.stat-card p {
  margin: 0 0 4px;
  color: #777777;
  font-size: 12px;
}

.stat-card strong {
  font-size: 25px;
  color: #18181b;
}

/* =========================
   Toolbar
========================= */

.toolbar {
  margin-bottom: 24px;
}

.search-box {
  width: 100%;
  max-width: 550px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.search-icon {
  font-size: 14px;
  margin-right: 8px;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  padding: 13px 0;
  background: transparent;
  color: #18181b;
  font-size: 14px;
}

.search-box input::placeholder {
  color: #a1a1aa;
}

/* =========================
   Manga Section
========================= */

.manga-section {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 14px;
  padding: 26px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0 0 5px;
  font-size: 20px;
}

.section-heading p {
  margin: 0;
  color: #777777;
  font-size: 13px;
}

.result-count {
  color: #777777;
  font-size: 13px;
}

/* =========================
   Manga List
========================= */

.manga-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.manga-card {
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 20px;
  transition: border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.manga-card:hover {
  border-color: #c4b5fd;
  box-shadow: 0 5px 20px rgba(24, 24, 27, 0.06);
}

.cover-wrapper {
  width: 110px;
  min-width: 110px;
  height: 145px;
  overflow: hidden;
  border-radius: 8px;
  background: #eeeeee;
}

.manga-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.manga-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.manga-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.manga-top h3 {
  margin: 0 0 5px;
  font-size: 20px;
  color: #18181b;
}

.author {
  margin: 0;
  color: #777777;
  font-size: 13px;
}

.status-badge {
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.status-badge.ongoing {
  background: #ede9fe;
  color: #6d28d9;
}

.status-badge.completed {
  background: #eeeeee;
  color: #555555;
}

.manga-meta {
  display: flex;
  gap: 22px;
  margin-top: 15px;
  color: #666666;
  font-size: 12px;
}

.description {
  margin: 12px 0 18px;
  color: #777777;
  font-size: 13px;
  line-height: 1.6;
  max-width: 800px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.manage-button,
.delete-button {
  border: none;
  border-radius: 7px;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.manage-button {
  background: #7c3aed;
  color: #ffffff;
}

.manage-button:hover {
  background: #6d28d9;
}

.delete-button {
  background: #eeeeee;
  color: #555555;
}

.delete-button:hover {
  background: #e5e5e5;
}

/* =========================
   Empty
========================= */

.empty-state {
  text-align: center;
  padding: 70px 20px;
  color: #777777;
}

.empty-icon {
  font-size: 35px;
  margin-bottom: 12px;
}

.empty-state h3 {
  margin: 0 0 5px;
  color: #18181b;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

/* =========================
   Modal
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(24, 24, 27, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(24, 24, 27, 0.25);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 25px;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #18181b;
}

.close-button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: #eeeeee;
  color: #18181b;
  font-size: 22px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: #e5e5e5;
}

/* =========================
   Form
========================= */

.manga-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
}

.form-group label span {
  color: #7c3aed;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 11px 12px;
  background: #ffffff;
  color: #18181b;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #a1a1aa;
}

/* =========================
   Modal Actions
========================= */

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 8px;
}

.cancel-button,
.save-button {
  border: none;
  border-radius: 8px;
  padding: 11px 17px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.cancel-button {
  background: #eeeeee;
  color: #555555;
}

.cancel-button:hover {
  background: #e5e5e5;
}

.save-button {
  background: #7c3aed;
  color: #ffffff;
}

.save-button:hover {
  background: #6d28d9;
}

/* =========================
   Toast
========================= */

.toast {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 200;
  background: #18181b;
  color: #ffffff;
  padding: 13px 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  box-shadow: 0 8px 30px rgba(24, 24, 27, 0.2);
}

.toast-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #7c3aed;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* =========================
   Responsive
========================= */

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .header-inner {
    padding: 15px 18px;
  }

  .admin-main {
    padding: 30px 18px 60px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 30px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .manga-section {
    padding: 18px;
  }

  .manga-card {
    flex-direction: column;
  }

  .cover-wrapper {
    width: 100%;
    height: 220px;
  }

  .manga-top {
    flex-direction: column;
    gap: 10px;
  }

  .manga-meta {
    flex-direction: column;
    gap: 5px;
  }

  .card-actions {
    margin-top: 5px;
  }
}

@media (max-width: 500px) {
  .brand-name {
    font-size: 20px;
  }

  .admin-badge {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .modal {
    padding: 20px;
  }

  .toast {
    right: 15px;
    bottom: 15px;
    left: 15px;
  }
}
</style>