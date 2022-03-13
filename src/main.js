import { createApp } from 'vue'
import App from './App.vue';
import VueConfetti from 'vue-confetti';
import axios from 'axios'

// Import Bootstrap an BootstrapVue CSS files (order is important)

let WhitemoonApp = createApp(App);
WhitemoonApp.use(VueConfetti);
WhitemoonApp.config.globalProperties.axios=axios
WhitemoonApp.mount('#app');
