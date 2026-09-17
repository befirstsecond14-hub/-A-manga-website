<script setup lang="ts">

/* =========================
   Manga Information
========================= */

const manga = {
  id: 1,
  title: 'One Piece',
  author: 'Eiichiro Oda',
  category: 'Action',
  status: 'กำลังดำเนินการ',
  country: 'ญี่ปุ่น',
  rating: 4.8,

  description:
    'เรื่องราวการผจญภัยของกลุ่มโจรสลัดหมวกฟาง ที่ออกเดินทางตามหาสมบัติ One Piece และมุ่งสู่การเป็นราชาโจรสลัด',

  cover:
    'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=500',
}


/* =========================
   Chapter List
   ตอนที่ 1 - 100
========================= */

const chapters = Array.from(
  { length: 100 },
  (_, index) => ({
    number: index + 1,
    title: `การผจญภัยบทที่ ${index + 1}`,
  })
)

</script>


<template>

  <div class="page">


    <!-- =========================
         Navbar
    ========================== -->

    <header class="navbar">

      <RouterLink
        to="/"
        class="logo"
      >
        Manga<span>Verse</span>
      </RouterLink>


      <nav>

        <RouterLink to="/">
          หน้าแรก
        </RouterLink>

        <RouterLink to="/category">
          หมวดหมู่
        </RouterLink>

        <RouterLink to="/bookshelf">
          ชั้นหนังสือ
        </RouterLink>

      </nav>


      <div class="nav-right">

        <input
          class="search"
          type="text"
          placeholder="ค้นหามังงะ..."
        />

        <RouterLink
          to="/login"
          class="login-btn"
        >
          เข้าสู่ระบบ
        </RouterLink>

      </div>

    </header>



    <!-- =========================
         Manga Detail
    ========================== -->

    <main class="container">


      <!-- Back -->

      <RouterLink
        to="/"
        class="back"
      >
        ← กลับหน้าแรก
      </RouterLink>



      <section class="detail">


        <!-- =========================
             Cover
        ========================== -->

        <div class="cover-box">

          <img
            :src="manga.cover"
            :alt="manga.title"
          />

        </div>



        <!-- =========================
             Information
        ========================== -->

        <div class="info">


          <span class="category">
            {{ manga.category }}
          </span>


          <h1>
            {{ manga.title }}
          </h1>


          <div class="rating">
            ★ {{ manga.rating }}
          </div>


          <p class="description">
            {{ manga.description }}
          </p>



          <div class="information">

            <p>
              <strong>ผู้แต่ง:</strong>
              {{ manga.author }}
            </p>


            <p>
              <strong>ประเทศ:</strong>
              {{ manga.country }}
            </p>


            <p>
              <strong>สถานะ:</strong>
              {{ manga.status }}
            </p>

          </div>



          <!-- =========================
               Buttons
          ========================== -->

          <div class="buttons">


            <!-- อ่านตอนล่าสุด = ตอน 100 -->

            <RouterLink
              :to="`/manga/${manga.id}/chapter/100`"
              class="read-button"
            >
              อ่านตอนล่าสุด
            </RouterLink>


            <button
              class="save-button"
            >
              + เพิ่มเข้าชั้นหนังสือ
            </button>


          </div>

        </div>

      </section>



      <!-- =========================
           Chapters
      ========================== -->

      <section class="chapters">


        <div class="chapter-header">

          <h2>
            ตอนทั้งหมด
          </h2>


          <span>
            {{ chapters.length }} ตอน
          </span>

        </div>



        <div class="chapter-list">


          <RouterLink
            v-for="chapter in chapters"
            :key="chapter.number"
            :to="`/manga/${manga.id}/chapter/${chapter.number}`"
            class="chapter"
          >


            <div>

              <strong>
                ตอนที่ {{ chapter.number }}
              </strong>


              <p>
                {{ chapter.title }}
              </p>

            </div>


            <span class="arrow">
              →
            </span>


          </RouterLink>


        </div>

      </section>


    </main>



    <!-- =========================
         Footer
    ========================== -->

    <footer class="footer">

      <div class="logo">
        Manga<span>Verse</span>
      </div>


      <p>
        MangaVerse — Online Manga Reading System
      </p>

    </footer>


  </div>

</template>


<style scoped>

/* =========================
   Page
========================= */

.page {
  min-height: 100vh;

  background: #f7f7f8;

  color: #18181b;
}


/* =========================
   Navbar
========================= */

.navbar {
  height: 72px;

  padding: 0 7%;

  display: flex;

  align-items: center;

  gap: 45px;

  background: white;

  border-bottom: 1px solid #e5e5e5;
}


.logo {
  font-size: 25px;

  font-weight: 800;

  color: #18181b;

  text-decoration: none;
}


.logo span {
  color: #7c3aed;
}


.navbar nav {
  display: flex;

  gap: 28px;

  flex: 1;
}


.navbar nav a {
  color: #555;

  text-decoration: none;

  font-size: 15px;
}


.navbar nav a:hover {
  color: #7c3aed;
}


/* =========================
   Navbar Right
========================= */

.nav-right {
  display: flex;

  align-items: center;

  gap: 12px;
}


.search {
  width: 190px;

  padding: 10px 14px;

  border: 1px solid #ddd;

  border-radius: 8px;

  outline: none;
}


.search:focus {
  border-color: #7c3aed;
}


.login-btn {
  padding: 10px 17px;

  background: #7c3aed;

  color: white;

  border-radius: 8px;

  text-decoration: none;

  font-size: 14px;
}


.login-btn:hover {
  background: #6d28d9;
}


/* =========================
   Container
========================= */

.container {
  width: 86%;

  max-width: 1100px;

  margin: auto;

  padding: 35px 0 70px;
}


.back {
  display: inline-block;

  margin-bottom: 30px;

  color: #666;

  text-decoration: none;

  font-size: 14px;
}


.back:hover {
  color: #7c3aed;
}


/* =========================
   Manga Detail
========================= */

.detail {
  display: grid;

  grid-template-columns: 280px 1fr;

  gap: 45px;

  padding: 35px;

  background: white;

  border: 1px solid #e5e5e5;

  border-radius: 12px;
}


/* =========================
   Cover
========================= */

.cover-box {
  width: 280px;

  height: 390px;

  overflow: hidden;

  border-radius: 8px;

  background: #eee;
}


.cover-box img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}


/* =========================
   Information
========================= */

.info {
  padding-top: 5px;
}


.category {
  color: #7c3aed;

  font-size: 13px;

  font-weight: 700;
}


.info h1 {
  margin: 10px 0;

  font-size: 40px;
}


.rating {
  margin-bottom: 20px;

  color: #eab308;

  font-weight: 700;
}


.description {
  max-width: 650px;

  color: #666;

  line-height: 1.8;
}


.information {
  margin-top: 25px;

  color: #555;
}


.information p {
  margin: 8px 0;
}


.information strong {
  color: #18181b;
}


/* =========================
   Buttons
========================= */

.buttons {
  display: flex;

  gap: 12px;

  margin-top: 30px;
}


.read-button,
.save-button {
  padding: 12px 20px;

  border-radius: 8px;

  font-size: 14px;

  cursor: pointer;
}


.read-button {
  background: #7c3aed;

  color: white;

  text-decoration: none;
}


.read-button:hover {
  background: #6d28d9;
}


.save-button {
  border: 1px solid #ddd;

  background: white;

  color: #333;
}


.save-button:hover {
  border-color: #7c3aed;

  color: #7c3aed;
}


/* =========================
   Chapters
========================= */

.chapters {
  margin-top: 45px;
}


.chapter-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 18px;
}


.chapter-header h2 {
  margin: 0;

  font-size: 25px;
}


.chapter-header span {
  color: #777;

  font-size: 14px;
}


/* =========================
   Chapter List
========================= */

.chapter-list {
  display: flex;

  flex-direction: column;

  gap: 8px;
}


.chapter {
  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 17px 20px;

  background: white;

  border: 1px solid #e5e5e5;

  border-radius: 8px;

  color: #18181b;

  text-decoration: none;

  transition: 0.2s;
}


.chapter:hover {
  border-color: #7c3aed;

  transform: translateX(3px);
}


.chapter strong {
  font-size: 15px;
}


.chapter p {
  margin: 5px 0 0;

  color: #777;

  font-size: 13px;
}


.arrow {
  color: #7c3aed;

  font-size: 20px;
}


/* =========================
   Footer
========================= */

.footer {
  padding: 35px 7%;

  background: #18181b;

  color: #aaa;
}


.footer p {
  font-size: 13px;
}


/* =========================
   Responsive
========================= */

@media (max-width: 800px) {

  .navbar {
    padding: 0 4%;
  }


  .navbar nav {
    display: none;
  }


  .nav-right {
    gap: 6px;
  }


  .search {
    width: 140px;
  }


  .detail {
    grid-template-columns: 1fr;

    padding: 25px;
  }


  .cover-box {
    width: 220px;

    height: 310px;
  }


  .info h1 {
    font-size: 32px;
  }

}


@media (max-width: 500px) {

  .search {
    display: none;
  }


  .container {
    width: 92%;
  }


  .detail {
    padding: 20px;
  }


  .cover-box {
    width: 180px;

    height: 260px;
  }


  .info h1 {
    font-size: 28px;
  }


  .buttons {
    flex-direction: column;
  }


  .read-button,
  .save-button {
    text-align: center;
  }

}

</style>