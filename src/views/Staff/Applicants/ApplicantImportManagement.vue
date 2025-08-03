<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Page Header -->
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">UTME Applicants Import Management</h1>
                    <p class="text-gray-600 mt-2">Import applicants from Excel files with validation and tracking</p>
                </div>
                <div class="flex items-center space-x-4">
                    <Button @click="downloadTemplate" class="bg-blue-500 hover:bg-blue-600 text-white">
                        <i class="fa fa-download mr-2"></i>
                        Download Template
                    </Button>
                    <Button @click="showImportDialog = true" class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-upload mr-2"></i>
                        Import Applicants
                    </Button>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100">
                        <i class="fa fa-upload text-blue-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Total Imports</p>
                        <p class="text-2xl font-bold text-gray-900">{{ importStats.totalImports }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100">
                        <i class="fa fa-users text-green-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Imported Applicants</p>
                        <p class="text-2xl font-bold text-green-600">{{ importStats.totalApplicants }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-yellow-100">
                        <i class="fa fa-credit-card text-yellow-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Fee Paid</p>
                        <p class="text-2xl font-bold text-yellow-600">{{ importStats.feePaidCount }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-red-100">
                        <i class="fa fa-exclamation-triangle text-red-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Fee Pending</p>
                        <p class="text-2xl font-bold text-red-600">{{ importStats.feePendingCount }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Import History -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">Import History</h3>
                    <Button @click="loadImportHistory" class="bg-gray-500 hover:bg-gray-600 text-white text-sm">
                        <i class="fa fa-refresh mr-2"></i>
                        Refresh
                    </Button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="ml-3 text-gray-600">Loading import history...</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="importHistory.length === 0" class="text-center py-12">
                <i class="fa fa-upload text-gray-400 text-4xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No imports found</h3>
                <p class="text-gray-600">Start by importing your first batch of applicants.</p>
            </div>

            <!-- Import History Table -->
            <div v-else>
                <Table
                    :headers="importHistoryHeaders"
                    :paginationData="importHistoryPagination"
                    :loading="false"
                    :showPagination="true"
                    @row-click="viewImportDetails"
                    @page-change="handlePageChange"
                    @page-length="handlePageLength">

                    <!-- Batch ID Column -->
                    <template #td-import_batch_id="{ row }">
                        <div class="text-sm font-medium text-gray-900">
                            {{ row.import_batch_id }}
                        </div>
                    </template>

                    <!-- Import Date Column -->
                    <template #td-imported_at="{ row }">
                        <div class="text-sm text-gray-900">
                            {{ formatDate(row.imported_at) }}
                        </div>
                    </template>

                    <!-- Total Imported Column -->
                    <template #td-total_imported="{ row }">
                        <div class="text-sm font-medium text-gray-900">
                            {{ row.total_imported }}
                        </div>
                    </template>

                    <!-- Fee Paid Column -->
                    <template #td-fee_paid="{ row }">
                        <div class="text-sm text-gray-900">
                            {{ row.paid_count }} / {{ row.total_imported }}
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ Math.round((row.paid_count / row.total_imported) * 100) }}% paid
                        </div>
                    </template>

                    <!-- Status Column -->
                    <template #td-status="{ row }">
                        <span :class="getImportStatusColor(row)"
                              class="px-2 py-1 text-xs font-semibold rounded-full">
                            {{ getImportStatusText(row) }}
                        </span>
                    </template>

                    <!-- Actions Column -->
                    <template #td-actions="{ row }">
                        <div class="flex items-center space-x-2">
                            <Button @click.stop="viewImportDetails(row)"
                                    class="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                                <i class="fa fa-eye mr-1"></i>
                                View Details
                            </Button>
                        </div>
                    </template>
                </Table>
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
                                {{ Math.min(currentPage * itemsPerPage, totalImports) }} of 
                                {{ totalImports }} results
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

        <!-- Import Dialog -->
        <Dialog v-model:visible="showImportDialog" modal header="Import Applicants" :style="{ width: '600px' }">
            <div class="space-y-6">
                <!-- Step Indicator -->
                <div class="flex items-center justify-center space-x-4 mb-6">
                    <div class="flex items-center">
                        <div :class="importStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'"
                             class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                            1
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-700">Upload File</span>
                    </div>
                    <div class="w-16 h-1 bg-gray-300 rounded">
                        <div :class="importStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'"
                             class="h-full rounded transition-all duration-300"
                             :style="{ width: importStep >= 2 ? '100%' : '0%' }"></div>
                    </div>
                    <div class="flex items-center">
                        <div :class="importStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'"
                             class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                            2
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-700">Validate</span>
                    </div>
                    <div class="w-16 h-1 bg-gray-300 rounded">
                        <div :class="importStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'"
                             class="h-full rounded transition-all duration-300"
                             :style="{ width: importStep >= 3 ? '100%' : '0%' }"></div>
                    </div>
                    <div class="flex items-center">
                        <div :class="importStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                             class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                            3
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-700">Import</span>
                    </div>
                </div>

                <!-- Step 1: File Upload -->
                <div v-if="importStep === 1" class="space-y-4">
                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Upload Excel File</h3>
                        <p class="text-gray-600 mb-4">Select an Excel file (.xlsx or .xls) containing applicant data</p>
                    </div>

                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                            ref="fileInput"
                            type="file"
                            accept=".xlsx,.xls"
                            @change="handleFileSelect"
                            class="hidden"
                        />
                        <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
                            <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-4"></i>
                            <p class="text-lg font-medium text-gray-700 mb-2">Click to upload file</p>
                            <p class="text-sm text-gray-500">or drag and drop your Excel file here</p>
                            <p class="text-xs text-gray-400 mt-2">Supported formats: .xlsx, .xls (Max: 10MB)</p>
                        </div>
                        <div v-else class="space-y-2">
                            <i class="fa fa-file-excel text-4xl text-green-500 mb-2"></i>
                            <p class="text-lg font-medium text-gray-700">{{ selectedFile.name }}</p>
                            <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                            <Button @click="removeFile" class="bg-red-500 hover:bg-red-600 text-white text-sm mt-2">
                                <i class="fa fa-times mr-1"></i>
                                Remove File
                            </Button>
                        </div>
                    </div>

                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-medium text-blue-800 mb-2">Required Excel Columns:</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm text-blue-700">
                            <div>• full_name</div>
                            <div>• jamb_number</div>
                            <div>• gender</div>
                            <div>• programme_name</div>
                            <div>• mode_of_entry</div>
                            <div>• lga_name</div>
                        </div>
                        <h4 class="font-medium text-blue-800 mt-3 mb-2">Optional Columns:</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm text-blue-700">
                            <div>• subject_1, score_1</div>
                            <div>• subject_2, score_2</div>
                            <div>• subject_3, score_3</div>
                            <div>• subject_4, score_4</div>
                        </div>
                    </div>
                </div>

                <!-- Step 2: Validation Results -->
                <div v-if="importStep === 2" class="space-y-4">
                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Validation Results</h3>
                        <p class="text-gray-600 mb-4">Review the validation results before importing</p>
                    </div>

                    <div v-if="validationResults" class="space-y-4">
                        <div v-if="validationResults.valid_count > 0" class="bg-green-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fa fa-check-circle text-green-500 text-xl mr-3"></i>
                                <div>
                                    <h4 class="font-medium text-green-800">Validation Successful</h4>
                                    <p class="text-green-700 text-sm">
                                        {{ validationResults.total_records }} records are ready for import
                                    </p>
                                </div>
                            </div>
                        </div>

                         <div v-if="validationResults?.error_count > 0" class="bg-red-50 p-4 rounded-lg">
                            <div class="flex items-center">
                                <i class="fa fa-exclamation-circle text-red-500 text-xl mr-3"></i>
                                <div>
                                    <h4 class="font-medium text-red-800">Validation Errors Found</h4>
                                    <p class="text-red-700 text-sm">
                                        {{ validationResults.error_count }} records have errors that need to be fixed
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Error Details -->
                            <div class="mt-3 pl-9">
                                <div v-for="(error, index) in validationResults.errors" :key="index" class="text-sm text-red-700 mb-1">
                                    • {{ error }}
                                </div>
                            </div>
                        </div>
                        <!-- Preview Data -->
                        <div v-if="validationResults.valid_count > 0" class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-medium text-gray-800 mb-3">Preview (First 5 Records)</h4>
                            <div class="overflow-x-auto">
                                <table class="min-w-full text-sm">
                                    <thead>
                                        <tr class="border-b border-gray-300">
                                            <th class="text-left py-2 px-3">Name</th>
                                            <th class="text-left py-2 px-3">JAMB Number</th>
                                            <th class="text-left py-2 px-3">Programme</th>
                                            <th class="text-left py-2 px-3">Gender</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(record, index) in validationResults.preview" :key="index"
                                            class="border-b border-gray-200">
                                            <td class="py-2 px-3">{{ record.first_name }} {{ record.surname }}</td>
                                            <td class="py-2 px-3">{{ record.jamb_number }}</td>
                                            <td class="py-2 px-3">{{ record.programme_name || 'N/A' }}</td>
                                            <td class="py-2 px-3">{{ record.gender }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Import Complete -->
                <div v-if="importStep === 3" class="space-y-4">
                    <div class="text-center">
                        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <i class="fa fa-check text-green-600 text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Import Completed Successfully!</h3>
                        <p class="text-gray-600 mb-4">All applicants have been imported and are ready for processing</p>
                    </div>

                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-medium text-green-800 mb-2">Import Summary</h4>
                        <div class="text-sm text-green-700 space-y-1">
                            <div>• Total Records Imported: {{ validationResults?.total_records || 0 }}</div>
                            <div>• Default Password: JAMB Number</div>
                            <div>• Application Fee Status: Unpaid (requires payment)</div>
                        </div>
                    </div>
                </div>

                <!-- Dialog Actions -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="resetImportDialog" class="bg-gray-500 hover:bg-gray-600 text-white">
                        {{ importStep === 3 ? 'Close' : 'Cancel' }}
                    </Button>

                    <Button v-if="importStep === 1"
                            @click="uploadFile"
                            :disabled="!selectedFile || isUploading"
                            :loading="isUploading"
                            class="bg-blue-500 hover:bg-blue-600 text-white">
                        <i class="fa fa-upload mr-2"></i>
                        {{ isUploading ? `Uploading... ${uploadProgress}%` : 'Upload & Validate' }}
                    </Button>

                    <Button v-if="importStep === 2"
                            @click="processImport"
                            :loading="isProcessing"
                            class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-check mr-2"></i>
                        {{ isProcessing ? 'Importing...' : 'Import Applicants' }}
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
import Table from "@/components/Table.vue";

export default {
    name: "ApplicantImportManagement",
    mixins: [userDataMixin],
    components: {
        Button,
        Dialog,
        Table
    },

    data() {
        return {
            loading: false,
            currentPage: 1,
            itemsPerPage: 20,
            totalImports: 0,

            // Table Configuration
            importHistoryHeaders: [
                { key: 'import_batch_id', title: 'Batch ID' },
                { key: 'imported_at', title: 'Import Date', formatDate: true },
                { key: 'total_imported', title: 'Total Imported' },
                { key: 'fee_paid', title: 'Fee Paid' },
                { key: 'status', title: 'Status' },
                { key: 'actions', title: 'Actions' }
            ],
            importHistoryPagination: {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 20,
                    total: 0,
                    from: 1,
                    to: 0
                },
                links: []
            },

            // Import Dialog
            showImportDialog: false,
            importStep: 1,
            selectedFile: null,
            uploadProgress: 0,
            isUploading: false,
            isProcessing: false,

            // Validation Results
            validationResults: null,
            batchId: null,

            // Data
            importHistory: [],
            importStats: {
                totalImports: 0,
                totalApplicants: 0,
                feePaidCount: 0,
                feePendingCount: 0
            },

        };
    },

    computed: {
        currentSessionId() {
            return this.$globals.getConfiguration('current_session') || 1;
        },

        totalPages() {
            return Math.ceil(this.totalImports / this.itemsPerPage);
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
        // Data Loading Methods
        async loadImportHistory() {
            try {
                this.loading = true;
                const response = await get(this.$endpoints.staff.getImportHistory.url+'?session_id='+this.currentSessionId+'&page='+this.currentPage+'&per_page='+this.itemsPerPage);

                if (response && response.data) {
                    this.importHistory = response.data || [];
                    this.totalImports = response.total || 0;

                    // Setup pagination data for Table component
                    this.importHistoryPagination.data = this.importHistory;
                    this.importHistoryPagination.meta = {
                        current_page: this.currentPage,
                        last_page: Math.ceil(this.totalImports / this.itemsPerPage),
                        per_page: this.itemsPerPage,
                        total: this.totalImports,
                        from: ((this.currentPage - 1) * this.itemsPerPage) + 1,
                        to: Math.min(this.currentPage * this.itemsPerPage, this.totalImports)
                    };

                    this.updateImportStats();
                }
            } catch (error) {
                console.error("Error loading import history:", error);
                this.$globals.message = {
                    text: "Error loading import history. Please try again.",
                    type: "error"
                };
            } finally {
                this.loading = false;
            }
        },

        updateImportStats() {
            this.importStats = {
                totalImports: this.importHistory.length,
                totalApplicants: this.importHistory.reduce((sum, batch) => sum + batch.total_imported, 0),
                feePaidCount: this.importHistory.reduce((sum, batch) => sum + batch.paid_count, 0),
                feePendingCount: this.importHistory.reduce((sum, batch) => sum + (batch.total_imported - batch.paid_count), 0)
            };
        },

        // File Handling Methods
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
                if (!allowedTypes.includes(file.type)) {
                    this.$globals.message = {
                        text: "Please select a valid Excel file (.xlsx or .xls)",
                        type: "error"
                    };
                    return;
                }

                // Validate file size (10MB max)
                if (file.size > 10 * 1024 * 1024) {
                    this.$globals.message = {
                        text: "File size must be less than 10MB",
                        type: "error"
                    };
                    return;
                }

                this.selectedFile = file;
            }
        },

        removeFile() {
            this.selectedFile = null;
            this.$refs.fileInput.value = '';
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        // Import Process Methods
        async uploadFile() {
            if (!this.selectedFile) {
                this.$globals.message = {
                    text: "Please select a file to upload",
                    type: "error"
                };
                return;
            }

            try {
                this.isUploading = true;
                this.uploadProgress = 0;

                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('session_id', this.currentSessionId);
                window.addEventListener('APP_TOAST_MESSAGE', this.handleImportError);

                const response = await post(this.$endpoints.staff.uploadApplicantFile.url, formData, false, false, 
                    {
                        'Content-Type': 'multipart/form-data'
                    },
                    {
                    onUploadProgress: (progressEvent) => {
                        this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    }
                });

                if (response) {
                    this.validationResults = response.data;
                    this.batchId = response.data.batch_id;
                    this.importStep = 2;

                    this.$globals.message = {
                        text: `File validated successfully! ${response.data.total_records} records ready for import.`,
                        type: "success"
                    };
                } else {
                    this.$globals.message = {
                        text: response?.message || "File validation failed. Please check your file format.",
                        type: "error"
                    };
                }
            } catch (error) {
                console.error("Error uploading file:", error);
                this.$globals.message = {
                    text: "Error uploading file. Please try again.",
                    type: "error"
                };
            } finally {
                this.isUploading = false;
                this.uploadProgress = 0;
            }
        },
        handleImportError(event) {
            const { type, message } = event.detail;
            console.log('type:', type, 'message:', message);
            this.validationResults =  message;
            this.importStep = 2;
        },
        async processImport() {
            if (!this.batchId) {
                this.$globals.message = {
                    text: "No batch ID found. Please upload a file first.",
                    type: "error"
                };
                return;
            }

            try {
                this.isProcessing = true;

                const response = await post(this.$endpoints.staff.processApplicantImport.url, {
                    batch_id: this.batchId,
                    session_id: this.currentSessionId
                });

                if (response && !response.error) {
                    this.importStep = 3;

                    this.$globals.message = {
                        text: `Import completed successfully! ${response.data.imported_count} applicants imported.`,
                        type: "success"
                    };

                    // Refresh import history
                    await this.loadImportHistory();

                    // Close dialog after a delay
                    setTimeout(() => {
                        this.resetImportDialog();
                    }, 3000);
                } else {
                    this.$globals.message = {
                        text: response?.message || "Import failed. Please try again.",
                        type: "error"
                    };
                }
            } catch (error) {
                console.error("Error processing import:", error);
                this.$globals.message = {
                    text: "Error processing import. Please try again.",
                    type: "error"
                };
            } finally {
                this.isProcessing = false;
            }
        },

        resetImportDialog() {
            this.showImportDialog = false;
            this.importStep = 1;
            this.selectedFile = null;
            this.validationResults = null;
            this.batchId = null;
            this.uploadProgress = 0;
            this.isUploading = false;
            this.isProcessing = false;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },

        // Template and Utility Methods
        async downloadTemplate() {
            try {
                // Use fetch with proper headers for authenticated download
                const token = localStorage.getItem('authToken');
                const response = await fetch(window.baseUrl+this.$endpoints.staff.downloadImportTemplate.url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }
                });

                if (!response.ok) {
                    throw new Error('Download failed');
                }

                // Get the blob from response
                const blob = await response.blob();

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'applicant_import_template.xlsx');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                this.$globals.message = {
                    text: "Template downloaded successfully!",
                    type: "success"
                };
            } catch (error) {
                console.error("Error downloading template:", error);
                this.$globals.message = {
                    text: "Error downloading template. Please try again.",
                    type: "error"
                };
            }
        },

        viewImportDetails(importBatch) {
            // Navigate to detailed view or open modal
            console.log("View import details:", importBatch);
            // You can implement a detailed view here
        },

        // Utility Methods
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (error) {
                return dateString;
            }
        },

        getImportStatusColor(importBatch) {
            const paidPercentage = (importBatch.paid_count / importBatch.total_imported) * 100;
            if (paidPercentage === 100) {
                return 'bg-green-100 text-green-800';
            } else if (paidPercentage >= 50) {
                return 'bg-yellow-100 text-yellow-800';
            } else {
                return 'bg-red-100 text-red-800';
            }
        },

        getImportStatusText(importBatch) {
            const paidPercentage = (importBatch.paid_count / importBatch.total_imported) * 100;
            if (paidPercentage === 100) {
                return 'All Paid';
            } else if (paidPercentage >= 50) {
                return 'Partially Paid';
            } else {
                return 'Payment Pending';
            }
        },

        // Pagination Methods
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadImportHistory();
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.loadImportHistory();
            }
        },

        goToPage(page) {
            if (typeof page === 'number' && page !== this.currentPage) {
                this.currentPage = page;
                this.loadImportHistory();
            }
        }
    },

    async mounted() {
        await this.loadImportHistory();
    },

    // Pagination handlers for Table component
    handlePageChange(url) {
        // Handle pagination page change
        console.log('Page change:', url);
        // You can implement API call with the new page URL here
    },

    handlePageLength(perPage) {
        // Handle rows per page change
        this.itemsPerPage = perPage;
        this.loadImportHistory();
    }
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

/* File upload area */
.border-dashed:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
}

/* Step indicator animations */
.step-indicator {
    transition: all 0.3s ease;
}

/* Progress bar animation */
.progress-bar {
    transition: width 0.3s ease;
}

/* Card hover effects */
.bg-white:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease;
}

/* Status badge animations */
.status-badge {
    transition: all 0.2s ease;
}

.status-badge:hover {
    transform: scale(1.05);
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

/* Upload progress bar */
.upload-progress {
    background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
    transition: width 0.3s ease;
}

/* Validation results styling */
.validation-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.validation-error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Import step indicator */
.step-complete {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.step-active {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.step-inactive {
    background: #d1d5db;
}

/* Dialog animations */
.dialog-enter-active, .dialog-leave-active {
    transition: all 0.3s ease;
}

.dialog-enter-from, .dialog-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
