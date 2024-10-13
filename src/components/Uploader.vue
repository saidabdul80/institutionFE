<template>
    <div class="max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow-sm">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ title }}</h2>
            <p class="text-gray-500 mb-4">{{ description }}</p>

            <div @drop.prevent="handleFileDrop" @dragover.prevent
                :class="errorMessage ? 'border-red-500' : 'border-gray-300'"
                class="border-2 flex justify-center flex-col items-center border-dashed  rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <input type="file" :accept="acceptedFormats" @change="handleFileUpload" class="hidden"
                    ref="fileInput" />
                <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.3889 17.1667L28.7222 6.5M39.3889 17.1667V31.3889C39.3889 35.3162 36.2051 38.5 32.2778 38.5H21.6111C17.6838 38.5 14.5 35.3162 14.5 31.3889V13.6111C14.5 9.68375 17.6838 6.5 21.6111 6.5H28.7222M39.3889 17.1667H32.2778C30.3141 17.1667 28.7222 15.5748 28.7222 13.6111V6.5M26.9444 31.3889L26.9444 22.5M26.9444 22.5L30.5 26.0556M26.9444 22.5L23.3889 26.0556"
                        stroke="#ABACA8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <p class="text-gray-600">
                    <span class="text-green-600 cursor-pointer" @click="triggerFileInput">
                        {{ buttonText }}
                    </span>
                    or drag and drop
                </p>
                <p class="text-gray-400 text-sm">{{ fileHint }}</p>
                <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
                <p v-if="selectedFileName" class="text-gray-600 mt-4">Selected file: {{ selectedFileName }}</p>
                <img v-if="filePreview" :src="filePreview" alt="File Preview" class="mt-4 max-h-48 object-contain" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: '',
        },
        acceptedFormats: {
            type: String,
            default: ".csv, .xlsx",
        },
        maxFileSize: {
            type: Number,
            default: 10485760, // 10MB
        },
        buttonText: {
            type: String,
            default: "Browse file",
        },
        fileHint: {
            type: String,
            default: "Only .CSV or .XLSX of up to 10MB",
        },
        errorMessages: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            selectedFileName: '',
            filePreview: '',
            errorMessage: '',
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.uploadFile(file);
        },
        handleFileDrop(event) {
            const file = event.dataTransfer.files[0];
            this.uploadFile(file);
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        uploadFile(file) {
            if (file && this.isValidFile(file)) {
                this.errorMessage = '';
                this.selectedFileName = file.name;
                this.createFilePreview(file);
                this.$emit('file-selected', file);
            }
        },
        isValidFile(file) {
            if (file.size > this.maxFileSize) {
                this.errorMessage = 'File size exceeds the maximum limit.';
                return false;
            }
            if (!this.isValidFormat(file)) {
                this.errorMessage = 'Invalid file format.';
                return false;
            }
            return true;
        },
        isValidFormat(file) {
            const acceptedFormatsArray = this.acceptedFormats.split(',').map(format => format.trim());
            return acceptedFormatsArray.some(format => file.name.endsWith(format));
        },
        createFilePreview(file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.filePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.filePreview = '';
            }
        }
    },
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
