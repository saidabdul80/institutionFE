<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full" >
            <div></div>
            <Button label="New session" icon="fa fa-plus" @click="openNewSessionDialog" class="p-mb-3 place-self-end" />
        </div>
        <div class="bg-white  relative">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="sessions" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" lazy
                :paginator="true" :rows="6" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateSession">
                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>
                <Column header="Session">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.name }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.name" />
                    </template>
                </Column>                
                <Column :rowEditor="true" style="width: 10%; min-width: 20px" bodyStyle="text-align:center" class="bg-white"></Column>
                <Column style="width: 100px; min-width: 100px" bodyStyle="text-align:center" class="bg-white">
                    <template #body="slotProps">
                        <div class="flex justify-between">
                            <Button
                                :pt="{ root: { class: 'h-8  w-8 rounded-full flex justify-center items-center hover:ring-[green] hover:bg-[green]/25 hover:text-[green] hover:ring-1 ' } }"
                                icon="fa fa-clone" outlined rounded severity="danger"
                                @click="duplicateRecord(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <Dialog header="New session" v-model:visible="newSessionDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="session.name" :class="{ 'p-invalid': validation.name,'w-full':true }" />
                    <small class="p-error" v-if="validation.name">Name is required.</small>
                </div>        
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newSessionDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createSession" />
            </template>
        </Dialog>
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
            sessions: [],
            session: {},
            newSessionDialog: false,
            editSessionDialog: false,
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
            const res = await get(`${this.$endpoints.staff.getAllSessions.url}`);
            this.sessions = res;
            this.tableloading = false;
        },
        async updateSession(event) {
            let { newData, index } = event;
            this.validation = {};                    
            const res = await post(this.$endpoints.staff.updateSession.url, newData);
            if (res) {
                this.fetchRecords();
                this.editSessionDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createSession() {
            this.validation = {};
            if (!this.session.min_score) {
                this.validation.min_score = true;
                return;
            }
            if (!this.session.max_score) {
                this.validation.max_score = true;
                return;
            }
            if (!this.session.grade) {
                this.validation.grade = true;
                return;
            }
            if (!this.session.grade_point) {
                this.validation.grade_point = true;
                return;
            }
            const res = await post(this.$endpoints.staff.createSession.url, this.session);
            this.openNewradingDialog = false
            if (res) {
                this.fetchRecords();
                this.newSessionDialog = false;
                this.$globals.showMessage('session created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create session', 'error');
            }
        },
        async deactivateSession(session) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this session?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateSession.url, { id: session.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('session deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateSession(session) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this session?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateSession.url, { id: session.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('session activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewSessionDialog() {
            this.session = {}; // Reset session object
            this.newSessionDialog = true;
        },
        duplicateRecord(session) {
            this.session = Object.assign({}, session); // Clone session object
            this.newSessionDialog = true;
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
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
  