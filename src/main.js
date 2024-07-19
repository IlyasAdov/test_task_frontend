import './plugins/axios'
import vuetify from './plugins/vuetify'
import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

createApp(App).use(router).use(vuetify).mount('#app')
