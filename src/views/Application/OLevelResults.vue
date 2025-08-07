<template>
    <div v-if="form" class="p-6">
        <div class="bg-white rounded-xl shadow-lg border border-gray-100">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-800">O-Level Results</h2>
                <p class="text-gray-600 mt-2">Enter your O-Level examination results</p>
            </div>

            <!-- Content -->
            <div class="p-6">
                <!-- Add New Result Button -->
                <div class="mb-6">
                    <button @click="showAddModal = true" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                        <i class="fa fa-plus mr-2"></i>
                        Add O-Level Result
                    </button>
                </div>

                <!-- Existing Results -->
                <div v-if="oLevelResults.length > 0" class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Your O-Level Results</h3>
                    
                    <div v-for="(result, index) in oLevelResults" :key="index" 
                         class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h4 class="font-semibold text-gray-800">{{ result.exam_type }}</h4>
                                <p class="text-sm text-gray-600">
                                    Exam Number: {{ result.examination_number }} |
                                    {{ result.month }}/{{ result.year }}
                                </p>
                                <div v-if="result.pin || result.serial_number" class="text-xs text-gray-500 mt-1">
                                    <span v-if="result.pin">PIN: {{ result.pin }}</span>
                                    <span v-if="result.pin && result.serial_number"> | </span>
                                    <span v-if="result.serial_number">Serial: {{ result.serial_number }}</span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button v-if="canEdit" @click="editResult(result, index)"
                                        class="text-blue-500 hover:text-blue-700">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button v-if="canEdit" @click="deleteResult(index)"
                                        class="text-red-500 hover:text-red-700">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Subjects and Grades -->
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            <div v-for="(grade, subject) in result.subjects_grades" :key="subject" 
                                 class="bg-white rounded px-3 py-2 text-sm">
                                <span class="font-medium">{{ subject }}:</span>
                                <span class="ml-1 text-blue-600 font-semibold">{{ grade }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Results Message -->
                <div v-else class="text-center py-8">
                    <i class="fa fa-graduation-cap text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No O-Level results added yet</p>
                    <p class="text-sm text-gray-400">Click "Add O-Level Result" to get started</p>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-show="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-800">
                        {{ editingIndex !== null ? 'Edit' : 'Add' }} O-Level Result
                    </h3>
                </div>
                
                <div class="p-6">
                    <!-- Basic Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Exam Type *</label>
                            <select v-model="currentResult.exam_type_id" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Exam Type</option>
                                <option v-for="examType in examTypes" :key="examType.id" :value="examType.id">
                                    {{ examType.name }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Examination Number *</label>
                            <input v-model="currentResult.examination_number"
                                   type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter examination number">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">PIN</label>
                            <input v-model="currentResult.pin"
                                   type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter PIN (if available)">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                            <input v-model="currentResult.serial_number"
                                   type="text"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter serial number (if available)">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                            <select v-model="currentResult.month"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Month</option>
                                <option v-for="month in months" :key="month.value" :value="month.value">
                                    {{ month.label }}
                                </option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                            <select v-model="currentResult.year" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Year</option>
                                <option v-for="year in years" :key="year" :value="year">
                                    {{ year }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Subjects and Grades -->
                    <div class="mb-6">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">Subjects and Grades</h4>
                        
                        <!-- Add Subject Button -->
                        <div class="mb-4">
                            <button @click="addSubject" 
                                    class="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors text-sm">
                                <i class="fa fa-plus mr-2"></i>
                                Add Subject
                            </button>
                        </div>
                        
                        <!-- Subjects List -->
                        <div class="space-y-3">
                            <div v-for="(subject, index) in currentResult.subjects" :key="index"
                                 class="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
                                <div class="flex-1">
                                    <Select 
                                    class="w-full"
                                        :filter="true"
                                        :options="subjects" 
                                        option-label="name" 
                                        option-value="name" 
                                        v-model="subject.name" />
                                    <!-- <select v-model="subject.name"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Subject</option>
                                        <option v-for="subj in subjects" :key="subj.id" :value="subj.name">
                                            {{ subj.name }}
                                        </option>

                                        <option value="custom">Other (Type custom subject)</option>
                                    </select> -->

                                    <input v-if="subject.name === 'custom'"
                                           v-model="subject.customName"
                                           @input="subject.name = subject.customName"
                                           type="text"
                                           placeholder="Enter custom subject"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2">
                                </div>
                                <div class="w-32">
                                    <select v-model="subject.grade"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Grade</option>
                                        <option v-for="grade in grades" :key="grade.value" :value="grade.value">
                                            {{ grade.label }}
                                        </option>
                                    </select>
                                </div>
                                <button @click="removeSubject(index)"
                                        class="text-red-500 hover:text-red-700 p-2">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button @click="closeModal" 
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="saveResult" 
                            v-if="canEdit"
                            :disabled="loading"
                            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                        <i v-show="loading" class="fa fa-spinner fa-spin mr-2"></i>
                        {{ editingIndex !== null ? 'Update' : 'Save' }} Result
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import { useGlobalsStore } from '@/stores/globals';
import Select from 'primevue/select';

export default {
    name: 'OLevelResults',
     props: {
        canEdit: {
            type: Boolean,
            default: true
        },
    },
    setup() {
        const authStore = useAuthStore();
        const globalsStore = useGlobalsStore();
        return { authStore, globalsStore };
    },
    components: {
        Select,
    },
    data() {
        return {
            loading: false,
            showAddModal: false,
            editingIndex: null,
            oLevelResults: [],
            examTypes: [],
            subjects: [],
            grades: [],
            currentResult: {
                exam_type_id: '',
                examination_number: '',
                pin: '',
                serial_number: '',
                month: '',
                year: '',
                subjects: []
            },
            form: {
                session_id: ''
            },
            months: [
                { value: 'January', label: 'January' },
                { value: 'February', label: 'February' },
                { value: 'March', label: 'March' },
                { value: 'April', label: 'April' },
                { value: 'May', label: 'May' },
                { value: 'June', label: 'June' },
                { value: 'July', label: 'July' },
                { value: 'August', label: 'August' },
                { value: 'September', label: 'September' },
                { value: 'October', label: 'October' },
                { value: 'November', label: 'November' },
                { value: 'December', label: 'December' }
            ]
        };
    },
    computed: {
        years() {
            const currentYear = new Date().getFullYear();
            const years = [];
            for (let i = currentYear; i >= currentYear - 20; i--) {
                years.push(i);
            }
            return years;
        }
    },
    async mounted() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Get current session from globals
                this.form.session_id = this.globalsStore.getConfiguration('current_session');

                // Load exam types, subjects, grades, and O-level results
                await Promise.all([
                    this.loadExamTypes(),
                    this.loadSubjects(),
                    this.loadGrades(),
                    this.loadOLevelResults()
                ]);
            } catch (error) {
                console.error('Error loading data:', error);
                this.$globals.message = {
                    text: 'Error loading data',
                    type: 'error'
                };
            } finally {
                this.loading = false;
            }
        },

        async loadExamTypes() {
            try {
                const response = await get(this.$endpoints.applicant.getExamTypes.url);
                if (response && !response.error) {
                    this.examTypes = response;
                }
            } catch (error) {
                console.error('Error loading exam types:', error);
            }
        },

        async loadSubjects() {
            try {
                const response = await get(this.$endpoints.subjects.url);
                if (response && !response.error) {
                    this.subjects = response;
                } else {
                    // Fallback to common Nigerian O-level subjects
                    this.subjects = this.getCommonSubjects();
                }
            } catch (error) {
                console.error('Error loading subjects:', error);
                // Fallback to common Nigerian O-level subjects
                this.subjects = this.getCommonSubjects();
            }
        },

        getCommonSubjects() {
            return [
                { id: 1, name: 'Mathematics' },
                { id: 2, name: 'English Language' },
                { id: 3, name: 'Physics' },
                { id: 4, name: 'Chemistry' },
                { id: 5, name: 'Biology' },
                { id: 6, name: 'Economics' },
                { id: 7, name: 'Government' },
                { id: 8, name: 'Literature in English' },
                { id: 9, name: 'Geography' },
                { id: 10, name: 'History' },
                { id: 11, name: 'Agricultural Science' },
                { id: 12, name: 'Commerce' },
                { id: 13, name: 'Accounting' },
                { id: 14, name: 'Computer Studies' },
                { id: 15, name: 'Further Mathematics' },
                { id: 16, name: 'Civic Education' },
                { id: 17, name: 'Christian Religious Studies' },
                { id: 18, name: 'Islamic Religious Studies' },
                { id: 19, name: 'French' },
                { id: 20, name: 'Hausa' },
                { id: 21, name: 'Igbo' },
                { id: 22, name: 'Yoruba' },
                { id: 23, name: 'Fine Arts' },
                { id: 24, name: 'Music' },
                { id: 25, name: 'Technical Drawing' },
                { id: 26, name: 'Food and Nutrition' },
                { id: 27, name: 'Home Economics' },
                { id: 28, name: 'Health Education' }
            ];
        },

        async loadGrades() {
            try {
                const response = await get(this.$endpoints.applicant.getOLevelGrades.url);
                if (response && !response.error) {
                    this.grades = response;
                }
            } catch (error) {
                console.error('Error loading grades:', error);
                // Fallback to hardcoded grades if API fails
                this.grades = [
                    { value: 'A1', label: 'A1 (Excellent)' },
                    { value: 'B2', label: 'B2 (Very Good)' },
                    { value: 'B3', label: 'B3 (Good)' },
                    { value: 'C4', label: 'C4 (Credit)' },
                    { value: 'C5', label: 'C5 (Credit)' },
                    { value: 'C6', label: 'C6 (Credit)' },
                    { value: 'D7', label: 'D7 (Pass)' },
                    { value: 'E8', label: 'E8 (Pass)' },
                    { value: 'F9', label: 'F9 (Fail)' }
                ];
            }
        },

        async loadOLevelResults() {
            try {
                const response = await post(this.$endpoints.applicant.getOLevelResults.url, {
                    session_id: this.form.session_id
                });
                console.log(response,232)
                if (response && !response.error) {
                    this.oLevelResults = response.data || [];
                }
            } catch (error) {
                console.error('Error loading O-level results:', error);
            }
        },

        addSubject() {
            this.currentResult.subjects.push({
                name: '',
                grade: ''
            });
        },

        removeSubject(index) {
            this.currentResult.subjects.splice(index, 1);
        },

        editResult(result, index) {
            this.editingIndex = index;
            this.currentResult = {
                exam_type_id: result.exam_type_id,
                examination_number: result.examination_number,
                pin: result.pin || '',
                serial_number: result.serial_number || '',
                month: result.month,
                year: result.year,
                subjects: Object.entries(result.subjects_grades || {}).map(([name, grade]) => ({
                    name,
                    grade
                }))
            };
            this.showAddModal = true;
        },

        deleteResult(index) {
            if (confirm('Are you sure you want to delete this O-level result?')) {
                this.oLevelResults.splice(index, 1);
                this.$globals.message = {
                    text: 'O-level result deleted',
                    type: 'success'
                };
            }
        },

        async saveResult() {
            try {
                // Validate required fields
                if (!this.currentResult.exam_type_id || !this.currentResult.examination_number ||
                    !this.currentResult.month || !this.currentResult.year) {
                    this.$globals.message = {
                        text: 'Please fill in all required fields',
                        type: 'error'
                    };
                    return;
                }

                // Validate subjects
                const validSubjects = this.currentResult.subjects.filter(s => s.name && s.grade);
                if (validSubjects.length === 0) {
                    this.$globals.message = {
                        text: 'Please add at least one subject with grade',
                        type: 'error'
                    };
                    return;
                }

                this.loading = true;

                // Convert subjects to the format expected by backend
                const subjects_grades = {};
                validSubjects.forEach(subject => {
                    subjects_grades[subject.name] = subject.grade;
                });

                const payload = {
                    exam_type_id: this.currentResult.exam_type_id,
                    examination_number: this.currentResult.examination_number,
                    pin: this.currentResult.pin,
                    serial_number: this.currentResult.serial_number,
                    month: this.currentResult.month,
                    year: this.currentResult.year,
                    subjects_grades: subjects_grades,
                    session_id: this.form.session_id
                };

                const response = await post(this.$endpoints.applicant.updateOLevelResults.url, payload);

                if (response && !response.error) {
                    this.$globals.message = {
                        text: 'O-level result saved successfully',
                        type: 'success'
                    };

                    // Reload results
                    await this.loadOLevelResults();
                    this.closeModal();
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to save O-level result',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Error saving O-level result:', error);
                this.$globals.message = {
                    text: 'Error saving O-level result',
                    type: 'error'
                };
            } finally {
                this.loading = false;
            }
        },

        closeModal() {
            this.showAddModal = false;
            this.editingIndex = null;
            this.currentResult = {
                exam_type_id: '',
                examination_number: '',
                pin: '',
                serial_number: '',
                month: '',
                year: '',
                subjects: []
            };
        }
    }
};
</script>
