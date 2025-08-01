<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Course Registration</h2>
                    <p class="text-gray-600">Register for courses for the current session</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Current Session</p>
                    <p class="font-semibold">{{ currentSession }}</p>
                </div>
            </div>
        </div>

        <!-- Registration Status -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="fa fa-info-circle text-blue-500 text-xl mr-3"></i>
                    <div>
                        <h3 class="font-semibold">Registration Status</h3>
                        <p class="text-sm text-gray-600">{{ registrationStatus }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Total Units</p>
                    <p class="text-2xl font-bold text-blue-600">{{ totalUnits }}</p>
                </div>
            </div>
        </div>

        <!-- Course Registration Tabs -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                    <button @click="activeTab = 'available'" 
                            :class="activeTab === 'available' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                            class="py-4 px-1 border-b-2 font-medium text-sm">
                        Available Courses
                    </button>
                    <button @click="activeTab = 'registered'" 
                            :class="activeTab === 'registered' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                            class="py-4 px-1 border-b-2 font-medium text-sm">
                        Registered Courses ({{ registeredCourses.length }})
                    </button>
                </nav>
            </div>

            <!-- Available Courses Tab -->
            <div v-if="activeTab === 'available'" class="p-6">
                <div class="mb-4 flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Available Courses</h3>
                    <div class="flex gap-2">
                        <input v-model="searchQuery" type="text" placeholder="Search courses..." 
                               class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <select v-model="filterSemester" class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Semesters</option>
                            <option value="1">First Semester</option>
                            <option value="2">Second Semester</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <input type="checkbox" @change="selectAllCourses" :checked="allCoursesSelected">
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="course in filteredAvailableCourses" :key="course.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <input type="checkbox" v-model="selectedCourses" :value="course.id" 
                                           :disabled="isRegistered(course.id)">
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ course.course_code }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ course.course_title }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ course.unit }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ course.semester == 1 ? 'First' : 'Second' }} Semester
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span v-if="isRegistered(course.id)" 
                                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Registered
                                    </span>
                                    <span v-else-if="course.is_compulsory" 
                                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Compulsory
                                    </span>
                                    <span v-else 
                                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Elective
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 flex justify-between items-center">
                    <p class="text-sm text-gray-600">
                        Selected: {{ selectedCourses.length }} courses 
                        ({{ selectedCoursesUnits }} units)
                    </p>
                    <button @click="registerCourses" :disabled="selectedCourses.length === 0 || loading" 
                            class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                        <i v-if="loading" class="fa fa-spinner fa-spin mr-2"></i>
                        Register Selected Courses
                    </button>
                </div>
            </div>

            <!-- Registered Courses Tab -->
            <div v-if="activeTab === 'registered'" class="p-6">
                <div class="mb-4 flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Registered Courses</h3>
                    <div class="text-sm text-gray-600">
                        Total Units: {{ totalUnits }}
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="course in registeredCourses" :key="course.id">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ course.course_code }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ course.course_title }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ course.unit }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ course.semester == 1 ? 'First' : 'Second' }} Semester
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Registered
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button @click="unregisterCourse(course.id)" 
                                            :disabled="course.is_compulsory"
                                            class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <i class="fa fa-times"></i> Unregister
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div class="flex items-center">
                        <i class="fa fa-info-circle text-blue-500 mr-2"></i>
                        <p class="text-sm text-blue-700">
                            You have registered for {{ registeredCourses.length }} courses with a total of {{ totalUnits }} units.
                            {{ totalUnits < 15 ? 'You may need to register for more courses.' : totalUnits > 24 ? 'You have exceeded the maximum unit load.' : 'Your course load is within the recommended range.' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';

export default {
    data() {
        return {
            activeTab: 'available',
            currentSession: '2023/2024',
            registrationStatus: 'Open',
            availableCourses: [],
            registeredCourses: [],
            selectedCourses: [],
            searchQuery: '',
            filterSemester: '',
            loading: false
        }
    },
    computed: {
        filteredAvailableCourses() {
            let courses = this.availableCourses;
            
            if (this.searchQuery) {
                courses = courses.filter(course => 
                    course.course_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    course.course_title.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            if (this.filterSemester) {
                courses = courses.filter(course => course.semester == this.filterSemester);
            }
            
            return courses;
        },
        totalUnits() {
            return this.registeredCourses.reduce((total, course) => total + parseInt(course.unit), 0);
        },
        selectedCoursesUnits() {
            return this.selectedCourses.reduce((total, courseId) => {
                const course = this.availableCourses.find(c => c.id === courseId);
                return total + (course ? parseInt(course.unit) : 0);
            }, 0);
        },
        allCoursesSelected() {
            const unregisteredCourses = this.filteredAvailableCourses.filter(course => !this.isRegistered(course.id));
            return unregisteredCourses.length > 0 && unregisteredCourses.every(course => this.selectedCourses.includes(course.id));
        }
    },
    methods: {
        async loadAvailableCourses() {
            try {
                const res = await get(this.$endpoints.student.getProgrammeCourses.url.replace('{session_id}', '1'));
                if (res && res.data) {
                    this.availableCourses = res.data;
                }
            } catch (error) {
                console.error('Error loading available courses:', error);
            }
        },
        async loadRegisteredCourses() {
            try {
                const res = await post(this.$endpoints.student.getRegisteredCourses.url, {});
                if (res && res.data) {
                    this.registeredCourses = res.data;
                }
            } catch (error) {
                console.error('Error loading registered courses:', error);
            }
        },
        isRegistered(courseId) {
            return this.registeredCourses.some(course => course.id === courseId);
        },
        selectAllCourses(event) {
            const unregisteredCourses = this.filteredAvailableCourses.filter(course => !this.isRegistered(course.id));
            if (event.target.checked) {
                this.selectedCourses = [...new Set([...this.selectedCourses, ...unregisteredCourses.map(c => c.id)])];
            } else {
                const unregisteredIds = unregisteredCourses.map(c => c.id);
                this.selectedCourses = this.selectedCourses.filter(id => !unregisteredIds.includes(id));
            }
        },
        async registerCourses() {
            if (this.selectedCourses.length === 0) return;
            
            this.loading = true;
            try {
                const res = await post(this.$endpoints.student.registerCourses.url, {
                    course_ids: this.selectedCourses
                });
                
                if (res && !res.error) {
                    this.$globals.message = {
                        text: 'Courses registered successfully',
                        type: 'success'
                    };
                    this.selectedCourses = [];
                    await this.loadRegisteredCourses();
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error registering courses:', error);
            } finally {
                this.loading = false;
            }
        },
        async unregisterCourse(courseId) {
            try {
                const res = await post(this.$endpoints.student.unregisterCourses.url, {
                    course_ids: [courseId]
                });
                
                if (res && !res.error) {
                    this.$globals.message = {
                        text: 'Course unregistered successfully',
                        type: 'success'
                    };
                    await this.loadRegisteredCourses();
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error unregistering course:', error);
            }
        }
    },
    async mounted() {
        await this.loadAvailableCourses();
        await this.loadRegisteredCourses();
    }
}
</script>
