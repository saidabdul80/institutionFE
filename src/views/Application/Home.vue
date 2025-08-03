<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <!-- Payment Guidance for Imported Applicants -->
        <PaymentGuidance v-if="showPaymentGuidance" @dismiss="dismissPaymentGuidance" />

        <!-- Welcome Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-200">
                        Welcome, {{ applicantInfo.first_name || 'Applicant' }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base transition-colors duration-200">{{ applicantInfo.email }}</p>
                    <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                        Application ID: {{ applicantInfo.application_id || 'N/A' }}
                    </p>
                </div>
                <div class="flex-shrink-0 text-left sm:text-right">
                    <p class="text-xs sm:text-sm text-gray-500 mb-2">Application Status</p>
                    <span :class="getStatusColor(applicantInfo.status)"
                          class="inline-block px-3 py-2 rounded-full text-xs sm:text-sm font-medium">
                        {{ applicantInfo.status || 'Pending' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Application Progress -->
        <!-- 

            <div class="block sm:hidden space-y-4">
                <div v-for="(step, index) in progressStepsArray" :key="index"
                     class="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                    <div :class="step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                         class="w-10 h-10 rounded-full flex items-center justify-center font-medium flex-shrink-0">
                        <i v-if="step.completed" class="fa fa-check text-sm"></i>
                        <span v-else class="text-sm">{{ index + 1 }}</span>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-800">{{ step.title }}</p>
                        <p class="text-xs text-gray-500">{{ step.description }}</p>
                    </div>
                    <div v-if="step.completed" class="text-green-500">
                        <i class="fa fa-check-circle"></i>
                    </div>
                </div>
            </div>


            <div class="hidden sm:block">
                <div class="flex items-center justify-between">
                    <div v-for="(step, index) in progressStepsArray" :key="index"
                         class="flex flex-col items-center flex-1">
                        <div class="flex items-center w-full">
                            <div :class="step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
                                 class="w-10 h-10 rounded-full flex items-center justify-center font-medium mx-auto">
                                <i v-if="step.completed" class="fa fa-check"></i>
                                <span v-else>{{ index + 1 }}</span>
                            </div>
                            <div v-if="index < progressStepsArray.length - 1"
                                 class="flex-1 h-1 bg-gray-200 ml-4">
                                <div :class="step.completed ? 'bg-green-500' : 'bg-gray-300'"
                                     class="h-full transition-all duration-500"
                                     :style="`width: ${step.completed ? '100%' : '0%'}`"></div>
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <p class="text-sm font-medium text-gray-800">{{ step.title }}</p>
                            <p class="text-xs text-gray-500 mt-1">{{ step.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center">
                    <div class="bg-white/20 rounded-full p-3 mr-4">
                        <i class="fa fa-file-text text-xl sm:text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Documents Uploaded</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ stats.documentsUploaded }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center">
                    <div class="bg-white/20 rounded-full p-3 mr-4">
                        <i class="fa fa-credit-card text-xl sm:text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Payments Made</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ stats.paymentsMade }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                <div class="flex items-center">
                    <div class="bg-white/20 rounded-full p-3 mr-4">
                        <i class="fa fa-calendar text-xl sm:text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Days Since Application</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ stats.daysSinceApplication }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Quick Actions</h3>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <button @click="$router.push({name: 'applicant-application'})"
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-blue-500 rounded-full p-3 mb-3 group-hover:bg-blue-600 transition-colors">
                        <i class="fa fa-edit text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Update Application</span>
                </button>

                <button @click="$router.push({name: 'applicant-documents'})"
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-green-500 rounded-full p-3 mb-3 group-hover:bg-green-600 transition-colors">
                        <i class="fa fa-upload text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Upload Documents</span>
                </button>

                <button @click="$router.push({name: 'applicant-payments'})"
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-purple-500 rounded-full p-3 mb-3 group-hover:bg-purple-600 transition-colors">
                        <i class="fa fa-credit-card text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">Make Payment</span>
                </button>

                <button @click="$router.push({name: 'applicant-profile'})"
                        class="group flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105">
                    <div class="bg-yellow-500 rounded-full p-3 mb-3 group-hover:bg-yellow-600 transition-colors">
                        <i class="fa fa-user text-lg sm:text-xl text-white"></i>
                    </div>
                    <span class="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight">View Profile</span>
                </button>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h3 class="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Recent Activities</h3>
            <div class="space-y-3 sm:space-y-4">
                <div v-for="activity in recentActivities" :key="activity.id"
                     class="flex items-center p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200">
                    <div class="flex-shrink-0 mr-3 sm:mr-4">
                        <div class="bg-white rounded-full p-2 sm:p-3 shadow-sm">
                            <i :class="activity.icon" class="text-lg sm:text-xl"></i>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm sm:text-base font-medium text-gray-800 truncate">{{ activity.title }}</p>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ activity.date }}</p>
                    </div>
                    <div class="flex-shrink-0 ml-3">
                        <span :class="getActivityStatusColor(activity.status)"
                              class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                            {{ activity.status }}
                        </span>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="recentActivities.length === 0" class="text-center py-8">
                    <i class="fa fa-clock-o text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No recent activities</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { userDataMixin } from '@/mixins/userDataMixin';
import PaymentGuidance from '@/components/Application/PaymentGuidance.vue';

export default {
    components: {
        PaymentGuidance
    },
    mixins: [userDataMixin],
    data() {
        return {
            applicantInfo: {},
            showPaymentGuidance: false,
            progressSteps: {
                personalInfo: false,
                documents: false,
                payment: false
            },
            stats: {
                documentsUploaded: 0,
                paymentsMade: 0,
                daysSinceApplication: 0
            },
            recentActivities: [
                {
                    id: 1,
                    title: 'Application submitted',
                    date:  '',
                    icon: 'fa fa-file-text',
                    status: 'Completed'
                },
                // {
                //     id: 2,
                //     title: 'Documents uploaded',
                //     date: '1 day ago',
                //     icon: 'fa fa-upload',
                //     status: 'Pending Review'
                // },
                // {
                //     id: 3,
                //     title: 'Payment initiated',
                //     date: '6 hours ago',
                //     icon: 'fa fa-credit-card',
                //     status: 'Processing'
                // }
            ],
            store: useAuthStore()
        }
    },
    computed: {
        progressStepsArray() {
            return [
                {
                    title: 'Personal Information',
                    description: 'Complete your personal details',
                    completed: this.progressSteps.personalInfo
                },
                {
                    title: 'Document Upload',
                    description: 'Upload required documents',
                    completed: this.progressSteps.documents
                },
                {
                    title: 'Payment',
                    description: 'Complete application payment',
                    completed: this.progressSteps.payment
                }
            ];
        }
    },
    methods: {
        getStatusColor(status) {
            const colors = {
                'pending': 'bg-yellow-100 text-yellow-800',
                'approved': 'bg-green-100 text-green-800',
                'rejected': 'bg-red-100 text-red-800',
                'under_review': 'bg-blue-100 text-blue-800'
            };
            return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        },
        getActivityStatusColor(status) {
            const colors = {
                'completed': 'bg-green-100 text-green-800',
                'pending review': 'bg-yellow-100 text-yellow-800',
                'processing': 'bg-blue-100 text-blue-800',
                'failed': 'bg-red-100 text-red-800'
            };
            return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        },
        async loadApplicantData() {
            try {
                // First load from auth store for immediate display
                if (this.store.getUser) {
                    this.applicantInfo = this.store.getUser;
                    this.calculateProgress();
                    this.calculateStats();
                }

                // Then fetch fresh data from backend using mixin
                const freshData = await this.refreshUserData();
                if (freshData) {
                    this.applicantInfo = freshData;
                    this.calculateProgress();
                    this.calculateStats();
                    this.checkPaymentRequirement();
                }
            } catch (error) {
                console.error('Error loading applicant data:', error);
            }
        },
        onUserDataUpdated(userData) {
            // Handle user data updates from mixin
            this.applicantInfo = userData;
            this.calculateProgress();
            this.calculateStats();
            this.checkPaymentRequirement();
        },
        calculateProgress() {
            // Check if personal info is complete
            this.progressSteps.personalInfo = !!(
                this.applicantInfo.first_name &&
                this.applicantInfo.last_name &&
                this.applicantInfo.email
            );

            // Check if documents are uploaded (you'll need to implement this based on your API)
            this.progressSteps.documents = this.stats.documentsUploaded > 0;

            // Check if payment is made
            this.progressSteps.payment = this.stats.paymentsMade > 0;
        },
        calculateStats() {
            // Calculate days since application
            if (this.applicantInfo.created_at) {
                const applicationDate = new Date(this.applicantInfo.created_at);
                const today = new Date();
                const diffTime = Math.abs(today - applicationDate);
                this.stats.daysSinceApplication = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        },
        checkPaymentRequirement() {
            // Check if this is an imported applicant who hasn't paid application fee
            const isImported = this.applicantInfo.is_imported;
            const hasNotPaid = !this.applicantInfo.application_fee_paid;
            const isDismissed = localStorage.getItem('payment_guidance_dismissed') === 'true';

            this.showPaymentGuidance = isImported && hasNotPaid && !isDismissed;
        },
        dismissPaymentGuidance() {
            this.showPaymentGuidance = false;
            localStorage.setItem('payment_guidance_dismissed', 'true');
        }
    },
   // In your component
    async mounted() {
    await this.loadApplicantData();
    // Listen for user data updates from mixin
    this.emitter.on('user-data-updated', this.onUserDataUpdated);
    },
    beforeUnmount() {
    this.emitter.off('user-data-updated', this.onUserDataUpdated);
    }
}
</script>
