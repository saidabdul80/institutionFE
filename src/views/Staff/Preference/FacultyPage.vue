<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full" >
            <div></div>
            <Button label="New Faculty" icon="fa fa-plus" @click="openNewFacultyDialog" class="p-mb-3 place-self-end" />
        </div>
        <div class="bg-white relative">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-900">Faculties</h2>
                <div class="flex space-x-3">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)"
                            class="bg-gray-500 hover:bg-gray-600 text-white" />
                    <Button @click="refresh()" type="button" icon="fa fa-refresh"
                            class="bg-blue-500 hover:bg-blue-600 text-white" />
                </div>
            </div>
            <div class="p-6">
                <Table
                    :headers="headers"
                    :paginationData="faculties"
                    :loading="tableloading"
                    :showPagination="true"
                    @page-change="handlePageChange"
                    @page-length="handlePageLength">

                    <!-- Name Column -->
                    <template #td-name="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <InputText v-model="row.name" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else class="font-medium">{{ row.name }}</span>
                        </div>
                    </template>

                    <!-- Abbreviation Column -->
                    <template #td-abbr="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <InputText v-model="row.abbr" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else class="text-gray-600">{{ row.abbr }}</span>
                        </div>
                    </template>

                    <!-- Status Column -->
                    <template #td-status="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <Dropdown v-model="row.status" :options="['Active', 'Inactive']"
                                     placeholder="Change Status" class="w-full" />
                        </div>
                        <div v-else>
                            <Tag :value="row.deleted_at == null ? 'Active' : 'Inactive'"
                                 :severity="$globals.getStatus(row.deleted_at == null, true)" />
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
        <Dialog header="New Faculty" v-model:visible="newFacultyDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="faculty.name" :class="{ 'p-invalid': validation.name,'w-full':true }" />
                    <small class="p-error" v-if="validation.name">Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="abbr">Abbreviation</label>
                    <InputText id="abbr" v-model="faculty.abbr" :class="{ 'p-invalid': validation.abbr,'w-full':true }" />
                    <small class="p-error" v-if="validation.abbr">Abbreviation is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newFacultyDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createFaculty" />
            </template>
        </Dialog>
    </div>
</template>
<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';     
import { get, post } from '@/api/client';
import { showModal } from '@/plugins/modal';
import Table from '@/components/Table.vue';

export default {
    data() {
        return {
            faculties: [],
            faculty: {},
            newFacultyDialog: false,
            editFacultyDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows:null,
            headers: [
                { key: 'name', title: 'Name' },
                { key: 'abbr', title: 'Abbreviation' },
                { key: 'status', title: 'Status' },
                { key: 'actions', title: 'Actions' }
            ],
        }
    },
    components: {
        InputText,
        Button,
        Table,
        Column, 
        Row       
    },
    methods: {
        startEdit(row) {
            this.editingRows = { [row.id]: true };
        },
        async fetchRecords() {
            this.tableloading = true;
            const res = await get(`${this.$endpoints.staff.getFaculties.url}`);
            this.faculties = res;
            this.tableloading = false;
        },
        async updateFaculty(event) {
            let { newData, index } = event;
            this.validation = {};                    
            const res = await post(this.$endpoints.staff.updateFaculty.url, newData);
            if (res) {
                this.fetchRecords();
                this.editFacultyDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createFaculty() {
            this.validation = {};
            if (!this.faculty.name) {
                this.validation.name = true;
                return;
            }
            if (!this.faculty.abbr) {
                this.validation.abbr = true;
                return;
            }
            const res = await post(this.$endpoints.staff.createFaculty.url, this.faculty);
            this.openNewFacultyDialog = false
            if (res) {
                this.fetchRecords();
                this.newFacultyDialog = false;
                this.$globals.showMessage('Faculty created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create faculty', 'error');
            }
        },
        async deactivateFaculty(faculty) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this faculty?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateFaculty.url, { id: faculty.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Faculty deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateFaculty(faculty) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this faculty?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateFaculty.url, { id: faculty.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Faculty activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewFacultyDialog() {
            this.faculty = {}; // Reset faculty object
            this.newFacultyDialog = true;
        },
        duplicateRecord(faculty) {
            this.faculty = Object.assign({}, faculty); // Clone faculty object
            this.newFacultyDialog = true;
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
  