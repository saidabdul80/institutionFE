<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        <!-- Navigation Header -->
        <nav class="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <img src="@/assets/logo.jpg" alt="School Logo" class="h-10 w-10 rounded-full mr-3">
                        <h1 class="text-white text-xl font-bold">{{ schoolInfo.name || 'Institution Portal' }}</h1>
                    </div>
                    <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
                        <span class="text-white/80">Welcome, {{ authStore.getUser.first_name || authStore.getUser.name }}</span>
                        <button @click="logout" class="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fa fa-sign-out mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
            <div class="max-w-4xl mx-auto text-center">
                <!-- Welcome Section -->
                <div class="mb-12">
                    <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
                        Welcome to<br>
                        <span class="text-yellow-300">{{ schoolInfo.name || 'Our Institution' }}</span>
                    </h1>
                    <p class="text-xl text-white/80 max-w-2xl mx-auto">
                        Access your portal to manage academics, view results, make payments, and stay connected with your institution.
                    </p>
                </div>

                <!-- Portal Selection Cards -->
                <div v-if="!authStore.isAuthenticated" class="grid md:grid-cols-3 gap-8 mb-12">
                    <!-- Student Portal -->
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                         @click="navigateToPortal('student')">
                        <div class="text-center">
                            <div class="bg-blue-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
                                <i class="fa fa-graduation-cap text-4xl text-blue-300"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-4">Student Portal</h3>
                            <p class="text-white/70 mb-6">
                                Access your courses, results, payments, and academic records
                            </p>
                            <div class="flex justify-center">
                                <span class="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-blue-600 transition-colors">
                                    Login as Student
                                    <i class="fa fa-arrow-right ml-2"></i>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Staff Portal -->
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                         @click="navigateToPortal('staff')">
                        <div class="text-center">
                            <div class="bg-green-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:bg-green-500/30 transition-colors">
                                <i class="fa fa-users text-4xl text-green-300"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-4">Staff Portal</h3>
                            <p class="text-white/70 mb-6">
                                Manage students, courses, admissions, and institutional operations
                            </p>
                            <div class="flex justify-center">
                                <span class="bg-green-500 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-green-600 transition-colors">
                                    Login as Staff
                                    <i class="fa fa-arrow-right ml-2"></i>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Application Portal -->
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                         @click="navigateToPortal('application')">
                        <div class="text-center">
                            <div class="bg-purple-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:bg-purple-500/30 transition-colors">
                                <i class="fa fa-file-text text-4xl text-purple-300"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-4">Application Portal</h3>
                            <p class="text-white/70 mb-6">
                                Apply for admission, track application status, and submit documents
                            </p>
                            <div class="flex justify-center">
                                <span class="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium group-hover:bg-purple-600 transition-colors">
                                    Apply Now
                                    <i class="fa fa-arrow-right ml-2"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Authenticated User Dashboard Link -->
                <div v-else class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                    <div class="text-center">
                        <div class="bg-yellow-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                            <i class="fa fa-tachometer text-4xl text-yellow-300"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-4">Welcome Back!</h3>
                        <p class="text-white/70 mb-6">
                            You are logged in as {{ authStore.userType }}. Access your dashboard to continue.
                        </p>
                        <button @click="goToDashboard"
                                class="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                            Go to Dashboard
                            <i class="fa fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <a href="#" class="text-white/60 hover:text-white transition-colors">
                        <i class="fa fa-info-circle text-2xl mb-2 block"></i>
                        About Us
                    </a>
                    <a href="#" class="text-white/60 hover:text-white transition-colors">
                        <i class="fa fa-phone text-2xl mb-2 block"></i>
                        Contact
                    </a>
                    <a href="#" class="text-white/60 hover:text-white transition-colors">
                        <i class="fa fa-calendar text-2xl mb-2 block"></i>
                        Academic Calendar
                    </a>
                    <a href="#" class="text-white/60 hover:text-white transition-colors">
                        <i class="fa fa-newspaper-o text-2xl mb-2 block"></i>
                        News & Events
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-black/20 backdrop-blur-md border-t border-white/10 py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p class="text-white/60">
                    © {{ new Date().getFullYear() }} {{ schoolInfo.name || 'Institution' }}. All rights reserved.
                </p>
                <p class="text-white/40 text-sm mt-2">
                    Powered by Institution Management System
                </p>
            </div>
        </footer>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { get } from '@/api/client';

export default {
    name: 'HomeView',
    data() {
        return {
            authStore: useAuthStore(),
            schoolInfo: {}
        }
    },
    methods: {
        navigateToPortal(type) {
            if (type === 'student') {
                this.$router.push({ name: 'student-login' });
            } else if (type === 'staff') {
                this.$router.push({ name: 'staff-login' });
            } else if (type === 'application') {
                this.$router.push({ name: 'applicant-login' });
            }
        },
        goToDashboard() {
            if (this.authStore.userType === 'staff') {
                this.$router.push({ name: 'staff-home' });
            } else if (this.authStore.userType === 'student') {
                this.$router.push({ name: 'student-home' });
            } else if (this.authStore.userType === 'applicant') {
                this.$router.push({ name: 'applicant-index' });
            }
        },
        async logout() {
            const logoutRoute = this.authStore.getLogoutRoute();
            await this.authStore.logout(logoutRoute);
            this.$router.push('/');
        },
        async loadSchoolInfo() {
            try {
                if (this.$globals.school_info) {
                    this.schoolInfo = this.$globals.school_info;
                } else {
                    const res = await get(this.$endpoints.schoolInfo);
                    if (res) {
                        this.schoolInfo = res;
                        this.$globals.school_info = res;
                    }
                }
            } catch (error) {
                console.error('Error loading school info:', error);
            }
        }
    },
    async mounted() {
        await this.loadSchoolInfo();

        // Auto-redirect authenticated users to their dashboard
        if (this.authStore.isAuthenticated) {
            // Small delay to show the welcome message briefly
            setTimeout(() => {
                this.goToDashboard();
            }, 2000);
        }
    }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.group:hover .fa {
    transform: scale(1.1);
    transition: transform 0.3s ease;
}
</style>
