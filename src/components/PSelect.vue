<template>
    <div :class="[label !== ''?'relative w-full gTextField' : 'block']">
        <label :class="`font-semibold block truncate text-gray-700`" v-if="label !== ''">
            {{ label }}
            <span v-if="isRequired" :class="`text-red-600`">*</span>
        </label>
        <MultiSelect v-if="multiple" class="w-full h-[56px]" ref="multiselect1"
        :class="!errorMessages || !errorMessages?.length > 0 ?
             'h-[' + xheight + ']' + 'border-red-900 border-spacing-1.5'
                : 'h-[' + xheight + ']' + 'border-[#ccc]'"
            v-model="internalValue" :loading="loading" :options="options" :placeholder="placeholder"
            :option-value="optionValue" :option-label="optionLabel" :filter="filterable"
            @update:modelValue="$emit('change', true)" :taggable="true" :disabled="disabled" @open="opened"
            @close="closed">
        </MultiSelect>
        
        <Select v-else v-bind="$props" :filter="selectFilterable"
            v-model="internalValue" ref="listSelect" :pt="{
                overlay: { style: { width: listSelectWidth + 'px' } },
                option: { style: { overflowX: 'none' } },
            }" :class="[!errorMessages || !errorMessages?.length > 0 ? 'h-[' + xheight + '] ' + 'border-spacing-1.5'
                : 'h-[' + xheight + '] ' + '',
                selectType === 'big' ? 'border-[#D5DAE1] w-full' : 'border-[#D5DAE1] w-full',
                roundedBorder?'border-[#ccc]':' border-1 rounded-e-none border-r-0 border-[#374737] ']"
            @update:modelValue="$emit('change', true)" />

        <div class="v-input__details" v-if="errorMessages && errorMessages?.length > 0">
            <p class="text-red-900 mt-0" style="color: #c00000 !important; font-weight: 400">
                {{ formattedErrorMessages }}
            </p>
        </div>
    </div>
</template>
<script>
import MultiSelect from "primevue/multiselect";
import Select from "primevue/select";

export default {
    props: {
        errorMessages: {
            type: [String, Boolean, Array],
            default: [],
        },
        options: {
            type: Array,
            required: true,
        },
        modelValue: {
            type: [Object, String, Number],
            default: null,
        },
        optionLabel: {
            type: String,
            default: "name",
        },
        selectType: {
            type: String,
            default: "big",
            validator(value) {
                return ["big", "slim"].includes(value);
            }
        },
        optionValue: {
            type: String,
            default: "id",
        },
        placeholder: {
            type: String,
            default: "Select Options",
        },
        label: {
            default: "",
        },
        loading: {
            default: false,
        },
        disabled: {
            default: false,
        },
        isRequired: {
            type: Boolean,
            default: false,
        },
        filterable: {
            type: Boolean,
            default: true,
        },
        selectFilterable: {
            type: Boolean,
            default: false,
        },
        roundedBorder: {
            type: Boolean,
            default: true,
        },
        width: {
            type: [String, Boolean],
            default: false,
        },
        height: {
            type: String,
            default: "42px",
        },
        rules: {
            type: [String, Number, Object, Array, null],
            default: [],
        },
        bgClass: {
            type: [String, Boolean],
            default: false,
        },
        appendInnerIcon: {
            type: String,
            default: "",
        },
        appendId: {
            type: String,
            default: "",
        },
        optionText: {
            type: String,
            default: null,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            id: "id",
            placement: "top",
            filterText: "",
            filterTextInDropdown: "",
            dropdownVisible: false,
            selectedOption: this.value,
            filteredOptions: [],
            dropdownDirection: "down",
            value: null,
            dropdownStyle: {},
            isOpen: false,
            borderColor: "",
            listSelectWidth: null,
            xheight: '42px'
        };
    },
    components: {
        MultiSelect,
        Select
    },
    watch: {

    },
    computed: {
        border() {
            const container = document.querySelector(".multiselect__tags");
            let color = "#8d8d8d";
            if (container) {
                if (
                    Array.isArray(this.errorMessages) &&
                    this.errorMessages.length > 0
                ) {
                    color = "#c00000";
                } else if (
                    typeof this.errorMessages === "string" &&
                    this.errorMessages !== ""
                ) {
                    color = "#c00000";
                }
                window.container = container;
                container.style.borderColor = color;
            }

            return color;
        },
        internalValue: {
            get() {
                return this.modelValue

            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
        formattedErrorMessages() {
            if (Array.isArray(this.errorMessages)) {
                return this.errorMessages.join(",").replace("id", " ");
            } else if (
                typeof this.errorMessages === "string" &&
                this.errorMessages.trim() !== ""
            ) {
                return this.errorMessages;
            }
            return "";
        },
    },
    created() {
        this.id = this.appendId + this.generateRandomId();
        if(this.selectType === 'big'){
            this.xheight = this.height
        }else{
           this.xheight = '38px'
        }
       
    },
    methods: {
        updateSelectWidth() {
            if (this.$refs.listSelect) {
                this.listSelectWidth = this.$refs.listSelect.$el.offsetWidth;
            }
        },
        opened(val) {
            this.isOpen = true;
        },
        closed(val) {
            this.isOpen = false;
        },
        generateRandomId(length = 16) {
            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
            }
            return result;
        },
    },

    mounted() {
        this.updateSelectWidth();
        window.addEventListener("resize", this.updateSelectWidth);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateSelectWidth);
    },
};
</script>