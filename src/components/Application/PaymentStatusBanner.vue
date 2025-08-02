<template>
    <div v-if="showBanner" class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 mb-4 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="bg-amber-100 rounded-full p-2 mr-3">
                    <i class="fa fa-exclamation-triangle text-amber-600"></i>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-amber-800">Payment Required</h4>
                    <p class="text-xs text-amber-700">Complete your application fee payment to access all features</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button @click="navigateToPayments" 
                        class="bg-amber-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors">
                    <i class="fa fa-credit-card mr-1"></i>
                    Pay Now
                </button>
                <button @click="dismissBanner" 
                        class="text-amber-600 hover:text-amber-800 p-1">
                    <i class="fa fa-times"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
    name: 'PaymentStatusBanner',
    data() {
        return {
            showBanner: false
        }
    },
    mounted() {
        this.checkPaymentStatus();
    },
    methods: {
        checkPaymentStatus() {
            const store = useAuthStore();
            const userInfo = store.userInfo;
            
            // Check if this is an imported applicant who hasn't paid application fee
            const isImported = userInfo?.is_imported;
            const hasNotPaid = !userInfo?.application_fee_paid;
            const isDismissed = localStorage.getItem('payment_banner_dismissed') === 'true';
            
            this.showBanner = isImported && hasNotPaid && !isDismissed;
        },
        navigateToPayments() {
            this.$router.push({ name: 'applicant-payments' });
        },
        dismissBanner() {
            this.showBanner = false;
            localStorage.setItem('payment_banner_dismissed', 'true');
        }
    }
}
</script>

<style scoped>
/* Custom styles for the banner */
</style>
