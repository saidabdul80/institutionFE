<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex items-center gap-4">
                    <button @click="$router.go(-1)" 
                            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fa fa-arrow-left mr-2"></i>Back
                    </button>
                    <div class="flex-1">
                        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                            Student Profile
                        </h1>
                        <p class="text-gray-600 text-sm sm:text-base">
                            Detailed student information and academic records
                        </p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button @click="editStudent" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fa fa-edit mr-2"></i>Edit
                    </button>
                    <button @click="printProfile" 
                            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-print mr-2"></i>Print
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <i class="fa fa-spinner fa-spin text-3xl text-gray-400"></i>
            <p class="text-gray-600 ml-4">Loading student profile...</p>
        </div>

        <!-- Student Not Found -->
        <div v-else-if="!student" class="text-center py-12">
            <i class="fa fa-user-times text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Student Not Found</h3>
            <p class="text-gray-600">The requested student profile could not be found.</p>
        </div>

        <!-- Student Profile Content -->
        <div v-else>
            <!-- Basic Information -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Profile Picture -->
                    <div class="flex flex-col items-center">
                        <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                            <img v-if="student.picture" :src="student.picture" 
                                 class="w-full h-full object-cover" :alt="student.first_name">
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <span class="text-4xl font-bold text-gray-500">
                                    {{ getInitials(student.first_name, student.last_name) }}
                                </span>
                            </div>
                        </div>
                        <span :class="getStatusColor(student.status)" 
                              class="px-3 py-1 rounded-full text-sm font-medium">
                            {{ student.status || 'Active' }}
                        </span>
                    </div>
                    
                    <!-- Personal Details -->
                    <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <p class="text-lg font-semibold text-gray-900">
                                {{ student.first_name }} {{ student.middle_name }} {{ student.last_name }}
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">Matriculation Number</label>
                            <p class="text-lg font-semibold text-gray-900">{{ student.matric_number }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <p class="text-gray-900">{{ student.email }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                            <p class="text-gray-900">{{ student.phone || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                            <p class="text-gray-900">{{ formatDate(student.date_of_birth) || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                            <p class="text-gray-900">{{ student.gender || 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Academic Information -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Academic Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <label class="block text-sm font-medium text-blue-700 mb-1">Programme</label>
                        <p class="text-lg font-semibold text-blue-900">{{ student.programme?.name || 'N/A' }}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <label class="block text-sm font-medium text-green-700 mb-1">Current Level</label>
                        <p class="text-lg font-semibold text-green-900">{{ student.level?.name || 'N/A' }}</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <label class="block text-sm font-medium text-purple-700 mb-1">Current CGPA</label>
                        <p class="text-lg font-semibold text-purple-900">{{ (student.cgpa || 0).toFixed(2) }}</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <label class="block text-sm font-medium text-yellow-700 mb-1">Entry Session</label>
                        <p class="text-lg font-semibold text-yellow-900">{{ student.entry_session?.name || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Academic Performance -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Academic Performance</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm opacity-75 mb-1">Current GPA</p>
                                <p class="text-2xl font-bold">{{ (student.current_gpa || 0).toFixed(2) }}</p>
                            </div>
                            <i class="fa fa-chart-line text-2xl opacity-75"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm opacity-75 mb-1">Cumulative CGPA</p>
                                <p class="text-2xl font-bold">{{ (student.cgpa || 0).toFixed(2) }}</p>
                            </div>
                            <i class="fa fa-trophy text-2xl opacity-75"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm opacity-75 mb-1">Total Credit Units</p>
                                <p class="text-2xl font-bold">{{ student.total_credit_units || 0 }}</p>
                            </div>
                            <i class="fa fa-book text-2xl opacity-75"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs for Additional Information -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                                :class="activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            <i :class="tab.icon" class="mr-2"></i>{{ tab.name }}
                        </button>
                    </nav>
                </div>
                
                <div class="p-6">
                    <!-- Courses Tab -->
                    <div v-if="activeTab === 'courses'">
                        <h4 class="text-lg font-semibold mb-4">Registered Courses</h4>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Code</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Title</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Units</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="course in studentCourses" :key="course.id">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ course.code }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ course.title }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ course.credit_units }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ course.semester }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Registered
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Results Tab -->
                    <div v-if="activeTab === 'results'">
                        <h4 class="text-lg font-semibold mb-4">Academic Results</h4>
                        <div class="space-y-4">
                            <div v-for="session in studentResults" :key="session.id"
                                 class="border border-gray-200 rounded-lg p-4">
                                <h5 class="font-medium text-gray-900 mb-2">{{ session.name }}</h5>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-600">First Semester GPA:
                                            <span class="font-medium">{{ session.first_semester_gpa || 'N/A' }}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600">Second Semester GPA:
                                            <span class="font-medium">{{ session.second_semester_gpa || 'N/A' }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- O-Level Results Tab -->
                    <div v-if="activeTab === 'olevel'">
                        <h4 class="text-lg font-semibold mb-4">O-Level Results</h4>
                        <div v-if="student.olevel && student.olevel.length > 0" class="space-y-4">
                            <div v-for="(olevel, index) in student.olevel" :key="index"
                                 class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div class="mb-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <h5 class="font-semibold text-gray-800">{{ olevel.exam_type }}</h5>
                                        <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {{ olevel.month }}/{{ olevel.year }}
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-600 mb-2">
                                        <span class="font-medium">Examination Number:</span>
                                        <span class="font-mono">{{ olevel.examination_number }}</span>
                                    </div>
                                    <div v-if="olevel.pin || olevel.serial_number" class="text-sm text-gray-500">
                                        <span v-if="olevel.pin" class="mr-4">
                                            <span class="font-medium">PIN:</span>
                                            <span class="font-mono">{{ olevel.pin }}</span>
                                        </span>
                                        <span v-if="olevel.serial_number">
                                            <span class="font-medium">Serial Number:</span>
                                            <span class="font-mono">{{ olevel.serial_number }}</span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Subjects and Grades -->
                                <div>
                                    <h6 class="font-medium text-gray-700 mb-3">Subjects & Grades</h6>
                                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        <div v-for="(grade, subject) in olevel.subjects_grades" :key="subject"
                                             class="bg-gray-50 rounded-lg px-3 py-2 text-sm border">
                                            <div class="font-medium text-gray-800">{{ subject }}</div>
                                            <div class="text-blue-600 font-bold text-lg">{{ grade }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8">
                            <i class="fa fa-graduation-cap text-4xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No O-Level results available</p>
                            <p class="text-sm text-gray-400">O-Level results will appear here when available</p>
                        </div>
                    </div>

                    <!-- Contact Tab -->
                    <div v-if="activeTab === 'contact'">
                        <h4 class="text-lg font-semibold mb-4">Contact Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 class="font-medium text-gray-900 mb-3">Personal Contact</h5>
                                <div class="space-y-2">
                                    <p class="text-sm"><strong>Email:</strong> {{ student.email }}</p>
                                    <p class="text-sm"><strong>Phone:</strong> {{ student.phone || 'N/A' }}</p>
                                    <p class="text-sm"><strong>Address:</strong> {{ student.address || 'N/A' }}</p>
                                </div>
                            </div>
                            <div>
                                <h5 class="font-medium text-gray-900 mb-3">Emergency Contact</h5>
                                <div class="space-y-2">
                                    <p class="text-sm"><strong>Next of Kin:</strong> {{ student.next_of_kin || 'N/A' }}</p>
                                    <p class="text-sm"><strong>Relationship:</strong> {{ student.next_of_kin_relationship || 'N/A' }}</p>
                                    <p class="text-sm"><strong>Phone:</strong> {{ student.next_of_kin_phone || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>
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
            student: null,
            studentCourses: [],
            studentResults: [],
            activeTab: 'courses',
            selectedSession: '',
            selectedSemester: '',
            coursesSummary: {
                total_courses: 0,
                total_credit_units: 0,
                grouped_by_semester: {}
            },
            resultsSummary: {
                total_courses: 0,
                passed_courses: 0,
                failed_courses: 0,
                gpa: 0,
                total_credit_units: 0,
                grouped_results: {}
            },
            academicRecords: null,
            academicSummary: {},
            tabs: [
                { id: 'courses', name: 'Courses', icon: 'fa fa-book' },
                { id: 'results', name: 'Results', icon: 'fa fa-chart-bar' },
                { id: 'olevel', name: 'O-Level Results', icon: 'fa fa-graduation-cap' },
                { id: 'contact', name: 'Contact', icon: 'fa fa-address-card' }
            ]
        }
    },
    methods: {
        async loadStudentProfile() {
            const studentId = this.$route.params.id;
            if (!studentId) return;

            this.loading = true;
            try {
                const response = await get(`${this.$endpoints.staff.getStudentById.url}/${studentId}`);
                if (response && response.data) {
                    this.student = response.data;
                    await this.loadStudentCourses();
                    await this.loadStudentResults();
                } else {
                    // Mock data for demonstration
                    this.student = {
                        id: studentId,
                        first_name: 'John',
                        middle_name: 'Michael',
                        last_name: 'Doe',
                        matric_number: 'CSC/2020/001',
                        email: 'john.doe@example.com',
                        phone: '+234 801 234 5678',
                        date_of_birth: '2000-05-15',
                        gender: 'Male',
                        programme: { id: 1, name: 'Computer Science' },
                        level: { id: 3, name: '300 Level' },
                        entry_session: { id: 1, name: '2020/2021' },
                        cgpa: 3.75,
                        current_gpa: 3.85,
                        total_credit_units: 72,
                        status: 'active',
                        address: '123 University Road, Lagos',
                        next_of_kin: 'Jane Doe',
                        next_of_kin_relationship: 'Mother',
                        next_of_kin_phone: '+234 802 345 6789'
                    };
                    
                    this.studentCourses = [
                        { id: 1, code: 'CSC301', title: 'Data Structures', credit_units: 3, semester: 1 },
                        { id: 2, code: 'CSC302', title: 'Database Systems', credit_units: 3, semester: 1 },
                        { id: 3, code: 'CSC303', title: 'Software Engineering', credit_units: 3, semester: 1 }
                    ];
                    
                    this.studentResults = [
                        { id: 1, name: '2022/2023', first_semester_gpa: 3.75, second_semester_gpa: 3.85 },
                        { id: 2, name: '2021/2022', first_semester_gpa: 3.65, second_semester_gpa: 3.70 }
                    ];
                }
            } catch (error) {
                console.error('Error loading student profile:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadStudentCourses() {
            try {
                const params = new URLSearchParams();
                params.append('student_id', this.student.id);
                if (this.selectedSession) {
                    params.append('session_id', this.selectedSession);
                }
                if (this.selectedSemester) {
                    params.append('semester', this.selectedSemester);
                }

                const response = await get(`${this.$endpoints.staff.getStudentCourses.url}?${params.toString()}`);
                if (response && response.data) {
                    this.studentCourses = response.data.courses || [];
                    this.coursesSummary = {
                        total_courses: response.data.total_courses || 0,
                        total_credit_units: response.data.total_credit_units || 0,
                        grouped_by_semester: response.data.grouped_by_semester || {}
                    };
                }
            } catch (error) {
                console.error('Error loading student courses:', error);
            }
        },
        async loadStudentResults() {
            try {
                const params = new URLSearchParams();
                params.append('student_id', this.student.id);
                if (this.selectedSession) {
                    params.append('session_id', this.selectedSession);
                }
                if (this.selectedSemester) {
                    params.append('semester', this.selectedSemester);
                }

                const response = await get(`${this.$endpoints.staff.getStudentResults.url}?${params.toString()}`);
                if (response && response.data) {
                    this.studentResults = response.data.results || [];
                    this.resultsSummary = {
                        total_courses: response.data.statistics?.total_courses || 0,
                        passed_courses: response.data.statistics?.passed_courses || 0,
                        failed_courses: response.data.statistics?.failed_courses || 0,
                        gpa: response.data.statistics?.gpa || 0,
                        total_credit_units: response.data.statistics?.total_credit_units || 0,
                        grouped_results: response.data.grouped_results || {}
                    };
                }
            } catch (error) {
                console.error('Error loading student results:', error);
            }
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
        formatDate(dateString) {
            if (!dateString) return null;
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        editStudent() {
            console.log('Edit student:', this.student);
            // This would open an edit modal or navigate to edit page
        },
        printProfile() {
            window.print();
        },

        async loadStudentAcademicRecords() {
            try {
                const response = await get(`${this.$endpoints.staff.getStudentAcademicRecords.url.replace('{id}', this.student.id)}`);
                if (response && response.data) {
                    this.academicRecords = response.data;
                    this.academicSummary = response.data.summary || {};
                }
            } catch (error) {
                console.error('Error loading academic records:', error);
            }
        },

        setActiveTab(tab) {
            this.activeTab = tab;

            // Load additional data when switching to specific tabs
            if (tab === 'academic' && !this.academicRecords) {
                this.loadStudentAcademicRecords();
            }
        }
    },
    async mounted() {
        await this.loadStudentProfile();
        
        // Handle tab query parameter
        const tab = this.$route.query.tab;
        if (tab && this.tabs.find(t => t.id === tab)) {
            this.activeTab = tab;
        }
    }
}
</script>

<style scoped>
@media print {
    .no-print {
        display: none !important;
    }
}
</style>
