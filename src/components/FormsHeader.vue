<template>
  <div
    :class="` mb-7 w-full ${showControls ? 'grid grid-cols-1 gap-3 md:gap-0 md:grid-cols-3' : 'grid grid-cols-1'}`">
    <div>
      <h4 :class="`text-[${$constants.primary}] ${$constants.text_size.s5}`"
        class="font-visby font-black text-2xl uppercase">{{ header }}</h4>
      <div :class="`text-[${$constants.dark}] ${$constants.text_size.s2}`"
        class="font-visby font-medium tracking-wider ">{{ title }}</div>
    </div>

    <div v-if="showControls"
      class="col-span-2 place-content-end flex md:flex-wrap flex-col md:flex-row items-center gap-x-3 w-[100%] place-self-end">
      <div id="before-search" class="md:w-auto w-full lg:my-0 my-3 "></div>
      <div class="md:w-[50%] flex w-full" v-if="!hideSearch">
        <Search :options="searchOptions" :searchOptionsDropdown="searchOptionsDropdown" v-model="searchData" />
      </div>
      <div id="after-search" class="md:w-auto w-full lg:my-0 my-3 "></div>
      <div class="md:w-auto w-full flex gap-y-2 flex-wrap md:gap-y-0 justify-between">
        <div  v-if="config.dropdownItem.length == 0 && showButton">
         
        <v-btn v-if="enableIcon" 
          class="bg-green-700 h-fit pr-2 py-[8px] md:w-auto sm:w-[90%] w-[100%] rounded-md font-visby font-semibold text-base normal-case text-white"
          @click="buttonAction" :prepend-icon="lg ? '' : icon">

          <span class="pr-2" v-if="!lg"> {{ buttonText }}</span>

          <v-icon v-else :size="23">{{ icon }}</v-icon>
        </v-btn>

        <v-btn v-else
          class="bg-green-700 h-fit py-[8px] md:w-auto sm:w-[90%] w-[100%] rounded-md font-visby font-semibold text-base normal-case text-white"
          @click="buttonAction" :prepend-icon="icon">

          <span class="pr-2"> {{ buttonText }}</span>

        </v-btn>
        </div>
       
        <div v-if="config.dropdownItem.length > 0 && showButton" class="md:w-auto sm:w-[90%] w-[80%]">
          <v-tooltip v-if="config?.toolTipText != ''" activator="parent" class="border" location="top">{{
            config?.toolTipText }}</v-tooltip>
          <DropdownButton @click="handleDropdownButton" :title="config?.dropDownLabel" prepend-icon="mdi-plus"
            :header="config?.header" :items="config?.dropdownItem" @onClick="onClick" />
        </div>

        <v-btn v-if="refresh" @click="$emit('refresh', true)" class="ml-2" flat variant="outlined" size="small"
          :color="$constants.primary" icon="ph-arrow-clockwise"></v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Search from '@/components/Search.vue';
import DropdownButton from './DropdownButton.vue';
export default {
  name: 'FormsHeader',
  props: {
    config: {
      type: Object,
      default: {
        search: true,
        sideButton: true,
        header: '',
        toolTipText: '',
        dropDownLabel: '',
        dropdownItem: []
      }
    },
    header: {
      type: String,
      default: 'tax-collecting vendor registration'
    },
    title: {
      type: String,
      default: 'Follow the steps to register a new vendor.'
    },
    showControls: {
      type: Boolean,
      default: false
    },
    showButton:{
      type:Boolean,
      default:true
    },
    buttonText: {
      type: String,
      default: 'Add New Role'
    },
    icon: {
      type: String,
      default: 'mdi-plus'
    },
    enableIcon: {
      type: Boolean,
      default: false
    },
    buttonAction: {
      type: Function,
      default: () => { }
    },
    searchOptions: {
      type: Array,
      default: []
    },
    searchOptionsDropdown: {
      type: Object,
      default: {}
    },
    refresh: {
      type: Boolean,
      default: false
    },
    hideSearch:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    lg() { return this.$vuetify.display.lgAndDown }
  },
  data() {
    return {
      filter: 'Filter',
      searchInput: '',
      searchData: null,
      filters: ['Option 1', 'Option 2', 'Option 3'] // Example filter options
    };
  },
  methods: {
    onClick(value) {
      this.$emit('onClick', value)
    }
  },
  components: {
    Search,
    DropdownButton
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
