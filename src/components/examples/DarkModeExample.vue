<template>
  <div :class="buildClasses.page()">
    <!-- Header Card -->
    <div :class="buildClasses.card('p-6 mb-6')">
      <h1 :class="buildClasses.title()">Dark Mode Example</h1>
      <p :class="buildClasses.subtitle()">
        This component demonstrates the dark mode utilities in action.
      </p>
      
      <!-- Theme Toggle -->
      <div class="flex items-center gap-4 mt-4">
        <button 
          @click="toggleTheme"
          :class="buildClasses.button('primary')"
        >
          <i :class="isDark ? 'fa fa-sun' : 'fa fa-moon'" class="mr-2"></i>
          Switch to {{ isDark ? 'Light' : 'Dark' }} Mode
        </button>
        
        <span :class="getStatusColor('active', 'badge')">
          Current: {{ theme }} mode
        </span>
      </div>
    </div>

    <!-- Status Examples -->
    <div :class="buildClasses.card('p-6 mb-6')">
      <h2 :class="buildClasses.title() + ' text-lg mb-4'">Status Colors</h2>
      <div class="flex flex-wrap gap-2">
        <span :class="getStatusColor('active', 'badge')">Active</span>
        <span :class="getStatusColor('inactive', 'badge')">Inactive</span>
        <span :class="getStatusColor('pending', 'badge')">Pending</span>
        <span :class="getStatusColor('success', 'badge')">Success</span>
        <span :class="getStatusColor('error', 'badge')">Error</span>
        <span :class="getStatusColor('warning', 'badge')">Warning</span>
      </div>
    </div>

    <!-- Form Example -->
    <div :class="buildClasses.card('p-6 mb-6')">
      <h2 :class="buildClasses.title() + ' text-lg mb-4'">Form Elements</h2>
      <div class="space-y-4">
        <div>
          <label :class="formClasses.label">Name</label>
          <input 
            type="text" 
            :class="formClasses.input"
            placeholder="Enter your name"
            v-model="formData.name"
          />
        </div>
        
        <div>
          <label :class="formClasses.label">Status</label>
          <select :class="formClasses.select" v-model="formData.status">
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <label :class="formClasses.label">Description</label>
          <textarea 
            :class="formClasses.textarea"
            placeholder="Enter description"
            v-model="formData.description"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Table Example -->
    <div :class="tableClasses.wrapper">
      <table :class="tableClasses.table">
        <thead :class="tableClasses.thead">
          <tr>
            <th :class="tableClasses.th">Name</th>
            <th :class="tableClasses.th">Status</th>
            <th :class="tableClasses.th">Date</th>
            <th :class="tableClasses.th">Actions</th>
          </tr>
        </thead>
        <tbody :class="tableClasses.tbody">
          <tr v-for="item in sampleData" :key="item.id" :class="tableClasses.tr">
            <td :class="tableClasses.td">{{ item.name }}</td>
            <td :class="tableClasses.td">
              <span :class="getStatusColor(item.status, 'badge')">
                {{ item.status }}
              </span>
            </td>
            <td :class="tableClasses.td">{{ item.date }}</td>
            <td :class="tableClasses.td">
              <button :class="buildClasses.button('primary') + ' text-sm px-3 py-1'">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Conditional Classes Example -->
    <div :class="buildClasses.card('p-6 mt-6')">
      <h2 :class="buildClasses.title() + ' text-lg mb-4'">Conditional Styling</h2>
      <div 
        :class="conditionalClasses('bg-blue-100 text-blue-800', 'bg-blue-900/30 text-blue-300').value"
        class="p-4 rounded-lg"
      >
        This box changes color based on the theme!
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useDarkMode, useDarkModeForm, useDarkModeTable } from '@/composables/useDarkMode'

export default {
  name: 'DarkModeExample',
  setup() {
    // Use dark mode composables
    const { 
      isDark, 
      theme, 
      toggleTheme, 
      getStatusColor, 
      buildClasses,
      conditionalClasses
    } = useDarkMode()
    
    const { formClasses } = useDarkModeForm()
    const { tableClasses } = useDarkModeTable()
    
    // Form data
    const formData = ref({
      name: '',
      status: '',
      description: ''
    })
    
    // Sample table data
    const sampleData = ref([
      { id: 1, name: 'John Doe', status: 'active', date: '2024-01-15' },
      { id: 2, name: 'Jane Smith', status: 'inactive', date: '2024-01-14' },
      { id: 3, name: 'Bob Johnson', status: 'pending', date: '2024-01-13' },
      { id: 4, name: 'Alice Brown', status: 'success', date: '2024-01-12' }
    ])
    
    return {
      // Theme state and actions
      isDark,
      theme,
      toggleTheme,
      
      // Utility functions
      getStatusColor,
      buildClasses,
      conditionalClasses,
      
      // Form and table classes
      formClasses,
      tableClasses,
      
      // Component data
      formData,
      sampleData
    }
  }
}
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style>
