<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div class="grid grid-cols-2 gap-4 place-content-between w-full mb-6" >
            <div></div>
            <Button label="New Course" icon="fa fa-plus" @click="openNewCourseDialog"
                    class="p-mb-3 place-self-end bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors duration-200" />
        </div>
        <div class="bg-white dark:bg-gray-800 relative rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="courses.data" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" lazy
                :paginator="true" :rows="6" :totalRecords="courses.total" :loading="tableloading"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                @page="onPage($event)" :currentPageReportTemplate="`${courses.from} to ${courses.to} of ${courses.total}`" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateCourse">
                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>
                <Column header="Course Name">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.title }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.title" />
                    </template>
                </Column>
                <Column header="Course Code">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.code }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.code" />
                    </template>
                </Column>
                <Column header="Course Category">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.course_category }}</span>
                    </template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.course_category_id" :options="course_categories" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
                </Column>
                <Column header="Department">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.department }}</span>
                    </template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.department_id" :options="departments" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
                </Column>
                <Column header="Level" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.level}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.level_id" :options="levels" optionLabel="title" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>            
                </Column>
                <Column header="TP" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.tp}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.tp" :options="['yes','no']" placeholder="TP"></Dropdown></template>            
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
        <Dialog header="New Course" v-model:visible="newCourseDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Course Name</label>
                    <InputText id="name" v-model="course.title" :class="{ 'p-invalid': validation.title,'w-full':true }" />
                    <small class="p-error" v-if="validation.title">Course Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="code">Course Code</label>
                    <InputText id="code" v-model="course.code" :class="{ 'p-invalid': validation.code,'w-full':true }" />
                    <small class="p-error" v-if="validation.code">Course Code is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label class="block">Course Category</label>
                    <Dropdown :class="{'ring-1 ring-[red]':validation?.course_category_id}" class="w-full" v-model="course.course_category_id" :options="course_categories" optionLabel="name" optionValue="id" />            
                    <span class="text-[red]" v-if="validation?.course_category_id">Field is required</span>
                </div>
                <div class="p-field mb-3">
                    <label class="block">Department</label>
                    <Dropdown :class="{'ring-1 ring-[red]':validation?.department_id}" class="w-full" v-model="course.department_id" :options="departments" optionLabel="name" optionValue="id" />            
                    <span class="text-[red]" v-if="validation?.department_id">Field is required</span>
                </div>
                <div class="">
                    <label class="block">Level</label>
                    <Dropdown :class="{'ring-1 ring-[red]':validation?.level_id}" class="w-full" v-model="course.level_id" :options="levels" optionLabel="title" optionValue="id" />            
                    <span class="text-[red]" v-if="validation?.level_id">Field is required</span>
                </div>
                <div class="p-field mb-3">
                    <label for="credit_unit">Course Credit Unit</label>
                    <InputText id="credit_unit" v-model="course.credit_unit" :class="{ 'p-invalid': validation.credit_unit,'w-full':true }" />
                    <small class="p-error" v-if="validation.code">Course Credit Unit is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="tp">TP</label>                    
                    <Dropdown  v-model="course.tp" :options="['yes','no']" placeholder="TP"></Dropdown>
                    <small class="p-error" v-if="validation.code"></small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newCourseDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createCourse" />
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
import userDataMixin from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            newCourseDialog: false,
            courses: [],
            course: {},
            editCourseDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows:null,
            departments:[],
            levels:[],
            course_categories:[],
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
            const res = await get(`${this.$endpoints.staff.getCourses.url}`);
            this.courses = res;
            this.tableloading = false;
        },    
        async updateCourse(event) {
            let { newData, index } = event;
            this.validation = {};            
            delete newData.department;
            const res = await post(this.$endpoints.staff.updateCourse.url, newData);
            if (res) {
                this.fetchRecords();
                this.editCourseDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createCourse() {
            this.validation = {};
            if (!this.course.title) {
                this.validation.title = true;
                return;
            }
            if (!this.course.code) {
                this.validation.code = true;
                return;
            }            
            const res = await post(this.$endpoints.staff.createCourse.url, this.course);
            this.newCourseDialog = false;            
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Course created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create course', 'error');
            }
        },
        async deactivateCourse(course) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this course?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateCourse.url, { id: course.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Course deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateCourse(course) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this course?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateCourse.url, { id: course.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('Course activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewCourseDialog() {
            this.course = {}; // Reset course object
            this.newCourseDialog = true;
        },
        duplicateRecord(course) {
            this.course = Object.assign({}, course); // Clone course object
            this.newCourseDialog = true;
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
        },        
        refresh(){            
            this.fetchRecords()
        },
    },
    async created() {
        
        this.course_categories = this.schoolCourseCategories
        this.levels = this.schoolLevels
        this.fetchRecords();         
    },
    mounted(){
        this.departments = this.schoolDepartments
    }

}
</script>
  
<style scoped>
/* Add your styles here */
</style>
  