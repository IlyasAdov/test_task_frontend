import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Импортируйте глобальные стили Vuetify

// Импортируйте необходимые компоненты Vuetify
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VTextarea,
  VSelect,
  VBtn,
  VDialog,
  VForm,
  VSpacer,
} from 'vuetify/components';

// Создайте экземпляр Vuetify с выбранными компонентами
export default createVuetify({
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VTextField,
    VTextarea,
    VSelect,
    VBtn,
    VDialog,
    VForm,
    VSpacer,
  },
});