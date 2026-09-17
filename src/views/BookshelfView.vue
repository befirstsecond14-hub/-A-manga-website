<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mangaList = [
  {
    id: 1,
    title: 'One Piece',
    cover:
      'https://images.unsplash.com/photo-1613376023733-6897c85e8b9c?w=500',
    chapter: 100,
  },
  {
    id: 2,
    title: 'Naruto',
    cover:
      'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500',
    chapter: 50,
  },
  {
    id: 3,
    title: 'Demon Slayer',
    cover:
      'https://images.unsplash.com/photo-1607604276583-eef5b0765f2a?w=500',
    chapter: 30,
  },
]

function goHome() {
  router.push('/')
}

function openManga(id: number) {
  router.push(`/manga/${id}`)
}

function continueReading(id: number, chapter: number) {
  router.push(`/manga/${id}/chapter/${chapter}`)
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="bookshelf-page">

    <!-- Header -->
    <header class="header">
      <div class="header-inner">

        <div class="logo" @click="goHome">
          MangaVerse
        </div>

        <nav>
          <button @click="goHome">
            หน้าหลัก
          </button>

          <button class="active">
            ชั้นหนังสือ
          </button>
        </nav>

      </div>
    </header>

    <!-- Main -->
    <main class="container">

      <div class="page-title">
        <h1>ชั้นหนังสือของฉัน</h1>

        <p>
          มังงะที่คุณบันทึกไว้
        </p>
      </div>

      <!-- User Info -->
      <div class="user-info">

        <span>
          สวัสดี {{ authStore.username }}
        </span>

        <button @click="logout">
          ออกจากระบบ
        </button>

      </div>

      <!-- Manga List -->
      <section class="manga-grid">

        <article
          v-for="manga in mangaList"
          :key="manga.id"
          class="manga-card"
        >

          <img
            :src="manga.cover"
            :alt="manga.title"
          />

          <div class="manga-info">

            <h2>
              {{ manga.title }}
            </h2>

            <p>
              อ่านล่าสุดถึงตอนที่ {{ manga.chapter }}
            </p>

            <div class="card-actions">

              <button
                class="continue-button"
                @click="continueReading(manga.id, manga.chapter)"
              >
                อ่านต่อ
              </button>

              <button
                class="detail-button"
                @click="openManga(manga.id)"
              >
                รายละเอียด
              </button>

            </div>

          </div>

        </article>

      </section>

    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>
        © 2026 MangaVerse
      </p>
    </footer>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.bookshelf-page {
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background: #f5f5f5;
}

/* Header */

.header {
  background: #ffffff;

  border-bottom: 1px solid #e5e5e5;
}

.header-inner {
  max-width: 1200px;

  margin: 0 auto;

  padding: 18px 24px;

  display: flex;

  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 24px;

  font-weight: 800;

  color: #222;

  cursor: pointer;
}

nav {
  display: flex;

  gap: 8px;
}

nav button {
  border: none;

  background: transparent;

  padding: 8px 14px;

  color: #666;

  font-size: 14px;

  cursor: pointer;
}

nav button:hover,
nav button.active {
  color: #111;
}

/* Main */

.container {
  width: 100%;

  max-width: 1200px;

  margin: 0 auto;

  padding: 45px 24px;

  flex: 1;
}

.page-title {
  margin-bottom: 20px;
}

.page-title h1 {
  margin: 0 0 8px;

  color: #222;

  font-size: 30px;
}

.page-title p {
  margin: 0;

  color: #777;

  font-size: 15px;
}

/* User Info */

.user-info {
  margin-bottom: 25px;

  padding: 15px 18px;

  background: #ffffff;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  color: #555;

  font-size: 14px;
}

.user-info button {
  padding: 8px 14px;

  border: 1px solid #ddd;

  border-radius: 6px;

  background: #ffffff;

  color: #333;

  cursor: pointer;
}

.user-info button:hover {
  background: #f5f5f5;
}

/* Grid */

.manga-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 24px;
}

.manga-card {
  overflow: hidden;

  background: #ffffff;

  border-radius: 14px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
}

.manga-card img {
  display: block;

  width: 100%;

  height: 350px;

  object-fit: cover;
}

.manga-info {
  padding: 20px;
}

.manga-info h2 {
  margin: 0 0 8px;

  color: #222;

  font-size: 20px;
}

.manga-info p {
  margin: 0 0 18px;

  color: #777;

  font-size: 14px;
}

/* Buttons */

.card-actions {
  display: flex;

  gap: 10px;
}

.card-actions button {
  flex: 1;

  padding: 11px;

  border-radius: 7px;

  font-size: 14px;

  cursor: pointer;
}

.continue-button {
  border: none;

  background: #222;

  color: #ffffff;
}

.continue-button:hover {
  background: #444;
}

.detail-button {
  border: 1px solid #ddd;

  background: #ffffff;

  color: #333;
}

.detail-button:hover {
  background: #f5f5f5;
}

/* Footer */

.footer {
  padding: 20px;

  background: #ffffff;

  text-align: center;

  color: #888;

  font-size: 13px;
}

/* Mobile */

@media (max-width: 800px) {
  .manga-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .header-inner {
    padding: 15px 18px;
  }

  .logo {
    font-size: 21px;
  }

  .container {
    padding: 30px 16px;
  }

  .manga-grid {
    grid-template-columns: 1fr;
  }

  .manga-card img {
    height: 400px;
  }

  .user-info {
    flex-direction: column;

    align-items: flex-start;

    gap: 12px;
  }
}
</style>