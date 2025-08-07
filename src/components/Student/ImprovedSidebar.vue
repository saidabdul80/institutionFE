<template>
    <div class="h-full flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl">
        <!-- Header Section -->
        <div class="flex-shrink-0 p-6 border-b border-white/10">
            <!-- Institution Logo & Name -->
            <div class="flex items-center justify-center mb-6">
                <div class="mr-3">
                    <img src="@/assets/logo.jpg" class="w-12 h-12 rounded-full object-cover shadow-lg ring-2 ring-white/20">
                </div>
                <div class="text-center">
                    <p class="text-sm font-bold leading-tight">{{ $globals.school_info?.name || 'Institution' }}</p>
                    <p class="text-xs opacity-75 leading-tight">Student Portal</p>
                </div>
            </div>
            
            <!-- User Profile Section -->
            <div class="flex flex-col items-center">
                <div class="relative mb-4">
                    <div class="rounded-full flex justify-center items-center w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 backdrop-blur-sm shadow-lg">
                        <img v-if="userInfo.picture" :src="userInfo.picture" 
                             class="w-full h-full rounded-full object-cover" 
                             :alt="userInfo.first_name">
                        <span v-else class="font-bold text-2xl text-white">
                            {{ getInitials(userInfo.first_name, userInfo.last_name) }}
                        </span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <i class="fa fa-check text-xs text-white"></i>
                    </div>
                </div>
                
                <div class="text-center">
                    <p class="font-bold text-white text-sm leading-tight mb-1">
                        {{ userInfo.first_name }} {{ userInfo.last_name }}
                    </p>
                    <p class="text-xs opacity-75 mb-2">{{ userInfo.matric_number || 'Student' }}</p>
                    
                    <!-- Student Status Badge -->
                    <div class="flex items-center justify-center">
                        <span :class="getStatusColor(userInfo.status)" 
                              class="px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            {{ formatStatus(userInfo.status) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1 overflow-y-auto py-4">
            <nav class="px-4">
                <ul class="space-y-2">
                    <li v-for="(menuItem, i) in menuItems" :key="i">
                        <button @click="selectMenu(menuItem.route)" 
                                :disabled="isMenuItemDisabled(menuItem)"
                                :class="[
                                    'w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group relative',
                                    $route.name === menuItem.route 
                                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30 transform scale-105' 
                                        : isMenuItemDisabled(menuItem)
                                        ? 'text-white/40 cursor-not-allowed'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
                                ]">
                            <div class="flex items-center flex-1">
                                <i :class="menuItem.icon" class="text-lg mr-4 w-5 text-center"></i>
                                <span class="font-medium">{{ menuItem.label }}</span>
                            </div>
                            
                            <!-- Active indicator -->
                            <i v-if="$route.name === menuItem.route" 
                               class="fa fa-chevron-right ml-auto text-sm opacity-80"></i>
                            
                            <!-- Disabled lock icon -->
                            <i v-if="isMenuItemDisabled(menuItem)" 
                               class="fa fa-lock ml-auto text-xs opacity-60"></i>
                            
                            <!-- Payment required indicator -->
                            <div v-if="menuItem.requiresPayment && !hasValidRegistrationPayment" 
                                 class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                        </button>
                        
                        <!-- Payment Required Tooltip -->
                        <div v-if="isMenuItemDisabled(menuItem) && menuItem.requiresPayment" 
                             class="ml-8 mt-1 text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded">
                            <i class="fa fa-exclamation-triangle mr-1"></i>
                            Registration fee payment required
                        </div>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Footer Section -->
        <div class="flex-shrink-0 p-4 border-t border-white/10">
            <div class="space-y-3">
                <!-- Academic Info -->
                <div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span class="text-white/70">Level:</span>
                            <span class="text-white font-medium ml-1">{{ userInfo.level?.name || 'N/A' }}</span>
                        </div>
                        <div>
                            <span class="text-white/70">Session:</span>
                            <span class="text-white font-medium ml-1">{{ currentSession?.name || 'N/A' }}</span>
                        </div>
                        <div class="col-span-2">
                            <span class="text-white/70">Programme:</span>
                            <span class="text-white font-medium ml-1">{{ userInfo.programme?.name || 'N/A' }}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Status -->
                <div v-if="!hasValidRegistrationPayment" class="bg-red-500/20 rounded-lg p-3 backdrop-blur-sm border border-red-500/30">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-red-200 font-medium">Registration Fee Required</p>
                            <p class="text-xs text-red-300">Pay to access all features</p>
                        </div>
                        <button @click="$router.push({name: 'student-payments'})" 
                                class="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded-lg transition-colors">
                            Pay Now
                        </button>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="flex space-x-2">
                    <button @click="$router.push({name: 'student-profile'})" 
                            class="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 hover:transform hover:scale-105">
                        <i class="fa fa-user mr-1"></i>Profile
                    </button>
                    <button @click="logout" 
                            class="flex-1 bg-red-500/20 hover:bg-red-500/30 text-white text-xs py-2 px-3 rounded-lg transition-all duration-200 hover:transform hover:scale-105">
                        <i class="fa fa-sign-out mr-1"></i>Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { get } from '@/api/client'

export default {
    name: 'ImprovedStudentSidebar',
    emits: ['navigate'],
    data() {
        return {
            authStore: useAuthStore(),
            currentSession: null,
            hasValidRegistrationPayment: false,
            menuItems: [
                { 
                    label: 'Dashboard', 
                    route: 'student-home',
                    icon: 'fa fa-tachometer-alt',
                    requiresPayment: false
                },
                { 
                    label: 'Course Registration', 
                    route: 'student-course-registration',
                    icon: 'fa fa-book-open',
                    requiresPayment: true
                },
                { 
                    label: 'My Courses', 
                    route: 'student-courses',
                    icon: 'fa fa-graduation-cap',
                    requiresPayment: true
                },
                { 
                    label: 'Results', 
                    route: 'student-results',
                    icon: 'fa fa-chart-line',
                    requiresPayment: true
                },
                { 
                    label: 'Payments', 
                    route: 'student-payments',
                    icon: 'fa fa-credit-card',
                    requiresPayment: false
                },
                { 
                    label: 'Documents', 
                    route: 'student-documents',
                    icon: 'fa fa-folder-open',
                    requiresPayment: false
                },
                { 
                    label: 'Profile', 
                    route: 'student-profile',
                    icon: 'fa fa-user-circle',
                    requiresPayment: false
                }
            ]
        }
    },
    
    computed: {
        userInfo() {
            return this.authStore.getUser || {}
        }
    },
    
    async mounted() {
        await Promise.all([
            this.loadCurrentSession(),
            this.checkRegistrationPayment()
        ])
    },
    
    methods: {
        async loadCurrentSession() {
            try {
                const response = await get(this.$endpoints.student.getCurrentSession.url)
                if (response && !response.error) {
                    this.currentSession = response
                }
            } catch (error) {
                console.error('Error loading current session:', error)
            }
        },
        
        async checkRegistrationPayment() {
            try {
                const response = await get(this.$endpoints.student.checkRegistrationPayment.url)
                if (response && !response.error) {
                    this.hasValidRegistrationPayment = response.has_valid_payment || false
                }
            } catch (error) {
                console.error('Error checking registration payment:', error)
                this.hasValidRegistrationPayment = false
            }
        },
        
        selectMenu(routeName) {
            const menuItem = this.menuItems.find(item => item.route === routeName)
            
            if (this.isMenuItemDisabled(menuItem)) {
                // Show payment required message and redirect to payments
                this.$globals.message = {
                    text: 'Please complete your registration fee payment to access this feature.',
                    type: 'warning'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 4000)
                
                this.$router.push({ name: 'student-payments' })
                return
            }
            
            if (routeName && this.$route.name !== routeName) {
                this.$router.push({ name: routeName }).catch(err => {
                    console.error('Navigation error:', err)
                })
                this.$emit('navigate', routeName)
            }
        },
        
        isMenuItemDisabled(menuItem) {
            // If menu item requires payment and student hasn't paid registration fee
            return menuItem.requiresPayment && !this.hasValidRegistrationPayment
        },
        
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : ''
            const last = lastName ? lastName.charAt(0).toUpperCase() : ''
            return first + last || 'S'
        },
        
        getStatusColor(status) {
            const colors = {
                'active': 'bg-green-400/20 text-green-300 border border-green-400/30',
                'inactive': 'bg-red-400/20 text-red-300 border border-red-400/30',
                'suspended': 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30',
                'graduated': 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
            }
            return colors[status?.toLowerCase()] || 'bg-gray-400/20 text-gray-300 border border-gray-400/30'
        },
        
        formatStatus(status) {
            return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Active'
        },
        
        logout() {
            this.authStore.logout()
            this.$router.push({ name: 'student-login' })
        }
    }
}
</script>

<style scoped>
/* Custom scrollbar for the navigation */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* Smooth transitions for all interactive elements */
button {
    transition: all 0.2s ease-in-out;
}

/* Hover effects */
button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Disabled state */
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Gradient animation */
.bg-gradient-to-br {
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>
