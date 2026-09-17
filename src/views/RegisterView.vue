<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

function register() {
  errorMessage.value = ''

  if (
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  // ตอนนี้เป็นการจำลองการสมัครสมาชิก
  // ภายหลังจะเชื่อม Supabase Auth ตรงนี้
  console.log('Username:', username.value)
  console.log('Email:', email.value)
  console.log('Password:', password.value)

  alert('สมัครสมาชิกสำเร็จ')

  router.push('/login')
}

function goLogin() {
  router.push('/login')
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="register-page">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo" @click="goHome">
          MangaVerse
        </div>

        <button class="back-button" @click="goHome">
          กลับหน้าหลัก
        </button>
      </div>
    </header>

    <!-- Register -->
    <main class="register-container">
      <div class="register-card">
        <h1>สมัครสมาชิก</h1>

        <p class="subtitle">
          สร้างบัญชี MangaVerse เพื่อใช้งานฟีเจอร์สำหรับสมาชิก
        </p>

        <form @submit.prevent="register">
          <!-- Username -->
          <div class="form-group">
            <label for="username">ชื่อผู้ใช้</label>

            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">อีเมล</label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="กรอกอีเมลของคุณ"
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">รหัสผ่าน</label>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="กรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร"
            />
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirm-password">ยืนยันรหัสผ่าน</label>

            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
            />
          </div>

          <!-- Error -->
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>

          <!-- Register Button -->
          <button type="submit" class="register-main-button">
            สมัครสมาชิก
          </button>
        </form>

        <!-- Login -->
        <div class="login-section">
          <span>มีบัญชีอยู่แล้ว?</span>

          <button class="login-button" @click="goLogin">
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2026 MangaVerse</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.register-page {
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

.back-button {
  border: none;
  background: transparent;

  color: #555;
  font-size: 14px;

  cursor: pointer;
}

.back-button:hover {
  color: #111;
}

/* Main */
.register-container {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 50px 20px;
}

.register-card {
  width: 100%;
  max-width: 450px;

  background: #ffffff;

  padding: 40px;

  border-radius: 16px;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.register-card h1 {
  margin: 0;

  text-align: center;

  font-size: 30px;
  color: #222;
}

.subtitle {
  margin: 12px 0 30px;

  text-align: center;

  color: #777;

  font-size: 14px;
  line-height: 1.6;
}

/* Form */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  color: #333;

  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  width: 100%;

  padding: 13px 14px;

  border: 1px solid #d8d8d8;
  border-radius: 8px;

  outline: none;

  font-size: 15px;

  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #555;
}

.form-group input::placeholder {
  color: #aaa;
}

/* Error */
.error-message {
  margin: -2px 0 15px;

  color: #d32f2f;

  font-size: 14px;
}

/* Register */
.register-main-button {
  width: 100%;

  padding: 14px;

  border: none;
  border-radius: 8px;

  background: #222;
  color: #ffffff;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition: background 0.2s;
}

.register-main-button:hover {
  background: #444;
}

/* Login */
.login-section {
  margin-top: 25px;

  padding-top: 22px;

  border-top: 1px solid #eeeeee;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  color: #777;

  font-size: 14px;
}

.login-button {
  border: none;
  background: transparent;

  color: #222;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
}

.login-button:hover {
  text-decoration: underline;
}

/* Footer */
.footer {
  padding: 20px;

  text-align: center;

  color: #888;

  font-size: 13px;
}

/* Mobile */
@media (max-width: 600px) {
  .header-inner {
    padding: 15px 18px;
  }

  .logo {
    font-size: 21px;
  }

  .register-container {
    padding: 30px 16px;
  }

  .register-card {
    padding: 30px 22px;
  }

  .register-card h1 {
    font-size: 26px;
  }
}
</style>