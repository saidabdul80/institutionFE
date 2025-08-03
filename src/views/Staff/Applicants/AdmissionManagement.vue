<template>
    <div class="p-4 sm:p-6 max-w-7xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div class="flex-1">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                        Admission Management
                    </h1>
                    <p class="text-gray-600 text-sm sm:text-base">
                        Process admissions and manage qualified applicants
                    </p>
                </div>
                <div class="flex gap-2">
                    <button @click="$router.push({ name: 'staff-applicant-dashboard' })"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fa fa-tachometer mr-2"></i>Dashboard
                    </button>
                    <button @click="processAllQualified"
                        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fa fa-check-circle mr-2"></i>Process All
                    </button>
                </div>
            </div>
        </div>

        <!-- Admission Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">
                            Qualified Applicants
                        </p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {{ admissionStats.qualified || 0 }}
                        </p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-check-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Admitted</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {{ admissionStats.admitted || 0 }}
                        </p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-graduation-cap text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Pending Admission</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {{ admissionStats.pending || 0 }}
                        </p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-clock-o text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="text-xs sm:text-sm opacity-75 mb-1">Not Admitted</p>
                        <p class="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {{ admissionStats.notAdmitted || 0 }}
                        </p>
                    </div>
                    <div class="bg-white/20 rounded-full p-3">
                        <i class="fa fa-times-circle text-xl sm:text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Filter Applicants
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
                    <select v-model="filters.session_id" @change="loadApplicants"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Programmes</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                    <select v-model="filters.programme_id" @change="loadApplicants"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Programmes</option>
                        <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
                            {{ programme.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Score Range</label>
                    <select v-model="filters.jamb_range" @change="loadApplicants"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Scores</option>
                        <option value="300-400">300-400</option>
                        <option value="250-299">250-299</option>
                        <option value="200-249">200-249</option>
                        <option value="180-199">180-199</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select v-model="filters.sort_by" @change="loadApplicants"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="jamb_score_desc">JAMB Score (High to Low)</option>
                        <option value="jamb_score_asc">JAMB Score (Low to High)</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="date_desc">Application Date (Recent)</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white rounded-t-xl shadow-lg border-b border-gray-200">
            <nav class="-mb-px flex">
                <button v-for="tab in tabs" :key="tab.id" @click="changeTab(tab)" :class="[
                    activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm'
                ]">
                    {{ tab.label }} ({{ getTabCount(tab.id) }})
                </button>
            </nav>
        </div>

        <!-- Tab Content - Using Table Component -->
        <div class="bg-white rounded-b-xl shadow-lg border border-gray-100">
            <!-- Pending Tab -->
             
            <div v-if="activeTabMain === 'not admitted'">
                <Table title="Pending Admission" :headers="tableHeaders" :paginationData="notAdmittedApplicants"
                    :loading="loading" :showCheckboxes="true" @page-change="changeNotAdmittedPage"
                    @selected-rows="selectedApplicants = $event"
                    @search="handleNotAdmittedSearch" @bulk-action="handleBulkAction">
                    <template #td-actions="{ row }">
                        <div class="flex gap-2">
                            <button @click="admitApplicant(row)" :disabled="row.admission_status === 'admitted'"
                                class="text-green-600 hover:text-green-900 disabled:opacity-50">
                                <i class="fa fa-check"></i> Admit
                            </button>
                            <button @click="rejectApplicant(row)" 
                                class="text-red-600 hover:text-red-900 disabled:opacity-50">
                                <i class="fa fa-times"></i> Reject
                            </button>
                            <button @click="viewApplicant(row)" class="text-blue-600 hover:text-blue-900">
                                <i class="fa fa-eye"></i> View
                            </button>
                        </div>
                    </template>
                </Table>
            </div>

            <!-- Admitted Tab -->
            <div v-if="activeTabMain === 'admitted'">
                <Table title="Admitted Applicants" :headers="tableHeaders" :paginationData="admittedApplicants"
                    :loading="loading" @page-change="changeAdmittedPage" @search="handleAdmittedSearch">
                    <template #td-actions="{ row }">
                        <div class="flex gap-2">
                            <button @click="viewApplicant(row)" class="text-blue-600 hover:text-blue-900">
                                <i class="fa fa-eye"></i> View
                            </button>
                        </div>
                    </template>
                </Table>
            </div>

            <!-- Not Admitted Tab -->
            <div v-if="activeTabMain === 'rejected'">
                <Table title="Not Admitted Applicants" :headers="tableHeaders" :paginationData="rejectedApplicants"
                    :loading="loading" @page-change="changeRejectedAdmittedPage" @search="handleRejectedAdmittedSearch">
                    <template #td-actions="{ row }">
                        <div class="flex gap-2">
                            <button @click="viewApplicant(row)" class="text-blue-600 hover:text-blue-900">
                                <i class="fa fa-eye"></i> View
                            </button>
                        </div>
                    </template>
                </Table>
            </div>
        </div>

        <!-- Student Details Dialog -->
        <Dialog v-model:visible="showStudentDialog" modal header="Student Details"
            :style="{ width: '90vw', maxWidth: '1200px' }" :maximizable="true">
            <div v-if="selectedStudent" class="student-details-container">
                <!-- Student Header -->
                <div class="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg mb-6">
                    <div class="flex items-center space-x-6">
                        <div class="flex-shrink-0">
                            <img v-if="selectedStudent.picture" :src="selectedStudent.picture"
                                class="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                                :alt="selectedStudent.full_name" />
                            <div v-else
                                class="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                                <span class="text-2xl font-bold text-white">
                                    {{ getInitials(selectedStudent.first_name, selectedStudent.surname) }}
                                </span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h2 class="text-2xl font-bold mb-2">{{ selectedStudent.full_name }}</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <i class="fa fa-id-card mr-2"></i>
                                    <strong>Application No:</strong> {{ selectedStudent.application_number }}
                                </div>
                                <div>
                                    <i class="fa fa-envelope mr-2"></i>
                                    <strong>Email:</strong> {{ selectedStudent.email }}
                                </div>
                                <div>
                                    <i class="fa fa-phone mr-2"></i>
                                    <strong>Phone:</strong> {{ selectedStudent.phone_number }}
                                </div>
                                <div>
                                    <i class="fa fa-calendar mr-2"></i>
                                    <strong>Date of Birth:</strong> {{ formatDate(selectedStudent.date_of_birth) }}
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="mb-2">
                                <span :class="getAdmissionStatusColor(selectedStudent.admission_status)"
                                    class="px-3 py-1 rounded-full text-sm font-semibold">
                                    {{ formatStatus(selectedStudent.admission_status) }}
                                </span>
                            </div>
                            <div class="text-sm opacity-90">
                                Progress: {{ selectedStudent.application_progress || 0 }}%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div class="border-b border-gray-200 mb-6">
                    <nav class="-mb-px flex space-x-8">
                        <button v-for="tab in studentTabs" :key="tab.id" @click="activeTab = tab.id" :class="activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
                            <i :class="tab.icon" class="mr-2"></i>
                            {{ tab.label }}
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Personal Information Tab -->
                    <div v-if="activeTab === 'personal'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Basic Information</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>First Name:</strong> {{ selectedStudent.first_name }}</div>
                                    <div><strong>Middle Name:</strong> {{ selectedStudent.middle_name || 'N/A' }}</div>
                                    <div><strong>Surname:</strong> {{ selectedStudent.surname }}</div>
                                    <div><strong>Gender:</strong> {{ selectedStudent.gender || 'N/A' }}</div>
                                    <div><strong>Marital Status:</strong> {{ selectedStudent.marital_status || 'N/A' }}
                                    </div>
                                    <div><strong>Religion:</strong> {{ selectedStudent.religion || 'N/A' }}</div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Contact Information</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>Email:</strong> {{ selectedStudent.email }}</div>
                                    <div><strong>Phone:</strong> {{ selectedStudent.phone_number }}</div>
                                    <div><strong>Present Address:</strong> {{ selectedStudent.present_address || 'N/A'
                                        }}</div>
                                    <div><strong>Permanent Address:</strong> {{ selectedStudent.permanent_address ||
                                        'N/A' }}
                                    </div>
                                    <div><strong>State:</strong> {{ selectedStudent.state || 'N/A' }}</div>
                                    <div><strong>LGA:</strong> {{ selectedStudent.lga || 'N/A' }}</div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Health & Other Info</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>Blood Group:</strong> {{ selectedStudent.blood_group || 'N/A' }}</div>
                                    <div><strong>Health Status:</strong> {{ selectedStudent.health_status || 'N/A' }}
                                    </div>
                                    <div><strong>Disability:</strong> {{ selectedStudent.disability || 'None' }}</div>
                                    <div><strong>Years of Experience:</strong> {{ selectedStudent.years_of_experience ||
                                        'N/A'
                                        }}</div>
                                    <div><strong>Working Class:</strong> {{ selectedStudent.working_class || 'N/A' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Academic Information Tab -->
                    <div v-if="activeTab === 'academic'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Programme Information</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>Applied Programme:</strong> {{ selectedStudent.programme_name || 'N/A'
                                        }}</div>
                                    <div><strong>Admitted Programme:</strong> {{ selectedStudent.admitted_programme_name
                                        ||
                                        'N/A' }}</div>
                                    <div><strong>Programme Type:</strong> {{ selectedStudent.programme_type || 'N/A' }}
                                    </div>
                                    <div><strong>Entry Mode:</strong> {{ selectedStudent.entry_mode || 'N/A' }}</div>
                                    <div><strong>Faculty:</strong> {{ selectedStudent.faculty || 'N/A' }}</div>
                                    <div><strong>Department:</strong> {{ selectedStudent.department || 'N/A' }}</div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Academic Scores</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>JAMB Score:</strong>
                                        <span class="font-bold text-blue-600">{{ selectedStudent.jamb_score || 'N/A'
                                            }}</span>
                                    </div>
                                    <div><strong>JAMB Number:</strong> {{ selectedStudent.jamb_number || 'N/A' }}</div>
                                    <div><strong>Entrance Exam Score:</strong> {{ selectedStudent.entrance_exam_score ||
                                        'N/A'
                                        }}</div>
                                    <div><strong>Entrance Exam Status:</strong> {{ selectedStudent.entrance_exam_status
                                        || 'N/A'
                                        }}</div>
                                    <div><strong>Previous Institution:</strong> {{ selectedStudent.prev_institution ||
                                        'N/A' }}
                                    </div>
                                    <div><strong>Year of Graduation:</strong> {{ selectedStudent.prev_year_of_graduation
                                        ||
                                        'N/A' }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Qualification Status -->
                        <div class="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-800 mb-3">Qualification Status</h4>
                            <div v-if="selectedStudent.qualify" class="flex items-center space-x-4">
                                <div :class="selectedStudent.qualify.is_qualify ? 'text-green-600' : 'text-red-600'">
                                    <i :class="selectedStudent.qualify.is_qualify ? 'fa fa-check-circle' : 'fa fa-times-circle'"
                                        class="text-xl"></i>
                                </div>
                                <div>
                                    <div class="font-medium">
                                        {{ selectedStudent.qualify.is_qualify ? 'Qualified' : 'Not Qualified' }}
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        {{ selectedStudent.qualify.info }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Guardian Information Tab -->
                    <div v-if="activeTab === 'guardian'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Guardian Information</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>Full Name:</strong> {{ selectedStudent.guardian_full_name || 'N/A' }}
                                    </div>
                                    <div><strong>Phone Number:</strong> {{ selectedStudent.guardian_phone_number ||
                                        'N/A' }}
                                    </div>
                                    <div><strong>Email:</strong> {{ selectedStudent.guardian_email || 'N/A' }}</div>
                                    <div><strong>Address:</strong> {{ selectedStudent.guardian_address || 'N/A' }}</div>
                                    <div><strong>Relationship:</strong> {{ selectedStudent.guardian_relationship ||
                                        'N/A' }}
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Next of Kin</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>Full Name:</strong> {{ selectedStudent.next_of_kin_full_name || 'N/A'
                                        }}</div>
                                    <div><strong>Phone Number:</strong> {{ selectedStudent.next_of_kin_phone_number ||
                                        'N/A' }}
                                    </div>
                                    <div><strong>Address:</strong> {{ selectedStudent.next_of_kin_address || 'N/A' }}
                                    </div>
                                    <div><strong>Relationship:</strong> {{ selectedStudent.next_of_kin_relationship ||
                                        'N/A' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sponsor Information -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-800 mb-3">Sponsor Information</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Sponsor Name:</strong> {{ selectedStudent.sponsor_full_name || 'N/A' }}
                                </div>
                                <div><strong>Sponsor Type:</strong> {{ selectedStudent.sponsor_type || 'N/A' }}</div>
                                <div><strong>Sponsor Address:</strong> {{ selectedStudent.sponsor_address || 'N/A' }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Information Tab -->
                    <div v-if="activeTab === 'payment'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Payment Status</h4>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span>Application Fee:</span>
                                        <span
                                            :class="selectedStudent.application_fee === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                                            {{ selectedStudent.application_fee || 'Unpaid' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Registration Fee:</span>
                                        <span
                                            :class="selectedStudent.registration_fee === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                                            {{ selectedStudent.registration_fee || 'Unpaid' }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Wallet Number:</span>
                                        <span>{{ selectedStudent.wallet_number || 'N/A' }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Application Status</h4>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span>Qualified Status:</span>
                                        <span :class="getStatusColor(selectedStudent.qualified_status)"
                                            class="px-2 py-1 rounded text-xs font-semibold">
                                            {{ formatStatus(selectedStudent.qualified_status) }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Admission Status:</span>
                                        <span :class="getStatusColor(selectedStudent.admission_status)"
                                            class="px-2 py-1 rounded text-xs font-semibold">
                                            {{ formatStatus(selectedStudent.admission_status) }}
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Final Submission:</span>
                                        <span
                                            :class="selectedStudent.final_submission === '1' ? 'text-green-600' : 'text-red-600'">
                                            {{ selectedStudent.final_submission === '1' ? 'Submitted' : 'Not Submitted'
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Information Tab -->
                    <div v-if="activeTab === 'system'" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">System Information</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>User ID:</strong> {{ selectedStudent.id }}</div>
                                    <div><strong>Session:</strong> {{ selectedStudent.session?.name || 'N/A' }}</div>
                                    <div><strong>Batch ID:</strong> {{ selectedStudent.batch_id || 'N/A' }}</div>
                                    <div><strong>Matric Number:</strong> {{ selectedStudent.matric_number || 'Not Assigned' }}
                                    </div>
                                    <div><strong>Admission Serial:</strong> {{ selectedStudent.admission_serial_number
                                        || 'N/A'
                                        }}</div>
                                    <div><strong>User Type:</strong> {{ selectedStudent.user_type || 'applicant' }}
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-gray-800 mb-3">Activity Information</h4>
                                <div class="space-y-2 text-sm">
                                    <div><strong>Created:</strong> {{ formatDate(selectedStudent.created_at) }}</div>
                                    <div><strong>Last Updated:</strong> {{ formatDate(selectedStudent.updated_at) }}
                                    </div>
                                    <div><strong>Last Login:</strong> {{ formatDate(selectedStudent.logged_in_time) }}
                                    </div>
                                    <div><strong>Login Count:</strong> {{ selectedStudent.logged_in_count || 0 }}</div>
                                    <div><strong>Submitted:</strong> {{ selectedStudent.submitted_date_ago || 'N/A' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dialog Actions -->
                <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <div class="flex flex-wrap gap-3">
                        <Button v-if="selectedStudent.admission_status !== 'admitted'"
                            @click="showAdmissionDialog = true" class="bg-green-500 hover:bg-green-600 text-white">
                            <i class="fa fa-check mr-2"></i>
                            Admit Student
                        </Button>
                        <Button v-if="selectedStudent.admission_status !== 'not admitted'"
                            @click="rejectStudentFromDialog" class="bg-red-500 hover:bg-red-600 text-white">
                            <i class="fa fa-times mr-2"></i>
                            Reject Student
                        </Button>
                        <Button v-if="selectedStudent.admission_status === 'admitted'"
                            @click="showActivationDialog = true" class="bg-purple-500 hover:bg-purple-600 text-white">
                            <i class="fa fa-user-check mr-2"></i>
                            Activate Student
                        </Button>
                    </div>
                    <Button @click="showStudentDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        <i class="fa fa-times mr-2"></i>
                        Close
                    </Button>
                </div>
            </div>
        </Dialog>

        <!-- Admission Dialog -->
        <Dialog v-model:visible="showAdmissionDialog" modal header="Admit Student" :style="{ width: '600px' }">
            <div v-if="selectedStudent" class="space-y-6">
                <!-- Student Info Header -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Student Information</h4>
                    <div class="text-sm text-blue-700">
                        <div><strong>Name:</strong> {{ selectedStudent.full_name }}</div>
                        <div><strong>Application No:</strong> {{ selectedStudent.application_number }}</div>
                        <div><strong>Current Applied Programme:</strong> {{ selectedStudent.programme_name }}</div>
                        <div><strong>Current Applied Level:</strong> {{ selectedStudent.level_name }}</div>
                    </div>
                </div>

                <!-- Programme Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-graduation-cap mr-2"></i>
                        Select Programme to Admit To
                    </label>
                    <PSelect v-model="admissionForm.programme_id" :options="programmes" option-value="id"
                        option-label="name" placeholder="Choose programme for admission" class="w-full" fluid />
                    <small class="text-gray-500 mt-1">Leave empty to use their applied programme</small>
                </div>

                <!-- Level Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-layer-group mr-2"></i>
                        Select Level to Admit To
                    </label>
                    <PSelect v-model="admissionForm.level_id" :options="levels" option-value="id" option-label="title"
                        placeholder="Choose level for admission" class="w-full" fluid />
                    <small class="text-gray-500 mt-1">Leave empty to use their applied level</small>
                </div>

                <!-- Admission Batch -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-users mr-2"></i>
                        Admission Batch (Optional)
                    </label>
                    <PSelect v-model="admissionForm.batch_id" :options="admissionBatches" option-value="id"
                        option-label="name" placeholder="Select admission batch" class="w-full" fluid />
                </div>

                <!-- Notes -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-sticky-note mr-2"></i>
                        Admission Notes (Optional)
                    </label>
                    <textarea v-model="admissionForm.notes"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3" placeholder="Add any notes about this admission..."></textarea>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="showAdmissionDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        Cancel
                    </Button>
                    <Button @click="processAdmission" :loading="isProcessing"
                        class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-check mr-2"></i>
                        Continue & Admit
                    </Button>
                </div>
            </div>
        </Dialog>

        <!-- Qualification Status Dialog -->
     
        <!-- Bulk Admission Dialog -->
        <Dialog v-model:visible="showBulkAdmissionDialog" modal header="Bulk Admit Students"
            :style="{ width: '600px' }">
            <div class="space-y-6">
                <!-- Selected Students Info -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Selected Students</h4>
                    <div class="text-sm text-blue-700">
                        <div><strong>Count:</strong> {{ selectedApplicants.length }} student(s) selected</div>
                        <div class="mt-2 max-h-32 overflow-y-auto">
                            <div v-for="student in selectedApplicants.slice(0, 5)" :key="student.id" class="text-xs">
                                • {{ student.full_name }} ({{ student.application_number }})
                            </div>
                            <div v-if="selectedApplicants.length > 5" class="text-xs text-blue-600 mt-1">
                                ... and {{ selectedApplicants.length - 5 }} more
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Programme Selection for all -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-graduation-cap mr-2"></i>
                        Programme for All Selected Students
                    </label>
                    <PSelect v-model="bulkAdmissionForm.programme_id" :options="programmes" :selectFilterable="true"
                        option-value="id" option-label="name" placeholder="Choose programme for all students"
                        class="w-full" fluid />
                    <small class="text-gray-500 mt-1">Leave empty to use each student's applied programme</small>
                </div>

                <!-- Level Selection for all -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-layer-group mr-2"></i>
                        Level for All Selected Students
                    </label>
                    <PSelect v-model="bulkAdmissionForm.level_id" :selectFilterable="true" :options="levels"
                        option-value="id" option-label="title" placeholder="Choose level for all students"
                        class="w-full" fluid />
                    <small class="text-gray-500 mt-1">Leave empty to use each student's applied level</small>
                </div>

                <!-- Bulk Notes -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fa fa-sticky-note mr-2"></i>
                        Bulk Admission Notes (Optional)
                    </label>
                    <textarea v-model="bulkAdmissionForm.notes"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3" placeholder="Add any notes about this bulk admission..."></textarea>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="showBulkAdmissionDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        Cancel
                    </Button>
                    <Button @click="executeBulkAdmitWithOptions" :loading="isProcessing"
                        class="bg-green-500 hover:bg-green-600 text-white">
                        <i class="fa fa-check mr-2"></i>
                        Continue & Admit {{ selectedApplicants.length }} Student(s)
                    </Button>
                </div>
            </div>
        </Dialog>

        <!-- Student Activation Dialog -->
        <Dialog v-model:visible="showActivationDialog" modal header="Activate Student" :style="{ width: '500px' }">
            <div v-if="selectedStudent" class="space-y-6">
                <!-- Student Info Header -->
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Student Information</h4>
                    <div class="text-sm text-green-700">
                        <div><strong>Name:</strong> {{ selectedStudent.full_name }}</div>
                        <div><strong>Programme:</strong> {{ selectedStudent.admitted_programme_name ||
                            selectedStudent.programme_name }}</div>
                        <div><strong>Status:</strong> Admitted</div>
                    </div>
                </div>

                <!-- Activation Form -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fa fa-id-card mr-2"></i>
                            Matric Number (Optional)
                        </label>
                        <PInput v-model="activationForm.matric_number" placeholder="Enter matric number" class="w-full"
                            fluid />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fa fa-calendar mr-2"></i>
                            Academic Session
                        </label>
                        <PSelect v-model="activationForm.session_id" :options="sessions" option-value="id"
                            option-label="name" placeholder="Select academic session" class="w-full" fluid />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fa fa-comment mr-2"></i>
                            Activation Notes
                        </label>
                        <textarea v-model="activationForm.notes"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows="3" placeholder="Add activation notes..."></textarea>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <Button @click="showActivationDialog = false" class="bg-gray-500 hover:bg-gray-600 text-white">
                        Cancel
                    </Button>
                    <Button @click="activateStudent" :loading="isProcessing"
                        class="bg-purple-500 hover:bg-purple-600 text-white">
                        <i class="fa fa-user-check mr-2"></i>
                        Activate Student
                    </Button>
                </div>
            </div>
        </Dialog>

        <!-- PrimeVue Confirmation Dialog -->
        <Dialog v-model:visible="showConfirmDialog" modal :header="dialogTitle" :style="{ width: '25rem' }">
            <div class="flex align-items-center gap-3 mb-5">
                <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: var(--yellow-500)" />
                <span>{{ dialogMessage }}</span>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="showConfirmDialog = false"></Button>
                <Button type="button" label="Confirm" severity="danger" @click="executeDialogAction"
                    :loading="isProcessing"></Button>
            </div>
        </Dialog>

        <!-- Bulk Actions -->
        <div v-if="selectedApplicants.length > 0"
            class="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-gray-700">{{ selectedApplicants.length }} selected</span>
                <button @click="bulkAdmitApplicants"
                    class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <i class="fa fa-check mr-2"></i>Admit Selected
                </button>
                <button @click="bulkReject"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                    <i class="fa fa-times mr-2"></i>Reject Selected
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from "@/api/client";
import { userDataMixin } from "@/mixins/userDataMixin";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import PSelect from "@/components/PSelect.vue";
import Table from "@/components/Table.vue";
export default {
    mixins: [userDataMixin],
    components: {
        Dialog,
        Button,
        PSelect,
        Table
    },
    data() {
        return {
            loading: false,

            activeTabMain: 'not admitted',
            tabs: [
                { id: 'not admitted', label: 'Pending Admission' },
                { id: 'admitted', label: 'Admitted' },
                { id: 'rejected', label: 'Rejected Admissions' }
            ],
            tableHeaders: [
                { key: 'sn', title: 'SN' },
                { key: 'first_name', title: 'Applicant', bold: true },
                { key: 'application_number', title: 'Application No' },
                { key: 'programme.name', title: 'Programme' },
                { key: 'jamb_score', title: 'JAMB Score' },
                { key: 'merit_score', title: 'Merit Score' },
                { key: 'admission_status', title: 'Status' },
                { key: 'actions', title: 'Actions' }
            ],
            filters: {
                programme_id: "",
                jamb_range: "",
                sort_by: "jamb_score_desc",
            },
            admissionStats: {
                qualified: 0,
                admitted: 0,
                pending: 0,
                notAdmitted: 0,
            },
            notAdmittedApplicants: { data: [], meta: {} },
            admittedApplicants: { data: [], meta: {} },
            rejectedApplicants: { data: [], meta: {} },
            searchQuery: "",
            currentPage: 1,
            itemsPerPage: 25,
            allSelected: false,
            selectedApplicants: [],
            filters: {
                programme_id: "",
                jamb_range: "",
                admission_status: "",
                sort_by: "jamb_score_desc",
            },
            applicants: [],
            filteredApplicants: [],
            admissionStats: {
                qualified: 0,
                admitted: 0,
                pending: 0,
                notAdmitted: 0,
            },
            showConfirmDialog: false,
            dialogTitle: "",
            dialogMessage: "",
            dialogAction: null,
            dialogActionParams: null,
            isProcessing: false,
            // Student Details Dialog
            showStudentDialog: false,
            selectedStudent: null,
            activeTab: 'personal',
            studentTabs: [
                { id: 'personal', label: 'Personal Info', icon: 'fa fa-user' },
                { id: 'academic', label: 'Academic Info', icon: 'fa fa-graduation-cap' },
                { id: 'guardian', label: 'Guardian Info', icon: 'fa fa-users' },
                { id: 'payment', label: 'Payment Info', icon: 'fa fa-credit-card' },
                { id: 'system', label: 'System Info', icon: 'fa fa-cog' }
            ],
            // Admission Management Dialogs
            showAdmissionDialog: false,
            showActivationDialog: false,
            showBulkAdmissionDialog: false,
            // Form Data
            admissionForm: {
                programme_id: '',
                level_id: '',
                batch_id: '',
                notes: ''
            },
            bulkAdmissionForm: {
                programme_id: '',
                level_id: '',
                notes: ''
            },
            qualificationForm: {
                qualified_status: '',
                notes: ''
            },
            activationForm: {
                matric_number: '',
                session_id: '',
                notes: ''
            },
            // Options Data
            levels: [],
            sessions: [],
            admissionBatches: [],
            qualificationStatuses: [
                { value: 'qualified', label: 'Qualified' },
                { value: 'not_qualified', label: 'Not Qualified' },
                { value: 'pending', label: 'Pending Review' },
                { value: 'under_review', label: 'Under Review' }
            ],
            programmes: [],
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredApplicants.length / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage + 1;
        },
        endIndex() {
            return Math.min(
                this.currentPage * this.itemsPerPage,
                this.filteredApplicants.length
            );
        },
        paginatedApplicants() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredApplicants.slice(start, end);
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(this.totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
        allOnPageSelected() {
            if (this.paginatedApplicants.length === 0) return false;
            return this.paginatedApplicants.every(applicant =>
                this.selectedApplicants.includes(applicant.id)
            );
        }
    },
    methods: {
        changeTab(tab){
            this.activeTabMain = tab.id
            if(this.activeTabMain == 'admitted'){
                this.getAddmittedApplicants()
            }else if(this.activeTabMain == 'not admitted'){
                this.getNotAdmittedApplicants()
            }else if( this.activeTabMain == 'rejected'){
                this.getRejectedApplicants()
            }
        },
        getTabCount(tabId) {
            switch (tabId) {
                case 'pending': return this.admissionStats.pending || 0;
                case 'admitted': return this.admissionStats.admitted || 0;
                case 'not admitted': return this.admissionStats.notAdmitted || 0;
                default: return 0;
            }
        },
        async getNotAdmittedApplicants() {
            this.loading = true;
            const pendingResponse = await post(this.$endpoints.staff.getAdmissionApplicants.url, {
                filters:{
                    ...this.filters,
                    admission_status: 'not admitted',
                    qualified_status: 'qualified',
                },
                paginateBy: 10
            });
            console.log(pendingResponse,233);
            this.notAdmittedApplicants = pendingResponse.data || { data: [], meta: {} };
            this.loading = false;
        },
        async getAddmittedApplicants(){
            // Load admitted applicants
            this.loading = true;
                const admittedResponse = await post(this.$endpoints.staff.getAdmissionApplicants.url, {
                    filters:{
                        ...this.filters,
                        admission_status: 'admitted',
                        qualified_status: 'qualified',
                    },
                    paginateBy: 10
                });
                this.admittedApplicants = admittedResponse.data || { data: [], meta: {} };
        this.loading =false;
        },
        async getRejectedApplicants() {
            this.loading = true;
            const rejectedApplicants = await post(this.$endpoints.staff.getAdmissionApplicants.url, {
                filters:{
                    ...this.filters,
                    admission_status: 'rejected',
                    qualified_status: 'qualified',
                },
                paginateBy: 10
            });
            this.rejectedApplicants = rejectedApplicants.data || { data: [], meta: {} };


            this.loading = false;
           
        },

        async loadAdmissionStats() {
            try {
                const response = await get(this.$endpoints.staff.getApplicantStats.url);
                if (response) {
                    this.admissionStats = {
                        qualified: response.qualified || 0,
                        admitted: response.admitted || 0,
                        pending: response.pending || 0,
                        notAdmitted: response.not_admitted || 0,
                    };
                }
            } catch (error) {
                console.error("Error loading admission stats:", error);
            }
        },
        changeNotAdmittedPage(page) {
            this.filters.page = page;
            this.getNotAdmittedApplicants();
        },

        changeAdmittedPage(page) {
            this.filters.page = page;
            this.getAddmittedApplicants();
        },

        changeRejectedAdmittedPage(page) {
            this.filters.page = page;
            this.getRejectedApplicants();
        },

        // Search handlers
        handleNotAdmittedSearch(query) {
            this.filters.search = query;
            this.getNotAdmittedApplicants()
        },
        handleAdmittedSearch(query) {
            this.filters.search = query;
            this.getAddmittedApplicants()
        },

        handleRejectedAdmittedSearch(query) {
            this.filters.search = query;
            this.getRejectedApplicants()
        },

        // Bulk actions
        handleBulkAction({ action, ids }) {
            if (action === 'approve') {
                this.bulkAdmitApplicants(ids);
            } else if (action === 'reject') {
                this.bulkRejectApplicants(ids);
            }
        },

        async bulkAdmitApplicants(applicantIds) {
            try {
                const response = await post(
                    this.$endpoints.staff.admitApplicants.url,
                    {
                        applicant_ids: applicantIds,
                        session_id: this.filters.session_id,
                        status: "admitted",
                    }
                );

                if (response && !response.error) {
                    this.getNotAdmittedApplicants()
                    this.$globals.showMessage(`${applicantIds.length} applicants have been admitted`,'success')
                }
            } catch (error) {
                console.error("Error bulk admitting applicants:", error);
            }
        },

        async bulkRejectApplicants(applicantIds) {
            try {
                const response = await post(
                    this.$endpoints.staff.rejectApplicants.url,
                    {
                        applicant_ids: applicantIds,
                        session_id: this.filters.session_id,
                        status: "rejected",
                    }
                );

                if (response) {
                    this.getNotAdmittedApplicants()
                    this.getAddmittedApplicants()
                    this.$globals.showMessage(`${applicantIds.length} applicants have been rejected`,'success')
                }
            } catch (error) {
                console.error("Error bulk rejecting applicants:", error);
            }
        },
        showConfirmation(title, message, action, params = null) {
            this.dialogTitle = title;
            this.dialogMessage = message;
            this.dialogAction = action;
            this.dialogActionParams = params;
            this.showConfirmDialog = true;
        },

        async executeDialogAction() {
            if (!this.dialogAction) {
                this.showConfirmDialog = false;
                return;
            }

            this.isProcessing = true;
            try {
                if (this.dialogActionParams) {
                    await this[this.dialogAction](this.dialogActionParams);
                } else {
                    await this[this.dialogAction]();
                }
            } catch (error) {
                console.error("Error executing action:", error);
            } finally {
                this.isProcessing = false;
                this.showConfirmDialog = false;
            }
        },

        // Update your existing methods to use the dialog:
        async rejectApplicant(applicant) {
            this.showConfirmation(
                "Confirm Rejection",
                `Are you sure you want to reject ${applicant.first_name} ${applicant.last_name}?`,
                "performRejectApplicant",
                applicant
            );
        },

        async performRejectApplicant(applicant) {
            try {
                const response = await post(
                    this.$endpoints.staff.rejectApplicants.url,
                    {
                        applicant_ids: [applicant.id],
                        session_id:this.filters.session_id,
                        status: "rejected",
                    }
                );
                    this.getNotAdmittedApplicants()
                if (response && !response.error) {
                    this.$globals.showMessage( `${applicant.first_name} ${applicant.last_name} has been rejected`,"success");
                    setTimeout(() => {
                        this.$globals.message.text = "";
                    }, 3000);
                }
            } catch (error) {
                console.error("Error rejecting applicant:", error);
                throw error; // Re-throw to handle in executeDialogAction
            }
        },

        async bulkAdmit() {
            this.showConfirmation(
                "Confirm Bulk Admission",
                `Are you sure you want to admit ${this.selectedApplicants.length} applicants?`,
                "performBulkAdmit"
            );
        },

        async performBulkAdmit() {
            try {
                const response = await post(
                    this.$endpoints.staff.admitApplicants.url,
                    {
                        applicant_ids: this.selectedApplicants,
                        session_id: this.filters.session_id,
                        status: "admitted",
                    }
                );

                if (response && !response.error) {
                    this.selectedApplicants.forEach((id) => {
                        const applicant = this.applicants.find((a) => a.id === id);
                        if (applicant) {
                            applicant.admission_status = "admitted";
                        }
                    });

                    this.selectedApplicants = [];
                    this.allSelected = false;
                    await this.loadAdmissionStats();

                    this.$globals.message = {
                        text: `${this.selectedApplicants.length} applicants have been admitted`,
                        type: "success",
                    };
                    setTimeout(() => {
                        this.$globals.message.text = "";
                    }, 3000);
                }
            } catch (error) {
                console.error("Error bulk admitting applicants:", error);
                throw error;
            }
        },

        async bulkReject() {
            this.showConfirmation(
                "Confirm Bulk Rejection",
                `Are you sure you want to reject ${this.selectedApplicants.length} applicants?`,
                "performBulkReject"
            );
        },

        async performBulkReject() {
            try {
                const response = await post(
                    this.$endpoints.staff.rejectApplicants.url,
                    {
                        applicant_ids: this.selectedApplicants,
                        session_id: this.filters.session_id,
                        status: "not admitted",
                    }
                );

                if (response && !response.error) {
                    this.getNotAdmittedApplicants()
                    this.getAddmittedApplicants()
                    await this.loadAdmissionStats();

                    this.$globals.message = {
                        text: `${this.selectedApplicants.length} applicants have been rejected`,
                        type: "success",
                    };
                    setTimeout(() => {
                        this.$globals.message.text = "";
                    }, 3000);
                }
            } catch (error) {
                console.error("Error bulk rejecting applicants:", error);
                throw error;
            }
        },

        processAllQualified() {
            this.showConfirmation(
                "Process All Qualified",
                "Are you sure you want to process all qualified applicants for admission?",
                "performProcessAllQualified"
            );
        },

        async performProcessAllQualified() {
            console.log("Process all qualified applicants");
            // Implement your automatic admission processing logic here
        },
    
        async loadProgrammes() {
            try {
                const response = await get(this.$endpoints.staff.getAllPrograms.url);
                if (response && response.data) {
                    this.programmes = response.data;
                }
            } catch (error) {
                console.error("Error loading programmes:", error);
            }
        },
        async loadApplicants() {
            if(this.activeTabMain == 'not admitted'){
                this.getNotAdmittedApplicants()
            }else if(this.activeTabMain == 'admitted'){
                this.getAddmittedApplicants()
            }else if(this.activeTabMain == 'rejected'){
                this.getRejectedApplicants()
            }
        },
        async loadAdmissionStats() {
            try {
                const response = await get(this.$endpoints.staff.getApplicantStats.url);
                if (response) {
                    console.log(response, 2332);
                    this.admissionStats = {
                        qualified: response.qualified || 0,
                        admitted: response.admitted || 0,
                        pending: response.pending || 0,
                        notAdmitted: response.not_admitted || 0,
                    };
                } else {
                    // Mock stats
                    this.admissionStats = {
                        qualified: 850,
                        admitted: 420,
                        pending: 380,
                        notAdmitted: 50,
                    };
                }
            } catch (error) {
                console.error("Error loading admission stats:", error);
            }
        },
        filterApplicants() {
            let filtered = this.applicants;

            // Apply search filter
            if (this.searchQuery) {
                filtered = filtered.filter(
                    (applicant) =>
                        applicant.first_name
                            .toLowerCase()
                            .includes(this.searchQuery.toLowerCase()) ||
                        applicant.last_name
                            .toLowerCase()
                            .includes(this.searchQuery.toLowerCase()) ||
                        applicant.application_number
                            .toLowerCase()
                            .includes(this.searchQuery.toLowerCase())
                );
            }

            this.filteredApplicants = filtered;
            this.currentPage = 1;
        },
        getInitials(firstName, lastName) {
            const first = firstName ? firstName.charAt(0).toUpperCase() : "";
            const last = lastName ? lastName.charAt(0).toUpperCase() : "";
            return first + last || "N/A";
        },
        getAdmissionStatusColor(status) {
            const colors = {
                pending: "bg-yellow-100 text-yellow-800",
                admitted: "bg-green-100 text-green-800",
                not_admitted: "bg-red-100 text-red-800",
            };
            return colors[status] || "bg-gray-100 text-gray-800";
        },
        formatStatus(status) {
            if (!status) return "Pending";
            return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        },
        selectAll() {
            this.allSelected = !this.allSelected;
            this.toggleSelectAll();
        },
        toggleApplicantSelection(applicant) {
            const index = this.selectedApplicants.indexOf(applicant.id);
            if (index === -1) {
                // Add to selection
                this.selectedApplicants = [...this.selectedApplicants, applicant.id];
            } else {
                // Remove from selection
                this.selectedApplicants = this.selectedApplicants.filter(id => id !== applicant.id);
            }

            // Update the "allSelected" state based on current page selection
            this.allSelected = this.paginatedApplicants.every(applicant =>
                this.selectedApplicants.includes(applicant.id)
            );
        },
        toggleSelectAll() {
            if (this.allSelected) {
                // Select all visible applicants in the current page
                this.selectedApplicants = [
                    ...new Set([
                        ...this.selectedApplicants,
                        ...this.paginatedApplicants.map(applicant => applicant.id)
                    ])
                ];
            } else {
                // Deselect all by filtering out the current page's applicants
                const currentPageIds = this.paginatedApplicants.map(applicant => applicant.id);
                this.selectedApplicants = this.selectedApplicants.filter(
                    id => !currentPageIds.includes(id)
                );
            }
        },
        async admitApplicant(applicant) {
            // Show admission dialog for individual admit
            this.selectedStudent = applicant;
            this.showAdmissionDialog = true;
        },

        async viewApplicant(applicant) {
            try {
                // If we have detailed data, use it directly
                if (applicant.programme && applicant.session) {
                    this.selectedStudent = applicant;
                    this.showStudentDialog = true;
                    this.activeTab = 'personal';
                    return;
                }

                // Otherwise, fetch detailed student data
                this.loading = true;
                const response = await post(this.$endpoints.staff.getApplicants.url, {
                    applicant_id: applicant.id,
                    detailed: true
                });

                if (response && response.data) {
                    this.selectedStudent = response.data;
                    this.showStudentDialog = true;
                    this.activeTab = 'personal';
                } else {
                    // Use the existing applicant data as fallback
                    this.selectedStudent = applicant;
                    this.showStudentDialog = true;
                    this.activeTab = 'personal';
                }
            } catch (error) {
                console.error("Error loading student details:", error);
                // Use the existing applicant data as fallback
                this.selectedStudent = applicant;
                this.showStudentDialog = true;
                this.activeTab = 'personal';
            } finally {
                this.loading = false;
            }
        },

        admitStudentFromDialog() {
            if (this.selectedStudent) {
                this.showStudentDialog = false;
                this.admitApplicant(this.selectedStudent);
            }
        },

        rejectStudentFromDialog() {
            if (this.selectedStudent) {
                this.showStudentDialog = false;
                this.rejectApplicant(this.selectedStudent);
            }
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                return dateString;
            }
        },

        getStatusColor(status) {
            const colors = {
                'qualified': 'bg-blue-100 text-blue-800',
                'admitted': 'bg-green-100 text-green-800',
                'not admitted': 'bg-red-100 text-red-800',
                'pending': 'bg-yellow-100 text-yellow-800'
            };
            return colors[status] || 'bg-gray-100 text-gray-800';
        },

        getAdmissionStatusColor(status) {
            const colors = {
                'admitted': 'bg-green-500 text-white',
                'not admitted': 'bg-red-500 text-white',
                'pending': 'bg-yellow-500 text-black'
            };
            return colors[status] || 'bg-gray-500 text-white';
        },

        formatStatus(status) {
            if (!status) return 'N/A';
            return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        },
        async processAdmission() {
            if (!this.selectedStudent) return;

            try {
                this.isProcessing = true;

                // Determine if we're changing programme or level
                const changeProgramme = this.admissionForm.programme_id && this.admissionForm.programme_id !== this.selectedStudent.programme_id;
                const changeLevel = this.admissionForm.level_id && this.admissionForm.level_id !== this.selectedStudent.level_id;

                // Prepare admission options according to backend expectations
                const admissionOptions = {
                    change_programme: changeProgramme,
                    change_level: changeLevel,
                    just_admit: !changeProgramme && !changeLevel,
                    new_programme_id: changeProgramme ? this.admissionForm.programme_id : null,
                    new_level_id: changeLevel ? this.admissionForm.level_id : null
                };

                const payload = {
                    applicant_ids: [this.selectedStudent.id], // Must be an array
                    session_id: this.currentSessionId, // Required by backend
                    admission_options: admissionOptions,
                    programme_id: this.admissionForm.programme_id || null,
                    level_id: this.admissionForm.level_id || null,
                    batch_id: this.admissionForm.batch_id || null,
                    notes: this.admissionForm.notes || ''
                };

                const response = await post(this.$endpoints.staff.admitApplicants.url, payload);

                if (response && !response.error) {
                    let successMessage = `${this.selectedStudent.full_name} has been successfully admitted!`;

                    if (changeProgramme && changeLevel) {
                        const newProgramme = this.programmes.find(p => p.id === this.admissionForm.programme_id);
                        const newLevel = this.levels.find(l => l.id === this.admissionForm.level_id);
                        successMessage += ` Programme changed to ${newProgramme?.name || 'selected programme'} and level changed to ${newLevel?.title || 'selected level'}.`;
                    } else if (changeProgramme) {
                        const newProgramme = this.programmes.find(p => p.id === this.admissionForm.programme_id);
                        successMessage += ` Programme changed to ${newProgramme?.name || 'selected programme'}.`;
                    } else if (changeLevel) {
                        const newLevel = this.levels.find(l => l.id === this.admissionForm.level_id);
                        successMessage += ` Level changed to ${newLevel?.title || 'selected level'}.`;
                    } else {
                        successMessage += ' Admitted with applied programme and level.';
                    }

                    this.$globals.message = {
                        text: successMessage,
                        type: 'success'
                    };

                    // Update local data
                    this.selectedStudent.admission_status = 'admitted';
                    if (changeProgramme) {
                        this.selectedStudent.programme_id = this.admissionForm.programme_id;
                        this.selectedStudent.programme_name = this.programmes.find(p => p.id === this.admissionForm.programme_id)?.name;
                    }
                    if (changeLevel) {
                        this.selectedStudent.level_id = this.admissionForm.level_id;
                        this.selectedStudent.level_name = this.levels.find(l => l.id === this.admissionForm.level_id)?.title;
                    }

                    // Update the applicant in the list
                    const applicantIndex = this.applicants.findIndex(app => app.id === this.selectedStudent.id);
                    if (applicantIndex !== -1) {
                        this.applicants[applicantIndex] = { ...this.applicants[applicantIndex], ...this.selectedStudent };
                    }

                    this.showAdmissionDialog = false;
                    this.resetAdmissionForm();
                    // this.getNotAdmittedApplicants()
                    // this.getAddmittedApplicants()
                    // this.$globals.showMessage(`${applicantIds.length} applicants have been rejected`,'success')
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to admit student. Please try again.',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Admission error:', error);
                this.$globals.message = {
                    text: 'An error occurred while processing admission. Please try again.',
                    type: 'error'
                };
            } finally {
                this.isProcessing = false;
            }
        },
   
        async activateStudent() {
            if (!this.selectedStudent) return;

            try {
                this.isProcessing = true;

                const response = await post(this.$endpoints.staff.activateStudent.url, {
                    applicant_id: this.selectedStudent.id,
                    matric_number: this.activationForm.matric_number,
                    session_id: this.activationForm.session_id,
                    notes: this.activationForm.notes
                });

                if (response && !response.error) {
                    this.$globals.message = {
                        text: `${this.selectedStudent.full_name} has been successfully activated as a student!`,
                        type: 'success'
                    };

                    // Update the student's status in the local data
                    this.selectedStudent.active_state = 'Active';
                    if (this.activationForm.matric_number) {
                        this.selectedStudent.matric_number = this.activationForm.matric_number;
                    }

                    this.showActivationDialog = false;
                    this.resetActivationForm();
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to activate student. Please try again.',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Student activation error:', error);
                this.$globals.message = {
                    text: 'An error occurred while activating student. Please try again.',
                    type: 'error'
                };
            } finally {
                this.isProcessing = false;
            }
        },

        // Form Reset Methods
        resetAdmissionForm() {
            this.admissionForm = {
                programme_id: '',
                level_id: '',
                batch_id: '',
                notes: ''
            };
        },

        resetQualificationForm() {
            this.qualificationForm = {
                qualified_status: '',
                notes: ''
            };
        },

        resetActivationForm() {
            this.activationForm = {
                matric_number: '',
                session_id: '',
                notes: ''
            };
        },

        resetBulkAdmissionForm() {
            this.bulkAdmissionForm = {
                programme_id: '',
                level_id: '',
                notes: ''
            };
        },

        // Data Loading Methods
        async loadLevels() {
            try {
                const response = await get(this.$endpoints.staff.getAllLevels.url);
                if (response && response.data) {
                    this.levels = response.data;
                }
            } catch (error) {
                console.error('Error loading levels:', error);
            }
        },

        async loadSessions() {
            try {
                const response = await get(this.$endpoints.staff.getAllSessions.url);
                if (response && response.data) {
                    this.sessions = response.data;
                }
            } catch (error) {
                console.error('Error loading sessions:', error);
            }
        },

        async loadAdmissionBatches() {
            try {
                const response = await post(this.$endpoints.staff.getAdmissionBatches.url, {
                    session_id: this.currentSessionId
                });
                if (response && response.data) {
                    this.admissionBatches = response.data;
                }
            } catch (error) {
                console.error('Error loading admission batches:', error);
            }
        },

        // Enhanced Bulk Operations
        async bulkAdmitApplicants() {
            if (this.selectedApplicants.length === 0) {
                this.$globals.message = {
                    text: 'Please select applicants to admit',
                    type: 'error'
                };
                return;
            }

            // Show the bulk admission dialog with options
            this.showBulkAdmissionDialog = true;
        },

        async executeBulkAdmit() {
            try {
                this.isProcessing = true;

                // Default to just admit (keep current programme and level)
                const admissionOptions = {
                    change_programme: false,
                    change_level: false,
                    just_admit: true,
                    new_programme_id: null,
                    new_level_id: null
                };

                const response = await post(this.$endpoints.staff.admitApplicants.url, {
                    applicant_ids: this.selectedApplicants.map(app => app.id),
                    programme_id: null, // Use their applied programme
                    level_id: null, // Use default level
                    session_id: this.currentSessionId,
                    admission_options: admissionOptions
                });

                if (response && !response.error) {
                    this.$globals.showMessage(`Successfully admitted ${this.selectedApplicants.length} applicant(s) with their applied programmes and levels!`,'success')
                    this.getNotAdmittedApplicants()
                    this.getAddmittedApplicants()

                    this.selectedApplicants = [];
                    this.allSelected = false;
                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to admit applicants. Please try again.',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Bulk admission error:', error);
                this.$globals.message = {
                    text: 'An error occurred during bulk admission. Please try again.',
                    type: 'error'
                };
            } finally {
                this.isProcessing = false;
            }
        },
        async executeBulkAdmitWithOptions() {
            try {
                this.isProcessing = true;

                // Get the actual IDs from selectedApplicants
                const applicantIds = this.selectedApplicants.map(app => app.id || app);

                // Determine if we're changing programme or level for all students
                const changeProgramme = !!this.bulkAdmissionForm.programme_id;
                const changeLevel = !!this.bulkAdmissionForm.level_id;

                // Prepare admission options according to backend expectations
                const admissionOptions = {
                    change_programme: changeProgramme,
                    change_level: changeLevel,
                    just_admit: !changeProgramme && !changeLevel,
                    new_programme_id: changeProgramme ? this.bulkAdmissionForm.programme_id : null,
                    new_level_id: changeLevel ? this.bulkAdmissionForm.level_id : null
                };

                const payload = {
                    applicant_ids: applicantIds, // Must be an array
                    session_id: this.currentSessionId, // Required by backend
                    admission_options: admissionOptions,
                    programme_id: this.bulkAdmissionForm.programme_id || null,
                    level_id: this.bulkAdmissionForm.level_id || null,
                    notes: this.bulkAdmissionForm.notes || ''
                };

                const response = await post(this.$endpoints.staff.admitApplicants.url, payload);

                if (response && !response.error) {
                    let successMessage = `Successfully admitted ${applicantIds.length} applicant(s)!`;

                    if (changeProgramme && changeLevel) {
                        const newProgramme = this.programmes.find(p => p.id === this.bulkAdmissionForm.programme_id);
                        const newLevel = this.levels.find(l => l.id === this.bulkAdmissionForm.level_id);
                        successMessage += ` All students moved to ${newProgramme?.name || 'selected programme'} at ${newLevel?.title || 'selected level'}.`;
                    } else if (changeProgramme) {
                        const newProgramme = this.programmes.find(p => p.id === this.bulkAdmissionForm.programme_id);
                        successMessage += ` All students moved to ${newProgramme?.name || 'selected programme'}.`;
                    } else if (changeLevel) {
                        const newLevel = this.levels.find(l => l.id === this.bulkAdmissionForm.level_id);
                        successMessage += ` All students moved to ${newLevel?.title || 'selected level'}.`;
                    } else {
                        successMessage += ' All students admitted with their applied programmes and levels.';
                    }

                    this.$globals.message = {
                        text: successMessage,
                        type: 'success'
                    };
                    this.selectedApplicants = [];
                    this.allSelected = false;
                    this.showBulkAdmissionDialog = false;
                    this.resetBulkAdmissionForm();
                    this.getNotAdmittedApplicants()
                    this.getAddmittedApplicants()

                } else {
                    this.$globals.message = {
                        text: response?.message || 'Failed to admit applicants. Please try again.',
                        type: 'error'
                    };
                }
            } catch (error) {
                console.error('Bulk admission error:', error);
                this.$globals.message = {
                    text: 'An error occurred during bulk admission. Please try again.',
                    type: 'error'
                };
            } finally {
                this.isProcessing = false;
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        goToPage(page) {
            this.currentPage = page;
        },
    },
    async mounted() {
        this.sessions = this.schoolSessions
        this.levels = this.schoolLevels;
        this.programmes = this.schoolProgrammes
        this.filters.session_id = this.currentSessionId
        await this.getNotAdmittedApplicants();
        this.loadAdmissionStats()
    },
};
</script>

<style scoped>
/* Student Details Dialog Styling */
.student-details-container {
    max-height: 80vh;
    overflow-y: auto;
}

/* Tab styling */
.tab-content {
    min-height: 400px;
}

/* Custom scrollbar for dialog */
.student-details-container::-webkit-scrollbar {
    width: 6px;
}

.student-details-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.student-details-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.student-details-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .student-details-container {
        max-height: 70vh;
    }

    .tab-content {
        min-height: 300px;
    }
}

/* Animation for tab transitions */
.tab-content>div {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Status badge styling */
.status-badge {
    transition: all 0.2s ease;
}

.status-badge:hover {
    transform: scale(1.05);
}

/* Card hover effects */
.bg-gray-50:hover {
    background-color: #f9fafb;
    transition: background-color 0.2s ease;
}

/* Button hover effects */
.p-button {
    transition: all 0.2s ease;
}

.p-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
