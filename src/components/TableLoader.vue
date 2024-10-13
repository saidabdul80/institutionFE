<template>
  <div class="border border-gray-200 rounded-lg">
    <div v-for="i in count" :key="i" class="p-2 border-b border-gray-200">
      <div class="flex">
        <div v-for="j in columns" :key="j" class="flex-1 p-0">
          <div class="w-20 h-[22px] bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Scoped styles if needed */
</style>
