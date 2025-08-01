<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Grade Settings
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Configure Nigerian Higher Institution grading system and degree classifications
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="showAddGradeModal = true" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fa fa-plus mr-2"></i>Add Grade
                    </button>
                    <button @click="resetToDefault" 
                            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fa fa-refresh mr-2"></i>Reset to Default
                    </button>
                </div>
            </div>
        </div>

        <!-- Current Grading System -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Current Grading System</h3>
            
            <!-- Grade Scale Table -->
            <div class="overflow-x-auto mb-6">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score Range</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Point</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="grade in gradeScale" :key="grade.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-2xl font-bold" :class="getGradeColor(grade.grade)">
                                    {{ grade.grade }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ grade.min_score }}% - {{ grade.max_score }}%
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-lg font-bold text-blue-600">{{ grade.point }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ grade.description }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="editGrade(grade)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-edit"></i> Edit
                                    </button>
                                    <button @click="deleteGrade(grade)" 
                                            class="text-red-600 hover:text-red-900">
                                        <i class="fa fa-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Degree Classification -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Degree Classification</h3>
                <button @click="showAddClassModal = true" 
                        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <i class="fa fa-plus mr-2"></i>Add Classification
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA Range</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="degreeClass in degreeClasses" :key="degreeClass.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="font-bold text-lg" :class="getClassColor(degreeClass.name)">
                                    {{ degreeClass.name }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ degreeClass.min_cgpa }} - {{ degreeClass.max_cgpa }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ degreeClass.description }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click="editDegreeClass(degreeClass)" 
                                            class="text-blue-600 hover:text-blue-900">
                                        <i class="fa fa-edit"></i> Edit
                                    </button>
                                    <button @click="deleteDegreeClass(degreeClass)" 
                                            class="text-red-600 hover:text-red-900">
                                        <i class="fa fa-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Grading System Information -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Grading System Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-medium text-gray-700 mb-3">Computation Formula</h4>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-sm text-blue-700 space-y-2">
                            <p><strong>GPA (Grade Point Average):</strong></p>
                            <p class="font-mono">GPA = Σ(Grade Point × Credit Unit) / Σ(Credit Unit)</p>
                            <p class="text-xs">For current semester only</p>
                            
                            <p class="mt-3"><strong>CGPA (Cumulative Grade Point Average):</strong></p>
                            <p class="font-mono">CGPA = Σ(Grade Point × Credit Unit) / Σ(Credit Unit)</p>
                            <p class="text-xs">For all semesters combined</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-medium text-gray-700 mb-3">System Features</h4>
                    <div class="space-y-3">
                        <div class="flex items-center p-3 bg-green-50 rounded-lg">
                            <i class="fa fa-check text-green-500 mr-3"></i>
                            <span class="text-sm text-green-700">5-Point Grading Scale</span>
                        </div>
                        <div class="flex items-center p-3 bg-green-50 rounded-lg">
                            <i class="fa fa-check text-green-500 mr-3"></i>
                            <span class="text-sm text-green-700">Automatic Grade Calculation</span>
                        </div>
                        <div class="flex items-center p-3 bg-green-50 rounded-lg">
                            <i class="fa fa-check text-green-500 mr-3"></i>
                            <span class="text-sm text-green-700">Degree Classification</span>
                        </div>
                        <div class="flex items-center p-3 bg-green-50 rounded-lg">
                            <i class="fa fa-check text-green-500 mr-3"></i>
                            <span class="text-sm text-green-700">Credit Unit Weighting</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Grade Modal -->
        <div v-if="showAddGradeModal || editingGrade" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4">{{ editingGrade ? 'Edit Grade' : 'Add New Grade' }}</h3>
                
                <form @submit.prevent="saveGrade">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Grade Letter</label>
                        <input v-model="gradeForm.grade" type="text" maxlength="2" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Min Score (%)</label>
                            <input v-model.number="gradeForm.min_score" type="number" min="0" max="100" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Max Score (%)</label>
                            <input v-model.number="gradeForm.max_score" type="number" min="0" max="100" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Grade Point</label>
                        <input v-model.number="gradeForm.point" type="number" min="0" max="5" step="0.1" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input v-model="gradeForm.description" type="text" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="flex justify-end gap-2">
                        <button type="button" @click="cancelGradeEdit" 
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            {{ editingGrade ? 'Update' : 'Add' }} Grade
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Add/Edit Degree Class Modal -->
        <div v-if="showAddClassModal || editingClass" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4">{{ editingClass ? 'Edit Classification' : 'Add New Classification' }}</h3>
                
                <form @submit.prevent="saveDegreeClass">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
                        <input v-model="classForm.name" type="text" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Min CGPA</label>
                            <input v-model.number="classForm.min_cgpa" type="number" min="0" max="5" step="0.01" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Max CGPA</label>
                            <input v-model.number="classForm.max_cgpa" type="number" min="0" max="5" step="0.01" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input v-model="classForm.description" type="text" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div class="flex justify-end gap-2">
                        <button type="button" @click="cancelClassEdit" 
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            {{ editingClass ? 'Update' : 'Add' }} Classification
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            loading: false,
            showAddGradeModal: false,
            showAddClassModal: false,
            editingGrade: null,
            editingClass: null,
            gradeForm: {
                grade: '',
                min_score: 0,
                max_score: 0,
                point: 0,
                description: ''
            },
            classForm: {
                name: '',
                min_cgpa: 0,
                max_cgpa: 0,
                description: ''
            },
            gradeScale: [
                { id: 1, grade: 'A', min_score: 70, max_score: 100, point: 5.0, description: 'Excellent' },
                { id: 2, grade: 'B', min_score: 60, max_score: 69, point: 4.0, description: 'Very Good' },
                { id: 3, grade: 'C', min_score: 50, max_score: 59, point: 3.0, description: 'Good' },
                { id: 4, grade: 'D', min_score: 45, max_score: 49, point: 2.0, description: 'Fair' },
                { id: 5, grade: 'E', min_score: 40, max_score: 44, point: 1.0, description: 'Pass' },
                { id: 6, grade: 'F', min_score: 0, max_score: 39, point: 0.0, description: 'Fail' }
            ],
            degreeClasses: [
                { id: 1, name: 'First Class', min_cgpa: 4.50, max_cgpa: 5.00, description: 'First Class Honours' },
                { id: 2, name: 'Second Class Upper', min_cgpa: 3.50, max_cgpa: 4.49, description: 'Second Class Honours (Upper Division)' },
                { id: 3, name: 'Second Class Lower', min_cgpa: 2.40, max_cgpa: 3.49, description: 'Second Class Honours (Lower Division)' },
                { id: 4, name: 'Third Class', min_cgpa: 1.50, max_cgpa: 2.39, description: 'Third Class Honours' },
                { id: 5, name: 'Pass', min_cgpa: 1.00, max_cgpa: 1.49, description: 'Pass' }
            ]
        }
    },
    methods: {
        async loadGradeSettings() {
            try {
                const response = await get(this.$endpoints.staff.getGradeSettings.url);
                if (response && response.data) {
                    this.gradeScale = response.data.grades || this.gradeScale;
                    this.degreeClasses = response.data.degree_classes || this.degreeClasses;
                }
            } catch (error) {
                console.error('Error loading grade settings:', error);
            }
        },
        getGradeColor(grade) {
            const colors = {
                'A': 'text-green-600',
                'B': 'text-blue-600',
                'C': 'text-yellow-600',
                'D': 'text-orange-600',
                'E': 'text-red-600',
                'F': 'text-gray-600'
            };
            return colors[grade] || 'text-gray-600';
        },
        getClassColor(className) {
            const colors = {
                'First Class': 'text-green-600',
                'Second Class Upper': 'text-blue-600',
                'Second Class Lower': 'text-yellow-600',
                'Third Class': 'text-orange-600',
                'Pass': 'text-gray-600'
            };
            return colors[className] || 'text-gray-600';
        },
        editGrade(grade) {
            this.editingGrade = grade;
            this.gradeForm = { ...grade };
            this.showAddGradeModal = false;
        },
        editDegreeClass(degreeClass) {
            this.editingClass = degreeClass;
            this.classForm = { ...degreeClass };
            this.showAddClassModal = false;
        },
        async saveGrade() {
            try {
                const payload = { ...this.gradeForm };
                
                if (this.editingGrade) {
                    payload.id = this.editingGrade.id;
                    const response = await post(this.$endpoints.staff.updateGrade.url, payload);
                    if (response && !response.error) {
                        Object.assign(this.editingGrade, payload);
                    }
                } else {
                    const response = await post(this.$endpoints.staff.createGrade.url, payload);
                    if (response && response.data) {
                        this.gradeScale.push({ ...payload, id: response.data.id });
                    }
                }
                
                this.cancelGradeEdit();
                
                this.$globals.message = {
                    text: `Grade ${this.editingGrade ? 'updated' : 'created'} successfully`,
                    type: 'success'
                };
                setTimeout(() => {
                    this.$globals.message.text = '';
                }, 3000);
            } catch (error) {
                console.error('Error saving grade:', error);
            }
        },
        async saveDegreeClass() {
            try {
                const payload = { ...this.classForm };
                
                if (this.editingClass) {
                    payload.id = this.editingClass.id;
                    const response = await post(this.$endpoints.staff.updateDegreeClass.url, payload);
                    if (response && !response.error) {
                        Object.assign(this.editingClass, payload);
                    }
                } else {
                    const response = await post(this.$endpoints.staff.createDegreeClass.url, payload);
                    if (response && response.data) {
                        this.degreeClasses.push({ ...payload, id: response.data.id });
                    }
                }
                
                this.cancelClassEdit();
                
                this.$globals.message = {
                    text: `Classification ${this.editingClass ? 'updated' : 'created'} successfully`,
                    type: 'success'
                };
                setTimeout(() => {
                    this.$globals.message.text = '';
                }, 3000);
            } catch (error) {
                console.error('Error saving degree class:', error);
            }
        },
        async deleteGrade(grade) {
            if (confirm(`Are you sure you want to delete grade "${grade.grade}"?`)) {
                try {
                    const response = await post(this.$endpoints.staff.deleteGrade.url, { id: grade.id });
                    if (response && !response.error) {
                        const index = this.gradeScale.findIndex(g => g.id === grade.id);
                        if (index > -1) {
                            this.gradeScale.splice(index, 1);
                        }
                        
                        this.$globals.message = {
                            text: 'Grade deleted successfully',
                            type: 'success'
                        };
                        setTimeout(() => {
                            this.$globals.message.text = '';
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error deleting grade:', error);
                }
            }
        },
        async deleteDegreeClass(degreeClass) {
            if (confirm(`Are you sure you want to delete classification "${degreeClass.name}"?`)) {
                try {
                    const response = await post(this.$endpoints.staff.deleteDegreeClass.url, { id: degreeClass.id });
                    if (response && !response.error) {
                        const index = this.degreeClasses.findIndex(c => c.id === degreeClass.id);
                        if (index > -1) {
                            this.degreeClasses.splice(index, 1);
                        }
                        
                        this.$globals.message = {
                            text: 'Classification deleted successfully',
                            type: 'success'
                        };
                        setTimeout(() => {
                            this.$globals.message.text = '';
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Error deleting degree class:', error);
                }
            }
        },
        cancelGradeEdit() {
            this.showAddGradeModal = false;
            this.editingGrade = null;
            this.gradeForm = {
                grade: '',
                min_score: 0,
                max_score: 0,
                point: 0,
                description: ''
            };
        },
        cancelClassEdit() {
            this.showAddClassModal = false;
            this.editingClass = null;
            this.classForm = {
                name: '',
                min_cgpa: 0,
                max_cgpa: 0,
                description: ''
            };
        },
        resetToDefault() {
            if (confirm('Are you sure you want to reset to default? This will overwrite all current settings.')) {
                this.gradeScale = [
                    { id: 1, grade: 'A', min_score: 70, max_score: 100, point: 5.0, description: 'Excellent' },
                    { id: 2, grade: 'B', min_score: 60, max_score: 69, point: 4.0, description: 'Very Good' },
                    { id: 3, grade: 'C', min_score: 50, max_score: 59, point: 3.0, description: 'Good' },
                    { id: 4, grade: 'D', min_score: 45, max_score: 49, point: 2.0, description: 'Fair' },
                    { id: 5, grade: 'E', min_score: 40, max_score: 44, point: 1.0, description: 'Pass' },
                    { id: 6, grade: 'F', min_score: 0, max_score: 39, point: 0.0, description: 'Fail' }
                ];
                
                this.degreeClasses = [
                    { id: 1, name: 'First Class', min_cgpa: 4.50, max_cgpa: 5.00, description: 'First Class Honours' },
                    { id: 2, name: 'Second Class Upper', min_cgpa: 3.50, max_cgpa: 4.49, description: 'Second Class Honours (Upper Division)' },
                    { id: 3, name: 'Second Class Lower', min_cgpa: 2.40, max_cgpa: 3.49, description: 'Second Class Honours (Lower Division)' },
                    { id: 4, name: 'Third Class', min_cgpa: 1.50, max_cgpa: 2.39, description: 'Third Class Honours' },
                    { id: 5, name: 'Pass', min_cgpa: 1.00, max_cgpa: 1.49, description: 'Pass' }
                ];
                
                this.$globals.message = {
                    text: 'Grade settings reset to default Nigerian system',
                    type: 'success'
                };
                setTimeout(() => {
                    this.$globals.message.text = '';
                }, 3000);
            }
        }
    },
    async mounted() {
        await this.loadGradeSettings();
    }
}
</script>
