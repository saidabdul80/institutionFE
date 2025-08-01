<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Transcript Generation
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Generate official academic transcripts for students
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="$router.push({name: 'staff-results'})" 
                            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fa fa-arrow-left mr-2"></i>Back to Results
                    </button>
                    <button @click="showBulkGenerationModal = true" 
                            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-files-o mr-2"></i>Bulk Generate
                    </button>
                </div>
            </div>
        </div>

        <!-- Search Student -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Search Student</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search by</label>
                    <select v-model="searchType" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="matric_number">Matriculation Number</option>
                        <option value="name">Student Name</option>
                        <option value="email">Email Address</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
                    <input v-model="searchQuery" type="text" 
                           :placeholder="getSearchPlaceholder()"
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex items-end">
                    <button @click="searchStudent" :disabled="!searchQuery" 
                            class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
                        <i class="fa fa-search mr-2"></i>Search Student
                    </button>
                </div>
            </div>
        </div>

        <!-- Student Information -->
        <div v-if="selectedStudent" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Student Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Student Details -->
                <div>
                    <div class="flex items-center mb-4">
                        <div class="flex-shrink-0 h-16 w-16">
                            <img v-if="selectedStudent.picture" :src="selectedStudent.picture" 
                                 class="h-16 w-16 rounded-full object-cover" :alt="selectedStudent.first_name">
                            <div v-else class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                <span class="text-xl font-bold text-gray-700">
                                    {{ getInitials(selectedStudent.first_name, selectedStudent.last_name) }}
                                </span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">
                                {{ selectedStudent.first_name }} {{ selectedStudent.middle_name }} {{ selectedStudent.last_name }}
                            </h4>
                            <p class="text-gray-600">{{ selectedStudent.matric_number }}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Programme:</span>
                            <span class="font-medium">{{ selectedStudent.programme?.name || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Current Level:</span>
                            <span class="font-medium">{{ selectedStudent.level?.name || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Entry Session:</span>
                            <span class="font-medium">{{ selectedStudent.entry_session?.name || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Status:</span>
                            <span :class="getStatusColor(selectedStudent.status)" 
                                  class="px-2 py-1 rounded text-sm font-medium">
                                {{ selectedStudent.status || 'Active' }}
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Academic Summary -->
                <div>
                    <h5 class="font-medium text-gray-700 mb-3">Academic Summary</h5>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-blue-600">{{ (selectedStudent.cgpa || 0).toFixed(2) }}</div>
                            <div class="text-sm text-blue-700">Current CGPA</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-green-600">{{ selectedStudent.total_credit_units || 0 }}</div>
                            <div class="text-sm text-green-700">Total Units</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center">
                            <div class="text-2xl font-bold text-purple-600">{{ selectedStudent.completed_semesters || 0 }}</div>
                            <div class="text-sm text-purple-700">Semesters</div>
                        </div>
                        <div class="bg-yellow-50 p-4 rounded-lg text-center">
                            <div class="text-sm font-bold text-yellow-600">{{ getDegreeClass(selectedStudent.cgpa) }}</div>
                            <div class="text-xs text-yellow-700">Class of Degree</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transcript Options -->
        <div v-if="selectedStudent" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Transcript Options</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h5 class="font-medium text-gray-700 mb-3">Transcript Type</h5>
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="radio" v-model="transcriptOptions.type" value="official" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Official Transcript</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" v-model="transcriptOptions.type" value="unofficial" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Unofficial Transcript</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" v-model="transcriptOptions.type" value="interim" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Interim Transcript</span>
                        </label>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-medium text-gray-700 mb-3">Include Options</h5>
                    <div class="space-y-2">
                        <label class="flex items-center">
                            <input type="checkbox" v-model="transcriptOptions.include_grades" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Include Grades</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" v-model="transcriptOptions.include_gpa" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Include GPA/CGPA</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" v-model="transcriptOptions.include_class_rank" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Include Class Rank</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" v-model="transcriptOptions.include_degree_class" 
                                   class="text-blue-600 focus:ring-blue-500">
                            <span class="ml-2">Include Degree Classification</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session Range</label>
                    <div class="grid grid-cols-2 gap-2">
                        <select v-model="transcriptOptions.from_session" 
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">From Session</option>
                            <option v-for="session in sessions" :key="session.id" :value="session.id">
                                {{ session.name }}
                            </option>
                        </select>
                        <select v-model="transcriptOptions.to_session" 
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">To Session</option>
                            <option v-for="session in sessions" :key="session.id" :value="session.id">
                                {{ session.name }}
                            </option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                    <select v-model="transcriptOptions.format" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="pdf">PDF Document</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="word">Word Document</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Academic Records Preview -->
        <div v-if="selectedStudent && academicRecords.length > 0" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Academic Records Preview</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Units</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Point</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="record in academicRecords" :key="record.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ record.session?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ getSemesterName(record.semester) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ record.course?.code || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ record.course?.title || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ record.course?.credit_units || 0 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getGradeColor(record.grade)" 
                                      class="px-2 py-1 rounded text-sm font-bold">
                                    {{ record.grade || 'F' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ record.grade_point || 0.0 }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Generate Actions -->
        <div v-if="selectedStudent" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button @click="previewTranscript" 
                        class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                    <i class="fa fa-eye mr-2"></i>Preview Transcript
                </button>
                <button @click="generateTranscript" :disabled="generating" 
                        class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors">
                    <i v-if="generating" class="fa fa-spinner fa-spin mr-2"></i>
                    <i v-else class="fa fa-file-pdf-o mr-2"></i>
                    {{ generating ? 'Generating...' : 'Generate Transcript' }}
                </button>
                <button @click="emailTranscript" 
                        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors">
                    <i class="fa fa-envelope mr-2"></i>Email Transcript
                </button>
            </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0 && !selectedStudent" class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="border-b border-gray-200 p-4 sm:p-6">
                <h3 class="text-lg font-semibold text-gray-800">Search Results ({{ searchResults.length }})</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="student in searchResults" :key="student.id" class="hover:bg-gray-50">
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ student.programme?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ student.level?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ (student.cgpa || 0).toFixed(2) }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button @click="selectStudent(student)" 
                                        class="text-blue-600 hover:text-blue-900">
                                    <i class="fa fa-check mr-1"></i>Select
                                </button>
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
import { userDataMixin } from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            generating: false,
            showBulkGenerationModal: false,
            searchType: 'matric_number',
            searchQuery: '',
            selectedStudent: null,
            searchResults: [],
            academicRecords: [],
            sessions: [],
            transcriptOptions: {
                type: 'official',
                include_grades: true,
                include_gpa: true,
                include_class_rank: false,
                include_degree_class: true,
                from_session: '',
                to_session: '',
                format: 'pdf'
            },
            degreeClasses: [
                { name: 'First Class', min_cgpa: 4.50, max_cgpa: 5.00 },
                { name: 'Second Class Upper', min_cgpa: 3.50, max_cgpa: 4.49 },
                { name: 'Second Class Lower', min_cgpa: 2.40, max_cgpa: 3.49 },
                { name: 'Third Class', min_cgpa: 1.50, max_cgpa: 2.39 },
                { name: 'Pass', min_cgpa: 1.00, max_cgpa: 1.49 }
            ]
        }
    },
    methods: {
        async loadSessions() {
            // Wait for school info to be loaded if not already available
            await this.waitForSchoolInfo();

            // Use school info data instead of making API calls
            this.sessions = this.schoolSessions;
        },
        async searchStudent() {
            if (!this.searchQuery) return;
            
            this.loading = true;
            try {
                const response = await post(this.$endpoints.staff.searchStudents.url, {
                    search_type: this.searchType,
                    query: this.searchQuery
                });
                
                if (response && response.data) {
                    this.searchResults = response.data;
                    if (this.searchResults.length === 1) {
                        this.selectStudent(this.searchResults[0]);
                    }
                } else {
                    // Mock search results
                    this.searchResults = [
                        {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            matric_number: 'CSC/2020/001',
                            programme: { name: 'Computer Science' },
                            level: { name: '400 Level' },
                            cgpa: 3.75
                        }
                    ];
                }
            } catch (error) {
                console.error('Error searching student:', error);
            } finally {
                this.loading = false;
            }
        },
        async selectStudent(student) {
            this.selectedStudent = student;
            this.searchResults = [];
            await this.loadAcademicRecords();
        },
        async loadAcademicRecords() {
            if (!this.selectedStudent) return;
            
            try {
                const response = await get(`${this.$endpoints.staff.getStudentAcademicRecords.url}/${this.selectedStudent.id}`);
                if (response && response.data) {
                    this.academicRecords = response.data;
                } else {
                    // Mock academic records
                    this.academicRecords = [
                        {
                            id: 1,
                            session: { name: '2020/2021' },
                            semester: 1,
                            course: { code: 'CSC101', title: 'Introduction to Computer Science', credit_units: 3 },
                            grade: 'A',
                            grade_point: 5.0
                        },
                        {
                            id: 2,
                            session: { name: '2020/2021' },
                            semester: 1,
                            course: { code: 'MTH101', title: 'General Mathematics I', credit_units: 3 },
                            grade: 'B',
                            grade_point: 4.0
                        }
                    ];
                }
            } catch (error) {
                console.error('Error loading academic records:', error);
            }
        },
        getSearchPlaceholder() {
            const placeholders = {
                'matric_number': 'Enter matriculation number (e.g., CSC/2020/001)',
                'name': 'Enter student name',
                'email': 'Enter email address'
            };
            return placeholders[this.searchType] || 'Enter search query';
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
                'suspended': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
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
        getDegreeClass(cgpa) {
            if (!cgpa) return 'N/A';
            
            for (const degreeClass of this.degreeClasses) {
                if (cgpa >= degreeClass.min_cgpa && cgpa <= degreeClass.max_cgpa) {
                    return degreeClass.name;
                }
            }
            return 'N/A';
        },
        getSemesterName(semester) {
            const names = {
                1: 'First Semester',
                2: 'Second Semester',
                3: 'Third Semester'
            };
            return names[semester] || 'N/A';
        },
        previewTranscript() {
            console.log('Preview transcript for:', this.selectedStudent);
            // This would open a preview modal or new window
        },
        async generateTranscript() {
            if (!this.selectedStudent) return;
            
            this.generating = true;
            try {
                const payload = {
                    student_id: this.selectedStudent.id,
                    ...this.transcriptOptions
                };
                
                const response = await post(this.$endpoints.staff.generateTranscript.url, payload);
                if (response && response.data) {
                    // Handle file download
                    const link = document.createElement('a');
                    link.href = response.data.download_url;
                    link.download = `transcript_${this.selectedStudent.matric_number}.${this.transcriptOptions.format}`;
                    link.click();
                    
                    this.$globals.message = {
                        text: 'Transcript generated successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error generating transcript:', error);
            } finally {
                this.generating = false;
            }
        },
        async emailTranscript() {
            if (!this.selectedStudent) return;
            
            try {
                const payload = {
                    student_id: this.selectedStudent.id,
                    email: this.selectedStudent.email,
                    ...this.transcriptOptions
                };
                
                const response = await post(this.$endpoints.staff.emailTranscript.url, payload);
                if (response && !response.error) {
                    this.$globals.message = {
                        text: `Transcript emailed to ${this.selectedStudent.email}`,
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error emailing transcript:', error);
            }
        }
    },
    async mounted() {
        await this.loadSessions();
    }
}
</script>
