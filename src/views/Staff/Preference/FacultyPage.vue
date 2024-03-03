<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full" >
            <div></div>
            <Button label="New Faculty" icon="fa fa-plus" @click="openNewFacultyDialog" class="p-mb-3 place-self-end" />
        </div>
        <div class="bg-white  relative">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="faculties.data" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" 
                :paginator="true" :rows="6" :totalRecords="faculties.total" :loading="tableloading"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                @page="onPage($event)" :currentPageReportTemplate="`${faculties.from} to ${faculties.to} of ${faculties.total}`" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateFaculty">
                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>
                <Column header="Name">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.name }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.name" />
                    </template>
                </Column>
                <Column header="Abbreviation">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.abbr }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.abbr" />
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.deleted_at == null ? 'Active' : 'Inactive'"
                            :severity="$globals.getStatus(slotProps.data.deleted_at == null, true)" />
                    </template>
                    <template #editor="{ data, field }">
                        <Dropdown v-model="data.status" :options="['Active', 'Inactive']" placeholder="Change Status ">
                        </Dropdown>
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 20px" bodyStyle="text-align:center" class="bg-white"></Column>
                <Column style="width: 100px; min-width: 100px" bodyStyle="text-align:center" class="bg-white">
                    <template #body="slotProps">
                        <div class="flex justify-between">
                            <Button
                                :pt="{ root: { class: 'h-8  w-8 rounded-full flex justify-center items-center hover:ring-[green] hover:bg-[green]/25 hover:text-[green] hover:ring-1 ' } }"
                                icon="fa fa-clone" outlined rounded severity="danger"
                                @click="duplicateRecord(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
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
            editingRows:null
        }
    },
    components: {
        InputText,
        Button,
        DataTable,
        Column, 
        Row       
    },
    methods: {
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
  