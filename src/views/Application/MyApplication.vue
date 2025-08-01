<template>
    <div v-if="form" class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">My Application</h2>
                    <p class="text-gray-600">Complete and manage your admission application</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Application Status</p>
                    <span :class="getStatusColor(applicationData.admission_status)" 
                          class="px-3 py-1 rounded-full text-sm font-medium">
                        {{ applicationData.admission_status || 'Draft' }}
                    </span>
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
                            <input v-model="form.first_name"
                                   type="text"
                                   required
                                   :class="{'border-red-500': !form.first_name && showValidation}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p v-show="!form.first_name && showValidation" class="text-red-500 text-xs mt-1">First name is required</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                            <input v-model="form.surname"
                                   type="text"
                                   required
                                   :class="{'border-red-500': !form.surname && showValidation}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p v-show="!form.surname && showValidation" class="text-red-500 text-xs mt-1">Last name is required</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                            <input v-model="form.middle_name" type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input v-model="form.email" type="email" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <input v-model="form.phone_number" type="tel" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                            <input v-model="form.dob" type="date" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <select v-model="form.gender" required
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
                        <button type="submit" :disabled="loading"
                                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                            <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                            Save Personal Information
                        </button>
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
                            <select v-model="form.programme_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Programme</option>
                                <option v-for="programme in safeProgrammes" :key="programme.id" :value="programme.id">
                                    {{ programme.name }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Entry Mode *</label>
                            <select v-model="form.mode_of_entry_id" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Entry Mode</option>
                                <option v-for="mode in modeOfEntryOptions" :key="mode.id" :value="mode.id">
                                    {{ mode.title }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Registration Number</label>
                            <input v-model="form.jamb_number" type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Score</label>
                            <input v-model="form.jamb_score" type="number" min="0" max="400"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button type="submit" :disabled="loading"
                                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                            <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                            Save Academic Information
                        </button>
                    </div>
                </form>
            </div>

            <!-- O-Level Results Tab -->
            <div v-show="activeTab === 2" class="p-6">
                <OLevelResults />
            </div>

            <!-- A-Level Results Tab -->
            <div v-show="activeTab === 3" class="p-6">
                <ALevelResults />
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
                        <button type="submit" :disabled="loading"
                                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                            <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                            Save Guardian Information
                        </button>
                    </div>
                </form>
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
                applied_programme_id: '',
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
            store: useAuthStore()
        }
    },
    computed: {
        // Safe form validation to prevent DOM errors
        isFormValid() {
            if (!this.form) return false;
            const requiredFields = ['first_name', 'surname', 'email', 'phone_number'];
            return requiredFields.every(field => this.form[field]?.trim());
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
                        applied_programme_id: res.applied_programme_id || '',
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

                        setTimeout(() => {
                            this.$globals.message.text = '';
                        }, 3000);
                    } catch (domError) {
                        console.error('DOM update error:', domError);
                        // Still show success message even if DOM update fails
                        this.$globals.message = {
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
