<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full">
            <Button class="w-[100px] "  v-if="editing" @click="newRecordDialog=false" name="Listing" />
            <div v-else ></div>
            <Button class="w-[100px] place-self-end" :pt="button" severity="info" type="button" label="Add" icon="fa fa-plus" @click="newRecordDialog = true" />            
        </div>             
        <div class="bg-white  relative">                        
            <DataTable  v-model:filters="filters" ref="dtable" v-model:editingRows="editingRows" :value="programmes.data" editMode="row" dataKey="id" class="w-full mt-4 bg-white rounded-2xl shadow-lg"
                :paginator="true" :rows="6" :totalRecords="programmes.total" :loading="tableloading"    
                lazy paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"            
                @page="onPage($event)" :currentPageReportTemplate="`${programmes.from} to ${programmes.to} of ${programmes.total}`"
                scrollable scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateRecord">
                <template #header>
                <div style="text-align: left" class="inline mr-2">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                </div>
                <IconField iconPosition="left">
                    <i class="fa fa-search absolute top-[20%] left-2 text-gray-400" />
                    <InputText v-model="filters['global'].value" class="pl-7" placeholder="Global Search" />
                </IconField>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>                
                <Column field="name" header="Programme Name" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.name }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.name" /></template>            
                </Column>

                <Column field="code" header="Programme Code" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.code }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.code" /></template>            
                </Column>

                <Column field="maximum_credit_unit" header="Max Credit Unit" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.maximum_credit_unit }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.maximum_credit_unit" /></template>            
                </Column>

                <Column field="minimum_credit_unit" header="Min Credit Unit" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.minimum_credit_unit }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.minimum_credit_unit" /></template>            
                </Column>

                <Column field="max_duration" header="Max Duration" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.max_duration }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.max_duration" /></template>            
                </Column>

                <Column field="duration" header="Duration" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.duration }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.duration" /></template>            
                </Column>
                <Column field="graduation_level_id" header="Graduation Level" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.graduation_level }}</span></template>
                    <template #editor="{ data, field }"><Dropdown :options="levels" optionLabel="title" optionValue="id" v-model="data.graduation_level_id" /></template>            
                </Column>

                <Column field="department_id" header="Department" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.department }}</span></template>
                    <template #editor="{ data, field }"><Dropdown :options="departments" optionLabel="name" optionValue="id" v-model="data.department_id" /></template>            
                </Column>

                <Column field="programme_type_id" header="Programme Type" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.programme_type }}</span></template>
                    <template #editor="{ data, field }"><Dropdown :options="programmeTypes" optionLabel="name" optionValue="id" v-model="data.programme_type_id" /></template>            
                </Column>

                <Column field="entry_mode_id" header="Mode of Entry" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.entry_mode }}</span></template>
                    <template #editor="{ data, field }"><Dropdown :options="entry_modes" optionLabel="title" optionValue="id" v-model="data.entry_mode_id" /></template>            
                </Column>

                <Column field="study_mode" header="Study Mode" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.study_mode }}</span></template>
                    <template #editor="{ data, field }"><Dropdown :options="['Full Time', 'Part Time']" v-model="data.study_mode" /></template>            
                </Column>                
                <Column field="required_subjects" header="Required Subject" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.subjects.join(', ')}}</span></template>
                    <template #editor="{ data, field }"><MultiSelect filter :maxSelectedLabels="1"  :options="subjects" optionLabel="name" optionValue="id"  :class="{'ring-1 ring-[red]':validation?.required_subjects}" class="w-full"  v-model="data.required_subjects"  /></template>            
                </Column>
                <Column field="accepted_grades" header="Accepted Grades" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.accepted_grades }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.accepted_grades" /></template>            
                </Column>

                <Column field="tp_max_carry_over" header="TP Maximum C/O" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.tp_max_carry_over }}</span></template>
                    <template #editor="{ data, field }"><InputText v-model="data.tp_max_carry_over" /></template>            
                </Column>

                <Column field="status" header="Status" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.status }}</span></template>
                    <template #editor="{ data, field }"><Dropdown :options="['Active', 'Inactive']" v-model="data.status" /></template>            
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
                        <label class="block">Programme Name*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.name}" class="w-full"  v-model="programme.name"  />
                        <span class="text-[red]" v-if="validation?.name">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Programme Code*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.code}" class="w-full"  v-model="programme.code"  />
                        <span class="text-[red]" v-if="validation?.code">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Maximum Credit Unit*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.maximum_credit_unit}" class="w-full"  v-model="programme.maximum_credit_unit"  />
                        <span class="text-[red]" v-if="validation?.maximum_credit_unit">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Minimum Credit Unit*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.minimum_credit_unit}" class="w-full"  v-model="programme.minimum_credit_unit"  />
                        <span class="text-[red]" v-if="validation?.minimum_credit_unit">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Maximum duration*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.max_duration}" class="w-full"  v-model="programme.max_duration"  />
                        <span class="text-[red]" v-if="validation?.max_duration">Field is required</span>
                    </div>    
                    <div class="">
                        <label class="block">Duration*</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.duration}" class="w-full"  v-model="programme.duration"  />
                        <span class="text-[red]" v-if="validation?.duration">Field is required</span>
                    </div>                                  
                    <div class="">
                        <label class="block">Graduation Level</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.graduation_level_id}" class="w-full" v-model="programme.graduation_level_id" :options="levels" optionLabel="title" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.graduation_level_id">Field is required</span>
                    </div>        
                    <div class="">
                        <label class="block">Department</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.department_id}" class="w-full" v-model="programme.department_id" @change="onSelectDepartment($event)"  :options="departments" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.department_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Programme Type</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.programme_type_id}" class="w-full" v-model="programme.programme_type_id"  :options="programmeTypes" optionLabel="name" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.programme_type_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Mode of Entry</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.entry_mode_id}" class="w-full" v-model="programme.entry_mode_id" :options="entry_modes" optionLabel="title" optionValue="id" />            
                        <span class="text-[red]" v-if="validation?.entry_mode_id">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Study mode</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.study_mode}" class="w-full" v-model="programme.study_mode" :options="['Full Time', 'Part Time']"  />            
                        <span class="text-[red]" v-if="validation?.study_mode">Field is required</span>
                    </div>
                     <div class="">
                        <label class="block">Required Subjects</label>
                        <MultiSelect filter :maxSelectedLabels="1"  :options="subjects" optionLabel="name" optionValue="id"  :class="{'ring-1 ring-[red]':validation?.required_subjects}" class="w-full"  v-model="programme.required_subjects"  />
                        <span class="text-[red]" v-if="validation?.required_subjects">Field is required</span>
                    </div>  
                    <div class="">
                        <label class="block">Accepted Grades* <code>A,B,C</code> </label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.accepted_grades}" class="w-full"  v-model="programme.accepted_grades"  />
                        <span class="text-[red]" v-if="validation?.accepted_grades">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">TP Maximum C/O</label>
                        <InputText  :class="{'ring-1 ring-[red]':validation?.tp_max_carry_over}" class="w-full"  v-model="programme.tp_max_carry_over"  />
                        <span class="text-[red]" v-if="validation?.tp_max_carry_over">Field is required</span>
                    </div> 
                    <div class="">
                        <label class="block"> Status</label>
                        <Dropdown :class="{'ring-1 ring-[red]':validation?.status}" class="w-full" v-model="programme.status" :options="['Active','Inactive']" />            
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

import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button'; 
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';            
import Tag from 'primevue/Tag'
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { get,post } from '@/api/client'
import { showModal } from '@/plugins/modal'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
export default {
    data(){
        return {            
            filters:{ global: { value: null}},
            size: { label: 'small', value: 'null' },
            editingRows: [],
            lazyLoading:true,            
            programmeTypes:[],
            sessions:[],
            semesters:[],
            levels:[],
            programmes:[],
            entry_modes:[],            
            departments:[],
            lgas:[],
            programmes:[],
            programme:{},  
            Dropdownloading:false,            
            tableloading:true,
            dataTableloading:false,
            newRecordDialog:false,
            validation:{},
            subjects:[]
        }
    },
    components:{MultiSelect,Toast,Tag,InputText,Dropdown,Button,DataTable,Column,Row,Column,SkeletonLoader, InputIcon,IconField},
    methods:{
        async fetchRecords(){
            this.tableloading= true;
            const res = await get(`${this.$endpoints.staff.getProgrammes.url}?paginateBy=6`);                       
            this.tableloading = false
            this.programmes = res
        },
        async fetchDepartments(){

            const res = await get(`${this.$endpoints.staff.getDepartments.url}?withoutPaginate=true`);                       
            if(res){
                console.log(res)
                this.departments = res
            }

        },
        async updateRecord(event){
            let { newData, index } = event;
            this.dataTableloading = true
            const res = await post(this.$endpoints.staff.updateProgramme.url, newData);                                  
            this.dataTableloading = false
            if(res){                
                this.fetchRecords()
                this.$globals.showMessage(this.$globals.updateMessage,'success')
                return;
            }                        
            //this.$globals.showMessage(this.$globals.failMessage,'error')
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');
        },
        async createRecord(){
            this.validation = {}
            if(!this.programme?.name){            
                this.validation.name = true;
                return;
            }            
            if(!this.programme?.code){            
                this.validation.code = true;
                return;
            }            
            if(!this.programme?.maximum_credit_unit){            
                this.validation.maximum_credit_unit = true;                
                return;
            }         
            if(!this.programme?.minimum_credit_unit){            
                this.validation.minimum_credit_unit = true;                
                return;
            }         
            if(!this.programme?.max_duration){            
                this.validation.max_duration = true;                
                return;
            }                 
            if(!this.programme?.duration){            
                this.validation.duration = true;
                return;
            }                                    
            if(!this.programme?.department_id){            
                this.validation.department_id = true;
                return;
            }    
            const res = await post(this.$endpoints.staff.createProgramme.url, this.programme);                                  
            this.newRecordDialog=false;
            if(res){
                this.fetchRecords()
                this.$globals.showMessage(this.$globals.createMessage,'success')
                return;
            }
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');            
        },
        async deleteRecord(data){
            const confirm = await showModal({title:'Did you want to Delete',text:'yes to continue', confirmText:'Yes',cancelText:'No'})
            if(!confirm) return;
            const res = await post(this.$endpoints.staff.deleteProgramme, {id:data?.id});                                  
            if(res){
                this.$globals.showMessage(this.$globals.deleteMessage, 'success')
                return;
            }
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');
            //this.$globals.showMessage(this.$globals.failMessage,'error')
        },
        duplicateRecord(data){
            this.programme = data;
            this.newRecordDialog = true
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
        },
        fetchData(){
            //this.getFaculties
        },
        refresh(){
            this.fetchRecords()
        },
        async onPage(e){
            this.dataTableloading = true            
            const page = e.page+1
            const res = await get(this.programmes.path+'?page='+page, true)
            this.programmes = res
            this.dataTableloading = false
        },
        updateSchoolInfo() {            
            const schoolInfo = this.$globals?.school_info;
            if (schoolInfo) {             
                this.programmeTypes = schoolInfo.programme_types || [];
                
                this.semesters = schoolInfo.semesters || [];
                this.levels = schoolInfo.levels || [];                
                this.entry_modes = schoolInfo.entry_modes || [];                
                this.departments = schoolInfo.departments || [];                
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
    async created(){
        this.updateSchoolInfo();
        this.fetchRecords()         
        this.fetchDepartments()   
        const res = await get(this.$endpoints.subjects.url)
        this.subjects = res;
    }
}
</script>