<template>
    <v-row class="">
        <v-col cols="12" md="7" sm="12">
            <h4 :class="`text-[${$constants.primary}] ${$constants.text_size.s5}`" class="font-weight-bold">
                {{ title }}
            </h4>
            <div :class="`text-[${$constants.dark}] ${$constants.text_size.s2}`" class="">Follow the steps to
                {{ subTitle }}
            </div>
        </v-col>
        <v-col cols="12" md="5" sm="12">
            <v-tabs v-model="tab" :color="$constants.primary" align-tabs="end">
                <Search :options="searchOptions" :searchOptionsDropdown="searchOptionsDropdown"/>
            </v-tabs>
        </v-col>
    </v-row>
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
        searchOptions:{
            type:Array,
            default:[]
        },
        searchOptionsDropdown:{
            type:Object,
            default:{}
        }
    },
    components: {
        Search,
    }
}
</script>