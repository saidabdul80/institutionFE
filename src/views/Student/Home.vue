<template>
    <div class="p-6">
        <!-- Welcome Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Welcome, {{ studentInfo.full_name || 'Student' }}</h1>
                    <p class="text-gray-600">{{ studentInfo.matric_number }}</p>
                    <p class="text-sm text-gray-500">{{ studentInfo.programme_name }} - {{ studentInfo.level }}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Current Session</p>
                    <p class="font-semibold">{{ currentSession }}</p>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="bg-blue-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-book text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Registered Courses</p>
                        <p class="text-2xl font-bold">{{ stats.registeredCourses }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-green-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-credit-card text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Wallet Balance</p>
                        <p class="text-2xl font-bold">₦{{ formatMoney(stats.walletBalance) }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-yellow-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-file-text text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Pending Invoices</p>
                        <p class="text-2xl font-bold">{{ stats.pendingInvoices }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-purple-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-graduation-cap text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">CGPA</p>
                        <p class="text-2xl font-bold">{{ stats.cgpa || 'N/A' }}</p>
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
            currentSession: '2023/2024',
            stats: {
                registeredCourses: 0,
                walletBalance: 0,
                pendingInvoices: 0,
                cgpa: null
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
    methods: {
        formatMoney(amount) {
            return new Intl.NumberFormat('en-NG').format(amount);
        },
        async loadStudentData() {
            try {
                // Load student info
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
