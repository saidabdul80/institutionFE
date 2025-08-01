<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Batch Score Input
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Upload multiple student scores using CSV or Excel files
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="$router.push({name: 'staff-scores'})" 
                            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fa fa-arrow-left mr-2"></i>Individual Input
                    </button>
                    <button @click="downloadTemplate" 
                            class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-download mr-2"></i>Download Template
                    </button>
                </div>
            </div>
        </div>

        <!-- Upload Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Upload Score File</h3>
            
            <!-- Course Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Academic Session</label>
                    <select v-model="uploadParams.session_id" @change="loadCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Session</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select v-model="uploadParams.level_id" @change="loadCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Level</option>
                        <option v-for="level in levels" :key="level.id" :value="level.id">
                            {{ level.title }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <select v-model="uploadParams.programme_id" @change="loadCourses" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Programme</option>
                        <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
                            {{ programme.name }}
                        </option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <select v-model="uploadParams.course_id" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Course</option>
                        <option v-for="course in courses" :key="course.id" :value="course.id">
                            {{ course.code }} - {{ course.title }}
                        </option>
                    </select>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                    <select v-model="uploadParams.semester" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Semester</option>
                        <option value="1">First Semester</option>
                        <option value="2">Second Semester</option>
                        <option value="3">Third Semester</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assessment Type</label>
                    <select v-model="uploadParams.assessment_type" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Assessment</option>
                        <option value="ca">Continuous Assessment (CA)</option>
                        <option value="exam">Examination</option>
                        <option value="practical">Practical</option>
                        <option value="project">Project</option>
                    </select>
                </div>
            </div>

            <!-- File Upload Area -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                 @dragover.prevent @drop.prevent="handleFileDrop">
                <div v-if="!selectedFile">
                    <i class="fa fa-cloud-upload text-4xl text-gray-400 mb-4"></i>
                    <p class="text-lg font-medium text-gray-700 mb-2">Drop your file here or click to browse</p>
                    <p class="text-sm text-gray-500 mb-4">Supports CSV, Excel files (Max size: 10MB)</p>
                    <input type="file" @change="handleFileSelect" accept=".csv,.xlsx,.xls" 
                           class="hidden" ref="fileInput">
                    <button @click="$refs.fileInput.click()" 
                            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Choose File
                    </button>
                </div>
                
                <div v-else class="flex items-center justify-center">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                        <i class="fa fa-file text-green-500 text-2xl mr-4"></i>
                        <div class="text-left">
                            <p class="font-medium text-green-800">{{ selectedFile.name }}</p>
                            <p class="text-sm text-green-600">{{ formatFileSize(selectedFile.size) }}</p>
                        </div>
                        <button @click="removeFile" class="ml-4 text-red-500 hover:text-red-700">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Upload Options -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                    <input type="checkbox" v-model="uploadOptions.overwrite" id="overwrite" 
                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label for="overwrite" class="ml-2 text-sm text-gray-700">
                        Overwrite existing scores
                    </label>
                </div>
                
                <div class="flex items-center">
                    <input type="checkbox" v-model="uploadOptions.validate_only" id="validate" 
                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label for="validate" class="ml-2 text-sm text-gray-700">
                        Validate only (don't save)
                    </label>
                </div>
            </div>
            
            <!-- Upload Button -->
            <div class="mt-6 flex justify-end">
                <button @click="uploadFile" :disabled="!canUpload || uploading" 
                        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
                    <i v-if="uploading" class="fa fa-spinner fa-spin mr-2"></i>
                    <i v-else class="fa fa-upload mr-2"></i>
                    {{ uploading ? 'Uploading...' : 'Upload Scores' }}
                </button>
            </div>
        </div>

        <!-- Upload Results -->
        <div v-if="uploadResults" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Upload Results</h3>
            
            <!-- Summary -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-blue-800">Total Records</h4>
                    <p class="text-2xl font-bold text-blue-600">{{ uploadResults.total || 0 }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-medium text-green-800">Successful</h4>
                    <p class="text-2xl font-bold text-green-600">{{ uploadResults.successful || 0 }}</p>
                </div>
                <div class="bg-red-50 p-4 rounded-lg">
                    <h4 class="font-medium text-red-800">Failed</h4>
                    <p class="text-2xl font-bold text-red-600">{{ uploadResults.failed || 0 }}</p>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <h4 class="font-medium text-yellow-800">Warnings</h4>
                    <p class="text-2xl font-bold text-yellow-600">{{ uploadResults.warnings || 0 }}</p>
                </div>
            </div>
            
            <!-- Error Details -->
            <div v-if="uploadResults.errors && uploadResults.errors.length > 0" class="mb-4">
                <h4 class="font-medium text-red-800 mb-2">Errors:</h4>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div v-for="(error, index) in uploadResults.errors" :key="index" 
                         class="text-sm text-red-700 mb-1">
                        Row {{ error.row }}: {{ error.message }}
                    </div>
                </div>
            </div>
            
            <!-- Warning Details -->
            <div v-if="uploadResults.warnings_details && uploadResults.warnings_details.length > 0" class="mb-4">
                <h4 class="font-medium text-yellow-800 mb-2">Warnings:</h4>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div v-for="(warning, index) in uploadResults.warnings_details" :key="index" 
                         class="text-sm text-yellow-700 mb-1">
                        Row {{ warning.row }}: {{ warning.message }}
                    </div>
                </div>
            </div>
            
            <!-- Success Message -->
            <div v-if="uploadResults.successful > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-green-800">
                    <i class="fa fa-check-circle mr-2"></i>
                    Successfully processed {{ uploadResults.successful }} score records.
                </p>
            </div>
        </div>

        <!-- File Format Instructions -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">File Format Instructions</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-medium text-gray-700 mb-3">Required Columns</h4>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center">
                            <i class="fa fa-check text-green-500 mr-2"></i>
                            <strong>matric_number</strong> - Student matriculation number
                        </li>
                        <li class="flex items-center">
                            <i class="fa fa-check text-green-500 mr-2"></i>
                            <strong>score</strong> - Numeric score value
                        </li>
                        <li class="flex items-center">
                            <i class="fa fa-info-circle text-blue-500 mr-2"></i>
                            <strong>student_name</strong> - Optional, for verification
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-medium text-gray-700 mb-3">Format Rules</h4>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center">
                            <i class="fa fa-exclamation-triangle text-yellow-500 mr-2"></i>
                            Scores must be numeric values
                        </li>
                        <li class="flex items-center">
                            <i class="fa fa-exclamation-triangle text-yellow-500 mr-2"></i>
                            Matric numbers must be unique
                        </li>
                        <li class="flex items-center">
                            <i class="fa fa-exclamation-triangle text-yellow-500 mr-2"></i>
                            Maximum score depends on assessment type
                        </li>
                        <li class="flex items-center">
                            <i class="fa fa-exclamation-triangle text-yellow-500 mr-2"></i>
                            First row should contain column headers
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Sample Data -->
            <div class="mt-6">
                <h4 class="font-medium text-gray-700 mb-3">Sample Data Format</h4>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="border-b border-gray-300">
                                <th class="text-left py-2 px-4 font-medium">matric_number</th>
                                <th class="text-left py-2 px-4 font-medium">student_name</th>
                                <th class="text-left py-2 px-4 font-medium">score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-200">
                                <td class="py-2 px-4">CSC/2020/001</td>
                                <td class="py-2 px-4">John Doe</td>
                                <td class="py-2 px-4">85</td>
                            </tr>
                            <tr class="border-b border-gray-200">
                                <td class="py-2 px-4">CSC/2020/002</td>
                                <td class="py-2 px-4">Jane Smith</td>
                                <td class="py-2 px-4">92</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4">CSC/2020/003</td>
                                <td class="py-2 px-4">Bob Johnson</td>
                                <td class="py-2 px-4">78</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, postFormData } from '@/api/client';
import { userDataMixin } from '@/mixins/userDataMixin';

export default {
    mixins: [userDataMixin],
    data() {
        return {
            uploading: false,
            selectedFile: null,
            uploadParams: {
                session_id: '',
                level_id: '',
                programme_id: '',
                course_id: '',
                semester: '',
                assessment_type: ''
            },
            uploadOptions: {
                overwrite: false,
                validate_only: false
            },
            sessions: [],
            levels: [],
            programmes: [],
            courses: [],
            uploadResults: null
        }
    },
    computed: {
        canUpload() {
            return this.selectedFile && 
                   this.uploadParams.session_id && 
                   this.uploadParams.level_id && 
                   this.uploadParams.programme_id && 
                   this.uploadParams.course_id &&
                   this.uploadParams.semester &&
                   this.uploadParams.assessment_type;
        }
    },
    methods: {
        async loadInitialData() {
            // Wait for school info to be loaded if not already available
            await this.waitForSchoolInfo();

            // Use school info data instead of making API calls
            this.sessions = this.schoolSessions;
            this.levels = this.schoolLevels;
            this.programmes = this.schoolProgrammes;
        },
        async loadCourses() {
            if (!this.uploadParams.session_id || !this.uploadParams.level_id || !this.uploadParams.programme_id) {
                this.courses = [];
                return;
            }

            try {
                // Load only courses assigned to current staff
                const staffId = this.$auth.user?.id;
                if (!staffId) {
                    console.error('Staff ID not found');
                    return;
                }

                const response = await get(`${this.$endpoints.staff.getStaffCoursesByStaffID.url}/${staffId}?session_id=${this.uploadParams.session_id}&programme_id=${this.uploadParams.programme_id}&level_id=${this.uploadParams.level_id}`);
                if (response && response.data) {
                    // Transform staff courses to course format
                    this.courses = response.data.map(staffCourse => ({
                        id: staffCourse.course_id,
                        code: staffCourse.course_code,
                        title: staffCourse.course_title || staffCourse.course_name,
                        credit_units: staffCourse.course?.credit_unit || 0
                    }));
                }
            } catch (error) {
                console.error('Error loading staff courses:', error);
                // Fallback to all courses if staff courses fail
                try {
                    const response = await get(`${this.$endpoints.staff.getCoursesByProgram.url}?programme_id=${this.uploadParams.programme_id}&level_id=${this.uploadParams.level_id}&session_id=${this.uploadParams.session_id}`);
                    if (response && response.data) {
                        this.courses = response.data;
                    }
                } catch (fallbackError) {
                    console.error('Error loading fallback courses:', fallbackError);
                }
            }
        },
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                this.validateAndSetFile(file);
            }
        },
        handleFileDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file) {
                this.validateAndSetFile(file);
            }
        },
        validateAndSetFile(file) {
            // Validate file type
            const allowedTypes = ['.csv', '.xlsx', '.xls'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(fileExtension)) {
                alert('Please select a CSV or Excel file');
                return;
            }
            
            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            
            this.selectedFile = file;
            this.uploadResults = null; // Clear previous results
        },
        removeFile() {
            this.selectedFile = null;
            this.uploadResults = null;
            this.$refs.fileInput.value = '';
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        async uploadFile() {
            if (!this.canUpload) return;
            
            this.uploading = true;
            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile);
                formData.append('session_id', this.uploadParams.session_id);
                formData.append('level_id', this.uploadParams.level_id);
                formData.append('programme_id', this.uploadParams.programme_id);
                formData.append('course_id', this.uploadParams.course_id);
                formData.append('semester', this.uploadParams.semester);
                formData.append('assessment_type', this.uploadParams.assessment_type);
                formData.append('overwrite', this.uploadOptions.overwrite);
                formData.append('validate_only', this.uploadOptions.validate_only);
                
                const response = await postFormData(this.$endpoints.staff.batchUploadScores.url, formData);
                
                if (response && response.data) {
                    this.uploadResults = response.data;
                    
                    if (response.data.successful > 0) {
                        this.$globals.message = {
                            text: `Successfully uploaded ${response.data.successful} scores`,
                            type: 'success'
                        };
                    } else if (response.data.failed > 0) {
                        this.$globals.message = {
                            text: `Upload completed with ${response.data.failed} errors`,
                            type: 'warning'
                        };
                    }
                    
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 5000);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                this.$globals.message = {
                    text: 'Error uploading file. Please try again.',
                    type: 'error'
                };
                setTimeout(() => {
                    this.$globals.message.text = '';
                }, 3000);
            } finally {
                this.uploading = false;
            }
        },
        downloadTemplate() {
            // Create a sample CSV template
            const csvContent = "matric_number,student_name,score\nCSC/2020/001,John Doe,85\nCSC/2020/002,Jane Smith,92\nCSC/2020/003,Bob Johnson,78";
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'score_upload_template.csv';
            link.click();
            window.URL.revokeObjectURL(url);
        }
    },
    async mounted() {
        await this.loadInitialData();
    }
}
</script>
