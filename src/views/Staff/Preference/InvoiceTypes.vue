<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full">
            <Button class="w-[100px] "  v-if="editing" @click="newRecordDialog=false" name="Listing" />
            <div v-else ></div>
            <Button class="w-[100px] place-self-end" :pt="button" severity="info" type="button" label="Add" icon="fa fa-plus" @click="newRecordDialog = true" />            
        </div>             
        <div class="bg-white  relative">                        
            <DataTable ref="dtable" v-model:editingRows="editingRows" :value="invoice_types.data" editMode="row" dataKey="id" class="w-full mt-4 bg-white rounded-2xl shadow-lg"
                :paginator="true" :rows="6" :totalRecords="invoice_types.total" :loading="tableloading" lazy                    
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"            
                @page="onPage($event)" :currentPageReportTemplate="`${invoice_types.from} to ${invoice_types.to} of ${invoice_types.total}`"
                scrollable scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateRecord">
                <template #header>
                <div style="text-align: left">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>                
                <Column header="Payment Name"  style="min-width: 200px" frozen class="font-bold  z-[10]">                
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.payment_name}}</span></template>
                    <template #editor="{ data, field }"><Dropdown v-model="data.payment_category_id" :options="paymentTypes" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
                </Column>
                <Column header="Name" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.name }}</span></template>
                    <template #editor="{ data, field }"><InputText  v-model="data.name" /></template>            
                </Column>
                <Column header="Programme Type" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.programme_type}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.payment_type_id" :options="programmeTypes" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
                </Column>
                <Column header="Session" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.session}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.session_id" :options="sessions" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>
                </Column>
                <Column header="Semester" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.semester}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.semester_id" :options="semesters" optionLabel="name" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>            
                </Column>
                <Column header="Amount" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ $globals.formatCurrency(slotProps.data.amount)}}</span></template>
                    <template #editor="{ data, field }">                    
                        <InputText  v-model="data.amount" /></template>            
                </Column>
                <Column header="Level" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.level}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.level_id" :options="levels" optionLabel="title" optionValue="id" placeholder="Select Payment Type"></Dropdown></template>            
                </Column>
                <Column v-if="$globals.getConfiguration('enable_faculty')" header="Faculty" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.faculty}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.faculty_id" @change="onSelectFaculty($event)" :options="faculties" optionLabel="name" optionValue="id" placeholder="Select faculty Type"></Dropdown></template>            
                </Column>
                <Column v-if="$globals.getConfiguration('enable_department')" header="Department" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.department}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.department_id" @change="onSelectDepartment($event)"  :options="departments" optionLabel="name" optionValue="id" placeholder="Select department Type"></Dropdown></template>            
                </Column>
                <Column header="Programme" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.programme}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.programme_id"  :options="programmes" optionLabel="name" optionValue="id" placeholder="Select programme Type"></Dropdown></template>            
                </Column>
                <Column v-if="$globals.getConfiguration('enable_entry_mode')" header="Entry Mode" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.entry_mode}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.entry_mode_id" :options="entry_modes" optionLabel="title" optionValue="id" placeholder="Select entry mode Type"></Dropdown></template>            
                </Column>
                <Column header="Country" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.country}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.country_id" @change="onSelectCountry($event)" filter :options="countries" optionLabel="name" optionValue="id" placeholder="Select country Type"></Dropdown></template>            
                </Column> 
                <Column header="State" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.state}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.state_id" @click="loadStates(null,data)" @change="onSelectState($event)" :loading="Dropdownloading" filter :options="states" optionLabel="name" optionValue="id" placeholder="Select state Type"></Dropdown></template>            
                </Column>
                <Column header="LGA" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.lga}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.lga_id" @click="loadLgas(null,data)" :loading="Dropdownloading" filter :options="lgas" optionLabel="name" optionValue="id" placeholder="Select lga Type"></Dropdown></template>            
                </Column>
                <Column header="Owner Type" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.owner_type}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.owner_type" :options="['applicant', 'student']"  placeholder="Change owner Type"></Dropdown></template>            
                </Column>
                <Column header="Status">
                    <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="$globals.getStatus(slotProps.data.status,'Active')" /></template><template #editor="{ data, field }">                    
                        <Dropdown  v-model="data.status" :options="['Active','Inactive']" placeholder="Change Status "></Dropdown></template>            
                </Column>
                <Column  :rowEditor="true" style="width: 10%; min-width: 20px" bodyStyle="text-align:center" class="bg-white"></Column>
                <Column  style="width: 100px; min-width: 100px" bodyStyle="text-align:center" class="bg-white">
                    <template #body="slotProps" >
                        <div class="flex justify-between">
                            <Button :pt="{root:{class:'h-8  w-8 rounded-full flex justify-center items-center hover:ring-[green] hover:bg-[green]/25 hover:text-[green] hover:ring-1 '}}" icon="fa fa-clone" outlined rounded severity="danger" @click="duplicateRecord(slotProps.data)" />
                            <Button :pt="{root:{class:'h-8 w-8 rounded-full justify-center flex items-center  hover:ring-[red] hover:bg-[red]/25 hover:text-[red] hover:ring-1' }}" icon="fa fa-trash" outlined rounded severity="danger" @click="deleteRecord(slotProps.data)" />
                        </div>
                    </template>    
                </Column>
        </DataTable>
        </div>
        <Dialog v-model:visible="newRecordDialog" class="w-[45%]" header="Confirm" :modal="true">
            <template #header>
                <h3 class="text-lg font-bold">Create New Record</h3>
            </template>
            <div class="confirmation-content grid grid-cols-2 gap-4">                
                    <div class="">
                        <label class="block">Payment Type*</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.payment_category_id}" class="w-full" v-model="invoice_type.payment_category_id" :options="paymentTypes" optionLabel="name" optionValue="id" />
                        <span class="text-[red]" v-if="validation?.payment_category_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Name*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.name}" class="w-full"  v-model="invoice_type.name"  />
                        <span class="text-[red]" v-if="validation?.name">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Amount*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.amount}" class="w-full"  v-model="invoice_type.amount"  />
                        <span class="text-[red]" v-if="validation?.amount">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Programme</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.payment_type_id}" class="w-full" v-model="invoice_type.payment_type_id" :options="programmeTypes" optionLabel="name" optionValue="id" />
                        <span class="text-[red]" v-if="validation?.payment_type_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Session*</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.session_id}" class="w-full" v-model="invoice_type.session_id" :options="sessions" optionLabel="name" optionValue="id" />
                        <span class="text-[red]" v-if="validation?.session_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Semester</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.semester_id}" class="w-full" v-model="invoice_type.semester_id" :options="semesters" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.semester_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Level</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.level_id}" class="w-full" v-model="invoice_type.level_id" :options="levels" optionLabel="title" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.level_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Faculty</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.faculty_id}" class="w-full" v-model="invoice_type.faculty_id" @change="onSelectFaculty($event)" :options="faculties" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.faculty_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Department</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.department_id}" class="w-full" v-model="invoice_type.department_id" @change="onSelectDepartment($event)"  :options="departments" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.department_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Programme Type</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.programme_id}" class="w-full" v-model="invoice_type.programme_id"  :options="programmes" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.programme_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Mode of Entry</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.entry_mode_id}" class="w-full" v-model="invoice_type.entry_mode_id" :options="entry_modes" optionLabel="title" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.entry_mode_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Country</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.country_id}" class="w-full" v-model="invoice_type.country_id" @change="onSelectCountry($event)" filter :options="countries" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.country_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">State</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.state_id}" class="w-full" v-model="invoice_type.state_id" @click="loadStates(null,data)" @change="onSelectState($event)" :loading="Dropdownloading" filter :options="states" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.state_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">LGA</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.lga_id}" class="w-full" v-model="invoice_type.lga_id" @click="loadLgas(null,data)" :loading="Dropdownloading" filter :options="lgas" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.lga_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Owner*</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.owner_type}" class="w-full" v-model="invoice_type.owner_type" :options="['applicant', 'student']"  />            
                        <span class="text-[red]" v-if="validation?.owner_type">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block"> Status</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.status}" class="w-full" v-model="invoice_type.status" :options="['Active','Inactive']" />            
                        <span class="text-[red]" v-if="validation?.status">Field is required</span>
                    </div>
                </div>
        <template #footer>            
            <Button label="Create" icon="pi pi-check" text @click="createRecord" />
        </template>
    </Dialog>    
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
import Tag from 'primevue/Tag'

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { get,post } from '@/api/client'
import { showModal } from '@/plugins/modal'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
export default {
    data(){
        return {            
            size: { label: 'small', value: 'null' },
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
            invoice_type:{},  
            Dropdownloading:false,            
            tableloading:true,
            dataTableloading:false,
            newRecordDialog:false,
            validation:{}
        }
    },
    components:{Toast,Tag,InputText,Dropdown,Button,DataTable,Column,Row,Column,SkeletonLoader},
    methods:{
        async fetchRecords(){
            this.tableloading= true;
            const res = await get(`${this.$endpoints.staff.getInvoiceTypes.url}?paginateBy=6`);                       
            this.tableloading = false
            this.invoice_types = res
        },
        async updateRecord(event){
            let { newData, index } = event;
            this.dataTableloading = true
            const res = await post(this.$endpoints.staff.updateInvoiceType.url, newData);                                  
            this.dataTableloading = false
            if(res){                
                this.fetchRecords()
                this.$globals.showMessage(this.$globals.updateMessage,'success')
                return;
            }                        
            this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        async createRecord(){
            this.validation = {}
            if(!this.invoice_type?.payment_category_id){            
                this.validation.payment_category_id = true;
                return;
            }            
            if(!this.invoice_type?.amount){            
                this.validation.amount = true;
                return;
            }            
            if(!this.invoice_type?.owner_type){            
                this.validation.owner_type = true;
                return;
            }         
            if(!this.invoice_type?.session_id){            
                this.validation.session_id = true;
                return;
            }                        
            const res = await post(this.$endpoints.staff.createInvoiceType.url, this.invoice_type);                                  
            if(res){
                this.fetchRecords()
                this.newRecordDialog=false;
                this.$globals.showMessage(this.$globals.createMessage,'success')
                return;
            }
            this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        async deleteRecord(data){
            const confirm = await showModal({title:'Did you want to Delete',text:'yes to continue', confirmText:'Yes',cancelText:'No'})
            if(!confirm) return;
            const res = await post(this.$endpoints.staff.deleteInvoiceType, {id:data?.id});                                  
            if(res){
                this.$globals.showMessage(this.$globals.deleteMessage, 'success')
                return;
            }
            this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        duplicateRecord(data){
            this.invoice_type = data;
            this.newRecordDialog = true
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
        },
        fetchData(){
            getFaculties
            getDepartments
        },
        refresh(){
            this.fetchRecords()
        },
        async onPage(e){
            this.dataTableloading = true            
            const page = e.page+1
            const res = await get(this.invoice_types.path+'?page='+page, true)
            this.invoice_types = res
            this.dataTableloading = false
        },
        updateSchoolInfo() {            
            const schoolInfo = this.$globals?.school_info;
            if (schoolInfo) {
                this.paymentTypes = schoolInfo.payment_types || [];
                this.programmeTypes = schoolInfo.programme_types || [];
                this.sessions = schoolInfo.sessions || [];
                this.semesters = schoolInfo.semesters || [];
                this.levels = schoolInfo.levels || [];                
                this.entry_modes = schoolInfo.entry_modes || [];
                this.countries = schoolInfo.countries || [];
                this.faculties = schoolInfo.faculties || [];                
            }
        },
        onSelectCountry(e){            
            this.loadStates(e.value)            
        },
        onSelectState(e){        
            this.loadLgas(e.value)
        },
        async loadStates(country_id=null, data= null){                        
            country_id = country_id || data.country_id;
            if (this.states.length > 0 ) return;
            this.Dropdownloading = true;            
            const res = await get(this.$endpoints.getStates.url+'?country_id='+country_id)
            this.Dropdownloading = false            
            if(res){
                this.states = res
            }
        },
        async loadLgas(state_id=null, data= null){
            state_id = state_id || data.state_id;
            if (this.lgas.length > 0) return;
            this.Dropdownloading = true;            
            const res = await get(this.$endpoints.getLgas.url+'?state_id='+state_id)
            this.Dropdownloading = false            
            if(res){
                this.lgas = res
            }
        },      
        onSelectFaculty(e){
            this.departments =  this.departments.filter(department=>department.faculty_id == e.value);
        },
        onSelectDepartment(e){
            this.programmes =  this.$globals.school_info.programmes.filter(programme=>programme.department_id == e.value);
        }
    },    
    created(){
        this.updateSchoolInfo();
        this.fetchRecords()            
    }
}
</script>