<template>
    <div class="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-6 rounded-lg shadow-lg mb-6">
        <!-- Header -->
        <div class="flex items-center mb-4">
            <div class="bg-orange-100 rounded-full p-3 mr-4">
                <i class="fa fa-exclamation-triangle text-orange-600 text-xl"></i>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-orange-800">Payment Required</h3>
                <p class="text-orange-700 text-sm">Complete your application fee payment to continue</p>
            </div>
        </div>

        <!-- Payment Steps -->
        <div class="bg-white rounded-lg p-4 mb-4">
            <h4 class="font-medium text-gray-800 mb-3">
                <i class="fa fa-list-ol mr-2 text-blue-500"></i>
                Follow these steps to complete your payment:
            </h4>
            <div class="space-y-3">
                <div class="flex items-start">
                    <div class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                    <div>
                        <p class="text-gray-700 font-medium">Click "Pay Application Fee" button below</p>
                        <p class="text-gray-600 text-sm">This will show you available payment options</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                    <div>
                        <p class="text-gray-700 font-medium">Select "Application Fee" from the payment types</p>
                        <p class="text-gray-600 text-sm">Choose the application fee payment option</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                    <div>
                        <p class="text-gray-700 font-medium">Generate invoice and proceed to payment</p>
                        <p class="text-gray-600 text-sm">Complete payment using your preferred payment method</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
                    <div>
                        <p class="text-gray-700 font-medium">Access full application portal</p>
                        <p class="text-gray-600 text-sm">Once payment is confirmed, you can access all features</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Important Notice -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
                <i class="fa fa-info-circle text-yellow-600 mr-3 mt-1"></i>
                <div>
                    <h5 class="font-medium text-yellow-800 mb-1">Important Notice</h5>
                    <p class="text-yellow-700 text-sm">
                        Your application has been imported successfully. However, you need to pay the application fee 
                        to access the full application portal and continue with your admission process.
                    </p>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
            <button @click="navigateToPayments" 
                    class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <i class="fa fa-credit-card mr-2"></i>
                Pay Application Fee Now
            </button>
            <button @click="$emit('dismiss')" 
                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <i class="fa fa-clock mr-2"></i>
                Remind Me Later
            </button>
        </div>

        <!-- Contact Support -->
        <div class="mt-4 pt-4 border-t border-orange-200">
            <p class="text-sm text-gray-600 text-center">
                Need help with payment? 
                <a href="#" class="text-orange-600 hover:text-orange-800 font-medium">Contact Support</a>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaymentGuidance',
    emits: ['dismiss'],
    methods: {
        navigateToPayments() {
            this.$router.push({ name: 'applicant-payments' });
        }
    }
}
</script>

<style scoped>
/* Add any additional custom styles here */
.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
