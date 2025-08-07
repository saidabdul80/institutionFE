<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Payment Required Alert -->
        <div v-if="!hasValidRegistrationPayment" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
            <div class="flex items-center justify-between">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fa fa-exclamation-triangle text-red-400 text-xl"></i>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                            Registration Fee Payment Required
                        </h3>
                        <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                            <p>You need to pay your registration fee for {{ currentSession?.name }} to access course registration.</p>
                            <p v-if="paymentInfo.has_previous_unpaid" class="mt-1 font-medium">
                                ⚠️ You also have unpaid fees from previous sessions that must be cleared first.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <button @click="goToPayments" 
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <i class="fa fa-credit-card mr-2"></i>
                        Pay Now
                    </button>
                </div>
            </div>
        </div>

        <!-- Course Registration Content -->
        <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Course Registration</h1>
                        <p class="text-gray-600 dark:text-gray-300">{{ currentSession?.name }} - {{ studentInfo.level?.name }}</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Registration Status</p>
                            <span :class="registrationStatus.color" class="px-3 py-1 rounded-full text-xs font-medium">
                                {{ registrationStatus.text }}
                            </span>
                        </div>
                        <button v-if="selectedCourses.length > 0" @click="showRegistrationModal = true"
                                class="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700">
                            <i class="fa fa-check mr-2"></i>
                            Register Courses ({{ selectedCourses.length }})
                        </button>
                    </div>
                </div>
            </div>

            <!-- Registration Summary -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <i class="fa fa-book text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Available Courses</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ availableCourses.length }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <i class="fa fa-check-circle text-green-600 dark:text-green-400"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Selected</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedCourses.length }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <i class="fa fa-calculator text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Units</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalUnits }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <i class="fa fa-graduation-cap text-orange-600 dark:text-orange-400"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Registered</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ registeredCourses.length }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Course Categories Tabs -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="flex space-x-8 px-6">
                        <button v-for="category in courseCategories" :key="category.id"
                                @click="activeCategory = category.id"
                                :class="activeCategory === category.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'"
                                class="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap">
                            {{ category.name }}
                            <span class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                {{ getCoursesByCategory(category.id).length }}
                            </span>
                        </button>
                    </nav>
                </div>

                <!-- Course List -->
                <div class="p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <div class="flex space-x-4">
                            <input v-model="searchQuery" 
                                   placeholder="Search courses..." 
                                   class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <select v-model="semesterFilter" 
                                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">All Semesters</option>
                                <option value="1">First Semester</option>
                                <option value="2">Second Semester</option>
                            </select>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="selectAllVisible" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                                Select All Visible
                            </button>
                            <button @click="clearSelection" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm">
                                Clear Selection
                            </button>
                        </div>
                    </div>

                    <!-- Courses Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="course in filteredCourses" :key="course.id"
                             :class="[
                                 'border rounded-lg p-4 cursor-pointer transition-all duration-200',
                                 isSelected(course.id) 
                                     ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                     : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                                 isRegistered(course.id) ? 'opacity-60' : ''
                             ]"
                             @click="toggleCourse(course)">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center mb-2">
                                        <input type="checkbox" 
                                               :checked="isSelected(course.id)"
                                               :disabled="isRegistered(course.id)"
                                               class="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                        <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
                                            {{ course.code }}
                                        </h3>
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">{{ course.title }}</p>
                                    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{{ course.credit_units }} Units</span>
                                        <span>Semester {{ course.semester }}</span>
                                    </div>
                                    <div v-if="course.prerequisites?.length" class="mt-2">
                                        <p class="text-xs text-orange-600 dark:text-orange-400">
                                            Prerequisites: {{ course.prerequisites.join(', ') }}
                                        </p>
                                    </div>
                                </div>
                                <div class="ml-2">
                                    <span v-if="isRegistered(course.id)" 
                                          class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                                        Registered
                                    </span>
                                    <span v-else-if="course.is_compulsory" 
                                          class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs">
                                        Compulsory
                                    </span>
                                    <span v-else 
                                          class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                                        Elective
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- No courses message -->
                    <div v-if="filteredCourses.length === 0" class="text-center py-12">
                        <i class="fa fa-book text-gray-400 text-4xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                        <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Registration Confirmation Modal -->
        <div v-if="showRegistrationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Confirm Course Registration</h3>
                
                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Courses ({{ selectedCourses.length }})</h4>
                    <div class="space-y-2 max-h-60 overflow-y-auto">
                        <div v-for="course in selectedCoursesDetails" :key="course.id"
                             class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p class="font-medium text-gray-900 dark:text-white">{{ course.code }}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-300">{{ course.title }}</p>
                            </div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{ course.credit_units }} units</span>
                        </div>
                    </div>
                    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p class="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Total Credit Units: {{ totalUnits }}</strong>
                        </p>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="showRegistrationModal = false"
                            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                    <button @click="registerCourses" :disabled="registering"
                            class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50">
                        <i v-if="registering" class="fa fa-spinner fa-spin mr-2"></i>
                        {{ registering ? 'Registering...' : 'Confirm Registration' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client'

export default {
    name: 'CourseRegistration',
    data() {
        return {
            // Payment validation
            hasValidRegistrationPayment: false,
            paymentInfo: {},
            currentSession: null,
            studentInfo: {},

            // Course data
            availableCourses: [],
            registeredCourses: [],
            selectedCourses: [],
            courseCategories: [
                { id: 'all', name: 'All Courses' },
                { id: 'compulsory', name: 'Compulsory' },
                { id: 'elective', name: 'Elective' }
            ],

            // UI state
            activeCategory: 'all',
            searchQuery: '',
            semesterFilter: '',
            showRegistrationModal: false,
            registering: false,
            loading: false
        }
    },

    computed: {
        registrationStatus() {
            if (!this.hasValidRegistrationPayment) {
                return {
                    text: 'Payment Required',
                    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }
            }

            if (this.registeredCourses.length > 0) {
                return {
                    text: 'Registered',
                    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }
            }

            return {
                text: 'Open',
                color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            }
        },

        totalUnits() {
            return this.selectedCourses.reduce((total, courseId) => {
                const course = this.availableCourses.find(c => c.id === courseId)
                return total + (course?.credit_units || 0)
            }, 0)
        },

        selectedCoursesDetails() {
            return this.selectedCourses.map(courseId =>
                this.availableCourses.find(c => c.id === courseId)
            ).filter(Boolean)
        },

        filteredCourses() {
            let courses = this.availableCourses

            // Filter by category
            if (this.activeCategory !== 'all') {
                courses = courses.filter(course => {
                    if (this.activeCategory === 'compulsory') return course.is_compulsory
                    if (this.activeCategory === 'elective') return !course.is_compulsory
                    return true
                })
            }

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                courses = courses.filter(course =>
                    course.code.toLowerCase().includes(query) ||
                    course.title.toLowerCase().includes(query)
                )
            }

            // Filter by semester
            if (this.semesterFilter) {
                courses = courses.filter(course =>
                    course.semester.toString() === this.semesterFilter
                )
            }

            return courses
        }
    },

    async mounted() {
        await this.initializeComponent()
    },

    methods: {
        async initializeComponent() {
            this.loading = true
            try {
                await Promise.all([
                    this.checkRegistrationPayment(),
                    this.loadCurrentSession(),
                    this.loadStudentInfo()
                ])

                if (this.hasValidRegistrationPayment) {
                    await Promise.all([
                        this.loadAvailableCourses(),
                        this.loadRegisteredCourses()
                    ])
                }
            } catch (error) {
                console.error('Error initializing component:', error)
                this.$globals.message = {
                    text: 'Error loading course registration data',
                    type: 'error'
                }
            } finally {
                this.loading = false
            }
        },

        async checkRegistrationPayment() {
            try {
                const response = await get(this.$endpoints.student.checkRegistrationPayment.url)
                if (response && !response.error) {
                    this.hasValidRegistrationPayment = response.has_valid_payment || false
                    this.paymentInfo = response
                }
            } catch (error) {
                console.error('Error checking registration payment:', error)
                this.hasValidRegistrationPayment = false
            }
        },

        async loadCurrentSession() {
            try {
                const response = await get(this.$endpoints.student.getCurrentSession.url)
                if (response && !response.error) {
                    this.currentSession = response
                }
            } catch (error) {
                console.error('Error loading current session:', error)
            }
        },

        async loadStudentInfo() {
            try {
                const response = await get(this.$endpoints.student.getStudentById.url)
                if (response && !response.error) {
                    this.studentInfo = response
                }
            } catch (error) {
                console.error('Error loading student info:', error)
            }
        },

        async loadAvailableCourses() {
            try {
                const response = await get(this.$endpoints.student.getStudentCourses.url)
                if (response && !response.error) {
                    this.availableCourses = response
                }
            } catch (error) {
                console.error('Error loading available courses:', error)
            }
        },

        async loadRegisteredCourses() {
            try {
                const response = await get(this.$endpoints.student.getRegisteredCourses.url)
                if (response && !response.error) {
                    this.registeredCourses = response
                }
            } catch (error) {
                console.error('Error loading registered courses:', error)
            }
        },

        getCoursesByCategory(categoryId) {
            if (categoryId === 'all') return this.availableCourses
            if (categoryId === 'compulsory') return this.availableCourses.filter(c => c.is_compulsory)
            if (categoryId === 'elective') return this.availableCourses.filter(c => !c.is_compulsory)
            return []
        },

        isSelected(courseId) {
            return this.selectedCourses.includes(courseId)
        },

        isRegistered(courseId) {
            return this.registeredCourses.some(course => course.id === courseId)
        },

        toggleCourse(course) {
            if (this.isRegistered(course.id)) return

            const index = this.selectedCourses.indexOf(course.id)
            if (index > -1) {
                this.selectedCourses.splice(index, 1)
            } else {
                this.selectedCourses.push(course.id)
            }
        },

        selectAllVisible() {
            this.filteredCourses.forEach(course => {
                if (!this.isRegistered(course.id) && !this.isSelected(course.id)) {
                    this.selectedCourses.push(course.id)
                }
            })
        },

        clearSelection() {
            this.selectedCourses = []
        },

        async registerCourses() {
            if (this.selectedCourses.length === 0) return

            this.registering = true
            try {
                const response = await post(this.$endpoints.student.registerCourses.url, {
                    course_ids: this.selectedCourses,
                    session_id: this.currentSession?.id
                })

                if (response && !response.error) {
                    this.$globals.message = {
                        text: `Successfully registered ${this.selectedCourses.length} courses`,
                        type: 'success'
                    }

                    // Refresh data
                    await this.loadRegisteredCourses()
                    this.selectedCourses = []
                    this.showRegistrationModal = false
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Error registering courses',
                        type: 'error'
                    }
                }
            } catch (error) {
                console.error('Error registering courses:', error)
                this.$globals.message = {
                    text: 'Error registering courses. Please try again.',
                    type: 'error'
                }
            } finally {
                this.registering = false
            }
        },

        goToPayments() {
            this.$router.push({ name: 'student-payments' })
        }
    }
}
</script>
