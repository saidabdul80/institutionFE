<template>
  <div>
    <Button
        v-if="items.length>1"
      :title="title"
      :prepend-icon="prependIcon"
      rounded="lg"
      size="large"
      :applySpacing="false"
      :class="buttonClasses"
      :style="{width:width}"
      id="menu-activator"
      class="text-capitalize"
    />
    <Button
      v-else
      :title="title"
      :prepend-icon="prependIcon"
      rounded="lg"
      :to="items[0]?.link"
      size="large"
      :applySpacing="false"
      :class="buttonClasses"
      :style="{width:width}"
      id="menu-activator"
      class="text-capitalize"
    />
    <v-menu activator="#menu-activator" v-if="items.length>1">
      <v-list>
        <v-list-item class="ml-3 text-sm">{{ header }}</v-list-item>
        <v-list-item 
          v-for="(item, index) in linkItems" 
          :key="index" 
          :value="index"
          :to="item.link"
          >
          <div class="flex">
            <v-list-item-title class="my-auto ml-3 mr-14">{{ item.title }}</v-list-item-title>
            <v-radio :value="item" />
          </div>
        </v-list-item>
        <v-list-item v-for="(item, index) in unLinkItems" :key="index" :value="index" @click="$emit('onClick', item.title)">
          <div class="flex">
            <v-list-item-title class="my-auto ml-3 mr-14">{{ item.title }}</v-list-item-title>
            <v-radio :value="item" />
          </div>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { computed } from 'vue';
import Button from '@/components/button/Button.vue';
import { useConstantsStore } from '@/stores/constants'
import { PhNotePencil, PhTable } from "@phosphor-icons/vue";

export default {
  components:{
      Button,
      PhNotePencil,
      PhTable
  },
  props: {
      header:{
          type:String,
          default: 'Add Header Title',
          
      },
    title: {
      type: String,
      required: true,
    },
    prependIcon: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
    width:{
      default:'160px !important'
    }
  },
  data(){
    return {
      chooseMethodDialog: false,
      uploadDialog: false,
    }
  },
  created(){
  
  },
  methods: {
  },
  computed:{
    buttonClasses (){
      const constantsStore = useConstantsStore();
    return `text-[${constantsStore.values.light}] bg-[${constantsStore.values.primary}] `
    },
    linkItems() {return this.items.filter(x => x.link != null )},
    unLinkItems(){return  this.items.filter(x => x.link == null )}
  },
};
</script>

<style scoped></style>