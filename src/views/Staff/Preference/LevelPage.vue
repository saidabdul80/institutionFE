<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div class="bg-white dark:bg-gray-800 relative rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Levels</h2>
                <div class="flex space-x-3">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)"
                            class="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white transition-colors duration-200" />
                    <Button @click="refresh()" type="button" icon="fa fa-refresh"
                            class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200" />
                </div>
            </div>
            <div class="p-6">
                <Table
                    :headers="levelHeaders"
                    :paginationData="levelsPagination"
                    :loading="false"
                    :showPagination="true"
                    @page-change="handlePageChange"
                    @page-length="handlePageLength">

                    <!-- Level Title Column -->
                    <template #td-title="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <InputText v-model="row.title" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else class="font-medium">{{ row.title }}</span>
                        </div>
                    </template>

                    <!-- Actions Column -->
                    <template #td-actions="{ row }">
                        <div class="flex space-x-2">
                            <button v-if="!editingRows || !editingRows[row.id]"
                                    @click="startEdit(row)"
                                    class="text-blue-600 hover:text-blue-800 p-1 rounded"
                                    title="Edit">
                                <i class="fa fa-edit"></i>
                            </button>
                            <div v-else class="flex space-x-2">
                                <button @click="saveEdit(row)"
                                        class="text-green-600 hover:text-green-800 p-1 rounded"
                                        title="Save">
                                    <i class="fa fa-check"></i>
                                </button>
                                <button @click="cancelEdit(row)"
                                        class="text-red-600 hover:text-red-800 p-1 rounded"
                                        title="Cancel">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>
<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { get, post } from '@/api/client';
import { showModal } from '@/plugins/modal';
import Table from '@/components/Table.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';

export default {
    data() {
        return {
            levels: [],
            level: {},
            newLevelDialog: false,
            editLevelDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows: {},
            levelHeaders: [
                { key: 'title', title: 'Level' },
                { key: 'actions', title: 'Actions' }
            ],
            levelsPagination: {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 6,
                    total: 0,
                    from: 1,
                    to: 0
                },
                links: []
            }
        }
    },
    components: {
        InputText,
        Button,
        Table,
        SkeletonLoader
    },
    methods: {
        async fetchRecords() {
            this.tableloading = true;
            const res = await get(`${this.$endpoints.staff.getLevels.url}`);
            this.levels = res;

            // Setup pagination data for Table component
            this.levelsPagination.data = this.levels;
            this.levelsPagination.meta.total = this.levels.length;
            this.levelsPagination.meta.from = 1;
            this.levelsPagination.meta.to = this.levels.length;

            this.tableloading = false;
        },
        async updateLevel(levelData) {
            this.validation = {};
            const res = await post(this.$endpoints.staff.updateLevel.url, levelData);
            if (res) {
                this.fetchRecords();
                this.editLevelDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
                // Clear editing state
                this.editingRows = {};
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        startEdit(row) {
            this.editingRows = { [row.id]: true };
        },
        async saveEdit(row) {
            await this.updateLevel(row);
        },
        cancelEdit(row) {
            this.editingRows = {};
            this.fetchRecords(); // Refresh to restore original data
        },
        handlePageChange(url) {
            // Handle pagination page change
            console.log('Page change:', url);
        },
        handlePageLength(perPage) {
            // Handle rows per page change
            this.levelsPagination.meta.per_page = perPage;
        },
        refresh(){
            this.fetchRecords()
        },
    },
    created() {
        this.fetchRecords();
    }
}
</script>
  
<style scoped>
/* Add your styles here */
</style>
  