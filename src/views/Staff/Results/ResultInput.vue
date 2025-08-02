<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Result Input System
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Input and manage student results with Nigerian grading standards
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="$router.push({name: 'staff-results'})" 
                            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fa fa-arrow-left mr-2"></i>Back to Results
                    </button>
                    <button @click="saveAllResults" :disabled="!hasUnsavedChanges" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
                        <i class="fa fa-save mr-2"></i>Save All
                    </button>
                </div>
            </div>
        </div>

        <!-- Selection Criteria -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Select Course & Session</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
                    <select v-model="criteria.session_id" @change="loadCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Session</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select v-model="criteria.level_id" @change="loadCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Level</option>
                        <option v-for="level in levels" :key="level.id" :value="level.id">
                            {{ level.title }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <select v-model="criteria.programme_id" @change="loadCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Programme</option>
                        <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
                            {{ programme.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <select v-model="criteria.course_id" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Course</option>
                        <option v-for="course in courses" :key="course.id" :value="course.id">
                            {{ course.code }} - {{ course.title }}
                        </option>
                    </select>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select v-model="criteria.semester" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Semester</option>
                        <option value="1">First Semester</option>
                        <option value="2">Second Semester</option>
                        <option value="3">Third Semester</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Result Type</label>
                    <select v-model="criteria.result_type" @change="loadStudents" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Type</option>
                        <option value="final">Final Result</option>
                        <option value="ca">Continuous Assessment</option>
                        <option value="exam">Examination</option>
                        <option value="practical">Practical</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Course Information -->
        <div v-if="selectedCourse" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Course Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-blue-800">Course Code</h4>
                    <p class="text-blue-600 font-bold">{{ selectedCourse.code }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-medium text-green-800">Course Title</h4>
                    <p class="text-green-600 font-bold">{{ selectedCourse.title }}</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-medium text-purple-800">Credit Units</h4>
                    <p class="text-purple-600 font-bold">{{ selectedCourse.credit_units }}</p>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <h4 class="font-medium text-yellow-800">Total Students</h4>
                    <p class="text-yellow-600 font-bold">{{ students.length }}</p>
                </div>
            </div>
        </div>

        <!-- Nigerian Grading Reference -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Grading System Reference</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div v-for="grade in gradeScale" :key="grade.grade" 
                     class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold mb-1" :class="getGradeColor(grade.grade)">{{ grade.grade }}</div>
                    <div class="text-sm text-gray-600">{{ grade.min_score }}-{{ grade.max_score }}%</div>
                    <div class="text-sm font-medium text-blue-600">{{ grade.point }} pts</div>
                </div>
            </div>
        </div>
        <!-- Result Input Table -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="border-b border-gray-200 p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 class="text-lg font-semibold text-gray-800">
                        Student Results ({{ students.length }})
                    </h3>
                    <div class="flex gap-2">
                        <input v-model="searchQuery" @input="filterStudents" type="text" 
                               placeholder="Search students..." 
                               class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button @click="clearAllResults" 
                                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                            Clear All
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
                <p class="text-gray-600">No students found for the selected course</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Score (30)</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Score (70)</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (100)</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Point</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(student, index) in paginatedStudents" :key="student.id" 
                            :class="student.hasUnsavedChanges ? 'bg-yellow-50' : 'hover:bg-gray-50'">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-8 w-8">
                                        <img v-if="student.picture" :src="student.picture" 
                                             class="h-8 w-8 rounded-full object-cover" :alt="student.first_name">
                                        <div v-else class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span class="text-xs font-medium text-gray-700">
                                                {{ getInitials(student.first_name, student.last_name) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ student.first_name }} {{ student.last_name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ student.matric_number }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <input v-model.number="student.ca_score" @input="onScoreChange(student)" 
                                       type="number" min="0" max="30" step="0.1"
                                       class="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       :class="student.hasUnsavedChanges ? 'border-yellow-400 bg-yellow-50' : ''">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <input v-model.number="student.exam_score" @input="onScoreChange(student)" 
                                       type="number" min="0" max="70" step="0.1"
                                       class="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       :class="student.hasUnsavedChanges ? 'border-yellow-400 bg-yellow-50' : ''">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-bold text-lg">{{ student.total_score || 0 }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getGradeColor(student.grade)" 
                                      class="px-2 py-1 rounded text-sm font-bold">
                                    {{ student.grade || 'F' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ student.grade_point || 0.0 }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(student.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ student.status || 'Not Entered' }}
                                </span>
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
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 15,
            hasUnsavedChanges: false,
            criteria: {
                session_id: '',
                level_id: '',
                programme_id: '',
                course_id: '',
                semester: '',
                result_type: 'final'
            },
            sessions: [],
            levels: [],
            programmes: [],
            courses: [],
            students: [],
            filteredStudents: [],
            selectedCourse: null,
            gradeScale: [
                { grade: 'A', min_score: 70, max_score: 100, point: 5.0 },
                { grade: 'B', min_score: 60, max_score: 69, point: 4.0 },
                { grade: 'C', min_score: 50, max_score: 59, point: 3.0 },
                { grade: 'D', min_score: 45, max_score: 49, point: 2.0 },
                { grade: 'E', min_score: 40, max_score: 44, point: 1.0 },
                { grade: 'F', min_score: 0, max_score: 39, point: 0.0 }
            ]
        }
    },
    computed: {
        canLoadStudents() {
            return this.criteria.session_id && 
                   this.criteria.level_id && 
                   this.criteria.programme_id && 
                   this.criteria.course_id &&
                   this.criteria.semester;
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
        async loadCourses() {
            if (!this.criteria.session_id || !this.criteria.level_id || !this.criteria.programme_id) {
                this.courses = [];
                return;
            }

            try {
                // Load only courses assigned to current staff
                const staffId = this.$auth.user?.id;
                if (!staffId) {
                    console.error('Staff ID not found');
                    return;
                }

                const response = await get(`${this.$endpoints.staff.getStaffCoursesByStaffID.url}/${staffId}?session_id=${this.criteria.session_id}&programme_id=${this.criteria.programme_id}&level_id=${this.criteria.level_id}`);
                if (response && response.data) {
                    // Transform staff courses to course format
                    this.courses = response.data.map(staffCourse => ({
                        id: staffCourse.course_id,
                        code: staffCourse.course_code,
                        title: staffCourse.course_title || staffCourse.course_name,
                        credit_units: staffCourse.course?.credit_unit || 0
                    }));
                }
            } catch (error) {
                console.error('Error loading staff courses:', error);
                // Fallback to all courses if staff courses fail
                try {
                    const response = await get(`${this.$endpoints.staff.getCoursesByProgram.url}?programme_id=${this.criteria.programme_id}&level_id=${this.criteria.level_id}&session_id=${this.criteria.session_id}`);
                    if (response && response.data) {
                        this.courses = response.data;
                    }
                } catch (fallbackError) {
                    console.error('Error loading fallback courses:', fallbackError);
                }
            }
        },
        async loadStudents() {
            if (!this.canLoadStudents) {
                this.students = [];
                this.filteredStudents = [];
                return;
            }
            
            this.loading = true;
            try {
                this.selectedCourse = this.courses.find(course => course.id == this.criteria.course_id);
                
                const response = await get(`${this.$endpoints.staff.getStudentsWithResults.url}?session_id=${this.criteria.session_id}&level_id=${this.criteria.level_id}&programme_id=${this.criteria.programme_id}&course_id=${this.criteria.course_id}&semester=${this.criteria.semester}`);
                
                if (response && response.data) {
                    this.students = response.data.map(student => ({
                        ...student,
                        ca_score: student.ca_score || 0,
                        exam_score: student.exam_score || 0,
                        total_score: (student.ca_score || 0) + (student.exam_score || 0),
                        grade: this.calculateGrade((student.ca_score || 0) + (student.exam_score || 0)),
                        grade_point: this.calculateGradePoint((student.ca_score || 0) + (student.exam_score || 0)),
                        status: student.ca_score || student.exam_score ? 'Entered' : 'Not Entered',
                        hasUnsavedChanges: false,
                        originalCaScore: student.ca_score || 0,
                        originalExamScore: student.exam_score || 0
                    }));
                } else {
                    // Mock data
                    this.students = [
                        {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            matric_number: 'CSC/2020/001',
                            ca_score: 0,
                            exam_score: 0,
                            total_score: 0,
                            grade: 'F',
                            grade_point: 0.0,
                            status: 'Not Entered',
                            hasUnsavedChanges: false,
                            originalCaScore: 0,
                            originalExamScore: 0
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
        onScoreChange(student) {
            student.total_score = (student.ca_score || 0) + (student.exam_score || 0);
            student.grade = this.calculateGrade(student.total_score);
            student.grade_point = this.calculateGradePoint(student.total_score);
            student.status = student.total_score > 0 ? 'Entered' : 'Not Entered';
            student.hasUnsavedChanges = student.ca_score !== student.originalCaScore || 
                                       student.exam_score !== student.originalExamScore;
            
            this.hasUnsavedChanges = this.students.some(s => s.hasUnsavedChanges);
        },
        calculateGrade(totalScore) {
            for (const grade of this.gradeScale) {
                if (totalScore >= grade.min_score && totalScore <= grade.max_score) {
                    return grade.grade;
                }
            }
            return 'F';
        },
        calculateGradePoint(totalScore) {
            for (const grade of this.gradeScale) {
                if (totalScore >= grade.min_score && totalScore <= grade.max_score) {
                    return grade.point;
                }
            }
            return 0.0;
        },
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : '';
            const last = lastName ? lastName.charAt(0).toUpperCase() : '';
            return first + last || 'N/A';
        },
        getGradeColor(grade) {
            const colors = {
                'A': 'text-green-600 bg-green-100',
                'B': 'text-blue-600 bg-blue-100',
                'C': 'text-yellow-600 bg-yellow-100',
                'D': 'text-orange-600 bg-orange-100',
                'E': 'text-red-600 bg-red-100',
                'F': 'text-gray-600 bg-gray-100'
            };
            return colors[grade] || 'text-gray-600 bg-gray-100';
        },
        getStatusColor(status) {
            const colors = {
                'Entered': 'bg-green-100 text-green-800',
                'Not Entered': 'bg-red-100 text-red-800',
                'Saved': 'bg-blue-100 text-blue-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        async saveAllResults() {
            const unsavedStudents = this.students.filter(s => s.hasUnsavedChanges);
            if (unsavedStudents.length === 0) return;
            
            try {
                const payload = {
                    course_id: this.criteria.course_id,
                    session_id: this.criteria.session_id,
                    semester: this.criteria.semester,
                    results: unsavedStudents.map(student => ({
                        student_id: student.id,
                        ca_score: student.ca_score,
                        exam_score: student.exam_score,
                        total_score: student.total_score,
                        grade: student.grade,
                        grade_point: student.grade_point
                    }))
                };
                
                const response = await post(this.$endpoints.staff.saveBatchResults.url, payload);
                if (response && !response.error) {
                    unsavedStudents.forEach(student => {
                        student.originalCaScore = student.ca_score;
                        student.originalExamScore = student.exam_score;
                        student.hasUnsavedChanges = false;
                        student.status = 'Saved';
                    });
                    
                    this.hasUnsavedChanges = false;
                    
                    this.$globals.message = {
                        text: `Results saved for ${unsavedStudents.length} students`,
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error saving results:', error);
            }
        },
        clearAllResults() {
            if (confirm('Are you sure you want to clear all results? This will reset all unsaved changes.')) {
                this.students.forEach(student => {
                    student.ca_score = 0;
                    student.exam_score = 0;
                    student.total_score = 0;
                    student.grade = 'F';
                    student.grade_point = 0.0;
                    student.status = 'Not Entered';
                    student.hasUnsavedChanges = student.originalCaScore !== 0 || student.originalExamScore !== 0;
                });
                
                this.hasUnsavedChanges = this.students.some(s => s.hasUnsavedChanges);
            }
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
    },
    beforeUnmount() {
        if (this.hasUnsavedChanges) {
            const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
            if (!confirmLeave) {
                return false;
            }
        }
    }
}
</script>
