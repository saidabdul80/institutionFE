<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <!-- Header Section -->
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <img class="h-12 w-auto" src="@/assets/logo.jpg" alt="Institution Logo" />
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">{{ globalStore.school_info?.name || 'Institution Portal' }}</h1>
                            <p class="text-sm text-gray-600">Application Registration</p>
                        </div>
                    </div>
                    <div class="hidden md:flex items-center space-x-4">
                        <router-link to="/applicant/login"
                                     class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Already have an account? Sign In
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Progress Indicator -->
            <div class="mb-8">
                <div class="flex items-center justify-center">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                1
                            </div>
                            <span class="ml-2 text-sm font-medium text-blue-600">Registration</span>
                        </div>
                        <div class="w-16 h-1 bg-gray-200 rounded"></div>
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                                2
                            </div>
                            <span class="ml-2 text-sm font-medium text-gray-500">Application</span>
                        </div>
                        <div class="w-16 h-1 bg-gray-200 rounded"></div>
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                                3
                            </div>
                            <span class="ml-2 text-sm font-medium text-gray-500">Submission</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Registration Form -->
            <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <!-- Form Header -->
                <div class="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-4">
                    <h2 class="text-xl font-bold text-white">Create Your Application Account</h2>
                    <p class="text-blue-100 mt-1">Fill in your details to start your application process</p>
                </div>
                <!-- Form Content -->
                <div class="p-6 space-y-6">
                    <!-- Personal Information Section -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fa fa-user text-blue-500 mr-2"></i>
                            Personal Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <PInput
                                v-model="form.first_name"
                                label="First Name *"
                                class="mb-2"
                                fluid
                                :error_messages="errors.first_name"
                                placeholder="Enter your first name"
                            />
                            <PInput
                                v-model="form.surname"
                                label="Surname *"
                                class="mb-2"
                                fluid
                                :error_messages="errors.surname"
                                placeholder="Enter your surname"
                            />
                            <PInput
                                v-model="form.middle_name"
                                label="Middle Name"
                                class="mb-2"
                                fluid
                                :error_messages="errors.middle_name"
                                placeholder="Enter your middle name (optional)"
                            />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <PInput
                                v-model="form.email"
                                label="Email Address *"
                                type="email"
                                class="mb-2"
                                fluid
                                :error_messages="errors.email"
                                placeholder="Enter your email address"
                            />
                            <PInput
                                v-model="form.phone_number"
                                label="Phone Number *"
                                type="tel"
                                class="mb-2"
                                fluid
                                :error_messages="errors.phone_number"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <!-- Academic Information Section -->
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fa fa-graduation-cap text-green-500 mr-2"></i>
                            Academic Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PSelect
                                @change="loadProgrammes"
                                :options="globalStore.school_info.programme_types"
                                option-value="id"
                                option-label="name"
                                v-model="form.programme_type_id"
                                label="Programme Type *"
                                class="mb-2"
                                fluid
                                :error_messages="errors.programme_type_id"
                                placeholder="Select programme type"
                            />
                            <PSelect
                                :loading="globalStore?.programmesLoading"
                                :options="globalStore.programmes"
                                option-value="id"
                                option-label="name"
                                v-model="form.applied_programme_curriculum_id"
                                label="Programme *"
                                class="mb-2"
                                fluid
                                :error_messages="errors.applied_programme_curriculum_id"
                                placeholder="Select programme"
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" v-if="showOptionalFields">
                            <PSelect
                                v-if="globalStore.getConfiguration('enable_faculty')"
                                @change="loadDepartments"
                                :options="globalStore.school_info.faculties"
                                option-value="id"
                                option-label="name"
                                v-model="form.faculty_id"
                                label="Faculty"
                                class="mb-2"
                                fluid
                                :error_messages="errors.faculty_id"
                                placeholder="Select faculty"
                            />
                            <PSelect
                                v-if="globalStore.getConfiguration('enable_department')"
                                :loading="globalStore?.departmentLoading"
                                :options="globalStore.departments"
                                option-value="id"
                                option-label="name"
                                v-model="form.department_id"
                                label="Department"
                                class="mb-2"
                                fluid
                                :error_messages="errors.department_id"
                                placeholder="Select department"
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" v-if="showOptionalFields">
                            <PSelect
                                v-if="globalStore.getConfiguration('enable_entry_mode')"
                                :options="globalStore.school_info.entry_modes"
                                option-value="id"
                                option-label="title"
                                v-model="form.mode_of_entry_id"
                                label="Entry Mode"
                                class="mb-2"
                                fluid
                                :error_messages="errors.mode_of_entry_id"
                                placeholder="Select entry mode"
                            />
                            <PInput
                                v-model="form.jamb_number"
                                label="JAMB Registration Number"
                                class="mb-2"
                                fluid
                                :error_messages="errors.jamb_number"
                                placeholder="Enter JAMB registration number"
                            />
                        </div>
                    </div>
                    <!-- Security Section -->
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fa fa-lock text-red-500 mr-2"></i>
                            Account Security
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PasswordField
                                label="Password *"
                                class="mb-2"
                                type="password"
                                placeholder="Create a strong password"
                                fluid
                                v-model="form.password"
                                :error_messages="errors.password"
                            />
                            <PasswordField
                                label="Confirm Password *"
                                class="mb-2"
                                type="password"
                                placeholder="Confirm your password"
                                fluid
                                v-model="form.password_confirmation"
                                :error_messages="errors.password_confirmation"
                            />
                        </div>

                        <!-- Password Requirements -->
                        <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                            <ul class="text-xs text-gray-600 space-y-1">
                                <li class="flex items-center">
                                    <i :class="passwordChecks.length ? 'fa fa-check text-green-500' : 'fa fa-times text-red-500'" class="mr-2"></i>
                                    At least 8 characters long
                                </li>
                                <li class="flex items-center">
                                    <i :class="passwordChecks.uppercase ? 'fa fa-check text-green-500' : 'fa fa-times text-red-500'" class="mr-2"></i>
                                    Contains uppercase letter
                                </li>
                                <li class="flex items-center">
                                    <i :class="passwordChecks.lowercase ? 'fa fa-check text-green-500' : 'fa fa-times text-red-500'" class="mr-2"></i>
                                    Contains lowercase letter
                                </li>
                                <li class="flex items-center">
                                    <i :class="passwordChecks.number ? 'fa fa-check text-green-500' : 'fa fa-times text-red-500'" class="mr-2"></i>
                                    Contains number
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Terms and Conditions -->
                    <div class="border-t pt-6">
                        <div class="flex items-start space-x-3">
                            <Checkbox v-model="form.agree_terms" :binary="true" />
                            <div class="text-sm">
                                <label class="text-gray-700">
                                    I agree to the
                                    <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Terms and Conditions</a>
                                    and
                                    <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
                                </label>
                                <p v-if="errors.agree_terms" class="text-red-500 text-xs mt-1">{{ errors.agree_terms[0] }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="border-t pt-6">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <Button
                                :loading="isLoading"
                                @click.prevent="register"
                                type="submit"
                                :disabled="!isFormValid"
                                class="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                                size="large"
                            >
                                <i class="fa fa-user-plus mr-2"></i>
                                Create Account & Continue
                            </Button>
                            <router-link to="/applicant/login"
                                         class="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                <i class="fa fa-sign-in-alt mr-2"></i>
                                Sign In Instead
                            </router-link>
                        </div>

                        <!-- Success Message -->
                        <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div class="flex items-center">
                                <i class="fa fa-check-circle text-green-500 mr-3"></i>
                                <div>
                                    <p class="text-green-800 font-medium">Registration Successful!</p>
                                    <p class="text-green-700 text-sm">{{ successMessage }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
<script>
import { useGlobalsStore } from '@/stores/globals';
import { useAuthStore } from '@/stores/auth';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import PInput from '@/components/PInput.vue';
import PasswordField from '@/components/PasswordField.vue';
import PSelect from '@/components/PSelect.vue';
import { post } from '@/api/client';

export default {
    name: "ApplicationRegister",
    components: {
        InputText,
        PasswordField,
        Button,
        PInput,
        Checkbox,
        PSelect,
    },
    setup() {
        const globalStore = useGlobalsStore();
        const authStore = useAuthStore();
        return { globalStore, authStore };
    },
    data() {
        return {
            isLoading: false,
            successMessage: '',
            showOptionalFields: false,
            form: {
                first_name: '',
                surname: '',
                middle_name: '',
                email: '',
                phone_number: '',
                programme_type_id: '',
                applied_programme_curriculum_id: '',
                faculty_id: '',
                department_id: '',
                mode_of_entry_id: '',
                jamb_number: '',
                password: '',
                password_confirmation: '',
                agree_terms: false
            },
            errors: {},
        };
    },
    computed: {
        passwordChecks() {
            const password = this.form.password;
            return {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password)
            };
        },
        isPasswordValid() {
            return Object.values(this.passwordChecks).every(check => check);
        },
        isFormValid() {
            return this.form.first_name &&
                   this.form.surname &&
                   this.form.email &&
                   this.form.phone_number &&
                   this.form.programme_type_id &&
                   this.form.applied_programme_curriculum_id &&
                   this.form.password &&
                   this.form.password_confirmation &&
                   this.form.password === this.form.password_confirmation &&
                   this.isPasswordValid &&
                   this.form.agree_terms;
        }
    },
    methods: {
        async loadProgrammes() {
            if (this.form.programme_type_id) {
                await this.globalStore.fetchProgrammes(this.form.programme_type_id);
            }
        },

        async loadDepartments() {
            if (this.form.faculty_id) {
                await this.globalStore.fetchDepartmentsByFaculty(this.form.faculty_id);
            }
        },

        async register() {
            this.isLoading = true;
            this.errors = {};

            try {
                // Validate form
                if (!this.isFormValid) {
                    this.$globals.message = {
                        text: 'Please fill in all required fields correctly',
                        type: 'error'
                    };
                    return;
                }

                // Register the applicant
                const response = await post(this.$endpoints.applicant.applicantCreate.url, this.form);

                if (response && !response.error) {
                    this.successMessage = 'Account created successfully! Logging you in...';

                    // Auto-login after successful registration
                    setTimeout(async () => {
                        const loginSuccess = await this.authStore.login(
                            this.form.email,
                            this.form.password,
                            this.$endpoints.applicant.applicantLoginPost.url,
                            'applicant'
                        );

                        if (loginSuccess) {
                            this.$globals.message = {
                                text: 'Welcome! Your account has been created and you are now logged in.',
                                type: 'success'
                            };

                            // Redirect to application dashboard
                            this.$router.push({ name: 'applicant-index' });
                        } else {
                            // If auto-login fails, redirect to login page
                            this.$globals.message = {
                                text: 'Account created successfully! Please log in to continue.',
                                type: 'success'
                            };
                            this.$router.push({ name: 'applicant-login' });
                        }
                    }, 2000);

                } else {
                    this.$globals.message = {
                        text: response?.message || 'Registration failed. Please try again.',
                        type: 'error'
                    };
                }

            } catch (error) {
                console.error('Registration error:', error);

                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors || {};
                    this.$globals.message = {
                        text: 'Please correct the errors below',
                        type: 'error'
                    };
                } else {
                    this.$globals.message = {
                        text: 'Registration failed. Please check your connection and try again.',
                        type: 'error'
                    };
                }
            } finally {
                this.isLoading = false;
            }
        }
    },

    async mounted() {
        // Load initial data if not already loaded
        if (!this.globalStore.school_info.programme_types?.length) {
            // The global store should already have school info loaded
            // If not, we can trigger a reload or use fallback data
            console.log('School info not loaded, using existing data');
        }
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

/* Custom button hover effects */
.p-button {
    transition: all 0.3s ease;
}

.p-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Form field focus effects */
.p-inputtext:focus,
.p-password input:focus,
.p-dropdown:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
}

/* Progress indicator animation */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
    background: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Responsive improvements */
@media (max-width: 768px) {
    .grid-cols-1.md\\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .grid-cols-1.md\\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}

/* Loading state */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

/* Success message animation */
.success-message {
    animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
  