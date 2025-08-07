<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
    <!-- Table Header Section -->
    <div class="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">
          {{ title }} ({{ totalItems }})
        </h3>
        <div class="flex gap-2">
          <input v-model="searchQuery" @input="handleSearch" type="text"
            placeholder="Search..."
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200" />
          <button v-if="showCheckboxes" @click="selectAll"
            class="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-200">
            {{ allOnPageSelected ? "Deselect All" : "Select All" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 text-center">
      <i class="fa fa-spinner fa-spin text-2xl text-gray-400 dark:text-gray-500"></i>
      <p class="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-200">Loading data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="tableData.length === 0" class="p-6 text-center">
      <i class="fa fa-users text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
      <p class="text-gray-600 dark:text-gray-300 transition-colors duration-200">No records found</p>
    </div>

    <!-- Table Content -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th v-if="showCheckboxes" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <input type="checkbox"
                :checked="allOnPageSelected"
                @change="selectAll"
                class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700" />
            </th>
            <th v-for="header in headers" :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          <tr v-for="(row, index) in tableData" :key="row.id || index"
              :data-row-id="row.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <td v-if="showCheckboxes" class="px-6 py-4 whitespace-nowrap">
              <input type="checkbox"
                :checked="selectedRows.includes(row.id)"
                @change="toggleRowSelection(row)"
                class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700" />
            </td>
            <td v-for="(header, colIndex) in headers"
              :key="header.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="{
                'font-medium text-gray-900 dark:text-gray-100': !header.bold,
                'font-bold text-gray-900 dark:text-white': header.bold
              }">
              <span v-if="header.key === 'sn'">
                {{ getRowNumber(index) }}
              </span>
              <span v-else>
                <span v-if="$slots[`td-${header.key}`]">
                  <slot :name="`td-${header.key}`" :row="row"></slot>
                </span>
                <span v-else class="flex items-center">
                  <span v-if="header?.formatNumber">
                    <span v-if="header?.currency || header?.currency == ''">
                      {{ 
                      parseInt(helpers.formatMoney(parseFloat(getNestedValue(row, header.key)),header?.currency))
                      }}
                    </span>
                    <span v-else>
                      {{ helpers.formatMoney(parseFloat(getNestedValue(row, header.key))) }}
                    </span>
                  </span>
                  <span v-else-if="header?.formatDate">
                    {{ formatDate(getNestedValue(row, header.key)) }}
                  </span>
                  <span v-else>
                    {{ getNestedValue(row, header.key) }}
                  </span>
                  <CopyButton @click.prevent="" v-if="header?.copy" :text="getNestedValue(row, header.key)" />
                </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination" class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-200">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="previousPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200">
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
            Showing <span class="font-medium">{{ showingFrom }}</span> to
            <span class="font-medium">{{ showingTo }}</span> of
            <span class="font-medium">{{ totalItems }}</span>
            records
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200">
              <i class="fa fa-chevron-left"></i>
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="page === currentPage
                ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              " class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200">
              <i class="fa fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedRows.length > 0"
      class="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ selectedRows.length }} selected</span>
        <button @click="handleBulkAction('approve')"
          class="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200">
          <i class="fa fa-check mr-2"></i>Approve Selected
        </button>
        <button @click="handleBulkAction('reject')"
          class="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200">
          <i class="fa fa-times mr-2"></i>Reject Selected
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { helpers } from '@/helpers/utilities';
import CopyButton from '@/components/CopyButton.vue';

export default {
  props: {
    title: {
      type: String,
      default: 'Records'
    },
    headers: {
      type: Array,
      required: true,
    },
    paginationData: {
      type: [Object, Array],
      required: true,
      default: () => ({ data: [], meta: {} }) 
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showCheckboxes: {
      type: Boolean,
      default: false,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      helpers: helpers,
      selectedRows: [],
      searchQuery: '',
      currentPage: 1,
    };
  },
  components: {
    CopyButton,
  },
  computed: {
    // Normalize the data structure for both array and paginated responses
    tableData() {
      if (Array.isArray(this.paginationData)) {
        return this.paginationData;
      }
      return this.paginationData?.data || [];
    },
    
    // Support both Laravel-style pagination and custom meta structure
    meta() {
      if (Array.isArray(this.paginationData)) {
        return {
          current_page: 1,
          from: 1,
          to: this.paginationData.length,
          total: this.paginationData.length,
          last_page: 1,
          per_page: this.paginationData.length
        };
      }
      const isMeta = Object.keys(this.paginationData?.meta||{}).length > 0;
      return isMeta? this.paginationData?.meta : {
        current_page:this.paginationData?.current_page || 1,
        from: this.paginationData?.from,
        to: this.paginationData?.to || 0,
        total: this.paginationData.total || 0,
        last_page: this.paginationData?.last_page || 1,
        per_page: this.paginationData?.per_page || 0
      };
    },
    
    totalItems() {
      return this.meta?.total || this.tableData.length;
    },
    
    showingFrom() {
      return this.meta?.from || 1;
    },
    
    showingTo() {
      return this.meta?.to || this.tableData.length;
    },
    
    totalPages() {
      return this.meta?.last_page || 1;
    },
    
    currentPage() {
      return this.meta?.current_page || 1;
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
      if (!this.tableData.length) return false;
      return this.tableData.every(row => 
        this.selectedRows.includes(row.id)
      );
    }
  },
  methods: {
    getRowNumber(index) {
      if (this.meta?.from) {
        return index + this.meta.from;
      }
      return index + 1;
    },
    
    getNestedValue(obj, key) {
      return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
    },
    
    formatDate(date) {
      if (!date) return '';
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    toggleRowSelection(row) {
      if (!row.id) return;
      const index = this.selectedRows.indexOf(row.id);
      if (index === -1) {
        this.selectedRows = [...this.selectedRows, row.id];
      } else {
        this.selectedRows = this.selectedRows.filter(id => id !== row.id);
      }
    },
    
    selectAll() {
      if (this.allOnPageSelected) {
        // Deselect all by filtering out the current page's rows
        const currentPageIds = this.tableData.map(row => row.id).filter(Boolean);
        this.selectedRows = this.selectedRows.filter(
          id => !currentPageIds.includes(id)
        );
      } else {
        // Select all visible rows in the current page
        this.selectedRows = [
          ...new Set([
            ...this.selectedRows,
            ...this.tableData.map(row => row.id).filter(Boolean)
          ])
        ];
      }
    },
    
    handleSearch() {
      this.$emit('search', this.searchQuery);
    },
    
    handleBulkAction(action) {
      this.$emit('bulk-action', {
        action,
        ids: this.selectedRows
      });
    },
    
    previousPage() {
      if (this.currentPage > 1) {
        this.$emit('page-change', this.currentPage - 1);
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit('page-change', this.currentPage + 1);
      }
    },
    
    goToPage(page) {
      this.$emit('page-change', page);
    },
    
    changeRowsPerPage(perPage) {
      this.$emit('page-length', perPage);
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>