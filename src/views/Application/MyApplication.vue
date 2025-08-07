<template>
    <div v-if="form" class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">My Application</h2>
                    <p class="text-gray-600">Complete and manage your admission application</p>
                    <div v-if="applicationData.is_final_submitted" class="mt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <i class="fa fa-lock mr-1"></i>
                            Final Submitted on {{ formatDate(applicationData.final_submitted_at) }}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="mb-2">
                        <p class="text-sm text-gray-500">Application Status</p>
                        <span :class="getStatusColor(applicationData.admission_status)"
                              class="px-3 py-1 rounded-full text-sm font-medium">
                            {{ applicationData.admission_status || 'Draft' }}
                        </span>
                    </div>

                    <!-- Admission Letter Button -->
                    <div v-if="applicationData.admission_status === 'admitted' && applicationData.published_at" class="mb-2">
                        <router-link to="/application/admission-letter"
                                     class="inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm">
                            <i class="fa fa-graduation-cap mr-2"></i>
                            View Admission Letter
                        </router-link>
                    </div>

                    <!-- Final Submit Button -->
                    <div v-if="!applicationData.is_final_submitted && canFinalSubmit">
                        <button @click="showFinalSubmitDialog = true"
                                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                            <i class="fa fa-check-circle mr-2"></i>
                            Final Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Application Form -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                    <button v-for="(tab, index) in tabs" :key="index"
                            @click="activeTab = index" 
                            :class="activeTab === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                            class="py-4 px-1 border-b-2 font-medium text-sm">
                        {{ tab.title }}
                    </button>
                </nav>
            </div>

            <!-- Personal Information Tab -->
            <div v-show="activeTab === 0" class="p-6">
                <h3 class="text-lg font-semibold mb-6">Personal Information</h3>
                <form @submit.prevent="savePersonalInfo">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                            <input :value="form.first_name"
                                   type="text"
                                   required
                                   disabled
                                   :class="{'border-red-500': !form.first_name && showValidation}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p v-show="!form.first_name && showValidation" class="text-red-500 text-xs mt-1">First name is required</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                            <input :value="form.surname"
                                   type="text"
                                   required
                                   disabled
                                   :class="{'border-red-500': !form.surname && showValidation}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p v-show="!form.surname && showValidation" class="text-red-500 text-xs mt-1">Last name is required</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                            <input :value="form.middle_name" type="text" disabled
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input v-model="form.email" type="email" required :disabled="!canEdit"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <input v-model="form.phone_number" type="tel" required :disabled="!canEdit"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                            <input v-model="form.date_of_birth" type="date" required :disabled="!canEdit"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <select :value="form.gender" required
                            disabled
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                            <select v-model="form.religion"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Religion</option>
                                <option value="Christianity">Christianity</option>
                                <option value="Islam">Islam</option>
                                <option value="Traditional">Traditional</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                            <textarea v-model="form.present_address" rows="3" required
                                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <select v-model="form.state_id" @change="loadLgas" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select State</option>
                                <option v-for="state in safeStates" :key="state.id" :value="state.id">
                                    {{ state.name }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">LGA *</label>
                            <select v-model="form.lga_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select LGA</option>
                                <option v-for="lga in safeLgas" :key="lga.id" :value="lga.id">
                                    {{ lga.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                            <input v-model="form.nationality" type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                            <select v-model="form.religion"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Religion</option>
                                <option value="Christianity">Christianity</option>
                                <option value="Islam">Islam</option>
                                <option value="Traditional">Traditional</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button v-if="canEdit" type="submit" :disabled="loading"
                                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                            <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                            Save Personal Information
                        </button>
                        <div v-else class="text-gray-500 text-sm">
                            <i class="fa fa-lock mr-2"></i>
                            Application has been final submitted and cannot be edited
                        </div>
                    </div>
                </form>
            </div>

            <!-- Academic Information Tab -->
            <div v-show="activeTab === 1" class="p-6">
                <h3 class="text-lg font-semibold mb-6">Academic Information</h3>
                <form @submit.prevent="saveAcademicInfo">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Programme Choice *</label>
                            <select v-if="form.is_imported" :value="form.programme_id" required
                            disabled
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Programme</option>
                                <option v-for="programme in safeProgrammes" :key="programme.id" :value="programme.id">
                                    {{ programme.name }}
                                </option>
                            </select>
                            <select v-else v-model="form.programme_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Programme</option>
                                <option v-for="programme in safeProgrammes" :key="programme.id" :value="programme.id">
                                    {{ programme.name }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Entry Mode *</label>
                            <select :disabled="form.is_imported" v-model="form.mode_of_entry_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Entry Mode</option>
                                <option v-for="mode in modeOfEntryOptions" :key="mode.id" :value="mode.id">
                                    {{ mode.title }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Registration Number</label>
                            <input :disabled="form.is_imported" v-model="form.jamb_number" type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            
                            <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Score</label>
                            <input v-if="!form.is_imported" v-model="form.jamb_score" type="number" min="0" max="400"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <input disabled :value="Object.values(form.jamb_subject_scores).reduce((a, b) => a + b, 0)" v-else
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button type="submit" :disabled="loading"  v-if="!form.is_imported"
                                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                            <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                            Save Academic Information
                        </button>
                    </div>
                </form>
            </div>

            <!-- O-Level Results Tab -->
            <div v-show="activeTab === 2" class="p-6">
                <OLevelResults :canEdit="canEdit" />
            </div>

            <!-- A-Level Results Tab -->
            <div v-show="activeTab === 3" class="p-6">
                <ALevelResults :canEdit="canEdit" />
            </div>

            <!-- Guardian Information Tab -->
            <div v-show="activeTab === 4" class="p-6">
                <h3 class="text-lg font-semibold mb-6">Guardian Information</h3>
                <form @submit.prevent="saveGuardianInfo">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Guardian Name *</label>
                            <input v-model="form.guardian_full_name" type="text" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Guardian Phone *</label>
                            <input v-model="form.guardian_phone_number" type="tel" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Guardian Email</label>
                            <input v-model="form.guardian_email" type="email"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                            <select v-model="form.guardian_relationship" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Relationship</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Uncle">Uncle</option>
                                <option value="Aunt">Aunt</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Guardian Address *</label>
                            <textarea v-model="form.guardian_address" rows="3" required
                                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button v-if="canEdit" type="submit" :disabled="loading"
                                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                            <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                            Save Guardian Information
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Final Submission Dialog -->
        <div v-if="showFinalSubmitDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Final Submit Application</h3>

                <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex items-start">
                        <i class="fa fa-exclamation-triangle text-yellow-600 mr-3 mt-1"></i>
                        <div class="text-sm text-yellow-800">
                            <p class="font-medium mb-1">Important Notice:</p>
                            <p>Once you final submit your application, you will no longer be able to edit any information. Please ensure all your details are correct before proceeding.</p>
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea v-model="finalSubmissionNotes" rows="3"
                              placeholder="Add any additional notes..."
                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="showFinalSubmitDialog = false"
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="performFinalSubmit" :disabled="finalSubmitting"
                            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                        <i v-if="finalSubmitting" class="fa fa-spinner fa-spin mr-2"></i>
                        {{ finalSubmitting ? 'Submitting...' : 'Final Submit' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Acknowledgment Slip Modal -->
        <div v-if="showAcknowledgmentSlipModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-lg font-semibold text-gray-800">
                        <i class="fa fa-file-alt mr-2 text-blue-600"></i>
                        Application Acknowledgment Slip
                    </h3>
                    <div class="flex items-center gap-2">
                        <button @click="downloadAcknowledgmentSlip"
                                class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                            <i class="fa fa-download mr-1"></i>
                            Download PDF
                        </button>
                        <button @click="printAcknowledgmentSlip"
                                class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                            <i class="fa fa-print mr-1"></i>
                            Print
                        </button>
                        <button @click="showAcknowledgmentSlipModal = false"
                                class="text-gray-400 hover:text-gray-600">
                            <i class="fa fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                <div class="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div v-if="acknowledgmentSlipHtml"
                         v-html="acknowledgmentSlipHtml"
                         class="acknowledgment-slip-content">
                    </div>
                    <div v-else class="text-center py-8">
                        <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                        <p class="text-gray-600 mt-2">Loading acknowledgment slip...</p>
                    </div>
                </div>

                <div class="p-4 border-t bg-gray-50">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-600">
                            <i class="fa fa-info-circle mr-1"></i>
                            Keep this acknowledgment slip for your records
                        </div>
                        <button @click="showAcknowledgmentSlipModal = false"
                                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import OLevelResults from './OLevelResults.vue';
import ALevelResults from './ALevelResults.vue';
import userDataMixin from '@/mixins/userDataMixin';
import { useGlobalsStore } from '@/stores/globals';

export default {
    components: {
        OLevelResults,
        ALevelResults
    },
    mixins: [userDataMixin],
    data() {
        return {
            activeTab: 0,
            loading: false,
            showValidation: false,
            applicationData: {},
            form: {
                first_name: '',
                surname: '',
                middle_name: '',
                email: '',
                phone: '',
                phone_number: '',
                date_of_birth: '',
                gender: '',
                state_id: '',
                lga_id: '',
                address: '',
                nationality: '',
                religion: '',
                applied_programme_curriculum_id: '',
                mode_of_entry_id: '',
                jamb_number: '',
                jamb_score: ''
            },
            states: [],
            lgas: [],
            programmes: [],
            tabs: [
                { title: 'Personal Information' },
                { title: 'Academic Information' },
                { title: 'O-Level Results' },
                { title: 'A-Level Results' },
                { title: 'Guardian Information' }
            ],
            modeOfEntryOptions:[],
            store: useAuthStore(),

            // Final submission
            showFinalSubmitDialog: false,
            finalSubmitting: false,
            finalSubmissionNotes: '',

            // Acknowledgment slip
            showAcknowledgmentSlipModal: false,
            acknowledgmentSlipHtml: null
        }
    },
    computed: {
        // Safe form validation to prevent DOM errors
        isFormValid() {
            if (!this.form) return false;
            const requiredFields = ['first_name', 'surname', 'email', 'phone_number'];
            return requiredFields.every(field => this.form[field]?.trim());
        },

        canEdit() {
            return !this.applicationData?.is_final_submitted;
        },

        canFinalSubmit() {
            // Can final submit if form is valid and not already submitted
            return this.isFormValid && !this.applicationData?.is_final_submitted;
        },

        // Safe array access for templates
        safeStates() {
            return this.states || [];
        },

        safeLgas() {
            return this.lgas || [];
        },

        safeProgrammes() {
            return this.programmes || [];
        }
    },
    watch: {
        // Watch for form changes and handle them safely
        'form.state_id': {
            handler(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    this.$nextTick(() => {
                        this.loadLgas();
                    });
                }
            }
        }
    },
    methods: {
        getStatusColor(status) {
            const colors = {
                'draft': 'bg-gray-100 text-gray-800',
                'submitted': 'bg-blue-100 text-blue-800',
                'not admitted': 'bg-yellow-100 text-yellow-800',
                'admitted': 'bg-green-100 text-green-800',
                'rejected': 'bg-red-100 text-red-800'
            };
            return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        },
        async loadApplicationData() {
            try {
                // Load from auth store first
                if (this.store.getUser) {
                    this.applicationData = this.store.getUser;
                    this.form = { ...this.store.getUser };
                }

                // Also fetch fresh data from backend to ensure consistency
                const res = await get(this.$endpoints.applicant.applicantSelf.url);
                if (res && !res.error) {
                    // Use nextTick to ensure proper DOM updates
                    await this.$nextTick();

                    this.applicationData = res;

                    // Safely merge form data to prevent reactivity issues
                    const newFormData = {
                        ...this.form,
                        ...res,
                        // Ensure proper data types for form fields
                        first_name: res.first_name || '',
                        surname: res.surname || '',
                        middle_name: res.middle_name || '',
                        email: res.email || '',
                        phone: res.phone || '',
                        phone_number: res.phone_number || res.phone || '',
                        date_of_birth: res.date_of_birth || '',
                        gender: res.gender || '',
                        state_id: res.state_id || '',
                        lga_id: res.lga_id || '',
                        address: res.address || '',
                        nationality: res.nationality || '',
                        religion: res.religion || '',
                        applied_programme_curriculum_id: res.applied_programme_curriculum_id || '',
                        mode_of_entry_id: res.mode_of_entry_id || '',
                        jamb_number: res.jamb_number || '',
                        jamb_score: res.jamb_score || ''
                    };

                    // Update form data in next tick to prevent DOM conflicts
                    try {
                        await this.$nextTick();
                        Object.assign(this.form, newFormData);
                        // Update auth store with fresh data
                        this.store.userInfo = res;
                    } catch (updateError) {
                        console.error('Form data update error:', updateError);
                        // Fallback: direct assignment
                        this.form = newFormData;
                        this.store.userInfo = res;
                    }
                }
            } catch (error) {
                console.error('Error loading application data:', error);
                // If API fails, still use auth store data
                if (this.store.getUser) {
                    this.applicationData = this.store.getUser;
                    this.form = { ...this.store.getUser };
                }
            }
        },
        async loadStates() {
            try {
                const res = await get('api/states');
                if (res) {
                    this.states = res;
                }
            } catch (error) {
                console.error('Error loading states:', error);
            }
        },
        async loadLgas() {
            if (!this.form.state_id) return;
            try {
                const res = await get(`api/lgas/${this.form.state_id}`);
                if (res) {
                    this.lgas = res;
                }
            } catch (error) {
                console.error('Error loading LGAs:', error);
            }
        },
        async loadProgrammes() {
            try {
                const res = await get('api/programmes');
                if (res) {
                    this.programmes = res;
                }
            } catch (error) {
                console.error('Error loading programmes:', error);
            }
        },
        async savePersonalInfo() {
            this.loading = true;
            this.showValidation = true;
            const globals  = useGlobalsStore()

            try {
                // Validate required fields before sending
                const requiredFields = ['first_name', 'surname', 'email', 'phone_number'];
                const missingFields = requiredFields.filter(field => !this.form[field]?.trim());

                if (missingFields.length > 0) {
                    this.$globals.message = {
                        type: 'error',
                        text: `Please fill in required fields: ${missingFields.join(', ')}`
                    };
                    this.loading = false;
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.form.email)) {
                    this.$globals.message = {
                        type: 'error',
                        text: 'Please enter a valid email address'
                    };
                    this.loading = false;
                    return;
                }

                // Prepare form data, ensuring proper format
                const formData = {
                    ...this.form,
                    id: this.store.getUser?.id || this.applicationData?.id
                };


                const res = await post(this.$endpoints.applicant.updateApplicant.url, formData);

                if (res && !res.error) {
                    try {
                        // Use nextTick to ensure DOM updates are handled properly
                        await this.$nextTick();

                        this.showValidation = false; // Hide validation errors on success

                        this.$globals.message = {
                            text: 'Personal information saved successfully',
                            type: 'success'
                        };

                        // Update application data and auth store safely
                        await this.$nextTick();
                        this.applicationData = { ...this.applicationData, ...res };
                        this.store.userInfo = { ...this.store.userInfo, ...res };
                        globals.showMessage ( 'Personal information saved successfully','success');
                        setTimeout(() => {
                            globals.message.text = '';
                        }, 3000);
                    } catch (domError) {
                        console.error('DOM update error:', domError);
                        // Still show success message even if DOM update fails
                        globals.message = {
                            text: 'Personal information saved successfully',
                            type: 'success'
                        };
                    }
                } else {
                    this.$globals.message = {
                        type: 'error',
                        text: res?.message || 'Failed to update personal information'
                    };
                }
            } catch (error) {
                console.error('Error saving personal info:', error);
                this.$globals.message = {
                    type: 'error',
                    text: error.response?.data?.message || 'An error occurred while saving your information'
                };
            } finally {
                this.loading = false;
            }
        },
        async saveAcademicInfo() {
            this.loading = true;
            try {
                const res = await post(this.$endpoints.applicant.updateApplicant.url, this.form);
                if (res && !res.error) {
                    this.$globals.message = {
                        text: 'Academic information saved successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error saving academic info:', error);
            } finally {
                this.loading = false;
            }
        },
        async saveGuardianInfo() {
            this.loading = true;
            try {
                const res = await post(this.$endpoints.applicant.updateApplicant.url, this.form);
                if (res && !res.error) {
                    this.$globals.message = {
                        text: 'Guardian information saved successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error saving guardian info:', error);
            } finally {
                this.loading = false;
            }
        },

        // Final submission methods
        async performFinalSubmit() {
            this.finalSubmitting = true;
            try {
                const response = await post(this.$endpoints.applicant.finalSubmit.url, {
                    notes: this.finalSubmissionNotes
                });

                if (response && !response.error) {
                    this.applicationData.is_final_submitted = true;
                    this.applicationData.final_submitted_at = response.final_submitted_at;

                    this.$globals.message = {
                        text: 'Application has been final submitted successfully',
                        type: 'success'
                    };

                    this.showFinalSubmitDialog = false;
                    this.finalSubmissionNotes = '';

                    // Show acknowledgment slip if available
                    if (response.acknowledgment_slip) {
                        this.showAcknowledgmentSlip(response.acknowledgment_slip);
                    }

                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 5000);
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Error submitting application',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error in final submission:', error);
                this.$globals.message = {
                    text: error.response?.data?.message || 'Error submitting application',
                    type: 'error'
                };
            } finally {
                this.finalSubmitting = false;
            }
        },

        // Acknowledgment slip methods
        showAcknowledgmentSlip(acknowledgmentSlipData) {
            if (acknowledgmentSlipData && acknowledgmentSlipData.html) {
                this.acknowledgmentSlipHtml = acknowledgmentSlipData.html;
                this.showAcknowledgmentSlipModal = true;
            }
        },

        async downloadAcknowledgmentSlip() {
            try {
                const response = await get(this.$endpoints.applicant.downloadAcknowledgmentSlip.url);
                if (response && !response.error && response.html) {
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
                }
            } catch (error) {
                console.error('Error downloading acknowledgment slip:', error);
                this.$globals.message = {
                    text: 'Failed to download acknowledgment slip',
                    type: 'error'
                };
            }
        },

        printAcknowledgmentSlip() {
            if (this.acknowledgmentSlipHtml) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(this.acknowledgmentSlipHtml);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            }
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    async mounted() {
        try {
            // Initialize with a small delay to ensure DOM is ready
            await this.$nextTick();

            await this.loadApplicationData();
            await this.loadStates();
            await this.loadProgrammes();
            this.modeOfEntryOptions = this.schoolEntryModes;
            // Load LGAs if state is already selected
            if (this.form?.state_id) {
                await this.loadLgas();
            }
        } catch (error) {
            console.error('Component initialization error:', error);
            // Ensure basic data is still loaded
            try {
                await this.loadStates();
                await this.loadProgrammes();
            } catch (fallbackError) {
                console.error('Fallback loading error:', fallbackError);
            }
        }
    }
}
</script>

<style scoped>
.tab-button {
    @apply px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200;
}

.tab-button.active {
    @apply bg-blue-500 text-white;
}

.tab-button:not(.active) {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

/* Admission Letter Styles */
.admission-letter-content {
    font-family: "Times New Roman", serif;
    line-height: 1.6;
    color: #333;
}

.admission-letter-content .header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #000;
    padding-bottom: 20px;
}

.admission-letter-content .school-name {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
    text-transform: uppercase;
}

.admission-letter-content .letter-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin: 30px 0;
    text-decoration: underline;
}

.admission-letter-content .details-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.admission-letter-content .details-table th,
.admission-letter-content .details-table td {
    border: 1px solid #333;
    padding: 8px;
    text-align: left;
}

.admission-letter-content .details-table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.admission-letter-content .signature-section {
    margin-top: 50px;
}

.admission-letter-content .signature-box {
    display: inline-block;
    width: 200px;
    text-align: center;
    margin: 0 50px;
}

.admission-letter-content .signature-line {
    border-bottom: 1px solid #333;
    margin-bottom: 5px;
    height: 50px;
}

.admission-letter-content .footer {
    margin-top: 40px;
    text-align: center;
    font-size: 12px;
    border-top: 1px solid #ccc;
    padding-top: 20px;
}
</style>
