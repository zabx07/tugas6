<template>
  <div class="app-container">
    <form @submit.prevent="save" class="form-container">
      <input type="text" v-model="form.title" placeholder="Title" class="input-field" />
      <br />
      <textarea v-model="form.content" placeholder="Content" class="textarea-field"></textarea>
      <br />
      <button type="submit" class="save-button">Save</button>
    </form>
    <ul class="articles-list">
      <li v-for="article in articles" :key="article.id" class="article-item">
        <div class="article-content">
          <strong>{{ article.title }}</strong>
          <br />
          <p>{{ article.content }}</p>
        </div>
        <div class="article-buttons">
          <button @click="edit(article)" class="edit-button">Edit</button>
          <button @click="remove(article.id)" class="delete-button">Delete</button>
        </div>
      </li>
    </ul>
    <button @click="load" class="load-button">Load</button>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const form = reactive({
      id: null,
      title: '',
      content: ''
    });
    const articles = ref([]);

    async function load() {
      try {
        const response = await axios.get('http://localhost:3000/articles');
        articles.value = response.data;
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    }

    async function save() {
      try {
        const url = form.id? `http://localhost:3000/articles/${form.id}` : 'http://localhost:3000/articles';
        const method = form.id? 'put' : 'post';
        const response = await axios[method](url, form);

        if (form.id) {
          articles.value = articles.value.map((article) =>
            article.id === response.data.id? response.data : article
          );
        } else {
          articles.value.push(response.data);
        }

        form.id = null;
        form.title = '';
        form.content = '';
      } catch (error) {
        console.error('Error saving article:', error);
      }
    }

    async function remove(id) {
  console.log('Deleting article with id:', id);
  try {
    if (!id) {
      console.error('Error deleting article: Invalid ID');
      return;
    }
    const response = await axios.delete(`http://localhost:3000/articles/${id}`);
    console.log('Delete response:', response);
    if (response.status === 200) {
      articles.value = articles.value.filter(article => article.id !== id);
    } else {
      console.error('Error deleting article: Unexpected response status', response.status);
    }
  } catch (error) {
    console.error('Error deleting article:', error);
  }
}

    function edit(article) {
      form.id = article.id;
      form.title = article.title;
      form.content = article.content;
    }

    onMounted(load);

    return { form, articles, save, remove, edit, load };
  }
}
</script>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f3e5f5;
  border-radius: 10px;
}

.form-container {
  margin-bottom: 20px;
}

.input-field,
.textarea-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ce93d8;
  border-radius: 5px;
}

.save-button,
.load-button {
  background-color: #7b1fa2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover,
.load-button:hover {
  background-color: #4a148c;
}

.articles-list {
  list-style-type: none;
  padding: 0;
}

.article-item {
  background-color: #e1bee7;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-content {
  flex-grow: 1;
}

.article-buttons {
  display: flex;
  gap: 10px;
}

.edit-button {
  background-color: #ab47bc;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #8e24aa;
}

.delete-button {
  background-color: #e53935;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c62828;
}
</style>
