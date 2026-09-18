<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBookshelfStore } from '@/stores/bookshelf'

const router = useRouter()
const authStore = useAuthStore()
const bookshelfStore = useBookshelfStore()

function goHome() {
  router.push('/')
}

function openManga(id: number) {
  router.push(`/manga/${id}`)
}

function continueReading(id: number, chapter: number) {
  router.push(`/manga/${id}/chapter/${chapter}`)
}

function removeFromBookshelf(id: number) {
  // ลบออกได้เลยโดยไม่ต้องมี confirm dialog
  bookshelfStore.removeFromBookshelf(id)
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="bookshelf-page">
    <!-- Main -->
    <main class="main-content">
      <!-- Page Title -->
      <div class="page-title">
        <p class="section-label">
          MY BOOKSHELF
        </p>

        <h1>
          ชั้นหนังสือของฉัน
        </h1>

        <p class="subtitle">
          มังงะที่คุณบันทึกไว้
        </p>
      </div>

      <!-- User Info -->
      <div class="user-info">
        <div class="user-text">
          <span class="welcome">
            สวัสดี
          </span>

          <strong>
            {{ authStore.username }}
          </strong>
        </div>

        <button
          type="button"
          class="logout-button"
          @click="logout"
        >
          ออกจากระบบ
        </button>
      </div>

      <!-- Empty -->
      <section
        v-if="bookshelfStore.mangaList.length === 0"
        class="empty-bookshelf"
      >
        <div class="empty-icon">
          +
        </div>

        <h2>
          ชั้นหนังสือยังว่าง
        </h2>

        <p>
          ไปเลือกมังงะที่สนใจแล้วเพิ่มเข้าชั้นหนังสือได้เลย
        </p>

        <button
          type="button"
          class="home-button"
          @click="goHome"
        >
          ไปเลือกมังงะ
        </button>
      </section>

      <!-- Manga List -->
      <section
        v-else
        class="manga-grid"
      >
        <article
          v-for="manga in bookshelfStore.mangaList"
          :key="manga.id"
          class="manga-card"
        >
          <!-- Cover -->
          <button
            type="button"
            class="cover-button"
            @click="openManga(manga.id)"
          >
            <div class="cover-wrapper">
              <img
                :src="manga.cover"
                :alt="manga.title"
                class="manga-cover"
              />
            </div>
          </button>

          <!-- Info -->
          <div class="manga-info">
            <h2>
              {{ manga.title }}
            </h2>

            <p>
              อ่านล่าสุดถึงตอนที่
              {{ manga.chapter }}
            </p>

            <!-- Buttons -->
            <div class="card-actions">
              <button
                type="button"
                class="continue-button"
                @click="
                  continueReading(
                    manga.id,
                    manga.chapter,
                  )
                "
              >
                อ่านต่อ
              </button>

              <button
                type="button"
                class="detail-button"
                @click="openManga(manga.id)"
              >
                รายละเอียด
              </button>

              <button
                type="button"
                class="remove-button"
                @click="removeFromBookshelf(manga.id)"
              >
                เอาออก
              </button>
            </div>
          </div>
        </article>
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
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* ========================================
   Page
======================================== */

.bookshelf-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  padding: 50px 0 70px;
  flex: 1;
}

/* ========================================
   Page Title
======================================== */

.page-title {
  margin-bottom: 25px;
}

.section-label {
  margin: 0 0 6px;
  color: #7c3aed;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.page-title h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.subtitle {
  margin: 0;
  color: #777777;
  font-size: 14px;
}

/* ========================================
   User Info
======================================== */

.user-info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}

.user-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555555;
  font-size: 14px;
}

.user-text strong {
  color: #18181b;
  font-weight: 700;
}

.welcome {
  color: #777777;
}

/* ========================================
   Logout
======================================== */

.logout-button {
  padding: 8px 14px;
  border: 1px solid #dddddd;
  border-radius: 7px;
  background: #ffffff;
  color: #555555;
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.logout-button:hover {
  border-color: #d4d4d8;
  background: #f5f5f5;
  color: #d32f2f;
}

/* ========================================
   Manga Grid
======================================== */

.manga-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

/* ========================================
   Manga Card
======================================== */

.manga-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.manga-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08);
}

/* ========================================
   Cover
======================================== */

.cover-button {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.cover-wrapper {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #eeeeee;
}

.manga-cover {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition:
    transform 0.3s ease;
}

.cover-button:hover .manga-cover {
  transform: scale(1.03);
}

/* ========================================
   Manga Info
======================================== */

.manga-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 18px;
}

.manga-info h2 {
  margin: 0 0 8px;
  color: #18181b;
  font-size: 19px;
  font-weight: 700;
}

.manga-info p {
  margin: 0 0 18px;
  color: #777777;
  font-size: 13px;
  line-height: 1.5;
}

/* ========================================
   Card Actions
======================================== */

.card-actions {
  display: flex;
  gap: 7px;
  margin-top: auto;
}

.card-actions button {
  flex: 1;
  min-height: 38px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

/* ========================================
   Continue
======================================== */

.continue-button {
  border: none;
  background: #7c3aed;
  color: #ffffff;
}

.continue-button:hover {
  background: #6d28d9;
}

/* ========================================
   Detail
======================================== */

.detail-button {
  border: 1px solid #d4d4d8;
  background: #ffffff;
  color: #555555;
}

.detail-button:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

/* ========================================
   Remove
======================================== */

.remove-button {
  border: 1px solid #f1d1d1;
  background: #ffffff;
  color: #d32f2f;
}

.remove-button:hover {
  border-color: #d32f2f;
  background: #fff5f5;
}

/* ========================================
   Empty
======================================== */

.empty-bookshelf {
  padding: 70px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f1ecff;
  color: #7c3aed;
  font-size: 30px;
  font-weight: 400;
}

.empty-bookshelf h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.empty-bookshelf p {
  margin: 0 0 22px;
  color: #888888;
  font-size: 14px;
}

.home-button {
  min-height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.home-button:hover {
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
   Responsive
======================================== */

@media (max-width: 1000px) {
  .main-content,
  .footer-inner {
    width: 92%;
  }

  .manga-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
}

@media (max-width: 700px) {
  .main-content {
    width: 92%;
    padding-top: 35px;
  }

  .page-title h1 {
    font-size: 28px;
  }

  .manga-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .manga-info {
    padding: 13px;
  }

  .manga-info h2 {
    font-size: 16px;
  }

  .manga-info p {
    font-size: 12px;
  }

  .card-actions {
    flex-direction: column;
    gap: 7px;
  }

  .card-actions button {
    width: 100%;
  }

  .user-info {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .logout-button {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .main-content {
    width: 94%;
    padding-top: 30px;
  }

  .page-title h1 {
    font-size: 25px;
  }

  .manga-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .manga-info {
    padding: 11px;
  }

  .manga-info h2 {
    font-size: 15px;
  }

  .manga-info p {
    font-size: 11px;
  }

  .card-actions button {
    min-height: 36px;
    font-size: 12px;
  }

  .footer-inner {
    width: 94%;
  }
}
</style>