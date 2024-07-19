<template>
    <v-dialog v-model="internalValue" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ task ? 'Изменение задачи' : 'Добавление задачи' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="localTask.title" label="Название" required></v-text-field>
                    <v-textarea v-model="localTask.description" label="Описание" required></v-textarea>
                    <v-select v-model="localTask.priority" :items="priorities" label="Приоритет" required></v-select>
                    <v-select v-model="localTask.status" :items="statuses" label="Статус" required></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Закрыть</v-btn>
                <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'TaskDialogComponent',
    props: {
        value: Boolean,
        task: Object,
        status: String
    },
    data() {
        return {
            internalValue: this.value,
            localTask: this.task ? { ...this.task } : { title: '', description: '', priority: 'Low', status: this.status },
            priorities: ['Low', 'Medium', 'High'],
            statuses: ['To Do', 'In Progress', 'Done']
        };
    },
    watch: {
        value(val) {
            this.internalValue = val;
        },
        status(val) {
            this.localTask.status = val;
        },
        internalValue(val) {
            this.$emit('input', val);
        },
        task(val) {
            this.localTask = val ? { ...val } : { title: '', description: '', priority: 'Low', status: this.status };
        }
    },
    methods: {
        close() {
            this.$emit('close');
            this.resetForm();
        },
        save() {
            this.$emit('save', this.localTask);
            this.resetForm();
        },
        resetForm() {
            this.localTask = { title: '', description: '', priority: 'Low', status: this.status };
        }
    }
};
</script>
