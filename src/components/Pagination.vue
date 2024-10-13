<template>
    <div class="flex flex-col sm:flex-row items-center justify-between px-4 py-1 sm:rounded-lg" :class="$constants.mode === 'LIGHT' ? `bg-[${$constants.secondary_light}] text-gray-500` : `bg-[#0b23177f] text-gray-300`">
      <div class="flex items-center">
        <span class="text-sm " :class="$constants.mode === 'LIGHT' ? `text-gray-500` : `text-gray-300`">Rows per page:</span>
        <select v-model="rowsPerPageX" @change="changeRowsPerPage" class="ml-2 block px-3 mt-1 text-base bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="(option,i) in rowsPerPageOptions" :key="i" :value="option">{{ option }}</option>
        </select>
      </div>
      <div class="flex items-center">
        <v-btn :disabled="links?.prev === null" @click="changePage(links?.prev)" icon="mdi-chevron-left" size="small" class="rounded-md p-0" variant="text" flat>          
        </v-btn>
        <span class="text-sm">
          {{ currentPage }} of {{ totalPages }}
        </span>
        
        <v-btn :disabled="links?.next === null" @click="changePage(links?.next)" icon="mdi-chevron-right" size="small" class="rounded-md p-0" variant="text" flat>          
        </v-btn>
      </div>
      <div class="text-sm">
        Showing {{ startRow }} to {{ endRow }} of {{ totalItems }}
      </div>
    </div> 
  </template>
  
  <script>
  import {useGlobalsStore} from "@/stores/globals"
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true,
      },
      totalPages: {
        type: Number,
        required: true,
      },
      rowsPerPage: {
        type: Number,
        required: true,
      },
      totalItems: {
        type: Number,
        required: true,
      },
      rowsPerPageOptions: {
        type: Array,
        default: () => [10, 25, 50, 100],
      },
      meta:{
        type:Object,
        default:{}
      },
      links:{
        type:Object,
        default:{}
      }
    },
    computed: {
      startRow() {
        return (this.currentPage - 1) * this.rowsPerPage + 1;
      },
      endRow() {
        return Math.min(this.currentPage * this.rowsPerPage, this.totalItems);
      },
    },
    data() {
        return {
            globals: useGlobalsStore(),
            rowsPerPageX:10
        }
    },
    created(){
        this.rowsPerPageX = this.rowsPerPage
    },
    methods: {
      changePage(path) {
        this.$emit('page-change', path);
      },
      changeRowsPerPage(event) {
        this.globals.filters.paginate = parseInt(event.target.value)
        this.$emit('rows-per-page-change', parseInt(event.target.value));
      },
    },
  };
  </script>
  
  <style scoped>
  /* Scoped styles if needed */
  </style>
  