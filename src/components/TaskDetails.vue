<template>
    <v-dialog v-model="internalValue" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Детальная информация</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <strong>Название:</strong>
                            <p>{{ task.title }}</p>
                        </v-col>
                        <v-col cols="12">
                            <strong>Описание:</strong>
                            <p>{{ task.description }}</p>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <strong>Приоритет:</strong>
                            <p>{{ task.priority }}</p>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <strong>Статус:</strong>
                            <p>{{ task.status }}</p>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <strong>Создано:</strong>
                            <p>{{ formattedDate }}</p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red darken-1" text @click="deleteTask">Удалить</v-btn>
                <v-btn color="blue darken-1" text @click="editTask">Редактировать</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Закрыть</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'TaskDetailsComponent',
    props: {
        value: Boolean,
        task: Object
    },
    data() {
        return {
            internalValue: this.value,
        };
    },
    computed: {
        formattedDate() {
            return new Date(this.task.created_at).toLocaleString();
        }
    },
    watch: {
        value(val) {
            this.internalValue = val;
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        editTask() {
            this.$emit('edit', this.task);
        },
        deleteTask() {
            this.$emit('delete', this.task);
        }
    }
};
</script>