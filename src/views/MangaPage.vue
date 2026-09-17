<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookshelfStore } from '@/stores/bookshelf'

const route = useRoute()
const router = useRouter()
const bookshelfStore = useBookshelfStore()

interface Manga {
  id: number
  title: string
  author: string
  category: string
  chapter: number
  status: string
  description: string
  cover: string
}

/*
|--------------------------------------------------------------------------
| Manga List
|--------------------------------------------------------------------------
| ID ต้องตรงกับหน้า Home
|
| 1 = One Piece
| 2 = Solo Leveling
| 3 = Naruto
| 4 = Demon Slayer
|--------------------------------------------------------------------------
*/

const mangaList: Manga[] = [
  {
    id: 1,
    title: 'One Piece',
    author: 'Eiichiro Oda',
    category: 'Action',
    chapter: 100,
    status: 'กำลังดำเนินการ',
    description:
      'เรื่องราวการผจญภัยของลูฟี่และกลุ่มโจรสลัดหมวกฟางที่ออกเดินทางตามหาสมบัติ One Piece',
    cover:
      'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600',
  },
  {
    id: 2,
    title: 'Solo Leveling',
    author: 'Chugong',
    category: 'Fantasy',
    chapter: 100,
    status: 'จบแล้ว',
    description:
      'เรื่องราวของซองจินอู นักล่าที่เริ่มต้นจากผู้ที่อ่อนแอที่สุด และได้รับพลังที่ทำให้สามารถพัฒนาตัวเองได้อย่างไร้ขีดจำกัด',
    cover:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
  },
  {
    id: 3,
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    category: 'Action',
    chapter: 100,
    status: 'จบแล้ว',
    description:
      'เรื่องราวของนารูโตะ นินจาหนุ่มผู้มีความฝันที่จะเป็นโฮคาเงะ และต้องผ่านการฝึกฝนและการต่อสู้มากมาย',
    cover:
      'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600',
  },
  {
    id: 4,
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    category: 'Action',
    chapter: 100,
    status: 'จบแล้ว',
    description:
      'เรื่องราวของทันจิโร่ที่ออกเดินทางเพื่อช่วยเหลือน้องสาวและต่อสู้กับเหล่าอสูร',
    cover:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
  },
]

/*
|--------------------------------------------------------------------------
| Current Manga
|--------------------------------------------------------------------------
*/

const mangaId = computed(() => Number(route.params.id))

const manga = computed(() => {
  return mangaList.find((item) => item.id === mangaId.value)
})

/*
|--------------------------------------------------------------------------
| Chapters
|--------------------------------------------------------------------------
*/

const chapters = computed(() => {
  if (!manga.value) {
    return []
  }

  return Array.from(
    { length: manga.value.chapter },
    (_, index) => index + 1
  )
})

/*
|--------------------------------------------------------------------------
| Bookshelf
|--------------------------------------------------------------------------
*/

const isInBookshelf = computed(() => {
  return bookshelfStore.isInBookshelf(mangaId.value)
})

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

function goHome() {
  router.push('/')
}

/*
|--------------------------------------------------------------------------
| Read Chapter
|--------------------------------------------------------------------------
*/

function readChapter(chapter: number) {
  if (!manga.value) {
    return
  }

  bookshelfStore.updateChapter(manga.value.id, chapter)

  router.push(
    `/manga/${manga.value.id}/chapter/${chapter}`
  )
}

/*
|--------------------------------------------------------------------------
| Read Latest Chapter
|--------------------------------------------------------------------------
*/

function readLatest() {
  if (!manga.value) {
    return
  }

  readChapter(manga.value.chapter)
}

/*
|--------------------------------------------------------------------------
| Add / Remove Bookshelf
|--------------------------------------------------------------------------
*/

function toggleBookshelf() {
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
</script>

<template>
  <div v-if="manga" class="manga-page">
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
              <span>ผู้เขียน</span>
              <strong>
                {{ manga.author }}
              </strong>
            </div>

            <div class="meta-item">
              <span>หมวดหมู่</span>
              <strong>
                {{ manga.category }}
              </strong>
            </div>

            <div class="meta-item">
              <span>สถานะ</span>
              <strong>
                {{ manga.status }}
              </strong>
            </div>

            <div class="meta-item">
              <span>จำนวนตอน</span>
              <strong>
                {{ manga.chapter }} ตอน
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
              @click="readLatest"
            >
              อ่านตอนล่าสุด
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
            {{ manga.chapter }} ตอน
          </span>
        </div>

        <div class="chapter-grid">
          <button
            v-for="chapter in chapters"
            :key="chapter"
            type="button"
            class="chapter-button"
            @click="readChapter(chapter)"
          >
            ตอนที่ {{ chapter }}
          </button>
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
  grid-template-columns: repeat(2, minmax(0, 1fr));

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
.bookshelf-button {
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


/* Read */

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


/* Bookshelf */

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
  min-height: 42px;

  padding: 0 10px;

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

.chapter-button:hover {
  border-color: #7c3aed;

  background: #7c3aed;
  color: #ffffff;

  transform: translateY(-1px);
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
  .bookshelf-button {
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
}
</style>