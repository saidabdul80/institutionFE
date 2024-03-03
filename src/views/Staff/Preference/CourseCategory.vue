<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full" >
            <div></div>
            <Button label="New Course Category" icon="fa fa-plus" @click="openNewCourseCategoryDialog" class="p-mb-3 place-self-end" />
        </div>
        <div class="bg-white  relative">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="course_categories.data" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" 
                :paginator="true" :rows="6" :totalRecords="course_categories.total" :loading="tableloading"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                @page="onPage($event)" :currentPageReportTemplate="`${course_categories.from} to ${course_categories.to} of ${course_categories.total}`" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateCourseCategory">
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
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.short_name }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.short_name" />
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
        <Dialog header="New Course Category" v-model:visible="newCourseCategoryDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="course_category.name" :class="{ 'p-invalid': validation.name,'w-full':true }" />
                    <small class="p-error" v-if="validation.name">Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="short_name">Abbreviation</label>
                    <InputText id="short_name" v-model="course_category.short_name" :class="{ 'p-invalid': validation.short_name,'w-full':true }" />
                    <small class="p-error" v-if="validation.short_name">Abbreviation is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newCourseCategoryDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createCourseCategory" />
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
            course_categories: [],
            course_category: {},
            newCourseCategoryDialog: false,
            editCourseCategoryDialog: false,
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
            const res = await get(`${this.$endpoints.staff.getCourseCategories.url}`);
            this.course_categories = res;
            this.tableloading = false;
        },
        async updateCourseCategory(event) {
            let { newData, index } = event;
            this.validation = {};                    
            const res = await post(this.$endpoints.staff.updateCourseCategory.url, newData);
            if (res) {
                this.fetchRecords();
                this.editCourseCategoryDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createCourseCategory() {
            this.validation = {};
            if (!this.course_category.name) {
                this.validation.name = true;
                return;
            }
            if (!this.course_category.short_name) {
                this.validation.short_name = true;
                return;
            }
            const res = await post(this.$endpoints.staff.createCourseCategory.url, this.course_category);
            this.openNewCourseCategoryDialog = false
            if (res) {
                this.fetchRecords();
                this.newCourseCategoryDialog = false;
                this.$globals.showMessage('Course Category created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create course_category', 'error');
            }
        },
        async deactivateCourseCategory(course_category) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this course_category?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateCourseCategory.url, { id: course_category.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Course Category deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateCourseCategory(course_category) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this course_category?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateCourseCategory.url, { id: course_category.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Course Category activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewCourseCategoryDialog() {
            this.course_category = {}; // Reset course_category object
            this.newCourseCategoryDialog = true;
        },
        duplicateRecord(course_category) {
            this.course_category = Object.assign({}, course_category); // Clone course_category object
            this.newCourseCategoryDialog = true;
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
  