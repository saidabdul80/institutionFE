<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header Section -->
            <Card class="shadow-sm">
                <template #content>
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Result Management System
                            </h1>
                            <p class="text-gray-600">
                                Comprehensive result processing and management
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-3">
                            <Button @click="showComputationModal = true" icon="pi pi-calculator" label="Compute Results"
                                class="p-button-primary" size="small" />
                            <Button @click="showBulkUploadModal = true" icon="pi pi-upload" label="Bulk Upload"
                                class="p-button-success" size="small" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Filter Section -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-filter text-primary"></i>
                        <span>Filter Results</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Session</label>
                            <Dropdown v-model="filters.session_id" :options="sessions" optionLabel="name"
                                optionValue="id" placeholder="All Sessions" @change="loadResults" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Level</label>
                            <Dropdown v-model="filters.level_id" :options="levels" optionLabel="title" optionValue="id"
                                placeholder="All Levels" @change="loadResults" class="w-full" :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Programme</label>
                            <Dropdown v-model="filters.programme_id" :options="programmes" optionLabel="name"
                                optionValue="id" placeholder="All Programmes" @change="loadResults" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Semester</label>
                            <Dropdown v-model="filters.semester" :options="semesterOptions" optionLabel="label"
                                optionValue="value" placeholder="All Semesters" @change="loadResults" class="w-full"
                                :showClear="true" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Results Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm opacity-75 mb-1">Total Students</p>
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ resultStats.totalStudents || 0 }}
                            </p>
                        </div>
                        <div class="bg-white/20 rounded-full p-3">
                            <i class="fa fa-users text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm opacity-75 mb-1">Results Computed</p>
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ resultStats.resultsComputed || 0 }}
                            </p>
                        </div>
                        <div class="bg-white/20 rounded-full p-3">
                            <i class="fa fa-check-circle text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm opacity-75 mb-1">Pending Results</p>
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ resultStats.pendingResults || 0 }}
                            </p>
                        </div>
                        <div class="bg-white/20 rounded-full p-3">
                            <i class="fa fa-clock-o text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm opacity-75 mb-1">Average GPA</p>
                            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ (resultStats.averageGPA ||
                                0).toFixed(2) }}</p>
                        </div>
                        <div class="bg-white/20 rounded-full p-3">
                            <i class="fa fa-line-chart text-xl sm:text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Table -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100">
                <div class="border-b border-gray-200 p-4 sm:p-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 class="text-lg font-semibold text-gray-800">Student Results</h3>
                        <div class="flex gap-2">
                            <input v-model="searchQuery" @input="filterResults" type="text"
                                placeholder="Search students..."
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <button @click="exportResults"
                                class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                                <i class="fa fa-download mr-2"></i>Export
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="p-6 text-center">
                    <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p class="text-gray-600 mt-2">Loading results...</p>
                </div>

                <div v-else-if="filteredResults.length === 0" class="p-6 text-center">
                    <i class="fa fa-file-text text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No results found</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
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
                                    Programme
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Level
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CGPA</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Class
                                </th>
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
                            <tr v-for="result in paginatedResults" :key="result.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <img v-if="result.student.picture" :src="result.student.picture"
                                                class="h-10 w-10 rounded-full object-cover"
                                                :alt="result.student.first_name">
                                            <div v-else
                                                class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span class="text-sm font-medium text-gray-700">
                                                    {{ getInitials(result.student.first_name, result.student.last_name)
                                                    }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ result.student.first_name }} {{ result.student.last_name }}
                                            </div>
                                            <div class="text-sm text-gray-500">{{ result.student.email }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ result.student.matric_number }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ result.programme?.name || 'N/A' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ result.level?.name || 'N/A' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span class="font-medium">{{ (result.cgpa || 0).toFixed(2) }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="getClassColor(result.class_of_degree)"
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ result.class_of_degree || 'N/A' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="getStatusColor(result.status)"
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ result.status || 'Pending' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex gap-2">
                                        <button @click="viewResult(result)" class="text-blue-600 hover:text-blue-900">
                                            <i class="fa fa-eye"></i> View
                                        </button>
                                        <button @click="editResult(result)" class="text-green-600 hover:text-green-900">
                                            <i class="fa fa-edit"></i> Edit
                                        </button>
                                        <button @click="printResult(result)"
                                            class="text-purple-600 hover:text-purple-900">
                                            <i class="fa fa-print"></i> Print
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
                                <span class="font-medium">{{ filteredResults.length }}</span> results
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

            <!-- Result Computation Modal -->
            <Dialog v-model:visible="showComputationModal" modal header="Compute Results" :style="{ width: '600px' }">
                <div class="p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Session</label>
                        <select v-model="computationForm.session_id"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">Select Session</option>
                            <option v-for="session in sessions" :key="session.id" :value="session.id">
                                {{ session.name }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Level</label>
                        <select v-model="computationForm.level_id"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">Select Level</option>
                            <option v-for="level in levels" :key="level.id" :value="level.id">
                                {{ level.title }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select Programme</label>
                        <select v-model="computationForm.programme_id"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">Select Programme</option>
                            <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
                                {{ programme.name }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                        <select v-model="computationForm.semester"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">Select Semester</option>
                            <option value="1">First Semester</option>
                            <option value="2">Second Semester</option>
                            <option value="3">Third Semester</option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <Button label="Cancel" severity="secondary" @click="showComputationModal = false" />
                        <Button label="Compute Results" @click="computeResults"
                            :disabled="!computationForm.session_id || !computationForm.level_id" />
                    </div>
                </div>
            </Dialog>

            <!-- Bulk Upload Modal -->
            <Dialog v-model:visible="showBulkUploadModal" modal header="Bulk Upload Results"
                :style="{ width: '500px' }">
                <div class="p-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                        <input type="file" @change="handleFileUpload" accept=".csv,.xlsx"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <p class="text-xs text-gray-500 mt-1">
                            Supported formats: CSV, Excel (Max size: 10MB)
                        </p>
                    </div>

                    <div class="mb-4">
                        <a href="/templates/result-upload-template.csv" download
                            class="text-blue-600 hover:text-blue-800 text-sm">
                            <i class="fa fa-download mr-1"></i>Download Template
                        </a>
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <Button label="Cancel" severity="secondary" @click="showBulkUploadModal = false" />
                        <Button label="Upload" @click="uploadResults" :disabled="!selectedFile" />
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';

export default {
    components: {
        Dialog,
        Button,
        Card,
        Dropdown
    },
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            showComputationModal: false,
            showBulkUploadModal: false,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 10,
            filters: {
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
            results: [],
            filteredResults: [],
            resultStats: {
                totalStudents: 0,
                resultsComputed: 0,
                pendingResults: 0,
                averageGPA: 0
            },
            computationForm: {
                session_id: '',
                level_id: '',
                programme_id: '',
                semester: ''
            },
            selectedFile: null
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredResults.length / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage + 1;
        },
        endIndex() {
            return Math.min(this.currentPage * this.itemsPerPage, this.filteredResults.length);
        },
        paginatedResults() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredResults.slice(start, end);
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

            await this.loadResults();
        },
        async loadResults() {
            this.loading = true;
            try {
                // This would be a dedicated result endpoint
                // For now, using mock data structure
                this.results = [
                    {
                        id: 1,
                        student: {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            email: 'john.doe@example.com',
                            matric_number: 'CSC/2020/001',
                            picture: null
                        },
                        programme: { id: 1, name: 'Computer Science' },
                        level: { id: 1, name: '100 Level' },
                        cgpa: 3.75,
                        class_of_degree: 'Second Class Upper',
                        status: 'Computed'
                    }
                ];

                this.calculateStats();
                this.filterResults();
            } catch (error) {
                console.error('Error loading results:', error);
            } finally {
                this.loading = false;
            }
        },
        calculateStats() {
            this.resultStats = {
                totalStudents: this.results.length,
                resultsComputed: this.results.filter(r => r.status === 'Computed').length,
                pendingResults: this.results.filter(r => r.status === 'Pending').length,
                averageGPA: this.results.reduce((sum, r) => sum + (r.cgpa || 0), 0) / this.results.length || 0
            };
        },
        filterResults() {
            let filtered = this.results;

            // Apply search filter
            if (this.searchQuery) {
                filtered = filtered.filter(result =>
                    result.student.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    result.student.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    result.student.matric_number.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            // Apply other filters
            if (this.filters.programme_id) {
                filtered = filtered.filter(result => result.programme?.id == this.filters.programme_id);
            }

            if (this.filters.level_id) {
                filtered = filtered.filter(result => result.level?.id == this.filters.level_id);
            }

            this.filteredResults = filtered;
            this.currentPage = 1;
        },
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : '';
            const last = lastName ? lastName.charAt(0).toUpperCase() : '';
            return first + last || 'N/A';
        },
        getClassColor(classOfDegree) {
            const colors = {
                'First Class': 'bg-green-100 text-green-800',
                'Second Class Upper': 'bg-blue-100 text-blue-800',
                'Second Class Lower': 'bg-yellow-100 text-yellow-800',
                'Third Class': 'bg-orange-100 text-orange-800',
                'Pass': 'bg-gray-100 text-gray-800'
            };
            return colors[classOfDegree] || 'bg-gray-100 text-gray-800';
        },
        getStatusColor(status) {
            const colors = {
                'Computed': 'bg-green-100 text-green-800',
                'Pending': 'bg-yellow-100 text-yellow-800',
                'Processing': 'bg-blue-100 text-blue-800',
                'Error': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        viewResult(result) {
            this.$router.push({ name: 'staff-student-profile', params: { id: result.student.id } });
        },
        editResult(result) {
            console.log('Edit result:', result);
        },
        printResult(result) {
            console.log('Print result:', result);
        },
        exportResults() {
            console.log('Export results');
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
        },
        async computeResults() {
            try {
                const response = await post(this.$endpoints.staff.computeResults.url, this.computationForm);
                if (response && !response.error) {
                    this.showComputationModal = false;
                    this.computationForm = { session_id: '', level_id: '', programme_id: '', semester: '' };
                    await this.loadResults();

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
            }
        },
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadResults() {
            if (!this.selectedFile) return;

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                const response = await post(this.$endpoints.staff.bulkUploadResults.url, formData);
                if (response && !response.error) {
                    this.showBulkUploadModal = false;
                    this.selectedFile = null;
                    await this.loadResults();

                    this.$globals.message = {
                        text: 'Results uploaded successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error uploading results:', error);
            }
        }
    },
    async mounted() {
        await this.loadInitialData();
    }
}
</script>
