<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Payment Management</h1>
                        <p class="text-gray-600 mt-1">Manage student and applicant payments</p>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="refreshData"
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fa fa-refresh mr-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                        <select v-model="filters.user_type"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Users</option>
                            <option value="student">Students</option>
                            <option value="applicant">Applicants</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select v-model="filters.status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Status</option>
                            <option value="successful">Successful</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button @click="applyFilters"
                                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-blue-100 rounded-full p-3">
                            <i class="fa fa-money text-blue-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Payments</p>
                            <p class="text-2xl font-bold text-gray-900">₦{{ formatMoney(statistics.total_amount) }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fa fa-check-circle text-green-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Successful</p>
                            <p class="text-2xl font-bold text-gray-900">{{ statistics.successful_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-yellow-100 rounded-full p-3">
                            <i class="fa fa-clock text-yellow-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Pending</p>
                            <p class="text-2xl font-bold text-gray-900">{{ statistics.pending_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-red-100 rounded-full p-3">
                            <i class="fa fa-times-circle text-red-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Failed</p>
                            <p class="text-2xl font-bold text-gray-900">{{ statistics.failed_count }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payments Table -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Payment Records</h2>
                    <p class="text-sm text-gray-500 mt-1">Total: {{ paginationData?.meta?.total || 0 }} payments</p>
                </div>
                <div class="p-6">
                    <Table
                        :headers="paymentHeaders"
                        :paginationData="paginationData"
                        :loading="loading"
                        :showPagination="true"
                        @row-click="viewPayment"
                        @page-change="handlePageChange"
                        @page-length="handlePageLength">

                        <!-- Reference Column -->
                        <template #td-reference="{ row }">
                            <span class="font-mono text-sm text-gray-900">{{ row.reference }}</span>
                        </template>

                        <!-- User Column -->
                        <template #td-user="{ row }">
                            <div>
                                <p class="font-medium text-gray-900">{{ row.user_info?.name || 'N/A' }}</p>
                                <p class="text-sm text-gray-500">{{ row.user_info?.email || 'N/A' }}</p>
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
                                      :class="row.owner_type === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                                    {{ row.owner_type }}
                                </span>
                            </div>
                        </template>

                        <!-- Amount Column -->
                        <template #td-amount="{ row }">
                            <span class="font-semibold text-gray-900">₦{{ formatMoney(row.amount) }}</span>
                        </template>

                        <!-- Status Column -->
                        <template #td-status="{ row }">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  :class="getStatusClass(row.status)">
                                {{ row.status }}
                            </span>
                        </template>

                        <!-- Date Column -->
                        <template #td-created_at="{ row }">
                            {{ formatDate(row.created_at) }}
                        </template>

                        <!-- Actions Column -->
                        <template #td-actions="{ row }">
                            <div class="flex space-x-2">
                                <button @click.stop="viewPayment(row)"
                                        class="text-blue-600 hover:text-blue-800 p-1 rounded"
                                        title="View Details">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <button @click.stop="printReceipt(row)"
                                        class="text-green-600 hover:text-green-800 p-1 rounded"
                                        v-if="row.status === 'successful'"
                                        title="Print Receipt">
                                    <i class="fa fa-print"></i>
                                </button>
                                <button @click.stop="requeryPayment(row)"
                                        class="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                                        v-if="row.status === 'pending'"
                                        title="Requery Payment">
                                    <i class="fa fa-refresh"></i>
                                </button>
                            </div>
                        </template>
                    </Table>
                </div>
            </div>
        </div>

        <!-- Payment Details Modal -->
        <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">Payment Details</h3>
                        <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                </div>

                <div v-if="selectedPayment" class="p-6 space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                            <p class="font-mono text-sm bg-gray-50 p-2 rounded">{{ selectedPayment.reference }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Gateway Reference</label>
                            <p class="font-mono text-sm bg-gray-50 p-2 rounded">{{ selectedPayment.gateway_reference || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <p class="font-semibold text-lg text-green-600">₦{{ formatMoney(selectedPayment.amount) }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                  :class="getStatusClass(selectedPayment.status)">
                                {{ selectedPayment.status }}
                            </span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Gateway</label>
                            <p class="bg-gray-50 p-2 rounded">{{ selectedPayment.gateway || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <p class="bg-gray-50 p-2 rounded">{{ formatDate(selectedPayment.created_at) }}</p>
                        </div>
                    </div>

                    <div v-if="selectedPayment.user_info" class="border-t pt-4">
                        <h4 class="font-medium text-gray-900 mb-3">User Information</h4>
                        <div class="bg-blue-50 rounded-lg p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-1">Name</label>
                                    <p>{{ selectedPayment.user_info.name }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-1">Email</label>
                                    <p>{{ selectedPayment.user_info.email }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-1">User Type</label>
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                          :class="selectedPayment.owner_type === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                                        {{ selectedPayment.owner_type }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedPayment.invoice" class="border-t pt-4">
                        <h4 class="font-medium text-gray-900 mb-3">Invoice Details</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                                    <p class="font-mono text-sm">{{ selectedPayment.invoice.invoice_number }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                                    <p>{{ selectedPayment.invoice.invoice_type?.name }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    <button @click="showPaymentModal = false"
                            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Close
                    </button>
                    <button @click="printReceipt(selectedPayment)"
                            v-if="selectedPayment?.status === 'successful'"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <i class="fa fa-print mr-2"></i>
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { post } from '@/api/client'
import Table from '@/components/Table.vue'

export default {
    name: 'PaymentManagement',
    components: {
        Table
    },
    data() {
        return {
            payments: [],
            paginationData: {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 20,
                    total: 0,
                    from: 1,
                    to: 0
                },
                links: []
            },
            paymentHeaders: [
                { key: 'reference', title: 'Reference' },
                { key: 'user', title: 'User' },
                { key: 'payment_category', title: 'Payment Type' },
                { key: 'amount', title: 'Amount', formatNumber: true, currency: '₦' },
                { key: 'status', title: 'Status' },
                { key: 'created_at', title: 'Date', formatDate: true },
                { key: 'actions', title: 'Actions' }
            ],
            statistics: {
                total_amount: 0,
                successful_count: 0,
                pending_count: 0,
                failed_count: 0
            },
            filters: {
                user_type: '',
                status: ''
            },
            loading: false,
            showPaymentModal: false,
            selectedPayment: null
        }
    },
    async mounted() {
        await this.loadPayments()
        await this.loadStatistics()
    },
    methods: {
        async loadPayments() {
            this.loading = true
            try {
                const response = await post(this.$endpoints.staff.getPayments.url, this.filters)
                if (response && response.data) {
                    // Handle paginated response
                    if (response.data.data) {
                        this.paginationData = response.data
                        this.payments = response.data.data
                    } else {
                        // Handle non-paginated response
                        this.paginationData.data = response.data
                        this.payments = response.data
                        this.paginationData.meta.total = response.data.length
                    }
                } else {
                    this.payments = []
                    this.paginationData.data = []
                }
            } catch (error) {
                console.error('Error loading payments:', error)
                this.$globals.message = {
                    text: 'Failed to load payments',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            } finally {
                this.loading = false
            }
        },
        async loadStatistics() {
            try {
                const response = await post(this.$endpoints.staff.getPaymentStatistics.url, this.filters)
                if (response && response.data) {
                    this.statistics = response.data
                }
            } catch (error) {
                console.error('Error loading statistics:', error)
            }
        },
        async applyFilters() {
            await this.loadPayments()
            await this.loadStatistics()
        },
        async refreshData() {
            await this.loadPayments()
            await this.loadStatistics()
        },
        handlePageChange(url) {
            // Handle pagination page change
            console.log('Page change:', url)
            // You can implement API call with the new page URL here
        },
        handlePageLength(perPage) {
            // Handle rows per page change
            this.filters.per_page = perPage
            this.loadPayments()
        },
        viewPayment(payment) {
            this.selectedPayment = payment
            this.showPaymentModal = true
        },
        async printReceipt(payment) {
            try {
                const response = await post(this.$endpoints.staff.printReceipt.url, {
                    invoice_id: payment.invoice_id
                }, false, true, { responseType: 'blob' })

                if (response) {
                    const blob = new Blob([response], { type: 'application/pdf' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `receipt_${payment.reference}.pdf`
                    link.click()
                    window.URL.revokeObjectURL(url)

                    this.$globals.message = {
                        text: 'Receipt downloaded successfully',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.$globals.message.text = ''
                    }, 3000)
                }
            } catch (error) {
                console.error('Error printing receipt:', error)
                this.$globals.message = {
                    text: 'Failed to generate receipt',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            }
        },
        async requeryPayment(payment) {
            try {
                const url = this.$endpoints.staff.requeryPayment.url.replace('{payment_reference}', payment.reference)
                const response = await post(url, {})
                if (response) {
                    this.$globals.message = {
                        text: 'Payment requeried successfully',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.$globals.message.text = ''
                    }, 3000)
                    await this.loadPayments()
                    await this.loadStatistics()
                }
            } catch (error) {
                console.error('Error requerying payment:', error)
                this.$globals.message = {
                    text: 'Failed to requery payment',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            }
        },

        getStatusClass(status) {
            const classes = {
                'successful': 'bg-green-100 text-green-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'failed': 'bg-red-100 text-red-800'
            }
            return classes[status] || 'bg-gray-100 text-gray-800'
        },
        formatMoney(amount) {
            return new Intl.NumberFormat('en-NG').format(amount || 0)
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }
}
</script>
