<template>
    <!-- <v-row class="">
        <v-col cols="12" md="7" sm="12">
            <h4 :class="`tw-text-[${$constants.primary}] ${$constants.text_size.s5}`" class="font-weight-bold">
                {{ title }}
            </h4>
            <div :class="`tw-text-[${$constants.dark}] ${$constants.text_size.s2}`" class="">Follow the steps to
                {{ subTitle }}
            </div>
        </v-col>
        <v-col cols="12" md="5" sm="12">
            <v-tabs v-model="tab" :color="$constants.primary" align-tabs="end">
            </v-tabs>
        </v-col>
    </v-row> -->
    <div class="tw-mb-2">
        <Search 
            :options="searchOptions" 
            :searchOptionsDropdown="searchOptionsDropdown" 
            :datePickerType="datePickerType" 
            :globalSearch="globalSearch" 
            :showTaxpayerSelector="showTaxpayerSelector"
        />
    </div>
</template>

<script>
import Search from "@/components/Search.vue";

export default {
    props: {
        title: {
            type: String,
            required: true
        },
        subTitle: {
            type: Array,
            required: true
        },
        searchFields: {
            type: Boolean,
            default: true
        },
        showTaxpayerSelector: {
            type: Boolean,
            default: true
        },
        searchOptions:{
            type:Array,
            default:[]
        },
        searchOptionsDropdown:{
            type:Object,
            default:{}
        },
        datePickerType:{
            type:String,
            default:''
        },
        globalSearch:{
            type:Boolean,
            default:true
        }
    },
    components: {
        Search,
    }
}
</script>