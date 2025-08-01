<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
            <!-- Header -->
            <div class="p-8 text-center border-b">
                <img src="@/assets/logo.jpg" alt="School Logo" class="w-16 h-16 mx-auto mb-4 rounded-full">
                <h2 class="text-2xl font-bold text-gray-800">Student Portal</h2>
                <p class="text-gray-600">Sign in to your account</p>
            </div>

            <!-- Login Form -->
            <div class="p-8">
                <form @submit.prevent="login">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Matric Number / Email
                        </label>
                        <input
                            v-model="form.username"
                            type="text"
                            required
                            placeholder="Enter your matric number or email"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div class="relative">
                            <input
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                required
                                placeholder="Enter your password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                            >
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                            </button>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="flex items-center">
                            <input v-model="form.remember" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        <i v-if="loading" class="fa fa-spinner fa-spin mr-2"></i>
                        {{ loading ? 'Signing in...' : 'Sign In' }}
                    </button>
                </form>

                <!-- Error Message -->
                <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {{ errorMessage }}
                </div>

                <!-- Links -->
                <div class="mt-6 text-center space-y-2">
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-800">Forgot your password?</a>
                    <div class="text-sm text-gray-600">
                        Don't have an account?
                        <router-link to="/application/register" class="text-blue-600 hover:text-blue-800">Apply here</router-link>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-8 py-4 bg-gray-50 border-t text-center">
                <p class="text-xs text-gray-500">
                    © {{ new Date().getFullYear() }} {{ $globals.school_info?.name || 'Institution' }}. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
                remember: false
            },
            showPassword: false,
            loading: false,
            errorMessage: '',
            store: useAuthStore()
        }
    },
    methods: {
        async login() {
            this.loading = true;
            this.errorMessage = '';

            try {
                const success = await this.store.login(
                    this.form.username,
                    this.form.password,
                    this.$endpoints.student.login.url,
                    'student'
                );

                if (success) {
                    this.$router.push({ name: 'student-home' });
                } else {
                    this.errorMessage = 'Invalid credentials. Please check your matric number/email and password.';
                }
            } catch (error) {
                console.error('Login error:', error);
                this.errorMessage = 'An error occurred during login. Please try again.';
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        // Clear any existing auth data
        if (this.store.authToken) {
            this.$router.push({ name: 'student-home' });
        }
    }
}
</script>
