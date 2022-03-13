const { createApp } = require('vue');
import App from './App.vue';
import VueConfetti from 'vue-confetti';

// Import Bootstrap an BootstrapVue CSS files (order is important)

let WhitemoonApp = createApp(App);
WhitemoonApp.use(VueConfetti);
WhitemoonApp.mount('#app');
