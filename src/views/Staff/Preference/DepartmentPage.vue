<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div class="grid grid-cols-2 gap-4 place-content-between w-full mb-6" >
            <div></div>
            <Button label="New Department" icon="fa fa-plus" @click="openNewDepartmentDialog"
                    class="p-mb-3 place-self-end bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200" />
        </div>
        <div class="bg-white dark:bg-gray-800 relative rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="departments.data" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" lazy
                :paginator="true" :rows="6" :totalRecords="departments.total" :loading="tableloading"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                @page="onPage($event)" :currentPageReportTemplate="`${departments.from} to ${departments.to} of ${departments.total}`" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateDepartment">
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
                <Column header="Faculty">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.faculty }}</span>
                    </template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.faculty_id" :options="faculties" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
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
        <Dialog header="New Department" v-model:visible="newDepartmentDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                        <label class="block">Faculty</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.faculty_id}" class="w-full" v-model="department.faculty_id" @change="onSelectFaculty($event)" :options="faculties" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.faculty_id">Field is required</span>
                    </div>
                <div class="p-field mb-3">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="department.name" :class="{ 'p-invalid': validation.name,'w-full':true }" />
                    <small class="p-error" v-if="validation.name">Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="abbr">Abbreviation</label>
                    <InputText id="abbr" v-model="department.abbr" :class="{ 'p-invalid': validation.abbr,'w-full':true }" />
                    <small class="p-error" v-if="validation.abbr">Abbreviation is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newDepartmentDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createDepartment" />
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
            departments: [],
            department: {},
            newDepartmentDialog: false,
            editDepartmentDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows:null,
            faculties:[]
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
            const res = await get(`${this.$endpoints.staff.getDepartments.url}`);
            this.departments = res;
            this.tableloading = false;
        },    
        async updateDepartment(event) {
            let { newData, index } = event;
            this.validation = {};            
            delete newData.faculty;
            const res = await post(this.$endpoints.staff.updateDepartment.url, newData);
            if (res) {
                this.fetchRecords();
                this.editDepartmentDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createDepartment() {
            this.validation = {};
            if (!this.department.name) {
                this.validation.name = true;
                return;
            }
            if (!this.department.abbr) {
                this.validation.abbr = true;
                return;
            }            
            const res = await post(this.$endpoints.staff.createDepartment.url, this.department);
            this.openNewDepartmentDialog = false
            if (res) {
                this.fetchRecords();
                this.newDepartmentDialog = false;
                this.$globals.showMessage('Department created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create department', 'error');
            }
        },
        async deactivateDepartment(department) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this department?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateDepartment.url, { id: department.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Department deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateDepartment(department) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this department?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateDepartment.url, { id: department.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Department activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewDepartmentDialog() {
            this.department = {}; // Reset department object
            this.newDepartmentDialog = true;
        },
        duplicateRecord(department) {
            this.department = Object.assign({}, department); // Clone department object
            this.newDepartmentDialog = true;
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
        },        
        refresh(){            
            this.fetchRecords()
        },
    },
    created() {
        this.faculties = this.$globals.school_info?.faculties
        this.fetchRecords();
    }
}
</script>
  
<style scoped>
/* Add your styles here */
</style>
  