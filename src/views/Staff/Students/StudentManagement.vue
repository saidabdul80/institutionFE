<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Student Management
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Manage student records, registration, and academic status
                    </p>
                </div>
                <div class="flex gap-2">
                    <!-- <button @click="showAddStudentModal = true" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fa fa-plus mr-2"></i>Add Student
                    </button>
                    <button @click="showBulkUploadModal = true" 
                            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-upload mr-2"></i>Bulk Upload
                    </button> -->
                    <button @click="exportStudents" 
                            class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fa fa-download mr-2"></i>Export
                    </button>
                </div>
            </div>
        </div>

        <!-- Advanced Search Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Advanced Student Search</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
                    <select v-model="advancedSearch.type"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All Fields</option>
                        <option value="matric_number">Matric Number</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
                    <input v-model="advancedSearch.query"
                           type="text"
                           placeholder="Enter search term..."
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           @keyup.enter="performAdvancedSearch">
                </div>
                <div class="flex items-end">
                    <button @click="performAdvancedSearch"
                            :disabled="!advancedSearch.query || searchingStudents"
                            class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400">
                        <i class="fa fa-search mr-2"></i>
                        {{ searchingStudents ? 'Searching...' : 'Search' }}
                    </button>
                </div>
            </div>

            <!-- Search Results -->
            <div v-if="searchResults.length > 0" class="mt-4">
                <h4 class="text-md font-semibold mb-2 text-gray-800">Search Results ({{ searchResults.length }})</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    <div v-for="student in searchResults" :key="student.id"
                         class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                         @click="viewStudentProfile(student)">
                        <div class="font-medium">{{ student.first_name }} {{ student.last_name }}</div>
                        <div class="text-sm text-gray-600">{{ student.matric_number }}</div>
                        <div class="text-sm text-gray-600">{{ student.programme?.name || 'N/A' }}</div>
                        <div class="text-xs text-gray-500">{{ student.email }}</div>
                    </div>
                </div>
                <button @click="clearSearchResults"
                        class="mt-2 text-sm text-blue-500 hover:text-blue-700">
                    Clear Search Results
                </button>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Filter Students</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <select v-model="filters.session_id" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select v-model="filters.level_id" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Levels</option>
                        <option v-for="level in levels" :key="level.id" :value="level.id">
                            {{ level.title }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <select v-model="filters.programme_id" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Programmes</option>
                        <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
                            {{ programme.name }}
                        </option>
                    </select>
                </div>
                
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="filters.status" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option v-for="option in statusOptions" :key="option" :value="option">
                            {{ option }}</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Student Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Students</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ studentStats.total || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-users text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Active Students</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ studentStats.active || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-check-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">New This Session</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ studentStats.newThisSession || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-user-plus text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Graduated</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ studentStats.graduated || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-graduation-cap text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Students Table -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="border-b border-gray-200 p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 class="text-lg font-semibold text-gray-800">Students ({{ filteredStudents.length }})</h3>
                    <div class="flex gap-2">
                        <input v-model="searchQuery" @input="filterStudents" type="text" 
                               placeholder="Search students..." 
                               class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <select v-model="itemsPerPage" @change="currentPage = 1" 
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading students...</p>
            </div>
            
            <div v-else-if="filteredStudents.length === 0" class="p-6 text-center">
                <i class="fa fa-users text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No students found</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="student in paginatedStudents" :key="student.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img v-if="student.picture" :src="student.picture" 
                                             class="h-10 w-10 rounded-full object-cover" :alt="student.first_name">
                                        <div v-else class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
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
                                {{ student.programme?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ student.level?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ (student.cgpa || 0).toFixed(2) }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(student.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ student.status || 'Active' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="viewStudent(student)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-eye"></i> View
                                    </button>
                                    <button @click="editStudent(student)" 
                                            class="text-green-600 hover:text-green-900">
                                        <i class="fa fa-edit"></i> Edit
                                    </button>
                                    <button @click="toggleStudentStatus(student)" 
                                            :class="student.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                                        <i :class="student.status === 'active' ? 'fa fa-ban' : 'fa fa-check'"></i>
                                        {{ student.status === 'active' ? 'Deactivate' : 'Activate' }}
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
                            Showing <span class="font-medium">{{ startIndex }}</span> to <span class="font-medium">{{ endIndex }}</span> of
                            <span class="font-medium">{{ filteredStudents.length }}</span> students
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            showAddStudentModal: false,
            showBulkUploadModal: false,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 25,
            // Advanced search
            advancedSearch: {
                type: 'all',
                query: ''
            },
            statusOptions: [
                'active','expel','rusticated','voluntary withdraw','academic withdrawal','death','deferment','suspension','graduated','withdrawn'
            ],
            searchResults: [],
            searchingStudents: false,
            filters: {
                session_id: '',
                level_id: '',
                programme_id: '',
                status: ''
            },
            sessions: [],
            levels: [],
            programmes: [],
            students: [],
            filteredStudents: [],
            studentStats: {
                total: 0,
                active: 0,
                newThisSession: 0,
                graduated: 0
            }
        }
    },
    computed: {
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

            await Promise.all([
                this.loadStudents(),
                this.loadStudentStats()
            ]);
        },
        async loadStudents() {
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.filters.session_id) params.append('session_id', this.filters.session_id);
                if (this.filters.level_id) params.append('level_id', this.filters.level_id);
                if (this.filters.programme_id) params.append('programme_id', this.filters.programme_id);
                if (this.filters.status) params.append('status', this.filters.status);
                
                const response = await post(this.$endpoints.staff.getStudents.url, {
                    ...this.filters,
                    paginateBy: 1000, // Get all for client-side pagination
                    mode: 1
                });
                
                if (response && response.data) {
                    this.students = response.data.data || response.data;
                } else {
                    // Mock data for demonstration
                    this.students = [
                        {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            email: 'john.doe@example.com',
                            matric_number: 'CSC/2020/001',
                            picture: null,
                            programme: { id: 1, name: 'Computer Science' },
                            level: { id: 1, name: '100 Level' },
                            cgpa: 3.75,
                            status: 'active'
                        }
                    ];
                }
                
                this.filterStudents();
            } catch (error) {
                console.error('Error loading students:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadStudentStats() {
            try {
                const params = new URLSearchParams();
                if (this.filters.session_id) {
                    params.append('session_id', this.filters.session_id);
                }

                const response = await get(`${this.$endpoints.staff.getStudentStats.url}?${params.toString()}`);
                if (response && response.data) {
                    this.studentStats = response.data;
                } else {
                    // Mock stats
                    this.studentStats = {
                        total: this.students.length,
                        active: this.students.filter(s => s.status === 'active').length,
                        newThisSession: 45,
                        graduated: 120
                    };
                }
            } catch (error) {
                console.error('Error loading student stats:', error);
            }
        },
        filterStudents() {
            let filtered = this.students;
            
            // Apply search filter
            if (this.searchQuery) {
                filtered = filtered.filter(student => 
                    student.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    student.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    student.matric_number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    student.email.toLowerCase().includes(this.searchQuery.toLowerCase())
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
        getStatusColor(status) {
            const colors = {
                'active': 'bg-green-100 text-green-800',
                'inactive': 'bg-gray-100 text-gray-800',
                'graduated': 'bg-blue-100 text-blue-800',
                'suspended': 'bg-red-100 text-red-800',
                'withdrawn': 'bg-yellow-100 text-yellow-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        viewStudent(student) {
            this.$router.push({ name: 'staff-student-profile', params: { id: student.id } });
        },
        editStudent(student) {
            console.log('Edit student:', student);
            // This would open an edit modal or navigate to edit page
        },
        async toggleStudentStatus(student) {
            const newStatus = student.status === 'active' ? 'inactive' : 'active';
            const action = newStatus === 'active' ? 'activate' : 'deactivate';
            
            if (confirm(`Are you sure you want to ${action} ${student.first_name} ${student.last_name}?`)) {
                try {
                    const response = await post(this.$endpoints.staff.updateStudentStatus.url, {
                        student_id: student.id,
                        status: newStatus
                    });
                    
                    if (response && !response.error) {
                        student.status = newStatus;
                        
                        this.$globals.message = {
                            text: `Student ${action}d successfully`,
                            type: 'success'
                        };
                        setTimeout(() => {
                            this.$globals.message.text = '';
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error updating student status:', error);
                }
            }
        },
        exportStudents() {
            console.log('Export students');
            // This would generate and download a student report
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

        // Advanced search methods
        async performAdvancedSearch() {
            if (!this.advancedSearch.query.trim()) return;

            this.searchingStudents = true;
            try {
                const response = await post(this.$endpoints.staff.searchStudents.url, {
                    search_type: this.advancedSearch.type,
                    query: this.advancedSearch.query.trim(),
                    limit: 50
                });

                if (response && response.data) {
                    this.searchResults = response.data.students || [];
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Search Complete',
                        detail: `Found ${this.searchResults.length} student(s)`,
                        life: 3000
                    });
                } else {
                    this.searchResults = [];
                    this.$toast.add({
                        severity: 'info',
                        summary: 'No Results',
                        detail: 'No students found matching your search criteria',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Error searching students:', error);
                this.$toast.add({
                    severity: 'error',
                    summary: 'Search Error',
                    detail: 'Failed to search students',
                    life: 3000
                });
                this.searchResults = [];
            } finally {
                this.searchingStudents = false;
            }
        },

        clearSearchResults() {
            this.searchResults = [];
            this.advancedSearch.query = '';
        },

        viewStudentProfile(student) {
            // Navigate to student profile page
            this.$router.push({
                name: 'StudentProfile',
                params: { id: student.id }
            });
        }
    },
    async mounted() {
        await this.loadInitialData();
    }
}
</script>
