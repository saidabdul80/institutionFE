<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div class="grid grid-cols-2 gap-4 place-content-between w-full mb-6" >
            <div></div>
            <Button label="New session" icon="fa fa-plus" @click="openNewSessionDialog"
                    class="p-mb-3 place-self-end bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200" />
        </div>
        <div class="bg-white dark:bg-gray-800 relative rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Sessions</h2>
                <div class="flex space-x-3">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)"
                            class="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white transition-colors duration-200" />
                    <Button @click="refresh()" type="button" icon="fa fa-refresh"
                            class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200" />
                </div>
            </div>
            <div class="p-6">
                <Table
                    :headers="sessionHeaders"
                    :paginationData="sessionsPagination"
                    :loading="false"
                    :showPagination="true"
                    @page-change="handlePageChange"
                    @page-length="handlePageLength">

                    <!-- Session Name Column -->
                    <template #td-name="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <InputText v-model="row.name" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else class="font-medium">{{ row.name }}</span>
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
                            <button @click="duplicateRecord(row)"
                                    class="text-green-600 hover:text-green-800 p-1 rounded ml-2"
                                    title="Duplicate">
                                <i class="fa fa-clone"></i>
                            </button>
                        </div>
                    </template>
                </Table>
            </div>
        </div>
        <Dialog header="New session" v-model:visible="newSessionDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="session.name" :class="{ 'p-invalid': validation.name,'w-full':true }" />
                    <small class="p-error" v-if="validation.name">Name is required.</small>
                </div>        
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newSessionDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createSession" />
            </template>
        </Dialog>
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
            sessions: [],
            session: {},
            newSessionDialog: false,
            editSessionDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows: {},
            sessionHeaders: [
                { key: 'name', title: 'Session' },
                { key: 'actions', title: 'Actions' }
            ],
            sessionsPagination: {
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
            const res = await get(`${this.$endpoints.staff.getAllSessions.url}`);
            this.sessions = res;

            // Setup pagination data for Table component
            this.sessionsPagination.data = this.sessions;
            this.sessionsPagination.meta.total = this.sessions.length;
            this.sessionsPagination.meta.from = 1;
            this.sessionsPagination.meta.to = this.sessions.length;

            this.tableloading = false;
        },
        async updateSession(sessionData) {
            this.validation = {};
            const res = await post(this.$endpoints.staff.updateSession.url, sessionData);
            if (res) {
                this.fetchRecords();
                this.editSessionDialog = false;
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
            await this.updateSession(row);
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
            this.sessionsPagination.meta.per_page = perPage;
        },
        async createSession() {
            this.validation = {};
            if (!this.session.min_score) {
                this.validation.min_score = true;
                return;
            }
            if (!this.session.max_score) {
                this.validation.max_score = true;
                return;
            }
            if (!this.session.grade) {
                this.validation.grade = true;
                return;
            }
            if (!this.session.grade_point) {
                this.validation.grade_point = true;
                return;
            }
            const res = await post(this.$endpoints.staff.createSession.url, this.session);
            this.openNewradingDialog = false
            if (res) {
                this.fetchRecords();
                this.newSessionDialog = false;
                this.$globals.showMessage('session created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create session', 'error');
            }
        },
        async deactivateSession(session) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this session?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateSession.url, { id: session.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('session deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateSession(session) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this session?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateSession.url, { id: session.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('session activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewSessionDialog() {
            this.session = {}; // Reset session object
            this.newSessionDialog = true;
        },
        duplicateRecord(session) {
            this.session = Object.assign({}, session); // Clone session object
            this.newSessionDialog = true;
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
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
  