<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Academic Results</h2>
                    <p class="text-gray-600">View your academic performance and results</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Current CGPA</p>
                    <p class="text-3xl font-bold text-blue-600">{{ overallCGPA || 'N/A' }}</p>
                </div>
            </div>
        </div>

        <!-- Session Filter -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <select v-model="selectedSession" @change="loadResults" 
                            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Session</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select v-model="selectedSemester" @change="loadResults" 
                            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Semesters</option>
                        <option value="1">First Semester</option>
                        <option value="2">Second Semester</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button @click="loadResults" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        <i class="fa fa-search mr-2"></i>Load Results
                    </button>
                </div>
            </div>
        </div>

        <!-- Results Summary -->
        <div v-if="sessionResults.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div class="bg-blue-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-book text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Total Courses</p>
                        <p class="text-2xl font-bold">{{ sessionResults.length }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-green-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-check text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Passed</p>
                        <p class="text-2xl font-bold">{{ passedCourses }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-red-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-times text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Failed</p>
                        <p class="text-2xl font-bold">{{ failedCourses }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-purple-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-star text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Session GPA</p>
                        <p class="text-2xl font-bold">{{ sessionGPA || 'N/A' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Table -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <h3 class="text-lg font-semibold">Course Results</h3>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading results...</p>
            </div>
            
            <div v-else-if="sessionResults.length === 0" class="p-6 text-center">
                <i class="fa fa-file-text text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No results found for the selected criteria</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Point</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="result in sessionResults" :key="result.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ result.course_code }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ result.course_title }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ result.unit }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ result.score || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getGradeColor(result.grade)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ result.grade || 'N/A' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ result.grade_point || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ result.semester == 1 ? 'First' : 'Second' }} Semester
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(result.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ result.status || (result.grade_point >= 1.0 ? 'Passed' : 'Failed') }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Academic Summary -->
        <div v-if="academicSummary.length > 0" class="mt-6 bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <h3 class="text-lg font-semibold">Academic Summary by Session</h3>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Units</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Passed</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="summary in academicSummary" :key="summary.session_id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ summary.session_name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ summary.level }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ summary.total_units }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ summary.units_passed }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ summary.gpa }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ summary.cgpa }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';

export default {
    mixins: [schoolInfoMixin],
    data() {
        return {
            sessions: [],
            selectedSession: '',
            selectedSemester: '',
            sessionResults: [],
            academicSummary: [],
            overallCGPA: null,
            sessionGPA: null,
            loading: false
        }
    },
    computed: {
        passedCourses() {
            return this.sessionResults.filter(result => 
                result.grade_point >= 1.0 || result.status === 'Passed'
            ).length;
        },
        failedCourses() {
            return this.sessionResults.filter(result => 
                result.grade_point < 1.0 || result.status === 'Failed'
            ).length;
        }
    },
    methods: {
        async loadSessions() {
            // Wait for school info to be loaded if not already available
            await this.waitForSchoolInfo();

            // Use school info data instead of making API calls
            this.sessions = this.schoolSessions;
        },
        async loadResults() {
            if (!this.selectedSession) return;
            
            this.loading = true;
            try {
                const payload = {
                    session_id: this.selectedSession,
                    semester_id: this.selectedSemester || null
                };
                
                const res = await post(this.$endpoints.student.getResult.url, payload);
                if (res && res.data) {
                    this.sessionResults = res.data.results || [];
                    this.sessionGPA = res.data.gpa;
                    this.overallCGPA = res.data.cgpa;
                }
            } catch (error) {
                console.error('Error loading results:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadAcademicSummary() {
            try {
                const res = await post(this.$endpoints.student.getCoursesResult.url, {});
                if (res && res.data) {
                    this.academicSummary = res.data;
                }
            } catch (error) {
                console.error('Error loading academic summary:', error);
            }
        },
        getGradeColor(grade) {
            const gradeColors = {
                'A': 'bg-green-100 text-green-800',
                'B': 'bg-blue-100 text-blue-800',
                'C': 'bg-yellow-100 text-yellow-800',
                'D': 'bg-orange-100 text-orange-800',
                'F': 'bg-red-100 text-red-800'
            };
            return gradeColors[grade] || 'bg-gray-100 text-gray-800';
        },
        getStatusColor(status) {
            if (status === 'Passed' || status === 'Pass') {
                return 'bg-green-100 text-green-800';
            } else if (status === 'Failed' || status === 'Fail') {
                return 'bg-red-100 text-red-800';
            }
            return 'bg-gray-100 text-gray-800';
        }
    },
    async mounted() {
        await this.loadSessions();
        await this.loadAcademicSummary();
        
        // Auto-select current session if available
        if (this.sessions.length > 0) {
            this.selectedSession = this.sessions[0].id;
            await this.loadResults();
        }
    }
}
</script>
