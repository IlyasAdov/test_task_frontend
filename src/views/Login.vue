<template>
    <v-container>
        <h3 class="text-center my-5">Авторизация</h3>
        <v-form v-model="valid" @submit.prevent="login">
            <v-text-field v-model="email" label="Почта" :rules="[rules.required, rules.email]"></v-text-field>
            <v-text-field v-model="password" label="Пароль" type="password" :rules="[rules.required]"></v-text-field>
            <div class="text-center"><v-btn class="center" :disabled="!valid" type="submit">Войти</v-btn></div>
        </v-form>
    </v-container>
</template>

<script>
import axios from '@/plugins/axios'

export default {
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: '',
            valid: false,
            rules: {
                required: (value) => !!value || 'Required.',
                email: (value) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
            },
        }
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('/login', {
                    email: this.email,
                    password: this.password,
                })
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user_id', response.data.user_id);
                this.$router.push('/')
            } catch (error) {
                console.error('Ошибка авторизации:', error)
            }
        },
    },
}
</script>