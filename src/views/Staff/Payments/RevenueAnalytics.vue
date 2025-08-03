<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
                        <p class="text-gray-600 mt-1">Comprehensive financial analytics and insights</p>
                    </div>
                    <div class="flex space-x-3">
                        <select v-model="selectedPeriod" @change="loadAnalytics"
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">Last Year</option>
                        </select>
                        <button @click="refreshAnalytics" 
                                :disabled="loading"
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                            <i class="fa fa-refresh mr-2"></i>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <!-- Key Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" v-if="analytics.overview">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p class="text-3xl font-bold text-gray-900">₦{{ formatMoney(analytics.overview.total_revenue) }}</p>
                            <p class="text-sm text-green-600 mt-1">
                                <i class="fa fa-arrow-up mr-1"></i>
                                {{ analytics.overview.revenue_growth }}% from last period
                            </p>
                        </div>
                        <div class="bg-blue-100 rounded-full p-3">
                            <i class="fa fa-money-bill-wave text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Average Transaction</p>
                            <p class="text-3xl font-bold text-gray-900">₦{{ formatMoney(analytics.overview.avg_transaction) }}</p>
                            <p class="text-sm text-blue-600 mt-1">
                                <i class="fa fa-chart-line mr-1"></i>
                                {{ analytics.overview.transaction_count }} transactions
                            </p>
                        </div>
                        <div class="bg-green-100 rounded-full p-3">
                            <i class="fa fa-calculator text-green-600 text-2xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Success Rate</p>
                            <p class="text-3xl font-bold text-gray-900">{{ analytics.overview.success_rate }}%</p>
                            <p class="text-sm text-gray-600 mt-1">
                                {{ analytics.overview.successful_payments }} of {{ analytics.overview.total_payments }}
                            </p>
                        </div>
                        <div class="bg-yellow-100 rounded-full p-3">
                            <i class="fa fa-percentage text-yellow-600 text-2xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Daily Average</p>
                            <p class="text-3xl font-bold text-gray-900">₦{{ formatMoney(analytics.overview.daily_average) }}</p>
                            <p class="text-sm text-purple-600 mt-1">
                                <i class="fa fa-calendar mr-1"></i>
                                Last {{ selectedPeriod }} days
                            </p>
                        </div>
                        <div class="bg-purple-100 rounded-full p-3">
                            <i class="fa fa-calendar-day text-purple-600 text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Revenue Trends and Category Breakdown -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Revenue Trend Chart -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div v-if="analytics.daily_revenue && analytics.daily_revenue.length" class="space-y-2">
                        <div v-for="day in analytics.daily_revenue.slice(-10)" :key="day.date" class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-20 text-sm text-gray-600">{{ formatShortDate(day.date) }}</div>
                                <div class="flex-1 mx-4">
                                    <div class="bg-gray-200 rounded-full h-2">
                                        <div class="bg-blue-600 h-2 rounded-full" 
                                             :style="{ width: (day.amount / analytics.overview.max_daily_revenue * 100) + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-sm font-semibold text-gray-900 w-24 text-right">
                                ₦{{ formatMoney(day.amount) }}
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="fa fa-chart-line text-4xl mb-2"></i>
                        <p>No revenue data available</p>
                    </div>
                </div>

                <!-- Payment Category Breakdown -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                    <div v-if="analytics.category_breakdown && analytics.category_breakdown.length" class="space-y-4">
                        <div v-for="category in analytics.category_breakdown" :key="category.name" class="relative">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
                                <span class="text-sm font-semibold text-gray-900">₦{{ formatMoney(category.amount) }}</span>
                            </div>
                            <div class="bg-gray-200 rounded-full h-2">
                                <div class="h-2 rounded-full" 
                                     :style="{ width: category.percentage + '%', backgroundColor: category.color }"></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{{ category.count }} payments</span>
                                <span>{{ category.percentage }}%</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="fa fa-pie-chart text-4xl mb-2"></i>
                        <p>No category data available</p>
                    </div>
                </div>
            </div>

            <!-- User Type Analysis and Payment Methods -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- User Type Analysis -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue by User Type</h3>
                    <div v-if="analytics.user_type_analysis && analytics.user_type_analysis.length" class="space-y-4">
                        <div v-for="userType in analytics.user_type_analysis" :key="userType.type" class="border rounded-lg p-4">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center">
                                    <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: userType.color }"></div>
                                    <span class="font-medium text-gray-900 capitalize">{{ userType.type }}s</span>
                                </div>
                                <span class="text-lg font-bold text-gray-900">₦{{ formatMoney(userType.total_amount) }}</span>
                            </div>
                            <div class="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p class="text-gray-600">Payments</p>
                                    <p class="font-semibold">{{ userType.payment_count }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-600">Average</p>
                                    <p class="font-semibold">₦{{ formatMoney(userType.avg_amount) }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-600">Success Rate</p>
                                    <p class="font-semibold">{{ userType.success_rate }}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="fa fa-users text-4xl mb-2"></i>
                        <p>No user type data available</p>
                    </div>
                </div>

                <!-- Payment Gateway Analysis -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Gateway Performance</h3>
                    <div v-if="analytics.gateway_analysis && analytics.gateway_analysis.length" class="space-y-4">
                        <div v-for="gateway in analytics.gateway_analysis" :key="gateway.name" class="border rounded-lg p-4">
                            <div class="flex items-center justify-between mb-3">
                                <span class="font-medium text-gray-900">{{ gateway.name || 'Direct Payment' }}</span>
                                <span class="text-lg font-bold text-gray-900">₦{{ formatMoney(gateway.total_amount) }}</span>
                            </div>
                            <div class="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p class="text-gray-600">Transactions</p>
                                    <p class="font-semibold">{{ gateway.transaction_count }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-600">Success Rate</p>
                                    <p class="font-semibold text-green-600">{{ gateway.success_rate }}%</p>
                                </div>
                                <div>
                                    <p class="text-gray-600">Avg. Amount</p>
                                    <p class="font-semibold">₦{{ formatMoney(gateway.avg_amount) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        <i class="fa fa-credit-card text-4xl mb-2"></i>
                        <p>No gateway data available</p>
                    </div>
                </div>
            </div>

            <!-- Top Payment Types -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Top Payment Types</h3>
                </div>
                <div v-if="topPaymentTypesPagination.data.length" class="p-6">
                    <Table
                        :headers="topPaymentTypesHeaders"
                        :paginationData="topPaymentTypesPagination"
                        :loading="false"
                        :showPagination="false">

                        <!-- Payment Type Column -->
                        <template #td-name="{ row }">
                            <span class="font-medium text-gray-900">{{ row.name }}</span>
                        </template>

                        <!-- Category Column -->
                        <template #td-category_name="{ row }">
                            <span class="text-gray-600">{{ row.category_name || 'N/A' }}</span>
                        </template>

                        <!-- Revenue Column -->
                        <template #td-total_revenue="{ row }">
                            <span class="font-semibold text-gray-900">₦{{ formatMoney(row.total_revenue) }}</span>
                        </template>

                        <!-- Count Column -->
                        <template #td-payment_count="{ row }">
                            <span class="text-gray-600">{{ row.payment_count }}</span>
                        </template>

                        <!-- Average Amount Column -->
                        <template #td-avg_amount="{ row }">
                            <span class="text-gray-600">₦{{ formatMoney(row.avg_amount) }}</span>
                        </template>

                        <!-- Success Rate Column -->
                        <template #td-success_rate="{ row }">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  :class="row.success_rate >= 90 ? 'bg-green-100 text-green-800' :
                                         row.success_rate >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'">
                                {{ row.success_rate }}%
                            </span>
                        </template>
                    </Table>
                </div>
                <div v-else class="p-6 text-center text-gray-500">
                    <i class="fa fa-list text-4xl mb-2"></i>
                    <p>No payment type data available</p>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-600">Loading analytics...</p>
            </div>
        </div>
    </div>
</template>

<script>
import { post } from '@/api/client'
import Table from '@/components/Table.vue'

export default {
    name: 'RevenueAnalytics',
    components: {
        Table
    },
    data() {
        return {
            loading: false,
            selectedPeriod: '30',
            analytics: {
                overview: null,
                daily_revenue: [],
                category_breakdown: [],
                user_type_analysis: [],
                gateway_analysis: [],
                top_payment_types: []
            },
            topPaymentTypesPagination: {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 10,
                    total: 0,
                    from: 1,
                    to: 0
                },
                links: []
            },
            topPaymentTypesHeaders: [
                { key: 'name', title: 'Payment Type' },
                { key: 'category_name', title: 'Category' },
                { key: 'total_revenue', title: 'Revenue' },
                { key: 'payment_count', title: 'Count' },
                { key: 'avg_amount', title: 'Avg. Amount' },
                { key: 'success_rate', title: 'Success Rate' }
            ]
        }
    },
    async mounted() {
        await this.loadAnalytics()
    },
    methods: {
        async loadAnalytics() {
            this.loading = true
            try {
                const response = await post(this.$endpoints.staff.getRevenueAnalytics.url, {
                    period: this.selectedPeriod
                })
                if (response && response.data) {
                    this.analytics = response.data

                    // Setup pagination data for top payment types
                    const topPaymentTypes = response.data.top_payment_types || []
                    this.topPaymentTypesPagination.data = topPaymentTypes
                    this.topPaymentTypesPagination.meta.total = topPaymentTypes.length
                    this.topPaymentTypesPagination.meta.from = 1
                    this.topPaymentTypesPagination.meta.to = topPaymentTypes.length
                }
            } catch (error) {
                console.error('Error loading analytics:', error)
                this.$globals.message = {
                    text: 'Failed to load analytics data',
                    type: 'error'
                }
                setTimeout(() => {
                    this.$globals.message.text = ''
                }, 3000)
            } finally {
                this.loading = false
            }
        },
        async refreshAnalytics() {
            await this.loadAnalytics()
        },
        formatMoney(amount) {
            return new Intl.NumberFormat('en-NG').format(amount || 0)
        },
        formatShortDate(date) {
            return new Date(date).toLocaleDateString('en-NG', {
                month: 'short',
                day: 'numeric'
            })
        }
    }
}
</script>
