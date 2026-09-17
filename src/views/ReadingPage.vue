<script setup lang="ts">
import { ref, computed } from 'vue'

/* =========================
   Manga Information
========================= */

const mangaId = 1
const mangaTitle = 'One Piece'


/* =========================
   Chapter List
   ตอนที่ 1 - 100
========================= */

const chapters = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
  71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
]


/* =========================
   Current Chapter
   เริ่มต้นที่ตอน 1
========================= */

const currentChapter = ref<number>(1)


/* =========================
   Manga Pages
   รูปจะเปลี่ยนตามตอน
========================= */

const pages = computed(() => {
  return [
    `https://picsum.photos/seed/manga-${currentChapter.value}-page-1/900/1300`,
    `https://picsum.photos/seed/manga-${currentChapter.value}-page-2/900/1300`,
    `https://picsum.photos/seed/manga-${currentChapter.value}-page-3/900/1300`,
    `https://picsum.photos/seed/manga-${currentChapter.value}-page-4/900/1300`,
  ]
})


/* =========================
   Previous Chapter
========================= */

function previousChapter() {
  const currentIndex = chapters.indexOf(currentChapter.value)

  if (currentIndex > 0) {
    const previousChapter = chapters[currentIndex - 1]

    if (previousChapter !== undefined) {
      currentChapter.value = previousChapter
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}


/* =========================
   Next Chapter
========================= */

function nextChapter() {
  const currentIndex = chapters.indexOf(currentChapter.value)

  if (currentIndex < chapters.length - 1) {
    const nextChapter = chapters[currentIndex + 1]

    if (nextChapter !== undefined) {
      currentChapter.value = nextChapter
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}


/* =========================
   Select Chapter
========================= */

function changeChapter() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>


<template>

  <div class="reader">

    <!-- =========================
         Header
    ========================== -->

    <header class="reader-header">

      <RouterLink
        :to="`/manga/${mangaId}`"
        class="back-button"
      >
        ← กลับ
      </RouterLink>


      <div class="reader-title">

        <strong>
          {{ mangaTitle }}
        </strong>

        <span>
          ตอนที่ {{ currentChapter }}
        </span>

      </div>


      <RouterLink
        :to="`/manga/${mangaId}`"
        class="detail-button"
      >
        รายละเอียด
      </RouterLink>

    </header>


    <!-- =========================
         Chapter Navigation
    ========================== -->

    <div class="chapter-bar">

      <!-- Previous -->

      <button
        class="navigation-button"
        :disabled="currentChapter === chapters[0]"
        @click="previousChapter"
      >
        ← ตอนก่อนหน้า
      </button>


      <!-- Chapter Select -->

      <select
        v-model="currentChapter"
        class="chapter-select"
        @change="changeChapter"
      >

        <option
          v-for="chapter in chapters"
          :key="chapter"
          :value="chapter"
        >
          ตอนที่ {{ chapter }}
        </option>

      </select>


      <!-- Next -->

      <button
        class="navigation-button"
        :disabled="currentChapter === chapters[chapters.length - 1]"
        @click="nextChapter"
      >
        ตอนถัดไป →
      </button>

    </div>


    <!-- =========================
         Reader Content
    ========================== -->

    <main class="reader-content">

      <!-- Chapter Heading -->

      <div class="chapter-heading">

        <h1>
          {{ mangaTitle }}
        </h1>

        <p>
          ตอนที่ {{ currentChapter }}
        </p>

      </div>


      <!-- =========================
           Manga Pages
      ========================== -->

      <div class="manga-pages">

        <img
          v-for="(page, index) in pages"
          :key="page"
          :src="page"
          :alt="`ตอนที่ ${currentChapter} หน้าที่ ${index + 1}`"
        />

      </div>

    </main>


    <!-- =========================
         Bottom Navigation
    ========================== -->

    <div class="bottom-navigation">

      <!-- Previous -->

      <button
        class="bottom-button"
        :disabled="currentChapter === chapters[0]"
        @click="previousChapter"
      >
        ← ตอนก่อนหน้า
      </button>


      <!-- Chapter Select -->

      <select
        v-model="currentChapter"
        class="chapter-select"
        @change="changeChapter"
      >

        <option
          v-for="chapter in chapters"
          :key="chapter"
          :value="chapter"
        >
          ตอนที่ {{ chapter }}
        </option>

      </select>


      <!-- Next -->

      <button
        class="bottom-button"
        :disabled="currentChapter === chapters[chapters.length - 1]"
        @click="nextChapter"
      >
        ตอนถัดไป →
      </button>

    </div>

  </div>

</template>


<style scoped>

/* =========================
   Reader
========================= */

.reader {
  min-height: 100vh;

  background: #18181b;

  color: white;
}


/* =========================
   Header
========================= */

.reader-header {
  position: sticky;

  top: 0;

  z-index: 20;

  height: 64px;

  padding: 0 5%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: #09090b;

  border-bottom: 1px solid #27272a;
}


.back-button,
.detail-button {
  color: #d4d4d8;

  text-decoration: none;

  font-size: 14px;
}


.back-button:hover,
.detail-button:hover {
  color: white;
}


.detail-button {
  padding: 8px 14px;

  border: 1px solid #3f3f46;

  border-radius: 7px;
}


.reader-title {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 3px;
}


.reader-title span {
  color: #a1a1aa;

  font-size: 12px;
}


/* =========================
   Chapter Bar
========================= */

.chapter-bar {
  position: sticky;

  top: 64px;

  z-index: 15;

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 12px;

  padding: 12px;

  background: #27272a;

  border-bottom: 1px solid #3f3f46;
}


/* =========================
   Navigation Buttons
========================= */

.navigation-button,
.bottom-button {
  padding: 9px 15px;

  border: none;

  border-radius: 7px;

  background: #7c3aed;

  color: white;

  cursor: pointer;

  font-size: 13px;

  transition: 0.2s;
}


.navigation-button:hover:not(:disabled),
.bottom-button:hover:not(:disabled) {
  background: #6d28d9;

  transform: translateY(-1px);
}


.navigation-button:disabled,
.bottom-button:disabled {
  background: #52525b;

  color: #a1a1aa;

  cursor: not-allowed;

  transform: none;
}


/* =========================
   Chapter Select
========================= */

.chapter-select {
  min-width: 160px;

  padding: 9px 12px;

  border: 1px solid #52525b;

  border-radius: 7px;

  background: #18181b;

  color: white;

  outline: none;

  cursor: pointer;
}


.chapter-select:hover {
  border-color: #71717a;
}


.chapter-select:focus {
  border-color: #7c3aed;
}


/* =========================
   Reader Content
========================= */

.reader-content {
  width: 100%;

  padding-bottom: 40px;
}


/* =========================
   Chapter Heading
========================= */

.chapter-heading {
  padding: 35px 20px;

  text-align: center;
}


.chapter-heading h1 {
  margin: 0;

  font-size: 26px;
}


.chapter-heading p {
  margin: 7px 0 0;

  color: #a1a1aa;

  font-size: 15px;
}


/* =========================
   Manga Pages
========================= */

.manga-pages {
  width: 900px;

  max-width: 100%;

  margin: auto;

  background: #000;
}


.manga-pages img {
  display: block;

  width: 100%;

  height: auto;

  margin: 0;

  min-height: 300px;

  object-fit: cover;
}


/* =========================
   Bottom Navigation
========================= */

.bottom-navigation {
  position: sticky;

  bottom: 0;

  z-index: 20;

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 12px;

  padding: 15px;

  background: rgba(9, 9, 11, 0.95);

  border-top: 1px solid #27272a;

  backdrop-filter: blur(8px);
}


/* =========================
   Mobile
========================= */

@media (max-width: 600px) {

  .reader-header {
    padding: 0 15px;
  }


  .reader-title {
    display: none;
  }


  .chapter-bar {
    top: 64px;

    gap: 5px;

    padding: 10px 5px;
  }


  .navigation-button,
  .bottom-button {
    padding: 8px 9px;

    font-size: 11px;
  }


  .chapter-select {
    min-width: 105px;

    padding: 8px;
  }


  .chapter-heading {
    padding: 25px 15px;
  }


  .chapter-heading h1 {
    font-size: 21px;
  }


  .bottom-navigation {
    gap: 5px;

    padding: 10px 5px;
  }

}

</style>