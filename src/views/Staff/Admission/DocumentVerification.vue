<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Document Verification</h1>
                <p class="text-gray-600">Review and verify applicant documents for admission processing</p>
            </div>
            <div class="flex items-center gap-3">
                <Button 
                    icon="fa fa-refresh" 
                    label="Refresh" 
                    outlined 
                    @click="loadApplicants" 
                    :loading="loading" />
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <InputText 
                        v-model="filters.search" 
                        placeholder="Search by name, application number..."
                        @input="debouncedSearch" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <Select 
                        v-model="filters.programme_id" 
                        :options="programmes" 
                        optionLabel="name" 
                        optionValue="id"
                        placeholder="All Programmes"
                        @change="loadApplicants" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                    <Select 
                        v-model="filters.verification_status" 
                        :options="verificationStatuses" 
                        optionLabel="label" 
                        optionValue="value"
                        placeholder="All Statuses"
                        @change="loadApplicants" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <Select 
                        v-model="filters.session_id" 
                        :options="sessions" 
                        optionLabel="name" 
                        optionValue="id"
                        placeholder="Current Session"
                        @change="loadApplicants" />
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100">
                        <i class="fa fa-users text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Pending Verification</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.pending || 0 }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100">
                        <i class="fa fa-check-circle text-green-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Verified</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.verified || 0 }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-yellow-100">
                        <i class="fa fa-clock text-yellow-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Under Review</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.under_review || 0 }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm border p-4">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-red-100">
                        <i class="fa fa-times-circle text-red-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Rejected</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.rejected || 0 }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Applicants Table -->
        <div class="bg-white rounded-lg shadow-sm border">
            <DataTable 
                :value="applicants.data" 
                :loading="loading"
                :paginator="true"
                :rows="applicants.per_page"
                :totalRecords="applicants.total"
                :lazy="true"
                @page="onPageChange"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                responsiveLayout="scroll"
                class="p-datatable-sm">
                
                <Column field="application_number" header="Application No." style="min-width: 150px">
                    <template #body="slotProps">
                        <div class="font-mono text-sm">{{ slotProps.data.application_number }}</div>
                    </template>
                </Column>

                <Column field="full_name" header="Applicant Name" style="min-width: 200px">
                    <template #body="slotProps">
                        <div>
                            <div class="font-medium">{{ slotProps.data.full_name }}</div>
                            <div class="text-sm text-gray-500">{{ slotProps.data.email }}</div>
                        </div>
                    </template>
                </Column>

                <Column field="programme_name" header="Programme" style="min-width: 200px">
                    <template #body="slotProps">
                        <div class="text-sm">{{ slotProps.data.programme_name }}</div>
                    </template>
                </Column>

                <Column field="acceptance_fee_status" header="Acceptance Fee" style="min-width: 120px">
                    <template #body="slotProps">
                        <Tag 
                            :value="slotProps.data.acceptance_fee_paid ? 'PAID' : 'UNPAID'"
                            :severity="slotProps.data.acceptance_fee_paid ? 'success' : 'danger'"
                            class="text-xs" />
                    </template>
                </Column>

                <Column field="verification_status" header="Verification Status" style="min-width: 150px">
                    <template #body="slotProps">
                        <Tag 
                            :value="getVerificationStatusLabel(slotProps.data.verification_status)"
                            :severity="getVerificationStatusSeverity(slotProps.data.verification_status)"
                            class="text-xs" />
                    </template>
                </Column>

                <Column field="documents_count" header="Documents" style="min-width: 100px">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <i class="fa fa-file-alt text-gray-400"></i>
                            <span class="text-sm">{{ slotProps.data.documents_count || 0 }}</span>
                        </div>
                    </template>
                </Column>

                <Column header="Actions" style="min-width: 200px">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <Button 
                                icon="fa fa-eye" 
                                size="small" 
                                outlined 
                                severity="info"
                                v-tooltip.top="'View Documents'"
                                @click="viewDocuments(slotProps.data)" />
                            <Button 
                                icon="fa fa-check" 
                                size="small" 
                                outlined 
                                severity="success"
                                v-tooltip.top="'Verify Documents'"
                                @click="verifyDocuments(slotProps.data)"
                                :disabled="!slotProps.data.acceptance_fee_paid" />
                            <Button 
                                icon="fa fa-certificate" 
                                size="small" 
                                outlined 
                                severity="warning"
                                v-tooltip.top="'Issue Admission Letter'"
                                @click="issueAdmissionLetter(slotProps.data)"
                                :disabled="slotProps.data.verification_status !== 'verified'" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Document Viewer Modal -->
        <Dialog 
            header="Document Verification" 
            v-model:visible="showDocumentModal" 
            class="w-[90%] max-w-6xl" 
            :modal="true">
            <DocumentViewer 
                v-if="selectedApplicant"
                :applicant="selectedApplicant"
                @document-verified="onDocumentVerified"
                @verification-completed="onVerificationCompleted" />
        </Dialog>

        <!-- Admission Letter Preview Modal -->
        <Dialog 
            header="Issue Admission Letter" 
            v-model:visible="showAdmissionLetterModal" 
            class="w-[80%] max-w-4xl" 
            :modal="true">
            <AdmissionLetterPreview 
                v-if="selectedApplicant"
                :applicant="selectedApplicant"
                @letter-issued="onAdmissionLetterIssued" />
        </Dialog>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import DocumentViewer from './DocumentViewer.vue';
import AdmissionLetterPreview from './AdmissionLetterPreview.vue';
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';


export default {
    name: 'DocumentVerification',
    mixins:[schoolInfoMixin],
    components: {
        Button,
        InputText,
        Select,
        DataTable,
        Column,

        Dialog,
        DocumentViewer,
        AdmissionLetterPreview
    },
    data() {
        return {
            loading: false,
            applicants: {
                data: [],
                total: 0,
                per_page: 20,
                current_page: 1
            },
            stats: {},
            programmes: [],
            sessions: [],
            filters: {
                search: '',
                programme_id: null,
                verification_status: null,
                session_id: null
            },
            verificationStatuses: [
                { label: 'Pending', value: 'pending' },
                { label: 'Under Review', value: 'under_review' },
                { label: 'Verified', value: 'verified' },
                { label: 'Rejected', value: 'rejected' }
            ],
            selectedApplicant: null,
            showDocumentModal: false,
            showAdmissionLetterModal: false,
            searchTimeout: null
        }
    },
    mounted() {
        this.loadInitialData();
    },
    methods: {
        async loadInitialData() {
            await Promise.all([
                this.loadApplicants(),
                this.loadStats()
            ]);

            this.sessions = this.schoolSessions; 
            this.programmes = this.schoolProgrammes;
        },

        async loadApplicants(page = 1) {
            this.loading = true;
            try {
              const params = new URLSearchParams();

                params.append('page', page);
                params.append('per_page', this.applicants.per_page);
                params.append('admission_status', 'admitted');
                params.append('acceptance_fee_required', 'true');

                // Append filters (if this.filters is an object)
                for (const key in this.filters) {
                if (this.filters[key] !== undefined && this.filters[key] !== null) {
                    params.append(key, this.filters[key]);
                }
                }
                const response = await get(this.$endpoints.staff.getDocumentVerificationApplicants.url+'?'+params);
                
                if (response && !response.error) {
                    this.applicants = response;
                }
            } catch (error) {
                console.error('Error loading applicants:', error);
                this.$globals.showMessage('Failed to load applicants', 'error');
            } finally {
                this.loading = false;
            }
        },

        async loadStats() {
            try {
                const response = await get(this.$endpoints.staff.getVerificationStats.url);
                if (response && !response.error) {
                    this.stats = response;
                }
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        },

        debouncedSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.loadApplicants();
            }, 500);
        },

        onPageChange(event) {
            this.loadApplicants(event.page + 1);
        },

        viewDocuments(applicant) {
            this.selectedApplicant = applicant;
            this.showDocumentModal = true;
        },

        verifyDocuments(applicant) {
            this.selectedApplicant = applicant;
            this.showDocumentModal = true;
        },

        issueAdmissionLetter(applicant) {
            this.selectedApplicant = applicant;
            this.showAdmissionLetterModal = true;
        },

        onDocumentVerified() {
            // Refresh the current applicant data
            this.loadApplicants(this.applicants.current_page);
            this.loadStats();
        },

        onVerificationCompleted() {
            this.showDocumentModal = false;
            this.loadApplicants(this.applicants.current_page);
            this.loadStats();
        },

        onAdmissionLetterIssued() {
            this.showAdmissionLetterModal = false;
            this.loadApplicants(this.applicants.current_page);
            this.loadStats();
        },

        getVerificationStatusLabel(status) {
            const statusMap = {
                'pending': 'Pending',
                'under_review': 'Under Review',
                'verified': 'Verified',
                'rejected': 'Rejected'
            };
            return statusMap[status] || 'Unknown';
        },

        getVerificationStatusSeverity(status) {
            const severityMap = {
                'pending': 'warning',
                'under_review': 'info',
                'verified': 'success',
                'rejected': 'danger'
            };
            return severityMap[status] || 'secondary';
        }
    }
}
</script>
