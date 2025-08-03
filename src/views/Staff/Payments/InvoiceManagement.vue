<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Invoice Management</h1>
                        <p class="text-gray-600 mt-1">Manage student and applicant invoices</p>
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
                        <select v-model="filters.owner_type"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Users</option>
                            <option value="student">Students</option>
                            <option value="applicant">Applicants</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select v-model="filters.status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
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
                            <i class="fa fa-file-text text-blue-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Invoices</p>
                            <p class="text-2xl font-bold text-gray-900">{{ statistics.total_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fa fa-check-circle text-green-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Paid</p>
                            <p class="text-2xl font-bold text-gray-900">{{ statistics.paid_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-yellow-100 rounded-full p-3">
                            <i class="fa fa-clock text-yellow-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Unpaid</p>
                            <p class="text-2xl font-bold text-gray-900">{{ statistics.unpaid_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-purple-100 rounded-full p-3">
                            <i class="fa fa-money text-purple-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Amount</p>
                            <p class="text-2xl font-bold text-gray-900">₦{{ formatMoney(statistics.total_amount) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Invoices Table -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Invoice Records</h2>
                    <p class="text-sm text-gray-500 mt-1">Total: {{ paginationData?.meta?.total || 0 }} invoices</p>
                </div>
                <div class="p-6">
                    <Table
                        :headers="invoiceHeaders"
                        :paginationData="paginationData"
                        :loading="loading"
                        :showPagination="true"
                        @row-click="viewInvoice"
                        @page-change="handlePageChange"
                        @page-length="handlePageLength">

                        <!-- Invoice Number Column -->
                        <template #td-invoice_number="{ row }">
                            <span class="font-mono text-sm text-gray-900">{{ row.invoice_number }}</span>
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
                            <div>
                                <span class="font-semibold text-gray-900">₦{{ formatMoney(row.amount) }}</span>
                                <p class="text-xs text-gray-500" v-if="row.charges">
                                    + ₦{{ formatMoney(row.charges) }} charges
                                </p>
                            </div>
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
                                <button @click.stop="viewInvoice(row)"
                                        class="text-blue-600 hover:text-blue-800 p-1 rounded"
                                        title="View Details">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <button @click.stop="printInvoice(row)"
                                        class="text-green-600 hover:text-green-800 p-1 rounded"
                                        title="Print Invoice">
                                    <i class="fa fa-print"></i>
                                </button>
                                <button @click.stop="sendPaymentLink(row)"
                                        class="text-purple-600 hover:text-purple-800 p-1 rounded"
                                        v-if="row.status === 'unpaid'"
                                        title="Send Payment Link">
                                    <i class="fa fa-send"></i>
                                </button>
                            </div>
                        </template>
                    </Table>
                </div>
            </div>
        </div>

        <!-- Invoice Details Modal -->
        <div v-if="showInvoiceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">Invoice Details</h3>
                        <button @click="showInvoiceModal = false" class="text-gray-400 hover:text-gray-600">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                </div>

                <div v-if="selectedInvoice" class="p-6 space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                            <p class="font-mono text-sm bg-gray-50 p-2 rounded">{{ selectedInvoice.invoice_number }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                  :class="getStatusClass(selectedInvoice.status)">
                                {{ selectedInvoice.status }}
                            </span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">User</label>
                            <p class="bg-gray-50 p-2 rounded">{{ selectedInvoice.user_info?.name || 'N/A' }}</p>
                            <p class="text-sm text-gray-500 mt-1">{{ selectedInvoice.user_info?.email || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  :class="selectedInvoice.owner_type === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                                {{ selectedInvoice.owner_type }}
                            </span>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Type</label>
                            <p class="bg-gray-50 p-2 rounded">{{ selectedInvoice.invoice_type?.name || 'N/A' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                            <p class="bg-gray-50 p-2 rounded">{{ formatDate(selectedInvoice.created_at) }}</p>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">Amount Breakdown</h4>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Base Amount:</span>
                                <span class="font-medium">₦{{ formatMoney(selectedInvoice.amount) }}</span>
                            </div>
                            <div class="flex justify-between" v-if="selectedInvoice.charges">
                                <span>Processing Charges:</span>
                                <span class="font-medium">₦{{ formatMoney(selectedInvoice.charges || 0) }}</span>
                            </div>
                            <div class="border-t pt-2 flex justify-between font-semibold text-lg">
                                <span>Total Amount:</span>
                                <span class="text-green-600">₦{{ formatMoney((selectedInvoice.amount || 0) + (selectedInvoice.charges || 0)) }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedInvoice.payment" class="bg-green-50 rounded-lg p-4">
                        <h4 class="font-medium text-green-900 mb-3">Payment Information</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-green-700 mb-1">Payment Reference</label>
                                <p class="font-mono text-sm">{{ selectedInvoice.payment.reference }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-green-700 mb-1">Payment Date</label>
                                <p>{{ formatDate(selectedInvoice.payment.created_at) }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-green-700 mb-1">Gateway</label>
                                <p>{{ selectedInvoice.payment.gateway || 'N/A' }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-green-700 mb-1">Gateway Reference</label>
                                <p class="font-mono text-sm">{{ selectedInvoice.payment.gateway_reference || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    <button @click="showInvoiceModal = false"
                            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Close
                    </button>
                    <button @click="printInvoice(selectedInvoice)"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <i class="fa fa-print mr-2"></i>
                        Print Invoice
                    </button>
                    <button @click="sendPaymentLink(selectedInvoice)"
                            v-if="selectedInvoice?.status === 'unpaid'"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <i class="fa fa-send mr-2"></i>
                        Send Payment Link
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
    name: 'InvoiceManagement',
    components: {
        Table
    },
    data() {
        return {
            invoices: [],
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
            invoiceHeaders: [
                { key: 'invoice_number', title: 'Invoice Number' },
                { key: 'user', title: 'User' },
                { key: 'invoice_type.name', title: 'Type' },
                { key: 'amount', title: 'Amount', formatNumber: true, currency: '₦' },
                { key: 'status', title: 'Status' },
                { key: 'created_at', title: 'Date', formatDate: true },
                { key: 'actions', title: 'Actions' }
            ],
            statistics: {
                total_count: 0,
                paid_count: 0,
                unpaid_count: 0,
                total_amount: 0
            },
            filters: {
                owner_type: '',
                status: ''
            },
            loading: false,
            showInvoiceModal: false,
            selectedInvoice: null
        }
    },
    async mounted() {
        await this.loadInvoices()
        await this.loadStatistics()
    },
    methods: {
        async loadInvoices() {
            this.loading = true
            try {
                const response = await post(this.$endpoints.staff.getInvoices.url, this.filters)
                if (response && response.data) {
                    // Handle paginated response
                    if (response.data.data) {
                        this.paginationData = response.data
                        this.invoices = response.data.data
                    } else {
                        // Handle non-paginated response
                        this.paginationData.data = response.data
                        this.invoices = response.data
                        this.paginationData.meta.total = response.data.length
                    }
                } else {
                    this.invoices = []
                    this.paginationData.data = []
                }
            } catch (error) {
                console.error('Error loading invoices:', error)
                this.$globals.message = {
                    text: 'Failed to load invoices',
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
                const response = await post(this.$endpoints.staff.getInvoiceStatistics.url, this.filters)
                if (response && response.data) {
                    this.statistics = response.data
                }
            } catch (error) {
                console.error('Error loading statistics:', error)
            }
        },
        async applyFilters() {
            await this.loadInvoices()
            await this.loadStatistics()
        },
        async refreshData() {
            await this.loadInvoices()
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
            this.loadInvoices()
        },
        viewInvoice(invoice) {
            this.selectedInvoice = invoice
            this.showInvoiceModal = true
        },
        async printInvoice(invoice) {
            try {
                const response = await post(this.$endpoints.staff.printInvoice.url, {
                    invoice_id: invoice.id
                }, false, true, { responseType: 'blob' })

                if (response) {
                    const blob = new Blob([response], { type: 'application/pdf' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `invoice_${invoice.invoice_number}.pdf`
                    link.click()
                    window.URL.revokeObjectURL(url)

                    this.$globals.message = {
                        text: 'Invoice downloaded successfully',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.$globals.message.text = ''
                    }, 3000)
                }
            } catch (error) {
                console.error('Error printing invoice:', error)
                this.$globals.message = {
                    text: 'Failed to generate invoice PDF',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            }
        },
        async sendPaymentLink(invoice) {
            try {
                const response = await post(this.$endpoints.staff.sendPaymentLink.url, {
                    invoice_id: invoice.id
                })
                if (response) {
                    this.$globals.message = {
                        text: 'Payment link sent successfully',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.$globals.message.text = ''
                    }, 3000)
                }
            } catch (error) {
                console.error('Error sending payment link:', error)
                this.$globals.message = {
                    text: 'Failed to send payment link',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            }
        },
        getStatusClass(status) {
            const classes = {
                'paid': 'bg-green-100 text-green-800',
                'unpaid': 'bg-yellow-100 text-yellow-800',
                'cancelled': 'bg-red-100 text-red-800'
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
