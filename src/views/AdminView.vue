<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mangaList = ref([
  {
    id: 1,
    title: 'One Piece',
    author: 'Eiichiro Oda',
    status: 'กำลังตีพิมพ์',
    chapters: 100,
  },
  {
    id: 2,
    title: 'Naruto',
    author: 'Masashi Kishimoto',
    status: 'จบแล้ว',
    chapters: 50,
  },
  {
    id: 3,
    title: 'Demon Slayer',
    author: 'Koyoharu Gotouge',
    status: 'จบแล้ว',
    chapters: 30,
  },
])

const showAddForm = ref(false)

const newManga = ref({
  title: '',
  author: '',
  description: '',
  status: 'กำลังตีพิมพ์',
})

function goHome() {
  router.push('/')
}

function openAddForm() {
  showAddForm.value = true
}

function closeAddForm() {
  showAddForm.value = false

  newManga.value = {
    title: '',
    author: '',
    description: '',
    status: 'กำลังตีพิมพ์',
  }
}

function addManga() {
  if (!newManga.value.title || !newManga.value.author) {
    alert('กรุณากรอกชื่อมังงะและชื่อผู้แต่ง')
    return
  }

  mangaList.value.push({
    id: mangaList.value.length + 1,
    title: newManga.value.title,
    author: newManga.value.author,
    status: newManga.value.status,
    chapters: 0,
  })

  alert('เพิ่มมังงะสำเร็จ')

  closeAddForm()
}

function manageManga(id: number) {
  router.push(`/admin/manga/${id}`)
}
</script>

<template>
  <div class="admin-page">

    <!-- Header -->
    <header class="admin-header">
      <div class="header-inner">

        <div
          class="logo"
          @click="goHome"
        >
          MangaVerse
        </div>

        <div class="admin-title">
          Admin Dashboard
        </div>

        <button
          class="home-button"
          @click="goHome"
        >
          กลับหน้า Home
        </button>

      </div>
    </header>

    <!-- Main -->
    <main class="admin-container">

      <!-- Page Header -->
      <section class="page-heading">

        <div>
          <h1>จัดการมังงะ</h1>

          <p>
            เพิ่มและจัดการข้อมูลมังงะภายในระบบ
          </p>
        </div>

        <button
          class="add-button"
          @click="openAddForm"
        >
          + เพิ่มมังงะ
        </button>

      </section>

      <!-- Statistics -->
      <section class="statistics">

        <div class="stat-card">

          <span class="stat-label">
            มังงะทั้งหมด
          </span>

          <strong>
            {{ mangaList.length }}
          </strong>

        </div>

        <div class="stat-card">

          <span class="stat-label">
            กำลังตีพิมพ์
          </span>

          <strong>
            {{
              mangaList.filter(
                (manga) =>
                  manga.status === 'กำลังตีพิมพ์',
              ).length
            }}
          </strong>

        </div>

        <div class="stat-card">

          <span class="stat-label">
            จบแล้ว
          </span>

          <strong>
            {{
              mangaList.filter(
                (manga) =>
                  manga.status === 'จบแล้ว',
              ).length
            }}
          </strong>

        </div>

      </section>

      <!-- Manga Table -->
      <section class="manga-section">

        <h2>รายการมังงะ</h2>

        <div class="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>ชื่อเรื่อง</th>
                <th>ผู้แต่ง</th>
                <th>สถานะ</th>
                <th>จำนวนตอน</th>
                <th>จัดการ</th>
              </tr>

            </thead>

            <tbody>

              <tr
                v-for="manga in mangaList"
                :key="manga.id"
              >

                <td>
                  {{ manga.id }}
                </td>

                <td class="manga-name">
                  {{ manga.title }}
                </td>

                <td>
                  {{ manga.author }}
                </td>

                <td>

                  <span
                    class="status"
                    :class="{
                      completed:
                        manga.status === 'จบแล้ว',
                    }"
                  >
                    {{ manga.status }}
                  </span>

                </td>

                <td>
                  {{ manga.chapters }}
                </td>

                <td>

                  <button
                    class="manage-button"
                    @click="manageManga(manga.id)"
                  >
                    จัดการ
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

      <!-- Add Manga Form -->
      <section
        v-if="showAddForm"
        class="form-section"
      >

        <div class="form-header">

          <div>

            <h2>
              เพิ่มมังงะเรื่องใหม่
            </h2>

            <p>
              กรอกข้อมูลพื้นฐานของมังงะ
            </p>

          </div>

          <button
            class="close-button"
            @click="closeAddForm"
          >
            ×
          </button>

        </div>

        <form
          @submit.prevent="addManga"
        >

          <!-- Title -->
          <div class="form-group">

            <label for="title">
              ชื่อเรื่อง
            </label>

            <input
              id="title"
              v-model="newManga.title"
              type="text"
              placeholder="เช่น One Piece"
            />

          </div>

          <!-- Author -->
          <div class="form-group">

            <label for="author">
              ผู้แต่ง
            </label>

            <input
              id="author"
              v-model="newManga.author"
              type="text"
              placeholder="ชื่อผู้แต่ง"
            />

          </div>

          <!-- Status -->
          <div class="form-group">

            <label for="status">
              สถานะ
            </label>

            <select
              id="status"
              v-model="newManga.status"
            >

              <option value="กำลังตีพิมพ์">
                กำลังตีพิมพ์
              </option>

              <option value="จบแล้ว">
                จบแล้ว
              </option>

            </select>

          </div>

          <!-- Description -->
          <div class="form-group">

            <label for="description">
              รายละเอียด
            </label>

            <textarea
              id="description"
              v-model="newManga.description"
              placeholder="รายละเอียดมังงะ"
              rows="4"
            ></textarea>

          </div>

          <!-- Actions -->
          <div class="form-actions">

            <button
              type="button"
              class="cancel-button"
              @click="closeAddForm"
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

      </section>

    </main>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-page {
  min-height: 100vh;
  background: #f7f7f7;
  color: #222;
}

.admin-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;

  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.admin-title {
  flex: 1;
  font-size: 18px;
  color: #555;
}

.home-button {
  padding: 9px 15px;
  border: 1px solid #ddd;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
}

.home-button:hover {
  background: #f2f2f2;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 35px 24px 60px;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-heading h1 {
  margin: 0 0 6px;
  font-size: 28px;
}

.page-heading p {
  margin: 0;
  color: #777;
}

.add-button {
  padding: 11px 18px;
  border: none;
  border-radius: 7px;
  background: #222;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.add-button:hover {
  background: #444;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 35px;
}

.stat-card {
  padding: 22px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}

.stat-label {
  display: block;
  color: #777;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-card strong {
  font-size: 28px;
}

.manga-section {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 25px;
}

.manga-section h2 {
  margin: 0 0 20px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

th {
  background: #fafafa;
  color: #555;
  font-size: 14px;
}

.manga-name {
  font-weight: 600;
}

.status {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 5px;
  background: #fff3cd;
  color: #856404;
  font-size: 13px;
}

.status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.manage-button {
  padding: 7px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.manage-button:hover {
  background: #f5f5f5;
}

.form-section {
  margin-top: 25px;
  padding: 25px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.form-header h2 {
  margin: 0 0 5px;
}

.form-header p {
  margin: 0;
  color: #777;
}

.close-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f1f1f1;
  font-size: 22px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #ddd;
  border-radius: 7px;
  font-family: inherit;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #999;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.cancel-button,
.save-button {
  padding: 10px 18px;
  border-radius: 7px;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #ddd;
  background: #fff;
}

.save-button {
  border: none;
  background: #222;
  color: #fff;
}

@media (max-width: 700px) {
  .header-inner {
    flex-wrap: wrap;
  }

  .admin-title {
    order: 3;
    flex-basis: 100%;
  }

  .page-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .statistics {
    grid-template-columns: 1fr;
  }

  .admin-container {
    padding: 25px 15px 50px;
  }
}
</style>