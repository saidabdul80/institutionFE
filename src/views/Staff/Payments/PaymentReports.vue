<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Payment Reports</h1>
                        <p class="text-gray-600 mt-1">Generate detailed payment reports and analytics</p>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="generateReport" 
                                :disabled="loading"
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                            <i class="fa fa-chart-bar mr-2"></i>
                            Generate Report
                        </button>
                        <button @click="exportReport" 
                                :disabled="!reportData.length"
                                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                            <i class="fa fa-download mr-2"></i>
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Report Filters -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select v-model="filters.dateRange" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="this_week">This Week</option>
                            <option value="last_week">Last Week</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                            <option value="this_year">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <div v-if="filters.dateRange === 'custom'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input type="date" v-model="filters.startDate" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div v-if="filters.dateRange === 'custom'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input type="date" v-model="filters.endDate" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                        <select v-model="filters.userType" 
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
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Payment Category</label>
                        <select v-model="filters.paymentCategory" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Categories</option>
                            <option v-for="category in paymentCategories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                        <select v-model="filters.paymentType" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Types</option>
                            <option v-for="type in paymentTypes" :key="type.id" :value="type.id">
                                {{ type.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                        <select v-model="filters.sessionId" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Sessions</option>
                            <option v-for="session in sessions" :key="session.id" :value="session.id">
                                {{ session.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Report Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" v-if="reportSummary">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-blue-100 rounded-full p-3">
                            <i class="fa fa-money-bill-wave text-blue-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p class="text-2xl font-bold text-gray-900">₦{{ formatMoney(reportSummary.total_revenue) }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fa fa-check-circle text-green-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Successful Payments</p>
                            <p class="text-2xl font-bold text-gray-900">{{ reportSummary.successful_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-yellow-100 rounded-full p-3">
                            <i class="fa fa-clock text-yellow-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Pending Payments</p>
                            <p class="text-2xl font-bold text-gray-900">{{ reportSummary.pending_count }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="bg-purple-100 rounded-full p-3">
                            <i class="fa fa-percentage text-purple-600 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-600">Success Rate</p>
                            <p class="text-2xl font-bold text-gray-900">{{ reportSummary.success_rate }}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment by Category Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" v-if="categoryData.length">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue by Payment Category</h3>
                    <div class="space-y-3">
                        <div v-for="category in categoryData" :key="category.name" class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: category.color }"></div>
                                <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-gray-900">₦{{ formatMoney(category.amount) }}</p>
                                <p class="text-xs text-gray-500">{{ category.percentage }}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Payments by User Type</h3>
                    <div class="space-y-3">
                        <div v-for="userType in userTypeData" :key="userType.name" class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: userType.color }"></div>
                                <span class="text-sm font-medium text-gray-700">{{ userType.name }}</span>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-gray-900">₦{{ formatMoney(userType.amount) }}</p>
                                <p class="text-xs text-gray-500">{{ userType.count }} payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Report Table -->
            <div class="bg-white rounded-lg shadow-sm" v-if="reportPaginationData.data.length">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">Detailed Payment Report</h2>
                    <p class="text-sm text-gray-500 mt-1">{{ reportPaginationData.meta.total }} payments found</p>
                </div>
                <div class="p-6">
                    <Table
                        :headers="reportHeaders"
                        :paginationData="reportPaginationData"
                        :loading="false"
                        :showPagination="true"
                        @page-change="handleReportPageChange"
                        @page-length="handleReportPageLength">

                        <!-- Date Column -->
                        <template #td-created_at="{ row }">
                            {{ formatDate(row.created_at) }}
                        </template>

                        <!-- Reference Column -->
                        <template #td-reference="{ row }">
                            <span class="font-mono text-sm text-gray-900">{{ row.reference }}</span>
                        </template>

                        <!-- User Column -->
                        <template #td-user="{ row }">
                            <div>
                                <p class="font-medium text-gray-900">{{ row.user_info?.name || 'N/A' }}</p>
                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
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
                    </Table>
                </div>
            </div>

            <!-- No Data State -->
            <div v-else-if="!loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
                <i class="fa fa-chart-bar text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Report Data</h3>
                <p class="text-gray-500 mb-4">Select your filters and click "Generate Report" to view payment data.</p>
                <button @click="generateReport" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Report
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Generating report...</p>
            </div>
        </div>
    </div>
</template>

<script>
import { post } from '@/api/client'
import Table from '@/components/Table.vue'

export default {
    name: 'PaymentReports',
    components: {
        Table
    },
    data() {
        return {
            loading: false,
            reportData: [],
            reportPaginationData: {
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
            reportHeaders: [
                { key: 'created_at', title: 'Date', formatDate: true },
                { key: 'reference', title: 'Reference' },
                { key: 'user', title: 'User' },
                { key: 'invoice.invoice_type.name', title: 'Payment Type' },
                { key: 'invoice.invoice_type.payment_category.name', title: 'Category' },
                { key: 'amount', title: 'Amount', formatNumber: true, currency: '₦' },
                { key: 'status', title: 'Status' },
                { key: 'gateway', title: 'Gateway' }
            ],
            reportSummary: null,
            categoryData: [],
            userTypeData: [],
            paymentCategories: [],
            paymentTypes: [],
            sessions: [],
            filters: {
                dateRange: 'this_month',
                startDate: '',
                endDate: '',
                userType: '',
                status: '',
                paymentCategory: '',
                paymentType: '',
                sessionId: ''
            }
        }
    },
    async mounted() {
        await this.loadFilterOptions()
    },
    methods: {
        async loadFilterOptions() {
            try {
                // Load payment categories
                const categoriesResponse = await post(this.$endpoints.staff.getPaymentCategories.url, {})
                if (categoriesResponse && categoriesResponse.data) {
                    this.paymentCategories = categoriesResponse.data
                }

                // Load payment types (invoice types)
                const typesResponse = await post(this.$endpoints.staff.getInvoiceTypes.url, {})
                if (typesResponse && typesResponse.data) {
                    this.paymentTypes = typesResponse.data
                }

                // Load sessions
                const sessionsResponse = await post(this.$endpoints.staff.getSessions.url, {})
                if (sessionsResponse && sessionsResponse.data) {
                    this.sessions = sessionsResponse.data
                }
            } catch (error) {
                console.error('Error loading filter options:', error)
            }
        },
        async generateReport() {
            this.loading = true
            try {
                const response = await post(this.$endpoints.staff.generatePaymentReport.url, this.filters)
                if (response && response.data) {
                    const payments = response.data.payments || []
                    this.reportData = payments

                    // Setup pagination data
                    this.reportPaginationData.data = payments
                    this.reportPaginationData.meta.total = payments.length
                    this.reportPaginationData.meta.from = 1
                    this.reportPaginationData.meta.to = payments.length

                    this.reportSummary = response.data.summary || null
                    this.categoryData = response.data.category_breakdown || []
                    this.userTypeData = response.data.user_type_breakdown || []
                }
            } catch (error) {
                console.error('Error generating report:', error)
                this.$globals.message = {
                    text: 'Failed to generate report',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            } finally {
                this.loading = false
            }
        },
        async exportReport() {
            try {
                const response = await post(this.$endpoints.staff.exportPaymentReport.url, this.filters, false, true, { responseType: 'blob' })
                
                if (response) {
                    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `payment_report_${new Date().toISOString().split('T')[0]}.xlsx`
                    link.click()
                    window.URL.revokeObjectURL(url)
                    
                    this.$globals.message = {
                        text: 'Report exported successfully',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.$globals.message.text = ''
                    }, 3000)
                }
            } catch (error) {
                console.error('Error exporting report:', error)
                this.$globals.message = {
                    text: 'Failed to export report',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            }
        },
        handleReportPageChange(url) {
            // Handle pagination page change for report table
            console.log('Report page change:', url)
        },
        handleReportPageLength(perPage) {
            // Handle rows per page change for report table
            console.log('Report page length:', perPage)
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
