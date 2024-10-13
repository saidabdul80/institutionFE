<template>
  <div :style="{ width: width, height: height }" :class="customClass"></div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '56px' 
    },
    customClass: {
      type: String,
      default: 'bg-gray-200 rounded-md animate-pulse'
    }
  }
};
</script>

<style>
</style>
