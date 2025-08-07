<template>
    <div class="document-viewer">
        <!-- Applicant Information -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 class="font-semibold text-lg mb-2">{{ applicant.full_name }}</h3>
                    <div class="space-y-1 text-sm">
                        <p><span class="font-medium">Application No:</span> {{ applicant.application_number }}</p>
                        <p><span class="font-medium">Email:</span> {{ applicant.email }}</p>
                        <p><span class="font-medium">Phone:</span> {{ applicant.phone_number }}</p>
                    </div>
                </div>
                <div>
                    <div class="space-y-1 text-sm">
                        <p><span class="font-medium">Programme:</span> {{ applicant.programme_name }}</p>
                        <p><span class="font-medium">Faculty:</span> {{ applicant.faculty }}</p>
                        <p><span class="font-medium">Department:</span> {{ applicant.department }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Document Categories -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Document List -->
            <div class="lg:col-span-1">
                <h4 class="font-semibold mb-4">Documents</h4>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    <div 
                        v-for="document in documents" 
                        :key="document.id"
                        :class="[
                            'p-3 border rounded-lg cursor-pointer transition-colors',
                            selectedDocument?.id === document.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        ]"
                        @click="selectDocument(document)">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium text-sm capitalize">{{ formatDocumentType(document.document_type) }}</div>
                                <div class="text-xs text-gray-500">{{ document.name }}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span 
                                    :class="[
                                        'px-2 py-1 rounded-full text-xs',
                                        getVerificationStatusClass(document.verification_status)
                                    ]">
                                    {{ getVerificationStatusLabel(document.verification_status) }}
                                </span>
                                <i :class="getFileIcon(document.url)" class="text-gray-400"></i>
                            </div>
                        </div>
                        <div v-if="document.verified_at" class="mt-2 text-xs text-gray-500">
                            <span v-if="document.verification_status === 'approved'">Approved</span>
                            <span v-else-if="document.verification_status === 'rejected'">Rejected</span>
                            on {{ formatDate(document.verified_at) }}
                            <span v-if="document.verified_by">by Admin</span>
                        </div>
                    </div>
                    
                    <div v-if="documents.length === 0" class="text-center py-8 text-gray-500">
                        <i class="fa fa-file-alt text-3xl mb-2"></i>
                        <p>No documents uploaded</p>
                    </div>
                </div>
            </div>

            <!-- Document Preview -->
            <div class="lg:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-semibold">Document Preview</h4>
                    <div v-if="selectedDocument" class="flex items-center gap-2">
                        <Button 
                            icon="fa fa-download" 
                            label="Download" 
                            size="small" 
                            outlined 
                            @click="downloadDocument" />
                        <Button 
                            icon="fa fa-external-link-alt" 
                            label="Open in new tab" 
                            size="small" 
                            outlined 
                            @click="openInNewTab" />
                    </div>
                </div>

                <div class="border rounded-lg bg-white" style="height: 500px;">
                    <div v-if="!selectedDocument" class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <i class="fa fa-file-alt text-4xl mb-4"></i>
                            <p>Select a document to preview</p>
                        </div>
                    </div>

                    <div v-else class="h-full">
                        <!-- PDF Preview -->
                        <iframe 
                            v-if="isPdfFile(selectedDocument.url)"
                            :src="selectedDocument.url"
                            class="w-full h-full rounded-lg"
                            frameborder="0">
                        </iframe>

                        <!-- Image Preview -->
                        <div v-else-if="isImageFile(selectedDocument.url)" class="h-full p-4">
                            <img 
                                :src="selectedDocument.url" 
                                :alt="selectedDocument.document_type"
                                class="max-w-full max-h-full object-contain mx-auto" />
                        </div>

                        <!-- Other File Types -->
                        <div v-else class="flex items-center justify-center h-full text-gray-500">
                            <div class="text-center">
                                <i :class="getFileIcon(selectedDocument.url)" class="text-4xl mb-4"></i>
                                <p>{{ selectedDocument.name }}</p>
                                <p class="text-sm">Preview not available for this file type</p>
                                <Button 
                                    label="Download to View" 
                                    icon="fa fa-download" 
                                    class="mt-4"
                                    @click="downloadDocument" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Document Verification Actions -->
                <div v-if="selectedDocument" class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h5 class="font-medium">Document Verification Status</h5>
                            <div v-if="selectedDocument.verified_at" class="text-sm text-gray-600">
                                <span v-if="selectedDocument.verification_status === 'approved'">Approved</span>
                                <span v-else-if="selectedDocument.verification_status === 'rejected'">Rejected</span>
                                on {{ formatDate(selectedDocument.verified_at) }}
                                <span v-if="selectedDocument.verified_by"> by Admin</span>
                            </div>
                        </div>
                        <span 
                            :class="[
                                'px-3 py-1 rounded-full text-sm',
                                getVerificationStatusClass(selectedDocument.verification_status)
                            ]">
                            {{ getVerificationStatusLabel(selectedDocument.verification_status) }}
                        </span>
                    </div>

                    <div v-if="!selectedDocument.verified_at" class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Notes</label>
                            <Textarea 
                                v-model="verificationNotes"
                                rows="3"
                                placeholder="Add notes about this document..."
                                class="w-full" />
                        </div>

                        <div class="flex items-center gap-3">
                            <Button 
                                label="Approve Document" 
                                icon="fa fa-check" 
                                severity="success"
                                @click="verifyDocument('approved')"
                                :loading="verifying" />
                            <Button 
                                label="Reject Document" 
                                icon="fa fa-times" 
                                severity="danger"
                                outlined
                                @click="verifyDocument('rejected')"
                                :loading="verifying" />
                            <Button 
                                label="Request Resubmission" 
                                icon="fa fa-redo" 
                                severity="warning"
                                outlined
                                @click="verifyDocument('resubmit')"
                                :loading="verifying" />
                        </div>
                    </div>
                    <div v-else>
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Notes</label>
                            <div class="p-3 bg-white rounded border border-gray-200">
                                {{ selectedDocument.verification_notes || 'No notes provided' }}
                            </div>
                        </div>
                        <Button 
                            label="Update Verification" 
                            icon="fa fa-edit" 
                            severity="info"
                            outlined
                            @click="resetVerification"
                            :loading="verifying" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Overall Verification Actions -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center justify-between">
                <div>
                    <h5 class="font-medium text-blue-900">Overall Document Verification</h5>
                    <p class="text-sm text-blue-700">
                        {{ verifiedDocuments.length }} of {{ documents.length }} documents verified
                        ({{ approvedDocuments.length }} approved)
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <Button 
                        label="Mark All as Verified" 
                        icon="fa fa-check-double" 
                        severity="success"
                        @click="completeVerification"
                        :disabled="!canCompleteVerification"
                        :loading="completingVerification" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

export default {
    name: 'DocumentViewer',
    components: {
        Button,
        Textarea
    },
    props: {
        applicant: {
            type: Object,
            required: true
        }
    },
    emits: ['document-verified', 'verification-completed'],
    data() {
        return {
            documents: [],
            selectedDocument: null,
            verificationNotes: '',
            verifying: false,
            completingVerification: false
        }
    },
    computed: {
        approvedDocuments() {
            return this.documents.filter(doc => doc.verification_status === 'approved');
        },
        verifiedDocuments() {
            return this.documents.filter(doc => doc.verified_at !== null);
        },
        canCompleteVerification() {
            return this.documents.length > 0 && this.verifiedDocuments.length === this.documents.length;
        }
    },
    mounted() {
        this.documents = this.applicant.documents || [];
    },
    methods: {
        selectDocument(document) {
            this.selectedDocument = document;
            this.verificationNotes = document.verification_notes || '';
        },

        async verifyDocument(status) {
            if (!this.selectedDocument) return;

            this.verifying = true;
            try {
                // In a real app, you would make an API call here
                // For now, we'll simulate the update
                const updatedDoc = {
                    ...this.selectedDocument,
                    verification_status: status,
                    verification_notes: this.verificationNotes,
                    verified_at: new Date().toISOString(),
                    verified_by: "1" // Current admin/user ID
                };

                const index = this.documents.findIndex(doc => doc.id === this.selectedDocument.id);
                if (index !== -1) {
                    this.documents[index] = updatedDoc;
                    this.selectedDocument = updatedDoc;
                }

                this.$globals.showMessage(`Document ${status} successfully`, 'success');
                this.$emit('document-verified');
            } catch (error) {
                console.error('Error verifying document:', error);
                this.$globals.showMessage('Failed to verify document', 'error');
            } finally {
                this.verifying = false;
            }
        },

        resetVerification() {
            if (this.selectedDocument) {
                this.selectedDocument.verified_at = null;
                this.selectedDocument.verification_status = null;
                this.selectedDocument.verified_by = null;
                this.verificationNotes = this.selectedDocument.verification_notes || '';
            }
        },

        async completeVerification() {
            this.completingVerification = true;
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.$globals.showMessage('All documents verified successfully', 'success');
                this.$emit('verification-completed');
            } catch (error) {
                console.error('Error completing verification:', error);
                this.$globals.showMessage('Failed to complete verification', 'error');
            } finally {
                this.completingVerification = false;
            }
        },

        downloadDocument() {
            if (!this.selectedDocument) return;
            const link = document.createElement('a');
            link.href = this.selectedDocument.url;
            link.download = this.selectedDocument.name || 'document';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        openInNewTab() {
            if (this.selectedDocument?.url) {
                window.open(this.selectedDocument.url, '_blank');
            }
        },

        formatDocumentType(type) {
            if (!type) return 'Document';
            return type.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        },

        getVerificationStatusLabel(status) {
            if (!status) return 'Pending Review';
            const statusMap = {
                'approved': 'Approved',
                'rejected': 'Rejected',
                'resubmit': 'Resubmit Required'
            };
            return statusMap[status] || 'Pending Review';
        },

        getVerificationStatusClass(status) {
            const classMap = {
                'approved': 'bg-green-100 text-green-800',
                'rejected': 'bg-red-100 text-red-800',
                'resubmit': 'bg-yellow-100 text-yellow-800',
                'default': 'bg-gray-100 text-gray-800'
            };
            return classMap[status] || classMap.default;
        },

        getFileIcon(url) {
            if (!url) return 'fa fa-file text-gray-500';
            
            const extension = url.split('.').pop().toLowerCase();
            const iconMap = {
                'pdf': 'fa fa-file-pdf text-red-500',
                'jpg': 'fa fa-file-image text-blue-500',
                'jpeg': 'fa fa-file-image text-blue-500',
                'png': 'fa fa-file-image text-blue-500',
                'gif': 'fa fa-file-image text-blue-500',
                'doc': 'fa fa-file-word text-blue-600',
                'docx': 'fa fa-file-word text-blue-600',
                'default': 'fa fa-file text-gray-500'
            };
            return iconMap[extension] || iconMap.default;
        },

        isImageFile(url) {
            if (!url) return false;
            const extension = url.split('.').pop().toLowerCase();
            const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
            return imageTypes.includes(extension);
        },

        isPdfFile(url) {
            if (!url) return false;
            return url.split('.').pop().toLowerCase() === 'pdf';
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }
}
</script>

<style scoped>
.document-viewer {
    min-height: 600px;
}
</style>