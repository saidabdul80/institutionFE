<template>
    <div class="grid md:grid-cols-5 grid-cols-1 gap-4 place-content-center">
        <div class="md:col-span-2">
            <h4 :class="`text-[${$constants.primary}] ${$constants.text_size.s5}`" class="font-weight-bold text-capitalize">
                {{ title }}
            </h4>
            <p v-html="subtitle" class=" m-0"></p>
        </div>
        <div class="md:col-span-3 place-content-end items-center">
            <div class="w-full md:flex justify-end items-center">
                <label class="mr-2 w-[30%] basis-[fit-content] ">Showing data for</label>
                <div class="md:max-w-[240px] md:w-[70%] w-full">
                    <DatePicker v-model="dateValue" :range="true" label="" :slim="true"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Search from "@/components/Search.vue";
import DatePicker from '@/components/DatePicker.vue';

export default {
    props: {
        modelValue: {
            type: [String, Object,Array],
            required: null,
        },
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: false
        },
        searchFields: {
            type: Boolean,
            default: true
        },
        searchOptions:{
            type:Array,
            default:[]
        },

    },
    components: {
        Search,
        DatePicker,
    },
    computed: {
        dateValue: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        }
      }
    }
}
</script>