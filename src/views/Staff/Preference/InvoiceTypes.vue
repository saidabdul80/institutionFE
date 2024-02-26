<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full">
            <Button class="w-[100px] "  v-if="editing" @click="editing=false" name="Listing" />
            <div v-else ></div>
            <Button class="w-[100px] place-self-end" :pt="button" severity="info" type="button" label="Add" icon="fa fa-plus" :@click="load" />            
        </div>                
        <div class="bg-white shadow-lg rounded-2xl">                        
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="invoice_types.data" editMode="row" dataKey="id"
                 scrollable scrollHeight="400px" class="mt-4" 
                 @row-edit-save="updateRecord"
                :virtualScrollerOptions="{ lazy: true, onLazyLoad: false, itemSize: 46, delay: 200, showLoader: true, loading: lazyLoading, numToleratedItems: 10 }">
                <template #header>
                <div style="text-align: left">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                </div>
            </template>
            
            <Column field="payment_name"  style="min-width: 200px" frozen class="font-bold  z-[10]">
                <template #header ><span class="font-bold">Payment Name</span></template>
                <template #editor="{ data, field }" ><Dropdown  v-model="data[field]" :options="paymentTypes" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
            </Column>
            <Column field="programme_type" header="Programme Type" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="programmeTypes" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
            </Column>
            <Column field="session" header="Session" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="sessions" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
            </Column>
            <Column field="semester" header="Semester" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="semesters" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>            
            </Column>
            <Column field="amount" header="Amount" style="min-width: 200px">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>            
            </Column>
            <Column field="level" header="Level" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="levels" optionLabel="title" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>            
            </Column>
            <Column field="programme" header="Programme" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="programmes" optionLabel="name" optionValue="id" placeholder="Select programme Type"></Dropdown></template>            
            </Column>
            <Column field="entry_mode" header="Entry Mode" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="entry_modes" optionLabel="title" optionValue="id" placeholder="Select entry mode Type"></Dropdown></template>            
            </Column>
            <Column field="faculty" header="Faculty" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="faculties" optionLabel="name" optionValue="id" placeholder="Select faculty Type"></Dropdown></template>            
            </Column>
            <Column field="department" header="Department" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" :options="departments" optionLabel="name" optionValue="id" placeholder="Select department Type"></Dropdown></template>            
            </Column>
            <Column field="country" header="Country" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" @input="onSelectCountry($event)" filter :options="countries" optionLabel="name" optionValue="id" placeholder="Select country Type"></Dropdown></template>            
            </Column> 
            <Column field="state" header="State" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" filter :options="states" optionLabel="name" optionValue="id" placeholder="Select state Type"></Dropdown></template>            
            </Column>
            <Column field="lga" header="LGA" style="min-width: 200px">
                <template #editor="{ data, field }"><Dropdown v-model="data[field]" filter :options="lgas" optionLabel="name" optionValue="id" placeholder="Select lga Type"></Dropdown></template>            
            </Column>
            <Column frozen :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center" class="bg-white"></Column>
        </DataTable>
        </div>
    </div>
</template>

<script>

import Button from 'primevue/button'; 
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';            
import button from '@/presets/presets/button'
import { get } from '@/api/client'
export default {
    data(){
        return {
            editingRows: [],
            lazyLoading:true,
            paymentTypes:[],
            programmeTypes:[],
            sessions:[],
            semesters:[],
            levels:[],
            programmes:[],
            entry_modes:[],
            states:[],
            countries:[],
            faculties:[],
            departments:[],
            lgas:[],
            invoice_types:[],
            invoice_type:{}
        }
    },
    components:{
        InputText,
        Dropdown,
        Button,
        DataTable,
        Column,
        Row,
        Column,
    },
    methods:{
        async fetchRecords(){
            this.lazyLoading= true;
            const res = await get(this.$endpoints.staff.getInvoiceTypes.url);                       
            this.lazyLoading = false
            this.invoice_types = res
        },
        async updateRecord(event){
            let { newData, index } = event;

            this.invoice_type[index] = newData;
            const res = await post(this.$endpoints.staff.updateInvoiceType, this.invoice_type);                                  
            if(res){
                this.$globals.showMessage(this.$globals.updateMessage)
                return;
            }                        
            this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        async createRecord(){
            const res = await post(this.$endpoints.staff.createInvoiceType, this.invoice_type);                                  
            if(res){
                this.$globals.showMessage(this.$globals.createMessage)
                return;
            }
            this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        async deleteRecord(){
            const res = await post(this.$endpoints.staff.deleteInvoiceType, {id:this.invoice_type?.id});                                  
            if(res){
                this.$globals.showMessage(this.$globals.deleteMessage)
                return;
            }
            this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
        },
        fetchData(){
            getFaculties
            getDepartments
        },
        updateSchoolInfo() {            
            const schoolInfo = this.$globals?.school_info;
            if (schoolInfo) {
                this.paymentTypes = schoolInfo.payment_types || [];
                this.programmeTypes = schoolInfo.programme_types || [];
                this.sessions = schoolInfo.sessions || [];
                this.semesters = schoolInfo.semesters || [];
                this.levels = schoolInfo.levels || [];
                this.programmes = schoolInfo.programmes || [];
                this.entry_modes = schoolInfo.entry_modes || [];
                this.countries = schoolInfo.countries || [];
                this.faculties = schoolInfo.faculties || [];
                this.departments = schoolInfo.departments || [];
            }
        },
        onSelectCountry(e){
            alert(e.target.value)
        }
    },    
    created(){
        this.updateSchoolInfo();
        this.fetchRecords()        
     
    }

}

</script>