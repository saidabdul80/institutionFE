<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Documents</h2>
                    <p class="text-gray-600">Upload and manage your application documents</p>
                </div>
                <button @click="showUploadModal = true" class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                    <i class="fa fa-upload mr-2"></i>Upload Document
                </button>
            </div>
        </div>

        <!-- Document Requirements -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Required Documents</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="requirement in documentRequirements" :key="requirement.id" 
                     class="flex items-center justify-between p-4 border rounded-lg">
                    <div class="flex items-center">
                        <i :class="requirement.uploaded ? 'fa fa-check-circle text-green-500' : 'fa fa-circle-o text-gray-400'" 
                           class="text-xl mr-3"></i>
                        <div>
                            <p class="font-medium">{{ requirement.name }}</p>
                            <p class="text-sm text-gray-500">{{ requirement.description }}</p>
                        </div>
                    </div>
                    <span :class="requirement.uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                          class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ requirement.uploaded ? 'Uploaded' : 'Required' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Uploaded Documents -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Uploaded Documents</h3>
                    <div class="flex gap-2">
                        <select v-model="filterStatus" @change="filterDocuments" 
                                class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Status</option>
                            <option value="pending">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
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
                                {{ document.document_type }}
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
                                    <button v-if="document.status === 'rejected'" 
                                            @click="replaceDocument(document)" 
                                            class="text-orange-600 hover:text-orange-900">
                                        <i class="fa fa-refresh"></i> Replace
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                    <select v-model="uploadForm.document_type" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Document Type</option>
                        <option v-for="type in documentTypes" :key="type.value" :value="type.value">
                            {{ type.label }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Name *</label>
                    <input v-model="uploadForm.name" type="text" required
                           placeholder="Enter document name" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea v-model="uploadForm.description" rows="3" 
                              placeholder="Enter document description" 
                              class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select File *</label>
                    <input type="file" @change="handleFileSelect" required
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <p class="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max size: 5MB)
                    </p>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="showUploadModal = false" />
                    <Button label="Upload" @click="uploadDocument" 
                            :disabled="!uploadForm.document_type || !uploadForm.name || !selectedFile" />
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
            loading: false,
            showUploadModal: false,
            documents: [],
            filteredDocuments: [],
            selectedFile: null,
            filterStatus: '',
            searchQuery: '',
            uploadForm: {
                document_type: '',
                name: '',
                description: ''
            },
            documentTypes: [
                { value: 'passport', label: 'Passport Photograph' },
                { value: 'birth_certificate', label: 'Birth Certificate' },
                { value: 'olevel_result', label: 'O\'Level Result' },
                { value: 'jamb_result', label: 'JAMB Result' },
                { value: 'state_of_origin', label: 'State of Origin Certificate' },
                { value: 'medical_report', label: 'Medical Report' },
                { value: 'other', label: 'Other Document' }
            ],
            documentRequirements: [
                { id: 1, name: 'Passport Photograph', description: 'Recent passport photograph', uploaded: false },
                { id: 2, name: 'Birth Certificate', description: 'Original birth certificate', uploaded: false },
                { id: 3, name: 'O\'Level Result', description: 'WAEC/NECO/NABTEB result', uploaded: false },
                { id: 4, name: 'JAMB Result', description: 'UTME result slip', uploaded: false },
                { id: 5, name: 'State of Origin', description: 'Certificate of state of origin', uploaded: false },
                { id: 6, name: 'Medical Report', description: 'Medical fitness certificate', uploaded: false }
            ]
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
                    this.updateRequirements();
                }
            } catch (error) {
                console.error('Error loading documents:', error);
            } finally {
                this.loading = false;
            }
        },
        updateRequirements() {
            this.documentRequirements.forEach(req => {
                req.uploaded = this.documents.some(doc => 
                    doc.document_type === req.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
                );
            });
        },
        filterDocuments() {
            let filtered = this.documents;
            
            if (this.filterStatus) {
                filtered = filtered.filter(doc => doc.status === this.filterStatus);
            }
            
            if (this.searchQuery) {
                filtered = filtered.filter(doc => 
                    doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    doc.document_type.toLowerCase().includes(this.searchQuery.toLowerCase())
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
            formData.append('document_type', this.uploadForm.document_type);
            formData.append('name', this.uploadForm.name);
            formData.append('description', this.uploadForm.description);
            
            try {
                const res = await postFormData(this.$endpoints.applicant.updateDocument.url, formData);
                if (res) {
                    this.showUploadModal = false;
                    this.uploadForm = { document_type: '', name: '', description: '' };
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
        replaceDocument(document) {
            this.uploadForm.document_type = document.document_type;
            this.uploadForm.name = document.name;
            this.uploadForm.description = document.description;
            this.showUploadModal = true;
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
                'pending': 'bg-yellow-100 text-yellow-800',
                'approved': 'bg-green-100 text-green-800',
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
