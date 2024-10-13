<template>
    <div>
        <label :class="`text-gray-700 text-base block capitalize font-semibold`" v-if="label !== ''">
            {{ label }}
            <span v-if="isRequired" class="text-red-600">*</span>
        </label>

        <InputNumber :pt="{root:{style:'height:'+height},pcInput:{style:'background:'+$constants.input_background+ '] !important' }}"  v-bind="$attrs" v-model="internalInputValue" :placeholder="placeholder" :disabled="disabled"
            :readonly="readonly" :type="type" :style="style"
            :class="'bg-['+$constants.input_background+ '] ' + ' border-[#ccc]'"
            @focus="$emit('focus', $event)" />
        <p v-if="errorMessage" class="text-red-700 text-xs m-1">{{  errorMessage  }}</p>
    </div>
</template>

<script>
import InputNumber from 'primevue/inputnumber';

export default {
    name: 'CustomInputText',
    components: {
        InputNumber,
    },
    props: {
        modelValue: {
            type: [String,Number, Array, Object],
        },
        label: {
            type: String,
            default: 'text',
        },
        placeholder: {
            type: String,
            default: '',
        },
        isRequired: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'text',
        },
        height: {
            type: String,
            default: '56px',
        },
        style: {
            type: Object,
            default: () => ({}),
        },
        rules: {
            type: Array,
            default: () => [],
        },
        errorMessage:{
            type:String,
            default:''
        },
    },
    data() {
        return {
           errorMessages: null,
        };
    },
    computed: {
        internalInputValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
                this.validate();
            },
        },
    },
    methods: {
        validate() {
            this.errorMessages = null; 

            for (const rule of this.rules) {
                const result = rule(this.internalInputValue);
                if (result !== true) {
                    this.errorMessages = result;
                    break;
                }
            }

            this.$emit('input', this.internalInputValue);
        },
    },
    emits: ['update:modelValue', 'input'],
};
</script>

<style scoped>
.text-red-600 {
    color: #e3342f;
}

.text-sm {
    font-size: 0.875rem;
}

.mt-1 {
    margin-top: 0.25rem;
}
</style>