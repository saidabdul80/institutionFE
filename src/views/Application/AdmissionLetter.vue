<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Admission Letter</h2>
                        <p class="text-gray-600">View and download your official admission letter</p>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="downloadAdmissionLetter" 
                                class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            <i class="fa fa-download mr-2"></i>
                            Download PDF
                        </button>
                        <router-link to="/applicant/dashboard" 
                                     class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                            <i class="fa fa-arrow-left mr-2"></i>
                            Back to Dashboard
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Admission Letter Content -->
            <div class="bg-white rounded-lg shadow-md p-8">
                <div v-if="loading" class="text-center py-12">
                    <i class="fa fa-spinner fa-spin text-3xl text-gray-400"></i>
                    <p class="text-gray-600 mt-4">Loading admission letter...</p>
                </div>
                
                <div v-else-if="admissionLetterHtml" class="w-full">
                    <iframe 
                        srcdoc=""
                        ref="letterIframe"
                        class="w-full min-h-[800px] border border-gray-200 rounded-md"
                        frameborder="0"
                        @load="onIframeLoad"
                    ></iframe>
                </div>
                
                <div v-else class="text-center py-12">
                    <i class="fa fa-exclamation-circle text-3xl text-red-400"></i>
                    <p class="text-red-600 mt-4">{{ errorMessage || 'Failed to load admission letter' }}</p>
                    <button @click="loadAdmissionLetter" 
                            class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        <i class="fa fa-refresh mr-2"></i>
                        Retry
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

export default {
    name: 'AdmissionLetter',
    data() {
        return {
            loading: false,
            admissionLetterHtml: '',
            errorMessage: '',
            store: useAuthStore()
        }
    },
    
    async mounted() {
        await this.loadAdmissionLetter()
    },
    
    methods: {
        async loadAdmissionLetter() {
            this.loading = true
            this.errorMessage = ''
            
            try {
                const response = await get(this.$endpoints.applicant.getAdmissionLetter.url)
                
                if (response && !response.error) {
                    this.admissionLetterHtml = response.admission_letter_html
                    // Set the iframe content after it's loaded
                    if (this.$refs.letterIframe) {
                        this.$refs.letterIframe.srcdoc = this.getCompleteHtml(this.admissionLetterHtml)
                    }
                } else {
                    this.errorMessage = response?.message || 'Error loading admission letter'
                }
            } catch (error) {
                console.error('Error loading admission letter:', error)
                this.errorMessage = error.response?.data?.message || 'Error loading admission letter'
            } finally {
                this.loading = false
            }
        },

        onIframeLoad() {
            // When iframe is loaded, set its content if we have it
            if (this.admissionLetterHtml && this.$refs.letterIframe) {
                this.$refs.letterIframe.srcdoc = this.getCompleteHtml(this.admissionLetterHtml)
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

        async downloadAdmissionLetter() {
            try {
                const response = await fetch(this.$endpoints.applicant.downloadAdmissionLetter.url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.store.getToken}`,
                        'Accept': 'application/pdf'
                    }
                })

                if (response.ok) {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `admission_letter_${this.store.getUser?.application_number || 'download'}.pdf`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    window.URL.revokeObjectURL(url)
                } else {
                    this.$globals.message = {
                        text: 'Error downloading admission letter',
                        type: 'error'
                    }
                }
            } catch (error) {
                console.error('Error downloading admission letter:', error)
                this.$globals.message = {
                    text: 'Error downloading admission letter',
                    type: 'error'
                }
            }
        }
    }
}
</script>