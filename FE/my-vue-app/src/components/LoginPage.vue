<template>
  <div class="login-page">
    <h2>Вход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    backendUrl: String,
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post(this.backendUrl, {
          username: this.username,
          password: this.password,
        });
        console.log("Ответ от бэкенда:", response.data);
        // Здесь может быть ваша логика для обработки ответа
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        // Здесь можете обработать ошибку (например, показать сообщение об ошибке пользователю)
      }
    },
  },
};
</script>

<style scoped>
/* Стили компонента */
.login-page {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
