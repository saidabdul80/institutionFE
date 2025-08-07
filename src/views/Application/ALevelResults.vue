<template>
    <div v-if="form" class="p-6">
        <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-800">A-Level Results</h2>
                <p class="text-gray-600 mt-2">Enter your A-Level examination results and certificates</p>
            </div>

            <!-- Content -->
            <div class="p-6">
                <!-- Add New Result Button -->
                <div class="mb-6">
                    <button @click="showAddModal = true" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        <i class="fa fa-plus mr-2"></i>
                        Add A-Level Result
                    </button>
                </div>

                <!-- Existing Results -->
                <div v-if="aLevelResults.length > 0" class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Your A-Level Results</h3>
                    
                    <div v-for="(result, index) in aLevelResults" :key="index" 
                         class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-semibold text-gray-800">{{ result.certificate_name || 'A-Level Certificate' }}</h4>
                                <p class="text-sm text-gray-600">
                                    Session: {{ result.session_name || 'N/A' }}
                                </p>
                            </div>
                            <div class="flex space-x-2">
                                <button v-if="canEdit" @click="editResult(result, index)"
                                        class="text-blue-500 hover:text-blue-700">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button v-if="canEdit" @click="deleteResult(index)"
                                        class="text-red-500 hover:text-red-700">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Certificate Details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-700">Certificate Type:</span>
                                <span class="ml-2">{{ result.certificate_type_name || 'N/A' }}</span>
                            </div>
                            <div v-if="result.certificates?.url">
                                <span class="font-medium text-gray-700">Certificate:</span>
                                <a :href="result.certificates.url" target="_blank" 
                                   class="ml-2 text-blue-500 hover:text-blue-700">
                                    <i class="fa fa-external-link-alt mr-1"></i>
                                    View Certificate
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Results Message -->
                <div v-else class="text-center py-8">
                    <i class="fa fa-graduation-cap text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No A-Level results added yet</p>
                    <p class="text-sm text-gray-400">Click "Add A-Level Result" to get started</p>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-show="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-800">
                        {{ editingIndex !== null ? 'Edit' : 'Add' }} A-Level Result
                    </h3>
                </div>
                
                <div class="p-6">
                    <!-- Basic Information -->
                    <div class="grid grid-cols-1 gap-4 mb-6">
                        <!-- <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Certificate Type *</label>
                            <select v-model="currentResult.certificate_type_id" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Certificate Type</option>
                                <option v-for="certType in certificateTypes" :key="certType.id" :value="certType.id">
                                    {{ certType.name }}
                                </option>
                            </select>
                        </div> -->
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Certificate Name *</label>
                            <input v-model="currentResult.certificate_name" 
                                   type="text" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter certificate name">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Session *</label>
                            <select v-model="currentResult.session_id" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Session</option>
                                <option v-for="session in sessions" :key="session.id" :value="session.id">
                                    {{ session.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Certificate Upload -->
                    <div class="mb-6">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">Certificate Upload</h4>
                        
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input type="file" 
                                   ref="fileInput"
                                   @change="handleFileSelect"
                                   accept=".pdf,.jpg,.jpeg,.png"
                                   class="hidden">
                            
                            <div v-if="!selectedFile && !currentResult.filename">
                                <i class="fa fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                                <p class="text-gray-600 mb-2">Upload your A-Level certificate</p>
                                <p class="text-sm text-gray-500 mb-4">PDF, JPG, PNG files up to 5MB</p>
                                <button @click="$refs.fileInput.click()" 
                                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                    Choose File
                                </button>
                            </div>
                            
                            <div v-else class="text-left">
                                <div class="flex items-center justify-between bg-gray-50 rounded p-3">
                                    <div class="flex items-center">
                                        <i class="fa fa-file text-blue-500 mr-3"></i>
                                        <span class="text-sm font-medium">
                                            {{ selectedFile?.name || currentResult.filename }}
                                        </span>
                                    </div>
                                    <button @click="removeFile" 
                                            class="text-red-500 hover:text-red-700">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </div>
                                
                                <button @click="$refs.fileInput.click()" 
                                        class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
                                    Change File
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button @click="closeModal" 
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="saveResult"  v-if="canEdit"
                            :disabled="loading"
                            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                        <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                        {{ editingIndex !== null ? 'Update' : 'Save' }} Result
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, postFormData } from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import { useGlobalsStore } from '@/stores/globals';

export default {
    name: 'ALevelResults',
    props: {
        canEdit: {
            type: Boolean,
            default: true
        },
    },
    setup() {
        const authStore = useAuthStore();
        const globalsStore = useGlobalsStore();
        return { authStore, globalsStore };
    },
    data() {
        return {
            loading: false,
            showAddModal: false,
            editingIndex: null,
            aLevelResults: [],
            certificateTypes: [],
            sessions: [],
            selectedFile: null,
            currentResult: {
                certificate_type_id: '',
                certificate_name: '',
                session_id: '',
                filename: '',
                url: ''
            },
            form: {}
        };
    },
    async mounted() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Load certificate types, sessions, and A-level results
                await Promise.all([
                    //this.loadCertificateTypes(),
                    this.loadSessions(),
                    this.loadALevelResults()
                ]);
            } catch (error) {
                console.error('Error loading data:', error);
                this.$globals.message = {
                    text: 'Error loading data',
                    type: 'error'
                };
            } finally {
                this.loading = false;
            }
        },

        async loadCertificateTypes() {
            try {
                const response = await get(this.$endpoints.applicant.getCertificateTypes.url);
                if (response && !response.error) {
                    this.certificateTypes = response;
                }
            } catch (error) {
                console.error('Error loading certificate types:', error);
                // Fallback to globals if available
                this.certificateTypes = this.globalsStore.school_info?.certificate_types || [];
            }
        },

        async loadSessions() {
            try {
                // Sessions should be available from globals
                this.sessions = this.globalsStore.school_info?.sessions || [];
            } catch (error) {
                console.error('Error loading sessions:', error);
            }
        },

        async loadALevelResults() {
            try {
                const applicantId = this.authStore.userInfo?.id;
                if (!applicantId) return;

                const response = await get(this.$endpoints.applicant.aLevelResult.url.replace('{id}', applicantId));
                if (response && !response.error) {
                    this.aLevelResults = Array.isArray(response) ? response : [response];
                }
            } catch (error) {
                console.error('Error loading A-level results:', error);
            }
        },

        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    this.$globals.message = {
                        text: 'File size must be less than 5MB',
                        type: 'error'
                    };
                    return;
                }

                // Validate file type
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(file.type)) {
                    this.$globals.message = {
                        text: 'Only PDF, JPG, and PNG files are allowed',
                        type: 'error'
                    };
                    return;
                }

                this.selectedFile = file;
            }
        },

        removeFile() {
            this.selectedFile = null;
            this.currentResult.filename = '';
            this.currentResult.url = '';
            this.$refs.fileInput.value = '';
        },

        editResult(result, index) {
            this.editingIndex = index;
            this.currentResult = {
                id: result.id,
                certificate_type_id: result.certificate_type_id,
                certificate_name: result.certificate_name,
                session_id: result.session_id,
                filename: result.certificates?.filename || '',
                url: result.certificates?.url || ''
            };
            this.showAddModal = true;
        },

        deleteResult(index) {
            if (confirm('Are you sure you want to delete this A-level result?')) {
                this.aLevelResults.splice(index, 1);
                this.$globals.message = {
                    text: 'A-level result deleted',
                    type: 'success'
                };
            }
        },

        async saveResult() {
            try {
                // Validate required fields
                if (!this.currentResult.certificate_type_id || !this.currentResult.certificate_name ||
                    !this.currentResult.session_id) {
                    this.$globals.message = {
                        text: 'Please fill in all required fields',
                        type: 'error'
                    };
                    return;
                }

                this.loading = true;

                // Prepare form data
                const formData = new FormData();
                formData.append('certificate_type_id', this.currentResult.certificate_type_id);
                formData.append('certificate_name', this.currentResult.certificate_name);
                formData.append('session_id', this.currentResult.session_id);

                if (this.editingIndex !== null) {
                    formData.append('id', this.currentResult.id);
                }

                // Add file if selected
                if (this.selectedFile) {
                    formData.append('certificate_file', this.selectedFile);
                    formData.append('filename', this.selectedFile.name);
                }

                const response = await postFormData(this.$endpoints.applicant.updateALevel.url, formData);

                if (response && !response.error) {
                    this.$globals.message = {
                        text: 'A-level result saved successfully',
                        type: 'success'
                    };

                    // Reload results
                    await this.loadALevelResults();
                    this.closeModal();
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to save A-level result',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error saving A-level result:', error);
                this.$globals.message = {
                    text: 'Error saving A-level result',
                    type: 'error'
                };
            } finally {
                this.loading = false;
            }
        },

        closeModal() {
            this.showAddModal = false;
            this.editingIndex = null;
            this.selectedFile = null;
            this.currentResult = {
                certificate_type_id: '',
                certificate_name: '',
                session_id: '',
                filename: '',
                url: ''
            };
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        }
    }
};
</script>
