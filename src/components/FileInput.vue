<template>

  <label :class="`text-[${$constants.neutral}] font-semibold`">
    {{ outerLabel }}
  </label>
  
  <div v-if="isUrl || disabled" class="flex  border rounded-md items-center py-0">
    <div class="text-end font-bold text-green-900 hover:text-green-700 ">
      <span class=" px-3">
        {{ title }}:
      </span>
       <v-btn @click="show =true" class="bg-bg-900" variant="text">Preview</v-btn>
    </div>
    <div v-if="!disabled" class="text-end font-bold text-green-900 hover:text-green-700">
    <v-btn v-if="allowEdit" @click="edit" variant="text">Edit</v-btn>
    </div>
  </div>
  <div v-else>
  <v-file-input 

    v-model="file" 
    @change="handleFileChange" 
    :placeholder="placeholder"
    :label="placeholder"
    :single-line="true"
    variant="outlined" 
    :bg-color="$constants.input_background" 
    show-size
    :style="margin?'margin-top:'+margin:''"
    class="fileInput"
    ref="uploaderxd"
    :chips="true"
    :accept="acceptTypes">
    <template v-slot:append>
      <span v-if="append" @click="$refs.uploaderxd.click()" class="p-4 cursor-pointer hover:bg-green-800 hover:text-white transition-all rounded-r-md border border-gray-400 bg-[#CCDFD6] text-green-900">
        Upload
      </span>
    </template>
  </v-file-input>
</div>
  <Dialog modal v-model:visible="show" :draggable="false"
            :pt="{
            root:{class:' border-0 shadow-md z-index-[9101]', style:'z-index:9101'}}" 
             class=" w-[90%] md:w[80%] lg:w-[900px]" :closable="true">
            <template #header>
              <b>
                {{title}}
              </b>
              <div class="text-end font-bold text-green-900 hover:text-green-700">
                <v-btn class="bg-bg-900" @click="zoom(-1)" variant="text" icon="ph ph-magnifying-glass-plus"></v-btn>
                <v-btn  class="bg-bg-900" @click="zoom(1)" variant="text" icon="ph ph-magnifying-glass-minus"></v-btn>
              </div>

            </template>
           
            <iframe v-if="intervalValue && checkFileType == 'pdf'"  :style="iframeStyle" :src="intervalValue" class="w-full" style="height: 70vh; border: none;"></iframe> 
            <div v-else-if="intervalValue && checkFileType == 'image'" 
            :style="iframeStyle" 
            style="height: 70vh;transition: all 0.3s;">
              <img :src="intervalValue" style="width: 100%;">
            </div>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';



export default {
  name: "FileInput",
  components: {
    Dialog,
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    outerLabel: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    allowEdit:{
      type:Boolean,
      default:true
    },
    validFileTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png', 'application/pdf']
    },
    append:{
      type:Boolean,
      default:true
    },
    margin:{
      type:String,
      default:null,
    },
    size:{
      type:String,
      default:'big'
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      show:false,
      file: null,
      old:null,
      width: window.innerWidth,
      height: window.innerHeight,
      zoomSize: 1,
    }
  },

  computed: {
    FieldHeight(){
       return this.size == 'big'? '56px': '38px';
    },
    acceptTypes() {
      return this.validFileTypes.join(',');
    },
    intervalValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    },
    iframeStyle() {
      return {
        // scale: this.zoomSize,
        width: this.width+'px',
        height: this.height+'px',
      };
    },
    isUrl() {
      let url;
      
      try {
        url = new URL(this.intervalValue);
      } catch (_) {
        return false;  
      }

      return url.protocol === "http:" || url.protocol === "https:";
    },
    checkFileType() {
    const imageTypes = /\.(jpg|jpeg|png|gif|bmp|tiff|svg)$/i;
    const pdfType = /\.pdf$/i;
    const docTypes = /\.(doc|docx|xls|xlsx|ppt|pptx)$/i;

    let url = this.intervalValue.split('?')[0];

        if (imageTypes.test(url)) {
          return 'image';
        } else if (pdfType.test(url)) {
          return 'pdf';
        } else if (docTypes.test(url)) {
          return 'document';
        } else {
          return 'unknown';
        }
      }
  },

  methods: {
    edit(){
      this.old = this.intervalValue;
      this.intervalValue = ''
    },
    
    zoom(direction) {
      if (direction === -1) {
        this.zoomSize *= 1.08;
        this.width *=1.08
        this.height *=1.08
      } else {
        this.zoomSize *= 0.9;
        this.width *=0.9
        this.height *=0.8
      }
    },
    handleFileChange() {
      if (this.file) {
        if (this.validFileTypes.includes(this.file.type)) {
          this.intervalValue = this.file;
          this.$emit('file-selected', this.file);
        } else {
          this.file = null;
          alert('Invalid file type. Please select a valid file.');
        }
      }
    }
  }
}
</script>

<style >
.v-input__prepend{
  /* border: 1px solid #D5D5D5 !important;  */
  margin: 0px !important;
}
.v-input--horizontal .v-input__append {
     margin-inline-start: 0px !important; 
}
.fileInput .v-input__control {
  border-top-left-radius: 5px;
  border-color: #D5D5D5;
  border-style: solid;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-left-width: 1px;
  border-bottom-left-radius: 5px;
}
.v-field__field > input, div.v-input__control >.v-field__field, .v-field,.v-field__field,.v-field__input {
  height: v-bind(FieldHeight) !important;
  min-height: v-bind(FieldHeight) !important;
}
</style>
