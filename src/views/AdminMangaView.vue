<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const mangaId = Number(route.params.id) || 1

const manga = ref({
  title: 'One Piece',
  author: 'Eiichiro Oda',
  status: 'กำลังตีพิมพ์',
  description:
    'เรื่องราวการผจญภัยของกลุ่มโจรสลัดหมวกฟาง',
})

const chapters = ref([
  {
    number: 1,
    title: 'การผจญภัยบทที่ 1',
    images: 10,
  },
  {
    number: 1.5,
    title: 'การผจญภัยบทที่ 1.5',
    images: 5,
  },
  {
    number: 2,
    title: 'การผจญภัยบทที่ 2',
    images: 12,
  },
])

const newChapter = ref({
  number: 0,
  title: '',
})

const selectedFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

function goAdmin() {
  router.push('/admin')
}

function goHome() {
  router.push('/')
}

function selectFiles(event: Event) {
  const input = event.target as HTMLInputElement

  if (!input.files) {
    return
  }

  selectedFiles.value = Array.from(input.files)

  imagePreviews.value.forEach((url) => {
    URL.revokeObjectURL(url)
  })

  imagePreviews.value = selectedFiles.value.map((file) =>
    URL.createObjectURL(file),
  )
}

function addChapter() {
  if (
    newChapter.value.number <= 0 ||
    !newChapter.value.title
  ) {
    alert('กรุณากรอกเลขตอนและชื่อตอน')
    return
  }

  chapters.value.push({
    number: newChapter.value.number,
    title: newChapter.value.title,
    images: selectedFiles.value.length,
  })

  chapters.value.sort(
    (a, b) => a.number - b.number,
  )

  alert('เพิ่มตอนสำเร็จ')

  newChapter.value = {
    number: 0,
    title: '',
  }

  selectedFiles.value = []

  imagePreviews.value.forEach((url) => {
    URL.revokeObjectURL(url)
  })

  imagePreviews.value = []
}

function deleteChapter(number: number) {
  const confirmDelete = confirm(
    `ต้องการลบตอน ${number} ใช่หรือไม่?`,
  )

  if (!confirmDelete) {
    return
  }

  chapters.value = chapters.value.filter(
    (chapter) => chapter.number !== number,
  )
}

function editManga() {
  alert(
    'ฟังก์ชันแก้ไขข้อมูลมังงะจะเชื่อม Database ภายหลัง',
  )
}
</script>

<template>
  <div class="manage-page">

    <!-- Header -->
    <header class="admin-header">

      <div class="header-inner">

        <div
          class="logo"
          @click="goHome"
        >
          MangaVerse
        </div>

        <div class="header-title">
          จัดการมังงะ
        </div>

        <button
          class="back-button"
          @click="goAdmin"
        >
          กลับ Admin
        </button>

      </div>

    </header>

    <!-- Main -->
    <main class="container">

      <!-- Manga Information -->
      <section class="manga-info">

        <div class="section-header">

          <div>

            <h1>
              {{ manga.title }}
            </h1>

            <p>
              จัดการข้อมูลและตอนของมังงะ
            </p>

          </div>

          <button
            class="edit-button"
            @click="editManga"
          >
            แก้ไขข้อมูล
          </button>

        </div>

        <div class="info-grid">

          <div class="info-item">

            <span>
              ชื่อเรื่อง
            </span>

            <strong>
              {{ manga.title }}
            </strong>

          </div>

          <div class="info-item">

            <span>
              ผู้แต่ง
            </span>

            <strong>
              {{ manga.author }}
            </strong>

          </div>

          <div class="info-item">

            <span>
              สถานะ
            </span>

            <strong>
              {{ manga.status }}
            </strong>

          </div>

          <div class="info-item">

            <span>
              จำนวนตอน
            </span>

            <strong>
              {{ chapters.length }}
            </strong>

          </div>

        </div>

        <div class="description">

          <span>
            รายละเอียด
          </span>

          <p>
            {{ manga.description }}
          </p>

        </div>

      </section>

      <!-- Add Chapter -->
      <section class="add-section">

        <div class="section-title">

          <h2>
            เพิ่มตอนใหม่
          </h2>

          <p>
            สามารถใช้เลขตอนแบบทศนิยมได้ เช่น
            1.5 หรือ 2.5
          </p>

        </div>

        <form
          class="chapter-form"
          @submit.prevent="addChapter"
        >

          <!-- Chapter Number -->
          <div class="form-group small">

            <label for="chapter-number">
              เลขตอน
            </label>

            <input
              id="chapter-number"
              v-model.number="newChapter.number"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="เช่น 1 หรือ 1.5"
            />

          </div>

          <!-- Chapter Title -->
          <div class="form-group">

            <label for="chapter-title">
              ชื่อตอน
            </label>

            <input
              id="chapter-title"
              v-model="newChapter.title"
              type="text"
              placeholder="เช่น การผจญภัยบทที่ 1"
            />

          </div>

          <!-- Images -->
          <div class="form-group">

            <label for="chapter-images">
              รูปหน้ามังงะ
            </label>

            <input
              id="chapter-images"
              type="file"
              accept="image/*"
              multiple
              @change="selectFiles"
            />

            <small>
              สามารถเลือกหลายรูปพร้อมกันได้
            </small>

          </div>

          <!-- Preview -->
          <div
            v-if="imagePreviews.length > 0"
            class="preview-section"
          >

            <h3>
              รูปที่เลือก
              ({{ imagePreviews.length }} รูป)
            </h3>

            <div class="preview-grid">

              <div
                v-for="(image, index) in imagePreviews"
                :key="image"
                class="preview-item"
              >

                <img
                  :src="image"
                  :alt="`หน้าที่ ${index + 1}`"
                />

                <span>
                  หน้า {{ index + 1 }}
                </span>

              </div>

            </div>

          </div>

          <!-- Save -->
          <div class="form-actions">

            <button
              type="submit"
              class="save-button"
            >
              เพิ่มตอน
            </button>

          </div>

        </form>

      </section>

      <!-- Chapter List -->
      <section class="chapter-section">

        <div class="chapter-header">

          <div>

            <h2>
              รายการตอน
            </h2>

            <p>
              จำนวน {{ chapters.length }} ตอน
            </p>

          </div>

        </div>

        <div class="chapter-list">

          <div
            v-for="chapter in chapters"
            :key="chapter.number"
            class="chapter-item"
          >

            <div class="chapter-number">
              ตอน {{ chapter.number }}
            </div>

            <div class="chapter-detail">

              <strong>
                {{ chapter.title }}
              </strong>

              <span>
                {{ chapter.images }} รูป
              </span>

            </div>

            <div class="chapter-actions">

              <button
                class="view-button"
                @click="
                  router.push(
                    `/manga/${mangaId}/chapter/${chapter.number}`,
                  )
                "
              >
                ดูตอน
              </button>

              <button
                class="delete-button"
                @click="deleteChapter(chapter.number)"
              >
                ลบ
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.manage-page {
  min-height: 100vh;
  background: #f7f7f7;
  color: #222;
}

.admin-header {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;

  display: flex;
  align-items: center;
  gap: 25px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.header-title {
  flex: 1;
  color: #555;
  font-size: 18px;
}

.back-button {
  padding: 9px 15px;
  border: 1px solid #ddd;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
}

.back-button:hover {
  background: #f3f3f3;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 35px 24px 60px;
}

.manga-info,
.add-section,
.chapter-section {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.section-header h1 {
  margin: 0 0 7px;
  font-size: 28px;
}

.section-header p,
.section-title p,
.chapter-header p {
  margin: 0;
  color: #777;
  font-size: 14px;
}

.edit-button {
  padding: 9px 14px;
  border: 1px solid #ddd;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
}

.edit-button:hover {
  background: #f4f4f4;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.info-item {
  padding: 16px;
  border-radius: 8px;
  background: #f8f8f8;
}

.info-item span,
.description span {
  display: block;
  margin-bottom: 7px;
  color: #777;
  font-size: 13px;
}

.info-item strong {
  font-size: 15px;
}

.description {
  margin-top: 20px;
}

.description p {
  margin: 0;
  line-height: 1.7;
  color: #555;
}

.section-title h2,
.chapter-header h2 {
  margin: 0 0 6px;
}

.chapter-form {
  margin-top: 25px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group.small {
  max-width: 250px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #ddd;
  border-radius: 7px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #999;
}

.form-group small {
  display: block;
  margin-top: 6px;
  color: #888;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  padding: 11px 20px;
  border: none;
  border-radius: 7px;
  background: #222;
  color: #fff;
  cursor: pointer;
}

.save-button:hover {
  background: #444;
}

.preview-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.preview-section h3 {
  margin: 0 0 15px;
  font-size: 16px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.preview-item {
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 7px;
  background: #fafafa;
}

.preview-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.preview-item span {
  display: block;
  padding: 7px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.chapter-header {
  margin-bottom: 20px;
}

.chapter-list {
  display: flex;
  flex-direction: column;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 5px;
  border-bottom: 1px solid #eee;
}

.chapter-item:last-child {
  border-bottom: none;
}

.chapter-number {
  min-width: 90px;
  font-weight: 700;
}

.chapter-detail {
  flex: 1;
}

.chapter-detail strong {
  display: block;
  margin-bottom: 5px;
}

.chapter-detail span {
  color: #888;
  font-size: 13px;
}

.chapter-actions {
  display: flex;
  gap: 8px;
}

.view-button,
.delete-button {
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.view-button {
  border: 1px solid #ddd;
  background: #fff;
}

.delete-button {
  border: 1px solid #ddd;
  background: #fff;
}

.view-button:hover,
.delete-button:hover {
  background: #f3f3f3;
}

@media (max-width: 800px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 600px) {
  .header-inner {
    flex-wrap: wrap;
  }

  .header-title {
    order: 3;
    flex-basis: 100%;
  }

  .container {
    padding: 25px 15px 50px;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .preview-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chapter-item {
    flex-wrap: wrap;
  }

  .chapter-actions {
    width: 100%;
  }
}
</style>