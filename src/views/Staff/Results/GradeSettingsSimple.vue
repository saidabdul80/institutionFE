<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header Section -->
            <Card class="shadow-sm">
                <template #content>
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex-1">
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Grade Settings Management
                            </h1>
                            <p class="text-gray-600">
                                Configure grading scales for programmes and general use
                            </p>
                            <div class="text-sm text-green-600 mt-2" v-if="gradeSettings.length > 0">
                                ✅ {{ gradeSettings.length }} grade settings loaded successfully
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-3">
                            <Button @click="showCreateModal = true" icon="pi pi-plus" label="Add Grade Setting"
                                class="p-button-primary" size="small" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Filter Section -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-filter text-primary"></i>
                        <span>Filter Grade Settings</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Programme</label>
                            <Dropdown v-model="filters.programme_id" :options="programmeOptions" optionLabel="label"
                                optionValue="value" placeholder="All Programmes" @change="loadGradeSettings"
                                class="w-full" :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Grade</label>
                            <Dropdown v-model="filters.grade" :options="gradeOptions" optionLabel="label"
                                optionValue="value" placeholder="All Grades" @change="loadGradeSettings" class="w-full"
                                :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Status</label>
                            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label"
                                optionValue="value" placeholder="All Statuses" @change="loadGradeSettings"
                                class="w-full" :showClear="true" />
                        </div>

                        <div class="flex flex-col gap-2 justify-end">
                            <label class="text-sm font-medium text-gray-700">&nbsp;</label>
                            <Button @click="clearFilters" icon="pi pi-filter-slash" label="Clear Filters"
                                class="p-button-secondary p-button-outlined" size="small" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Grade Settings Table -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-table text-primary"></i>
                        <span>Grade Settings</span>
                    </div>
                </template>
                <template #content>
                    <div v-if="loading" class="text-center py-8">
                        <i class="pi pi-spinner pi-spin text-2xl text-gray-400"></i>
                        <p class="text-gray-500 mt-2">Loading grade settings...</p>
                    </div>

                    <div v-else-if="gradeSettings.length === 0" class="text-center py-8">
                        <i class="pi pi-info-circle text-2xl text-gray-400"></i>
                        <p class="text-gray-500 mt-2">No grade settings found</p>
                        <p class="text-sm text-gray-400 mt-2">Click "Add Grade Setting" to create your first grade
                            setting</p>
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="border border-gray-200 px-4 py-2 text-left">Grade</th>
                                    <th class="border border-gray-200 px-4 py-2 text-left">Min Score</th>
                                    <th class="border border-gray-200 px-4 py-2 text-left">Max Score</th>
                                    <th class="border border-gray-200 px-4 py-2 text-left">Grade Point</th>
                                    <th class="border border-gray-200 px-4 py-2 text-left">Status</th>
                                    <th class="border border-gray-200 px-4 py-2 text-left">Programme</th>
                                    <th class="border border-gray-200 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="grade in gradeSettings" :key="grade.id">
                                    <td class="border border-gray-200 px-4 py-2 font-bold">{{ grade.grade }}</td>
                                    <td class="border border-gray-200 px-4 py-2">{{ grade.min_score }}%</td>
                                    <td class="border border-gray-200 px-4 py-2">{{ grade.max_score }}%</td>
                                    <td class="border border-gray-200 px-4 py-2">{{ grade.grade_point }}</td>
                                    <td class="border border-gray-200 px-4 py-2">
                                        <span :class="grade.status === 'pass' ? 'text-green-600' : 'text-red-600'">
                                            {{ grade.status }}
                                        </span>
                                    </td>
                                    <td class="border border-gray-200 px-4 py-2">
                                        <span v-if="grade.programme_id" class="text-blue-600">
                                            {{ getProgrammeName(grade.programme_id) }}
                                        </span>
                                        <span v-else class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                            General
                                        </span>
                                    </td>
                                    <td class="border border-gray-200 px-4 py-2">
                                        <Button icon="pi pi-pencil" class="p-button-sm p-button-text"
                                            @click="editGrade(grade)" title="Edit" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </Card>

            <!-- Simple Modal -->
            <Dialog v-model:visible="showCreateModal" modal
                :header="editMode ? 'Edit Grade Setting' : 'Add Grade Setting'" class="w-96">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Programme</label>
                        <Dropdown v-model="gradeForm.programme_id" :options="programmeOptions" optionLabel="label"
                            optionValue="value" placeholder="Select Programme (Optional)" class="w-full"
                            :showClear="true" />
                        <small class="text-gray-500">Leave empty for general grade setting</small>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <InputText v-model="gradeForm.grade" placeholder="e.g., A" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
                        <InputNumber v-model="gradeForm.min_score" :min="0" :max="100" :minFractionDigits="0"
                            :maxFractionDigits="2" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                        <InputNumber v-model="gradeForm.max_score" :min="0" :max="100" :minFractionDigits="0"
                            :maxFractionDigits="2" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Grade Point</label>
                        <InputNumber v-model="gradeForm.grade_point" :min="0" :max="5" :minFractionDigits="2"
                            class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <Dropdown v-model="gradeForm.status" :options="statusOptions" optionLabel="label"
                            optionValue="value" placeholder="Select Status" class="w-full" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" severity="secondary" @click="closeModal" />
                    <Button :label="editMode ? 'Update' : 'Save'" @click="saveGrade" :loading="saving" />
                </template>
            </Dialog>

            <!-- Toast for notifications -->
            <Toast />
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';
import endpointRoutes from '@/stores/endpointRoutes.js';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';

export default {
    components: {
        Card,
        Button,
        Dialog,
        InputText,
        InputNumber,
        Dropdown,
        Toast
    },
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            saving: false,
            showCreateModal: false,
            editMode: false,
            gradeSettings: [],
            filters: {
                programme_id: null,
                grade: null,
                status: null
            },
            gradeForm: {
                id: null,
                programme_id: null,
                grade: '',
                min_score: null,
                max_score: null,
                grade_point: null,
                status: 'pass'
            },
            programmeOptions: [
                { label: 'General (All Programmes)', value: null }
            ],
            gradeOptions: [
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'C', value: 'C' },
                { label: 'D', value: 'D' },
                { label: 'E', value: 'E' },
                { label: 'F', value: 'F' }
            ],
            statusOptions: [
                { label: 'Pass', value: 'pass' },
                { label: 'Fail', value: 'fail' }
            ]
        }
    },
    async mounted() {
        console.log('GradeSettingsSimple component mounted');
        await this.loadInitialData();
        await this.loadGradeSettings();
    },
    methods: {
        async loadInitialData() {
            console.log('Loading initial data...');
            try {
                // Load programmes
                if (this.schoolProgrammes && this.schoolProgrammes.length > 0) {
                    this.programmeOptions = [
                        { label: 'General (All Programmes)', value: null },
                        ...this.schoolProgrammes.map(prog => ({
                            label: prog.name,
                            value: prog.id
                        }))
                    ];
                    console.log('Programme options loaded:', this.programmeOptions);
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        },

        async loadGradeSettings() {
            console.log('Loading grade settings with filters:', this.filters);
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.filters.programme_id) {
                    params.append('programme_id', this.filters.programme_id);
                }

                const baseUrl = this.$endpoints?.staff?.getGradeSettings?.url || endpointRoutes.staff.getGradeSettings.url;
                const url = `${baseUrl}?${params}`;
                console.log('API URL:', url);

                const response = await get(url);
                console.log('API Response:', response);

                // Handle different response structures
                let gradeSettingsData = [];
                if (response && response.data && response.data.grade_settings) {
                    // Standard API response structure
                    gradeSettingsData = response.data.grade_settings;
                } else if (response && response.grade_settings) {
                    // Direct response structure
                    gradeSettingsData = response.grade_settings;
                } else if (response && Array.isArray(response)) {
                    // Array response
                    gradeSettingsData = response;
                }

                // Apply client-side filtering for grade and status
                let filteredData = gradeSettingsData;

                if (this.filters.grade) {
                    filteredData = filteredData.filter(grade =>
                        grade.grade.toLowerCase() === this.filters.grade.toLowerCase()
                    );
                }

                if (this.filters.status) {
                    filteredData = filteredData.filter(grade =>
                        grade.status.toLowerCase() === this.filters.status.toLowerCase()
                    );
                }

                this.gradeSettings = filteredData;
                console.log('Filtered grade settings:', this.gradeSettings);
                console.log('Grade settings length:', this.gradeSettings.length);
            } catch (error) {
                console.error('Error loading grade settings:', error);
            } finally {
                this.loading = false;
            }
        },

        getProgrammeName(programmeId) {
            if (!programmeId) return 'General';
            const programme = this.schoolProgrammes?.find(p => p.id === programmeId);
            return programme ? programme.name : `Programme ${programmeId}`;
        },

        clearFilters() {
            console.log('Clearing filters...');
            this.filters = {
                programme_id: null,
                grade: null,
                status: null
            };
            this.loadGradeSettings();
        },
        editGrade(grade) {
            console.log('Edit grade:', grade);
            this.editMode = true;
            this.gradeForm = {
                id: grade.id,
                programme_id: grade.programme_id,
                grade: grade.grade,
                min_score: parseFloat(grade.min_score),
                max_score: parseFloat(grade.max_score),
                grade_point: parseFloat(grade.grade_point),
                status: grade.status
            };
            this.showCreateModal = true;
        },
        closeModal() {
            this.showCreateModal = false;
            this.editMode = false;
            this.gradeForm = {
                id: null,
                programme_id: null,
                grade: '',
                min_score: null,
                max_score: null,
                grade_point: null,
                status: 'pass'
            };
        },

        async saveGrade() {
            const action = this.editMode ? 'update' : 'create';
            console.log(`${action} grade:`, this.gradeForm);
            console.log('Edit mode:', this.editMode);

            this.saving = true;
            try {
                // Use the correct nested endpoint path
                const saveUrl = this.$endpoints?.staff?.saveGradeSetting?.url || endpointRoutes.staff.saveGradeSetting.url;
                console.log('Using save URL:', saveUrl);

                const response = await post(saveUrl, this.gradeForm);
                console.log('Save response:', response);

                if (response && !response.error) {
                    const successMessage = this.editMode ? 'Grade setting updated successfully!' : 'Grade setting created successfully!';
                    console.log(successMessage);
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: successMessage,
                        life: 3000
                    });
                    await this.loadGradeSettings();
                    this.closeModal();
                } else {
                    console.error('Error saving grade setting:', response.message);
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || 'Failed to save grade setting',
                        life: 5000
                    });
                }
            } catch (error) {
                console.error('Error saving grade setting:', error);
                if (error.response?.status === 401) {
                    console.error('Authentication error - user may need to log in again');
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Authentication Error',
                        detail: 'Please log in again to continue',
                        life: 5000
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response?.data?.message || 'Failed to save grade setting',
                        life: 5000
                    });
                }
            } finally {
                this.saving = false;
            }
        }
    }
}
</script>
