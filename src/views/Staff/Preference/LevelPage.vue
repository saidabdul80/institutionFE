<template>
    <div>        
        <div class="bg-white  relative">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="levels" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" 
                :paginator="true" :rows="6" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateLevel">
                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>
                <Column header="Level">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.title }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.title" />
                    </template>
                </Column>                
                <Column :rowEditor="true" style="width: 10%; min-width: 20px" bodyStyle="text-align:center" class="bg-white"></Column>              
            </DataTable>
        </div>      
    </div>
</template>
<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';     
import { get, post } from '@/api/client';
import { showModal } from '@/plugins/modal';

export default {
    data() {
        return {
            levels: [],
            level: {},
            newLevelDialog: false,
            editLevelDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows:null
        }
    },
    components: {
        InputText,
        Button,
        DataTable,
        Column, 
        Row       
    },
    methods: {
        async fetchRecords() {
            this.tableloading = true;
            const res = await get(`${this.$endpoints.staff.getLevels.url}`);
            this.levels = res;
            this.tableloading = false;
        },
        async updateLevel(event) {
            let { newData, index } = event;
            this.validation = {};                    
            const res = await post(this.$endpoints.staff.updateLevel.url, newData);
            if (res) {
                this.fetchRecords();
                this.editLevelDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        refresh(){            
            this.fetchRecords()
        },
    },
    created() {
        this.fetchRecords();
    }
}
</script>
  
<style scoped>
/* Add your styles here */
</style>
  