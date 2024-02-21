<template>       
<div>
 
    <div class="relative w-full max-w-xs max-h-full mt-[60px]">
        <!-- Modal content -->      
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-3  md:p-3 border-b rounded-t dark:border-gray-600">
                <h3 class="text-md font-medium text-gray-900 dark:text-white">
                    Change Session                   
                </h3>
                
                <button @click="$emit('on-close')" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="top-left-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-3 md:p-3 space-y-4">                
                <dropdown @input="$emit('selected',selectedSession)" v-model="selectedSession" :options="sessions" optionLabel="name" optionValue="id" placeholder="Select Session" class="w-full md:w-14rem" />
            </div>
        </div>
    </div> 
</div>   
</template>
<script>
export default {
    props:['sessions', 'current_session_id'],
  data() {
    return {
      selectedSession: "", // Initialized as an empty string    
    };
  },
  created(){
    this.selectedSession = this.current_session_id
  },

};
</script>
