<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full" >
            <div></div>
            <Button label="New grading" icon="fa fa-plus" @click="openNewGradingDialog" class="p-mb-3 place-self-end" />
        </div>
        <div class="bg-white  relative">
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="gradings.data" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" lazy
                :paginator="true" :rows="6" :totalRecords="gradings.total" :loading="tableloading"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                @page="onPage($event)" :currentPageReportTemplate="`${gradings.from} to ${gradings.to} of ${gradings.total}`" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateGrading">
                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>
                <Column header="Grade">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.grade }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.grade" />
                    </template>
                </Column>
                <Column header="Minimum Score">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.min_score }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.min_score" />
                    </template>
                </Column>
                <Column header="Maximum Score">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.max_score }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.max_score" />
                    </template>
                </Column>
                <Column header="Grade Point">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.grade_point }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.grade_point" />
                    </template>
                </Column>
                <Column header="Status">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status"
                            :severity="$globals.getStatus(slotProps.data.status, 'pass')" />
                    </template>
                    <template #editor="{ data, field }">
                        <Dropdown v-model="data.status" :options="['pass', 'fail']" placeholder="Change Status ">
                        </Dropdown>
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
        <Dialog header="New grading" v-model:visible="newGradingDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Name</label>
                    <InputText id="name" v-model="grading.name" :class="{ 'p-invalid': validation.name,'w-full':true }" />
                    <small class="p-error" v-if="validation.name">Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="abbr">Abbreviation</label>
                    <InputText id="abbr" v-model="grading.abbr" :class="{ 'p-invalid': validation.abbr,'w-full':true }" />
                    <small class="p-error" v-if="validation.abbr">Abbreviation is required.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newGradingDialog = false" class="p-button-text" />
                <Button label="Save" icon="pi pi-check" @click="createGrading" />
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
            gradings: [],
            grading: {},
            newGradingDialog: false,
            editGradingDialog: false,
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
            const res = await get(`${this.$endpoints.staff.getGradings.url}`);
            this.gradings = res;
            this.tableloading = false;
        },
        async updateGrading(event) {
            let { newData, index } = event;
            this.validation = {};                    
            const res = await post(this.$endpoints.staff.updateGrading.url, newData);
            if (res) {
                this.fetchRecords();
                this.editGradingDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createGrading() {
            this.validation = {};
            if (!this.grading.min_score) {
                this.validation.min_score = true;
                return;
            }
            if (!this.grading.max_score) {
                this.validation.max_score = true;
                return;
            }
            if (!this.grading.grade) {
                this.validation.grade = true;
                return;
            }
            if (!this.grading.grade_point) {
                this.validation.grade_point = true;
                return;
            }
            const res = await post(this.$endpoints.staff.createGrading.url, this.grading);
            this.openNewradingDialog = false
            if (res) {
                this.fetchRecords();
                this.newGradingDialog = false;
                this.$globals.showMessage('grading created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create grading', 'error');
            }
        },
        async deactivateGrading(grading) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this grading?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateGrading.url, { id: grading.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('grading deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateGrading(grading) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this grading?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateGrading.url, { id: grading.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('grading activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewGradingDialog() {
            this.grading = {}; // Reset grading object
            this.newGradingDialog = true;
        },
        duplicateRecord(grading) {
            this.grading = Object.assign({}, grading); // Clone grading object
            this.newGradingDialog = true;
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
  