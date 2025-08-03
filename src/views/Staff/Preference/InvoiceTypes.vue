<template>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full">
            <Button class="w-[100px] "  v-if="editing" @click="newRecordDialog=false" name="Listing" />
            <div v-else ></div>
            <Button class="w-[100px] place-self-end" :pt="button" severity="info" type="button" label="Add" icon="fa fa-plus" @click="newRecordDialog = true" />            
        </div>             
        <div class="bg-white relative">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-900">Invoice Types</h2>
                <div class="flex space-x-3">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)"
                            class="bg-gray-500 hover:bg-gray-600 text-white" />
                    <Button @click="refresh()" type="button" icon="fa fa-refresh"
                            class="bg-blue-500 hover:bg-blue-600 text-white" />
                </div>
            </div>
            <div class="p-6">
                <Table
                    :headers="invoiceTypeHeaders"
                    :paginationData="invoiceTypesPagination"
                    :loading="tableloading"
                    :showPagination="true"
                    @page-change="handlePageChange"
                    @page-length="handlePageLength">

                    <!-- Payment Name Column -->
                    <template #td-payment_name="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <Dropdown v-model="row.payment_category_id" :options="paymentTypes"
                                     optionLabel="name" optionValue="id" placeholder="Select Payment Type" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else class="font-medium">{{ row.payment_name }}</span>
                        </div>
                    </template>

                    <!-- Name Column -->
                    <template #td-name="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <InputText v-model="row.name" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else>{{ row.name }}</span>
                        </div>
                    </template>

                    <!-- Programme Type Column -->
                    <template #td-programme_type="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <Dropdown v-model="row.payment_type_id" :options="programmeTypes"
                                     optionLabel="name" optionValue="id" placeholder="Select Payment Type" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else>{{ row.programme_type }}</span>
                        </div>
                    </template>

                    <!-- Session Column -->
                    <template #td-session="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <Dropdown v-model="row.session_id" :options="sessions"
                                     optionLabel="name" optionValue="id" placeholder="Select Session" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else>{{ row.session }}</span>
                        </div>
                    </template>

                    <!-- Semester Column -->
                    <template #td-semester="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <Dropdown v-model="row.semester_id" :options="semesters"
                                     optionLabel="name" optionValue="id" placeholder="Select Semester" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else>{{ row.semester }}</span>
                        </div>
                    </template>

                    <!-- Amount Column -->
                    <template #td-amount="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <InputText v-model="row.amount" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else class="font-semibold text-green-600">{{ $globals.formatCurrency(row.amount) }}</span>
                        </div>
                    </template>

                    <!-- Level Column -->
                    <template #td-level="{ row }">
                        <div v-if="editingRows && editingRows[row.id]">
                            <Dropdown v-model="row.level_id" :options="levels"
                                     optionLabel="title" optionValue="id" placeholder="Select Level" class="w-full" />
                        </div>
                        <div v-else>
                            <SkeletonLoader v-if="dataTableloading" />
                            <span v-else>{{ row.level }}</span>
                        </div>
                    </template>
        </Table>
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
                    <div class="" v-if="$globals.getConfiguration('enable_faculty')">
                        <label class="block">Faculty</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.faculty_id}" class="w-full" v-model="invoice_type.faculty_id" @change="onSelectFaculty($event)" :options="faculties" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.faculty_id">Field is required</span>
                    </div>
                    <div v-if="$globals.getConfiguration('enable_department')">
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
import Tag from 'primevue/Tag'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { get,post } from '@/api/client'
import { showModal } from '@/plugins/modal'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import Table from '@/components/Table.vue'
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
    components:{Toast,Tag,InputText,Dropdown,Button,SkeletonLoader},
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