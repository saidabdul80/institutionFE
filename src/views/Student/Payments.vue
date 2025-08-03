<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Payments</h2>
                    <p class="text-gray-600">Make payments and view payment history</p>
                </div>
                <button @click="showPaymentModal = true" class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                    <i class="fa fa-plus mr-2"></i>Make Payment
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
                        <p class="text-sm opacity-75">Total Payments</p>
                        <p class="text-2xl font-bold">{{ payments.length }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment History -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Payment History</h3>
                    <div class="flex gap-2">
                        <select v-model="filterStatus" @change="filterPayments" 
                                class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Status</option>
                            <option value="successful">Successful</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <input v-model="searchQuery" @input="filterPayments" type="text" 
                               placeholder="Search payments..." 
                               class="px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading payments...</p>
            </div>
            
            <div v-else-if="filteredPayments.length === 0" class="p-6 text-center">
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
                        <tr v-for="payment in filteredPayments" :key="payment.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ payment.reference }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ payment.description || payment.invoice_type }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₦{{ formatMoney(payment.amount) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(payment.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(payment.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ payment.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="viewPaymentDetails(payment)" 
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

        <!-- Make Payment Modal -->
        <Dialog v-model:visible="showPaymentModal" modal header="Make Payment" :style="{width: '600px'}">
            <div class="p-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                    <select v-model="paymentForm.invoice_type_id" @change="loadInvoiceAmount" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Payment Type</option>
                        <option v-for="type in invoiceTypes" :key="type.id" :value="type.id">
                            {{ type.name }} - ₦{{ formatMoney(type.amount) }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input v-model="paymentForm.amount" type="number" readonly 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select v-model="paymentForm.payment_method" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Payment Method</option>
                        <option value="card">Card Payment</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="wallet">Wallet</option>
                    </select>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="showPaymentModal = false" />
                    <Button label="Proceed to Payment" @click="initiatePayment" 
                            :disabled="!paymentForm.invoice_type_id || !paymentForm.payment_method" />
                </div>
            </div>
        </Dialog>

        <!-- Payment Details Modal -->
        <Dialog v-model:visible="showDetailsModal" modal header="Payment Details" :style="{width: '500px'}">
            <div v-if="selectedPayment" class="p-4">
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="font-medium">Reference:</span>
                        <span>{{ selectedPayment.reference }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Amount:</span>
                        <span>₦{{ formatMoney(selectedPayment.amount) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Status:</span>
                        <span :class="getStatusColor(selectedPayment.status)" 
                              class="px-2 py-1 rounded-full text-xs">
                            {{ selectedPayment.status }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Date:</span>
                        <span>{{ formatDate(selectedPayment.created_at) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Payment Method:</span>
                        <span>{{ selectedPayment.payment_method || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Transaction ID:</span>
                        <span>{{ selectedPayment.transaction_id || 'N/A' }}</span>
                    </div>
                </div>
                
                <div class="flex justify-end mt-6">
                    <Button label="Close" @click="showDetailsModal = false" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    components: {
        Dialog,
        Button
    },
    data() {
        return {
            payments: [],
            filteredPayments: [],
            invoiceTypes: [],
            paymentSummary: {
                totalPaid: 0,
                outstanding: 0
            },
            showPaymentModal: false,
            showDetailsModal: false,
            selectedPayment: null,
            paymentForm: {
                invoice_type_id: '',
                amount: 0,
                payment_method: ''
            },
            filterStatus: '',
            searchQuery: '',
            loading: false
        }
    },
    methods: {
        async loadPayments() {
            this.loading = true;
            try {
                const res = await post(this.$endpoints.student.getPayments.url, {});
                if (res && res.data) {
                    this.payments = res.data;
                    this.filteredPayments = res.data;
                    this.calculateSummary();
                }
            } catch (error) {
                console.error('Error loading payments:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadInvoiceTypes() {
            try {
                const res = await post(this.$endpoints.student.getAllInvoiceTypes.url, {});
                if (res && res.data) {
                    this.invoiceTypes = res.data;
                }
            } catch (error) {
                console.error('Error loading invoice types:', error);
            }
        },
        loadInvoiceAmount() {
            const selectedType = this.invoiceTypes.find(type => type.id == this.paymentForm.invoice_type_id);
            if (selectedType) {
                this.paymentForm.amount = selectedType.amount;
            }
        },
        calculateSummary() {
            this.paymentSummary.totalPaid = this.payments
                .filter(p => p.status === 'successful')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        },
        filterPayments() {
            let filtered = this.payments;
            
            if (this.filterStatus) {
                filtered = filtered.filter(p => p.status === this.filterStatus);
            }
            
            if (this.searchQuery) {
                filtered = filtered.filter(p => 
                    p.reference.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
                );
            }
            
            this.filteredPayments = filtered;
        },
        async initiatePayment() {
            try {
                const res = await post(this.$endpoints.student.initiatePayment.url, this.paymentForm);
                if (res && res.data) {
                    // Redirect to payment gateway or handle payment
                    if (res.data.payment_url) {
                        window.open(res.data.payment_url, '_blank');
                    }
                    this.showPaymentModal = false;
                    this.paymentForm = { invoice_type_id: '', amount: 0, payment_method: '' };
                }
            } catch (error) {
                console.error('Error initiating payment:', error);
            }
        },
        async requeryPayment(reference) {
            try {
                const res = await post(this.$endpoints.student.requeryPayment.url.replace('{payment_reference?}', reference), {});
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
        viewPaymentDetails(payment) {
            this.selectedPayment = payment;
            this.showDetailsModal = true;
        },
        async downloadReceipt(payment) {
            try {
                const response = await post(this.$endpoints.student.printReceipt.url, {
                    invoice_id: payment.invoice_id
                }, { responseType: 'blob' });

                if (response) {
                    const blob = new Blob([response], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `receipt_${payment.reference}.pdf`;
                    link.click();
                    window.URL.revokeObjectURL(url);

                    this.$globals.message = {
                        text: 'Receipt downloaded successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error downloading receipt:', error);
                this.$globals.message = {
                    text: 'Failed to download receipt',
                    type: 'error'
                };
                setTimeout(() => {
                    this.$globals.message.text = '';
                }, 3000);
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
                'successful': 'bg-green-100 text-green-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'failed': 'bg-red-100 text-red-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        }
    },
    async mounted() {
        await this.loadPayments();
        await this.loadInvoiceTypes();
    }
}
</script>
