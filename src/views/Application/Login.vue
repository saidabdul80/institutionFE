<template>
    <div class="min-h-screen bg-gradient-to-br flex items-center justify-center from-blue-50 via-white to-green-50">
        <!-- Header Section -->
        <!-- <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <img class="h-12 w-auto" src="@/assets/logo.jpg" alt="Institution Logo" />
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">{{ institutionName }}</h1>
                            <p class="text-sm text-gray-600">Application Portal</p>
                        </div>
                    </div>
                    <div class="hidden md:flex items-center space-x-4">
                        <router-link to="/applicant/register"
                                     class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Don't have an account? Apply Now
                        </router-link>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Main Content -->
        <div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <!-- Login Card -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <!-- Card Header -->
                    <div class="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-8 text-center">
                        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i class="fa fa-user-graduate text-3xl text-blue-500"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-white">Welcome Back</h2>
                        <p class="text-blue-100 mt-2">Sign in to access your application portal</p>
                    </div>
                    <!-- Card Content -->
                    <div class="px-6 py-8">
                        <!-- Error Messages -->
                        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div class="flex items-center">
                                <i class="fa fa-exclamation-circle text-red-500 mr-3"></i>
                                <p class="text-red-800 text-sm">{{ errorMessage }}</p>
                            </div>
                        </div>

                        <!-- Success Messages -->
                        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div class="flex items-center">
                                <i class="fa fa-check-circle text-green-500 mr-3"></i>
                                <p class="text-green-800 text-sm">{{ successMessage }}</p>
                            </div>
                        </div>

                        <!-- Login Form -->
                        <form @submit.prevent="login" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fa fa-id-card mr-2 text-blue-500"></i>
                                    Application ID / Email
                                </label>
                                <PInput
                                    label=""
                                    v-model="form.username"
                                    placeholder="Enter your application ID or email"
                                    class="w-full"
                                    fluid
                                    :error_messages="fieldErrors.username"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fa fa-lock mr-2 text-blue-500"></i>
                                    Password
                                </label>
                                <PasswordField
                                label=""
                                    v-model="form.password"
                                    placeholder="Enter your password"
                                    class="w-full"
                                    fluid
                                    :error_messages="fieldErrors.password"
                                />
                            </div>

                            <!-- Remember Me & Forgot Password -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <Checkbox v-model="form.remember" :binary="true" />
                                    <label class="ml-2 text-sm text-gray-600">Remember me</label>
                                </div>
                                <router-link to="/applicant/forgot-password"
                                           class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                    Forgot password?
                                </router-link>
                            </div>

                            <!-- Login Button -->
                            <Button
                                :loading="isLoading"
                                type="submit"
                                class="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                                size="large"
                            >
                                <i class="fa fa-sign-in-alt mr-2"></i>
                                {{ isLoading ? 'Signing In...' : 'Sign In' }}
                            </Button>
                        </form>

                        <!-- Divider -->
                        <div class="mt-8 pt-6 border-t border-gray-200">
                            <p class="text-center text-sm text-gray-600">
                                Don't have an account?
                                <router-link to="/applicant/register"
                                           class="font-medium text-blue-600 hover:text-blue-800 transition-colors ml-1">
                                    Apply Now
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Additional Links -->
                <div class="text-center space-y-4">
                    <div class="flex items-center justify-center space-x-6 text-sm">
                        <router-link to="/staff/login"
                                   class="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                            <i class="fa fa-users mr-2"></i>
                            Staff Portal
                        </router-link>
                        <router-link to="/student/login"
                                   class="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                            <i class="fa fa-graduation-cap mr-2"></i>
                            Student Portal
                        </router-link>
                    </div>
                    <p class="text-xs text-gray-500">
                        Need help? Contact support at
                        <a href="mailto:support@institution.edu" class="text-blue-600 hover:text-blue-800">
                            support@institution.edu
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>

</template>


<script>
import { useGlobalsStore } from '@/stores/globals';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import PInput from '@/components/PInput.vue';
import PasswordField from '@/components/PasswordField.vue';
import { useAuthStore } from '@/stores/auth';

export default {
    name: "ApplicationLogin",
    components: {
        InputText,
        PasswordField,
        Button,
        PInput,
        Checkbox,
    },
    setup() {
        const globalStore = useGlobalsStore();
        const authStore = useAuthStore();
        return { globalStore, authStore };
    },
    data() {
        return {
            isLoading: false,
            errorMessage: '',
            successMessage: '',
            form: {
                username: '',
                password: '',
                remember: false
            },
            fieldErrors: {}
        }
    },
    computed: {
        institutionName() {
            return this.globalStore.school_info?.name || 'Institution Portal';
        }
    },
    methods: {
        validateForm() {
            this.fieldErrors = {};
            this.errorMessage = '';

            if (!this.form.username.trim()) {
                this.fieldErrors.username = ['Application ID or Email is required'];
            }

            if (!this.form.password.trim()) {
                this.fieldErrors.password = ['Password is required'];
            }

            return Object.keys(this.fieldErrors).length === 0;
        },

        async login() {
            if (!this.validateForm()) {
                this.errorMessage = 'Please fill in all required fields';
                return;
            }

            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                console.log('Starting login process...');

                const success = await this.authStore.login(
                    this.form.username,
                    this.form.password,
                    this.$endpoints.applicant.applicantLoginPost.url,
                    'applicant'
                );

                if (success) {
                    this.successMessage = 'Login successful! Redirecting to your dashboard...';

                    // Show success message briefly before redirect
                    setTimeout(() => {
                        this.$globals.message = {
                            text: 'Welcome back! You have successfully logged in.',
                            type: 'success'
                        };
                        this.$router.push({ name: 'applicant-index' });
                    }, 1500);

                } else {
                    this.errorMessage = 'Invalid credentials. Please check your Application ID/Email and password.';
                }
            } catch (error) {
                console.error('Login error:', error);

                if (error.response && error.response.status === 422) {
                    this.fieldErrors = error.response.data.errors || {};
                    this.errorMessage = 'Please correct the errors below';
                } else if (error.response && error.response.status === 401) {
                    this.errorMessage = 'Invalid credentials. Please try again.';
                } else {
                    this.errorMessage = 'Connection error. Please check your internet connection and try again.';
                }
            } finally {
                this.isLoading = false;
            }
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

/* Button hover effects */
.p-button {
    transition: all 0.3s ease;
}

.p-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Form field focus effects */
.p-inputtext:focus,
.p-password input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
}

/* Card hover effect */
.login-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Loading animation */
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

/* Responsive improvements */
@media (max-width: 768px) {
    .login-container {
        padding: 1rem;
    }

    .login-card {
        margin: 0;
    }
}
</style>