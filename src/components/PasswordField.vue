<template>
    <div>
        <label :class="[
            'text-base',
            'block',
            'capitalize',
            'font-semibold'
        ]" v-if="label !== ''">
            {{ label }}
            <span v-if="isRequired" class="text-red-600">*</span>
        </label>
        <Password :fluid="true"
            :feedback="false"
            :pt="{ root: { style: 'height:' + height }}"
            v-bind="$attrs" v-model="internalInputValue" :placeholder="placeholder" :disabled="disabled"
            :readonly="readonly" :type="type" :style="style" toggleMask />

        <p v-if="displayedErrorMessage" class="text-red-700 text-xs m-1">
            {{ displayedErrorMessage }}
        </p>
    </div>
</template>

<script>
import Password from 'primevue/password';

export default {
    name: 'CustomPasswordText',
    components: {
        Password,
    },
    props: {
        modelValue: {
            type: [String, Number, Array, Object],
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
            default: '42px',
        },
        style: {
            type: Object,
            default: () => ({}),
        },
        rules: {
            type: Array,
            default: () => [],
        },
        externalErrorMessage: {  // Added prop
            type: String,
            default: null,
        },
    },
    data() {
        return {
            errorMessage: null,
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
        displayedErrorMessage() {
            // Prioritize external error message over internal validation message
            return this.externalErrorMessage || this.errorMessage;
        },
    },
    methods: {
        validate() {
            this.errorMessage = null;

            for (const rule of this.rules) {
                const result = rule(this.internalInputValue);
                if (result !== true) {
                    this.errorMessage = result;
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

.text-xs {
    font-size: 0.75rem;
}

.m-1 {
    margin: 0.25rem;
}
</style>
