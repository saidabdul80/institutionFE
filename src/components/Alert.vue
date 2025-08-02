<template>
  <div class="text-center">
    <Dialog @hide="handleCancel" modal :draggable="false"  v-model:visible="internalModel" header="" :style="{ maxWidth: '579px', minWidth:'300px' }" :pt="{root:{class:'px-5'},content:{class:'px-0'}, header:{style:'flex-direction: row-reverse; padding-bottom: 0px;padding-right:0px'}}">
        <div class=" mt-1">
            <div class="pb-6" v-if="imgPath">
                <img :src="getImageUrl()" width="148px" class="mx-auto" />
            </div>
            <div class="pb-3 flex justify-center" v-if="icon">
                <v-icon  class="text-[80px]  mx-auto" :class="icon"> </v-icon>
            </div>
            <h1 class="text-[32px] font-semibold px-2 text-center"
            :class="`text-[${$constants?.secondary}]`">
            {{ title }}</h1>
        </div>

        <p class="text-center pb-6 px-0">{{ text }}</p>
        <template #footer>
        <div
            class="w-full flex"
            :class="
              cancelBtnText && confirmBtnText
                ? 'justify-center gap-x-3'
                : 'justify-center'
            "
          >
         
            <v-btn
              v-if="cancelBtnText"
              @click="handleCancel"
              :class="`text-[${$constants.primary}] border shadow-none border-[${$constants.primary}] h-[48px] w-[45%] bg-[${$constants.primary_light}]`"

            >
              {{ cancelBtnText }}
            </v-btn>
            <v-btn
              v-if="confirmBtnText"
              @click="handleOk"
              :loading="loading"
              :class="`text-[${$constants.light}] h-[48px] w-[45%] bg-[${$constants.primary}]`"
            >
              {{ confirmBtnText }}
            </v-btn>
          </div>
        </template>
    </Dialog>

  </div>
</template>
<script>


import { useGlobalsStore } from '@/stores/globals';
import Dialog from 'primevue/dialog';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    confirmBtnText: {
      type: String,
      default: "Ok",
    },
    viewAssetBtnText: {
      type: String,
      default: "View Asset",
    },
    addNewBtnText: {
      type: String,
      default: "Add New",
    },
    cancelBtnText: {
      type: String,
      default: null,
    },
    prependIcon: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    ShowTwoButton: {
      type: Boolean,
      default: true,
    },
    imgPath: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
        globals:useGlobalsStore()
    };
  },
  computed: {
    internalModel: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    handleOk() {
     // this.internalModel = false;
      this.$emit("confirm", this.text);
      this.globals.handleAlertResponse(true);
    },
    handleCancel(){
        this.$emit("cancelAlert", false);
        this.globals.handleAlertResponse(false);
        this.internalModel = false
    },
    handleViewAsset() {
      this.internalModel = false;
      this.$emit("ViewAsset");
    },
    getImageUrl() {
      return new URL(`../assets/${this.imgPath}`, import.meta.url);
    },
  },
  components:{
    Dialog
  }
};
</script>
