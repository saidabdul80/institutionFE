<template>
  <div class="overflow-x-auto sm:rounded-md">
    <div v-if="!loading"
      class="table-wrapper border-[2px] border-gray-300 shadow-sm rounded-lg max-h-[67vh]"
       :class="$constants.mode === 'LIGHT' ? `` : `border-[#0b231741] `"
      >
      <div class="table-container">
        <table :class="`min-w-full bg-[${$constants.light}] text-[${$constants.dark}] text-md`">
          <thead class="table-header">
            <tr class="whitespace-nowrap" >
              <th v-if="showCheckboxes" :class="`bg-[${$constants.secondary_light}]`"
                class="px-6 py-3 text-left font-bold border-b-[2px] border-gray-200">
                <input type="checkbox" @change="toggleAll" :checked="selectAll" />
              </th>
              <th
              :class="[$constants.mode === 'LIGHT' ? `bg-[${$constants.secondary_light}] text-gray-500` : `bg-[#0b231741] text-gray-300 `,tableHeadClass]"
                v-for="header in headers" :key="header.key"
                @click="toggleColumn(header, headers)">
                <div v-if="enableSortUp" class="relative inline-block w-[13px] py-[6px]">
                  <v-icon color="#ccc" :class="header?.sortUp===true?'text-gray-500':''"  class="absolute  left-0 -top-2" icon="mdi-triangle-small-up"></v-icon>
                  <v-icon color="#ccc"  :class="header?.sortUp===false?'text-gray-500':''" class="absolute -bottom-2 " icon="mdi-triangle-small-down"></v-icon>
                </div>
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-[14px]">
            <tr v-if="paginationData?.data?.length === 0">
              <td :colspan="headers.length + (showCheckboxes ? 1 : 0)"
                :class="`px-8 py-3 font-bold text-lg text-center text-[${$constants.dark}]`">
                No data available
              </td>
            </tr>
            <tr v-else v-for="(row, index) in this.paginationData?.data" :key="index" @click="handleRowClick(row)"
              :class="index % 2 === 0 ? `bg-[${$constants.light}]` : $constants.mode === 'LIGHT' ? `bg-[${$constants.secondary_light}]` : `bg-[#ffffff13]`"
              class="cursor-pointer hover:bg-[#2b5b491b]">

              <!-- <tr v-else v-for="(row, index) in paginationData?.data|| []" :key="index" @click="handleRowClick(row)"
              :class="index % 2 === 0 ? 'bg-white' : `bg-[${$constants.secondary_light}]`"
              class="cursor-pointer hover:bg-gray-50"> -->
              <!-- class="cursor-pointer hover:bg-gray-50 whitespace-nowrap"> -->
              <td v-if="showCheckboxes" class="px-6 py-1">
                <input type="checkbox" v-model="selectedRows" :value="row" />
              </td>
              <td v-for="(header, index) in headers"
                :class="[header?.bold ? 'font-bold' : `font-semibold text-[${$constants.dark}]`,tableDataClass]"
                :key="header.key">
                <span v-if="header.key === 'sn'">
                  {{ index + paginationData?.meta?.from }}
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
    </div>
    <div v-else>
      <TableLoader :count="rowsPerPage" :columns="headers.length + 1" />
    </div>
    <div v-if="showPagination" class="mt-5">
      <Pagination :current-page="paginationData?.meta?.current_page" :total-pages="paginationData?.meta?.last_page"
        :rows-per-page="paginationData?.meta?.per_page" :total-items="paginationData?.meta?.total"
        :links="paginationData?.links" @page-change="changePage" @rows-per-page-change="changeRowsPerPage" />
    </div>
  </div>
</template>

<script>
import TableLoader from '@/components/TableLoader.vue';
import Pagination from '@/components/Pagination.vue';
import CopyButton from '@/components/CopyButton.vue';
import { helpers } from '@/helpers/utilities';
import { useClient } from '@/stores/client';
import { useGlobalsStore } from '@/stores/globals';

export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    paginationData: {
      type: Object,
      required: true,
      default: () => ({ data: [] }) 
    },
    loading: {
      type: Boolean,
      default: false,
    },
    enableSortUp: {
      type: Boolean,
      default: true,
    },
    tableHeadClass:{
      type:String,
      default:'text-sm cursor-pointer font-bold px-6 py-3 text-left uppercase tracking-wider border-b-[2px] border-gray-200'

    },
    // px-3 text-xs 
    tableDataClass:{
      type:String,
      default:'px-6 py-2 h-[56px]'

    },
    showCheckboxes: {
      type: Boolean,
      default: false,
    },
    rowsPerPage: {
      type: Number,
      default: 6,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      helpers: helpers,
      selectAll: false,
      selectedRows: [],
      currentSortKey:null,
      globals: useGlobalsStore()
    };
  },
  components: {
    TableLoader,
    Pagination,
    CopyButton,
  },
  computed: {
    displayedRows() {
      return this.paginationData?.data ? this.paginationData.data.slice(0, this.rowsPerPage) : [];
    }
  },
  watch: {
    selectAll(value) {
      if (value) {
        this.selectedRows = this.paginationData.data.map(row => row);
      } else {
        this.selectedRows = [];
      }
    },
    selectedRows: {
      handler(newValue) {
        this.selectAll = newValue.length === this.paginationData.data.length;
      },
      deep: true,
    },
  },
  methods: {
    handleRowClick(row) {
      this.$emit('row-click', row);
    },
    toggleAll() {
      if (this.selectAll) {
        this.selectedRows = [];
      } else {
        this.selectedRows = this.paginationData.data.map(row => row);
      }
      this.selectAll = !this.selectAll;
    },
    changePage(path) {
      this.$emit('page-change', path);
    },
    async changeRowsPerPage(data) {
      // const path = this.paginationData?.meta?.path+'?paginate='+data
      // const res = await useClient().http({method:'get', path,data:{},fullPath:true})
      // if(res){
      //    this.$emit('page-length-data', res);
      //   }
        this.$emit('page-length', data);
    },
    getNestedValue(obj, key) {
      return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
    },
    handleError(event) {
      event.target.src = "/assets/user.png"
    },
    formatDate(date) {
      const dateObj = new Date(date);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en-US', { month: 'short' });
      const year = dateObj.getFullYear();

      return `${day} ${month} ${year}`;
    },
    toggleColumn(header, headers){
      
      if(this.currentSortKey == header.key){
        header.sortUp = !header.sortUp
        this.globals.filters['sort_column'] = [header.key,header.sortUp? 'asc':'desc']
        return;
      }
      headers.map(header=>{
          header.sortUp = null
      })
      header.sortUp = true;
      this.globals.filters['sort_column'] = [header.key, header.sortUp? 'asc':'desc']
      this.currentSortKey = header.key
    }
  },
};
</script>

<style>
.table-wrapper {
  max-height: 67vh;
  overflow: hidden;
  position: relative;
}

.table-container {
  max-height: 67vh;
  overflow: auto;
}

.table-header tr th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
}

.table-shadow {
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
}

.table-body tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-body tr:hover {
  background-color: #f1f1f1;
}
</style>
