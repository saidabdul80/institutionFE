<template>
    <div class="programme-courses-container p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <!-- Header Section -->
        <div class="header-section bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200 mb-6">
            <div class="header-content p-6">
                <div class="header-text">
                    <h1 class="page-title text-gray-800 dark:text-white transition-colors duration-200">
                        <i class="fas fa-graduation-cap text-primary"></i>
                        Programme Courses Management
                    </h1>
                    <p class="page-subtitle text-gray-600 dark:text-gray-300 transition-colors duration-200">Manage course assignments for academic programmes across different levels and semesters</p>
                </div>
                <div class="header-actions">
                    <Button
                        icon="pi pi-download"
                        label="Export"
                        severity="success"
                        outlined
                        @click="exportData"
                        class="mr-2"
                    />
                    <Button
                        icon="pi pi-plus"
                        label="Assign Courses"
                        severity="primary"
                        @click="showAssignDialog = true"
                    />
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-section">
            <div class="stats-grid">
                <div class="stat-card stat-primary">
                    <div class="stat-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ totalProgrammes }}</div>
                        <div class="stat-label">Total Programmes</div>
                    </div>
                </div>
                <div class="stat-card stat-success">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ totalCourses }}</div>
                        <div class="stat-label">Total Courses</div>
                    </div>
                </div>
                <div class="stat-card stat-info">
                    <div class="stat-icon">
                        <i class="fas fa-link"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ totalAssignments }}</div>
                        <div class="stat-label">Course Assignments</div>
                    </div>
                </div>
                <div class="stat-card stat-warning">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ currentSession }}</div>
                        <div class="stat-label">Current Session</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters Section -->
        <div class="filters-section">
            <Card class="filter-card">
                <template #title>
                    <div class="flex items-center">
                        <i class="fas fa-filter text-primary mr-2"></i>
                        Filter & Search
                    </div>
                </template>
                <template #content>
                    <div class="filter-grid">
                        <div class="filter-group">
                            <label class="filter-label">Search Programmes</label>
                            <IconField iconPosition="left">
                                <InputIcon class="pi pi-search" />
                                <InputText
                                    v-model="globalFilter"
                                    placeholder="Search by programme name or code..."
                                    class="w-full"
                                    @input="onGlobalFilter"
                                />
                            </IconField>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">Session</label>
                            <Dropdown
                                v-model="selectedSession"
                                :options="sessions"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select Session"
                                class="w-full"
                                @change="loadProgrammes"
                            />
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">Level</label>
                            <Dropdown
                                v-model="selectedLevel"
                                :options="levels"
                                optionLabel="title"
                                optionValue="id"
                                placeholder="All Levels"
                                class="w-full"
                                @change="filterByLevel"
                            />
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">Actions</label>
                            <div class="flex gap-2">
                                <Button
                                    icon="pi pi-refresh"
                                    label="Refresh"
                                    severity="secondary"
                                    outlined
                                    @click="refresh"
                                />
                                <Button
                                    icon="pi pi-times"
                                    label="Clear"
                                    severity="danger"
                                    outlined
                                    @click="clearFilters"
                                />
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Main Data Table -->
        <div class="table-section">
            <Card class="table-card">
                <template #content>
                    <DataTable
                        v-model:filters="filters"
                        :value="programmes"
                        :loading="loading"
                        :paginator="true"
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} programmes"
                        dataKey="id"
                        filterDisplay="row"
                        :globalFilterFields="['name', 'code']"
                        class="programme-table"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="600px"
                    >
                        <!-- Programme Information Column -->
                        <Column field="name" header="Programme" :sortable="true" style="min-width: 250px">
                            <template #body="{ data }">
                                <div class="programme-info">
                                    <div class="programme-header">
                                        <div class="programme-name">{{ data.name }}</div>
                                        <Tag :value="data.code" severity="info" class="programme-code"></Tag>
                                    </div>
                                    <div class="programme-details">
                                        <small class="text-muted">
                                            <i class="fas fa-building mr-1"></i>{{ data.department || 'N/A' }}
                                        </small>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <!-- Assigned Courses Column -->
                        <Column field="courses" header="Assigned Courses" style="min-width: 400px">
                            <template #body="{ data }">
                                <div class="courses-container">
                                    <div class="courses-header">
                                        <span class="courses-count">
                                            <i class="fas fa-book mr-1"></i>
                                            {{ data.courses?.length || 0 }} Course(s)
                                        </span>
                                        <Button
                                            icon="pi pi-plus"
                                            size="small"
                                            severity="success"
                                            outlined
                                            @click="addCoursesToProgramme(data)"
                                            v-tooltip="'Add more courses'"
                                        />
                                    </div>
                                    <div class="courses-list" v-if="data.courses && data.courses.length > 0">
                                        <div class="course-tags">
                                            <Tag
                                                v-for="course in data.courses.slice(0, 3)"
                                                :key="course.programme_course_id"
                                                :value="course.code"
                                                severity="secondary"
                                                class="course-tag"
                                                @click="viewCourseDetails(course)"
                                            >
                                                <template #default>
                                                    <span class="course-code">{{ course.code }}</span>
                                                    <Button
                                                        icon="pi pi-times"
                                                        size="small"
                                                        text
                                                        severity="danger"
                                                        class="remove-course-btn"
                                                        @click.stop="removeCourse(data, course)"
                                                        :loading="loadingStates[course.programme_course_id]"
                                                        v-tooltip="'Remove course'"
                                                    />
                                                </template>
                                            </Tag>
                                            <Tag
                                                v-if="data.courses.length > 3"
                                                :value="`+${data.courses.length - 3} more`"
                                                severity="info"
                                                @click="viewAllCourses(data)"
                                                class="more-courses-tag"
                                            />
                                        </div>
                                    </div>
                                    <div v-else class="no-courses">
                                        <small class="text-muted">
                                            <i class="fas fa-info-circle mr-1"></i>
                                            No courses assigned
                                        </small>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <!-- Programme Type & Level Column -->
                        <Column field="programme_type" header="Type & Level" style="min-width: 200px">
                            <template #body="{ data }">
                                <div class="programme-meta">
                                    <div class="programme-type">
                                        <Tag :value="data.programme_type || 'N/A'" severity="warning" />
                                    </div>
                                    <div class="graduation-level mt-1">
                                        <small class="text-muted">
                                            <i class="fas fa-layer-group mr-1"></i>
                                            {{ data.graduation_level || 'N/A' }}
                                        </small>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <!-- Status Column -->
                        <Column field="status" header="Status" style="min-width: 120px">
                            <template #body="{ data }">
                                <Tag
                                    :value="data.status || 'Active'"
                                    :severity="getStatusSeverity(data.status)"
                                    :icon="getStatusIcon(data.status)"
                                />
                            </template>
                        </Column>

                        <!-- Actions Column -->
                        <Column header="Actions" style="min-width: 150px">
                            <template #body="{ data }">
                                <div class="action-buttons">
                                    <Button
                                        icon="pi pi-eye"
                                        size="small"
                                        severity="info"
                                        outlined
                                        @click="viewProgrammeDetails(data)"
                                        v-tooltip="'View details'"
                                    />
                                    <Button
                                        icon="pi pi-plus"
                                        size="small"
                                        severity="success"
                                        outlined
                                        @click="addCoursesToProgramme(data)"
                                        v-tooltip="'Add courses'"
                                    />
                                    <Button
                                        icon="pi pi-copy"
                                        size="small"
                                        severity="warning"
                                        outlined
                                        @click="duplicateProgramme(data)"
                                        v-tooltip="'Duplicate programme'"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>

        <!-- Assign Courses Dialog -->
        <Dialog
            v-model:visible="showAssignDialog"
            :style="{ width: '50rem' }"
            header="Assign Courses to Programme"
            :modal="true"
            class="assign-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-plus-circle text-primary mr-2"></i>
                    <span>Assign Courses to Programme</span>
                </div>
            </template>

            <div class="assign-form">
                <div class="form-section">
                    <h4 class="section-title">
                        <i class="fas fa-graduation-cap mr-2"></i>
                        Programme Information
                    </h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Programme <span class="required">*</span></label>
                            <Dropdown
                                v-model="assignForm.programme_id"
                                :options="programmesLists"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select Programme"
                                filter
                                class="w-full"
                                :class="{ 'p-invalid': validation?.programme_id }"
                            />
                            <small class="p-error" v-if="validation?.programme_id">{{ validation.programme_id[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Academic Session <span class="required">*</span></label>
                            <Dropdown
                                v-model="assignForm.session_id"
                                :options="sessions"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select Session"
                                class="w-full"
                                :class="{ 'p-invalid': validation?.session_id }"
                            />
                            <small class="p-error" v-if="validation?.session_id">{{ validation.session_id[0] }}</small>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h4 class="section-title">
                        <i class="fas fa-layer-group mr-2"></i>
                        Academic Context
                    </h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Level <span class="required">*</span></label>
                            <Dropdown
                                v-model="assignForm.level_id"
                                :options="levels"
                                optionLabel="title"
                                optionValue="id"
                                placeholder="Select Level"
                                class="w-full"
                                :class="{ 'p-invalid': validation?.level_id }"
                            />
                            <small class="p-error" v-if="validation?.level_id">{{ validation.level_id[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Semester <span class="required">*</span></label>
                            <Dropdown
                                v-model="assignForm.semester_id"
                                :options="semesters"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select Semester"
                                class="w-full"
                                :class="{ 'p-invalid': validation?.semester_id }"
                            />
                            <small class="p-error" v-if="validation?.semester_id">{{ validation.semester_id[0] }}</small>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h4 class="section-title">
                        <i class="fas fa-book mr-2"></i>
                        Course Selection
                    </h4>
                    <div class="form-group">
                        <label class="form-label">Courses <span class="required">*</span></label>
                        <MultiSelect
                            v-model="assignForm.course_ids"
                            :options="courses"
                            optionLabel="title"
                            optionValue="id"
                            placeholder="Select Courses"
                            filter
                            :maxSelectedLabels="3"
                            class="w-full"
                            :class="{ 'p-invalid': validation?.course_ids }"
                        >
                            <template #option="{ option }">
                                <div class="course-option">
                                    <div class="course-info">
                                        <span class="course-title">{{ option.title }}</span>
                                        <Tag :value="option.code" severity="info" class="ml-2" />
                                    </div>
                                    <small class="course-details">
                                        Credit Units: {{ option.credit_unit || 'N/A' }}
                                    </small>
                                </div>
                            </template>
                            <template #value="{ value }">
                                <div class="selected-courses" v-if="value && value.length">
                                    <Tag
                                        v-for="courseId in value.slice(0, 3)"
                                        :key="courseId"
                                        :value="getCourseCode(courseId)"
                                        severity="secondary"
                                        class="mr-1"
                                    />
                                    <span v-if="value.length > 3" class="more-count">
                                        +{{ value.length - 3 }} more
                                    </span>
                                </div>
                            </template>
                        </MultiSelect>
                        <small class="p-error" v-if="validation?.course_ids">{{ validation.course_ids[0] }}</small>
                        <small class="form-help">
                            <i class="fas fa-info-circle mr-1"></i>
                            Select multiple courses to assign to this programme
                        </small>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        severity="secondary"
                        outlined
                        @click="closeAssignDialog"
                    />
                    <Button
                        label="Assign Courses"
                        icon="pi pi-check"
                        severity="primary"
                        @click="assignCourses"
                        :loading="assigning"
                    />
                </div>
            </template>
        </Dialog>

        <!-- Programme Details Dialog -->
        <Dialog
            v-model:visible="showDetailsDialog"
            :style="{ width: '60rem' }"
            header="Programme Details"
            :modal="true"
            class="details-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-info-circle text-primary mr-2"></i>
                    <span>Programme Details</span>
                </div>
            </template>

            <div class="programme-details" v-if="selectedProgramme">
                <div class="details-grid">
                    <div class="detail-section">
                        <h4 class="detail-title">
                            <i class="fas fa-graduation-cap mr-2"></i>
                            Programme Information
                        </h4>
                        <div class="detail-content">
                            <div class="detail-item">
                                <label>Programme Name:</label>
                                <span>{{ selectedProgramme.name }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Programme Code:</label>
                                <Tag :value="selectedProgramme.code" severity="info" />
                            </div>
                            <div class="detail-item">
                                <label>Department:</label>
                                <span>{{ selectedProgramme.department || 'N/A' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Faculty:</label>
                                <span>{{ selectedProgramme.faculty || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="detail-title">
                            <i class="fas fa-cogs mr-2"></i>
                            Programme Configuration
                        </h4>
                        <div class="detail-content">
                            <div class="detail-item">
                                <label>Programme Type:</label>
                                <Tag :value="selectedProgramme.programme_type || 'N/A'" severity="warning" />
                            </div>
                            <div class="detail-item">
                                <label>Entry Mode:</label>
                                <span>{{ selectedProgramme.entry_mode || 'N/A' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Graduation Level:</label>
                                <span>{{ selectedProgramme.graduation_level || 'N/A' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <Tag
                                    :value="selectedProgramme.status || 'Active'"
                                    :severity="getStatusSeverity(selectedProgramme.status)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="courses-section">
                    <h4 class="detail-title">
                        <i class="fas fa-book mr-2"></i>
                        Assigned Courses ({{ selectedProgramme.courses?.length || 0 }})
                    </h4>
                    <div class="courses-grid" v-if="selectedProgramme.courses && selectedProgramme.courses.length > 0">
                        <div
                            v-for="course in selectedProgramme.courses"
                            :key="course.programme_course_id"
                            class="course-card"
                        >
                            <div class="course-header">
                                <Tag :value="course.code" severity="secondary" />
                                <Button
                                    icon="pi pi-times"
                                    size="small"
                                    severity="danger"
                                    text
                                    @click="removeCourse(selectedProgramme, course)"
                                    v-tooltip="'Remove course'"
                                />
                            </div>
                            <div class="course-title">{{ course.title }}</div>
                            <div class="course-meta">
                                <small>Credit Units: {{ course.credit_unit || 'N/A' }}</small>
                            </div>
                        </div>
                    </div>
                    <div v-else class="no-courses-message">
                        <i class="fas fa-info-circle mr-2"></i>
                        No courses assigned to this programme
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        severity="secondary"
                        @click="showDetailsDialog = false"
                    />
                    <Button
                        label="Add Courses"
                        icon="pi pi-plus"
                        severity="primary"
                        @click="addCoursesToProgramme(selectedProgramme)"
                    />
                </div>
            </template>
        </Dialog>

        <!-- All Courses Dialog -->
        <Dialog
            v-model:visible="showAllCoursesDialog"
            :style="{ width: '50rem' }"
            header="All Assigned Courses"
            :modal="true"
            class="courses-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-list mr-2"></i>
                    <span>All Courses - {{ selectedProgramme?.name }}</span>
                </div>
            </template>

            <div class="all-courses-list" v-if="selectedProgramme?.courses">
                <div class="courses-header">
                    <span class="courses-count">
                        Total: {{ selectedProgramme.courses.length }} course(s)
                    </span>
                </div>
                <div class="courses-table">
                    <DataTable
                        :value="selectedProgramme.courses"
                        :paginator="true"
                        :rows="10"
                        responsiveLayout="scroll"
                    >
                        <Column field="code" header="Course Code" :sortable="true">
                            <template #body="{ data }">
                                <Tag :value="data.code" severity="secondary" />
                            </template>
                        </Column>
                        <Column field="title" header="Course Title" :sortable="true" />
                        <Column field="credit_unit" header="Credit Units" :sortable="true">
                            <template #body="{ data }">
                                {{ data.credit_unit || 'N/A' }}
                            </template>
                        </Column>
                        <Column header="Actions">
                            <template #body="{ data }">
                                <Button
                                    icon="pi pi-times"
                                    size="small"
                                    severity="danger"
                                    outlined
                                    @click="removeCourse(selectedProgramme, data)"
                                    v-tooltip="'Remove course'"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        severity="secondary"
                        @click="showAllCoursesDialog = false"
                    />
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script>

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Tag from 'primevue/Tag'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Toast from 'primevue/toast';
import { get, post } from '@/api/client'
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin'
export default {
    mixins: [schoolInfoMixin],
    data(){
        return {
            // Dialog states
            showAssignDialog: false,
            showDetailsDialog: false,
            showAllCoursesDialog: false,

            // Loading states
            loading: false,
            assigning: false,
            loadingStates: {},

            // Filters and search
            filters: { global: { value: null } },
            globalFilter: '',
            selectedSession: null,
            selectedLevel: null,

            // Data arrays
            programmes: [],
            programmesLists: [],
            courses: [],
            selectedProgramme: null,

            // Form data
            assignForm: {
                programme_id: '',
                course_ids: [],
                level_id: '',
                semester_id: '',
                session_id: ''
            },

            // Legacy data (keeping for compatibility)
            sessions: [],
            semesters: [],
            levels: [],
            programmeCourse: {},
            validation: {},

            // Statistics
            totalProgrammes: 0,
            totalCourses: 0,
            totalAssignments: 0
        }
    },
    components: {
        MultiSelect, Toast, Tag, InputText, Dropdown, Button,
        DataTable, Column, Row, InputIcon, IconField, Dialog, Card
    },
    methods:{
        async fetchRecords(){
            this.tableloading= true;
            const res = await get(`${this.$endpoints.staff.getProgrammeCourses.url}?session_id=${this.$globals.currentSession()}`);                       
            this.tableloading = false
            this.programmes = res
        },    
        duplicateRecord(data){
            this.programmeCourse.programme_id = data.id;            
            this.programmeCourse.name = data.name;            
            this.newRecordDialog = true
        },
        exportCSV() {
            //console.log(this.$refs.dtable.values())
            this.$refs.dtable.exportCSV();
        },
        fetchData(){
            getFaculties
            getDepartments
        },
        refresh(){
            this.fetchRecords()
        },
        updateSchoolInfo() {            
            const schoolInfo = this.$globals?.school_info;
            if (schoolInfo) {                     
                this.programmesLists = schoolInfo.programmes || [];                
                this.semesters = schoolInfo.semesters || [];
                this.sessions = schoolInfo.sessions || [];
                this.levels = schoolInfo.levels || [];                
                this.entry_modes = schoolInfo.entry_modes || [];                
                this.departments = schoolInfo.departments || [];                
            }
        },
        async removeCourse(programe,course,index){            
            this.loadingStates[course.programme_course_id]= true;
            const res = await post(this.$endpoints.staff.unassignProgrammeCourse.url,{ids:[course.programme_course_id]})                
            this.loadingStates[course.programme_course_id] = false;
            if(res){                
                programe.courses.splice(index, 1);                
                this.$globals.showMessage(course.code +' course removed from '+programe.name, 'success')
                return;
            }
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');        
        },
        async addCourse(){            
            this.newRecordDialog = false
            this.dataTableloading = true     
            const name = this.programmeCourse.name;
            delete this.programmeCourse.name;       
            const res = await post(this.$endpoints.staff.assignProgrammeCourse.url,this.programmeCourse)    
            this.dataTableloading = false
            //console.log(res,3333333333333);
            if(res){
                this.$globals.showMessage('Courses added to '+name+' successfuly', 'success')
                this.fetchRecords()
                return;
            }
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');        
        }
    },

        // Data loading methods
        async loadProgrammes() {
            this.loading = true;
            try {
                const sessionId = this.selectedSession || this.currentSessionId;
                const res = await get(`${this.$endpoints.staff.getProgrammeCourses.url}?session_id=${sessionId}`);
                if (res && res.data) {
                    this.programmes = res.data;
                    this.updateStatistics();
                }
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load programmes',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        async loadProgrammesList() {
            try {
                const res = await get(this.$endpoints.staff.getProgrammes.url);
                if (res && res.data) {
                    this.programmesLists = res.data;
                }
            } catch (error) {
                console.error('Error loading programmes list:', error);
            }
        },

        async loadCourses() {
            try {
                const res = await get(this.$endpoints.staff.getOpenCourses.url);
                if (res && res.data) {
                    this.courses = res.data;
                }
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        },

        // Statistics methods
        updateStatistics() {
            this.totalProgrammes = this.programmes.length;
            this.totalCourses = this.courses.length;
            this.totalAssignments = this.programmes.reduce((total, programme) => {
                return total + (programme.courses?.length || 0);
            }, 0);
        },

        // Filter methods
        onGlobalFilter() {
            this.filters.global.value = this.globalFilter;
        },

        filterByLevel() {
            // Implement level-based filtering if needed
            this.loadProgrammes();
        },

        clearFilters() {
            this.globalFilter = '';
            this.selectedSession = null;
            this.selectedLevel = null;
            this.filters.global.value = null;
            this.loadProgrammes();
        },

        refresh() {
            this.loadProgrammes();
            this.loadProgrammesList();
            this.loadCourses();
        },

        // New methods for improved UI
        getStatusSeverity(status) {
            switch (status?.toLowerCase()) {
                case 'active': return 'success';
                case 'inactive': return 'danger';
                case 'pending': return 'warning';
                default: return 'success';
            }
        },

        getStatusIcon(status) {
            switch (status?.toLowerCase()) {
                case 'active': return 'pi pi-check-circle';
                case 'inactive': return 'pi pi-times-circle';
                case 'pending': return 'pi pi-clock';
                default: return 'pi pi-check-circle';
            }
        },

        getCourseCode(courseId) {
            const course = this.courses.find(c => c.id === courseId);
            return course ? course.code : 'N/A';
        },

        // Dialog methods
        addCoursesToProgramme(programme) {
            this.selectedProgramme = programme;
            this.assignForm.programme_id = programme.id;
            this.showAssignDialog = true;
        },

        viewProgrammeDetails(programme) {
            this.selectedProgramme = programme;
            this.showDetailsDialog = true;
        },

        viewAllCourses(programme) {
            this.selectedProgramme = programme;
            this.showAllCoursesDialog = true;
        },

        viewCourseDetails(course) {
            // Implement course details view if needed
            console.log('View course details:', course);
        },

        duplicateProgramme(programme) {
            // Implement programme duplication logic
            this.$toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Duplicate functionality coming soon',
                life: 3000
            });
        },

        closeAssignDialog() {
            this.showAssignDialog = false;
            this.assignForm = {
                programme_id: '',
                course_ids: [],
                level_id: '',
                semester_id: '',
                session_id: ''
            };
            this.validation = {};
        },

        async assignCourses() {
            this.assigning = true;
            this.validation = {};

            try {
                const response = await post(this.$endpoints.staff.assignProgrammeCourse.url, this.assignForm);

                if (response && !response.error) {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Courses assigned successfully',
                        life: 3000
                    });
                    this.closeAssignDialog();
                    this.loadProgrammes();
                } else {
                    throw new Error(response?.message || 'Failed to assign courses');
                }
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.validation = error.response.data.errors;
                }
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Failed to assign courses',
                    life: 3000
                });
            } finally {
                this.assigning = false;
            }
        },

        async removeCourse(programme, course) {
            this.loadingStates[course.programme_course_id] = true;

            try {
                const response = await post(this.$endpoints.staff.unassignProgrammeCourse.url, {
                    ids: [course.programme_course_id]
                });

                if (response && !response.error) {
                    // Remove course from local data
                    const courseIndex = programme.courses.findIndex(c => c.programme_course_id === course.programme_course_id);
                    if (courseIndex > -1) {
                        programme.courses.splice(courseIndex, 1);
                    }

                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Course removed successfully',
                        life: 3000
                    });
                } else {
                    throw new Error(response?.message || 'Failed to remove course');
                }
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Failed to remove course',
                    life: 3000
                });
            } finally {
                this.loadingStates[course.programme_course_id] = false;
            }
        },

        exportData() {
            // Implement export functionality
            this.$toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Export functionality coming soon',
                life: 3000
            });
        },

    async created(){
        this.updateSchoolInfo();
        this.fetchRecords()
        const res = await get(this.$endpoints.staff.getOpenCourses.url)
        this.courses = res;
        this.loadProgrammesList();
        this.updateStatistics();
    }
}
</script>

<style scoped>
/* Programme Courses Container */
.programme-courses-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
}

/* Header Section */
.header-section {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
    overflow: hidden;
}

.header-content {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
    font-size: 1.1rem;
    margin: 10px 0 0 0;
    opacity: 0.9;
}

.header-actions {
    display: flex;
    gap: 15px;
}

/* Statistics Section */
.stats-section {
    margin-bottom: 30px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.stat-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 5px solid;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-primary { border-left-color: #667eea; }
.stat-success { border-left-color: #28a745; }
.stat-info { border-left-color: #17a2b8; }
.stat-warning { border-left-color: #ffc107; }

.stat-icon {
    font-size: 2.5rem;
    margin-right: 20px;
    opacity: 0.8;
}

.stat-primary .stat-icon { color: #667eea; }
.stat-success .stat-icon { color: #28a745; }
.stat-info .stat-icon { color: #17a2b8; }
.stat-warning .stat-icon { color: #ffc107; }

.stat-content {
    flex: 1;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1;
}

.stat-label {
    font-size: 1rem;
    color: #6c757d;
    font-weight: 500;
    margin-top: 5px;
}

/* Filters Section */
.filters-section {
    margin-bottom: 30px;
}

.filter-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.filter-group {
    display: flex;
    flex-direction: column;
}

.filter-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Table Section */
.table-section {
    margin-bottom: 30px;
}

.table-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.programme-table {
    border-radius: 15px;
    overflow: hidden;
}

/* Programme Info Styling */
.programme-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.programme-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.programme-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
}

.programme-code {
    font-size: 0.85rem;
}

.programme-details {
    color: #6c757d;
    font-size: 0.9rem;
}

/* Courses Container Styling */
.courses-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.courses-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.courses-count {
    font-weight: 600;
    color: #495057;
    font-size: 0.9rem;
}

.course-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.course-tag {
    cursor: pointer;
    transition: all 0.3s ease;
}

.course-tag:hover {
    transform: scale(1.05);
}

.course-code {
    margin-right: 5px;
}

.remove-course-btn {
    margin-left: 5px;
}

.more-courses-tag {
    cursor: pointer;
    background: #e3f2fd !important;
    color: #1976d2 !important;
}

.no-courses {
    color: #6c757d;
    font-style: italic;
}

/* Programme Meta Styling */
.programme-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 5px;
}

/* Dialog Styling */
.assign-dialog .p-dialog-content,
.details-dialog .p-dialog-content,
.courses-dialog .p-dialog-content {
    padding: 0;
}

.dialog-header {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
}

/* Form Styling */
.assign-form {
    padding: 20px;
}

.form-section {
    margin-bottom: 25px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #667eea;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.required {
    color: #e74c3c;
}

.form-help {
    margin-top: 5px;
    color: #6c757d;
    font-size: 0.85rem;
}

/* Course Option Styling */
.course-option {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.course-info {
    display: flex;
    align-items: center;
}

.course-title {
    font-weight: 500;
}

.course-details {
    color: #6c757d;
}

.selected-courses {
    display: flex;
    align-items: center;
    gap: 5px;
}

.more-count {
    color: #6c757d;
    font-size: 0.85rem;
}

/* Programme Details Styling */
.programme-details {
    padding: 20px;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
    margin-bottom: 25px;
}

.detail-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #667eea;
}

.detail-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.detail-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-item label {
    font-weight: 600;
    color: #495057;
}

/* Courses Section */
.courses-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #28a745;
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.course-card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.course-title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
}

.course-meta {
    color: #6c757d;
    font-size: 0.85rem;
}

.no-courses-message {
    text-align: center;
    color: #6c757d;
    font-style: italic;
    padding: 20px;
}

/* All Courses Dialog */
.all-courses-list {
    padding: 20px;
}

.courses-header {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e9ecef;
}

.courses-count {
    font-weight: 600;
    color: #495057;
}

/* Dialog Footer */
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .page-title {
        font-size: 2rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .filter-grid {
        grid-template-columns: 1fr;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .details-grid {
        grid-template-columns: 1fr;
    }

    .courses-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
        gap: 10px;
    }
}

/* Animation Classes */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from {
    transform: translateX(-100%);
}

.slide-leave-to {
    transform: translateX(100%);
}
</style>