import 'virtual:uno.css';
import { createApp } from 'vue';
import App from './App.vue';
import { setupElementPlus } from './utils/element-plus';

const app = createApp(App);
setupElementPlus(app);
app.mount('#app');