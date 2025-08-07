<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header Section -->
            <Card class="shadow-sm">
                <template #content>
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                <i class="pi pi-calculator mr-2"></i>Advanced Result Compilation
                            </h1>
                            <p class="text-gray-600">
                                Compile student results with comprehensive GPA/CGPA calculations
                            </p>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Compilation Form -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-cog text-primary"></i>
                        <span>Compilation Parameters</span>
                    </div>
                </template>
                <template #content>
                    <form @submit.prevent="compileResults" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700">
                                    Session <span class="text-red-500">*</span>
                                </label>
                                <Dropdown v-model="compilationForm.session_id" :options="schoolSessions"
                                    optionLabel="name" optionValue="id" placeholder="Select Session" class="w-full"
                                    required />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700">
                                    Semester <span class="text-red-500">*</span>
                                </label>
                                <Dropdown v-model="compilationForm.semester" :options="semesterOptions"
                                    optionLabel="label" optionValue="value" placeholder="Select Semester" class="w-full"
                                    required />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700">
                                    Level <span class="text-red-500">*</span>
                                </label>
                                <Dropdown v-model="compilationForm.level_id" :options="schoolLevels" optionLabel="title"
                                    optionValue="id" placeholder="Select Level" class="w-full" required />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700">Programme (Optional)</label>
                                <Dropdown v-model="compilationForm.programme_id" :options="schoolProgrammes"
                                    optionLabel="name" optionValue="id" placeholder="All Programmes" class="w-full"
                                    :showClear="true" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700">Department (Optional)</label>
                                <Dropdown v-model="compilationForm.department_id" :options="schoolDepartments"
                                    optionLabel="name" optionValue="id" placeholder="All Departments" class="w-full"
                                    :showClear="true" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700">&nbsp;</label>
                                <div class="flex gap-3">
                                    <Button type="submit" :disabled="compiling" :loading="compiling" icon="pi pi-play"
                                        :label="compiling ? 'Compiling...' : 'Start Compilation'"
                                        class="p-button-primary" />
                                    <Button type="button" @click="resetForm" icon="pi pi-refresh" label="Reset"
                                        class="p-button-secondary" />
                                </div>
                            </div>
                        </div>
                    </form>
                </template>
            </Card>

            <!-- Compilation Progress -->
            <div v-if="compilationProgress.show" class="card mb-4">
                <div class="card-header">
                    <h5><i class="fas fa-chart-line"></i> Compilation Progress</h5>
                </div>
                <div class="card-body">
                    <div class="progress mb-3">
                        <div class="progress-bar" :class="progressBarClass"
                            :style="{ width: compilationProgress.percentage + '%' }">
                            {{ compilationProgress.percentage }}%
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-value">{{ compilationProgress.studentsProcessed }}</div>
                                <div class="stat-label">Students Processed</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-value">{{ compilationProgress.resultsProcessed }}</div>
                                <div class="stat-label">Results Processed</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-value">{{ compilationProgress.status }}</div>
                                <div class="stat-label">Status</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="compilationProgress.message" :class="compilationProgress.alertClass" class="mt-3 alert">
                        {{ compilationProgress.message }}
                    </div>
                </div>
            </div>

            <!-- Recent Compilation Logs -->
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5><i class="fas fa-history"></i> Recent Compilations</h5>
                    <button class="btn btn-sm btn-outline-primary" @click="loadCompilationLogs">
                        <i class="fas fa-refresh"></i> Refresh
                    </button>
                </div>
                <div class="card-body">
                    <div v-if="loadingLogs" class="text-center py-4">
                        <i class="fas fa-spinner fa-spin fa-2x"></i>
                        <p class="mt-2">Loading compilation logs...</p>
                    </div>

                    <div v-else-if="compilationLogs.length === 0" class="text-center py-4">
                        <i class="fas fa-inbox fa-2x text-muted"></i>
                        <p class="mt-2 text-muted">No compilation logs found</p>
                    </div>

                    <div v-else class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Session/Semester</th>
                                    <th>Level</th>
                                    <th>Programme</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Results</th>
                                    <th>Duration</th>
                                    <th>Compiled By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="log in compilationLogs" :key="log.id">
                                    <td>
                                        <strong>{{ log.session?.name }}</strong><br>
                                        <small class="text-muted">{{ log.semester_name }}</small>
                                    </td>
                                    <td>{{ log.level?.title }} Level</td>
                                    <td>{{ log.programme?.name || 'All Programmes' }}</td>
                                    <td>
                                        <span class="badge" :class="getStatusBadgeClass(log.status)">
                                            {{ log.status_display }}
                                        </span>
                                    </td>
                                    <td>{{ log.students_processed || 0 }}</td>
                                    <td>{{ log.results_processed || 0 }}</td>
                                    <td>{{ log.processing_time_human || 'N/A' }}</td>
                                    <td>{{ log.compiled_by?.first_name }} {{ log.compiled_by?.last_name }}</td>
                                    <td>{{ formatDate(log.created_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userDataMixin } from '@/mixins/userDataMixin';
import { post, get } from '@/api/client';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

export default {
    name: 'AdvancedResultCompilation',
    components: {
        Card,
        Button,
        Dropdown
    },
    mixins: [userDataMixin],

    data() {
        return {
            compilationForm: {
                session_id: '',
                semester: '',
                level_id: '',
                programme_id: '',
                department_id: ''
            },
            compiling: false,
            compilationProgress: {
                show: false,
                percentage: 0,
                studentsProcessed: 0,
                resultsProcessed: 0,
                status: 'Pending',
                message: '',
                alertClass: 'alert-info'
            },
            compilationLogs: [],
            loadingLogs: false,
            semesterOptions: [
                { label: 'First Semester', value: '1' },
                { label: 'Second Semester', value: '2' },
                { label: 'Third Semester', value: '3' }
            ]
        };
    },

    computed: {
        progressBarClass() {
            switch (this.compilationProgress.status.toLowerCase()) {
                case 'completed':
                    return 'bg-success';
                case 'failed':
                    return 'bg-danger';
                case 'processing':
                    return 'bg-warning';
                default:
                    return 'bg-info';
            }
        }
    },

    async mounted() {
        await this.waitForSchoolInfo();
        await this.loadCompilationLogs();
    },

    methods: {
        async compileResults() {
            if (!this.validateForm()) return;

            this.compiling = true;
            this.compilationProgress.show = true;
            this.compilationProgress.percentage = 0;
            this.compilationProgress.status = 'Starting';
            this.compilationProgress.message = 'Initializing compilation process...';
            this.compilationProgress.alertClass = 'alert-info';

            try {
                const response = await post(this.$endpoints.staff.compileAdvancedResults.url, this.compilationForm);

                if (response.success) {
                    this.compilationProgress.percentage = 100;
                    this.compilationProgress.status = 'Completed';
                    this.compilationProgress.studentsProcessed = response.data.students_processed;
                    this.compilationProgress.resultsProcessed = response.data.results_processed;
                    this.compilationProgress.message = response.data.message;
                    this.compilationProgress.alertClass = 'alert-success';

                    this.$globals.showMessage('Results compiled successfully!', 'success');
                    await this.loadCompilationLogs();
                } else {
                    throw new Error(response.message || 'Compilation failed');
                }
            } catch (error) {
                this.compilationProgress.percentage = 100;
                this.compilationProgress.status = 'Failed';
                this.compilationProgress.message = error.message || 'An error occurred during compilation';
                this.compilationProgress.alertClass = 'alert-danger';

                this.$globals.showMessage('Compilation failed: ' + error.message, 'error');
            } finally {
                this.compiling = false;
            }
        },

        async loadCompilationLogs() {
            this.loadingLogs = true;
            try {
                const response = await get(this.$endpoints.staff.getResultCompilationLogs.url);
                if (response && response.data) {
                    this.compilationLogs = response.data.data || [];
                }
            } catch (error) {
                console.error('Error loading compilation logs:', error);
                this.$globals.showMessage('Failed to load compilation logs', 'error');
            } finally {
                this.loadingLogs = false;
            }
        },

        validateForm() {
            if (!this.compilationForm.session_id) {
                this.$globals.showMessage('Please select a session', 'error');
                return false;
            }
            if (!this.compilationForm.semester) {
                this.$globals.showMessage('Please select a semester', 'error');
                return false;
            }
            if (!this.compilationForm.level_id) {
                this.$globals.showMessage('Please select a level', 'error');
                return false;
            }
            return true;
        },

        resetForm() {
            this.compilationForm = {
                session_id: '',
                semester: '',
                level_id: '',
                programme_id: '',
                department_id: ''
            };
            this.compilationProgress.show = false;
        },

        getStatusBadgeClass(status) {
            switch (status?.toLowerCase()) {
                case 'completed':
                    return 'badge-success';
                case 'failed':
                    return 'badge-danger';
                case 'processing':
                    return 'badge-warning';
                default:
                    return 'badge-secondary';
            }
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleString();
        }
    }
};
</script>

<style scoped>
.advanced-result-compilation {
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
    text-align: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
}

.stat-label {
    font-size: 12px;
    color: #6c757d;
    text-transform: uppercase;
    margin-top: 5px;
}

.progress {
    height: 25px;
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

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}
</style>