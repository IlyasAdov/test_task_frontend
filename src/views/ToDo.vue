<template>
    <v-container>
        <v-row class="d-flex justify-space-between align-center mb-5">
            <h1>ToDo's</h1>
            <v-btn class="bg-red-lighten-1" @click="logout">Выйти</v-btn>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6" md="4">
                <v-select v-model="filterPriority" :items="['All', ...priorities]" label="Фильтр приоритета"
                    clearable></v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6" md="4">
                <v-card>
                    <v-card-title>
                        <div>To Do</div>
                    </v-card-title>
                    <v-card-text>
                        <draggable class="list-group" v-model="filteredTasksToDo" group="tasks" item-key="id"
                            @end="onDragEnd" :data-status="'To Do'">
                            <template #item="{ element }">
                                <v-card class="mb-2" :data-id="element.id" @click="viewTaskDetails(element)">
                                    <v-card-title>{{ element.title }}</v-card-title>
                                    <v-card-text>{{ element.description }}</v-card-text>
                                </v-card>
                            </template>
                        </draggable>
                    </v-card-text>
                    <v-btn class="w-100" @click="openTaskDialog('To Do')">Добавить задачу</v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card>
                    <v-card-title>
                        <div>In Progress</div>
                    </v-card-title>
                    <v-card-text>
                        <draggable class="list-group" v-model="filteredTasksInProgress" group="tasks" item-key="id"
                            @end="onDragEnd" :data-status="'In Progress'">
                            <template #item="{ element }">
                                <v-card class="mb-2" :data-id="element.id" @click="viewTaskDetails(element)">
                                    <v-card-title>{{ element.title }}</v-card-title>
                                    <v-card-text>{{ element.description }}</v-card-text>
                                </v-card>
                            </template>
                        </draggable>
                    </v-card-text>
                    <v-btn class="w-100" @click="openTaskDialog('In Progress')">Добавить задачу</v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card>
                    <v-card-title>
                        <div>Done</div>
                    </v-card-title>
                    <v-card-text>
                        <draggable class="list-group" v-model="filteredTasksDone" group="tasks" item-key="id"
                            @end="onDragEnd" :data-status="'Done'">
                            <template #item="{ element }">
                                <v-card class="mb-2" :data-id="element.id" @click="viewTaskDetails(element)">
                                    <v-card-title>{{ element.title }}</v-card-title>
                                    <v-card-text>{{ element.description }}</v-card-text>
                                </v-card>
                            </template>
                        </draggable>
                    </v-card-text>
                    <v-btn class="w-100" @click="openTaskDialog('Done')">Добавить задачу</v-btn>
                </v-card>
            </v-col>
        </v-row>
        <task-dialog :status="newTaskStatus" :value="dialog" :task="selectedTask" @close="dialog = false"
            @save="saveTask" />
        <task-details :value="detailsDialog" :task="selectedTask" @close="detailsDialog = false" @edit="openTaskEdit"
            @delete="deleteTask" />
    </v-container>
</template>

<script>
import axios from '@/plugins/axios';
import draggable from 'vuedraggable';
import TaskDialog from '@/components/TaskDialog.vue';
import TaskDetails from '@/components/TaskDetails.vue';

export default {
    name: 'ToDoView',
    components: { draggable, TaskDialog, TaskDetails },
    data() {
        return {
            dialog: false,
            detailsDialog: false,
            tasksToDo: [],
            tasksInProgress: [],
            tasksDone: [],
            newTaskStatus: '',
            selectedTask: null,
            filterPriority: 'All',
            priorities: ['Low', 'Medium', 'High'],
        };
    },
    computed: {
        filteredTasksToDo() {
            return this.filterTasks(this.tasksToDo);
        },
        filteredTasksInProgress() {
            return this.filterTasks(this.tasksInProgress);
        },
        filteredTasksDone() {
            return this.filterTasks(this.tasksDone);
        }
    },
    created() {
        this.fetchTasks();
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
        },
        async fetchTasks() {
            try {
                const response = await axios.get('/tasks');
                this.tasksToDo = response.data.filter(task => task.status === 'To Do');
                this.tasksInProgress = response.data.filter(task => task.status === 'In Progress');
                this.tasksDone = response.data.filter(task => task.status === 'Done');
            } catch (error) {
                console.error('Не удалось получить задачи:', error);
            }
        },
        async onDragEnd(event) {
            const movedTaskId = event.item.dataset.id;
            const newStatus = event.to ? event.to.dataset.status : null;
            if (!movedTaskId || !newStatus) {
                console.error('Не найден идентификатор задачи или новый статус');
                return;
            }
            try {
                await axios.patch(`/tasks/${movedTaskId}`, { status: newStatus });
                this.fetchTasks();
            } catch (error) {
                console.error('Ошибка обновления статуса задачи:', error);
            }
        },
        openTaskDialog(status) {
            this.newTaskStatus = status;
            this.selectedTask = null;
            this.dialog = true;
        },
        async saveTask(task) {
            try {
                if (this.selectedTask) {
                    await axios.put(`/tasks/${this.selectedTask.id}`, task);
                } else {
                    await axios.post('/tasks', task);
                }
                await this.fetchTasks();
                this.dialog = false;
            } catch (error) {
                console.error('Не удалось сохранить задачу:', error);
            }
        },
        viewTaskDetails(task) {
            this.selectedTask = task;
            this.detailsDialog = true;
        },
        openTaskEdit(task) {
            this.selectedTask = task;
            this.newTaskStatus = task.status;
            this.detailsDialog = false;
            this.dialog = true;
        },
        async deleteTask(task) {
            try {
                await axios.delete(`/tasks/${task.id}`);
                this.fetchTasks();
                this.detailsDialog = false;
            } catch (error) {
                console.error('Не удалось удалить задачу:', error);
            }
        },
        filterTasks(tasks) {
            if (this.filterPriority === 'All') {
                return tasks;
            }
            return tasks.filter(task => task.priority === this.filterPriority);
        }
    }
};
</script>
