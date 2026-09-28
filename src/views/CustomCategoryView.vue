
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useCustomCategoryStore } from '@/stores/customCategory'
import { MangaService } from '@/services/mangaService'

const route = useRoute()
const router = useRouter()

const customCategoryStore = useCustomCategoryStore()
const mangaService = new MangaService()

const categoryId = computed(() => Number(route.params.id))

const category = computed(() => {
  return customCategoryStore.getCategoryById(categoryId.value)
})

const mangaList = computed(() => {
  if (!category.value) {
    return []
  }

  return category.value.mangaIds
    .map((mangaId) => {
      return mangaService.getMangaById(Number(mangaId))
    })
    .filter((manga) => manga !== undefined)
})

function goBack() {
  router.push({
    name: 'bookshelf',
  })
}

function openManga(id: number) {
  router.push({
    name: 'manga',
    params: {
      id,
    },
  })
}

function removeFromCategory(mangaId: number) {
  customCategoryStore.removeMangaFromCategory(
    categoryId.value,
    mangaId,
  )
}
</script>

<template>
  <div class="category-page">
    <main class="category-content">
      <!-- Header -->
      <header class="category-header">
        <button
          type="button"
          class="back-button"
          @click="goBack"
        >
          <span class="back-icon">←</span>
          <span>กลับชั้นหนังสือ</span>
        </button>

        <div class="header-divider"></div>

        <div class="category-heading">
          <div class="folder-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 6.5C3 5.67 3.67 5 4.5 5H9L11 7H19.5C20.33 7 21 7.67 21 8.5V17.5C21 18.33 20.33 19 19.5 19H4.5C3.67 19 3 18.33 3 17.5V6.5Z"
                fill="currentColor"
                fill-opacity=".16"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linejoin="round"
              />
              <path
                d="M3.5 9H20.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="heading-text">
            <span class="eyebrow">MY COLLECTION</span>
            <h1>{{ category?.name || 'ไม่พบโฟลเดอร์' }}</h1>
            <p v-if="category">
              รวมมังงะที่คุณบันทึกไว้ในโฟลเดอร์นี้
            </p>
          </div>
        </div>

        <div
          v-if="category"
          class="manga-count"
        >
          <span class="count-number">{{ mangaList.length }}</span>
          <span class="count-label">เรื่อง</span>
        </div>
      </header>

      <!-- Not Found -->
      <section
        v-if="!category"
        class="empty-state"
      >
        <div class="empty-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 6.5C3 5.67 3.67 5 4.5 5H9L11 7H19.5C20.33 7 21 7.67 21 8.5V17.5C21 18.33 20.33 19 19.5 19H4.5C3.67 19 3 18.33 3 17.5V6.5Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
            <path
              d="M9 12L15 18M15 12L9 18"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <h2>ไม่พบโฟลเดอร์นี้</h2>
        <p>โฟลเดอร์อาจถูกลบไปแล้ว หรือไม่มีอยู่ในชั้นหนังสือของคุณ</p>

        <button
          type="button"
          class="primary-button"
          @click="goBack"
        >
          กลับไปชั้นหนังสือ
        </button>
      </section>

      <!-- Empty Folder -->
      <section
        v-else-if="mangaList.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 6.5C3 5.67 3.67 5 4.5 5H9L11 7H19.5C20.33 7 21 7.67 21 8.5V17.5C21 18.33 20.33 19 19.5 19H4.5C3.67 19 3 18.33 3 17.5V6.5Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
              <path
                d="M12 10V16M9 13H15"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
          </svg>
        </div>

        <h2>โฟลเดอร์นี้ยังว่างอยู่</h2>
        <p>เพิ่มมังงะที่คุณชื่นชอบเข้ามา แล้วกลับมาอ่านได้ที่นี่</p>

        <button
          type="button"
          class="primary-button"
          @click="goBack"
        >
          ไปที่ชั้นหนังสือ
        </button>
      </section>

      <!-- Manga List -->
      <section
        v-else
        class="collection-section"
      >
        <div class="collection-toolbar">
          <div>
            <h2>มังงะในโฟลเดอร์</h2>
            <p>เลือกเรื่องที่ต้องการเพื่อดูรายละเอียดและอ่านมังงะ</p>
          </div>

          <span class="collection-total">
            {{ mangaList.length }} เรื่อง
          </span>
        </div>

        <div class="manga-grid">
          <article
            v-for="manga in mangaList"
            :key="manga.id"
            class="manga-card"
          >
            <button
              type="button"
              class="cover-button"
              :aria-label="`ดูรายละเอียด ${manga.title}`"
              @click="openManga(Number(manga.id))"
            >
              <div class="cover-frame">
                <img
                  :src="manga.cover"
                  :alt="manga.title"
                  class="manga-cover"
                  loading="lazy"
                />

                <div class="cover-overlay">
                  <span class="view-detail">
                    ดูรายละเอียด
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </button>

            <div class="manga-info">
              <button
                type="button"
                class="manga-title"
                @click="openManga(Number(manga.id))"
              >
                {{ manga.title }}
              </button>

              <p class="manga-author">
                {{ manga.author || 'ไม่ระบุผู้เขียน' }}
              </p>

              <div class="card-bottom">
                <span class="manga-status">
                  {{ manga.status || 'ไม่ระบุสถานะ' }}
                </span>

                <button
                  type="button"
                  class="remove-button"
                  :aria-label="`ลบ ${manga.title} ออกจากโฟลเดอร์`"
                  title="ลบออกจากโฟลเดอร์"
                  @click="removeFromCategory(Number(manga.id))"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 7H20M10 11V17M14 11V17M5.5 7L6.3 19C6.35 19.6 6.85 20 7.4 20H16.6C17.15 20 17.65 19.6 17.7 19L18.5 7M9 7V4.8C9 4.36 9.36 4 9.8 4H14.2C14.64 4 15 4.36 15 4.8V7"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>ลบออก</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.category-page {
  min-height: 100vh;
  padding: 36px 24px 70px;
  background: #f7f7fa;
  color: #171717;
}

.category-content {
  width: min(1320px, 100%);
  margin: 0 auto;
}

/* Header */
.category-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 34px;
  padding: 25px 28px;
  background: #fff;
  border: 1px solid #e9e6f0;
  border-radius: 20px;
  box-shadow: 0 8px 28px rgba(34, 18, 70, 0.04);
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  flex-shrink: 0;
  padding: 11px 15px;
  border: 1px solid #e5e0ef;
  border-radius: 11px;
  background: #fff;
  color: #4d4265;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: 0.2s ease;
}

.back-button:hover {
  border-color: #7138df;
  background: #f6f1ff;
  color: #7138df;
}

.back-icon {
  font-size: 18px;
  line-height: 1;
}

.header-divider {
  width: 1px;
  height: 56px;
  flex-shrink: 0;
  background: #ece8f3;
}

.category-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex: 1;
}

.folder-icon {
  display: grid;
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 16px;
  background: #f1eaff;
  color: #7138df;
}

.folder-icon svg {
  width: 31px;
  height: 31px;
}

.heading-text {
  min-width: 0;
}

.eyebrow {
  display: block;
  margin-bottom: 4px;
  color: #7138df;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.category-heading h1 {
  margin: 0;
  overflow-wrap: anywhere;
  color: #191522;
  font-size: clamp(23px, 3vw, 32px);
  font-weight: 800;
  line-height: 1.25;
}

.heading-text p {
  margin: 5px 0 0;
  color: #88818f;
  font-size: 13px;
}

.manga-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-shrink: 0;
  padding: 10px 16px;
  border: 1px solid #e9defe;
  border-radius: 12px;
  background: #f8f4ff;
  color: #7138df;
}

.count-number {
  font-size: 22px;
  font-weight: 800;
}

.count-label {
  font-size: 13px;
  font-weight: 600;
}

/* Collection */
.collection-section {
  padding: 28px;
  border: 1px solid #e9e6f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(34, 18, 70, 0.04);
}

.collection-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.collection-toolbar h2 {
  margin: 0;
  color: #211b2b;
  font-size: 21px;
  font-weight: 800;
}

.collection-toolbar p {
  margin: 6px 0 0;
  color: #88818f;
  font-size: 13px;
}

.collection-total {
  flex-shrink: 0;
  padding: 8px 13px;
  border-radius: 10px;
  background: #f4efff;
  color: #7138df;
  font-size: 13px;
  font-weight: 700;
}

/* Manga Grid */
.manga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 24px;
}

.manga-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #ece9f2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(30, 15, 60, 0.035);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.manga-card:hover {
  transform: translateY(-5px);
  border-color: #d8c7fa;
  box-shadow: 0 13px 30px rgba(54, 27, 100, 0.11);
}

.cover-button {
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: #f0edf5;
  cursor: pointer;
  text-align: left;
}

.cover-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  background: #f0edf5;
}

.manga-cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.manga-card:hover .manga-cover {
  transform: scale(1.045);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 18px 12px;
  background: linear-gradient(
    to top,
    rgba(28, 13, 55, 0.72),
    rgba(28, 13, 55, 0) 48%
  );
  opacity: 0;
  transition: opacity 0.22s ease;
}

.manga-card:hover .cover-overlay,
.cover-button:focus-visible .cover-overlay {
  opacity: 1;
}

.view-detail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

/* Manga Info */
.manga-info {
  padding: 14px;
}

.manga-title {
  display: block;
  width: 100%;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: transparent;
  color: #211b2b;
  font-size: 16px;
  font-weight: 800;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;
}

.manga-title:hover {
  color: #7138df;
}

.manga-author {
  overflow: hidden;
  margin: 5px 0 13px;
  color: #8a8491;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.manga-status {
  display: inline-block;
  max-width: 60%;
  overflow: hidden;
  padding: 5px 8px;
  border-radius: 7px;
  background: #f5f2fa;
  color: #6f667a;
  font-size: 11px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 7px 9px;
  border: 1px solid #f1dada;
  border-radius: 8px;
  background: #fff7f7;
  color: #c24a4a;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.remove-button svg {
  width: 14px;
  height: 14px;
}

.remove-button:hover {
  border-color: #e7b8b8;
  background: #ffeaea;
  color: #a92e2e;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  padding: 45px 24px;
  border: 1px solid #e9e6f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(34, 18, 70, 0.04);
  text-align: center;
}

.empty-icon {
  display: grid;
  width: 82px;
  height: 82px;
  margin-bottom: 20px;
  place-items: center;
  border-radius: 24px;
  background: #f2ebff;
  color: #7138df;
}

.empty-icon svg {
  width: 39px;
  height: 39px;
}

.empty-state h2 {
  margin: 0 0 9px;
  color: #211b2b;
  font-size: 22px;
  font-weight: 800;
}

.empty-state p {
  max-width: 420px;
  margin: 0 0 22px;
  color: #88818f;
  font-size: 14px;
  line-height: 1.7;
}

.primary-button {
  min-height: 43px;
  padding: 0 19px;
  border: 0;
  border-radius: 10px;
  background: #7138df;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  background: #6027cf;
  box-shadow: 0 7px 18px rgba(113, 56, 223, 0.2);
}

/* Focus */
button:focus-visible {
  outline: 3px solid rgba(113, 56, 223, 0.35);
  outline-offset: 3px;
}

/* Responsive */
@media (max-width: 900px) {
  .category-page {
    padding: 26px 20px 55px;
  }

  .category-header {
    gap: 16px;
    padding: 22px;
  }

  .manga-grid {
    grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
    gap: 18px;
  }

  .collection-section {
    padding: 22px;
  }
}

@media (max-width: 650px) {
  .category-page {
    padding: 20px 14px 40px;
  }

  .category-header {
    flex-wrap: wrap;
    gap: 14px;
    padding: 17px;
    border-radius: 16px;
  }

  .back-button {
    padding: 9px 12px;
  }

  .header-divider {
    display: none;
  }

  .category-heading {
    order: 3;
    flex-basis: 100%;
  }

  .folder-icon {
    width: 48px;
    height: 48px;
    border-radius: 13px;
  }

  .folder-icon svg {
    width: 26px;
    height: 26px;
  }

  .category-heading h1 {
    font-size: 24px;
  }

  .heading-text p {
    font-size: 12px;
  }

  .manga-count {
    margin-left: auto;
    padding: 7px 11px;
  }

  .count-number {
    font-size: 18px;
  }

  .collection-section {
    padding: 17px;
    border-radius: 16px;
  }

  .collection-toolbar h2 {
    font-size: 18px;
  }

  .collection-toolbar p {
    font-size: 12px;
  }

  .manga-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 13px;
  }

  .manga-info {
    padding: 11px;
  }

  .manga-title {
    font-size: 14px;
  }

  .remove-button {
    padding: 6px 7px;
    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .manga-grid {
    grid-template-columns: 1fr;
  }

  .manga-card {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr);
  }

  .cover-frame {
    aspect-ratio: 2 / 3;
  }

  .manga-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-bottom {
    flex-wrap: wrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>