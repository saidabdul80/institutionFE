<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Applicant Dashboard
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Overview of applicant statistics and admission analytics
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="$router.push({name: 'staff-applicants'})" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fa fa-users mr-2"></i>All Applicants
                    </button>
                    <button @click="$router.push({name: 'staff-admission'})" 
                            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-graduation-cap mr-2"></i>Admission
                    </button>
                </div>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Applications</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.totalApplications || 0 }}</p>
                        <p class="text-xs opacity-75 mt-1">This Session</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-file-text text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Qualified</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.qualified || 0 }}</p>
                        <p class="text-xs opacity-75 mt-1">{{ qualificationRate }}% of total</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-check-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Admitted</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.admitted || 0 }}</p>
                        <p class="text-xs opacity-75 mt-1">{{ admissionRate }}% of qualified</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-graduation-cap text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Pending Review</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ dashboardStats.pendingReview || 0 }}</p>
                        <p class="text-xs opacity-75 mt-1">Awaiting action</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-clock-o text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Application Status Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Status Distribution -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Application Status Distribution</h3>
                <div class="space-y-4">
                    <div v-for="status in statusDistribution" :key="status.name" 
                         class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <div :class="status.color" class="w-4 h-4 rounded-full mr-3"></div>
                            <span class="font-medium text-gray-700">{{ status.name }}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-lg font-bold text-gray-900">{{ status.count }}</span>
                            <span class="text-sm text-gray-500 ml-2">({{ status.percentage }}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Programme Distribution -->
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Applications by Programme</h3>
                <div class="space-y-3">
                    <div v-for="programme in programmeDistribution" :key="programme.id"
                         class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div class="flex-1">
                            <p class="font-medium text-gray-800">{{ programme.name }}</p>
                            <p v-if="programme.curriculum_name" class="text-xs text-gray-500 mt-1">
                                {{ programme.curriculum_name }}
                            </p>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div :class="getProgressBarColor(programme.percentage)"
                                     class="h-2 rounded-full transition-all duration-300"
                                     :style="`width: ${programme.percentage}%`"></div>
                            </div>
                        </div>
                        <div class="ml-4 text-right">
                            <span class="text-lg font-bold text-gray-900">{{ formatNumber(programme.count) }}</span>
                            <p class="text-xs text-gray-500">{{ programme.percentage }}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Applications -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Recent Applications</h3>
                <button @click="$router.push({name: 'staff-applicants'})" 
                        class="text-blue-600 hover:text-blue-800 font-medium">
                    View All Applications <i class="fa fa-arrow-right ml-1"></i>
                </button>
            </div>
            
            <div v-if="loading" class="text-center py-8">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading recent applications...</p>
            </div>
            
            <div v-else-if="recentApplications.length === 0" class="text-center py-8">
                <i class="fa fa-inbox text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No recent applications</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JAMB Score</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="application in recentApplications" :key="application.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-8 w-8">
                                        <img v-if="application.picture" :src="application.picture" 
                                             class="h-8 w-8 rounded-full object-cover" :alt="application.first_name">
                                        <div v-else class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span class="text-xs font-medium text-gray-700">
                                                {{ getInitials(application.first_name, application.last_name) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ application.first_name }} {{ application.last_name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ application.application_number }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ application.programme?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ application.jamb_score || 'N/A' }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(application.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ formatStatus(application.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(application.created_at) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-6 text-gray-800">Quick Actions</h3>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button @click="$router.push({name: 'staff-applicants', query: {status: 'under_review'}})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-yellow-500 rounded-full p-3 mb-3 group-hover:bg-yellow-600 transition-colors">
                        <i class="fa fa-clock-o text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Review Pending</span>
                </button>
                
                <button @click="$router.push({name: 'staff-applicants', query: {status: 'qualified'}})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-green-500 rounded-full p-3 mb-3 group-hover:bg-green-600 transition-colors">
                        <i class="fa fa-check-circle text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Qualified Applicants</span>
                </button>
                
                <button @click="$router.push({name: 'staff-admission'})" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-purple-500 rounded-full p-3 mb-3 group-hover:bg-purple-600 transition-colors">
                        <i class="fa fa-graduation-cap text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Process Admission</span>
                </button>
                
                <button @click="exportReport" 
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-blue-500 rounded-full p-3 mb-3 group-hover:bg-blue-600 transition-colors">
                        <i class="fa fa-download text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Export Report</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            dashboardStats: {
                totalApplications: 0,
                qualified: 0,
                admitted: 0,
                pendingReview: 0
            },
            statusDistribution: [
                { name: 'Submitted', count: 0, percentage: 0, color: 'bg-blue-500' },
                { name: 'Under Review', count: 0, percentage: 0, color: 'bg-yellow-500' },
                { name: 'Qualified', count: 0, percentage: 0, color: 'bg-green-500' },
                { name: 'Not Qualified', count: 0, percentage: 0, color: 'bg-red-500' },
                { name: 'Admitted', count: 0, percentage: 0, color: 'bg-purple-500' }
            ],
            programmeDistribution: [],
            recentApplications: []
        }
    },
    computed: {
        qualificationRate() {
            if (this.dashboardStats.totalApplications === 0) return 0;
            return Math.round((this.dashboardStats.qualified / this.dashboardStats.totalApplications) * 100);
        },
        admissionRate() {
            if (this.dashboardStats.qualified === 0) return 0;
            return Math.round((this.dashboardStats.admitted / this.dashboardStats.qualified) * 100);
        },
        currentSessionId() {
            return this.$globals.getConfiguration('current_session') || 1;
        }
    },
    methods: {
        async loadDashboardData() {
            this.loading = true;
            try {
                await Promise.all([
                    this.loadDashboardStats(),
                    this.loadStatusDistribution(),
                    this.loadProgrammeDistribution(),
                    this.loadRecentApplications()
                ]);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadDashboardStats() {
            try {
                const response = await post(this.$endpoints.staff.infoDashboard.url,{
                    session_id: this.currentSessionId
                });
                if (response && response.data) {
                    this.dashboardStats = {
                        totalApplications: response.data.applicant.total || 0,
                        qualified: response.data.applicant?.qualified || 0,
                        admitted: response.data?.applicant?.admitted || 0,
                        pendingReview: response.data.applicant?.pending_review || 0
                    };
                } else {
                    // Mock data for demonstration
                    this.dashboardStats = {
                        totalApplications: 1250,
                        qualified: 850,
                        admitted: 420,
                        pendingReview: 180
                    };
                }
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            }
        },
        async loadStatusDistribution() {
            try {
                const response = await post(this.$endpoints.staff.infoDashboard.url, {
                    session_id: this.currentSessionId,
                    type: 'status_distribution'
                });

                if (response && response.data && response.data.applicant) {
                    const data = response.data.applicant;
                    const total = data.total || this.dashboardStats.totalApplications;

                    this.statusDistribution = [
                        { name: 'Submitted', count: data.submitted || 0, percentage: Math.round(((data.submitted || 0)/total)*100), color: 'bg-blue-500' },
                        { name: 'Under Review', count: data.pending_review || 0, percentage: Math.round(((data.pending_review || 0)/total)*100), color: 'bg-yellow-500' },
                        { name: 'Qualified', count: data.qualified || 0, percentage: Math.round(((data.qualified || 0)/total)*100), color: 'bg-green-500' },
                        { name: 'Not Qualified', count: data.not_qualified || 0, percentage: Math.round(((data.not_qualified || 0)/total)*100), color: 'bg-red-500' },
                        { name: 'Admitted', count: data.admitted || 0, percentage: Math.round(((data.admitted || 0)/total)*100), color: 'bg-purple-500' }
                    ];
                } else {
                    // Fallback with mock data
                    const total = this.dashboardStats.totalApplications || 1250;
                    this.statusDistribution = [
                        { name: 'Submitted', count: 320, percentage: Math.round((320/total)*100), color: 'bg-blue-500' },
                        { name: 'Under Review', count: 180, percentage: Math.round((180/total)*100), color: 'bg-yellow-500' },
                        { name: 'Qualified', count: 850, percentage: Math.round((850/total)*100), color: 'bg-green-500' },
                        { name: 'Not Qualified', count: 280, percentage: Math.round((280/total)*100), color: 'bg-red-500' },
                        { name: 'Admitted', count: 420, percentage: Math.round((420/total)*100), color: 'bg-purple-500' }
                    ];
                }
            } catch (error) {
                console.error('Error loading status distribution:', error);
                // Fallback with mock data on error
                const total = this.dashboardStats.totalApplications || 1250;
                this.statusDistribution = [
                    { name: 'Submitted', count: 320, percentage: Math.round((320/total)*100), color: 'bg-blue-500' },
                    { name: 'Under Review', count: 180, percentage: Math.round((180/total)*100), color: 'bg-yellow-500' },
                    { name: 'Qualified', count: 850, percentage: Math.round((850/total)*100), color: 'bg-green-500' },
                    { name: 'Not Qualified', count: 280, percentage: Math.round((280/total)*100), color: 'bg-red-500' },
                    { name: 'Admitted', count: 420, percentage: Math.round((420/total)*100), color: 'bg-purple-500' }
                ];
            }
        },
        async loadProgrammeDistribution() {
            try {
                // Try the new curriculum endpoint first for more accurate data
                const curriculumResponse = await get(this.$endpoints.staff.curriculum.getApplicationsByProgramme.url);

                if (curriculumResponse && !curriculumResponse.error && curriculumResponse.programmes) {
                    this.programmeDistribution = curriculumResponse.programmes.map(programme => ({
                        id: programme.programme_curriculum_id || programme.id,
                        name: programme.programme_name,
                        count: programme.total_applications,
                        percentage: programme.percentage,
                        curriculum_name: programme.curriculum_name
                    }));
                    return; // Success, exit early
                }

                // Fallback to original dashboard endpoint
                const response = await post(this.$endpoints.staff.infoDashboard.url, {
                    session_id: this.currentSessionId,
                    type: 'programme_distribution'
                });

                if (response && response.data && response.data.programmes) {
                    this.programmeDistribution = response.data.programmes.map(programme => ({
                        id: programme.id,
                        name: programme.name,
                        count: programme.applicant_count || 0,
                        percentage: programme.percentage || 0
                    }));
                } else {
                    // Fallback with mock data
                    this.programmeDistribution = [
                        { id: 1, name: 'Computer Science', count: 320, percentage: 25 },
                        { id: 2, name: 'Engineering', count: 280, percentage: 22 },
                        { id: 3, name: 'Medicine', count: 250, percentage: 20 },
                        { id: 4, name: 'Business Administration', count: 200, percentage: 16 },
                        { id: 5, name: 'Law', count: 150, percentage: 12 },
                        { id: 6, name: 'Others', count: 50, percentage: 5 }
                    ];
                }
            } catch (error) {
                console.error('Error loading programme distribution:', error);
                // Fallback with mock data on error
                this.programmeDistribution = [
                    { id: 1, name: 'Computer Science', count: 320, percentage: 25 },
                    { id: 2, name: 'Engineering', count: 280, percentage: 22 },
                    { id: 3, name: 'Medicine', count: 250, percentage: 20 },
                    { id: 4, name: 'Business Administration', count: 200, percentage: 16 },
                    { id: 5, name: 'Law', count: 150, percentage: 12 },
                    { id: 6, name: 'Others', count: 50, percentage: 5 }
                ];
            }
        },
        async loadRecentApplications() {
            try {
                const response = await post(this.$endpoints.staff.getApplicants.url, {
                    paginateBy: 10,
                    mode: 1,
                    search: {},
                    recent: true
                });
                if (response && response.data) {
                    this.recentApplications = response.data.data || response.data;
                } else {
                    // Mock data for demonstration
                    this.recentApplications = [
                        {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            application_number: 'APP/2024/001',
                            programme: { name: 'Computer Science' },
                            jamb_score: 285,
                            status: 'qualified',
                            created_at: '2024-01-15T10:30:00Z'
                        },
                        {
                            id: 2,
                            first_name: 'Jane',
                            last_name: 'Smith',
                            application_number: 'APP/2024/002',
                            programme: { name: 'Engineering' },
                            jamb_score: 292,
                            status: 'under_review',
                            created_at: '2024-01-15T09:15:00Z'
                        }
                    ];
                }
            } catch (error) {
                console.error('Error loading recent applications:', error);
            }
        },
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : '';
            const last = lastName ? lastName.charAt(0).toUpperCase() : '';
            return first + last || 'N/A';
        },

        formatNumber(number) {
            return new Intl.NumberFormat('en-NG').format(number)
        },

        getProgressBarColor(percentage) {
            if (percentage >= 30) return 'bg-blue-500'
            if (percentage >= 20) return 'bg-green-500'
            if (percentage >= 15) return 'bg-yellow-500'
            if (percentage >= 10) return 'bg-orange-500'
            return 'bg-red-500'
        },
        getStatusColor(status) {
            const colors = {
                'submitted': 'bg-blue-100 text-blue-800',
                'under_review': 'bg-yellow-100 text-yellow-800',
                'qualified': 'bg-green-100 text-green-800',
                'not_qualified': 'bg-red-100 text-red-800',
                'admitted': 'bg-purple-100 text-purple-800',
                'not_admitted': 'bg-gray-100 text-gray-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        formatStatus(status) {
            if (!status) return 'N/A';
            return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        exportReport() {
            console.log('Export applicant dashboard report');
            // This would generate and download a comprehensive report
        }
    },
    async mounted() {
        await this.loadDashboardData();
    }
}
</script>
