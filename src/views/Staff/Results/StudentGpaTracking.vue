<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header Section -->
            <Card class="shadow-sm">
                <template #content>
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                <i class="pi pi-chart-line mr-2"></i>Student GPA Tracking
                            </h1>
                            <p class="text-gray-600">
                                Track student academic performance with comprehensive GPA/CGPA analysis
                            </p>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Filters -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-filter text-primary"></i>
                        <span>Filters</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Session</label>
                            <Dropdown v-model="filters.session_id" :options="schoolSessions" optionLabel="name"
                                optionValue="id" placeholder="All Sessions" @change="loadGpaRecords" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Semester</label>
                            <Dropdown v-model="filters.semester" :options="semesterOptions" optionLabel="label"
                                optionValue="value" placeholder="All Semesters" @change="loadGpaRecords" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Level</label>
                            <Dropdown v-model="filters.level_id" :options="schoolLevels" optionLabel="title"
                                optionValue="id" placeholder="All Levels" @change="loadGpaRecords" class="w-full"
                                :showClear="true" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Programme</label>
                            <Dropdown v-model="filters.programme_id" :options="schoolProgrammes" optionLabel="name"
                                optionValue="id" placeholder="All Programmes" @change="loadGpaRecords" class="w-full"
                                :showClear="true" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stat-card bg-primary text-white">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">{{ statistics.totalStudents }}</div>
                            <div class="stat-label">Total Students</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card bg-success text-white">
                        <div class="stat-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">{{ statistics.averageCgpa }}</div>
                            <div class="stat-label">Average CGPA</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card bg-warning text-white">
                        <div class="stat-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">{{ statistics.studentsOnProbation }}</div>
                            <div class="stat-label">On Probation</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card bg-info text-white">
                        <div class="stat-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">{{ statistics.graduationEligible }}</div>
                            <div class="stat-label">Graduation Eligible</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GPA Records Table -->
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5><i class="fas fa-table"></i> Student GPA Records</h5>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" @click="loadGpaRecords">
                            <i class="fas fa-refresh"></i> Refresh
                        </button>
                        <button class="btn btn-sm btn-success ml-2" @click="exportGpaRecords">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                        <i class="fas fa-spinner fa-spin fa-2x"></i>
                        <p class="mt-2">Loading GPA records...</p>
                    </div>

                    <div v-else-if="gpaRecords.length === 0" class="text-center py-4">
                        <i class="fas fa-inbox fa-2x text-muted"></i>
                        <p class="mt-2 text-muted">No GPA records found</p>
                    </div>

                    <div v-else class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Matric Number</th>
                                    <th>Programme</th>
                                    <th>Session/Semester</th>
                                    <th>Level</th>
                                    <th>RCU</th>
                                    <th>ECU</th>
                                    <th>GPA</th>
                                    <th>CGPA</th>
                                    <th>Academic Status</th>
                                    <th>Carry Overs</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="record in gpaRecords" :key="record.id">
                                    <td>
                                        <strong>{{ record.student?.first_name }} {{ record.student?.last_name
                                        }}</strong>
                                    </td>
                                    <td>{{ record.student?.matric_number }}</td>
                                    <td>{{ record.programme?.name }}</td>
                                    <td>
                                        <strong>{{ record.session?.name }}</strong><br>
                                        <small class="text-muted">{{ record.semester_name }}</small>
                                    </td>
                                    <td>{{ record.level?.title }} Level</td>
                                    <td>{{ record.registered_credit_units }}</td>
                                    <td>{{ record.earned_credit_units }}</td>
                                    <td>
                                        <span class="badge" :class="getGpaBadgeClass(record.gpa)">
                                            {{ record.gpa }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge" :class="getCgpaBadgeClass(record.cgpa)">
                                            {{ record.cgpa }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge" :class="getStatusBadgeClass(record.academic_status)">
                                            {{ formatAcademicStatus(record.academic_status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="record.carry_over_courses" class="text-danger">
                                            {{ record.carry_over_courses }}
                                        </span>
                                        <span v-else class="text-success">None</span>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-info" @click="viewStudentDetails(record)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="pagination.total > pagination.per_page" class="d-flex justify-content-center mt-3">
                        <nav>
                            <ul class="pagination">
                                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                                    <button class="page-link"
                                        @click="changePage(pagination.current_page - 1)">Previous</button>
                                </li>
                                <li v-for="page in visiblePages" :key="page" class="page-item"
                                    :class="{ active: page === pagination.current_page }">
                                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                </li>
                                <li class="page-item"
                                    :class="{ disabled: pagination.current_page === pagination.last_page }">
                                    <button class="page-link"
                                        @click="changePage(pagination.current_page + 1)">Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- Student Details Modal -->
            <div class="modal fade" id="studentDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-user"></i> Student Academic Performance
                            </h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-if="selectedStudent">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <strong>Name:</strong> {{ selectedStudent.student?.first_name }} {{
                                            selectedStudent.student?.last_name }}
                                    </div>
                                    <div class="col-md-6">
                                        <strong>Matric Number:</strong> {{ selectedStudent.student?.matric_number }}
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <strong>Programme:</strong> {{ selectedStudent.programme?.name }}
                                    </div>
                                    <div class="col-md-6">
                                        <strong>Current Level:</strong> {{ selectedStudent.level?.title }} Level
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <strong>Current GPA:</strong>
                                        <span class="badge" :class="getGpaBadgeClass(selectedStudent.gpa)">
                                            {{ selectedStudent.gpa }}
                                        </span>
                                    </div>
                                    <div class="col-md-4">
                                        <strong>Current CGPA:</strong>
                                        <span class="badge" :class="getCgpaBadgeClass(selectedStudent.cgpa)">
                                            {{ selectedStudent.cgpa }}
                                        </span>
                                    </div>
                                    <div class="col-md-4">
                                        <strong>Academic Status:</strong>
                                        <span class="badge"
                                            :class="getStatusBadgeClass(selectedStudent.academic_status)">
                                            {{ formatAcademicStatus(selectedStudent.academic_status) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <strong>Total Credit Units Registered:</strong> {{
                                            selectedStudent.total_registered_credit_units }}
                                    </div>
                                    <div class="col-md-6">
                                        <strong>Total Credit Units Earned:</strong> {{
                                            selectedStudent.total_earned_credit_units
                                        }}
                                    </div>
                                </div>
                                <div v-if="selectedStudent.carry_over_courses" class="row mb-3">
                                    <div class="col-12">
                                        <strong>Carry Over Courses:</strong>
                                        <div class="mt-2">
                                            <span class="badge badge-danger mr-1"
                                                v-for="course in selectedStudent.carry_over_courses.split(',')"
                                                :key="course">
                                                {{ course.trim() }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userDataMixin } from '@/mixins/userDataMixin';
import { get } from '@/api/client';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';

export default {
    name: 'StudentGpaTracking',
    components: {
        Card,
        Dropdown
    },
    mixins: [userDataMixin],

    data() {
        return {
            filters: {
                session_id: '',
                semester: '',
                level_id: '',
                programme_id: ''
            },
            gpaRecords: [],
            loading: false,
            selectedStudent: null,
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 50,
                total: 0
            },
            statistics: {
                totalStudents: 0,
                averageCgpa: '0.00',
                studentsOnProbation: 0,
                graduationEligible: 0
            },
            semesterOptions: [
                { label: 'First Semester', value: '1' },
                { label: 'Second Semester', value: '2' },
                { label: 'Third Semester', value: '3' }
            ]
        };
    },

    computed: {
        visiblePages() {
            const pages = [];
            const start = Math.max(1, this.pagination.current_page - 2);
            const end = Math.min(this.pagination.last_page, this.pagination.current_page + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        }
    },

    async mounted() {
        await this.waitForSchoolInfo();
        await this.loadGpaRecords();
    },

    methods: {
        async loadGpaRecords(page = 1) {
            this.loading = true;
            try {
                const params = new URLSearchParams({
                    page: page,
                    ...this.filters
                });

                const response = await get(`${this.$endpoints.staff.getStudentSemesterGpa.url}?${params}`);
                if (response && response.data) {
                    this.gpaRecords = response.data.data || [];
                    this.pagination = {
                        current_page: response.data.current_page || 1,
                        last_page: response.data.last_page || 1,
                        per_page: response.data.per_page || 50,
                        total: response.data.total || 0
                    };

                    this.calculateStatistics();
                }
            } catch (error) {
                console.error('Error loading GPA records:', error);
                this.$globals.showMessage('Failed to load GPA records', 'error');
            } finally {
                this.loading = false;
            }
        },

        calculateStatistics() {
            this.statistics.totalStudents = this.gpaRecords.length;

            if (this.gpaRecords.length > 0) {
                const totalCgpa = this.gpaRecords.reduce((sum, record) => sum + parseFloat(record.cgpa || 0), 0);
                this.statistics.averageCgpa = (totalCgpa / this.gpaRecords.length).toFixed(2);

                this.statistics.studentsOnProbation = this.gpaRecords.filter(record =>
                    record.academic_status === 'probation'
                ).length;

                this.statistics.graduationEligible = this.gpaRecords.filter(record =>
                    parseFloat(record.cgpa || 0) >= 1.50 && !record.carry_over_courses
                ).length;
            } else {
                this.statistics.averageCgpa = '0.00';
                this.statistics.studentsOnProbation = 0;
                this.statistics.graduationEligible = 0;
            }
        },

        changePage(page) {
            if (page >= 1 && page <= this.pagination.last_page) {
                this.loadGpaRecords(page);
            }
        },

        viewStudentDetails(record) {
            this.selectedStudent = record;
            $('#studentDetailsModal').modal('show');
        },

        getGpaBadgeClass(gpa) {
            const gpaValue = parseFloat(gpa || 0);
            if (gpaValue >= 4.5) return 'badge-success';
            if (gpaValue >= 3.5) return 'badge-info';
            if (gpaValue >= 2.4) return 'badge-warning';
            if (gpaValue >= 1.5) return 'badge-secondary';
            return 'badge-danger';
        },

        getCgpaBadgeClass(cgpa) {
            return this.getGpaBadgeClass(cgpa);
        },

        getStatusBadgeClass(status) {
            switch (status) {
                case 'good_standing':
                    return 'badge-success';
                case 'probation':
                    return 'badge-warning';
                case 'withdrawal':
                    return 'badge-danger';
                default:
                    return 'badge-secondary';
            }
        },

        formatAcademicStatus(status) {
            switch (status) {
                case 'good_standing':
                    return 'Good Standing';
                case 'probation':
                    return 'Probation';
                case 'withdrawal':
                    return 'Withdrawal';
                default:
                    return status;
            }
        },

        async exportGpaRecords() {
            try {
                this.$globals.showMessage('Export functionality coming soon!', 'info');
            } catch (error) {
                this.$globals.showMessage('Export failed', 'error');
            }
        }
    }
};
</script>

<style scoped>
.student-gpa-tracking {
    padding: 20px;
}

.page-header {
    margin-bottom: 30px;
}

.page-header h2 {
    color: #2c3e50;
    margin-bottom: 5px;
}

.stat-card {
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    font-size: 2.5rem;
    margin-right: 20px;
    opacity: 0.8;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
}

.table th {
    background-color: #f8f9fa;
    border-top: none;
    font-weight: 600;
    color: #2c3e50;
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.card-header h5 {
    margin: 0;
    color: #2c3e50;
}

.badge {
    font-size: 0.8rem;
}

.pagination .page-link {
    color: #007bff;
}

.pagination .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
}
</style>