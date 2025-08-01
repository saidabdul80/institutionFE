<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <!-- Header Section -->
        <!-- <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <img class="h-12 w-auto" src="@/assets/logo.jpg" alt="Institution Logo" />
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">{{ institutionName }}</h1>
                            <p class="text-sm text-gray-600">Staff Portal</p>
                        </div>
                    </div>
                    <div class="hidden md:flex items-center space-x-4">
                        <router-link to="/applicant/login"
                                     class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Application Portal
                        </router-link>
                        <router-link to="/student/login"
                                     class="text-green-600 hover:text-green-800 font-medium transition-colors">
                            Student Portal
                        </router-link>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Main Content -->
        <div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <!-- Login Card -->
                <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden staff-login-card">
                    <!-- Card Header -->
                    <div class="bg-gradient-to-r from-slate-600 to-blue-600 px-6 py-8 text-center">
                        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i class="fa fa-users text-3xl text-slate-600"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-white">Staff Portal</h2>
                        <p class="text-slate-100 mt-2">Access your administrative dashboard</p>
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
                        <form @submit.prevent="handleLogin" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fa fa-user mr-2 text-slate-600"></i>
                                    Staff ID / Username
                                </label>
                                <InputText
                                    v-model="user.username"
                                    placeholder="Enter your staff ID or username"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                    :class="validationErrors.username ? 'border-red-500' : ''"
                                />
                                <div v-if="validationErrors.username" class="mt-1 text-red-500 text-sm">
                                    {{ validationErrors.username }}
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fa fa-lock mr-2 text-slate-600"></i>
                                    Password
                                </label>
                                <InputText
                                    v-model="user.password"
                                    type="password"
                                    placeholder="Enter your password"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                    :class="validationErrors.password ? 'border-red-500' : ''"
                                />
                                <div v-if="validationErrors.password" class="mt-1 text-red-500 text-sm">
                                    {{ validationErrors.password }}
                                </div>
                            </div>

                            <!-- Remember Me & Forgot Password -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input type="checkbox" v-model="user.remember" class="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded">
                                    <label class="ml-2 text-sm text-gray-600">Remember me</label>
                                </div>
                                <a href="#" class="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <!-- Login Button -->
                            <Button
                                :loading="isLoading"
                                type="submit"
                                class="w-full bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                                size="large"
                            >
                                <i class="fa fa-sign-in-alt mr-2"></i>
                                {{ isLoading ? 'Signing In...' : 'Sign In' }}
                            </Button>
                        </form>
                    </div>
                </div>

                <!-- Additional Links -->
                <div class="text-center space-y-4">
                    <div class="flex items-center justify-center space-x-6 text-sm">
                        <router-link to="/application/login"
                                   class="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                            <i class="fa fa-user-graduate mr-2"></i>
                            Application Portal
                        </router-link>
                        <router-link to="/student/login"
                                   class="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                            <i class="fa fa-graduation-cap mr-2"></i>
                            Student Portal
                        </router-link>
                    </div>
                    <p class="text-xs text-gray-500">
                        Technical support:
                        <a href="mailto:it-support@institution.edu" class="text-slate-600 hover:text-slate-800">
                            it-support@institution.edu
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useAuthStore } from '@/stores/auth';
import { useGlobalsStore } from '@/stores/globals';

export default {
    name: 'StaffLogin',
    components: {
        InputText,
        Button
    },
    setup() {
        const authStore = useAuthStore();
        const globalStore = useGlobalsStore();
        return { authStore, globalStore };
    },
    data() {
        return {
            isLoading: false,
            errorMessage: '',
            successMessage: '',
            user: {
                username: '',
                password: '',
                remember: false
            },
            validationErrors: {}
        }
    },
    computed: {
        institutionName() {
            return this.globalStore.school_info?.name || 'Institution Portal';
        }
    },
    methods: {
        validateForm() {
            this.validationErrors = {};
            this.errorMessage = '';

            if (!this.user.username.trim()) {
                this.validationErrors.username = 'Staff ID or Username is required';
            }

            if (!this.user.password.trim()) {
                this.validationErrors.password = 'Password is required';
            }

            return Object.keys(this.validationErrors).length === 0;
        },

        async handleLogin() {
            if (!this.validateForm()) {
                this.errorMessage = 'Please fill in all required fields';
                return;
            }

            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                console.log('Starting staff login process...');

                const success = await this.authStore.login(
                    this.user.username,
                    this.user.password,
                    this.$endpoints.staff.login.url,
                    'staff'
                );

                if (success) {
                    this.successMessage = 'Login successful! Redirecting to staff dashboard...';

                    // Show success message briefly before redirect
                    setTimeout(() => {
                        this.$globals.message = {
                            text: 'Welcome back! You have successfully logged in to the staff portal.',
                            type: 'success'
                        };
                        this.$router.push('/staff/');
                    }, 1500);

                } else {
                    this.errorMessage = 'Invalid credentials. Please check your Staff ID/Username and password.';
                }
            } catch (error) {
                console.error('Staff login error:', error);

                if (error.response && error.response.status === 422) {
                    this.validationErrors = error.response.data.errors || {};
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
}
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
input:focus {
    outline: none;
    ring: 2px;
    ring-color: #475569;
    border-color: transparent;
}

/* Card hover effect */
.staff-login-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.staff-login-card:hover {
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

/* Custom checkbox styling */
input[type="checkbox"]:checked {
    background-color: #475569;
    border-color: #475569;
}

/* Responsive improvements */
@media (max-width: 768px) {
    .staff-login-container {
        padding: 1rem;
    }

    .staff-login-card {
        margin: 0;
    }
}

/* Error and success message animations */
.error-message, .success-message {
    animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
