<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Staff Dashboard
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Welcome back, {{ staffInfo.first_name }} {{ staffInfo.last_name }}
                    </p>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1">
                        {{ staffInfo.role || 'Staff Member' }} • {{ currentSession.name || 'No Active Session' }}
                    </p>
                </div>
                <div class="flex-shrink-0 text-left sm:text-right">
                    <p class="text-xs sm:text-sm text-gray-500 mb-2">Current Session</p>
                    <span class="inline-block px-3 py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                        {{ currentSession.name || 'Not Set' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Students</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.totalStudents || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-graduation-cap text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Applicants</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.totalApplicants || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-address-book text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Active Courses</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.activeCourses || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-book text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Staff Members</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.totalStaff || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-users text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Quick Actions</h3>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <button @click="$router.push({name: 'staff-students'})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-blue-500 rounded-full p-3 mb-3 group-hover:bg-blue-600 transition-colors">
                        <i class="fa fa-graduation-cap text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Manage Students</span>
                </button>
                
                <button @click="$router.push({name: 'staff-applicants'})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-green-500 rounded-full p-3 mb-3 group-hover:bg-green-600 transition-colors">
                        <i class="fa fa-address-book text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Manage Applicants</span>
                </button>
                
                <button @click="$router.push({name: 'staff-results'})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-purple-500 rounded-full p-3 mb-3 group-hover:bg-purple-600 transition-colors">
                        <i class="fa fa-book text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Manage Results</span>
                </button>
                
                <button @click="$router.push({name: 'staff-scores'})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-yellow-500 rounded-full p-3 mb-3 group-hover:bg-yellow-600 transition-colors">
                        <i class="fa fa-edit text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Input Scores</span>
                </button>
            </div>
        </div>

        <!-- Recent Activities & Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Recent Activities -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Recent Activities</h3>
                <div class="space-y-3 sm:space-y-4">
                    <div v-for="activity in recentActivities" :key="activity.id" 
                         class="flex items-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200">
                        <div class="flex-shrink-0 mr-3 sm:mr-4">
                            <div class="bg-white rounded-full p-2 sm:p-3 shadow-sm">
                                <i :class="activity.icon" class="text-lg sm:text-xl"></i>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm sm:text-base font-medium text-gray-800 truncate">{{ activity.title }}</p>
                            <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ activity.date }}</p>
                        </div>
                        <div class="flex-shrink-0 ml-3">
                            <span :class="getActivityStatusColor(activity.status)" 
                                  class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                                {{ activity.status }}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Empty State -->
                    <div v-if="recentActivities.length === 0" class="text-center py-8">
                        <i class="fa fa-clock-o text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">No recent activities</p>
                    </div>
                </div>
            </div>

            <!-- System Status -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg sm:text-xl font-semibold mb-6 text-gray-800">System Status</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span class="text-sm font-medium text-gray-700">Database</span>
                        </div>
                        <span class="text-xs text-green-600 font-medium">Online</span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span class="text-sm font-medium text-gray-700">Payment Gateway</span>
                        </div>
                        <span class="text-xs text-green-600 font-medium">Active</span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                            <span class="text-sm font-medium text-gray-700">Backup System</span>
                        </div>
                        <span class="text-xs text-yellow-600 font-medium">Scheduled</span>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                            <span class="text-sm font-medium text-gray-700">Email Service</span>
                        </div>
                        <span class="text-xs text-blue-600 font-medium">Running</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pending Tasks -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Pending Tasks</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-orange-800">Results Pending</h4>
                        <span class="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">{{ pendingTasks.resultsPending || 0 }}</span>
                    </div>
                    <p class="text-sm text-orange-600">Results awaiting approval</p>
                </div>
                
                <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-blue-800">Applications</h4>
                        <span class="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">{{ pendingTasks.applicationsReview || 0 }}</span>
                    </div>
                    <p class="text-sm text-blue-600">Applications for review</p>
                </div>
                
                <div class="p-4 border border-green-200 rounded-lg bg-green-50">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-green-800">Payments</h4>
                        <span class="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">{{ pendingTasks.paymentsConfirm || 0 }}</span>
                    </div>
                    <p class="text-sm text-green-600">Payments to confirm</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { userDataMixin } from '@/mixins/userDataMixin';
import { get, post } from '@/api/client';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            authStore: useAuthStore(),
            staffInfo: {},
            currentSession: {},
            dashboardStats: {
                totalStudents: 0,
                totalApplicants: 0,
                activeCourses: 0,
                totalStaff: 0
            },
            pendingTasks: {
                resultsPending: 0,
                applicationsReview: 0,
                paymentsConfirm: 0
            },
            recentActivities: [
                {
                    id: 1,
                    title: 'New student registered',
                    date: '2 hours ago',
                    icon: 'fa fa-user-plus text-green-500',
                    status: 'Completed'
                },
                {
                    id: 2,
                    title: 'Result computation completed',
                    date: '4 hours ago',
                    icon: 'fa fa-calculator text-blue-500',
                    status: 'Completed'
                },
                {
                    id: 3,
                    title: 'Payment confirmed',
                    date: '6 hours ago',
                    icon: 'fa fa-credit-card text-purple-500',
                    status: 'Completed'
                }
            ]
        }
    },
    methods: {
        async loadDashboardData() {
            try {
                // Load staff info from auth store
                if (this.authStore.getUser) {
                    this.staffInfo = this.authStore.getUser;
                }

                // Load dashboard statistics
                await this.loadDashboardStats();
                await this.loadCurrentSession();
                await this.loadPendingTasks();
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        },
        async loadDashboardStats() {
            try {
                const response = await post(this.$endpoints.staff.infoDashboard.url,{
                    session_id: this.currentSessionId
                });

                if (response && response.data) {
                    
                    this.dashboardStats = {
                        totalStudents: response.data.student.total || 0,
                        totalApplicants: response.data.applicant.total || 0,
                        activeCourses: response.data.total_courses || 0,
                        totalStaff: response.data.total_staff || 0
                    };
                }
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            }
        },
        async loadCurrentSession() {
            try {
                const response = await get(this.$endpoints.staff.getAllSessions.url);
                if (response && response.data) {
                    // Find the active session
                    this.currentSession = response.data.find(session => session.is_active) || {};
                }
            } catch (error) {
                console.error('Error loading current session:', error);
            }
        },
        async loadPendingTasks() {
            try {
                // This would typically come from a dedicated endpoint
                // For now, using mock data
                this.pendingTasks = {
                    resultsPending: 15,
                    applicationsReview: 23,
                    paymentsConfirm: 8
                };
            } catch (error) {
                console.error('Error loading pending tasks:', error);
            }
        },
        getActivityStatusColor(status) {
            const colors = {
                'completed': 'bg-green-100 text-green-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'failed': 'bg-red-100 text-red-800'
            };
            return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        }
    },
    async mounted() {
        await this.loadDashboardData();
    }
}
</script>
