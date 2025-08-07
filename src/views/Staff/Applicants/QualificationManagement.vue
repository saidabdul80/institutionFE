<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Page Header -->
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Qualification Management</h1>
                    <p class="text-gray-600 mt-2">Review and manage applicant qualification status</p>
                </div>
                <div class="flex items-center space-x-4">
                    <Button @click="showBulkQualifyDialog = true" 
                            :disabled="selectedApplicants.length === 0"
                            class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-check-circle mr-2"></i>
                        Bulk Qualify ({{ selectedApplicants.length }})
                    </Button>
                    <Button @click="showBulkDisqualifyDialog = true" 
                            :disabled="selectedApplicants.length === 0"
                            class="bg-red-500 hover:bg-red-600 text-white">
                        <i class="fa fa-times-circle mr-2"></i>
                        Bulk Disqualify ({{ selectedApplicants.length }})
                    </Button>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100">
                        <i class="fa fa-users text-blue-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Applicants</p>
                        <p class="text-2xl font-bold text-gray-900">{{ qualificationStats.total }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100">
                        <i class="fa fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Qualified</p>
                        <p class="text-2xl font-bold text-green-600">{{ qualificationStats.qualified }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-red-100">
                        <i class="fa fa-times-circle text-red-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Not Qualified</p>
                        <p class="text-2xl font-bold text-red-600">{{ qualificationStats.notQualified }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-yellow-100">
                        <i class="fa fa-clock text-yellow-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Pending Review</p>
                        <p class="text-2xl font-bold text-yellow-600">{{ qualificationStats.pending }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search Applicants</label>
                    <PInput
                        label=""
                        v-model="searchQuery"
                        placeholder="Search by name, email, or application number"
                        class="w-full"
                        fluid
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <PSelect
                        v-model="filters.programme_id"
                        :options="programmes"
                        option-value="id"
                        option-label="name"
                        placeholder="All Programmes"
                        class="w-full"
                        fluid
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Qualification Status</label>
                    <PSelect
                        v-model="filters.qualified_status"
                        :options="qualificationStatusOptions"
                        option-value="value"
                        option-label="label"
                        placeholder="All Statuses"
                        class="w-full"
                        fluid
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Score Range</label>
                    <PSelect
                        label=""
                        v-model="filters.jamb_range"
                        :options="jambRangeOptions"
                        option-value="value"
                        option-label="label"
                        placeholder="All Scores"
                        class="w-full"
                        fluid
                    />
                </div>
            </div>

            <div class="flex justify-between items-center mt-4">
                <div class="flex items-center space-x-4">
                    <Button @click="applyFilters" class="bg-blue-500 hover:bg-blue-600 text-white">
                        <i class="fa fa-search mr-2"></i>
                        Apply Filters
                    </Button>
                    <Button @click="clearFilters" class="bg-gray-500 hover:bg-gray-600 text-white">
                        <i class="fa fa-times mr-2"></i>
                        Clear Filters
                    </Button>
                </div>
                <div class="text-sm text-gray-600">
                    Showing {{ filteredApplicants.length }} of {{ applicants.length }} applicants
                </div>
            </div>
        </div>

        <!-- Applicants Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Table Header -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            v-model="allSelected"
                            @change="toggleSelectAll"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="text-sm font-medium text-gray-700">
                            {{ selectedApplicants.length }} selected
                        </span>
                    </div>
                    <div class="text-sm text-gray-600">
                        {{ paginatedApplicants.length }} applicants
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="ml-3 text-gray-600">Loading applicants...</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredApplicants.length === 0" class="text-center py-12">
                <i class="fa fa-users text-gray-400 text-4xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
                <p class="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>

            <!-- Table Content -->
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applicant
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Programme
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                JAMB Score
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Requirements
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="applicant in paginatedApplicants" :key="applicant.id"
                            :data-applicant-id="applicant.id"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <input
                                        type="checkbox"
                                        :value="applicant"
                                        v-model="selectedApplicants"
                                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                                    />
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-10 w-10">
                                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span class="text-sm font-medium text-blue-700">
                                                    {{ getInitials(applicant.first_name, applicant.surname) }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ applicant.first_name }} {{ applicant.surname }}
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                {{ applicant.email }}
                                            </div>
                                            <div class="text-xs text-gray-400">
                                                {{ applicant.application_number }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ applicant.programme_name }}</div>
                                <div class="text-sm text-gray-500">{{ applicant.programme_type }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium" :class="getJambScoreColor(Object.values(applicant?.jamb_subject_scores ||{}).reduce((a, b) => a + b, 0) )">
                                    {{ Object.values(applicant.jamb_subject_scores||{}).reduce((a, b) => a + b, 0) || 'N/A' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getQualificationStatusColor(applicant.qualified_status)"
                                      class="px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ formatQualificationStatus(applicant.qualified_status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center space-x-2">
                                    <span v-if="applicant.qualify?.is_qualify" 
                                          class="text-green-600 text-sm">
                                        <i class="fa fa-check-circle mr-1"></i>
                                        Met
                                    </span>
                                    <span v-else class="text-red-600 text-sm">
                                        <i class="fa fa-times-circle mr-1"></i>
                                        Not Met
                                    </span>
                                    <Button @click="viewRequirements(applicant)" 
                                            class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700">
                                        <i class="fa fa-eye mr-1"></i>
                                        View
                                    </Button>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex items-center space-x-2">
                                    <!-- <Button @click="viewApplicant(applicant)" 
                                            class="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                                        <i class="fa fa-eye mr-1"></i>
                                        View
                                    </Button> -->
                                    <Button v-if="applicant.qualified_status !== 'qualified'"
                                            @click="qualifyApplicant(applicant)" 
                                            class="bg-green-500 hover:bg-green-600 text-white text-xs">
                                        <i class="fa fa-check mr-1"></i>
                                        Qualify
                                    </Button>
                                    <Button v-if="applicant.qualified_status !== 'not_qualified'"
                                            @click="disqualifyApplicant(applicant)" 
                                            class="bg-red-500 hover:bg-red-600 text-white text-xs">
                                        <i class="fa fa-times mr-1"></i>
                                        Disqualify
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <Button @click="previousPage" :disabled="currentPage === 1" 
                                class="bg-gray-300 hover:bg-gray-400 text-gray-700">
                            Previous
                        </Button>
                        <Button @click="nextPage" :disabled="currentPage === totalPages" 
                                class="bg-gray-300 hover:bg-gray-400 text-gray-700">
                            Next
                        </Button>
                    </div>
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to 
                                {{ Math.min(currentPage * itemsPerPage, filteredApplicants.length) }} of 
                                {{ filteredApplicants.length }} results
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <Button @click="previousPage" :disabled="currentPage === 1" 
                                        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50">
                                    <i class="fa fa-chevron-left"></i>
                                </Button>
                                <Button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                        :class="page === currentPage 
                                            ? 'bg-blue-50 border-blue-500 text-blue-600' 
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                                        class="px-3 py-2 text-sm font-medium border">
                                    {{ page }}
                                </Button>
                                <Button @click="nextPage" :disabled="currentPage === totalPages" 
                                        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50">
                                    <i class="fa fa-chevron-right"></i>
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bulk Qualify Dialog -->
        <Dialog v-model:visible="showBulkQualifyDialog" modal header="Bulk Qualify Applicants" :style="{ width: '500px' }">
            <div class="space-y-4">
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Confirm Bulk Qualification</h4>
                    <p class="text-green-700 text-sm">
                        You are about to qualify {{ selectedApplicants.length }} applicant(s).
                        This action will mark them as qualified for admission consideration.
                    </p>
                </div>

                <div class="max-h-40 overflow-y-auto">
                    <h5 class="font-medium text-gray-800 mb-2">Selected Applicants:</h5>
                    <ul class="space-y-1">
                        <li v-for="applicant in selectedApplicants" :key="applicant.id"
                            class="text-sm text-gray-600 flex items-center">
                            <i class="fa fa-user mr-2 text-gray-400"></i>
                            {{ applicant.first_name }} {{ applicant.surname }} - {{ applicant.application_number }}
                        </li>
                    </ul>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="showBulkQualifyDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        Cancel
                    </Button>
                    <Button @click="bulkQualifyApplicants(); showBulkQualifyDialog = false"
                            class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-check mr-2"></i>
                        Qualify All
                    </Button>
                </div>
            </div>
        </Dialog>

        <!-- Bulk Disqualify Dialog -->
        <Dialog v-model:visible="showBulkDisqualifyDialog" modal header="Bulk Disqualify Applicants" :style="{ width: '500px' }">
            <div class="space-y-4">
                <div class="bg-red-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-red-800 mb-2">Confirm Bulk Disqualification</h4>
                    <p class="text-red-700 text-sm">
                        You are about to disqualify {{ selectedApplicants.length }} applicant(s).
                        This action will mark them as not qualified for admission.
                    </p>
                </div>

                <div class="max-h-40 overflow-y-auto">
                    <h5 class="font-medium text-gray-800 mb-2">Selected Applicants:</h5>
                    <ul class="space-y-1">
                        <li v-for="applicant in selectedApplicants" :key="applicant.id"
                            class="text-sm text-gray-600 flex items-center">
                            <i class="fa fa-user mr-2 text-gray-400"></i>
                            {{ applicant.first_name }} {{ applicant.surname }} - {{ applicant.application_number }}
                        </li>
                    </ul>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="showBulkDisqualifyDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        Cancel
                    </Button>
                    <Button @click="bulkDisqualifyApplicants(); showBulkDisqualifyDialog = false"
                            class="bg-red-500 hover:bg-red-600 text-white">
                        <i class="fa fa-times mr-2"></i>
                        Disqualify All
                    </Button>
                </div>
            </div>
        </Dialog>

        <!-- Requirements Dialog -->
        <Dialog v-model:visible="showRequirementsDialog" modal header="Admission Requirements" :style="{ width: '600px' }">
            <div v-if="selectedApplicantForRequirements" class="space-y-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Applicant Information</h4>
                    <div class="text-blue-700 text-sm">
                        <div><strong>Name:</strong> {{ selectedApplicantForRequirements.first_name }} {{ selectedApplicantForRequirements.surname }}</div>
                        <div><strong>Programme:</strong> {{ selectedApplicantForRequirements.programme_name }}</div>
                        <div><strong>JAMB Score:</strong> {{ selectedApplicantForRequirements.jamb_score || 'N/A' }}</div>
                    </div>
                </div>

                <div class="space-y-3">
                    <h5 class="font-medium text-gray-800">Admission Requirements Status:</h5>

                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="text-sm text-gray-700">Overall Qualification</span>
                        <span v-if="selectedApplicantForRequirements.qualify?.is_qualify"
                              class="text-green-600 font-semibold">
                            <i class="fa fa-check-circle mr-1"></i>
                            Qualified
                        </span>
                        <span v-else class="text-red-600 font-semibold">
                            <i class="fa fa-times-circle mr-1"></i>
                            Not Qualified
                        </span>
                    </div>

                    <div class="p-3 bg-gray-50 rounded-lg">
                        <span class="text-sm text-gray-700">
                            <strong>Details:</strong> {{ selectedApplicantForRequirements.qualify?.info || 'No additional information available' }}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-700">
                                <strong>JAMB Score:</strong> {{Object.values(selectedApplicantForRequirements.jamb_subject_scores).reduce((a, b) => a + b, 0) || 'N/A' }}
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                Required: Check programme requirements
                            </div>
                        </div>

                        <div class="p-3 bg-gray-50 rounded-lg">
                            <div class="text-sm text-gray-700">
                                <strong>O'Level Results:</strong>
                                <span @click="toggle" class="cursor-pointer text-blue-600">View Details</span>
                                 <Popover  ref="op" >

                                        <div v-for="olevel in selectedApplicantForRequirements.olevel" >
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">{{ olevel.exam_type }} - {{olevel.month }}/{{ olevel.year}}</div>
                                                <div class="text-sm text-gray-500">Ex No:
                                                    {{ olevel.examination_number }}
                                                    <CopyButton :text="olevel.examination_number" class="ml-1" />
                                                </div>
                                                <div v-if="olevel.pin || olevel.serial_number" class="text-xs text-gray-500 mt-1">
                                                    <span v-if="olevel.pin">PIN: {{ olevel.pin }}</span>
                                                    <span v-if="olevel.pin && olevel.serial_number"> | </span>
                                                    <span v-if="olevel.serial_number">Serial: {{ olevel.serial_number }}</span>
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-2 md:grid-cols-3  gap-1">
                                                <div v-for="(grade, subject) in olevel.subjects_grades" :key="subject"
                                                    class="bg-white rounded px-3 py-2 text-sm">
                                                    <span class="font-medium">{{ subject }}:</span>
                                                    <span class="ml-1 text-blue-600 font-semibold">{{ grade }}</span>
                                                </div>
                                            </div>
                                        </div>

                                </Popover>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                Required {{ selectedApplicantForRequirements.programme?.subjects.join(',') }} credits with any other 3 subjects
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="showRequirementsDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        Close
                    </Button>
                    <Button v-if="selectedApplicantForRequirements.qualified_status !== 'qualified'"
                            @click="qualifyApplicant(selectedApplicantForRequirements); showRequirementsDialog = false"
                            class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-check mr-2"></i>
                        Qualify
                    </Button>
                    <Button v-if="selectedApplicantForRequirements.qualified_status !== 'not_qualified'"
                            @click="disqualifyApplicant(selectedApplicantForRequirements); showRequirementsDialog = false"
                            class="bg-red-500 hover:bg-red-600 text-white">
                        <i class="fa fa-times mr-2"></i>
                        Disqualify
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post } from "@/api/client";
import { userDataMixin } from "@/mixins/userDataMixin";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import PInput from "@/components/PInput.vue";
import PSelect from "@/components/PSelect.vue";
import Popover from "primevue/popover";
import CopyButton from "@/components/CopyButton.vue";

export default {
    name: "QualificationManagement",
    mixins: [userDataMixin],
    components: {
        Button,
        Dialog,
        PInput,
        PSelect,
        Popover,
        CopyButton
    },
    data() {
        return {
            loading: false,
            searchQuery: "",
            currentPage: 1,
            itemsPerPage: 25,
            allSelected: false,
            selectedApplicants: [],
            
            // Filters
            filters: {
                programme_id: "",
                qualified_status: "",
                jamb_range: ""
            },
            
            // Data
            applicants: [],
            programmes: [],
            qualificationStats: {
                total: 0,
                qualified: 0,
                notQualified: 0,
                pending: 0
            },
            
            // Options
            qualificationStatusOptions: [
                { value: "", label: "All Statuses" },
                { value: "qualified", label: "Qualified" },
                { value: "not_qualified", label: "Not Qualified" },
                { value: "pending", label: "Pending Review" },
                { value: "under_review", label: "Under Review" }
            ],

            // Auto-selection tracking
            autoSelectionProcessed: false,
            
            jambRangeOptions: [
                { value: "", label: "All Scores" },
                { value: "300-400", label: "300-400" },
                { value: "250-299", label: "250-299" },
                { value: "200-249", label: "200-249" },
                { value: "150-199", label: "150-199" },
                { value: "0-149", label: "Below 150" }
            ],
            
            // Dialogs
            showBulkQualifyDialog: false,
            showBulkDisqualifyDialog: false,
            showRequirementsDialog: false,
            selectedApplicantForRequirements: null
        };
    },

    computed: {
        currentSessionId() {
            return this.$globals.getConfiguration('current_session') || 1;
        },

        filteredApplicants() {
            let filtered = [...this.applicants];

            // Search filter
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(applicant =>
                    applicant.first_name?.toLowerCase().includes(query) ||
                    applicant.surname?.toLowerCase().includes(query) ||
                    applicant.email?.toLowerCase().includes(query) ||
                    applicant.application_number?.toLowerCase().includes(query)
                );
            }

            // Programme filter
            if (this.filters.programme_id) {
                filtered = filtered.filter(applicant =>
                    applicant.applied_programme_curriculum_id == this.filters.programme_id
                );
            }

            // Qualification status filter
            if (this.filters.qualified_status) {
                filtered = filtered.filter(applicant =>
                    applicant.qualified_status === this.filters.qualified_status
                );
            }

            // JAMB score range filter
            if (this.filters.jamb_range) {
                const [min, max] = this.filters.jamb_range.split('-').map(Number);
                filtered = filtered.filter(applicant => {
                    const score = parseFloat(applicant.jamb_score);
                    if (isNaN(score)) return false;
                    return score >= min && score <= max;
                });
            }

            return filtered;
        },

        paginatedApplicants() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredApplicants.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredApplicants.length / this.itemsPerPage);
        },

        visiblePages() {
            const pages = [];
            const total = this.totalPages;
            const current = this.currentPage;

            if (total <= 7) {
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                if (current <= 4) {
                    for (let i = 1; i <= 5; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(total);
                } else if (current >= total - 3) {
                    pages.push(1);
                    pages.push('...');
                    for (let i = total - 4; i <= total; i++) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);
                    pages.push('...');
                    for (let i = current - 1; i <= current + 1; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(total);
                }
            }

            return pages;
        }
    },

    methods: {
        toggle(event) {
            this.$refs.op.toggle(event);
        },
        async loadApplicants() {
            try {
                this.loading = true;
                const response = await post(this.$endpoints.staff.getApplicants.url, {
                    application_fee_paid:1,
                    paginateBy: 1000, // Load all for client-side filtering
                    mode: 1,
                    search: {},
                    session_id: this.currentSessionId
                });

                if (response && response.data) {
                    this.applicants = response.data.data || response.data;
                    this.updateQualificationStats();
                }
            } catch (error) {
                console.error("Error loading applicants:", error);
                this.$globals.message = {
                    text: "Error loading applicants. Please try again.",
                    type: "error"
                };
            } finally {
                this.loading = false;
            }
        },

        async loadProgrammes() {
            try {
                const response = await get(this.$endpoints.staff.getAllPrograms.url);
                if (response && response.data) {
                    this.programmes = response.data;
                }
            } catch (error) {
                console.error("Error loading programmes:", error);
            }
        },

        updateQualificationStats() {
            this.qualificationStats = {
                total: this.applicants.length,
                qualified: this.applicants.filter(app => app.qualified_status === 'qualified').length,
                notQualified: this.applicants.filter(app => app.qualified_status === 'not_qualified').length,
                pending: this.applicants.filter(app => !app.qualified_status || app.qualified_status === 'pending').length
            };
        },

        // Filter Methods
        applyFilters() {
            this.currentPage = 1;
            // Filters are applied automatically through computed property
        },

        clearFilters() {
            this.filters = {
                programme_id: "",
                qualified_status: "",
                jamb_range: ""
            };
            this.searchQuery = "";
            this.currentPage = 1;
        },

        // Selection Methods
        toggleSelectAll() {
            if (this.allSelected) {
                this.selectedApplicants = [...this.paginatedApplicants];
            } else {
                this.selectedApplicants = [];
            }
        },

        // Qualification Methods
        async qualifyApplicant(applicant) {
            try {
                const response = await post(this.$endpoints.staff.updateQualifiedStatus.url, {
                    applicant_ids: [applicant.id],
                    status: 'qualified',
                    notes: 'Qualified by staff review',
                    session_id: this.currentSessionId
                });

                if (response && !response.error) {
                    // Update local data
                    const index = this.applicants.findIndex(app => app.id === applicant.id);
                    if (index !== -1) {
                        this.applicants[index].qualified_status = 'qualified';
                    }

                    this.updateQualificationStats();

                    this.$globals.message = {
                        text: `${applicant.first_name} ${applicant.surname} has been qualified successfully!`,
                        type: "success"
                    };
                } else {
                    this.$globals.message = {
                        text: response?.message || "Failed to qualify applicant. Please try again.",
                        type: "error"
                    };
                }
            } catch (error) {
                console.error("Error qualifying applicant:", error);
                this.$globals.message = {
                    text: "An error occurred while qualifying the applicant. Please try again.",
                    type: "error"
                };
            }
        },

        async disqualifyApplicant(applicant) {
            try {
                const response = await post(this.$endpoints.staff.updateQualifiedStatus.url, {
                    applicant_ids: [applicant.id],
                    status: 'not_qualified',
                    notes: 'Not qualified by staff review',
                    session_id: this.currentSessionId
                });

                if (response && !response.error) {
                    // Update local data
                    const index = this.applicants.findIndex(app => app.id === applicant.id);
                    if (index !== -1) {
                        this.applicants[index].qualified_status = 'not_qualified';
                    }

                    this.updateQualificationStats();

                    this.$globals.message = {
                        text: `${applicant.first_name} ${applicant.surname} has been disqualified.`,
                        type: "success"
                    };
                } else {
                    this.$globals.message = {
                        text: response?.message || "Failed to disqualify applicant. Please try again.",
                        type: "error"
                    };
                }
            } catch (error) {
                console.error("Error disqualifying applicant:", error);
                this.$globals.message = {
                    text: "An error occurred while disqualifying the applicant. Please try again.",
                    type: "error"
                };
            }
        },

        // Bulk Operations
        async bulkQualifyApplicants() {
            if (this.selectedApplicants.length === 0) return;

            try {
                const response = await post(this.$endpoints.staff.updateQualifiedStatus.url, {
                    applicant_ids: this.selectedApplicants.map(app => app.id),
                    qualified_status: 'qualified',
                    notes: 'Bulk qualified by staff review',
                    session_id: this.currentSessionId
                });

                if (response && !response.error) {
                    // Update local data
                    this.selectedApplicants.forEach(selectedApp => {
                        const index = this.applicants.findIndex(app => app.id === selectedApp.id);
                        if (index !== -1) {
                            this.applicants[index].qualified_status = 'qualified';
                        }
                    });

                    this.updateQualificationStats();
                    this.selectedApplicants = [];
                    this.allSelected = false;

                    this.$globals.message = {
                        text: `Successfully qualified ${this.selectedApplicants.length} applicant(s)!`,
                        type: "success"
                    };
                } else {
                    this.$globals.message = {
                        text: response?.message || "Failed to qualify applicants. Please try again.",
                        type: "error"
                    };
                }
            } catch (error) {
                console.error("Error bulk qualifying applicants:", error);
                this.$globals.message = {
                    text: "An error occurred during bulk qualification. Please try again.",
                    type: "error"
                };
            }
        },

        async bulkDisqualifyApplicants() {
            if (this.selectedApplicants.length === 0) return;

            try {
                const response = await post(this.$endpoints.staff.updateQualifiedStatus.url, {
                    applicant_ids: this.selectedApplicants.map(app => app.id),
                    qualified_status: 'not_qualified',
                    notes: 'Bulk disqualified by staff review',
                    session_id: this.currentSessionId
                });

                if (response && !response.error) {
                    // Update local data
                    this.selectedApplicants.forEach(selectedApp => {
                        const index = this.applicants.findIndex(app => app.id === selectedApp.id);
                        if (index !== -1) {
                            this.applicants[index].qualified_status = 'not_qualified';
                        }
                    });

                    this.updateQualificationStats();
                    this.selectedApplicants = [];
                    this.allSelected = false;

                    this.$globals.message = {
                        text: `Successfully disqualified ${this.selectedApplicants.length} applicant(s)!`,
                        type: "success"
                    };
                } else {
                    this.$globals.message = {
                        text: response?.message || "Failed to disqualify applicants. Please try again.",
                        type: "error"
                    };
                }
            } catch (error) {
                console.error("Error bulk disqualifying applicants:", error);
                this.$globals.message = {
                    text: "An error occurred during bulk disqualification. Please try again.",
                    type: "error"
                };
            }
        },

        // View Methods
        viewApplicant(applicant) {
            // Navigate to applicant details or open modal
            this.$router.push({
                name: 'applicant-details',
                params: { id: applicant.id }
            });
        },

        viewRequirements(applicant) {
            this.selectedApplicantForRequirements = applicant;
            this.showRequirementsDialog = true;
        },

        // Utility Methods
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : "";
            const last = lastName ? lastName.charAt(0).toUpperCase() : "";
            return first + last || "N/A";
        },

        getJambScoreColor(score) {
            const numScore = parseFloat(score);
            if (isNaN(numScore)) return 'text-gray-500';
            if (numScore >= 300) return 'text-green-600 font-bold';
            if (numScore >= 250) return 'text-blue-600 font-bold';
            if (numScore >= 200) return 'text-yellow-600 font-bold';
            return 'text-red-600 font-bold';
        },

        getQualificationStatusColor(status) {
            const colors = {
                'qualified': 'bg-green-100 text-green-800',
                'not_qualified': 'bg-red-100 text-red-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'under_review': 'bg-blue-100 text-blue-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },

        formatQualificationStatus(status) {
            const statuses = {
                'qualified': 'Qualified',
                'not_qualified': 'Not Qualified',
                'pending': 'Pending',
                'under_review': 'Under Review'
            };
            return statuses[status] || 'Pending';
        },

        // Pagination Methods
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
            if (typeof page === 'number') {
                this.currentPage = page;
            }
        },
        async handleAutoSelection() {
            const applicantId = this.$route.query.applicant_id;
            const autoSelect = this.$route.query.auto_select;
            if(applicantId){

                const res = await get(this.$endpoints.staff.getApplicantById.url+applicantId,false,true, true)
                if(res){
                    this.selectedApplicants = [res];
                    this.viewRequirements(res) 
                    
                }
            }
        }
    },

    watch: {
        // Watch for applicants data to be loaded for auto-selection
        applicants: {
            handler(newApplicants) {
                if (newApplicants && newApplicants.length > 0) {
                    // Check if we have pending auto-selection
                    const applicantId = this.$route.query.applicant_id;
                    const autoSelect = this.$route.query.auto_select;

                    if (applicantId && autoSelect === 'true') {
                        this.$nextTick(() => {
                            this.handleAutoSelection();
                        });
                    }
                }
            },
            immediate: false
        },
        showRequirementsDialog: {
            handler(newValue, oldValue) {
                if (!newValue) {
                    this.selectedApplicantForRequirements = null;
                    this.selectedApplicants = [];
                }
            }
        }
    },

    async mounted() {
        await Promise.all([
            this.loadApplicants(),
            this.loadProgrammes()
        ]);

        // Check if we need to auto-select an applicant
        this.handleAutoSelection();
    },

      
};
</script>

<style scoped>
/* Custom animations and transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* Button hover effects */
.p-button {
    transition: all 0.3s ease;
}

.p-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Table row hover effects */
.hover\\:bg-gray-50:hover {
    background-color: #f9fafb;
    transition: background-color 0.2s ease;
}

/* Loading animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Status badge animations */
.status-badge {
    transition: all 0.2s ease;
}

.status-badge:hover {
    transform: scale(1.05);
}

/* Card hover effects */
.bg-white:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease;
}

/* Responsive improvements */
@media (max-width: 768px) {
    .grid-cols-1.md\\:grid-cols-4 {
        grid-template-columns: 1fr;
    }

    .hidden.sm\\:flex {
        display: none;
    }

    .sm\\:hidden {
        display: block;
    }
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

/* Pagination button styling */
nav button {
    transition: all 0.2s ease;
}

nav button:hover:not(:disabled) {
    background-color: #f3f4f6;
    transform: translateY(-1px);
}

nav button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
