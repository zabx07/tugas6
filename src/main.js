import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000'; // Ganti "http://localhost:3000" sesuai dengan URL server Anda

createApp(App).mount('#app');
