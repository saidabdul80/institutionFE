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
                            <div class="text-sm text-blue-600 mt-2">
                                Component loaded successfully! Loading: {{ loading }}
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
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                optionValue="value" placeholder="All Status" @change="loadGradeSettings" class="w-full"
                                :showClear="true" />
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Grade Settings Table -->
            <Card class="shadow-sm">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-list text-primary"></i>
                        <span>Grade Settings</span>
                    </div>
                </template>
                <template #content>
                    <DataTable :value="gradeSettings" :loading="loading" :paginator="true" :rows="10"
                        :rowsPerPageOptions="[10, 25, 50]"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        responsiveLayout="scroll" class="p-datatable-sm">
                        <Column field="grade" header="Grade" sortable>
                            <template #body="{ data }">
                                <span class="font-semibold text-lg">{{ data.grade }}</span>
                            </template>
                        </Column>

                        <Column field="min_score" header="Min Score" sortable>
                            <template #body="{ data }">
                                <span>{{ data.min_score }}%</span>
                            </template>
                        </Column>

                        <Column field="max_score" header="Max Score" sortable>
                            <template #body="{ data }">
                                <span>{{ data.max_score }}%</span>
                            </template>
                        </Column>

                        <Column field="grade_point" header="Grade Point" sortable>
                            <template #body="{ data }">
                                <span class="font-medium">{{ data.grade_point }}</span>
                            </template>
                        </Column>

                        <Column field="status" header="Status" sortable>
                            <template #body="{ data }">
                                <Tag :value="data.status" :severity="data.status === 'pass' ? 'success' : 'danger'" />
                            </template>
                        </Column>

                        <Column field="programme" header="Programme">
                            <template #body="{ data }">
                                <span v-if="data.programme_id">{{ data.programme?.name || 'N/A' }}</span>
                                <Tag v-else value="General" severity="info" />
                            </template>
                        </Column>

                        <Column header="Actions" :exportable="false">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                                        @click="editGradeSetting(data)" title="Edit" />
                                    <Button icon="pi pi-trash"
                                        class="p-button-rounded p-button-text p-button-sm p-button-danger"
                                        @click="deleteGradeSetting(data)" title="Delete" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>

            <!-- Create/Edit Modal -->
            <Dialog v-model:visible="showCreateModal" modal
                :header="editingGrade ? 'Edit Grade Setting' : 'Create Grade Setting'" :style="{ width: '600px' }">
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Programme</label>
                            <Dropdown v-model="gradeForm.programme_id" :options="programmeOptions" optionLabel="label"
                                optionValue="value" placeholder="Select Programme (Optional)" class="w-full"
                                :showClear="true" />
                            <small class="text-gray-500">Leave empty for general grade setting</small>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Grade *</label>
                            <InputText v-model="gradeForm.grade" placeholder="e.g., A, B, C" class="w-full"
                                maxlength="2" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Min Score *</label>
                            <InputNumber v-model="gradeForm.min_score" :min="0" :max="100" placeholder="0"
                                class="w-full" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Max Score *</label>
                            <InputNumber v-model="gradeForm.max_score" :min="0" :max="100" placeholder="100"
                                class="w-full" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Grade Point *</label>
                            <InputNumber v-model="gradeForm.grade_point" :min="0" :max="5" :minFractionDigits="2"
                                :maxFractionDigits="2" placeholder="0.00" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700">Status *</label>
                            <Dropdown v-model="gradeForm.status" :options="statusOptions" optionLabel="label"
                                optionValue="value" placeholder="Select Status" class="w-full" />
                        </div>
                    </div>


                </div>

                <template #footer>
                    <div class="flex justify-end gap-2">
                        <Button label="Cancel" severity="secondary" @click="closeModal" />
                        <Button :label="editingGrade ? 'Update' : 'Create'" @click="saveGradeSetting"
                            :loading="saving" />
                    </div>
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';

export default {
    components: {
        Card,
        Button,
        Dropdown,
        DataTable,
        Column,
        Dialog,
        InputText,
        InputNumber,
        Tag
    },
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            saving: false,
            showCreateModal: false,
            editingGrade: null,
            gradeSettings: [],
            programmes: [],
            filters: {
                programme_id: null,
                grade: null,
                status: null
            },
            gradeForm: {
                programme_id: null,
                grade: '',
                min_score: null,
                max_score: null,
                grade_point: null,
                status: ''
            },
            programmeOptions: [],
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
        console.log('GradeSettingsManagement component mounted');
        try {
            await this.loadInitialData();
            await this.loadGradeSettings();
        } catch (error) {
            console.error('Error in mounted hook:', error);
        }
    },
    methods: {
        async loadInitialData() {
            try {
                await this.loadProgrammes();
                this.setupProgrammeOptions();
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        },
        setupProgrammeOptions() {
            this.programmeOptions = [
                { label: 'General (All Programmes)', value: null },
                ...this.programmes.map(programme => ({
                    label: programme.name,
                    value: programme.id
                }))
            ];
        },
        async loadGradeSettings() {
            console.log('Loading grade settings...');
            this.loading = true;
            try {
                const params = new URLSearchParams();
                if (this.filters.programme_id) {
                    params.append('programme_id', this.filters.programme_id);
                }

                const url = `${this.$endpoints.getGradeSettings.url}?${params}`;
                console.log('API URL:', url);
                console.log('Endpoints:', this.$endpoints.getGradeSettings);

                const response = await get(url);
                console.log('API Response:', response);

                if (response && response.data) {
                    this.gradeSettings = response.data.grade_settings || [];
                    console.log('Grade settings loaded:', this.gradeSettings);
                } else {
                    console.log('No data in response');
                }
            } catch (error) {
                console.error('Error loading grade settings:', error);
                console.error('Error details:', error.response);
            } finally {
                this.loading = false;
            }
        },
        editGradeSetting(gradeSetting) {
            this.editingGrade = gradeSetting;
            this.gradeForm = { ...gradeSetting };
            this.showCreateModal = true;
        },
        async saveGradeSetting() {
            this.saving = true;
            try {
                const payload = { ...this.gradeForm };
                if (this.editingGrade) {
                    payload.id = this.editingGrade.id;
                }

                const response = await post(this.$endpoints.saveGradeSetting.url, payload);
                if (response && !response.error) {
                    await this.loadGradeSettings();
                    this.closeModal();

                    this.$globals.message = {
                        text: this.editingGrade ? 'Grade setting updated successfully' : 'Grade setting created successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error saving grade setting:', error);
            } finally {
                this.saving = false;
            }
        },
        closeModal() {
            this.showCreateModal = false;
            this.editingGrade = null;
            this.gradeForm = {
                programme_id: null,
                grade: '',
                min_score: null,
                max_score: null,
                grade_point: null,
                status: ''
            };
        },
        async deleteGradeSetting(gradeSetting) {
            if (confirm('Are you sure you want to delete this grade setting?')) {
                try {
                    // Implement delete functionality
                    console.log('Delete grade setting:', gradeSetting);
                } catch (error) {
                    console.error('Error deleting grade setting:', error);
                }
            }
        }
    }
}
</script>
