<script setup lang="ts">
const mangaList = [
  {
    id: 1,
    title: 'One Piece',
    category: 'Action',
    chapter: 1160,
    status: 'กำลังดำเนินการ',
    cover:
      'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400',
  },
  {
    id: 2,
    title: 'Solo Leveling',
    category: 'Fantasy',
    chapter: 220,
    status: 'จบแล้ว',
    cover:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
  },
  {
    id: 3,
    title: 'Naruto',
    category: 'Action',
    chapter: 700,
    status: 'จบแล้ว',
    cover:
      'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400',
  },
  {
    id: 4,
    title: 'Demon Slayer',
    category: 'Action',
    chapter: 205,
    status: 'จบแล้ว',
    cover:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400',
  },
]
</script>

<template>
  <div class="home">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">
        Manga<span>Verse</span>
      </div>

      <nav>
        <RouterLink to="/">หน้าแรก</RouterLink>
        <RouterLink to="/category">หมวดหมู่</RouterLink>
        <RouterLink to="/bookshelf">ชั้นหนังสือ</RouterLink>
      </nav>

      <div class="nav-right">
        <input
          type="text"
          placeholder="ค้นหามังงะ..."
          class="search"
        />

        <RouterLink to="/login" class="login-btn">
          เข้าสู่ระบบ
        </RouterLink>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <p class="small-title">WELCOME TO MANGAVERSE</p>

        <h1>
          อ่านมังงะที่คุณชอบ<br />
          ได้ทุกที่ ทุกเวลา
        </h1>

        <p class="description">
          เว็บไซต์อ่านมังงะออนไลน์ พร้อมระบบค้นหา
          ชั้นหนังสือ และติดตามตอนล่าสุดที่อ่าน
        </p>

        <div class="hero-buttons">
          <button class="primary-btn">
            เริ่มอ่านมังงะ
          </button>

          <button class="secondary-btn">
            ดูมังงะทั้งหมด
          </button>
        </div>
      </div>
    </section>

    <!-- Main -->
    <main class="main-content">

      <!-- Recommended -->
      <section class="section">
        <div class="section-header">
          <div>
            <p class="section-label">RECOMMENDED</p>
            <h2>มังงะแนะนำ</h2>
          </div>

          <RouterLink to="/category" class="view-all">
            ดูทั้งหมด →
          </RouterLink>
        </div>

        <div class="manga-grid">
          <RouterLink
            v-for="manga in mangaList"
            :key="manga.id"
            :to="`/manga/${manga.id}`"
            class="manga-card"
          >
            <div class="cover-wrapper">
              <img
                :src="manga.cover"
                :alt="manga.title"
                class="cover"
              />
            </div>

            <div class="card-content">
              <span class="category">
                {{ manga.category }}
              </span>

              <h3>{{ manga.title }}</h3>

              <p>
                ตอนล่าสุด {{ manga.chapter }}
              </p>
            </div>
          </RouterLink>
        </div>
      </section>

      <!-- Latest -->
      <section class="section">
        <div class="section-header">
          <div>
            <p class="section-label">LATEST UPDATE</p>
            <h2>อัปเดตล่าสุด</h2>
          </div>
        </div>

        <div class="latest-list">
          <div
            v-for="manga in mangaList"
            :key="`latest-${manga.id}`"
            class="latest-item"
          >
            <img
              :src="manga.cover"
              :alt="manga.title"
            />

            <div class="latest-info">
              <h3>{{ manga.title }}</h3>

              <p>
                {{ manga.category }}
                · {{ manga.status }}
              </p>
            </div>

            <RouterLink
              :to="`/manga/${manga.id}`"
              class="read-btn"
            >
              อ่าน
            </RouterLink>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
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
.home {
  min-height: 100vh;
  background: #f7f7f8;
  color: #18181b;
}

/* Navbar */
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
  white-space: nowrap;
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

/* Hero */
.hero {
  min-height: 430px;
  display: flex;
  align-items: center;
  padding: 60px 7%;
  background:
    linear-gradient(
      90deg,
      #18181b 0%,
      #27272a 60%,
      #3f3f46 100%
    );
  color: white;
}

.hero-content {
  max-width: 650px;
}

.small-title {
  color: #a78bfa;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero h1 {
  margin: 15px 0;
  font-size: 48px;
  line-height: 1.15;
}

.description {
  color: #d4d4d8;
  line-height: 1.7;
  max-width: 550px;
}

.hero-buttons {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.primary-btn,
.secondary-btn {
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.primary-btn {
  border: none;
  background: #7c3aed;
  color: white;
}

.secondary-btn {
  border: 1px solid #71717a;
  background: transparent;
  color: white;
}

/* Main */
.main-content {
  width: 86%;
  max-width: 1300px;
  margin: auto;
}

.section {
  padding: 55px 0 10px;
}

.section-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 25px;
}

.section-label {
  margin: 0 0 5px;
  color: #7c3aed;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.section-header h2 {
  margin: 0;
  font-size: 28px;
}

.view-all {
  color: #7c3aed;
  text-decoration: none;
  font-size: 14px;
}

/* Manga Cards */
.manga-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.manga-card {
  overflow: hidden;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: 0.2s;
}

.manga-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.cover-wrapper {
  height: 280px;
  overflow: hidden;
  background: #eee;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}

.category {
  color: #7c3aed;
  font-size: 12px;
  font-weight: 600;
}

.card-content h3 {
  margin: 7px 0;
  font-size: 18px;
}

.card-content p {
  margin: 0;
  color: #777;
  font-size: 13px;
}

/* Latest */
.latest-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.latest-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}

.latest-item img {
  width: 65px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.latest-info {
  flex: 1;
}

.latest-info h3 {
  margin: 0 0 6px;
}

.latest-info p {
  margin: 0;
  color: #777;
  font-size: 13px;
}

.read-btn {
  padding: 9px 18px;
  background: #7c3aed;
  color: white;
  border-radius: 7px;
  text-decoration: none;
  font-size: 13px;
}

/* Footer */
.footer {
  margin-top: 70px;
  padding: 35px 7%;
  background: #18181b;
  color: #aaa;
}

.footer p {
  font-size: 13px;
}

/* Responsive */
@media (max-width: 900px) {
  .navbar {
    gap: 20px;
    padding: 0 4%;
  }

  .navbar nav {
    display: none;
  }

  .search {
    width: 130px;
  }

  .hero {
    padding: 50px 6%;
  }

  .hero h1 {
    font-size: 38px;
  }

  .manga-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .nav-right .search {
    display: none;
  }

  .manga-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .cover-wrapper {
    height: 220px;
  }

  .hero h1 {
    font-size: 32px;
  }
}
</style>