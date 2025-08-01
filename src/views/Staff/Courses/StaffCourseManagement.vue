<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        My Assigned Courses
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Manage courses assigned to you for the current session
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="refreshCourses" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fa fa-refresh mr-2"></i>Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Session Filter -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Filter by Session</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
                    <select v-model="selectedSessionId" @change="loadStaffCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Current Session</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select v-model="selectedSemester" @change="filterCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Semesters</option>
                        <option value="1">First Semester</option>
                        <option value="2">Second Semester</option>
                        <option value="3">Third Semester</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select v-model="selectedStatus" @change="filterCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="assigned">Assigned</option>
                        <option value="freed">Freed</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Course Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Courses</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ courseStats.total || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-book text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Active Courses</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ courseStats.active || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-check-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Credit Units</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ courseStats.totalUnits || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-calculator text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Programmes</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ courseStats.programmes || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-graduation-cap text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assigned Courses Table -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="border-b border-gray-200 p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 class="text-lg font-semibold text-gray-800">
                        My Courses ({{ filteredCourses.length }})
                    </h3>
                    <div class="flex gap-2">
                        <input v-model="searchQuery" @input="filterCourses" type="text" 
                               placeholder="Search courses..." 
                               class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <select v-model="itemsPerPage" @change="currentPage = 1" 
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading your courses...</p>
            </div>
            
            <div v-else-if="filteredCourses.length === 0" class="p-6 text-center">
                <i class="fa fa-book text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No courses assigned to you</p>
                <p class="text-sm text-gray-500 mt-2">Contact your administrator to assign courses</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Units</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="course in paginatedCourses" :key="course.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ course.course_code }}
                                    </div>
                                    <div class="text-sm text-gray-500">{{ course.course_title || course.course_name }}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ course.programme_name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ course.department_name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ course.session_name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ getSemesterName(course.semester_id) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ course.course?.credit_unit || 'N/A' }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(course.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ course.status || 'Assigned' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="manageCourseScores(course)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-edit"></i> Scores
                                    </button>
                                    <button @click="viewCourseStudents(course)" 
                                            class="text-green-600 hover:text-green-900">
                                        <i class="fa fa-users"></i> Students
                                    </button>
                                    <button @click="viewCourseDetails(course)" 
                                            class="text-purple-600 hover:text-purple-900">
                                        <i class="fa fa-info-circle"></i> Details
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
                            <span class="font-medium">{{ filteredCourses.length }}</span> courses
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
import { get } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 25,
            selectedSessionId: '',
            selectedSemester: '',
            selectedStatus: '',
            sessions: [],
            staffCourses: [],
            filteredCourses: [],
            courseStats: {
                total: 0,
                active: 0,
                totalUnits: 0,
                programmes: 0
            }
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage + 1;
        },
        endIndex() {
            return Math.min(this.currentPage * this.itemsPerPage, this.filteredCourses.length);
        },
        paginatedCourses() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredCourses.slice(start, end);
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

            await this.loadStaffCourses();
        },
        async loadStaffCourses() {
            this.loading = true;
            try {
                // Get current staff ID from auth
                const staffId = this.$auth.user?.id;
                if (!staffId) {
                    console.error('Staff ID not found');
                    return;
                }
                
                const sessionId = this.selectedSessionId || null;
                const response = await get(`${this.$endpoints.staff.getStaffCoursesByStaffID.url}/${staffId}?session_id=${sessionId}`);
                
                if (response && response.data) {
                    this.staffCourses = response.data;
                } else {
                    // Mock data for demonstration
                    this.staffCourses = [
                        {
                            id: 1,
                            course_code: 'CSC301',
                            course_title: 'Data Structures and Algorithms',
                            programme_name: 'Computer Science',
                            department_name: 'Computer Science',
                            session_name: '2023/2024',
                            semester_id: 1,
                            status: 'assigned',
                            course: { credit_unit: 3 }
                        },
                        {
                            id: 2,
                            course_code: 'CSC302',
                            course_title: 'Database Management Systems',
                            programme_name: 'Computer Science',
                            department_name: 'Computer Science',
                            session_name: '2023/2024',
                            semester_id: 1,
                            status: 'assigned',
                            course: { credit_unit: 3 }
                        }
                    ];
                }
                
                this.calculateStats();
                this.filterCourses();
            } catch (error) {
                console.error('Error loading staff courses:', error);
            } finally {
                this.loading = false;
            }
        },
        filterCourses() {
            let filtered = this.staffCourses;
            
            // Apply search filter
            if (this.searchQuery) {
                filtered = filtered.filter(course => 
                    course.course_code?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    course.course_title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    course.course_name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    course.programme_name?.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            // Apply semester filter
            if (this.selectedSemester) {
                filtered = filtered.filter(course => course.semester_id == this.selectedSemester);
            }
            
            // Apply status filter
            if (this.selectedStatus) {
                filtered = filtered.filter(course => course.status === this.selectedStatus);
            }
            
            this.filteredCourses = filtered;
            this.currentPage = 1;
        },
        calculateStats() {
            const uniqueProgrammes = new Set();
            let totalUnits = 0;
            let activeCount = 0;
            
            this.staffCourses.forEach(course => {
                if (course.programme_name) {
                    uniqueProgrammes.add(course.programme_name);
                }
                if (course.course?.credit_unit) {
                    totalUnits += course.course.credit_unit;
                }
                if (course.status === 'assigned') {
                    activeCount++;
                }
            });
            
            this.courseStats = {
                total: this.staffCourses.length,
                active: activeCount,
                totalUnits: totalUnits,
                programmes: uniqueProgrammes.size
            };
        },
        getSemesterName(semesterId) {
            const names = {
                1: 'First Semester',
                2: 'Second Semester',
                3: 'Third Semester'
            };
            return names[semesterId] || 'N/A';
        },
        getStatusColor(status) {
            const colors = {
                'assigned': 'bg-green-100 text-green-800',
                'freed': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        manageCourseScores(course) {
            // Navigate to score input for this specific course
            this.$router.push({
                name: 'staff-scores',
                query: {
                    course_id: course.course_id,
                    session_id: course.session_id,
                    semester: course.semester_id,
                    programme_id: course.programme_id
                }
            });
        },
        viewCourseStudents(course) {
            // Navigate to students enrolled in this course
            this.$router.push({
                name: 'staff-students',
                query: {
                    course_id: course.course_id,
                    session_id: course.session_id,
                    programme_id: course.programme_id
                }
            });
        },
        viewCourseDetails(course) {
            console.log('View course details:', course);
            // This could open a modal with detailed course information
        },
        async refreshCourses() {
            await this.loadStaffCourses();
            this.$globals.message = {
                text: 'Courses refreshed successfully',
                type: 'success'
            };
            setTimeout(() => {
                this.$globals.message.text = '';
            }, 3000);
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
