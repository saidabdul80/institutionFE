<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Invoices</h2>
                    <p class="text-gray-600">View and manage your invoices</p>
                </div>
                <button @click="generateInvoice" class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                    <i class="fa fa-plus mr-2"></i>Generate Invoice
                </button>
            </div>
        </div>

        <!-- Invoice Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-blue-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-file-text text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Total Invoices</p>
                        <p class="text-2xl font-bold">{{ invoices.length }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-green-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-check-circle text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Paid Invoices</p>
                        <p class="text-2xl font-bold">{{ paidInvoices }}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-red-500 text-white rounded-lg p-6">
                <div class="flex items-center">
                    <i class="fa fa-exclamation-circle text-2xl mr-4"></i>
                    <div>
                        <p class="text-sm opacity-75">Unpaid Invoices</p>
                        <p class="text-2xl font-bold">{{ unpaidInvoices }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoices Table -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200 p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Invoice List</h3>
                    <div class="flex gap-2">
                        <select v-model="filterStatus" @change="filterInvoices" 
                                class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <select v-model="filterSession" @change="filterInvoices" 
                                class="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">All Sessions</option>
                            <option v-for="session in sessions" :key="session.id" :value="session.id">
                                {{ session.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="p-6 text-center">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p class="text-gray-600 mt-2">Loading invoices...</p>
            </div>
            
            <div v-else-if="filteredInvoices.length === 0" class="p-6 text-center">
                <i class="fa fa-file-text text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No invoices found</p>
            </div>
            
            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="invoice in filteredInvoices" :key="invoice.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {{ invoice.invoice_number }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ invoice.description || invoice.invoice_type }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₦{{ formatMoney(invoice.amount) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(invoice.due_date) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusColor(invoice.status)" 
                                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    {{ invoice.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="viewInvoice(invoice)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-eye"></i> View
                                    </button>
                                    <button @click="downloadInvoice(invoice)" 
                                            class="text-green-600 hover:text-green-900">
                                        <i class="fa fa-download"></i> Download
                                    </button>
                                    <button v-if="invoice.status === 'unpaid'" 
                                            @click="payInvoice(invoice)" 
                                            class="text-purple-600 hover:text-purple-900">
                                        <i class="fa fa-credit-card"></i> Pay
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Invoice Details Modal -->
        <Dialog v-model:visible="showDetailsModal" modal header="Invoice Details" :style="{width: '600px'}">
            <div v-if="selectedInvoice" class="p-4">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Invoice Information</h4>
                        <div class="space-y-2 text-sm">
                            <div><span class="font-medium">Invoice Number:</span> {{ selectedInvoice.invoice_number }}</div>
                            <div><span class="font-medium">Date:</span> {{ formatDate(selectedInvoice.created_at) }}</div>
                            <div><span class="font-medium">Due Date:</span> {{ formatDate(selectedInvoice.due_date) }}</div>
                            <div><span class="font-medium">Status:</span> 
                                <span :class="getStatusColor(selectedInvoice.status)" 
                                      class="px-2 py-1 rounded-full text-xs ml-2">
                                    {{ selectedInvoice.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Student Information</h4>
                        <div class="space-y-2 text-sm">
                            <div><span class="font-medium">Name:</span> {{ selectedInvoice.student_name }}</div>
                            <div><span class="font-medium">Matric Number:</span> {{ selectedInvoice.matric_number }}</div>
                            <div><span class="font-medium">Programme:</span> {{ selectedInvoice.programme }}</div>
                            <div><span class="font-medium">Level:</span> {{ selectedInvoice.level }}</div>
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h4 class="font-semibold text-gray-800 mb-2">Invoice Items</h4>
                    <div class="space-y-2">
                        <div v-for="item in selectedInvoice.items" :key="item.id" 
                             class="flex justify-between items-center py-2 border-b">
                            <span>{{ item.description }}</span>
                            <span class="font-medium">₦{{ formatMoney(item.amount) }}</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-4 border-t font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₦{{ formatMoney(selectedInvoice.amount) }}</span>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Close" severity="secondary" @click="showDetailsModal = false" />
                    <Button v-if="selectedInvoice.status === 'unpaid'" 
                            label="Pay Now" @click="payInvoice(selectedInvoice)" />
                    <Button label="Download" severity="info" @click="downloadInvoice(selectedInvoice)" />
                </div>
            </div>
        </Dialog>

        <!-- Generate Invoice Modal -->
        <Dialog v-model:visible="showGenerateModal" modal header="Generate Invoice" :style="{width: '500px'}">
            <div class="p-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Invoice Type</label>
                    <select v-model="generateForm.invoice_type_id" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Invoice Type</option>
                        <option v-for="type in invoiceTypes" :key="type.id" :value="type.id">
                            {{ type.name }} - ₦{{ formatMoney(type.amount) }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <select v-model="generateForm.session_id" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Session</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="showGenerateModal = false" />
                    <Button label="Generate" @click="submitGenerateInvoice" 
                            :disabled="!generateForm.invoice_type_id || !generateForm.session_id" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    mixins: [schoolInfoMixin],
    components: {
        Dialog,
        Button
    },
    data() {
        return {
            invoices: [],
            filteredInvoices: [],
            sessions: [],
            invoiceTypes: [],
            selectedInvoice: null,
            showDetailsModal: false,
            showGenerateModal: false,
            generateForm: {
                invoice_type_id: '',
                session_id: ''
            },
            filterStatus: '',
            filterSession: '',
            loading: false
        }
    },
    computed: {
        paidInvoices() {
            return this.invoices.filter(invoice => invoice.status === 'paid').length;
        },
        unpaidInvoices() {
            return this.invoices.filter(invoice => invoice.status === 'unpaid').length;
        }
    },
    methods: {
        async loadInvoices() {
            this.loading = true;
            try {
                const res = await get(this.$endpoints.student.getStudentInvoices.url.replace('{session_id}', ''));
                if (res && res.data) {
                    this.invoices = res.data;
                    this.filteredInvoices = res.data;
                }
            } catch (error) {
                console.error('Error loading invoices:', error);
            } finally {
                this.loading = false;
            }
        },
        async loadSessions() {
            // Wait for school info to be loaded if not already available
            await this.waitForSchoolInfo();

            // Use school info data instead of making API calls
            this.sessions = this.schoolSessions;
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
        filterInvoices() {
            let filtered = this.invoices;
            
            if (this.filterStatus) {
                filtered = filtered.filter(invoice => invoice.status === this.filterStatus);
            }
            
            if (this.filterSession) {
                filtered = filtered.filter(invoice => invoice.session_id == this.filterSession);
            }
            
            this.filteredInvoices = filtered;
        },
        generateInvoice() {
            this.showGenerateModal = true;
        },
        async submitGenerateInvoice() {
            try {
                const res = await post(this.$endpoints.student.generateInvoice.url, this.generateForm);
                if (res && !res.error) {
                    this.showGenerateModal = false;
                    this.generateForm = { invoice_type_id: '', session_id: '' };
                    await this.loadInvoices();
                    this.$globals.message = {
                        text: 'Invoice generated successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error generating invoice:', error);
            }
        },
        viewInvoice(invoice) {
            this.selectedInvoice = invoice;
            this.showDetailsModal = true;
        },
        payInvoice(invoice) {
            this.$router.push({ name: 'student-payments', query: { invoice_id: invoice.id } });
        },
        async downloadInvoice(invoice) {
            try {
                const response = await post(this.$endpoints.student.printInvoice.url, {
                    invoice_id: invoice.id
                }, { responseType: 'blob' });

                if (response) {
                    const blob = new Blob([response], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `invoice_${invoice.invoice_number}.pdf`;
                    link.click();
                    window.URL.revokeObjectURL(url);

                    this.$globals.message = {
                        text: 'Invoice downloaded successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error downloading invoice:', error);
                this.$globals.message = {
                    text: 'Failed to download invoice',
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
                'paid': 'bg-green-100 text-green-800',
                'unpaid': 'bg-red-100 text-red-800',
                'overdue': 'bg-orange-100 text-orange-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        }
    },
    async mounted() {
        await this.loadInvoices();
        await this.loadSessions();
        await this.loadInvoiceTypes();
    }
}
</script>
