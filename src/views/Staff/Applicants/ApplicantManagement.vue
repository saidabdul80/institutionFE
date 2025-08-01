<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Applicant Management
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Manage applicant records, admission processing, and qualification assessment
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="$router.push({name: 'staff-applicant-dashboard'})" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fa fa-tachometer mr-2"></i>Dashboard
                    </button>
                    <button @click="$router.push({name: 'staff-admission'})" 
                            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-graduation-cap mr-2"></i>Admission
                    </button>
                    <button @click="exportApplicants" 
                            class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fa fa-download mr-2"></i>Export
                    </button>
                </div>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Filter Applicants</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <select v-model="filters.session_id" @change="loadApplicants" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Sessions</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <select v-model="filters.programme_id" @change="loadApplicants" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Programmes</option>
                        <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
                            {{ programme.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Application Status</label>
                    <select v-model="filters.application_status" @change="loadApplicants" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="qualified">Qualified</option>
                        <option value="not_qualified">Not Qualified</option>
                        <option value="admitted">Admitted</option>
                        <option value="not_admitted">Not Admitted</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    <select v-model="filters.payment_status" @change="loadApplicants" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Payment Status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Applicant Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Total Applications</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ applicantStats.total || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-users text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Qualified</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ applicantStats.qualified || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-check-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Under Review</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ applicantStats.underReview || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-clock-o text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Admitted</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ applicantStats.admitted || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-graduation-cap text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Not Qualified</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ applicantStats.notQualified || 0 }}</p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-times-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Applicants Table -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <div class="border-b border-gray-200 p-4 sm:p-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 class="text-lg font-semibold text-gray-800">Applicants ({{ filteredApplicants.length }})</h3>
                    <div class="flex gap-2">
                        <input v-model="searchQuery" @input="filterApplicants" type="text" 
                               placeholder="Search applicants..." 
                               class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <select v-model="itemsPerPage" @change="currentPage = 1" 
                                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading applicants...</p>
            </div>
            
            <div v-else-if="filteredApplicants.length === 0" class="p-6 text-center">
                <i class="fa fa-address-book text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No applicants found</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JAMB Score</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="applicant in paginatedApplicants" :key="applicant.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <img v-if="applicant.picture" :src="applicant.picture" 
                                             class="h-10 w-10 rounded-full object-cover" :alt="applicant.first_name">
                                        <div v-else class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span class="text-sm font-medium text-gray-700">
                                                {{ getInitials(applicant.first_name, applicant.last_name) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ applicant.first_name }} {{ applicant.last_name }}
                                        </div>
                                        <div class="text-sm text-gray-500">{{ applicant.email }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ applicant.application_number }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ applicant.programme?.name || 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span class="font-medium">{{ applicant.jamb_score || 'N/A' }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getApplicationStatusColor(applicant.application_status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ formatStatus(applicant.application_status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getPaymentStatusColor(applicant.payment_status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ formatStatus(applicant.payment_status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="viewApplicant(applicant)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-eye"></i> View
                                    </button>
                                    <button @click="processApplication(applicant)" 
                                            class="text-green-600 hover:text-green-900">
                                        <i class="fa fa-cog"></i> Process
                                    </button>
                                    <button @click="updateStatus(applicant)" 
                                            class="text-purple-600 hover:text-purple-900">
                                        <i class="fa fa-edit"></i> Status
                                    </button>
                                </div>
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
                            <span class="font-medium">{{ filteredApplicants.length }}</span> applicants
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
            itemsPerPage: 25,
            filters: {
                session_id: '',
                programme_id: '',
                application_status: '',
                payment_status: ''
            },
            sessions: [],
            programmes: [],
            applicants: [],
            filteredApplicants: [],
            applicantStats: {
                total: 0,
                qualified: 0,
                underReview: 0,
                admitted: 0,
                notQualified: 0
            }
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredApplicants.length / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage + 1;
        },
        endIndex() {
            return Math.min(this.currentPage * this.itemsPerPage, this.filteredApplicants.length);
        },
        paginatedApplicants() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredApplicants.slice(start, end);
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
            this.programmes = this.schoolProgrammes;

            await Promise.all([
                this.loadApplicants(),
                this.loadApplicantStats()
            ]);
        },
        async loadApplicants() {
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.filters.session_id) params.append('session_id', this.filters.session_id);
                if (this.filters.programme_id) params.append('programme_id', this.filters.programme_id);
                if (this.filters.application_status) params.append('application_status', this.filters.application_status);
                if (this.filters.payment_status) params.append('payment_status', this.filters.payment_status);
                
                const response = await post(this.$endpoints.staff.getApplicants.url, {
                    ...this.filters,
                    paginateBy: 1000, // Get all for client-side pagination
                    mode: 1
                });
                
                if (response && response.data) {
                    this.applicants = response.data.data || response.data;
                } else {
                    // Mock data for demonstration
                    this.applicants = [
                        {
                            id: 1,
                            first_name: 'John',
                            last_name: 'Doe',
                            email: 'john.doe@example.com',
                            application_number: 'APP/2024/001',
                            picture: null,
                            programme: { id: 1, name: 'Computer Science' },
                            jamb_score: 285,
                            application_status: 'qualified',
                            payment_status: 'paid'
                        }
                    ];
                }
                
                this.filterApplicants();
            } catch (error) {
                console.error('Error loading applicants:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadApplicantStats() {
            try {
                const response = await get(this.$endpoints.staff.getApplicantStats.url);
                if (response && response.data) {
                    this.applicantStats = response.data;
                } else {
                    // Mock stats
                    this.applicantStats = {
                        total: this.applicants.length,
                        qualified: this.applicants.filter(a => a.application_status === 'qualified').length,
                        underReview: this.applicants.filter(a => a.application_status === 'under_review').length,
                        admitted: this.applicants.filter(a => a.application_status === 'admitted').length,
                        notQualified: this.applicants.filter(a => a.application_status === 'not_qualified').length
                    };
                }
            } catch (error) {
                console.error('Error loading applicant stats:', error);
            }
        },
        filterApplicants() {
            let filtered = this.applicants;
            
            // Apply search filter
            if (this.searchQuery) {
                filtered = filtered.filter(applicant => 
                    applicant.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    applicant.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    applicant.application_number.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    applicant.email.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            this.filteredApplicants = filtered;
            this.currentPage = 1;
        },
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : '';
            const last = lastName ? lastName.charAt(0).toUpperCase() : '';
            return first + last || 'N/A';
        },
        getApplicationStatusColor(status) {
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
        getPaymentStatusColor(status) {
            const colors = {
                'paid': 'bg-green-100 text-green-800',
                'unpaid': 'bg-red-100 text-red-800',
                'partial': 'bg-yellow-100 text-yellow-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        formatStatus(status) {
            if (!status) return 'N/A';
            return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        },
        viewApplicant(applicant) {
            console.log('View applicant:', applicant);
            // This would navigate to applicant profile page
        },
        processApplication(applicant) {
            console.log('Process application:', applicant);
            // This would open application processing modal
        },
        updateStatus(applicant) {
            console.log('Update status:', applicant);
            // This would open status update modal
        },
        exportApplicants() {
            console.log('Export applicants');
            // This would generate and download an applicant report
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
    }
}
</script>
