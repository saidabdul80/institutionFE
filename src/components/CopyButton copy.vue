<template>
    <v-btn icon @click.stop="copyToClipboard" color="transparent" class="ml-0" size="small" variant="flat">
        <v-icon class="tw-text-sm">mdi-content-copy</v-icon>
    </v-btn>
</template>

<script>

import { useNotificationStore } from '@/stores/notification';

export default {
    name: 'CopyIconButton',
    props: {
        text: {
            type: String,
            required: true
        }
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.text).then(() => {                
                const notificationStore = useNotificationStore();
                notificationStore.showNotification({
                    type: 'success',                    
                    message: 'Text Copied',
                });
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });

        }
    }
}
</script>
