<template>
  <div class="tw-border tw-border-gray-200 tw-rounded-lg">
    <div v-for="i in count" :key="i" class="tw-p-2 tw-border-b tw-border-gray-200">
      <div class="tw-flex">
        <div v-for="j in columns" :key="j" class="tw-flex-1 tw-p-0">
          <div class="tw-w-20 tw-h-[22px] tw-bg-gray-300 tw-animate-pulse"></div>
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
