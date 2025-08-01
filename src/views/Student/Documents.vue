<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Documents</h2>
                    <p class="text-gray-600">Manage your academic documents and certificates</p>
                </div>
                <button @click="showUploadModal = true" class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                    <i class="fa fa-upload mr-2"></i>Upload Document
                </button>
            </div>
        </div>

        <!-- Document Categories -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div class="bg-blue-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-file-text text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Academic Records</p>
                        <p class="text-2xl font-bold">{{ getDocumentCount('academic') }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-green-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-certificate text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Certificates</p>
                        <p class="text-2xl font-bold">{{ getDocumentCount('certificate') }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-purple-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-id-card text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Personal Documents</p>
                        <p class="text-2xl font-bold">{{ getDocumentCount('personal') }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-orange-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-folder text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Other Documents</p>
                        <p class="text-2xl font-bold">{{ getDocumentCount('other') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button @click="generateDocument('transcript')" 
                        class="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <i class="fa fa-file-text text-2xl text-blue-500 mb-2"></i>
                    <span class="text-sm font-medium">Generate Transcript</span>
                </button>
                
                <button @click="generateDocument('result_slip')" 
                        class="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <i class="fa fa-graduation-cap text-2xl text-green-500 mb-2"></i>
                    <span class="text-sm font-medium">Result Slip</span>
                </button>
                
                <button @click="generateDocument('course_form')" 
                        class="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <i class="fa fa-list text-2xl text-purple-500 mb-2"></i>
                    <span class="text-sm font-medium">Course Form</span>
                </button>
                
                <button @click="generateDocument('biodata')" 
                        class="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                    <i class="fa fa-user text-2xl text-yellow-500 mb-2"></i>
                    <span class="text-sm font-medium">Biodata Slip</span>
                </button>
            </div>
        </div>

        <!-- Documents List -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">My Documents</h3>
                    <div class="flex gap-2">
                        <select v-model="filterCategory" @change="filterDocuments" 
                                class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Categories</option>
                            <option value="academic">Academic Records</option>
                            <option value="certificate">Certificates</option>
                            <option value="personal">Personal Documents</option>
                            <option value="other">Other</option>
                        </select>
                        <input v-model="searchQuery" @input="filterDocuments" type="text" 
                               placeholder="Search documents..." 
                               class="px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading documents...</p>
            </div>
            
            <div v-else-if="filteredDocuments.length === 0" class="p-6 text-center">
                <i class="fa fa-folder-open text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No documents found</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="document in filteredDocuments" :key="document.id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <i :class="getFileIcon(document.file_type)" class="text-2xl mr-3"></i>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">{{ document.name }}</div>
                                        <div class="text-sm text-gray-500">{{ document.file_size }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ document.category }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ document.file_type }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(document.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(document.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ document.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="viewDocument(document)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-eye"></i> View
                                    </button>
                                    <button @click="downloadDocument(document)" 
                                            class="text-green-600 hover:text-green-900">
                                        <i class="fa fa-download"></i> Download
                                    </button>
                                    <button @click="deleteDocument(document)" 
                                            class="text-red-600 hover:text-red-900">
                                        <i class="fa fa-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Upload Document Modal -->
        <Dialog v-model:visible="showUploadModal" modal header="Upload Document" :style="{width: '600px'}">
            <div class="p-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                    <input v-model="uploadForm.name" type="text" 
                           placeholder="Enter document name" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select v-model="uploadForm.category" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Category</option>
                        <option value="academic">Academic Records</option>
                        <option value="certificate">Certificates</option>
                        <option value="personal">Personal Documents</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea v-model="uploadForm.description" rows="3" 
                              placeholder="Enter document description" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                    <input type="file" @change="handleFileSelect" 
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <p class="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max size: 5MB)
                    </p>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="showUploadModal = false" />
                    <Button label="Upload" @click="uploadDocument" 
                            :disabled="!uploadForm.name || !uploadForm.category || !selectedFile" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post, postFormData } from '@/api/client';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    components: {
        Dialog,
        Button
    },
    data() {
        return {
            documents: [],
            filteredDocuments: [],
            showUploadModal: false,
            uploadForm: {
                name: '',
                category: '',
                description: ''
            },
            selectedFile: null,
            filterCategory: '',
            searchQuery: '',
            loading: false
        }
    },
    methods: {
        async loadDocuments() {
            this.loading = true;
            try {
                const res = await get(this.$endpoints.applicant.getDocuments.url);
                if (res && res.data) {
                    this.documents = res.data;
                    this.filteredDocuments = res.data;
                }
            } catch (error) {
                console.error('Error loading documents:', error);
            } finally {
                this.loading = false;
            }
        },
        getDocumentCount(category) {
            return this.documents.filter(doc => doc.category === category).length;
        },
        filterDocuments() {
            let filtered = this.documents;
            
            if (this.filterCategory) {
                filtered = filtered.filter(doc => doc.category === this.filterCategory);
            }
            
            if (this.searchQuery) {
                filtered = filtered.filter(doc => 
                    doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    doc.description.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            this.filteredDocuments = filtered;
        },
        handleFileSelect(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadDocument() {
            if (!this.selectedFile) return;
            
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('name', this.uploadForm.name);
            formData.append('category', this.uploadForm.category);
            formData.append('description', this.uploadForm.description);
            
            try {
                const res = await postFormData(this.$endpoints.applicant.updateDocument.url, formData);
                if (res) {
                    this.showUploadModal = false;
                    this.uploadForm = { name: '', category: '', description: '' };
                    this.selectedFile = null;
                    await this.loadDocuments();
                    
                    this.$globals.message = {
                        text: 'Document uploaded successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error uploading document:', error);
            }
        },
        async generateDocument(type) {
            try {
                let endpoint = '';
                switch (type) {
                    case 'transcript':
                        endpoint = 'api/pdf/result-slip';
                        break;
                    case 'result_slip':
                        endpoint = 'api/pdf/result-slip';
                        break;
                    case 'course_form':
                        endpoint = 'api/pdf/course-form';
                        break;
                    case 'biodata':
                        endpoint = 'api/biodata-pdf';
                        break;
                }
                
                // Generate and download document
                console.log('Generating document:', type);
            } catch (error) {
                console.error('Error generating document:', error);
            }
        },
        viewDocument(document) {
            if (document.file_url) {
                window.open(document.file_url, '_blank');
            }
        },
        downloadDocument(document) {
            if (document.file_url) {
                const link = document.createElement('a');
                link.href = document.file_url;
                link.download = document.name;
                link.click();
            }
        },
        async deleteDocument(document) {
            if (confirm('Are you sure you want to delete this document?')) {
                try {
                    // Implement delete functionality
                    console.log('Delete document:', document.id);
                } catch (error) {
                    console.error('Error deleting document:', error);
                }
            }
        },
        getFileIcon(fileType) {
            const icons = {
                'pdf': 'fa fa-file-pdf-o text-red-500',
                'doc': 'fa fa-file-word-o text-blue-500',
                'docx': 'fa fa-file-word-o text-blue-500',
                'jpg': 'fa fa-file-image-o text-green-500',
                'jpeg': 'fa fa-file-image-o text-green-500',
                'png': 'fa fa-file-image-o text-green-500'
            };
            return icons[fileType] || 'fa fa-file-o text-gray-500';
        },
        getStatusColor(status) {
            const colors = {
                'approved': 'bg-green-100 text-green-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'rejected': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-NG');
        }
    },
    async mounted() {
        await this.loadDocuments();
    }
}
</script>
