<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
            Dark Mode Test Page
          </h1>
          <p class="text-gray-600 dark:text-gray-300 transition-colors duration-200">
            Testing all components in {{ isDark ? 'dark' : 'light' }} mode
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <ThemeToggle variant="dropdown" :show-label="true" />
          <ThemeToggle variant="switch" :show-label="true" />
        </div>
      </div>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
            <i class="fa fa-check text-green-600 dark:text-green-400"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">1,234</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mr-3">
            <i class="fa fa-clock text-yellow-600 dark:text-yellow-400"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">567</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
            <i class="fa fa-times text-red-600 dark:text-red-400"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">89</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
            <i class="fa fa-info text-blue-600 dark:text-blue-400"></i>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">1,890</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Components -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Form Components</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Input</label>
          <input 
            type="text" 
            placeholder="Enter text..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select</label>
          <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Textarea</label>
          <textarea 
            rows="3"
            placeholder="Enter description..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Buttons</h2>
      <div class="flex flex-wrap gap-3">
        <button class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Primary
        </button>
        <button class="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Secondary
        </button>
        <button class="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Success
        </button>
        <button class="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Danger
        </button>
        <button class="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Warning
        </button>
      </div>
    </div>

    <!-- Table Component Test -->
    <div class="mb-6">
      <Table 
        title="Test Data Table"
        :headers="tableHeaders"
        :pagination-data="tableData"
        :loading="false"
        :show-checkboxes="true"
        :show-pagination="true"
        @bulk-action="handleBulkAction"
      />
    </div>

    <!-- Status Badges -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">Status Badges</h2>
      <div class="flex flex-wrap gap-2">
        <span class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">Active</span>
        <span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">Pending</span>
        <span class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm">Inactive</span>
        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">Info</span>
        <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm">Default</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Table from '@/components/Table.vue'

export default {
  name: 'DarkModeTest',
  components: {
    ThemeToggle,
    Table
  },
  setup() {
    const themeStore = useThemeStore()
    
    const tableHeaders = ref([
      { key: 'name', title: 'Name' },
      { key: 'email', title: 'Email' },
      { key: 'status', title: 'Status' },
      { key: 'created_at', title: 'Created' }
    ])
    
    const tableData = ref({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', created_at: '2024-01-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', created_at: '2024-01-02' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', created_at: '2024-01-03' }
      ],
      meta: {
        total: 3,
        from: 1,
        to: 3,
        current_page: 1,
        last_page: 1
      }
    })
    
    const handleBulkAction = (action) => {
      console.log('Bulk action:', action)
    }
    
    return {
      isDark: themeStore.isDark,
      tableHeaders,
      tableData,
      handleBulkAction
    }
  }
}
</script>

<style scoped>
/* Additional test page styles */
</style>
