<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Application Acknowledgment Slip</h2>
                    <p class="text-gray-600">Your application submission confirmation</p>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="downloadAcknowledgmentSlip" 
                            :disabled="loading"
                            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                        <i class="fa fa-download"></i>
                        <span>Download PDF</span>
                    </button>
                    <button @click="printAcknowledgmentSlip" 
                            :disabled="loading || !acknowledgmentSlipHtml"
                            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center gap-2">
                        <i class="fa fa-print"></i>
                        <span>Print</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Status Check -->
        <div v-if="!applicantInfo.is_final_submitted" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
                <i class="fa fa-exclamation-triangle text-yellow-600 mr-3"></i>
                <div>
                    <h3 class="font-medium text-yellow-800">Application Not Final Submitted</h3>
                    <p class="text-yellow-700 text-sm mt-1">
                        You need to final submit your application before you can access the acknowledgment slip.
                    </p>
                    <button @click="$router.push({name: 'applicant-application'})" 
                            class="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                        Complete Application
                    </button>
                </div>
            </div>
        </div>

        <!-- Acknowledgment Slip Content -->
        <div v-else class="bg-white rounded-lg shadow-md">
            <div v-if="loading" class="text-center py-12">
                <i class="fa fa-spinner fa-spin text-3xl text-gray-400"></i>
                <p class="text-gray-600 mt-4">Loading acknowledgment slip...</p>
            </div>
            
            <div v-else-if="acknowledgmentSlipHtml" class="w-full p-2">
                <iframe 
                    srcdoc=""
                    ref="slipIframe"
                    class="w-full min-h-[800px] border border-gray-200 rounded-md"
                    frameborder="0"
                    @load="onIframeLoad"
                ></iframe>
            </div>
            
            <div v-else class="text-center py-12">
                <i class="fa fa-exclamation-circle text-3xl text-red-400"></i>
                <p class="text-red-600 mt-4">{{ errorMessage || 'Failed to load acknowledgment slip' }}</p>
                <button @click="loadAcknowledgmentSlip" 
                        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    <i class="fa fa-refresh mr-2"></i>
                    Retry
                </button>
            </div>
        </div>

        <!-- Information Panel -->
        <div v-if="applicantInfo.is_final_submitted" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div class="flex items-start">
                <i class="fa fa-info-circle text-blue-600 mr-3 mt-1"></i>
                <div>
                    <h3 class="font-medium text-blue-800">Important Information</h3>
                    <ul class="text-blue-700 text-sm mt-2 space-y-1">
                        <li>• Keep this acknowledgment slip for your records</li>
                        <li>• This confirms that your application has been successfully submitted</li>
                        <li>• You will be notified via email about your admission status</li>
                        <li>• Check your email regularly for updates on your application</li>
                        <li>• Contact the admissions office if you have any questions</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get } from '@/api/client';
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'AcknowledgmentSlip',
    data() {
        return {
            acknowledgmentSlipHtml: null,
            loading: false,
            errorMessage: null,
            applicantInfo: {}
        }
    },
    async mounted() {
        await this.loadApplicantInfo();
        if (this.applicantInfo.is_final_submitted) {
            await this.loadAcknowledgmentSlip();
        }
    },
    methods: {
        async loadApplicantInfo() {
            try {
                const authStore = useAuthStore();
                this.applicantInfo = authStore.getUser || {};
            } catch (error) {
                console.error('Error loading applicant info:', error);
            }
        },

        async loadAcknowledgmentSlip() {
            this.loading = true;
            this.errorMessage = null;
            
            try {
                const response = await get(this.$endpoints.applicant.downloadAcknowledgmentSlip.url);
                
                if (response && !response.error) {
                    this.acknowledgmentSlipHtml = response.html;
                    // Set the iframe content after it's loaded
                    if (this.$refs.slipIframe) {
                        this.$refs.slipIframe.srcdoc = this.getCompleteHtml(this.acknowledgmentSlipHtml);
                    }
                } else {
                    this.errorMessage = response?.message || 'Failed to load acknowledgment slip';
                }
            } catch (error) {
                console.error('Error loading acknowledgment slip:', error);
                this.errorMessage = 'Error loading acknowledgment slip';
            } finally {
                this.loading = false;
            }
        },

        onIframeLoad() {
            // When iframe is loaded, set its content if we have it
            if (this.acknowledgmentSlipHtml && this.$refs.slipIframe) {
                this.$refs.slipIframe.srcdoc = this.getCompleteHtml(this.acknowledgmentSlipHtml);
            }
        },

        getCompleteHtml(content) {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `
        },

        async downloadAcknowledgmentSlip() {
            try {
                const response = await get(this.$endpoints.applicant.downloadAcknowledgmentSlip.url);
                
                if (response && !response.error) {
                    // Create a blob and download
                    const blob = new Blob([response.html], { type: 'text/html' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = response.filename || 'acknowledgment_slip.html';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    this.$globals.message = {
                        text: 'Acknowledgment slip downloaded successfully',
                        type: 'success'
                    };
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to download acknowledgment slip',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error downloading acknowledgment slip:', error);
                this.$globals.message = {
                    text: 'Error downloading acknowledgment slip',
                    type: 'error'
                };
            }
        },

        printAcknowledgmentSlip() {
            if (this.acknowledgmentSlipHtml && this.$refs.slipIframe) {
                this.$refs.slipIframe.contentWindow.print();
            }
        }
    }
}
</script>