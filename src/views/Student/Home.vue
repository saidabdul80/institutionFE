<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <!-- Payment Required Alert -->
        <div v-if="!hasValidRegistrationPayment" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
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
                            <p>Complete your registration fee payment to access all student portal features.</p>
                            <p v-if="paymentInfo.has_previous_unpaid" class="mt-1 font-medium">
                                ⚠️ Previous session fees must also be cleared.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <button @click="$router.push({name: 'student-payments'})"
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <i class="fa fa-credit-card mr-2"></i>
                        Pay Now
                    </button>
                </div>
            </div>
        </div>

        <!-- Welcome Section -->
        <div class="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-black/10"></div>
            <div class="relative z-10">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-4xl font-bold mb-3">Welcome back, {{ studentInfo.first_name }}!</h1>
                        <div class="flex items-center space-x-4 text-blue-100">
                            <span class="flex items-center">
                                <i class="fa fa-id-card mr-2"></i>
                                {{ studentInfo.matric_number }}
                            </span>
                            <span class="flex items-center">
                                <i class="fa fa-graduation-cap mr-2"></i>
                                {{ studentInfo.programme?.name }}
                            </span>
                            <span class="flex items-center">
                                <i class="fa fa-layer-group mr-2"></i>
                                {{ studentInfo.level?.name }}
                            </span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                            <p class="text-blue-100 text-sm">Current Session</p>
                            <p class="text-2xl font-bold">{{ currentSession?.name }}</p>
                            <p class="text-blue-200 text-sm mt-1">{{ currentSession?.status }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full"></div>
        </div>

        <!-- Enhanced Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Registered Courses -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Registered Courses</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.registeredCourses }}</p>
                        <p class="text-sm text-blue-600 dark:text-blue-400 mt-1">{{ stats.totalUnits }} units</p>
                    </div>
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <i class="fa fa-book text-blue-600 dark:text-blue-400 text-xl"></i>
                    </div>
                </div>
            </div>

            <!-- Wallet Balance -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Balance</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">₦{{ formatMoney(stats.walletBalance) }}</p>
                        <p class="text-sm text-green-600 dark:text-green-400 mt-1">Available funds</p>
                    </div>
                    <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <i class="fa fa-wallet text-green-600 dark:text-green-400 text-xl"></i>
                    </div>
                </div>
            </div>

            <!-- Payment Status -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Invoices</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.pendingInvoices }}</p>
                        <p :class="stats.pendingInvoices > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="text-sm mt-1">
                            {{ stats.pendingInvoices > 0 ? 'Requires attention' : 'All paid' }}
                        </p>
                    </div>
                    <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <i class="fa fa-file-invoice text-yellow-600 dark:text-yellow-400 text-xl"></i>
                    </div>
                </div>
            </div>

            <!-- Academic Progress -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Current CGPA</p>
                        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.cgpa || 'N/A' }}</p>
                        <p :class="getCGPAStatusColor(stats.cgpa)" class="text-sm mt-1">{{ getCGPAStatus(stats.cgpa) }}</p>
                    </div>
                    <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <i class="fa fa-chart-line text-purple-600 dark:text-purple-400 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activities and Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Activities -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4">Recent Activities</h3>
                <div class="space-y-3">
                    <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-3 bg-gray-50 rounded">
                        <i :class="activity.icon" class="text-blue-500 mr-3"></i>
                        <div>
                            <p class="text-sm font-medium">{{ activity.title }}</p>
                            <p class="text-xs text-gray-500">{{ activity.date }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                <div class="grid grid-cols-2 gap-4">
                    <button @click="$router.push({name: 'student-courses'})" class="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <i class="fa fa-book text-2xl text-blue-500 mb-2"></i>
                        <span class="text-sm font-medium">Register Courses</span>
                    </button>

                    <button @click="$router.push({name: 'student-payments'})" class="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <i class="fa fa-credit-card text-2xl text-green-500 mb-2"></i>
                        <span class="text-sm font-medium">Make Payment</span>
                    </button>

                    <button @click="$router.push({name: 'student-results'})" class="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        <i class="fa fa-graduation-cap text-2xl text-purple-500 mb-2"></i>
                        <span class="text-sm font-medium">View Results</span>
                    </button>

                    <button @click="$router.push({name: 'student-profile'})" class="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                        <i class="fa fa-user text-2xl text-yellow-500 mb-2"></i>
                        <span class="text-sm font-medium">Update Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get } from '@/api/client';
import { useAuthStore } from '@/stores/auth';

export default {
    data() {
        return {
            studentInfo: {},
            currentSession: null,
            hasValidRegistrationPayment: false,
            paymentInfo: {},
            stats: {
                registeredCourses: 0,
                walletBalance: 0,
                pendingInvoices: 0,
                cgpa: null,
                totalUnits: 0
            },
            recentActivities: [
                {
                    id: 1,
                    title: 'Course registration completed',
                    date: '2 days ago',
                    icon: 'fa fa-book'
                },
                {
                    id: 2,
                    title: 'Payment successful',
                    date: '1 week ago',
                    icon: 'fa fa-credit-card'
                },
                {
                    id: 3,
                    title: 'Result published',
                    date: '2 weeks ago',
                    icon: 'fa fa-graduation-cap'
                }
            ],
            store: useAuthStore()
        }
    },

    computed: {
        paymentStatusText() {
            return this.hasValidRegistrationPayment ? 'Paid' : 'Pending'
        },

        paymentStatusDescription() {
            if (this.hasValidRegistrationPayment) {
                return 'Registration fee paid'
            }
            return this.paymentInfo.has_previous_unpaid
                ? 'Previous fees pending'
                : 'Registration fee required'
        }
    },
    methods: {
        formatMoney(amount) {
            return new Intl.NumberFormat('en-NG').format(amount);
        },

        getCGPAStatus(cgpa) {
            if (!cgpa) return 'No results yet'
            if (cgpa >= 3.5) return 'Excellent'
            if (cgpa >= 3.0) return 'Very Good'
            if (cgpa >= 2.5) return 'Good'
            if (cgpa >= 2.0) return 'Fair'
            return 'Poor'
        },

        getCGPAStatusColor(cgpa) {
            if (!cgpa) return 'text-gray-500 dark:text-gray-400'
            if (cgpa >= 3.5) return 'text-green-600 dark:text-green-400'
            if (cgpa >= 3.0) return 'text-blue-600 dark:text-blue-400'
            if (cgpa >= 2.5) return 'text-yellow-600 dark:text-yellow-400'
            if (cgpa >= 2.0) return 'text-orange-600 dark:text-orange-400'
            return 'text-red-600 dark:text-red-400'
        },

        getPaymentStatusColor() {
            return this.hasValidRegistrationPayment
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
        },

        getAcademicProgress() {
            const level = this.studentInfo.level?.name
            if (!level) return 'Not set'
            return `Year ${level.charAt(0)} student`
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
        async loadStudentData() {
            try {
                // Load all data in parallel
                await Promise.all([
                    this.checkRegistrationPayment(),
                    this.loadCurrentSession(),
                    this.loadStudentInfo(),
                    this.loadStats()
                ])
            } catch (error) {
                console.error('Error loading student data:', error)
            }
        },

        async loadStudentInfo() {
            try {
                const studentRes = await get(this.$endpoints.student.getStudentById.url);
                if (studentRes) {
                    this.studentInfo = studentRes;
                }

                // Load wallet balance
                const walletRes = await get(this.$endpoints.student.getWallet.url);
                if (walletRes) {
                    this.stats.walletBalance = walletRes.balance || 0;
                }

                // Load registered courses count
                const coursesRes = await get(this.$endpoints.student.getRegisteredCourses.url, false, false);
                if (coursesRes && coursesRes.data) {
                    this.stats.registeredCourses = coursesRes.data.length;
                }

            } catch (error) {
                console.error('Error loading student data:', error);
            }
        }
    },
    async mounted() {
        await this.loadStudentData();
    }
}
</script>
