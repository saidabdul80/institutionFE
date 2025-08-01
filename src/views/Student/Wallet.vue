<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Wallet</h2>
                    <p class="text-gray-600">Manage your wallet balance and transactions</p>
                </div>
                <div class="flex gap-2">
                    <button @click="showFundModal = true" class="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
                        <i class="fa fa-plus mr-2"></i>Fund Wallet
                    </button>
                    <button @click="loadWalletData" class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                        <i class="fa fa-refresh mr-2"></i>Refresh
                    </button>
                </div>
            </div>
        </div>

        <!-- Wallet Balance -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-75">Available Balance</p>
                        <p class="text-3xl font-bold">₦{{ formatMoney(walletData.balance || 0) }}</p>
                    </div>
                    <i class="fa fa-wallet text-4xl opacity-50"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-75">Total Funded</p>
                        <p class="text-3xl font-bold">₦{{ formatMoney(walletData.total_funded || 0) }}</p>
                    </div>
                    <i class="fa fa-arrow-up text-4xl opacity-50"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-75">Total Spent</p>
                        <p class="text-3xl font-bold">₦{{ formatMoney(walletData.total_spent || 0) }}</p>
                    </div>
                    <i class="fa fa-arrow-down text-4xl opacity-50"></i>
                </div>
            </div>
        </div>

        <!-- Transaction History -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Transaction History</h3>
                    <div class="flex gap-2">
                        <select v-model="filterType" @change="filterTransactions" 
                                class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Types</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                        <input v-model="searchQuery" @input="filterTransactions" type="text" 
                               placeholder="Search transactions..." 
                               class="px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading transactions...</p>
            </div>
            
            <div v-else-if="filteredTransactions.length === 0" class="p-6 text-center">
                <i class="fa fa-history text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No transactions found</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(transaction.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ transaction.description }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ transaction.type }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <span :class="transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                                    {{ transaction.type === 'credit' ? '+' : '-' }}₦{{ formatMoney(transaction.amount) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₦{{ formatMoney(transaction.balance_after) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ transaction.reference }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Fund Wallet Modal -->
        <Dialog v-model:visible="showFundModal" modal header="Fund Wallet" :style="{width: '500px'}">
            <div class="p-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input v-model="fundForm.amount" type="number" min="100" step="100" 
                           placeholder="Enter amount to fund" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <p class="text-xs text-gray-500 mt-1">Minimum funding amount is ₦100</p>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select v-model="fundForm.payment_method" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Payment Method</option>
                        <option value="card">Card Payment</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="ussd">USSD</option>
                    </select>
                </div>
                
                <div class="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div class="flex items-center">
                        <i class="fa fa-info-circle text-blue-500 mr-2"></i>
                        <div class="text-sm text-blue-700">
                            <p class="font-medium">Funding Information:</p>
                            <ul class="mt-1 list-disc list-inside">
                                <li>Funds will be available immediately after successful payment</li>
                                <li>You can use wallet funds to pay for school fees and other services</li>
                                <li>Transaction charges may apply based on payment method</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" severity="secondary" @click="showFundModal = false" />
                    <Button label="Proceed to Payment" @click="fundWallet" 
                            :disabled="!fundForm.amount || !fundForm.payment_method || fundForm.amount < 100" />
                </div>
            </div>
        </Dialog>

        <!-- Transaction Details Modal -->
        <Dialog v-model:visible="showTransactionModal" modal header="Transaction Details" :style="{width: '500px'}">
            <div v-if="selectedTransaction" class="p-4">
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="font-medium">Reference:</span>
                        <span>{{ selectedTransaction.reference }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Type:</span>
                        <span :class="selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'" 
                              class="font-medium">
                            {{ selectedTransaction.type }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Amount:</span>
                        <span :class="selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'" 
                              class="font-medium">
                            {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ formatMoney(selectedTransaction.amount) }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Balance After:</span>
                        <span>₦{{ formatMoney(selectedTransaction.balance_after) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Date:</span>
                        <span>{{ formatDate(selectedTransaction.created_at) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium">Description:</span>
                        <span>{{ selectedTransaction.description }}</span>
                    </div>
                </div>
                
                <div class="flex justify-end mt-6">
                    <Button label="Close" @click="showTransactionModal = false" />
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
            walletData: {},
            transactions: [],
            filteredTransactions: [],
            selectedTransaction: null,
            showFundModal: false,
            showTransactionModal: false,
            fundForm: {
                amount: '',
                payment_method: ''
            },
            filterType: '',
            searchQuery: '',
            loading: false
        }
    },
    methods: {
        async loadWalletData() {
            this.loading = true;
            try {
                const res = await get(this.$endpoints.student.getWallet.url);
                if (res) {
                    this.walletData = res;
                    this.transactions = res.transactions || [];
                    this.filteredTransactions = this.transactions;
                }
            } catch (error) {
                console.error('Error loading wallet data:', error);
            } finally {
                this.loading = false;
            }
        },
        filterTransactions() {
            let filtered = this.transactions;
            
            if (this.filterType) {
                filtered = filtered.filter(t => t.type === this.filterType);
            }
            
            if (this.searchQuery) {
                filtered = filtered.filter(t => 
                    t.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    t.reference.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            
            this.filteredTransactions = filtered;
        },
        async fundWallet() {
            try {
                const res = await post(this.$endpoints.student.initiatePayment.url, {
                    ...this.fundForm,
                    type: 'wallet_funding'
                });
                
                if (res && res.data) {
                    if (res.data.payment_url) {
                        window.open(res.data.payment_url, '_blank');
                    }
                    this.showFundModal = false;
                    this.fundForm = { amount: '', payment_method: '' };
                    
                    this.$globals.message = {
                        text: 'Payment initiated successfully. Please complete the payment.',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 5000);
                }
            } catch (error) {
                console.error('Error funding wallet:', error);
            }
        },
        viewTransaction(transaction) {
            this.selectedTransaction = transaction;
            this.showTransactionModal = true;
        },
        formatMoney(amount) {
            return new Intl.NumberFormat('en-NG').format(amount);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    async mounted() {
        await this.loadWalletData();
    }
}
</script>
