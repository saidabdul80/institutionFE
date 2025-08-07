<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Curriculum Management</h1>
                        <p class="text-gray-600 dark:text-gray-300">Manage academic curriculums and programme curriculums</p>
                    </div>
                    <div class="flex space-x-3">
                        <button @click="showCreateCurriculumModal = true" 
                                class="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700">
                            <i class="fa fa-plus mr-2"></i>
                            Create Curriculum
                        </button>
                        <button @click="showCreateProgrammeCurriculumModal = true" 
                                class="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700">
                            <i class="fa fa-plus mr-2"></i>
                            Add Programme Curriculum
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="flex space-x-8 px-6">
                        <button @click="activeTab = 'curriculums'" 
                                :class="activeTab === 'curriculums' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'"
                                class="py-4 px-1 border-b-2 font-medium text-sm">
                            Curriculums
                        </button>
                        <button @click="activeTab = 'programme_curriculums'" 
                                :class="activeTab === 'programme_curriculums' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'"
                                class="py-4 px-1 border-b-2 font-medium text-sm">
                            Programme Curriculums
                        </button>
                    </nav>
                </div>

                <!-- Curriculums Tab -->
                <div v-if="activeTab === 'curriculums'" class="p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <div class="flex space-x-4">
                            <input v-model="curriculumSearch" 
                                   @input="loadCurriculums"
                                   placeholder="Search curriculums..." 
                                   class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <select v-model="curriculumStatusFilter" 
                                    @change="loadCurriculums"
                                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button @click="loadCurriculums" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <i class="fa fa-refresh mr-1"></i>Refresh
                        </button>
                    </div>

                    <!-- Curriculums Table -->
                    <Table
                        :title="'Curriculums'"
                        :headers="curriculumHeaders"
                        :paginationData="curriculums"
                        :loading="curriculumLoading"
                        @search="handleCurriculumSearch"
                        @page-change="handleCurriculumPageChange"
                    >
                        <template #td-status="{ row }">
                            <span :class="row.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'"
                                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center">
                                <i :class="row.is_active ? 'fa fa-check-circle' : 'fa fa-times-circle'" class="mr-1"></i>
                                {{ row.is_active ? 'Active' : 'Inactive' }}
                            </span>
                            <span v-if="row.is_active" class="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
                                (Current)
                            </span>
                        </template>
                        <template #td-curriculum.name="{ row }">
                            {{ row.curriculum ? row.curriculum.name : 'N/A' }}
                        </template> 
                        
                        <template #td-effective_date="{ row }">
                            {{ formatDate(row.effective_date) }}
                        </template>
                        
                        <template #td-actions="{ row }">
                            <div class="flex space-x-2">
                                <button @click="editCurriculum(row)" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button v-if="!row.is_active" @click="activateCurriculum(row.id)" 
                                        class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                                    <i class="fa fa-check-circle"></i>
                                </button>
                                <button @click="deleteCurriculum(row.id)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </template>
                    </Table>
                </div>

                <!-- Programme Curriculums Tab -->
                <div v-if="activeTab === 'programme_curriculums'" class="p-6">
                    <div class="mb-4 flex justify-between items-center">
                        <div class="flex space-x-4">
                            <input v-model="programmeCurriculumSearch" 
                                   @input="loadProgrammeCurriculums"
                                   placeholder="Search programme curriculums..." 
                                   class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <select v-model="programmeCurriculumStatusFilter" 
                                    @change="loadProgrammeCurriculums"
                                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button @click="loadProgrammeCurriculums" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <i class="fa fa-refresh mr-1"></i>Refresh
                        </button>
                    </div>

                    <!-- Programme Curriculums Table -->
                    <Table
                        :title="'Programme Curriculums'"
                        :headers="programmeCurriculumHeaders"
                        :paginationData="programmeCurriculums"
                        :loading="programmeCurriculumLoading"
                        @search="handleProgrammeCurriculumSearch"
                        @page-change="handleProgrammeCurriculumPageChange"
                    >
                        <template #td-status="{ row }">

                            <span :class="row.curriculum.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'"
                                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center">
                                <i :class="row.curriculum.is_active ? 'fa fa-check-circle' : 'fa fa-times-circle'" class="mr-1"></i>
                                {{ row.curriculum.is_active ? 'Active' : 'Inactive' }}
                            </span>
                            <span v-if="row.curriculum.is_active" class="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">
                                (Current)
                            </span>
                        </template>
                        
                        <template #td-duration="{ row }">
                            {{ row.duration_years }} years / {{ row.duration_semesters }} semesters
                        </template>
                        
                        <template #td-actions="{ row }">
                            <div class="flex space-x-2">
                                <button @click="editProgrammeCurriculum(row)" class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <!-- <button v-if="!row.is_active" @click="activateProgrammeCurriculum(row.id)" 
                                        class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                                    <i class="fa fa-check-circle"></i>
                                </button> -->
                                <button @click="deleteProgrammeCurriculum(row.id)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </template>
                    </Table>
                </div>
            </div>
        </div>

        <!-- Create/Edit Curriculum Modal -->
        <div v-if="showCreateCurriculumModal || showEditCurriculumModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    {{ showEditCurriculumModal ? 'Edit Curriculum' : 'Create Curriculum' }}
                </h3>

                <form @submit.prevent="saveCurriculum">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                            <input v-model="curriculumForm.name" type="text" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea v-model="curriculumForm.description" rows="3"
                                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Year *</label>
                            <input v-model="curriculumForm.academic_year" type="number" min="2020" max="2050" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Effective Date *</label>
                            <input v-model="curriculumForm.effective_date" type="date" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                            <input v-model="curriculumForm.expiry_date" type="date"
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <div>
                            <label class="flex items-center">
                                <input v-model="curriculumForm.is_active" type="checkbox"
                                       class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Set as active curriculum</span>
                            </label>
                            <p v-if="curriculumForm.is_active" class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                ⚠️ Setting this as active will automatically deactivate all other curriculums.
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button type="button" @click="closeCurriculumModal"
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                        <button type="submit" :disabled="curriculumSaving"
                                class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50">
                            <i v-if="curriculumSaving" class="fa fa-spinner fa-spin mr-2"></i>
                            {{ curriculumSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Create/Edit Programme Curriculum Modal -->
        <div v-if="showCreateProgrammeCurriculumModal || showEditProgrammeCurriculumModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    {{ showEditProgrammeCurriculumModal ? 'Edit Programme Curriculum' : 'Add Programme Curriculum' }}
                </h3>

                <form @submit.prevent="saveProgrammeCurriculum">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Curriculum Selection -->
                        <div :class="programmeCurriculumForm.curriculum_id ? '' : 'col-span-2'">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Curriculum *</label>
                            <Select class="w-full" v-model="programmeCurriculumForm.curriculum" @change="programmeCurriculumForm.curriculum_id = programmeCurriculumForm?.curriculum?.id" required
                                    :options="curriculums" optionLabel="name" :optionValue="null">
                                    <template #optionLable>  </template>
                            </Select>
                         
                        </div>

                        <!-- Programme Selection -->
                        <div v-if="programmeCurriculumForm.curriculum_id">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Programme *</label>
                            <Select 
                                class="w-full" 
                                v-model="programmeCurriculumForm.programme_id" 
                                @change="onProgrammeChange" 
                                required
                                :options="programmes" 
                                optionLabel="name" 
                                optionValue="id">
                            </Select>
                        </div>

                        <!-- Programme Name -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Programme Name *</label>
                            <input v-model="programmeCurriculumForm.name" type="text" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                   placeholder="e.g., Computer Science (2024 Curriculum)">
                        </div>

                        <!-- Description -->
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea v-model="programmeCurriculumForm.description" rows="3"
                                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                      placeholder="Brief description of this programme curriculum"></textarea>
                        </div>

                        <!-- Duration Years -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (Years) *</label>
                            <input v-model="programmeCurriculumForm.duration_years" type="number" min="1" max="10" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <!-- Duration Semesters -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (Semesters) *</label>
                            <input v-model="programmeCurriculumForm.duration_semesters" type="number" min="2" max="20" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <!-- Minimum CGPA -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum CGPA *</label>
                            <input v-model="programmeCurriculumForm.minimum_cgpa" type="number" step="0.01" min="0" max="5" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <!-- Minimum Credit Units -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Credit Units *</label>
                            <input v-model="programmeCurriculumForm.minimum_credit_units" type="number" min="1" required
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>

                        <!-- Active Status -->
                        <div class="md:col-span-2">
                            <label class="flex items-center">
                                <input v-model="programmeCurriculumForm.is_active" type="checkbox"
                                       class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Set as active programme curriculum</span>
                            </label>
                            <p v-if="programmeCurriculumForm.is_active" class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                ⚠️ Setting this as active will automatically deactivate other programme curriculums for the same programme.
                            </p>
                            <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Only one programme curriculum can be active per programme at a time.
                            </p>
                        </div>

                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button type="button" @click="closeProgrammeCurriculumModal"
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                        <button type="submit" :disabled="programmeCurriculumSaving"
                                class="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50">
                            <i v-if="programmeCurriculumSaving" class="fa fa-spinner fa-spin mr-2"></i>
                            {{ programmeCurriculumSaving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, put, del } from '@/api/client' 
import Table from '@/components/Table.vue'
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin'
import Select from 'primevue/select'

export default {
    name: 'CurriculumManagement',
    mixins:[schoolInfoMixin],
    components: {
        Table,
        Select
    },
    data() {
        return {
            activeTab: 'curriculums',

            // Curriculums
            curriculums: [],
            curriculumHeaders: [
                { key: 'name', title: 'Name', bold: true },
                { key: 'academic_year', title: 'Academic Year' },
                { key: 'status', title: 'Status' },
                { key: 'effective_date', title: 'Effective Date', formatDate: true },
                { key: 'programme_curriculums.length', title: 'Programmes' },
                { key: 'actions', title: 'Actions' }
            ],
            curriculumMeta: {},
            curriculumSearch: '',
            curriculumStatusFilter: '',
            curriculumLoading: false,
            curriculumCurrentPage: 1,

            // Programme Curriculums
            programmeCurriculums: [],
            programmeCurriculumHeaders: [
                { key: 'name', title: 'Programme', bold: true },
                { key: 'curriculum.name', title: 'Curriculum' },
                { key: 'duration', title: 'Duration' },
                { key: 'status', title: 'Status' },
                { key: 'actions', title: 'Actions' }
            ],
            programmeCurriculumMeta: {},
            programmeCurriculumSearch: '',
            programmeCurriculumStatusFilter: '',
            programmeCurriculumLoading: false,
            programmeCurriculumCurrentPage: 1,

            // Modals
            showCreateCurriculumModal: false,
            showEditCurriculumModal: false,
            showCreateProgrammeCurriculumModal: false,
            showEditProgrammeCurriculumModal: false,

            // Forms
            curriculumForm: {
                id: null,
                name: '',
                description: '',
                academic_year: new Date().getFullYear(),
                effective_date: '',
                expiry_date: '',
                is_active: false
            },

            programmeCurriculumForm: {
                id: null,
                curriculum_id: '',
                programme_id: '',
                name: '',
                description: '',
                duration_years: 4,
                duration_semesters: 8,
                minimum_cgpa: 1.00,
                minimum_credit_units: 120,
                is_active: false
            },

            // Loading states
            curriculumSaving: false,
            programmeCurriculumSaving: false,

            // Data
            programmes: [],
            activeCurriculum: null,

            // Applications by Programme data
            applicationsByProgramme: [],
            applicationsLoading: false,
            applicationsError: null,
            totalApplications: 0,
            currentSession: null
        }
    },

    async mounted() {
        await Promise.all([
            this.loadCurriculums(),
            this.loadProgrammeCurriculums(),
            this.loadApplicationsByProgramme()
            //this.loadProgrammes()
        ])

        this.programmes = this.schoolProgrammes
    },

    methods: {
        // Curriculum methods
        async loadCurriculums() {
            try {
                this.curriculumLoading = true
                const params = new URLSearchParams()

                if (this.curriculumSearch) {
                    params.append('search', this.curriculumSearch)
                }
                if (this.curriculumStatusFilter) {
                    params.append('status', this.curriculumStatusFilter)
                }
                params.append('page', this.curriculumCurrentPage)

                const response = await get(`${this.$endpoints.staff.curriculum.index.url}?${params}`)
                if (response && !response.error) {
                    this.curriculums = response.data || response
                    this.curriculumMeta = response.meta || {}
                }
            } catch (error) {
                console.error('Error loading curriculums:', error)
                this.$globals.message = {
                    text: 'Error loading curriculums',
                    type: 'error'
                }
            } finally {
                this.curriculumLoading = false
            }
        },

        handleCurriculumSearch(query) {
            this.curriculumSearch = query
            this.loadCurriculums()
        },

        handleCurriculumPageChange(page) {
            this.curriculumCurrentPage = page
            this.loadCurriculums()
        },

        // Programme Curriculum methods
        async loadProgrammeCurriculums() {
            try {
                this.programmeCurriculumLoading = true
                const params = new URLSearchParams()

                if (this.programmeCurriculumSearch) {
                    params.append('search', this.programmeCurriculumSearch)
                }
                if (this.programmeCurriculumStatusFilter) {
                    params.append('status', this.programmeCurriculumStatusFilter)
                }
                params.append('page', this.programmeCurriculumCurrentPage)

                const response = await get(`${this.$endpoints.staff.programmeCurriculum.index.url}?${params}`)
                if (response) {
                    this.programmeCurriculums = response
                }
            } catch (error) {
                console.error('Error loading programme curriculums:', error)
                this.$globals.message = {
                    text: 'Error loading programme curriculums',
                    type: 'error'
                }
            } finally {
                this.programmeCurriculumLoading = false
            }
        },

        async saveProgrammeCurriculum() {
            try {
                this.programmeCurriculumSaving = true

                const url = this.showEditProgrammeCurriculumModal
                    ? `${this.$endpoints.staff.programmeCurriculum.update.url}/${this.programmeCurriculumForm.id}`
                    : this.$endpoints.staff.programmeCurriculum.store.url

                const method = this.showEditProgrammeCurriculumModal ? put : post
                const response = await method(url, this.programmeCurriculumForm)

                if (response && !response.error) {
                    this.$globals.message = {
                        text: `Programme curriculum ${this.showEditProgrammeCurriculumModal ? 'updated' : 'created'} successfully`,
                        type: 'success'
                    }

                    this.closeProgrammeCurriculumModal()
                    await this.loadProgrammeCurriculums()
                }
            } catch (error) {
                console.error('Error saving programme curriculum:', error)
                this.$globals.message = {
                    text: `Error ${this.showEditProgrammeCurriculumModal ? 'updating' : 'creating'} programme curriculum`,
                    type: 'error'
                }
            } finally {
                this.programmeCurriculumSaving = false
            }
        },

        editProgrammeCurriculum(programmeCurriculum) {
            this.programmeCurriculumForm = {
                id: programmeCurriculum.id,
                curriculum_id: programmeCurriculum.curriculum_id,
                programme_id: programmeCurriculum.programme_id,
                name: programmeCurriculum.name,
                description: programmeCurriculum.description || '',
                duration_years: programmeCurriculum.duration_years,
                duration_semesters: programmeCurriculum.duration_semesters,
                minimum_cgpa: programmeCurriculum.minimum_cgpa,
                minimum_credit_units: programmeCurriculum.minimum_credit_units,
                is_active: programmeCurriculum.is_active
            }
            this.showEditProgrammeCurriculumModal = true
        },

        async activateProgrammeCurriculum(id) {
            try {
                const response = await post(`${this.$endpoints.staff.programmeCurriculum.activate.url}/${id}`)
                if (response && !response.error) {
                    this.$globals.message = {
                        text: 'Programme curriculum activated successfully',
                        type: 'success'
                    }
                    await this.loadProgrammeCurriculums()
                }
            } catch (error) {
                console.error('Error activating programme curriculum:', error)
                this.$globals.message = {
                    text: 'Error activating programme curriculum',
                    type: 'error'
                }
            }
        },

        async deleteProgrammeCurriculum(id) {
            if (!confirm('Are you sure you want to delete this programme curriculum?')) return

            try {
                const response = await del(`${this.$endpoints.staff.programmeCurriculum.destroy.url}/${id}`)
                if (response && !response.error) {
                    this.$globals.message = {
                        text: 'Programme curriculum deleted successfully',
                        type: 'success'
                    }
                    await this.loadProgrammeCurriculums()
                }
            } catch (error) {
                console.error('Error deleting programme curriculum:', error)
                this.$globals.message = {
                    text: 'Error deleting programme curriculum',
                    type: 'error'
                }
            }
        },

        closeProgrammeCurriculumModal() {
            this.showCreateProgrammeCurriculumModal = false
            this.showEditProgrammeCurriculumModal = false
            this.programmeCurriculumForm = {
                id: null,
                curriculum_id: '',
                programme_id: '',
                name: '',
                description: '',
                duration_years: 4,
                duration_semesters: 8,
                minimum_cgpa: 1.00,
                minimum_credit_units: 120,
                is_active: false
            }
        },

        handleProgrammeCurriculumSearch(query) {
            this.programmeCurriculumSearch = query
            this.loadProgrammeCurriculums()
        },

        handleProgrammeCurriculumPageChange(page) {
            this.programmeCurriculumCurrentPage = page
            this.loadProgrammeCurriculums()
        },

        // Other existing methods remain the same...
        async saveCurriculum() {
            try {
                this.curriculumSaving = true

                const url = this.showEditCurriculumModal
                    ? `${this.$endpoints.staff.curriculum.update.url}/${this.curriculumForm.id}`
                    : this.$endpoints.staff.curriculum.store.url

                const method = this.showEditCurriculumModal ? put : post
                const response = await method(url, this.curriculumForm)

                if (response && !response.error) {
                    this.$globals.message = {
                        text: `Curriculum ${this.showEditCurriculumModal ? 'updated' : 'created'} successfully`,
                        type: 'success'
                    }

                    this.closeCurriculumModal()
                    await this.loadCurriculums()
                }
            } catch (error) {
                console.error('Error saving curriculum:', error)
                this.$globals.message = {
                    text: `Error ${this.showEditCurriculumModal ? 'updating' : 'creating'} curriculum`,
                    type: 'error'
                }
            } finally {
                this.curriculumSaving = false
            }
        },

        editCurriculum(curriculum) {
            this.curriculumForm = {
                id: curriculum.id,
                name: curriculum.name,
                description: curriculum.description || '',
                academic_year: curriculum.academic_year,
                effective_date: curriculum.effective_date,
                expiry_date: curriculum.expiry_date || '',
                is_active: curriculum.is_active
            }
            this.showEditCurriculumModal = true
        },

        async activateCurriculum(id) {
            // Show confirmation dialog
            const confirmed = confirm(
                'Are you sure you want to activate this curriculum?\n\n' +
                'This will automatically deactivate all other curriculums. ' +
                'Only one curriculum can be active at a time.'
            )

            if (!confirmed) return

            //try {
                const response = await post(`${this.$endpoints.staff.curriculum.activate.url}/${id}/activate`,{})
                if (response && !response.error) {
                    this.$globals.showMessage(response.message || 'Curriculum activated successfully. All other curriculums have been deactivated.', 'success')
                    await this.loadCurriculums()
                }
            // } catch (error) {
            //     console.error('Error activating curriculum:', error)
            //     this.$globals.showMessage(error?.message || 'Error activating curriculum', 'error')
            // }
        },

        async deleteCurriculum(id) {
            if (!confirm('Are you sure you want to delete this curriculum?')) return

            try {
                const response = await del(`${this.$endpoints.staff.curriculum.destroy.url}/${id}`)
                if (response && !response.error) {
                    this.$globals.message = {
                        text: 'Curriculum deleted successfully',
                        type: 'success'
                    }
                    await this.loadCurriculums()
                }
            } catch (error) {
                console.error('Error deleting curriculum:', error)
                this.$globals.message = {
                    text: 'Error deleting curriculum',
                    type: 'error'
                }
            }
        },

        closeCurriculumModal() {
            this.showCreateCurriculumModal = false
            this.showEditCurriculumModal = false
            this.curriculumForm = {
                id: null,
                name: '',
                description: '',
                academic_year: new Date().getFullYear(),
                effective_date: '',
                expiry_date: '',
                is_active: false
            }
        },

        async loadProgrammes() {
            try {
                const response = await get(this.$endpoints.staff.programmeCurriculum.index.url)
                if (response && !response.error) {
                    this.programmes = response
                }
            } catch (error) {
                console.error('Error loading programmes:', error)
            }
        },

        // Helper methods for form auto-population
        onCurriculumChange() {
            this.updateProgrammeCurriculumName()
        },

        onProgrammeChange() {
            this.updateProgrammeCurriculumName()
        },

        updateProgrammeCurriculumName() {
            if (this.programmeCurriculumForm.curriculum_id && this.programmeCurriculumForm.programme_id) {
                const curriculum = this.curriculums.find(c => c.id == this.programmeCurriculumForm.curriculum_id)
                const programme = this.programmes.find(p => p.id == this.programmeCurriculumForm.programme_id)

                if (curriculum && programme) {
                    this.programmeCurriculumForm.name = `${programme.name} (${curriculum.academic_year} Curriculum)`
                }
            }
        },

        // Applications by Programme methods
        async loadApplicationsByProgramme() {
            try {
                this.applicationsLoading = true
                this.applicationsError = null

                const response = await get(this.$endpoints.staff.curriculum.getApplicationsByProgramme.url)
                if (response && !response.error) {
                    this.applicationsByProgramme = response.programmes || []
                    this.totalApplications = response.total_applications || 0
                    this.currentSession = response.session
                } else {
                    this.applicationsError = 'Failed to load applications data'
                }
            } catch (error) {
                console.error('Error loading applications by programme:', error)
                this.applicationsError = 'Error loading applications data'
                this.applicationsByProgramme = []
                this.totalApplications = 0
            } finally {
                this.applicationsLoading = false
            }
        },

        // Utility methods
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-NG')
        },

        formatNumber(number) {
            return new Intl.NumberFormat('en-NG').format(number)
        },

        getProgressBarColor(percentage) {
            if (percentage >= 30) return 'bg-blue-500'
            if (percentage >= 20) return 'bg-green-500'
            if (percentage >= 15) return 'bg-yellow-500'
            if (percentage >= 10) return 'bg-orange-500'
            return 'bg-red-500'
        }
    }
}
</script>