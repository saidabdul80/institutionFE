<template>
    <div class="staff-courses-container">
        <!-- Header Section -->
        <div class="header-section">
            <div class="header-content">
                <div class="header-text">
                    <h1 class="page-title">
                        <i class="fas fa-chalkboard-teacher text-primary"></i>
                        Staff Course Management
                    </h1>
                    <p class="page-subtitle">Assign and manage courses for academic staff across different programmes and sessions</p>
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
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ totalStaff }}</div>
                        <div class="stat-label">Total Staff</div>
                    </div>
                </div>
                <div class="stat-card stat-success">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ totalCourses }}</div>
                        <div class="stat-label">Available Courses</div>
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
                            <label class="filter-label">Search Staff</label>
                            <IconField iconPosition="left">
                                <InputIcon class="pi pi-search" />
                                <InputText 
                                    v-model="globalFilter" 
                                    placeholder="Search by staff name, email, or staff number..."
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
                                @change="loadStaffCourses"
                            />
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">Department</label>
                            <Dropdown 
                                v-model="selectedDepartment" 
                                :options="departments" 
                                optionLabel="name" 
                                optionValue="id"
                                placeholder="All Departments"
                                class="w-full"
                                @change="filterByDepartment"
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
                        :value="staffList" 
                        :loading="loading"
                        :paginator="true" 
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} staff members"
                        dataKey="id"
                        filterDisplay="row"
                        :globalFilterFields="['first_name', 'surname', 'email', 'staff_number']"
                        class="staff-table"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="600px"
                    >
                        <!-- Staff Information Column -->
                        <Column field="name" header="Staff Information" :sortable="true" style="min-width: 250px">
                            <template #body="{ data }">
                                <div class="staff-info">
                                    <div class="staff-header">
                                        <div class="staff-name">{{ getFullName(data) }}</div>
                                        <Tag :value="data.staff_number" severity="info" class="staff-number"></Tag>
                                    </div>
                                    <div class="staff-details">
                                        <small class="text-muted">
                                            <i class="fas fa-envelope mr-1"></i>{{ data.email || 'N/A' }}
                                        </small>
                                        <br>
                                        <small class="text-muted">
                                            <i class="fas fa-building mr-1"></i>{{ data.department_name || 'N/A' }}
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
                                            {{ data.assigned_courses?.length || 0 }} Course(s)
                                        </span>
                                        <Button 
                                            icon="pi pi-plus" 
                                            size="small" 
                                            severity="success" 
                                            outlined 
                                            @click="assignCoursesToStaff(data)"
                                            v-tooltip="'Assign more courses'"
                                        />
                                    </div>
                                    <div class="courses-list" v-if="data.assigned_courses && data.assigned_courses.length > 0">
                                        <div class="course-tags">
                                            <Tag 
                                                v-for="course in data.assigned_courses.slice(0, 3)" 
                                                :key="course.id"
                                                :value="course.course_code"
                                                severity="secondary"
                                                class="course-tag"
                                                @click="viewCourseDetails(course)"
                                            >
                                                <template #default>
                                                    <span class="course-code">{{ course.course_code }}</span>
                                                    <Button 
                                                        icon="pi pi-times" 
                                                        size="small" 
                                                        text 
                                                        severity="danger"
                                                        class="remove-course-btn"
                                                        @click.stop="removeCourse(data, course)"
                                                        :loading="loadingStates[course.id]"
                                                        v-tooltip="'Remove course'"
                                                    />
                                                </template>
                                            </Tag>
                                            <Tag 
                                                v-if="data.assigned_courses.length > 3"
                                                :value="`+${data.assigned_courses.length - 3} more`"
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

                        <!-- Faculty & Department Column -->
                        <Column field="department" header="Faculty & Department" style="min-width: 200px">
                            <template #body="{ data }">
                                <div class="department-info">
                                    <div class="faculty-name">
                                        <Tag :value="data.faculty_name || 'N/A'" severity="warning" />
                                    </div>
                                    <div class="department-name mt-1">
                                        <small class="text-muted">
                                            <i class="fas fa-sitemap mr-1"></i>
                                            {{ data.department_name || 'N/A' }}
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
                                        @click="viewStaffDetails(data)"
                                        v-tooltip="'View details'"
                                    />
                                    <Button 
                                        icon="pi pi-plus" 
                                        size="small" 
                                        severity="success" 
                                        outlined 
                                        @click="assignCoursesToStaff(data)"
                                        v-tooltip="'Assign courses'"
                                    />
                                    <Button 
                                        icon="pi pi-chart-line" 
                                        size="small" 
                                        severity="warning" 
                                        outlined 
                                        @click="viewStaffStats(data)"
                                        v-tooltip="'View statistics'"
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
            header="Assign Courses to Staff"
            :modal="true"
            class="assign-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-user-plus text-primary mr-2"></i>
                    <span>Assign Courses to {{ selectedStaff ? getFullName(selectedStaff) : 'Staff' }}</span>
                </div>
            </template>

            <div class="assign-form">
                <div class="form-section">
                    <h4 class="section-title">
                        <i class="fas fa-user mr-2"></i>
                        Staff Information
                    </h4>
                    <div class="staff-summary" v-if="selectedStaff">
                        <div class="staff-card">
                            <div class="staff-info">
                                <h5>{{ getFullName(selectedStaff) }}</h5>
                                <p><strong>Staff Number:</strong> {{ selectedStaff.staff_number }}</p>
                                <p><strong>Email:</strong> {{ selectedStaff.email }}</p>
                                <p><strong>Department:</strong> {{ selectedStaff.department_name }}</p>
                            </div>
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
                        <div class="form-group">
                            <label class="form-label">Programme <span class="required">*</span></label>
                            <Dropdown
                                v-model="assignForm.programme_id"
                                :options="programmes"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Select Programme"
                                class="w-full"
                                :class="{ 'p-invalid': validation?.programme_id }"
                            />
                            <small class="p-error" v-if="validation?.programme_id">{{ validation.programme_id[0] }}</small>
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
                            Select multiple courses to assign to this staff member
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

        <!-- Staff Details Dialog -->
        <Dialog
            v-model:visible="showDetailsDialog"
            :style="{ width: '60rem' }"
            header="Staff Details"
            :modal="true"
            class="details-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-user-circle text-primary mr-2"></i>
                    <span>Staff Details</span>
                </div>
            </template>

            <div class="staff-details" v-if="selectedStaff">
                <div class="details-grid">
                    <div class="detail-section">
                        <h4 class="detail-title">
                            <i class="fas fa-user mr-2"></i>
                            Personal Information
                        </h4>
                        <div class="detail-content">
                            <div class="detail-item">
                                <label>Full Name:</label>
                                <span>{{ getFullName(selectedStaff) }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Staff Number:</label>
                                <Tag :value="selectedStaff.staff_number" severity="info" />
                            </div>
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>{{ selectedStaff.email || 'N/A' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>{{ selectedStaff.phone || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="detail-title">
                            <i class="fas fa-building mr-2"></i>
                            Department Information
                        </h4>
                        <div class="detail-content">
                            <div class="detail-item">
                                <label>Faculty:</label>
                                <Tag :value="selectedStaff.faculty_name || 'N/A'" severity="warning" />
                            </div>
                            <div class="detail-item">
                                <label>Department:</label>
                                <span>{{ selectedStaff.department_name || 'N/A' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Position:</label>
                                <span>{{ selectedStaff.position || 'N/A' }}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <Tag
                                    :value="selectedStaff.status || 'Active'"
                                    :severity="getStatusSeverity(selectedStaff.status)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="courses-section">
                    <h4 class="detail-title">
                        <i class="fas fa-book mr-2"></i>
                        Assigned Courses ({{ selectedStaff.assigned_courses?.length || 0 }})
                    </h4>
                    <div class="courses-grid" v-if="selectedStaff.assigned_courses && selectedStaff.assigned_courses.length > 0">
                        <div
                            v-for="course in selectedStaff.assigned_courses"
                            :key="course.id"
                            class="course-card"
                        >
                            <div class="course-header">
                                <Tag :value="course.course_code" severity="secondary" />
                                <Button
                                    icon="pi pi-times"
                                    size="small"
                                    severity="danger"
                                    text
                                    @click="removeCourse(selectedStaff, course)"
                                    v-tooltip="'Remove course'"
                                />
                            </div>
                            <div class="course-title">{{ course.course_title || course.course_name }}</div>
                            <div class="course-meta">
                                <small>Programme: {{ course.programme_name || 'N/A' }}</small>
                                <br>
                                <small>Session: {{ course.session_name || 'N/A' }}</small>
                            </div>
                        </div>
                    </div>
                    <div v-else class="no-courses-message">
                        <i class="fas fa-info-circle mr-2"></i>
                        No courses assigned to this staff member
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
                        label="Assign Courses"
                        icon="pi pi-plus"
                        severity="primary"
                        @click="assignCoursesToStaff(selectedStaff)"
                    />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
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
    data() {
        return {
            // Dialog states
            showAssignDialog: false,
            showDetailsDialog: false,
            showAllCoursesDialog: false,
            showStatsDialog: false,
            
            // Loading states
            loading: false,
            assigning: false,
            loadingStates: {},
            
            // Filters and search
            filters: { global: { value: null } },
            globalFilter: '',
            selectedSession: null,
            selectedDepartment: null,
            
            // Data arrays
            staffList: [],
            courses: [],
            departments: [],
            selectedStaff: null,
            
            // Form data
            assignForm: {
                staff_id: '',
                course_ids: [],
                programme_id: '',
                semester_id: '',
                session_id: '',
                faculty_id: '',
                department_id: ''
            },
            
            // Legacy data (keeping for compatibility)
            sessions: [],
            semesters: [],
            levels: [],
            programmes: [],
            validation: {},
            
            // Statistics
            totalStaff: 0,
            totalCourses: 0,
            totalAssignments: 0
        }
    },
    
    components: {
        MultiSelect, Toast, Tag, InputText, Dropdown, Button,
        DataTable, Column, Row, InputIcon, IconField, Dialog, Card
    },

    computed: {
        currentSession() {
            return this.currentSessionName || '2023/2024';
        }
    },

    methods: {
        // Data loading methods
        async loadStaffCourses() {
            this.loading = true;
            try {
                const sessionId = this.selectedSession || this.currentSessionId;
                const res = await get(`${this.$endpoints.staff.getStaffCoursesByStaffID.url}?session_id=${sessionId}`);
                if (res && res.data) {
                    this.staffList = res.data;
                    this.updateStatistics();
                }
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load staff courses',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        async loadStaffList() {
            try {
                const res = await get(this.$endpoints.staff.staffs.url);
                if (res && res.data) {
                    this.staffList = res.data;
                }
            } catch (error) {
                console.error('Error loading staff list:', error);
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

        async loadDepartments() {
            try {
                const res = await get(this.$endpoints.staff.getDepartments.url);
                if (res && res.data) {
                    this.departments = res.data;
                }
            } catch (error) {
                console.error('Error loading departments:', error);
            }
        },

        async loadProgrammes() {
            try {
                const res = await get(this.$endpoints.staff.getProgrammes.url);
                if (res && res.data) {
                    this.programmes = res.data;
                }
            } catch (error) {
                console.error('Error loading programmes:', error);
            }
        },

        async loadSessions() {
            try {
                const res = await get(this.$endpoints.staff.getSessions.url);
                if (res && res.data) {
                    this.sessions = res.data;
                }
            } catch (error) {
                console.error('Error loading sessions:', error);
            }
        },

        async loadSemesters() {
            try {
                const res = await get(this.$endpoints.staff.getSemesters.url);
                if (res && res.data) {
                    this.semesters = res.data;
                }
            } catch (error) {
                console.error('Error loading semesters:', error);
            }
        },

        // Statistics methods
        updateStatistics() {
            this.totalStaff = this.staffList.length;
            this.totalCourses = this.courses.length;
            this.totalAssignments = this.staffList.reduce((total, staff) => {
                return total + (staff.assigned_courses?.length || 0);
            }, 0);
        },

        // Filter methods
        onGlobalFilter() {
            this.filters.global.value = this.globalFilter;
        },

        filterByDepartment() {
            // Implement department-based filtering if needed
            this.loadStaffCourses();
        },

        clearFilters() {
            this.globalFilter = '';
            this.selectedSession = null;
            this.selectedDepartment = null;
            this.filters.global.value = null;
            this.loadStaffCourses();
        },

        refresh() {
            this.loadStaffCourses();
            this.loadStaffList();
            this.loadCourses();
            this.loadDepartments();
            this.loadProgrammes();
            this.loadSessions();
            this.loadSemesters();
        },

        // Utility methods
        getFullName(staff) {
            return `${staff.first_name || ''} ${staff.middle_name || ''} ${staff.surname || ''}`.trim();
        },

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
        assignCoursesToStaff(staff) {
            this.selectedStaff = staff;
            this.assignForm.staff_id = staff.id;
            this.assignForm.faculty_id = staff.faculty_id;
            this.assignForm.department_id = staff.department_id;
            this.showAssignDialog = true;
        },

        viewStaffDetails(staff) {
            this.selectedStaff = staff;
            this.showDetailsDialog = true;
        },

        viewAllCourses(staff) {
            this.selectedStaff = staff;
            this.showAllCoursesDialog = true;
        },

        viewStaffStats(staff) {
            this.selectedStaff = staff;
            this.showStatsDialog = true;
        },

        viewCourseDetails(course) {
            // Implement course details view if needed
            console.log('View course details:', course);
        },

        closeAssignDialog() {
            this.showAssignDialog = false;
            this.assignForm = {
                staff_id: '',
                course_ids: [],
                programme_id: '',
                semester_id: '',
                session_id: '',
                faculty_id: '',
                department_id: ''
            };
            this.validation = {};
        },

        async assignCourses() {
            this.assigning = true;
            this.validation = {};

            try {
                const response = await post(this.$endpoints.staff.assignCourses.url, this.assignForm);

                if (response && !response.error) {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Courses assigned successfully',
                        life: 3000
                    });
                    this.closeAssignDialog();
                    this.loadStaffCourses();
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

        async removeCourse(staff, course) {
            this.loadingStates[course.id] = true;

            try {
                const response = await post(this.$endpoints.staff.unAssignCourses.url, {
                    course_ids: [course.course_id || course.id],
                    staff_id: staff.id,
                    session_id: this.selectedSession || this.currentSessionId
                });

                if (response && !response.error) {
                    // Remove course from local data
                    const courseIndex = staff.assigned_courses.findIndex(c => c.id === course.id);
                    if (courseIndex > -1) {
                        staff.assigned_courses.splice(courseIndex, 1);
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
                this.loadingStates[course.id] = false;
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
    },

    async created() {
        this.updateSchoolInfo();
        this.loadStaffCourses();
        this.loadStaffList();
        this.loadCourses();
        this.loadDepartments();
        this.loadProgrammes();
        this.loadSessions();
        this.loadSemesters();
        this.updateStatistics();
    }
}
</script>

<style scoped>
/* Staff Courses Container */
.staff-courses-container {
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
    font-size: 2.5rem;
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

.staff-table {
    border-radius: 15px;
    overflow: hidden;
}

/* Staff Info Styling */
.staff-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.staff-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.staff-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
}

.staff-number {
    font-size: 0.85rem;
}

.staff-details {
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

/* Department Info Styling */
.department-info {
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
.details-dialog .p-dialog-content {
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

/* Staff Summary Card */
.staff-summary {
    margin-bottom: 15px;
}

.staff-card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.staff-card h5 {
    margin: 0 0 10px 0;
    color: #2c3e50;
    font-weight: 600;
}

.staff-card p {
    margin: 5px 0;
    color: #6c757d;
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

/* Staff Details Styling */
.staff-details {
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
