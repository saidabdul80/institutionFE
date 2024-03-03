<template>
    <div class="flex align-items-center" :style="{ height: '17px', 'flex-grow': '1', overflow: 'hidden' }">
        <Skeleton :width="w" height="1rem" />
    </div>
</template>

<script>
import Skeleton from 'primevue/skeleton';
    export default {
        components:{
            Skeleton
        },
        props:{
            w:{
                type: String,
                default: '60%'
            }
        }
    }
</script>