<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
            <i class="fas fa-graduation-cap text-blue-600 mr-3"></i>
            Admission Publication
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-200">
            Publish admitted applicants to make their admission status visible
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="refreshData" 
                  class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fa fa-refresh mr-2"></i>Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <i class="fas fa-users text-blue-600 dark:text-blue-400 text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Admitted</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_admitted || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
            <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Published</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.published || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
            <i class="fas fa-clock text-yellow-600 dark:text-yellow-400 text-xl"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Unpublished</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.unpublished || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Filters & Batch Actions</h3>

      <!-- Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admission Batch</label>
          <select v-model="filters.batch_id" @change="loadUnpublishedAdmissions"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200">
            <option value="">All Batches</option>
            <option v-for="batch in batches" :key="batch.id" :value="batch.id">
              {{ batch.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Programme</label>
          <select v-model="filters.programme_id" @change="loadUnpublishedAdmissions"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200">
            <option value="">All Programmes</option>
            <option v-for="programme in programmes" :key="programme.id" :value="programme.id">
              {{ programme.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session</label>
          <select v-model="filters.session_id" @change="loadUnpublishedAdmissions"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200">
            <option value="">All Sessions</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Batch Actions Row -->
      <div v-if="filters.batch_id" class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Batch Actions</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Actions for all admissions in {{ selectedBatchName }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button @click="showBatchPublishDialog = true"
                    class="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
              <i class="fa fa-paper-plane mr-1"></i>Publish All in Batch
            </button>
            <button @click="unpublishBatch"
                    class="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200">
              <i class="fa fa-eye-slash mr-1"></i>Unpublish All in Batch
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedApplicants.length > 0" 
         class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ selectedApplicants.length }} applicant(s) selected
          </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="showPublishDialog = true"
                  class="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fa fa-paper-plane mr-2"></i>Publish Selected
          </button>
          <button @click="handleBulkAction('unpublish')"
                  class="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fa fa-eye-slash mr-2"></i>Unpublish Selected
          </button>
          <button @click="handleBulkAction('send_emails')"
                  class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fa fa-envelope mr-2"></i>Send Emails
          </button>
          <button @click="clearSelection"
                  class="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <i class="fa fa-times mr-2"></i>Clear Selection
          </button>
        </div>
      </div>
    </div>

    <!-- Unpublished Admissions Table -->
    <Table
      title="Unpublished Admissions"
      :headers="tableHeaders"
      :paginationData="paginationData"
      :loading="loading"
      :showCheckboxes="true"
      @page-change="changePage"
      @search="handleSearch"
      @bulk-action="handleBulkAction"
    >
      <template #td-applicant="{ row }">
        <div class="text-sm font-medium text-gray-900 dark:text-white">
          {{ row.full_name }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ row.email }}
        </div>
      </template>
      
      <template #td-programme="{ row }">
        {{ row.programme?.name || 'N/A' }}
      </template>
      
      <template #td-level="{ row }">
        {{ row.level?.name || 'N/A' }}
      </template>
      
      <template #td-batch="{ row }">
        {{ row.batch?.name || 'N/A' }}
      </template>
      
      <template #td-date="{ row }">
        {{ formatDate(row.updated_at) }}
      </template>
      
      <template #td-actions="{ row }">
        <button @click="viewApplicant(row)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
          <i class="fa fa-eye mr-1"></i> View
        </button>
      </template>
    </Table>

    <!-- Publish Dialog -->
    <div v-if="showPublishDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Publish Selected Admissions</h3>

        <div class="mb-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="publishForm.send_emails"
                   class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700">
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Send admission emails to applicants</span>
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
          <textarea v-model="publishForm.notes" rows="3"
                    placeholder="Add any notes about this publication..."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showPublishDialog = false"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="publishSelected" :disabled="publishing"
                  class="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50">
            <i v-if="publishing" class="fa fa-spinner fa-spin mr-2"></i>
            {{ publishing ? 'Publishing...' : 'Publish' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Batch Publish Dialog -->
    <div v-if="showBatchPublishDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Publish All in Batch</h3>

        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p class="text-sm text-blue-800 dark:text-blue-300">
            <i class="fa fa-info-circle mr-2"></i>
            This will publish all unpublished admissions in the selected batch: <strong>{{ selectedBatchName }}</strong>
          </p>
        </div>

        <div class="mb-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="batchPublishForm.send_emails"
                   class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700">
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Send admission emails to applicants</span>
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
          <textarea v-model="batchPublishForm.notes" rows="3"
                    placeholder="Add any notes about this batch publication..."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showBatchPublishDialog = false"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button @click="publishBatch" :disabled="batchPublishing"
                  class="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50">
            <i v-if="batchPublishing" class="fa fa-spinner fa-spin mr-2"></i>
            {{ batchPublishing ? 'Publishing...' : 'Publish Batch' }}
          </button>
        </div>
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
              <div><strong>Marital Status:</strong> {{ selectedStudent.marital_status || 'N/A' }}</div>
              <div><strong>Religion:</strong> {{ selectedStudent.religion || 'N/A' }}</div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Contact Information</h4>
            <div class="space-y-2 text-sm">
              <div><strong>Email:</strong> {{ selectedStudent.email }}</div>
              <div><strong>Phone:</strong> {{ selectedStudent.phone_number }}</div>
              <div><strong>Present Address:</strong> {{ selectedStudent.present_address || 'N/A' }}</div>
              <div><strong>Permanent Address:</strong> {{ selectedStudent.permanent_address || 'N/A' }}</div>
              <div><strong>State:</strong> {{ selectedStudent.state || 'N/A' }}</div>
              <div><strong>LGA:</strong> {{ selectedStudent.lga || 'N/A' }}</div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Health & Other Info</h4>
            <div class="space-y-2 text-sm">
              <div><strong>Blood Group:</strong> {{ selectedStudent.blood_group || 'N/A' }}</div>
              <div><strong>Health Status:</strong> {{ selectedStudent.health_status || 'N/A' }}</div>
              <div><strong>Disability:</strong> {{ selectedStudent.disability || 'None' }}</div>
              <div><strong>Years of Experience:</strong> {{ selectedStudent.years_of_experience || 'N/A' }}</div>
              <div><strong>Working Class:</strong> {{ selectedStudent.working_class || 'N/A' }}</div>
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
              <div><strong>Applied Programme:</strong> {{ selectedStudent.programme?.name || 'N/A' }}</div>
              <div><strong>Admitted Programme:</strong> {{ selectedStudent.admitted_programme?.name || 'N/A' }}</div>
              <div><strong>Programme Type:</strong> {{ selectedStudent.programme_type || 'N/A' }}</div>
              <div><strong>Entry Mode:</strong> {{ selectedStudent.entry_mode || 'N/A' }}</div>
              <div><strong>Faculty:</strong> {{ selectedStudent.faculty || 'N/A' }}</div>
              <div><strong>Department:</strong> {{ selectedStudent.department || 'N/A' }}</div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Academic Scores</h4>
            <div class="space-y-2 text-sm">
              <div><strong>JAMB Score:</strong>
                <span class="font-bold text-blue-600">{{ selectedStudent.jamb_score || 'N/A' }}</span>
              </div>
              <div><strong>JAMB Number:</strong> {{ selectedStudent.jamb_number || 'N/A' }}</div>
              <div><strong>Entrance Exam Score:</strong> {{ selectedStudent.entrance_exam_score || 'N/A' }}</div>
              <div><strong>Entrance Exam Status:</strong> {{ selectedStudent.entrance_exam_status || 'N/A' }}</div>
              <div><strong>Previous Institution:</strong> {{ selectedStudent.prev_institution || 'N/A' }}</div>
              <div><strong>Year of Graduation:</strong> {{ selectedStudent.prev_year_of_graduation || 'N/A' }}</div>
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
              <div><strong>Full Name:</strong> {{ selectedStudent.guardian_full_name || 'N/A' }}</div>
              <div><strong>Phone Number:</strong> {{ selectedStudent.guardian_phone_number || 'N/A' }}</div>
              <div><strong>Email:</strong> {{ selectedStudent.guardian_email || 'N/A' }}</div>
              <div><strong>Address:</strong> {{ selectedStudent.guardian_address || 'N/A' }}</div>
              <div><strong>Relationship:</strong> {{ selectedStudent.guardian_relationship || 'N/A' }}</div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Next of Kin</h4>
            <div class="space-y-2 text-sm">
              <div><strong>Full Name:</strong> {{ selectedStudent.next_of_kin_full_name || 'N/A' }}</div>
              <div><strong>Phone Number:</strong> {{ selectedStudent.next_of_kin_phone_number || 'N/A' }}</div>
              <div><strong>Address:</strong> {{ selectedStudent.next_of_kin_address || 'N/A' }}</div>
              <div><strong>Relationship:</strong> {{ selectedStudent.next_of_kin_relationship || 'N/A' }}</div>
            </div>
          </div>
        </div>

        <!-- Sponsor Information -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-3">Sponsor Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>Sponsor Name:</strong> {{ selectedStudent.sponsor_full_name || 'N/A' }}</div>
            <div><strong>Sponsor Type:</strong> {{ selectedStudent.sponsor_type || 'N/A' }}</div>
            <div><strong>Sponsor Address:</strong> {{ selectedStudent.sponsor_address || 'N/A' }}</div>
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
                    :class="selectedStudent.application_fee === 'paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                  {{ selectedStudent.application_fee || 'unpaid' }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span>Registration Fee:</span>
                <span
                    :class="selectedStudent.registration_fee === 'paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                  {{ selectedStudent.registration_fee || 'unpaid' }}
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
                <span :class="getAdmissionStatusColor(selectedStudent.qualified_status)"
                      class="px-2 py-1 rounded text-xs font-semibold">
                  {{ formatStatus(selectedStudent.qualified_status) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span>Admission Status:</span>
                <span :class="getAdmissionStatusColor(selectedStudent.admission_status)"
                      class="px-2 py-1 rounded text-xs font-semibold">
                  {{ formatStatus(selectedStudent.admission_status) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span>Final Submission:</span>
                <span
                    :class="selectedStudent.final_submission === '1' ? 'text-green-600' : 'text-red-600'">
                  {{ selectedStudent.final_submission === '1' ? 'Submitted' : 'Not Submitted' }}
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
              <div><strong>Matric Number:</strong> {{ selectedStudent.matric_number || 'Not Assigned' }}</div>
              <div><strong>Admission Serial:</strong> {{ selectedStudent.admission_serial_number || 'N/A' }}</div>
              <div><strong>User Type:</strong> {{ selectedStudent.user_type || 'applicant' }}</div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Activity Information</h4>
            <div class="space-y-2 text-sm">
              <div><strong>Created:</strong> {{ formatDate(selectedStudent.created_at) }}</div>
              <div><strong>Last Updated:</strong> {{ formatDate(selectedStudent.updated_at) }}</div>
              <div><strong>Last Login:</strong> {{ formatDate(selectedStudent.logged_in_time) }}</div>
              <div><strong>Login Count:</strong> {{ selectedStudent.logged_in_count || 0 }}</div>
              <div><strong>Submitted:</strong> {{ selectedStudent.submitted_date_ago || 'N/A' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Actions -->
    <div class="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
      <button @click="showStudentDialog = false" 
              class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md">
        <i class="fa fa-times mr-2"></i>
        Close
      </button>
    </div>
  </div>
</Dialog>
  </div>
</template>
<script>
import Table from '@/components/Table.vue'
import { post } from '@/api/client'
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin'

export default {
  components: {
    Table
  },
  
  mixins: [schoolInfoMixin],

  data() {
    return {
      // Reactive data
      loading: false,
      publishing: false,
      batchPublishing: false,
      showPublishDialog: false,
      showBatchPublishDialog: false,
      showStudentDialog: false,
      selectedApplicants: [],
      selectedStudent: null,
      activeTab: 'personal',
      
      stats: {
        total_admitted: 0,
        published: 0,
        unpublished: 0
      },
      
      filters: {
        batch_id: '',
        programme_id: '',
        session_id: ''
      },
      
      unpublishedAdmissions: [],
      batches: [],
      programmes: [],
      sessions: [],
      
      paginationData: {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
          from: 0,
          to: 0
        }
      },
      
      publishForm: {
        send_emails: true,
        notes: ''
      },
      
      batchPublishForm: {
        send_emails: true,
        notes: ''
      },
      
      tableHeaders: [
        { key: 'checkbox', title: '', type: 'checkbox' },
        { key: 'applicant', title: 'Applicant' },
        { key: 'programme', title: 'Programme' },
        { key: 'level', title: 'Level' },
        { key: 'batch', title: 'Batch' },
        { key: 'date', title: 'Admitted Date' },
        { key: 'actions', title: 'Actions' }
      ],
      
      studentTabs: [
        { id: 'personal', label: 'Personal Info', icon: 'fa fa-user' },
        { id: 'academic', label: 'Academic Info', icon: 'fa fa-graduation-cap' },
        { id: 'guardian', label: 'Guardian Info', icon: 'fa fa-users' },
        { id: 'payment', label: 'Payment Info', icon: 'fa fa-credit-card' },
        { id: 'system', label: 'System Info', icon: 'fa fa-info-circle' }
      ]
    }
  },
  
  computed: {

    allSelected() {
      return this.paginationData.data.length > 0 &&
             this.selectedApplicants.length === this.paginationData.data.length
    },
    
    selectedBatchName() {
      const batch = this.batches.find(b => b.id == this.filters.batch_id)
      return batch ? batch.name : ''
    }
  },
  
  mounted() {
    this.filters.session_id = this.currentSessionId
    this.refreshData()
  },
  
  methods: {
    viewApplicant(applicant) {
      this.selectedStudent = applicant
      this.showStudentDialog = true
    },
    
    getInitials(firstName, lastName) {
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
    },
    
    getAdmissionStatusColor(status) {
      switch (status) {
        case 'admitted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        case 'not admitted': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }
    },
    
    formatStatus(status) {
      if (!status) return 'Unknown'
      return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    },
    
    async loadStats() {
      try {
        const response = await post('api/staff/admission/publication_stats', this.filters)
        if (!response.data.error) {
          this.stats = response.data
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    },
    
    async loadUnpublishedAdmissions(page = 1) {
      this.loading = true
      try {
        const params = {
          ...this.filters,
          page,
          per_page: this.paginationData.meta.per_page
        }

        const response = await post('api/staff/admission/unpublished', params)

        if (!response.data.error) {
          const data = response.data
          this.unpublishedAdmissions = data || []
          this.paginationData = {
            data: data.data || [],
            meta: {
              current_page: data.current_page || 1,
              last_page: data.last_page || 1,
              per_page: data.per_page || 20,
              total: data.total || 0,
              from: data.from || 0,
              to: data.to || 0
            }
          }
          this.selectedApplicants = []
        }
      } catch (error) {
        console.error('Error loading unpublished admissions:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadDropdownData() {
      try {
        // Load batches
        const batchResponse = await post('api/staff/admission/get_batches',{
          session_id: this.filters.session_id
        })
        if (batchResponse) {
          this.batches = batchResponse.data || []
        }

        // Load programmes and sessions from global store
        this.programmes = this.schoolInfo.programmes || []
        this.sessions = this.schoolInfo.sessions || []

      } catch (error) {
        console.error('Error loading dropdown data:', error)
      }
    },
    
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedApplicants = []
      } else {
        this.selectedApplicants = this.paginationData.data.map(a => a.id)
      }
    },
    
    clearSelection() {
      this.selectedApplicants = []
    },
    
    async publishSelected() {
      if (this.selectedApplicants.length === 0) return

      this.publishing = true
      try {
        const payload = {
          applicant_ids: this.selectedApplicants,
          send_emails: this.publishForm.send_emails,
          notes: this.publishForm.notes
        }

        const response = await post('api/staff/admission/publish', payload)

        if (!response.data.error) {
          // Reset form and close dialog
          this.publishForm = {
            send_emails: true,
            notes: ''
          }
          this.showPublishDialog = false

          // Refresh data
          await Promise.all([
            this.loadUnpublishedAdmissions(),
            this.loadStats()
          ])
        }
      } catch (error) {
        console.error('Error publishing admissions:', error)
      } finally {
        this.publishing = false
      }
    },
    
    changePage(page) {
      this.loadUnpublishedAdmissions(page)
    },
    
    handleSearch(query) {
      this.filters.search = query
      this.loadUnpublishedAdmissions()
    },
    
    async refreshData() {
      await Promise.all([
        this.loadUnpublishedAdmissions(),
        this.loadStats(),
        this.loadDropdownData()
      ])
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    async handleBulkAction(action) {
      if (this.selectedApplicants.length === 0) {
        this.showToast('Please select applicants first', 'error')
        return
      }

      const actionMessages = {
        unpublish: 'Are you sure you want to unpublish the selected admissions?',
        send_emails: 'Are you sure you want to send emails to the selected applicants?'
      }

      if (actionMessages[action] && !confirm(actionMessages[action])) {
        return
      }

      this.publishing = true
      try {
        const payload = {
          action,
          applicant_ids: this.selectedApplicants,
          notes: this.publishForm.notes
        }

        const response = await post('/api/staff/admission/bulk_action', payload)

        if (!response.data.error) {
          const result = response.data
          this.showToast(result.message, 'success')

          // Refresh data
          await Promise.all([
            this.loadUnpublishedAdmissions(),
            this.loadStats()
          ])

          this.selectedApplicants = []
        } else {
          this.showToast(response.data.message || `Error performing ${action}`, 'error')
        }
      } catch (error) {
        console.error(`Error performing ${action}:`, error)
        this.showToast(`Error performing ${action}`, 'error')
      } finally {
        this.publishing = false
      }
    },
    
    async publishBatch() {
      if (!this.filters.batch_id) {
        this.showToast('Please select a batch first', 'error')
        return
      }

      this.batchPublishing = true
      try {
        const payload = {
          batch_id: this.filters.batch_id,
          send_emails: this.batchPublishForm.send_emails,
          notes: this.batchPublishForm.notes
        }

        const response = await axios.post('/api/staff/admission/publish_batch', payload)

        if (!response.data.error) {
          const result = response.data.data
          this.showToast(result.message, 'success')

          // Reset form and close dialog
          this.batchPublishForm = {
            send_emails: true,
            notes: ''
          }
          this.showBatchPublishDialog = false

          // Refresh data
          await Promise.all([
            this.loadUnpublishedAdmissions(),
            this.loadStats()
          ])

        } else {
          this.showToast(response.data.message || 'Error publishing batch', 'error')
        }
      } catch (error) {
        console.error('Error publishing batch:', error)
        this.showToast('Error publishing batch', 'error')
      } finally {
        this.batchPublishing = false
      }
    },
    
    async unpublishBatch() {
      if (!this.filters.batch_id) {
        this.showToast('Please select a batch first', 'error')
        return
      }

      if (!confirm(`Are you sure you want to unpublish all admissions in ${this.selectedBatchName}?`)) {
        return
      }

      this.batchPublishing = true
      try {
        const payload = {
          batch_id: this.filters.batch_id
        }

        const response = await post('/api/staff/admission/unpublish_batch', payload)

        if (!response.data.error) {
          const result = response.data
          this.$globals.showMessage(result.message, 'success')

          // Refresh data
          await Promise.all([
            this.loadUnpublishedAdmissions(),
            this.loadStats()
          ])

        } else {
          this.showToast(response.data.message || 'Error unpublishing batch', 'error')
        }
      } catch (error) {
        console.error('Error unpublishing batch:', error)
        this.showToast('Error unpublishing batch', 'error')
      } finally {
        this.batchPublishing = false
      }
    }
  }
}
</script>