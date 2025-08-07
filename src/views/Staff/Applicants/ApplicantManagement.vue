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
                                <span class="font-medium">{{ Object.values(applicant.jamb_subject_scores ||{}).reduce((a, b) => a + b, 0) || 'N/A' }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getApplicationStatusColor(applicant.qualified_status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ formatStatus(applicant.qualified_status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getPaymentStatusColor(applicant.application_fee)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ formatStatus(applicant.application_fee) }}
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

        <!-- Applicant Details Modal -->
        <Dialog v-model:visible="showApplicantDetailsModal"
                :style="{ width: '90vw', maxWidth: '1200px' }"
                header="Applicant Details"
                :modal="true"
                class="p-fluid">

            <div v-if="loadingDetails" class="flex justify-center items-center py-8">
                <i class="fa fa-spinner fa-spin text-2xl text-blue-500"></i>
                <span class="ml-2">Loading applicant details...</span>
            </div>

            <div v-else-if="selectedApplicant" class="space-y-6">
                <!-- Personal Information -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-600">Full Name</label>
                            <p class="text-gray-900">{{ selectedApplicant.full_name || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Email</label>
                            <p class="text-gray-900">{{ selectedApplicant.email || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Phone Number</label>
                            <p class="text-gray-900">{{ selectedApplicant.phone_number || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">JAMB Number</label>
                            <p class="text-gray-900">{{ selectedApplicant.jamb_number || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Gender</label>
                            <p class="text-gray-900">{{ selectedApplicant.gender || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Date of Birth</label>
                            <p class="text-gray-900">{{ selectedApplicant.date_of_birth || 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Academic Information -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-600">Applied Programme</label>
                            <p class="text-gray-900">{{ selectedApplicant.programme_name || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Programme Type</label>
                            <p class="text-gray-900">{{ selectedApplicant.programme_type || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Faculty</label>
                            <p class="text-gray-900">{{ selectedApplicant.faculty || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Department</label>
                            <p class="text-gray-900">{{ selectedApplicant.department || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Entry Mode</label>
                            <p class="text-gray-900">{{ selectedApplicant.entry_mode || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Previous Qualification</label>
                            <p class="text-gray-900">{{ selectedApplicant.qualification || 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Status Information -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-600">Application Status</label>
                            <span :class="getStatusClass(selectedApplicant.application_status)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {{ formatStatus(selectedApplicant.application_status) }}
                            </span>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Qualification Status</label>
                            <span :class="getQualificationStatusClass(selectedApplicant.qualified_status)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {{ formatQualificationStatus(selectedApplicant.qualified_status) }}
                            </span>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Admission Status</label>
                            <span :class="getAdmissionStatusClass(selectedApplicant.admission_status)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {{ formatAdmissionStatus(selectedApplicant.admission_status) }}
                            </span>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-600">Payment Status</label>
                            <span :class="getPaymentStatusClass(selectedApplicant.application_fee_paid)"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {{ selectedApplicant.application_fee_paid ? 'Paid' : 'Unpaid' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- JAMB Scores (if available) -->
                <div v-if="selectedApplicant.jamb_subject_scores" class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">JAMB Subject Scores</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div v-for="(score, subject) in selectedApplicant.jamb_subject_scores" :key="subject">
                            <label class="text-sm font-medium text-gray-600">{{ subject }}</label>
                            <p class="text-gray-900 font-semibold">{{ score }}</p>
                        </div>
                    </div>
                </div>

                <!-- O-Level Results (if available) -->
                <div v-if="selectedApplicant.olevel && selectedApplicant.olevel.length > 0" class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">O-Level Results</h3>
                    <div class="space-y-4">
                        <div v-for="(olevel, index) in selectedApplicant.olevel" :key="index"
                             class="bg-white rounded-lg p-4 border border-gray-200">
                            <div class="mb-3">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-semibold text-gray-800">{{ olevel.exam_type }}</h4>
                                    <span class="text-sm text-gray-500">{{ olevel.month }}/{{ olevel.year }}</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <span class="font-medium">Exam Number:</span> {{ olevel.examination_number }}
                                </div>
                                <div v-if="olevel.pin || olevel.serial_number" class="text-xs text-gray-500 mt-1">
                                    <span v-if="olevel.pin" class="font-medium">PIN:</span>
                                    <span v-if="olevel.pin">{{ olevel.pin }}</span>
                                    <span v-if="olevel.pin && olevel.serial_number"> | </span>
                                    <span v-if="olevel.serial_number" class="font-medium">Serial:</span>
                                    <span v-if="olevel.serial_number">{{ olevel.serial_number }}</span>
                                </div>
                            </div>

                            <!-- Subjects and Grades -->
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                <div v-for="(grade, subject) in olevel.subjects_grades" :key="subject"
                                     class="bg-gray-50 rounded px-3 py-2 text-sm">
                                    <span class="font-medium">{{ subject }}:</span>
                                    <span class="ml-1 text-blue-600 font-semibold">{{ grade }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4 border-t">
                    <Button label="Process Application"
                            icon="fa fa-cogs"
                            @click="processApplication(selectedApplicant); showApplicantDetailsModal = false"
                            class="p-button-primary" />
                    <Button label="Close"
                            icon="fa fa-times"
                            @click="showApplicantDetailsModal = false"
                            class="p-button-secondary" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    components: {
        Dialog,
        Button
    },
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
            },
            // Modal data
            showApplicantDetailsModal: false,
            selectedApplicant: null,
            applicantDetails: null,
            loadingDetails: false
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
            this.selectedApplicant = applicant;
            this.showApplicantDetailsModal = true;
        },

        processApplication(applicant) {
            console.log('Process application:', applicant);

            // Check qualification status to determine where to navigate
            const qualificationStatus = applicant.qualified_status || applicant.qualification_status;

            console.log('ApplicantManagement - processApplication', {
                applicantId: applicant.id,
                applicantName: applicant.full_name || applicant.first_name + ' ' + applicant.surname,
                qualificationStatus: qualificationStatus,
                navigatingTo: qualificationStatus === 'qualified' ? 'admission' : 'qualification'
            });

            if (qualificationStatus === 'not_qualified' || qualificationStatus === 'pending' || !qualificationStatus) {
                // Navigate to qualification page and auto-select this applicant
                console.log('Navigating to qualification page with applicant ID:', applicant.id);
                this.$router.push({
                    name: 'staff-qualification',
                    query: {
                        applicant_id: applicant.id,
                        auto_select: 'true'
                    }
                });
            } else if (qualificationStatus === 'qualified') {
                // Navigate to admission page and auto-select this applicant
                console.log('Navigating to admission page with applicant ID:', applicant.id);
                this.$router.push({
                    name: 'staff-admission',
                    query: {
                        applicant_id: applicant.id,
                        auto_select: 'true'
                    }
                });
            } else {
                // Default to qualification page for review
                console.log('Defaulting to qualification page with applicant ID:', applicant.id);
                this.$router.push({
                    name: 'staff-qualification',
                    query: {
                        applicant_id: applicant.id,
                        auto_select: 'true'
                    }
                });
            }
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
        },

        // Status formatting methods
        formatStatus(status) {
            const statuses = {
                'submitted': 'Submitted',
                'under_review': 'Under Review',
                'approved': 'Approved',
                'rejected': 'Rejected',
                'pending': 'Pending'
            };
            return statuses[status] || status || 'Pending';
        },

        formatQualificationStatus(status) {
            const statuses = {
                'qualified': 'Qualified',
                'not_qualified': 'Not Qualified',
                'pending': 'Pending Review',
                'under_review': 'Under Review'
            };
            return statuses[status] || status || 'Pending';
        },

        formatAdmissionStatus(status) {
            const statuses = {
                'admitted': 'Admitted',
                'not_admitted': 'Not Admitted',
                'pending': 'Pending',
                'rejected': 'Rejected'
            };
            return statuses[status] || status || 'Pending';
        },

        // Status styling methods
        getStatusClass(status) {
            const classes = {
                'submitted': 'bg-blue-100 text-blue-800',
                'under_review': 'bg-yellow-100 text-yellow-800',
                'approved': 'bg-green-100 text-green-800',
                'rejected': 'bg-red-100 text-red-800',
                'pending': 'bg-gray-100 text-gray-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        },

        getQualificationStatusClass(status) {
            const classes = {
                'qualified': 'bg-green-100 text-green-800',
                'not_qualified': 'bg-red-100 text-red-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'under_review': 'bg-blue-100 text-blue-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        },

        getAdmissionStatusClass(status) {
            const classes = {
                'admitted': 'bg-green-100 text-green-800',
                'not_admitted': 'bg-red-100 text-red-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'rejected': 'bg-red-100 text-red-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        },

        getPaymentStatusClass(isPaid) {
            return isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        }
    },
    async mounted() {
        await this.loadInitialData();
    }
}
</script>
