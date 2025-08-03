<template>
    <div class="course-allocation-container">
        <!-- Header Section -->
        <div class="header-section">
            <div class="header-content">
                <div class="header-text">
                    <h1 class="page-title">
                        <i class="fas fa-chalkboard-teacher text-primary"></i>
                        Course Allocation Management
                    </h1>
                    <p class="page-subtitle">Efficiently assign courses to staff members for academic sessions</p>
                </div>
                <div class="header-actions">
                    <Button
                        icon="pi pi-download"
                        label="Export"
                        severity="success"
                        outlined
                        @click="exportAllocations"
                        :loading="loading"
                        class="mr-2"
                    />
                    <Button
                        icon="pi pi-plus"
                        label="New Allocation"
                        severity="primary"
                        @click="switchToTab('create')"
                    />
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-section">
            <div class="stats-grid">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ statistics.totalStaff || 0 }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Total Staff</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200 stat-success">
                    <div class="stat-icon">
                        <i class="fas fa-link"></i>
                    </div>
                    <div class="stat-content">
                        <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ statistics.totalAllocations || 0 }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Total Allocations</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200 stat-info">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ statistics.totalCourses || 0 }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Available Courses</div>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200 stat-warning">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="text-2xl font-bold text-gray-800 dark:text-white">{{ currentSession }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Current Session</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="tabs-section">
            <Card class="tabs-card">
                <template #content>
                    <div class="tab-buttons">
                        <Button
                            :class="{ 'active-tab': activeTab === 'allocations' }"
                            class="tab-button"
                            @click="switchToTab('allocations')"
                            outlined
                        >
                            <i class="fas fa-table mr-2"></i>
                            Allocations
                            <Badge v-if="statistics.totalAllocations" :value="statistics.totalAllocations" class="ml-2" />
                        </Button>
                        <Button
                            :class="{ 'active-tab': activeTab === 'create' }"
                            class="tab-button"
                            @click="switchToTab('create')"
                            outlined
                        >
                            <i class="fas fa-plus-circle mr-2"></i>
                            Create Allocation
                        </Button>
                        <Button
                            :class="{ 'active-tab': activeTab === 'analytics' }"
                            class="tab-button"
                            @click="switchToTab('analytics')"
                            outlined
                        >
                            <i class="fas fa-chart-bar mr-2"></i>
                            Analytics
                        </Button>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Main Content Area -->
        <div class="content-section">
            <!-- Create Allocation Form -->
            <div v-if="activeTab === 'create'">
                <Card class="allocation-form-card">
                    <template #title>
                        <div class="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">
                            <i class="fas fa-plus-circle text-primary mr-2"></i>
                            New Course Allocation
                        </div>
                    </template>
                    <template #subtitle>
                        Assign courses to staff members for the current academic session
                    </template>
                    <template #content>
                        <form @submit.prevent="createAllocation" class="allocation-form">
                            <!-- Staff Selection Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <h4 class="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">
                                    <i class="fas fa-user mr-2"></i>
                                    Staff Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Staff Member <span class="required">*</span></label>
                                        <Dropdown
                                            v-model="allocationForm.staff_id"
                                            :options="staffMembers"
                                            optionLabel="full_name"
                                            optionValue="id"
                                            placeholder="Select Staff Member"
                                            filter
                                            class="w-full"
                                            :class="{ 'p-invalid': validation?.staff_id }"
                                            @change="onStaffChange"
                                        >
                                            <template #option="{ option }">
                                                <div class="staff-option">
                                                    <div class="staff-info">
                                                        <span class="staff-name">{{ option.first_name }} {{ option.surname }}</span>
                                                        <Tag :value="option.staff_number" severity="info" class="ml-2" />
                                                    </div>
                                                    <small class="staff-details">
                                                        {{ option.department_name || 'N/A' }} - {{ option.email }}
                                                    </small>
                                                </div>
                                            </template>
                                        </Dropdown>
                                        <small class="p-error" v-if="validation?.staff_id">{{ validation.staff_id[0] }}</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Academic Context Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <h4 class="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">
                                    <i class="fas fa-graduation-cap mr-2"></i>
                                    Academic Context
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Session <span class="required">*</span></label>
                                        <Dropdown
                                            v-model="allocationForm.session_id"
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
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Programme</label>
                                        <Dropdown
                                            v-model="allocationForm.programme_id"
                                            :options="programmes"
                                            optionLabel="name"
                                            optionValue="id"
                                            placeholder="Select Programme (Optional)"
                                            class="w-full"
                                            :class="{ 'p-invalid': validation?.programme_id }"
                                        />
                                        <small class="p-error" v-if="validation?.programme_id">{{ validation.programme_id[0] }}</small>
                                    </div>
                                    <div class="form-group">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
                                        <Dropdown
                                            v-model="allocationForm.semester_id"
                                            :options="semesters"
                                            optionLabel="name"
                                            optionValue="id"
                                            placeholder="Select Semester (Optional)"
                                            class="w-full"
                                            :class="{ 'p-invalid': validation?.semester_id }"
                                        />
                                        <small class="p-error" v-if="validation?.semester_id">{{ validation.semester_id[0] }}</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Course Selection Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                                <h4 class="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">
                                    <i class="fas fa-book mr-2"></i>
                                    Course Selection
                                </h4>
                                <div class="form-group">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Courses <span class="required">*</span></label>

                                    <MultiSelect
                                        v-model="allocationForm.course_ids"
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
                                        Select multiple courses to assign to the staff member
                                    </small>
                                </div>
                            </div>

                            <!-- Form Actions -->
                            <div class="form-actions">
                                <Button
                                    label="Reset Form"
                                    icon="pi pi-refresh"
                                    severity="secondary"
                                    outlined
                                    @click="resetForm"
                                    type="button"
                                />
                                <Button
                                    label="Assign Courses"
                                    icon="pi pi-check"
                                    severity="primary"
                                    type="submit"
                                    :loading="submitting"
                                />
                            </div>
                        </form>
                    </template>
                </Card>
            </div>

            <!-- Allocations List -->
            <div v-if="activeTab === 'allocations'">
                <Card class="allocations-list-card">
                    <template #title>
                        <div class="list-title">
                            <i class="fas fa-table text-primary mr-2"></i>
                            Staff Course Allocations
                        </div>
                    </template>
                    <template #content>
                        <div class="overflow-x-auto w-full">
                        <!-- Filters Section -->
                        <div class="mb-4">
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div class="">
                                    <label class="filter-label">Search Staff</label>
                                    <IconField iconPosition="left">
                                        <InputIcon class="pi pi-search" />
                                        <InputText
                                            v-model="searchQuery"
                                            placeholder="Search by name, staff number, or email..."
                                            class="w-full"
                                            @input="debounceSearch"
                                        />
                                    </IconField>
                                </div>
                                <div class="">
                                    <label class="filter-label">Session</label>
                                    <Dropdown
                                        v-model="filters.session_id"
                                        :options="sessions"
                                        optionLabel="name"
                                        optionValue="id"
                                        placeholder="All Sessions"
                                        class="w-full"
                                        @change="loadAllStaffWithCourses"
                                    />
                                </div>
                                <div class="">
                                    <label class="filter-label">Actions</label>
                                    <div class="flex gap-2">
                                        <Button
                                            icon="pi pi-refresh"
                                            label="Refresh"
                                            severity="secondary"
                                            outlined
                                            @click="loadAllStaffWithCourses"
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
                        </div>

                        <!-- Data Table -->
                      <DataTable
                       tableStyle="min-width: 50rem;max-width: 100% !important;"
                        :value="safeStaffWithCourses"
                        :loading="loading"
                        :paginator="true"
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} staff members"
                        dataKey="id"
                        :key="tableKey"
                        class="staff-allocations-table !w-full"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="600px"
                        lazy
                    >
                            <!-- Staff Information Column -->
                            <Column field="staff_name" header="Staff Information" :sortable="true" style="min-width: 250px">
                                <template #body="{ data }">
                                    <div class="staff-info">
                                        <div class="staff-header">
                                            <div class="staff-name">{{ getFullName(data) }}</div>
                                            <Tag :value="data.staff_number" severity="info" class="staff-number" />
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

                            <!-- Course Count Column -->
                            <Column field="total_courses" header="Total Courses" :sortable="true" style="min-width: 150px">
                                <template #body="{ data }">
                                    <div class="course-count">
                                        <Tag
                                            :value="data.total_courses || 0"
                                            :severity="data.total_courses > 0 ? 'success' : 'secondary'"
                                            class="course-count-tag"
                                        />
                                        <small class="text-muted">course(s)</small>
                                    </div>
                                </template>
                            </Column>

                            <!-- Assigned Courses Preview Column -->
                            <Column field="courses" header="Assigned Courses" style="min-width: 400px">
                                <template #body="{ data }">
                                    <div class="courses-preview">
                                        <div v-if="data.assigned_courses && data.assigned_courses.length > 0" class="course-tags">
                                            <Tag
                                                v-for="course in data.assigned_courses.slice(0, 3)"
                                                :key="course.id"
                                                :value="course.course_code"
                                                severity="secondary"
                                                class="course-tag"
                                                @click="viewCourseDetails(course)"
                                                v-tooltip="course.course_title"
                                            />
                                            <Tag
                                                v-if="data.assigned_courses.length > 3"
                                                :value="`+${data.assigned_courses.length - 3} more`"
                                                severity="info"
                                                @click="viewAllStaffCourses(data)"
                                                class="more-courses-tag"
                                            />
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
                            <Column header="Actions" style="min-width: 180px">
                                <template #body="{ data }">
                                    <div class="action-buttons">
                                        <Button
                                            icon="pi pi-eye"
                                            size="small"
                                            severity="info"
                                            outlined
                                            @click="viewAllStaffCourses(data)"
                                            v-tooltip="'View all courses'"
                                        />
                                        <Button
                                            icon="pi pi-plus"
                                            size="small"
                                            severity="success"
                                            outlined
                                            @click="assignCoursesToStaff(data)"
                                            v-tooltip="'Assign more courses'"
                                        />
                                        <Button
                                            icon="pi pi-minus"
                                            size="small"
                                            severity="danger"
                                            outlined
                                            @click="showBulkRemoveDialogFuc(data)"
                                            v-tooltip="'Remove courses'"
                                            :disabled="!data.assigned_courses || data.assigned_courses.length === 0"
                                        />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Analytics Tab -->
            <div v-if="activeTab === 'analytics'">
                <Card class="analytics-card">
                    <template #title>
                        <div class="analytics-title">
                            <i class="fas fa-chart-bar text-primary mr-2"></i>
                            Analytics Dashboard
                        </div>
                    </template>
                    <template #content>
                        <div class="analytics-content">
                            <div class="analytics-placeholder">
                                <i class="fas fa-chart-line text-6xl text-gray-300 mb-4"></i>
                                <h3 class="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                                <p class="text-gray-500">We're working on comprehensive analytics for course allocations</p>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- Staff Courses Details Dialog -->
        <Dialog
            v-model:visible="showStaffCoursesDialog"
            :style="{ width: '60rem' }"
            header="Staff Course Details"
            :modal="true"
            class="staff-courses-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-user-graduate text-primary mr-2"></i>
                    <span>{{ selectedStaff ? getFullName(selectedStaff) : 'Staff' }} - Course Assignments</span>
                </div>
            </template>

            <div class="staff-courses-content" v-if="selectedStaff">
                <!-- Staff Summary -->
                <div class="staff-summary">
                    <Card class="staff-summary-card">
                        <template #content>
                            <div class="staff-summary-grid">
                                <div class="staff-info-section">
                                    <h4 class="staff-summary-title">
                                        <i class="fas fa-user mr-2"></i>
                                        Staff Information
                                    </h4>
                                    <div class="staff-summary-details">
                                        <div class="detail-row">
                                            <label>Name:</label>
                                            <span>{{ getFullName(selectedStaff) }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <label>Staff Number:</label>
                                            <Tag :value="selectedStaff.staff_number" severity="info" />
                                        </div>
                                        <div class="detail-row">
                                            <label>Email:</label>
                                            <span>{{ selectedStaff.email }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <label>Department:</label>
                                            <span>{{ selectedStaff.department_name }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="courses-summary-section">
                                    <h4 class="courses-summary-title">
                                        <i class="fas fa-chart-pie mr-2"></i>
                                        Course Summary
                                    </h4>
                                    <div class="courses-summary-stats">
                                        <div class="stat-item">
                                            <div class="text-2xl font-bold dark:text-white">{{ selectedStaff.total_courses || 0 }}</div>
                                            <div class="text-sm text-gray-500 dark:text-gray-400">Total Courses</div>
                                        </div>
                                        <div class="stat-item">
                                            <div class="text-2xl font-bold dark:text-white">{{ getActiveCourses(selectedStaff).length }}</div>
                                            <div class="text-sm text-gray-500 dark:text-gray-400">Active Courses</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>

                <!-- Courses List -->
                <div class="courses-list-section">
                    <h4 class="courses-list-title">
                        <i class="fas fa-list mr-2"></i>
                        Assigned Courses
                    </h4>
                    <DataTable
                        :value="selectedStaff.assigned_courses || []"
                        :paginator="true"
                        :rows="5"
                        dataKey="id"
                        class="staff-courses-table"
                        responsiveLayout="scroll"
                    >
                        <Column field="course_code" header="Course Code" :sortable="true">
                            <template #body="{ data }">
                                <Tag :value="data.course_code" severity="secondary" />
                            </template>
                        </Column>
                        <Column field="course_title" header="Course Title" :sortable="true" />
                        <Column field="programme_name" header="Programme" :sortable="true" />
                        <Column field="session_name" header="Session" :sortable="true">
                            <template #body="{ data }">
                                <Tag :value="data.session_name" severity="warning" />
                            </template>
                        </Column>
                        <Column field="semester_name" header="Semester" :sortable="true" />
                        <Column header="Actions">
                            <template #body="{ data }">
                                <Button
                                    icon="pi pi-times"
                                    size="small"
                                    severity="danger"
                                    outlined
                                    @click="removeSingleCourse(selectedStaff, data)"
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
                        @click="showStaffCoursesDialog = false"
                    />
                    <Button
                        label="Assign More Courses"
                        icon="pi pi-plus"
                        severity="primary"
                        @click="assignCoursesToStaff(selectedStaff)"
                    />
                </div>
            </template>
        </Dialog>

        <!-- Bulk Remove Courses Dialog -->
        <Dialog
            v-model:visible="showBulkRemoveDialog"
            :style="{ width: '50rem' }"
            header="Remove Courses"
            :modal="true"
            class="bulk-remove-dialog"
        >
            <template #header>
                <div class="dialog-header">
                    <i class="fas fa-trash text-danger mr-2"></i>
                    <span>Remove Courses from {{ selectedStaff ? getFullName(selectedStaff) : 'Staff' }}</span>
                </div>
            </template>

            <div class="bulk-remove-content" v-if="selectedStaff">
                <div class="warning-message">
                    <Message severity="warn" :closable="false">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Select the courses you want to remove from this staff member. This action cannot be undone.
                    </Message>
                </div>

                <div class="courses-selection">
                    <h4 class="selection-title">Select Courses to Remove:</h4>
                    <div class="courses-grid">
                        <div
                            v-for="course in selectedStaff.assigned_courses"
                            :key="course.id"
                            class="course-selection-item"
                            :class="{ 'selected': selectedCoursesToRemove.includes(course.id) }"
                            @click="toggleCourseSelection(course.id)"
                        >
                            <div class="course-selection-header">
                                <Checkbox
                                    v-model="selectedCoursesToRemove"
                                    :value="course.id"
                                />
                                <Tag :value="course.course_code" severity="secondary" class="ml-2" />
                            </div>
                            <div class="course-selection-details">
                                <div class="course-title">{{ course.course_title }}</div>
                                <small class="course-meta">
                                    {{ course.programme_name }} - {{ course.session_name }}
                                </small>
                            </div>
                        </div>
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
                        @click="closeBulkRemoveDialog"
                    />
                    <Button
                        label="Remove Selected Courses"
                        icon="pi pi-trash"
                        severity="danger"
                        @click="confirmBulkRemove"
                        :disabled="selectedCoursesToRemove.length === 0"
                        :loading="removing"
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
import Tag from 'primevue/Tag'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import Toast from 'primevue/toast';
import { get, post } from '@/api/client'
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin'

export default {
    mixins: [schoolInfoMixin],
    data() {
        return {
            // Tab management
            activeTab: 'create',

            // Loading states
            loading: false,
            submitting: false,

            // Form data
            allocationForm: {
                staff_id: '',
                course_ids: [],
                session_id: '',
                programme_id: '',
                semester_id: '',
                faculty_id: '',
                department_id: ''
            },

            // Data arrays
            allocations: [],
            staffMembers: [],
            staffWithCourses: [],
            courses: [],
            programmes: [],
            sessions: [],
            semesters: [],

            // Filters
            filters: {
                staff_id: '',
                session_id: '',
                course_id: ''
            },
            searchQuery: '',
            searchTimeout: null,
            tableKey: 0,
            // Dialog states
            showDetailsDialog: false,
            showStaffCoursesDialog: false,
            showBulkRemoveDialog: false,
            selectedAllocation: null,
            selectedStaff: null,
            selectedCoursesToRemove: [],

            // Loading states for operations
            removing: false,

            // Table key for forcing re-render
            tableKey: 0,

            // Statistics
            statistics: {
                totalStaff: 0,
                totalAllocations: 0,
                totalCourses: 0
            },

            // Validation
            validation: {}
        }
    },

    components: {
        MultiSelect, Toast, Tag, InputText, Dropdown, Button,
        DataTable, Column, InputIcon, IconField, Dialog, Card, Badge, Checkbox, Message
    },

    computed: {
        currentSession() {
            return this.currentSessionName || '2023/2024';
        },

        safeStaffWithCourses() {
            return this.staffWithCourses || [];
        }
    },

    methods: {
        // Data loading methods
        async loadAllocations() {
            this.loading = true;
            try {
                if (!this.filters.staff_id) {
                    this.allocations = [];
                    return;
                }
                const params = new URLSearchParams();
                if (this.filters.staff_id) params.append('staff_id', this.filters.staff_id);
                if (this.filters.session_id) params.append('session_id', this.filters.session_id);
                if (this.searchQuery) params.append('search', this.searchQuery);

                const res = await get(`${this.$endpoints.staff.getStaffCoursesByStaffID.url}/${this.filters.staff_id}?${params.toString()}`);
                if (res && res.data) {
                    this.allocations = res.data;
                    this.updateStatistics();
                }
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load allocations',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        async loadStaffMembers() {
            try {
                const res = await post(this.$endpoints.staff.staffs.url);
                console.log(res,323)
                if (res && res.data) {
                    this.staffMembers = res.data.map(staff => ({
                        ...staff,
                        full_name: `${staff.first_name} ${staff.surname}`.trim()
                    }));
                }
            } catch (error) {
                console.error('Error loading staff members:', error);
            }
        },

        async loadCourses() {
            try {
                const res = await get(this.$endpoints.staff.getOpenCourses.url);
                this.courses = res || [];
            } catch (error) {
                console.error('Error loading courses:', error);
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
        // Form methods
        async createAllocation() {
            this.submitting = true;
            this.validation = {};

            try {
                // Set default session if not selected
                if (!this.allocationForm.session_id) {
                    this.allocationForm.session_id = this.currentSessionId;
                }

                // Set faculty and department from selected staff
                const selectedStaff = this.staffMembers.find(s => s.id === this.allocationForm.staff_id);
                if (selectedStaff) {
                    this.allocationForm.faculty_id = selectedStaff.faculty_id;
                    this.allocationForm.department_id = selectedStaff.department_id;
                }

                const response = await post(this.$endpoints.staff.assignCourses.url, this.allocationForm);

                if (response && !response.error) {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Courses assigned successfully',
                        life: 3000
                    });
                    this.resetForm();
                    this.loadAllocations();
                    this.switchToTab('allocations');
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
                this.submitting = false;
            }
        },

        resetForm() {
            this.allocationForm = {
                staff_id: '',
                course_ids: [],
                session_id: '',
                programme_id: '',
                semester_id: '',
                faculty_id: '',
                department_id: ''
            };
            this.validation = {};
        },

        onStaffChange() {
            // Auto-populate faculty and department when staff is selected
            const selectedStaff = this.staffMembers.find(s => s.id === this.allocationForm.staff_id);
            if (selectedStaff) {
                this.allocationForm.faculty_id = selectedStaff.faculty_id;
                this.allocationForm.department_id = selectedStaff.department_id;
            }
        },

        // Utility methods
        updateStatistics() {
            // Use Vue.nextTick to avoid reactivity issues
            this.$nextTick(() => {
                this.statistics = {
                    ...this.statistics,
                    totalStaff: this.staffMembers.length,
                    totalAllocations: this.allocations.length,
                    totalCourses: this.courses.length
                };
            });
        },

        getCourseCode(courseId) {
            const course = this.courses.find(c => c.id === courseId);
            return course ? course.code : 'N/A';
        },

        getStatusSeverity(status) {
            switch (status?.toLowerCase()) {
                case 'active': return 'success';
                case 'inactive': return 'danger';
                case 'assigned': return 'success';
                case 'freed': return 'danger';
                default: return 'success';
            }
        },

        getStatusIcon(status) {
            switch (status?.toLowerCase()) {
                case 'active': return 'pi pi-check';
                case 'inactive': return 'pi pi-times';
                default: return 'pi pi-check';
            }
        },

        getFullName(staff) {
            if (!staff) return 'N/A';
            const firstName = staff.first_name || '';
            const middleName = staff.middle_name || '';
            const surname = staff.surname || '';
            return `${firstName} ${middleName} ${surname}`.trim().replace(/\s+/g, ' ');
        },

        viewCourseDetails(course) {
            this.$toast.add({
                severity: 'info',
                summary: 'Course Details',
                detail: `${course.course_code} - ${course.course_title}`,
                life: 3000
            });
        },

        // New methods for staff course management
        async loadAllStaffWithCourses() {
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.filters.session_id) params.append('session_id', this.filters.session_id);
                if (this.searchQuery) params.append('search', this.searchQuery);

                const res = await get(`${this.$endpoints.staff.getAllStaffWithCourses.url}?${params.toString()}`);

                if (res) {
                    this.staffWithCourses = [...res];
                    // Force table re-render to prevent recursive updates
                    this.tableKey++;
                    // Update statistics without causing reactivity issues
                    this.$nextTick(() => {
                        this.statistics = {
                            totalStaff: this.staffWithCourses.length,
                            totalAllocations: this.staffWithCourses.reduce((sum, staff) => sum + (staff.total_courses || 0), 0),
                            totalCourses: this.courses.length
                        };
                    });
                }
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load staff with courses',
                    life: 3000
                });
            } finally {
                this.loading = false;
            }
        },

        debounceSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.loadAllStaffWithCourses();
            }, 500);
        },

        clearFilters() {
            this.filters = {
                staff_id: '',
                session_id: '',
                course_id: ''
            };
            this.searchQuery = '';
            this.$nextTick(() => {
                this.loadAllStaffWithCourses();
            });
        },

        // Staff course dialog methods
        viewAllStaffCourses(staff) {
            this.selectedStaff = staff;
            this.showStaffCoursesDialog = true;
        },

        assignCoursesToStaff(staff) {
            this.selectedStaff = staff;
            this.allocationForm.staff_id = staff.id;
            this.allocationForm.faculty_id = staff.faculty_id;
            this.allocationForm.department_id = staff.department_id;
            this.switchToTab('create');
            this.showStaffCoursesDialog = false;
        },

        getActiveCourses(staff) {
            return staff.assigned_courses?.filter(course => course.status === 'assigned') || [];
        },

        // Bulk remove methods
        showBulkRemoveDialogFuc(staff) {
            this.selectedStaff = staff;
            this.selectedCoursesToRemove = [];
            this.showBulkRemoveDialog = true;
        },

        closeBulkRemoveDialog() {
            this.showBulkRemoveDialog = false;
            this.selectedStaff = null;
            this.selectedCoursesToRemove = [];
        },

        toggleCourseSelection(courseId) {
            const index = this.selectedCoursesToRemove.indexOf(courseId);
            if (index > -1) {
                this.selectedCoursesToRemove.splice(index, 1);
            } else {
                this.selectedCoursesToRemove.push(courseId);
            }
        },

        async confirmBulkRemove() {
            this.removing = true;
            try {
                const courseIds = this.selectedCoursesToRemove.map(id => {
                    const course = this.selectedStaff.assigned_courses.find(c => c.id === id);
                    return course.course_id;
                });

                const response = await post(this.$endpoints.staff.unAssignCourses.url, {
                    course_ids: courseIds,
                    staff_id: this.selectedStaff.id,
                    session_id: this.filters.session_id || this.currentSessionId
                });

                if (response && !response.error) {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `${this.selectedCoursesToRemove.length} course(s) removed successfully`,
                        life: 3000
                    });
                    this.closeBulkRemoveDialog();
                    this.$nextTick(() => {
                        this.loadAllStaffWithCourses();
                    });
                } else {
                    throw new Error(response?.message || 'Failed to remove courses');
                }
            } catch (error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Failed to remove courses',
                    life: 3000
                });
            } finally {
                this.removing = false;
            }
        },

        async removeSingleCourse(staff, course) {
            try {
                const response = await post(this.$endpoints.staff.unAssignCourses.url, {
                    course_ids: [course.course_id],
                    staff_id: staff.id,
                    session_id: course.session_id
                });

                if (response && !response.error) {
                    // Remove course from local data
                    const courseIndex = staff.assigned_courses.findIndex(c => c.id === course.id);
                    if (courseIndex > -1) {
                        staff.assigned_courses.splice(courseIndex, 1);
                        staff.total_courses = staff.assigned_courses.length;
                    }

                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Course removed successfully',
                        life: 3000
                    });
                    this.$nextTick(() => {
                        this.loadAllStaffWithCourses();
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
            }
        },

        exportAllocations() {
            this.$toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Export functionality coming soon',
                life: 3000
            });
        },

        // Safe tab switching
        switchToTab(tabName) {
            this.activeTab = tabName;
            if (tabName === 'allocations') {
                this.$nextTick(() => {
                    this.loadAllStaffWithCourses();
                });
            }
        }
    },

    async created() {
        this.loadAllocations();
        this.loadAllStaffWithCourses();
        this.loadStaffMembers();
        this.loadCourses();
    },
    mounted(){
        this.$nextTick(function () {
            this.semesters = this.schoolSemesters;
            this.sessions = this.schoolSessions;
            this.programmes = this.schoolProgrammes;
        });
    }
}
</script>

<style scoped>
/* Course Allocation Container */
.course-allocation-container {
    min-height: 100vh;
    /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
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

.bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200 {
    background: white;
    border-radius: 15px;
    padding: 25px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 5px solid;
}

.bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200:hover {
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

.text-2xl font-bold dark:text-white {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1;
}

.text-sm text-gray-500 dark:text-gray-400 {
    font-size: 1rem;
    color: #6c757d;
    font-weight: 500;
    margin-top: 5px;
}

/* Tabs Section */
.tabs-section {
    margin-bottom: 30px;
}

.tabs-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.tab-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.tab-button {
    flex: 1;
    min-width: 200px;
}

.active-tab {
    background: #667eea !important;
    color: white !important;
    border-color: #667eea !important;
}

/* Content Section */
.content-section {
    margin-bottom: 30px;
}

/* Form Styling */
.allocation-form-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200 {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.allocation-form {
    padding: 20px;
}

.bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200 {
    margin-bottom: 25px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #667eea;
}

.text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200 {
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

.block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 {
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

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

/* Staff and Course Options */
.staff-option, .course-option {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.staff-info, .course-info {
    display: flex;
    align-items: center;
}

.staff-name, .course-title {
    font-weight: 500;
}

.staff-details, .course-details {
    color: #6c757d;
    font-size: 0.85rem;
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

/* Allocations List */
.allocations-list-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.list-title {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.allocations-placeholder {
    text-align: center;
    padding: 60px 20px;
    color: #6c757d;
}

/* Analytics */
.analytics-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    overflow: hidden;
}

.analytics-title {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.analytics-content {
    padding: 40px;
}

.analytics-placeholder {
    text-align: center;
    color: #6c757d;
}

/* Staff Allocations Table */
.staff-allocations-table {
    border-radius: 10px;
    /* overflow: hidden; */
}

.course-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.course-count-tag {
    font-size: 1.2rem;
    font-weight: 600;
}

.courses-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
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

.more-courses-tag {
    cursor: pointer;
    background: #e3f2fd !important;
    color: #1976d2 !important;
}

/* Staff Courses Dialog */
.staff-courses-dialog .p-dialog-content {
    padding: 0;
}

.staff-courses-content {
    padding: 20px;
}

.staff-summary {
    margin-bottom: 25px;
}

.staff-summary-card {
    background: #f8f9fa;
    border-left: 4px solid #667eea;
}

.staff-summary-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 25px;
}

.staff-summary-title, .courses-summary-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.staff-summary-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-row label {
    font-weight: 600;
    color: #495057;
}

.courses-summary-stats {
    display: flex;
    gap: 20px;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-item .text-2xl font-bold dark:text-white {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
}

.stat-item .text-sm text-gray-500 dark:text-gray-400 {
    font-size: 0.85rem;
    color: #6c757d;
    margin-top: 5px;
}

.courses-list-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #28a745;
}

.courses-list-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.staff-courses-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

/* Bulk Remove Dialog */
.bulk-remove-dialog .p-dialog-content {
    padding: 0;
}

.bulk-remove-content {
    padding: 20px;
}

.warning-message {
    margin-bottom: 20px;
}

.courses-selection {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid #dc3545;
}

.selection-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}

.course-selection-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border: 2px solid #e9ecef;
    cursor: pointer;
    transition: all 0.3s ease;
}

.course-selection-item:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.course-selection-item.selected {
    border-color: #dc3545;
    background: #fff5f5;
}

.course-selection-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.course-selection-details {
    margin-left: 25px;
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

    .form-grid {
        grid-template-columns: 1fr;
    }

    .tab-buttons {
        flex-direction: column;
    }

    .tab-button {
        min-width: auto;
    }

    .staff-summary-grid {
        grid-template-columns: 1fr;
    }

    .courses-summary-stats {
        flex-direction: column;
        gap: 10px;
    }

    .courses-grid {
        grid-template-columns: 1fr;
    }
}
</style>