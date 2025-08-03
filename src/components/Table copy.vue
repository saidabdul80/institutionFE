<template>
  <div class="tw-overflow-x-auto sm:tw-rounded-md tw-p-0 tw-w-full ">
    <div v-if="!loading"
      class="table-wrapper tw-rounded-lg  tw-max-h-[67vh]" 
       :class="shadow?'tw-shadow-xl':''"
      >
      
      <div class="table-container">
        <table :class="`tw-min-w-full tw-bg-[${$constants.light}] tw-text-[${$constants.dark}] tw-text-md`">
          <thead class="table-header">
            <tr class="tw-whitespace-nowrap" >
              <th v-if="showCheckboxes" :class="`tw-bg-[${$constants.light}]  tw-font-bold  tw-border-[${$constants.border}]`"
                class="tw-px-6 tw-py-3 tw-text-left !tw-font-bold tw-border-b-[1px]">
                <input type="checkbox" @change="toggleAll" :checked="selectAll" />
              </th>
              <th
              :class="[tableHeadClass,`tw-bg-[${$constants.light}]  tw-border-[${$constants.border}]  tw-text-[${$constants.dark}`,'!tw-font-bold']"
                v-for="header in headers" :key="header.key"
                @click="toggleColumn(header, headers)">
                <div v-if="enableSortUp" class="tw-relative tw-inline-block tw-w-[13px] tw-py-[6px] ">
                  <v-icon color="#ccc" :class="header?.sortUp===true?'tw-text-gray-500':''"  class="tw-absolute  tw-left-0 -tw-top-2" icon="mdi-triangle-small-up"></v-icon>
                  <v-icon color="#ccc"  :class="header?.sortUp===false?'tw-text-gray-500':''" class="tw-absolute -tw-bottom-2 " icon="mdi-triangle-small-down"></v-icon>
                </div>
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody class="tw-divide-y tw-divide-gray-100 tw-text-[14px]">
            <tr v-if="paginationData?.data?.length === 0">
              <td :colspan="headers.length + (showCheckboxes ? 1 : 0)"
                :class="`tw-px-8 tw-py-3 tw-font-bold tw-text-lg tw-text-center tw-text-[${$constants.dark}]`">
                No data available
              </td>
            </tr>
            <tr v-ripple v-else v-for="(row, index) in this.paginationData?.data" :key="index" @click="handleRowClick(row)" 
              :class="`tw-bg-[${$constants.light}]  `"
              class="tw-cursor-pointer hover:tw-bg-[#2b5b491b]">

              <!-- <tr v-else v-for="(row, index) in paginationData?.data|| []" :key="index" @click="handleRowClick(row)"
              :class="index % 2 === 0 ? 'tw-bg-white' : `tw-bg-[${$constants.secondary_light}]`"
              class="tw-cursor-pointer hover:tw-bg-gray-50"> -->
              <!-- class="tw-cursor-pointer hover:tw-bg-gray-50 tw-whitespace-nowrap"> -->
              <td  v-if="showCheckboxes" class="tw-px-6 tw-py-1" :class="`tw-border-[${$constants.border}]`" @click="handleColumnClick(row,$event)" @mouseenter="handleRowHover(row, $event, true)" @mouseleave="handleRowHover(row, $event, false)">
                <input type="checkbox" v-model="selectedRows" :value="row" />
              </td>
              <td v-for="(header, index) in headers"
                :class="[header?.bold ? 'tw-font-bold' : `tw-font-semibold tw-text-[${$constants.dark}]`,tableDataClass,`!tw-border-[${$constants.border}]`]"
                :key="header.key" @click="handleColumnClick(row,$event)" @mouseenter="handleRowHover(row, $event, true)" @mouseleave="handleRowHover(row, $event, false)">

                <span v-if="header.key === 'sn'">
                  {{ index + paginationData?.meta?.from }}
                </span>
                <span v-else>
                  <span v-if="$slots[`td-${header.key}`]">
                    <slot :name="`td-${header.key}`" :row="row"></slot>
                  </span>
                  <span v-else class="tw-flex tw-items-center">
                    <span v-if="header?.formatNumber">
                      <span v-if="header?.currency || header?.currency == ''" :class="header?.shorten?'tw-w-[200px] tw-truncate':''">
                        {{ 
                        parseFloat(helpers.formatMoney(parseFloat(getNestedValue(row, header.key)),header?.currency))
                        }}
                      </span>
                      <span v-else>
                        {{ helpers.formatMoney(parseFloat(getNestedValue(row, header.key))) }}
                      </span>
                    </span>
                    <span v-else-if="header?.formatDate">
                      {{ formatDate(getNestedValue(row, header.key)) }}
                    </span>
                    <span v-else-if="header?.titleCase" :class="header?.shorten?'tw-w-[200px] tw-truncate':''">
                      {{ globals.toTitleCase(getNestedValue(row, header.key) )}}
                    </span>
                    <span v-else :class="header?.shorten?'tw-w-[200px] tw-truncate':''">
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
    <div v-if="showPagination" class="tw-mt-5">
      <Pagination :current-page="paginationData?.meta?.current_page||0" :total-pages="paginationData?.meta?.last_page||0"
        :rows-per-page="paginationData?.meta?.per_page||50" :total-items="paginationData?.meta?.total||0"
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
      default:'tw-text-sm tw-cursor-pointer tw-font-bold tw-px-6 tw-py-3 tw-text-left tw-uppercase tw-tracking-wider tw-border-b-[1px]'

    },
    // tw-px-3 tw-text-xs 
    tableDataClass:{
      type:String,
      default:'tw-px-6 tw-py-2 tw-h-[56px]'

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
    shorten: {
      type: Boolean,
      default: false,
    },
    shadow:{default:true}
    
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
    borderColor(){
      return this.$constants.border;
    },
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
    handleRowHover(row, e, hover) {
      row.event = e;
      this.$emit('row-hover', row, hover);
    },
    handleColumnClick(row,e) {
      row.event = e;
      this.$emit('column-click', row);
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
      try{

        return key.split('.')?.reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
      }catch(e){
        return null;
      }
    },
    handleError(event) {
      event.target.src = "/assets/user.png"
    },
    formatDate(date) {
      const dateObj = new Date(date);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en-US', { month: 'short' });
      const year = dateObj.getFullYear();

      const ordinalSuffix = this.getOrdinalSuffix(day);
      return `${day}${ordinalSuffix} ${month} ${year}`;
    },
    getOrdinalSuffix(day) {
      if ([1, 21, 31].includes(day)) return 'st';
      if ([2, 22].includes(day)) return 'nd';
      if ([3, 23].includes(day)) return 'rd';
      return 'th';
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
  mounted(){
    this.$primevue.config.ripple = true;
  }
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
/* 
.table-body tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-body tr:hover {
  background-color: #f1f1f1;
} */
.tw-divide-y > :not([hidden]) ~ :not([hidden]){
  border-color: v-bind(borderColor) !important;
}
</style>
