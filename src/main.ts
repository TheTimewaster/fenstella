import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import './index.css';
import AppwriteVuePlugin from "./plugins/appwrite";

const app = createApp(App);

app.use(createPinia()).use(router).use(AppwriteVuePlugin);

app.mount("#app");
