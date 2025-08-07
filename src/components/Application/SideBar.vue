<template>
    <div>
        <!-- Institution Header -->
        <div class="mb-4 place-content-center flex items-center justify-center px-3 py-4 transform transition">
            <div class="mr-2">
                <img src="@/assets/logo.jpg" class="w-10 rounded-md">
            </div>
            <div class="text-white col-span-4">
                <p class="m-0 text-xs font-bold">{{ institutionName }}</p>
                <p class="m-0 text-xs">{{ institutionSubtitle }}</p>
            </div>
        </div>

        <!-- User Profile Section -->
        <div class="flex justify-center items-center flex-col mb-6">
            <div :class="`bg-[${$globals.colors.ap_secondary}]`" 
                 class="rounded-full flex justify-center items-center w-[65px] h-[65px] py-5 shadow-lg">
                <span class="font-bold text-4xl text-white">{{ userInitials }}</span>
            </div>
            <div class="mt-3 text-center">
                <p class="font-bold text-white leading-4 text-sm">{{ userFullName }}</p>
                <p class="text-xs text-gray-300 mt-1">{{ userApplicationNumber }}</p>
                <div class="flex items-center justify-center mt-2">
                    <span :class="userStatusColor" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ userStatus }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Navigation Menu -->
        <div class="mt-6">
            <ul class="pl-3">
                <li v-for="(menuItem, i) in menuItems" :key="i"
                    @click="selectMenu($event, menuItem.route)"
                    class="p-4 transitionx xmenu rounded-l-lg relative"
                    :class="[
                        `text-[${$globals.colors.ap_secondary}]`,
                        $route.name == menuItem.route ? 'apMenuActive' : '',
                        isMenuItemDisabled(menuItem) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    ]"
                    :ref="`menuItem-${i}`">
                    <div class="top-0 left-0 absolute p-4"></div>
                    <div class="flex items-center leading-4">
                        <i :class="`${menuItem.icon} mr-2`"></i>
                        <span class="line-clamp-2">{{ menuItem.label }}</span>
                        <i v-if="isMenuItemDisabled(menuItem)" class="fa fa-lock ml-auto text-xs opacity-60"></i>
                    </div>
                    <!-- Disabled Menu Item Tooltip -->
                    <div v-if="isMenuItemDisabled(menuItem)"
                         class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {{ getDisabledTooltip(menuItem) }}
                    </div>
                </li>
            </ul>
        </div>

        <!-- Logout Section -->
        <div class="mt-8 px-3">
            <div class="border-t border-white-600 pt-4">
                <button @click="showLogoutDialog" 
                        :disabled="isLoggingOut"
                        class="w-full p-3 text-left text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center">
                    <i class="fa fa-sign-out-alt mr-3 !text-white"></i>
                    <span v-if="!isLoggingOut">Logout</span>
                    <span v-else class="flex items-center">
                        <i class="fa fa-spinner fa-spin mr-2"></i>
                        Logging out...
                    </span>
                </button>
            </div>
        </div>

        <!-- PrimeVue Dialog for Logout Confirmation -->
        <Dialog v-model:visible="logoutDialogVisible" modal header="Confirm Logout" :style="{ width: '25rem' }">
            <div class="flex align-items-center gap-3 mb-5">
                <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--yellow-500)" />
                <span>Are you sure you want to logout?</span>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="logoutDialogVisible = false"></Button>
                <Button type="button" label="Logout" severity="danger" @click="confirmLogout"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useGlobalsStore } from '@/stores/globals';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    name: 'ApplicationSideBar',
    components: {
        Dialog,
        Button
    },
    setup() {
        const authStore = useAuthStore();
        const globalsStore = useGlobalsStore();
        return { authStore, globalsStore };
    },
    data() {
        return {
            bgColor: '',
            ap_secondary: '',
            isNavigating: false,
            isLoggingOut: false,
            logoutDialogVisible: false, // Control dialog visibility
            menuItems: [
                {
                    label: 'Dashboard',
                    route: 'applicant-index',
                    icon: 'fa fa-tachometer-alt'
                },
                {
                    label: 'My Application',
                    route: 'applicant-application',
                    icon: 'fa fa-file-alt'
                },
                {
                    label: 'Documents',
                    route: 'applicant-documents',
                    icon: 'fa fa-folder-open'
                },
                {
                    label: 'Payments',
                    route: 'applicant-payments',
                    icon: 'fa fa-credit-card'
                },
                {
                    label: 'Acknowledgment Slip',
                    route: 'applicant-acknowledgment-slip',
                    icon: 'fa fa-file-alt',
                    requiresFinalSubmission: true
                },
                {
                    label: 'Admission Letter',
                    route: 'applicant-admission-letter',
                    icon: 'fa fa-graduation-cap',
                    requiresAdmission: true
                },
                {
                    label: 'Profile',
                    route: 'applicant-profile',
                    icon: 'fa fa-user-circle'
                }
            ]
        }
    },
    computed: {
        institutionName() {
            return this.globalsStore.school_info?.name || 'Institution Portal';
        },
        institutionSubtitle() {
            return this.globalsStore.school_info?.subtitle || 'Application Portal';
        },
        userInfo() {
            return this.authStore.userInfo || {};
        },
        userFullName() {
            const firstName = this.userInfo.first_name || '';
            const lastName = this.userInfo.surname || this.userInfo.last_name || '';
            const middleName = this.userInfo.middle_name || '';
            
            if (firstName && lastName) {
                return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
            }
            return this.userInfo.full_name || 'Applicant';
        },
        userInitials() {
            const firstName = this.userInfo.first_name || '';
            const lastName = this.userInfo.surname || this.userInfo.last_name || '';
            
            if (firstName && lastName) {
                return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
            } else if (firstName) {
                return firstName.charAt(0).toUpperCase();
            } else if (this.userInfo.full_name) {
                const names = this.userInfo.full_name.split(' ');
                return names.length > 1 
                    ? `${names[0].charAt(0).toUpperCase()}${names[names.length - 1].charAt(0).toUpperCase()}`
                    : names[0].charAt(0).toUpperCase();
            }
            return 'A';
        },
        userApplicationNumber() {
            return this.userInfo.application_number || 'N/A';
        },
        userStatus() {
            const status = this.userInfo.admission_status || this.userInfo.application_status || 'pending';
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        },
        userStatusColor() {
            const status = this.userInfo.admission_status || this.userInfo.application_status || 'pending';
            const statusColors = {
                'admitted': 'bg-green-500 text-white',
                'qualified': 'bg-blue-500 text-white',
                'pending': 'bg-yellow-500 text-black',
                'not_admitted': 'bg-red-500 text-white',
                'rejected': 'bg-red-500 text-white'
            };
            return statusColors[status.toLowerCase()] || 'bg-gray-500 text-white';
        },
        isApplicationFeePaid() {
            return this.userInfo.application_fee_paid === true || this.userInfo.application_fee_paid === 1;
        },
        isImportedApplicant() {
            return this.userInfo.is_imported === true || this.userInfo.is_imported === 1;
        }
    },
    created() {
        this.bgColor = this.$globals.colors.ap_primary;
        this.ap_secondary = this.$globals.colors.ap_secondary;
    },
    methods: {
        isMenuItemDisabled(menuItem) {
            // If user is imported and hasn't paid application fee, disable all except payments and dashboard
            if (this.isImportedApplicant && !this.isApplicationFeePaid) {
                const allowedRoutes = ['applicant-index', 'applicant-payments'];
                return !allowedRoutes.includes(menuItem.route);
            }

            // If menu item requires final submission, check if user has final submitted
            if (menuItem.requiresFinalSubmission) {
                const userInfo = this.userInfo;
                return !userInfo.is_final_submitted;
            }

            // If menu item requires admission, check if user is admitted and published
            if (menuItem.requiresAdmission) {
                const userInfo = this.userInfo;
                return !(userInfo.admission_status === 'admitted' && userInfo.published_at);
            }

            return false;
        },
        getDisabledTooltip(menuItem) {
            if (menuItem.requiresFinalSubmission) {
                return 'Final submission required to access';
            }
            if (menuItem.requiresAdmission) {
                return 'Admission required to access';
            }
            return 'Payment required to access';
        },
        selectMenu(e, routeName) {
            e.preventDefault();
            e.stopPropagation();

            if (this.isNavigating) return;

            // Check if menu item is disabled
            const menuItem = this.menuItems.find(item => item.route === routeName);
            if (this.isMenuItemDisabled(menuItem)) {
                // Redirect to payments page with a message
                this.$globals.message = {
                    text: 'Please complete your application fee payment to access this feature.',
                    type: 'warning'
                };
                setTimeout(() => {
                    this.$globals.message.text = '';
                }, 4000);

                this.$router.push({ name: 'applicant-payments' });
                return;
            }

            this.isNavigating = true;

            setTimeout(() => {
                this.isNavigating = false;
            }, 2000);

            const menuItems = document.querySelectorAll('.xmenu');
            menuItems.forEach(item => {
                item.classList.remove('apMenuActive');
            });

            const clickedItem = e.currentTarget;
            clickedItem.classList.add('apMenuActive');

            if (routeName && this.$route.name !== routeName) {
                console.log('Navigating to:', routeName);
                this.$router.push({ name: routeName }).then(() => {
                    this.isNavigating = false;
                    console.log('Navigation successful to:', routeName);
                }).catch(err => {
                    console.error('Navigation error:', err);
                    this.isNavigating = false;
                });
            } else {
                console.log('Already on route:', routeName);
                this.isNavigating = false;
            }
        },

        showLogoutDialog() {
            this.logoutDialogVisible = true;
        },

        async confirmLogout() {
            if (this.isLoggingOut) return;
            
            try {
                this.isLoggingOut = true;
                this.logoutDialogVisible = false;
                
                const logoutRoute = this.authStore.getLogoutRoute();
                await this.authStore.logout(logoutRoute);
                
                this.$globals.message = {
                    text: 'You have been logged out successfully',
                    type: 'success'
                };
                
                this.$router.push({ name: 'applicant-login' });
                
            } catch (error) {
                console.error('Logout error:', error);
                this.$globals.message = {
                    text: 'Error during logout. Please try again.',
                    type: 'error'
                };
            } finally {
                this.isLoggingOut = false;
            }
        }
    }
}
</script>



<style scoped>
.transitionx {
    transition: all .2s;
    position: relative;
    height: 47px;
}

.transitionx > div:first-child {
    display: inline-block;
    transition-delay: .1s;
    transition: all 0.2s;
    -moz-transition: all 0.2s;
    -o-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    width: 95%;
    height: 100%;
    opacity: 0;
    background-color: transparent;
}

.apMenuActive > div:first-child {
    opacity: 0;
    transform: translateX(5.5%);
    -webkit-transform: translateX(5.5%);
    -moz-transform: translateX(5.5%);
    -o-transform: translateX(5.5%);
    opacity: 1;
}

.apMenuActive > div:first-child::before {
    content: '';
    position: absolute;
    top: -15px;
    right: 0px;
    width: 15px;
    height: 15px;
    background: v-bind(bgColor);
    border-bottom-right-radius: 10px;
    box-shadow: 2px 5px 0px 1px v-bind(ap_secondary);
    z-index: 1;
    transform-origin: bottom right;
}

.apMenuActive > div:first-child::after {
    content: '';
    position: absolute;
    bottom: -15px;
    right: 0px;
    width: 15px;
    height: 15px;
    background: v-bind(bgColor);
    border-top-right-radius: 10px;
    box-shadow: 2px -5px 0px 1px v-bind(ap_secondary);
    z-index: 1;
    transform-origin: bottom right;
}

.apMenuActive {
    position: relative;
    transition: all .3s;
    background-color: rgba(255, 255, 255, 0.1);
    border-left: 4px solid white;
}

.transitionx.apMenuActive i {
    border-radius: 9px;
    padding: 10px;
    background: v-bind(bgColor);
    color: v-bind(ap_secondary) !important;
}

/* User profile enhancements */
.user-avatar {
    transition: transform 0.3s ease;
}

.user-avatar:hover {
    transform: scale(1.05);
}

/* Logout button styles */
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Status badge animations */
.status-badge {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

/* Hover effects for menu items */
.xmenu:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateX(2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .user-profile-section {
        padding: 1rem 0.5rem;
    }

    .user-avatar {
        width: 50px;
        height: 50px;
    }

    .user-avatar span {
        font-size: 1.5rem;
    }
}
</style>
