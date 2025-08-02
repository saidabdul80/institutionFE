<template>
    <div class="p-6">
        <!-- Application Fee Payment Alert for Imported Applicants -->
        <div v-if="showApplicationFeeAlert" class="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-6 rounded-lg shadow-lg mb-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="bg-red-100 rounded-full p-3 mr-4">
                        <i class="fa fa-exclamation-triangle text-red-600 text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-red-800">Application Fee Payment Required</h3>
                        <p class="text-red-700 text-sm">You need to pay your application fee to proceed with the application.</p>
                    </div>
                </div>
                <button @click="quickPayApplicationFee"
                        class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <i class="fa fa-credit-card mr-2"></i>
                    Pay Application Fee
                </button>
            </div>
        </div>

        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Payments & Invoices</h2>
                    <p class="text-gray-600">Manage your application payments and invoices</p>
                </div>
                <button @click="showInvoiceTypeModal = true"
                        class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    <i class="fa fa-plus mr-2"></i>Generate Invoice
                </button>
            </div>
        </div>

        <!-- Payment Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-green-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-check-circle text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Total Paid</p>
                        <p class="text-2xl font-bold">₦{{ formatMoney(paymentSummary.totalPaid) }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-red-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-exclamation-circle text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Outstanding</p>
                        <p class="text-2xl font-bold">₦{{ formatMoney(paymentSummary.outstanding) }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-blue-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-file-text text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Total Invoices</p>
                        <p class="text-2xl font-bold">{{ invoices.length }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoices and Payments -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                    <button @click="activeTab = 'invoices'" 
                            :class="activeTab === 'invoices' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                            class="py-4 px-1 border-b-2 font-medium text-sm">
                        Invoices ({{ invoices.length }})
                    </button>
                    <button @click="activeTab = 'payments'" 
                            :class="activeTab === 'payments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                            class="py-4 px-1 border-b-2 font-medium text-sm">
                        Payment History ({{ payments.length }})
                    </button>
                </nav>
            </div>

            <!-- Invoices Tab -->
            <div v-if="activeTab === 'invoices'" class="p-6">
                <div v-if="loading" class="text-center py-8">
                    <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p class="text-gray-600 mt-2">Loading invoices...</p>
                </div>
                
                <div v-else-if="invoices.length === 0" class="text-center py-8">
                    <i class="fa fa-file-text text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No invoices found</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charges</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ invoice.invoice_number }}
                                    <div class="text-xs text-gray-500">{{ formatDate(invoice.created_at) }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ invoice.invoice_name || invoice.description }}
                                    <div class="text-xs text-gray-500">{{ invoice.session_name }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₦{{ formatMoney(invoice.amount) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₦{{ formatMoney(invoice.charges || 0) }}
                                    <div v-if="invoice.charges > 0" class="text-xs text-gray-500">
                                        Processing fee
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    ₦{{ formatMoney(invoice.total_amount || (invoice.amount + (invoice.charges || 0))) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="getStatusColor(invoice.status)"
                                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ invoice.status.toUpperCase() }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex gap-2">
                                        <button @click="viewInvoice(invoice)"
                                                class="text-blue-600 hover:text-blue-900 transition-colors">
                                            <i class="fa fa-eye"></i>
                                        </button>
                                        <button v-if="invoice.status === 'unpaid'"
                                                @click="payInvoice(invoice)"
                                                class="text-green-600 hover:text-green-900 transition-colors">
                                            <i class="fa fa-credit-card"></i>
                                        </button>
                                        <button @click="downloadInvoice(invoice)"
                                                class="text-purple-600 hover:text-purple-900 transition-colors">
                                            <i class="fa fa-download"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Payments Tab -->
            <div v-if="activeTab === 'payments'" class="p-6">
                <div v-if="loading" class="text-center py-8">
                    <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p class="text-gray-600 mt-2">Loading payments...</p>
                </div>
                
                <div v-else-if="payments.length === 0" class="text-center py-8">
                    <i class="fa fa-credit-card text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No payments found</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="payment in payments" :key="payment.id">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ payment.reference }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ payment.description }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₦{{ formatMoney(payment.amount) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ formatDate(payment.created_at) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="getPaymentStatusColor(payment.status)" 
                                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ payment.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex gap-2">
                                        <button @click="viewPayment(payment)" 
                                                class="text-blue-600 hover:text-blue-900">
                                            <i class="fa fa-eye"></i> View
                                        </button>
                                        <button v-if="payment.status === 'pending'" 
                                                @click="requeryPayment(payment.reference)" 
                                                class="text-green-600 hover:text-green-900">
                                            <i class="fa fa-refresh"></i> Requery
                                        </button>
                                        <button @click="downloadReceipt(payment)" 
                                                class="text-purple-600 hover:text-purple-900">
                                            <i class="fa fa-download"></i> Receipt
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

           <Dialog v-model:visible="showInvoiceTypeModal" modal header="Generate Invoice" :style="{width: '500px'}">
            <div class="p-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select your Payment Type</label>
                    <select v-model="paymentForm.invoice_type_id" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Invoice Type to Pay</option>
                        <option v-for="invoice_type in invoice_types" :key="invoice_type.id" :value="invoice_type.id">
                            {{ invoice_type.name }} - ₦{{ formatMoney(invoice_type.total_amount || invoice_type.amount) }}
                        </option>
                    </select>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="showInvoiceTypeModal = false" />
                    <Button label="Proceed to Payment" @click="generateInvoice" :loading="paymentForm?.loading"
                            :disabled="!paymentForm.invoice_type_id" />
                </div>
            </div>
        </Dialog>

        <!-- Payment Modal -->
        <Dialog v-model:visible="showPaymentModal" modal header="Make Payment" :style="{width: '600px'}">
            <div class="p-4" v-if="selectedInvoice">
                <!-- Invoice Details -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 class="font-semibold text-gray-800 mb-2">Invoice Details</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Invoice Number:</span>
                            <span class="font-medium ml-2">{{ selectedInvoice.invoice_number }}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Type:</span>
                            <span class="font-medium ml-2">{{ selectedInvoice.invoice_name }}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Amount:</span>
                            <span class="font-medium ml-2">₦{{ formatMoney(selectedInvoice.amount) }}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Charges:</span>
                            <span class="font-medium ml-2">₦{{ formatMoney(selectedInvoice.charges || 0) }}</span>
                        </div>
                        <div class="col-span-2 border-t pt-2">
                            <span class="text-gray-600">Total Amount:</span>
                            <span class="font-bold text-lg ml-2 text-green-600">
                                ₦{{ formatMoney(selectedInvoice.total_amount || (selectedInvoice.amount + (selectedInvoice.charges || 0))) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Payment Gateway Selection -->

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-4">Select Payment Gateway</label>
                    <div class="grid grid-cols-1 gap-3">
                        <div v-for="(gateway, key) in schoolGateways" :key="key"
                             @click="paymentForm.gateway = gateway.name"
                             :class="[
                                 'border-2 rounded-lg p-4 cursor-pointer transition-all',
                                 paymentForm.gateway === gateway.name
                                     ? 'border-blue-500 bg-blue-50'
                                     : 'border-gray-200 hover:border-gray-300'
                             ]">
                            <div class="flex items-center">
                                <div :class="[gateway.color, 'w-10 h-10 rounded-lg flex items-center justify-center text-white mr-4']">
                                    <img :src="'/'+gateway.name.toLowerCase()+'.png'"></img>
                                </div>
                                <div class="flex-1">
                                    <h5 class="font-semibold text-gray-800">{{ gateway.name }}</h5>
                                    <p class="text-sm text-gray-600">
                                        {{ getGatewayDescription(gateway.name) }}
                                    </p>
                                </div>
                                <div v-if="paymentForm.gateway ===  gateway.name" class="text-blue-500">
                                    <i class="fa fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Options -->
                <div v-if="paymentForm.gateway" class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">Payment Option</label>
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="paymentForm.payment_option = 'widget'"
                                :class="[
                                    'border-2 rounded-lg p-3 text-left transition-all',
                                    paymentForm.payment_option === 'widget'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                ]">
                            <div class="flex items-center">
                                <i class="fa fa-window-maximize text-blue-500 mr-3"></i>
                                <div>
                                    <div class="font-medium">Widget</div>
                                    <div class="text-xs text-gray-600">Pay in popup</div>
                                </div>
                            </div>
                        </button>
                        <button @click="paymentForm.payment_option = 'redirect'"
                                :class="[
                                    'border-2 rounded-lg p-3 text-left transition-all',
                                    paymentForm.payment_option === 'redirect'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                ]">
                            <div class="flex items-center">
                                <i class="fa fa-external-link-alt text-green-500 mr-3"></i>
                                <div>
                                    <div class="font-medium">Redirect</div>
                                    <div class="text-xs text-gray-600">Go to gateway</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="closePaymentModal" />
                    <Button label="Proceed to Payment" @click="initiatePayment" :loading="paymentForm.loading"
                            :disabled="!paymentForm.gateway || !paymentForm.payment_option" />
                </div>
            </div>
        </Dialog>

        <!-- Invoice View Modal -->
        <Dialog v-model:visible="showInvoiceModal" modal header="Invoice Details" :style="{width: '700px'}">
            <div class="p-4" v-if="selectedInvoice">
                <!-- Invoice Header -->
                <div class="border-b pb-4 mb-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">{{ selectedInvoice.invoice_name }}</h3>
                            <p class="text-gray-600">Invoice #{{ selectedInvoice.invoice_number }}</p>
                        </div>
                        <div class="text-right">
                            <span :class="getStatusColor(selectedInvoice.status)"
                                  class="px-3 py-1 text-sm font-semibold rounded-full">
                                {{ selectedInvoice.status.toUpperCase() }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Invoice Details -->
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-3">Applicant Information</h4>
                        <div class="space-y-2 text-sm">
                            <div>
                                <span class="text-gray-600">Name:</span>
                                <span class="ml-2 font-medium">{{ selectedInvoice.full_name }}</span>
                            </div>
                            <div>
                                <span class="text-gray-600">Application Number:</span>
                                <span class="ml-2 font-medium">{{ selectedInvoice.application_number }}</span>
                            </div>
                            <div>
                                <span class="text-gray-600">Programme:</span>
                                <span class="ml-2 font-medium">{{ selectedInvoice.owner?.programme_name }}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-semibold text-gray-800 mb-3">Invoice Information</h4>
                        <div class="space-y-2 text-sm">
                            <div>
                                <span class="text-gray-600">Session:</span>
                                <span class="ml-2 font-medium">{{ selectedInvoice.session_name }}</span>
                            </div>
                            <div>
                                <span class="text-gray-600">Created:</span>
                                <span class="ml-2 font-medium">{{ formatDate(selectedInvoice.created_at) }}</span>
                            </div>
                            <div v-if="selectedInvoice.paid_at">
                                <span class="text-gray-600">Paid:</span>
                                <span class="ml-2 font-medium">{{ formatDate(selectedInvoice.paid_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Amount Breakdown -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 class="font-semibold text-gray-800 mb-3">Amount Breakdown</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Base Amount:</span>
                            <span class="font-medium">₦{{ formatMoney(selectedInvoice.amount) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Processing Charges:</span>
                            <span class="font-medium">₦{{ formatMoney(selectedInvoice.charges || 0) }}</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between">
                            <span class="font-semibold text-gray-800">Total Amount:</span>
                            <span class="font-bold text-lg text-green-600">
                                ₦{{ formatMoney(selectedInvoice.total_amount || (selectedInvoice.amount + (selectedInvoice.charges || 0))) }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Payment History -->
                <div v-if="selectedInvoice.payment && selectedInvoice.payment.length > 0" class="mb-6">
                    <h4 class="font-semibold text-gray-800 mb-3">Payment History</h4>
                    <div class="space-y-2">
                        <div v-for="payment in selectedInvoice.payment" :key="payment.id"
                             class="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                                <span class="font-medium">{{ payment.reference }}</span>
                                <div class="text-xs text-gray-600">{{ formatDate(payment.created_at) }}</div>
                            </div>
                            <div class="text-right">
                                <span class="font-medium">₦{{ formatMoney(payment.amount) }}</span>
                                <div :class="getPaymentStatusColor(payment.status)"
                                     class="text-xs px-2 py-1 rounded-full">
                                    {{ payment.status }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3">
                    <Button label="Download Invoice" severity="secondary" @click="downloadInvoice(selectedInvoice)" />
                    <Button v-if="selectedInvoice.status === 'unpaid'"
                            label="Pay Now" @click="payInvoice(selectedInvoice); showInvoiceModal = false" />
                    <Button label="Close" @click="showInvoiceModal = false" />
                </div>
            </div>
        </Dialog>

        <!-- Payment Status Alert -->
        <div v-if="paymentStatus" class="fixed top-4 right-4 z-50 w-96">
            <div :class="[
                'p-4 rounded-lg shadow-lg border-l-4',
                paymentStatus === 'successful' 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
            ]">
                <div class="flex items-start">
                    <div :class="[
                        'flex-shrink-0 p-2 rounded-full',
                        paymentStatus === 'successful' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                    ]">
                        <i :class="[
                            'fa text-lg',
                            paymentStatus === 'successful' 
                                ? 'fa-check-circle' 
                                : 'fa-exclamation-circle'
                        ]"></i>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium">
                            {{ paymentStatus === 'successful' ? 'Payment Successful' : 'Payment Failed' }}
                        </h3>
                        <p class="text-sm mt-1">
                            {{ paymentStatus === 'successful' 
                                ? 'Your payment was processed successfully.' 
                                : 'There was an issue processing your payment. Please try again.' 
                            }}
                        </p>
                        <div class="mt-2">
                            <button @click="paymentStatus = null" class="text-sm underline">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth';
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';

export default {
    mixins: [
        schoolInfoMixin
    ],
    components: {
        Dialog,
        Button
    },
    data() {
        return {
            activeTab: 'invoices',
            loading: false,
            showPaymentModal: false,
            showApplicationFeeAlert: false,
            invoices: [],
            payments: [],
            paymentSummary: {
                totalPaid: 0,
                outstanding: 0
            },
            paymentForm: {
                invoice_id: '',
                invoice_type_id: '',
                payment_method: '',
                payment_option: 'widget', // 'widget' or 'redirect'
                loading: false
            },
            invoice_types: [],
            showInvoiceTypeModal: false,
            showInvoiceModal: false,
            selectedInvoice: null,
            paymentGateways: {
                paystack: {
                    name: 'Paystack',
                    icon: 'fa-credit-card',
                    color: 'bg-blue-500'
                },
                remita: {
                    name: 'Remita',
                    icon: 'fa-university',
                    color: 'bg-green-500'
                },
                flutterwave: {
                    name: 'Flutterwave',
                    icon: 'fa-wave-square',
                    color: 'bg-orange-500'
                }
            },
              paymentStatus: null, 
        }
    },
    computed: {
        unpaidInvoices() {
            return this.invoices.filter(invoice => invoice.status === 'unpaid');
        }
    },
    methods: {
        async loadInvoices() {
            this.loading = true;
            try {
                
                const res = await get(this.$endpoints.applicant.getApplicantInvoices.url);
                if (res && res.responseBody) {
                    this.invoices = res.responseBody;
                    this.calculateSummary();
                }
            } catch (error) {
                console.error('Error loading invoices:', error);
            } finally {
                this.loading = false;
            }
        },
        // async loadInvoicesTypes() {
        //     try {
        //         const res = await post(this.$endpoints.applicant.paymentDetails.url, {});
        //         if (res && res.data) {
        //             this.invoice_types = res.data;
        //         }
        //     } catch (error) {
        //         console.error('Error loading invoice types:', error);
        //     }
        // },
        async loadInvoicesTypes() {
            try {
                const res = await post(this.$endpoints.applicant.paymentDetails.url, {});
                if (res && res.data) {
                    this.invoice_types = res.data;
                    // Check if we have an application fee type
                    const hasApplicationFee = res.data.some(
                        type => type.payment_short_name === 'application_fee'
                    );
                    if (!hasApplicationFee) {
                        console.warn("No invoice type with payment_short_name 'application_fee' found");
                    }
                }
            } catch (error) {
                console.error('Error loading invoice types:', error);
            }
        },
        async loadPayments() {
            try {
                const store = useAuthStore()
                const res = await post(this.$endpoints.applicant.getPayment.url, {
                    applicant_id: store.userInfo?.id
                });
                if (res && res.data) {
                    this.payments = res.data;
                }
            } catch (error) {
                console.error('Error loading payments:', error);
            }
        },
        calculateSummary() {
            this.paymentSummary.totalPaid = this.invoices
                .filter(invoice => invoice.status === 'paid')
                .reduce((sum, invoice) => {
                    const amount = invoice.total_amount || (invoice.amount + (invoice.charges || 0));
                    return sum + parseFloat(amount);
                }, 0);

            this.paymentSummary.outstanding = this.invoices
                .filter(invoice => invoice.status === 'unpaid')
                .reduce((sum, invoice) => {
                    const amount = invoice.total_amount || (invoice.amount + (invoice.charges || 0));
                    return sum + parseFloat(amount);
                }, 0);
        },
        async generateInvoice() {
            try {
                this.paymentForm.loading = true;
                const res = await post(this.$endpoints.applicant.generateInvoice.url, {
                    invoice_type_id: this.paymentForm.invoice_type_id
                });

                if (res && !res.error) {
                    await this.loadInvoices();
                    this.$globals.message = {
                        text: "Invoice generated successfully",
                        type: 'success'
                    };
                    this.showInvoiceTypeModal = false;
                    this.paymentForm.invoice_type_id = '';
                } else {
                    this.$globals.message = {
                        text: res?.message || "Failed to generate invoice",
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error generating invoice:', error);
                this.$globals.message = {
                    text: "Error generating invoice",
                    type: 'error'
                };
            } finally {
                this.paymentForm.loading = false;
            }
        },
        async initiatePayment() {
            try {
                this.paymentForm.loading = true;

                const payload = {
                    invoice_id: this.selectedInvoice.id,
                    gateway: this.paymentForm.gateway,
                    metadata: {
                        invoice_number: this.selectedInvoice.invoice_number,
                        applicant_id: this.selectedInvoice.owner_id,
                        invoice_type: this.selectedInvoice.invoice_name
                    }
                };

                const res = await post(this.$endpoints.applicant.initiatePayment.url, payload);

                if (res ) {
                    window.location.href = res;
                    // if (this.paymentForm.payment_option === 'redirect' && res.data?.payment_url) {
                    //     // Redirect to payment gateway
                    // } else if (this.paymentForm.payment_option === 'widget') {
                    //     // Handle widget payment
                    //     this.handleWidgetPayment(res.data);
                    // }

                    this.closePaymentModal();
                } else {
                    this.$globals.message = {
                        text: res?.message || "Failed to initiate payment",
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error initiating payment:', error);
                this.$globals.message = {
                    text: "Error initiating payment",
                    type: 'error'
                };
            } finally {
                this.paymentForm.loading = false;
            }
        },
        async requeryPayment(reference) {
            try {
                const res = await post(this.$endpoints.applicant.requeryPayment.url.replace('{payment_reference?}', reference), {});
                if (res) {
                    await this.loadPayments();
                    this.$globals.message = {
                        text: 'Payment status updated',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error requerying payment:', error);
            }
        },
        handleWidgetPayment(paymentData) {
            const gateway = this.paymentForm.gateway;

            if (gateway === 'paystack') {
                this.handlePaystackWidget(paymentData);
            } else if (gateway === 'flutterwave') {
                this.handleFlutterwaveWidget(paymentData);
            } else if (gateway === 'remita') {
                this.handleRemitaWidget(paymentData);
            }
        },

        handlePaystackWidget(paymentData) {
            if (window.PaystackPop) {
                const handler = window.PaystackPop.setup({
                    key: paymentData.public_key,
                    email: paymentData.email,
                    amount: paymentData.amount * 100, // Paystack expects amount in kobo
                    ref: paymentData.reference,
                    currency: 'NGN',
                    callback: (response) => {
                        this.verifyPayment(response.reference);
                    },
                    onClose: () => {
                        this.$globals.message = {
                            text: "Payment cancelled",
                            type: 'warning'
                        };
                    }
                });
                handler.openIframe();
            } else {
                this.loadPaystackScript(() => this.handlePaystackWidget(paymentData));
            }
        },

        handleFlutterwaveWidget(paymentData) {
            if (window.FlutterwaveCheckout) {
                window.FlutterwaveCheckout({
                    public_key: paymentData.public_key,
                    tx_ref: paymentData.reference,
                    amount: paymentData.amount,
                    currency: 'NGN',
                    payment_options: 'card,mobilemoney,ussd',
                    customer: {
                        email: paymentData.email,
                        phone_number: paymentData.phone,
                        name: paymentData.name
                    },
                    callback: (response) => {
                        if (response.status === 'successful') {
                            this.verifyPayment(response.tx_ref);
                        }
                    },
                    onclose: () => {
                        this.$globals.message = {
                            text: "Payment cancelled",
                            type: 'warning'
                        };
                    }
                });
            } else {
                this.loadFlutterwaveScript(() => this.handleFlutterwaveWidget(paymentData));
            }
        },

        handleRemitaWidget(paymentData) {
            if (window.RmPaymentEngine) {
                const paymentEngine = window.RmPaymentEngine.init({
                    key: paymentData.public_key,
                    customerId: paymentData.customer_id,
                    transactionId: paymentData.reference,
                    amount: paymentData.amount,
                    narration: paymentData.description,
                    onSuccess: (response) => {
                        this.verifyPayment(response.transactionId);
                    },
                    onError: (response) => {
                        this.$globals.message = {
                            text: "Payment failed: " + response.status,
                            type: 'error'
                        };
                    },
                    onCancel: () => {
                        this.$globals.message = {
                            text: "Payment cancelled",
                            type: 'warning'
                        };
                    }
                });
                paymentEngine.showPaymentWidget();
            } else {
                this.loadRemitaScript(() => this.handleRemitaWidget(paymentData));
            }
        },

        loadPaystackScript(callback) {
            if (document.getElementById('paystack-script')) {
                callback();
                return;
            }

            const script = document.createElement('script');
            script.id = 'paystack-script';
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.onload = callback;
            document.head.appendChild(script);
        },

        loadFlutterwaveScript(callback) {
            if (document.getElementById('flutterwave-script')) {
                callback();
                return;
            }

            const script = document.createElement('script');
            script.id = 'flutterwave-script';
            script.src = 'https://checkout.flutterwave.com/v3.js';
            script.onload = callback;
            document.head.appendChild(script);
        },

        loadRemitaScript(callback) {
            if (document.getElementById('remita-script')) {
                callback();
                return;
            }

            const script = document.createElement('script');
            script.id = 'remita-script';
            script.src = 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js';
            script.onload = callback;
            document.head.appendChild(script);
        },

        async verifyPayment(reference) {
            try {
                const res = await post(this.$endpoints.applicant.requeryPayment.url.replace('{payment_reference?}', reference), {});

                if (res && !res.error) {
                    this.$globals.message = {
                        text: "Payment successful!",
                        type: 'success'
                    };
                    await this.loadInvoices();
                    await this.loadPayments();
                } else {
                    this.$globals.message = {
                        text: "Payment verification failed",
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                this.$globals.message = {
                    text: "Error verifying payment",
                    type: 'error'
                };
            }
        },

        viewInvoice(invoice) {
            this.selectedInvoice = invoice;
            this.showInvoiceModal = true;
        },

        payInvoice(invoice) {
            this.selectedInvoice = invoice;
            this.paymentForm.invoice_id = invoice.id;
            this.paymentForm.gateway = '';
            this.paymentForm.payment_option = 'widget';
            this.showPaymentModal = true;
        },

        closePaymentModal() {
            this.showPaymentModal = false;
            this.selectedInvoice = null;
            this.paymentForm = {
                invoice_id: '',
                invoice_type_id: '',
                payment_method: '',
                payment_option: 'widget',
                loading: false
            };
        },

        async downloadInvoice(invoice) {
            try {
                // Create download URL for invoice PDF
                const downloadUrl = `${this.$api.defaults.baseURL}/invoice-pdf`;
                const response = await post(downloadUrl, {
                    invoice_id: invoice.id
                }, { responseType: 'blob' });

                // Create blob and download
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Invoice-${invoice.invoice_number}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading invoice:', error);
                this.$globals.message = {
                    text: "Error downloading invoice",
                    type: 'error'
                };
            }
        },

        getGatewayDescription(gateway) {
            const descriptions = {
                paystack: 'Pay with cards, bank transfer, USSD',
                remita: 'Pay with bank transfer, cards',
                flutterwave: 'Pay with cards, mobile money, bank transfer'
            };
            return descriptions[gateway] || '';
        },
        viewPayment(payment) {
            // You can add a view payment modal here
            console.log('View payment:', payment);
        },

        async downloadReceipt(payment) {
            try {
                // Create download URL for payment receipt PDF
                const downloadUrl = `${this.$api.defaults.baseURL}/receipt-pdf`;
                const response = await post(downloadUrl, {
                    payment_id: payment.id,
                    reference: payment.reference
                }, { responseType: 'blob' });

                // Create blob and download
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Receipt-${payment.reference}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading receipt:', error);
                this.$globals.message = {
                    text: "Error downloading receipt",
                    type: 'error'
                };
            }
        },
        formatMoney(amount) {
            return new Intl.NumberFormat('en-NG').format(amount);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-NG');
        },
        getStatusColor(status) {
            const colors = {
                'paid': 'bg-green-100 text-green-800',
                'unpaid': 'bg-red-100 text-red-800',
                'overdue': 'bg-orange-100 text-orange-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        getPaymentStatusColor(status) {
            const colors = {
                'successful': 'bg-green-100 text-green-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'failed': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },
        checkApplicationFeeRequirement() {
            const store = useAuthStore();
            const userInfo = store.userInfo;

            // Check if this is an imported applicant who hasn't paid application fee
            const isImported = userInfo?.is_imported;
            const hasNotPaid = !userInfo?.application_fee_paid;

            this.showApplicationFeeAlert = isImported && hasNotPaid;
        },
        async quickPayApplicationFee() {
            try {
                // Find application fee in invoice types using payment_short_name
                const applicationFeeType = this.invoice_types.find(type => 
                    type.payment_short_name === 'application_fee'
                );

                if (!applicationFeeType) {
                    this.$globals.message = {
                        text: "Application fee payment type not found. Please contact support.",
                        type: "error"
                    };
                    return;
                }

                // Generate the invoice automatically
                this.paymentForm.loading = true;
                const res = await post(this.$endpoints.applicant.generateInvoice.url, {
                    invoice_type_id: applicationFeeType.id
                });

                if (res && !res.error) {
                    // Reload invoices to get the newly generated one
                    await this.loadInvoices();
                    
                    // Find the newly generated unpaid application fee invoice
                    const newInvoice = res.data
                    
                    // this.invoices.find(invoice => 
                    //     invoice.invoice_type_id === applicationFeeType.id && 
                    //     invoice.status === 'unpaid'
                    // );
                    
                    if (newInvoice) {
                        // Automatically open payment modal for this invoice
                        this.payInvoice(newInvoice);
                    } else {
                        this.$globals.message = {
                            text: "Invoice generated but not found. Please check your invoices.",
                            type: "warning"
                        };
                    }
                } else {
                    this.$globals.message = {
                        text: res?.message || "Failed to generate application fee invoice",
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error processing application fee payment:', error);
                this.$globals.message = {
                    text: "Error processing payment. Please try again.",
                    type: "error"
                };
            } finally {
                this.paymentForm.loading = false;
            }
        },
        checkPaymentStatusFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('status');
            
            if (status === 'successful' || status === 'failed') {
                this.paymentStatus = status;
                
                // Clear the status from URL without reloading
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
                
                // Reload data to reflect payment changes
                this.loadInvoices();
                this.loadPayments();
            }
        }
        // async quickPayApplicationFee() {
        //     try {
        //         console.log(this.invoice_types)
        //         // Find application fee in invoice types
        //         const applicationFeeType = this.invoice_types.find(type =>
        //             type.name.toLowerCase().includes('application') ||
        //             type.name.toLowerCase().includes('form')
        //         );

        //         if (!applicationFeeType) {
        //             this.$globals.message = {
        //                 text: "Application fee payment type not found. Please contact support.",
        //                 type: "error"
        //             };
        //             return;
        //         }

        //         // Set the selected invoice type and show modal
        //         this.selectedInvoiceType = applicationFeeType;
        //         this.showInvoiceTypeModal = true;

        //         // Scroll to the modal or highlight it
        //         this.$nextTick(() => {
        //             const modal = document.querySelector('.modal');
        //             if (modal) {
        //                 modal.scrollIntoView({ behavior: 'smooth' });
        //             }
        //         });

        //     } catch (error) {
        //         console.error('Error setting up application fee payment:', error);
        //         this.$globals.message = {
        //             text: "Error setting up payment. Please try again.",
        //             type: "error"
        //         };
        //     }
        // }
    },
    async mounted() {
        await this.loadInvoices();
        await this.loadPayments();
        await this.loadInvoicesTypes();
        this.checkApplicationFeeRequirement();
        this.checkPaymentStatusFromUrl();
    }
}
</script>
