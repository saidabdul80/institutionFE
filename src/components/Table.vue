<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100">
    <!-- Table Header Section -->
    <div class="border-b border-gray-200 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ title }} ({{ paginationData?.meta?.total || 0 }})
        </h3>
        <div class="flex gap-2">
          <input v-model="searchQuery" @input="handleSearch" type="text"
            placeholder="Search..."
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button v-if="showCheckboxes" @click="selectAll"
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
            {{ allSelected ? "Deselect All" : "Select All" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 text-center">
      <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
      <p class="text-gray-600 mt-2">Loading data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="paginationData?.data?.length === 0" class="p-6 text-center">
      <i class="fa fa-users text-4xl text-gray-400 mb-4"></i>
      <p class="text-gray-600">No records found</p>
    </div>

    <!-- Table Content -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-if="showCheckboxes" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" 
                :checked="allOnPageSelected"
                @change="selectAll"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </th>
            <th v-for="header in headers" :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, index) in paginationData.data" :key="index" class="hover:bg-gray-50">
            <td v-if="showCheckboxes" class="px-6 py-4 whitespace-nowrap">
              <input type="checkbox" 
                :checked="selectedRows.includes(row.id)"
                @change="toggleRowSelection(row)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </td>
            <td v-for="(header, colIndex) in headers"
              :key="header.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="{
                'font-medium text-gray-900': !header.bold,
                'font-bold': header.bold
              }">
              <span v-if="header.key === 'sn'">
                
                {{ index + (paginationData?.meta?.from || paginationData?.from  ) }}
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
    <div v-if="showPagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="previousPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ paginationData?.meta?.from }}</span> to
            <span class="font-medium">{{ paginationData?.meta?.to }}</span> of
            <span class="font-medium">{{ paginationData?.meta?.total }}</span>
            records
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <i class="fa fa-chevron-left"></i>
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="page === currentPage
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              " class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <i class="fa fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedRows.length > 0"
      class="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700">{{ selectedRows.length }} selected</span>
        <button @click="handleBulkAction('approve')"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <i class="fa fa-check mr-2"></i>Approve Selected
        </button>
        <button @click="handleBulkAction('reject')"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
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
      type: Object,
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
  watch: {
    selectedRows(newValue, oldValue) {
      this.$emit('selected-rows', newValue);
    }
  },
  computed: {
    totalPages() {
      return this.paginationData?.meta?.last_page || 1;
    },
    currentPage() {
      return this.paginationData?.meta?.current_page || 1;
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
      if (!this.paginationData?.data?.length) return false;
      return this.paginationData.data.every(row => 
        this.selectedRows.includes(row.id)
      );
    }
  },
  methods: {
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
        const currentPageIds = this.paginationData.data.map(row => row.id);
        this.selectedRows = this.selectedRows.filter(
          id => !currentPageIds.includes(id)
        );
      } else {
        // Select all visible rows in the current page
        this.selectedRows = [
          ...new Set([
            ...this.selectedRows,
            ...this.paginationData.data.map(row => row.id)
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