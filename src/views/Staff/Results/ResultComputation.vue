<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header Section -->
            <Card class="shadow-sm">
                <template #content>
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Result Computation Engine
                            </h1>
                            <p class="text-gray-600">
                                Nigerian Higher Institution GPA & CGPA Computation System
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-3">
                            <Button @click="showGradeSettingsModal = true" icon="pi pi-cog" label="Grade Settings"
                                class="p-button-secondary" size="small" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Computation Parameters -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-settings text-primary"></i>
                        <span>Computation Parameters</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Academic Session</label>
                            <Dropdown v-model="computationParams.session_id" :options="sessions" optionLabel="name"
                                optionValue="id" placeholder="Select Session" @change="loadStudents" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Level</label>
                            <Dropdown v-model="computationParams.level_id" :options="levels" optionLabel="title"
                                optionValue="id" placeholder="Select Level" @change="loadStudents" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Programme</label>
                            <Dropdown v-model="computationParams.programme_id" :options="programmes" optionLabel="name"
                                optionValue="id" placeholder="Select Programme" @change="loadStudents" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Semester</label>
                            <Dropdown v-model="computationParams.semester" :options="semesterOptions"
                                optionLabel="label" optionValue="value" placeholder="Select Semester"
                                @change="loadStudents" class="w-full" :showClear="true" />
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <Button @click="computeAllResults" :disabled="!canCompute || computing" :loading="computing"
                            icon="pi pi-calculator" :label="computing ? 'Computing...' : 'Compute All Results'"
                            class="p-button-primary" />

                        <Button @click="previewComputation" :disabled="!canCompute" icon="pi pi-eye"
                            label="Preview Computation" class="p-button-success" />

                        <Button @click="exportComputationReport" :disabled="students.length === 0" icon="pi pi-download"
                            label="Export Report" class="p-button-help" />
                    </div>
                </template>
            </Card>

            <!-- Grading System Overview -->
            <!-- <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800"> Grading System</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-medium text-gray-700 mb-3">Grade Scale</h4>
                    <div class="space-y-2">
                        <div v-for="grade in gradeScale" :key="grade.grade" 
                             class="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span class="font-medium">{{ grade.grade }}</span>
                            <span class="text-sm text-gray-600">{{ grade.min_score }}-{{ grade.max_score }}%</span>
                            <span class="font-medium text-blue-600">{{ grade.point }} pts</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-medium text-gray-700 mb-3">Class of Degree</h4>
                    <div class="space-y-2">
                        <div v-for="degreeClass in degreeClasses" :key="degreeClass.name" 
                             class="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span class="font-medium">{{ degreeClass.name }}</span>
                            <span class="text-sm text-gray-600">{{ degreeClass.min_cgpa }}-{{ degreeClass.max_cgpa }} CGPA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

            <!-- Students List -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100">
                <div class="border-b border-gray-200 p-4 sm:p-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 class="text-lg font-semibold text-gray-800">
                            Students for Computation ({{ students.length }})
                        </h3>
                        <div class="flex gap-2">
                            <input v-model="searchQuery" @input="filterStudents" type="text"
                                placeholder="Search students..."
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <button @click="selectAllStudents"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                                {{ allSelected ? 'Deselect All' : 'Select All' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="p-6 text-center">
                    <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p class="text-gray-600 mt-2">Loading students...</p>
                </div>

                <div v-else-if="filteredStudents.length === 0" class="p-6 text-center">
                    <i class="fa fa-users text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No students found for the selected parameters</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" v-model="allSelected" @change="toggleSelectAll"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Matric No
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current
                                    GPA</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current
                                    CGPA</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                    Units</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="student in paginatedStudents" :key="student.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <input type="checkbox" v-model="selectedStudents" :value="student.id"
                                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <img v-if="student.picture" :src="student.picture"
                                                class="h-10 w-10 rounded-full object-cover" :alt="student.first_name">
                                            <div v-else
                                                class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span class="text-sm font-medium text-gray-700">
                                                    {{ getInitials(student.first_name, student.last_name) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ student.first_name }} {{ student.last_name }}
                                            </div>
                                            <div class="text-sm text-gray-500">{{ student.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ student.matric_number }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span class="font-medium">{{ (student.current_gpa || 0).toFixed(2) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span class="font-medium">{{ (student.current_cgpa || 0).toFixed(2) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ student.total_units || 0 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="getComputationStatusColor(student.computation_status)"
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ student.computation_status || 'Pending' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex gap-2">
                                        <button @click="viewStudentScores(student)"
                                            class="text-blue-600 hover:text-blue-900">
                                            <i class="fa fa-eye"></i> Scores
                                        </button>
                                        <button @click="computeIndividualResult(student)"
                                            class="text-green-600 hover:text-green-900">
                                            <i class="fa fa-calculator"></i> Compute
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button @click="previousPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Showing <span class="font-medium">{{ startIndex }}</span> to <span
                                    class="font-medium">{{ endIndex
                                    }}</span> of
                                <span class="font-medium">{{ filteredStudents.length }}</span> students
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination">
                                <button @click="previousPage" :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                    <i class="fa fa-chevron-left"></i>
                                </button>
                                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                    :class="page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                    {{ page }}
                                </button>
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                    <i class="fa fa-chevron-right"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

export default {
    components: {
        Card,
        Button,
        Dropdown
    },
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            computing: false,
            showGradeSettingsModal: false,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 10,
            allSelected: false,
            selectedStudents: [],
            computationParams: {
                session_id: '',
                level_id: '',
                programme_id: '',
                semester: ''
            },
            sessions: [],
            levels: [],
            programmes: [],
            semesterOptions: [
                { label: 'First Semester', value: '1' },
                { label: 'Second Semester', value: '2' },
                { label: 'Third Semester', value: '3' }
            ],
            students: [],
            filteredStudents: [],
            gradeScale: [
                { grade: 'A', min_score: 70, max_score: 100, point: 5.0 },
                { grade: 'B', min_score: 60, max_score: 69, point: 4.0 },
                { grade: 'C', min_score: 50, max_score: 59, point: 3.0 },
                { grade: 'D', min_score: 45, max_score: 49, point: 2.0 },
                { grade: 'E', min_score: 40, max_score: 44, point: 1.0 },
                { grade: 'F', min_score: 0, max_score: 39, point: 0.0 }
            ],
            degreeClasses: [
                { name: 'First Class', min_cgpa: 4.50, max_cgpa: 5.00 },
                { name: 'Second Class Upper', min_cgpa: 3.50, max_cgpa: 4.49 },
                { name: 'Second Class Lower', min_cgpa: 2.40, max_cgpa: 3.49 },
                { name: 'Third Class', min_cgpa: 1.50, max_cgpa: 2.39 },
                { name: 'Pass', min_cgpa: 1.00, max_cgpa: 1.49 }
            ]
        }
    },
    computed: {
        canCompute() {
            return this.computationParams.session_id &&
                this.computationParams.level_id &&
                this.computationParams.programme_id &&
                this.computationParams.semester;
        },
        totalPages() {
            return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage + 1;
        },
        endIndex() {
            return Math.min(this.currentPage * this.itemsPerPage, this.filteredStudents.length);
        },
        paginatedStudents() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredStudents.slice(start, end);
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        }
    },
    methods: {
        async loadInitialData() {
            // Wait for school info to be loaded if not already available
            await this.waitForSchoolInfo();

            // Use school info data instead of making API calls
            this.sessions = this.schoolSessions;
            this.levels = this.schoolLevels;
            this.programmes = this.schoolProgrammes;
        },
        async loadStudents() {
            if (!this.canCompute) {
                this.students = [];
                this.filteredStudents = [];
                return;
            }

            this.loading = true;
            try {
                // This would be a dedicated endpoint for students in computation parameters
                // For now, using mock data
                this.students = [
                    {
                        id: 1,
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john.doe@example.com',
                        matric_number: 'CSC/2020/001',
                        picture: null,
                        current_gpa: 3.75,
                        current_cgpa: 3.65,
                        total_units: 24,
                        computation_status: 'Pending'
                    },
                    {
                        id: 2,
                        first_name: 'Jane',
                        last_name: 'Smith',
                        email: 'jane.smith@example.com',
                        matric_number: 'CSC/2020/002',
                        picture: null,
                        current_gpa: 4.25,
                        current_cgpa: 4.10,
                        total_units: 24,
                        computation_status: 'Computed'
                    }
                ];

                this.filterStudents();
            } catch (error) {
                console.error('Error loading students:', error);
            } finally {
                this.loading = false;
            }
        },
        filterStudents() {
            let filtered = this.students;

            if (this.searchQuery) {
                filtered = filtered.filter(student =>
                    student.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    student.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    student.matric_number.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            this.filteredStudents = filtered;
            this.currentPage = 1;
        },
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : '';
            const last = lastName ? lastName.charAt(0).toUpperCase() : '';
            return first + last || 'N/A';
        },
        getComputationStatusColor(status) {
            const colors = {
                'Computed': 'bg-green-100 text-green-800',
                'Pending': 'bg-yellow-100 text-yellow-800',
                'Processing': 'bg-blue-100 text-blue-800',
                'Error': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        selectAllStudents() {
            this.allSelected = !this.allSelected;
            this.toggleSelectAll();
        },
        toggleSelectAll() {
            if (this.allSelected) {
                this.selectedStudents = this.filteredStudents.map(student => student.id);
            } else {
                this.selectedStudents = [];
            }
        },
        async computeAllResults() {
            if (this.selectedStudents.length === 0) {
                alert('Please select at least one student');
                return;
            }

            this.computing = true;
            try {
                const payload = {
                    ...this.computationParams,
                    student_ids: this.selectedStudents
                };

                const response = await post(this.$endpoints.staff.computeResults.url, payload);
                if (response && !response.error) {
                    await this.loadStudents();
                    this.selectedStudents = [];
                    this.allSelected = false;

                    this.$globals.message = {
                        text: 'Results computed successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error computing results:', error);
            } finally {
                this.computing = false;
            }
        },
        async computeIndividualResult(student) {
            try {
                const payload = {
                    ...this.computationParams,
                    student_id: student.id
                };

                const response = await post(this.$endpoints.staff.computeIndividualResult.url, payload);
                if (response && !response.error) {
                    await this.loadStudents();

                    this.$globals.message = {
                        text: `Result computed for ${student.first_name} ${student.last_name}`,
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error computing individual result:', error);
            }
        },
        previewComputation() {
            console.log('Preview computation for:', this.computationParams);
        },
        exportComputationReport() {
            console.log('Export computation report');
        },
        viewStudentScores(student) {
            this.$router.push({
                name: 'staff-student-profile',
                params: { id: student.id },
                query: { tab: 'scores' }
            });
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        goToPage(page) {
            this.currentPage = page;
        }
    },
    async mounted() {
        await this.loadInitialData();
    }
}
</script>
