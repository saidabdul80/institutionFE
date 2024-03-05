<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full">
            <Button class="w-[100px] "  v-if="editing" @click="newRecordDialog=false" name="Listing" />
            <div v-else ></div>
            <Button class="w-[100px] place-self-end" :pt="button" severity="info" type="button" label="Add" icon="fa fa-plus" @click="newRecordDialog = true" />            
        </div>             
        <div class="bg-white  relative">                        
            <DataTable  v-model:filters="filters" ref="dtable" v-model:editingRows="editingRows" :value="programmes" editMode="row" dataKey="id" class="w-full mt-4 bg-white rounded-2xl shadow-lg"
                :paginator="true" :rows="6"  :loading="tableloading"                    
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
                </Column>

                <Column field="code" header="Programme Code" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.code }}</span></template>                
                </Column>            

                <Column field="courses_codes" header="Courses" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>
                        
                        <div class="overflow-x-auto w-[200px] " v-tooltip.focus.top="'Double click to remove'" tabindex="1" >
                            <Tag 
                            v-for="(course, index) in slotProps.data.courses" 
                            :key="course.programme_course_id" 
                            :icon="loadingStates[course.programme_course_id] ? 'pi pi-spin pi-spinner' : 'pi pi-times-circle'" 
                            class="mx-1 select-none	" 
                            :value="course.code" 
                            severity="secondary" 
                            @dblclick.prevent="removeCourse(slotProps.data, course, index)"
                            ></Tag>
                        </div>
                    </span></template>                 
                </Column>

                <Column field="status" header="Status" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.status }}</span></template>                  
                </Column>              
                <Column  style="width: 100px; min-width: 100px" bodyStyle="text-align:center" class="bg-white">
                    <template #body="slotProps" >
                        <div class="flex justify-between">
                            <Button :pt="{root:{class:'h-8  w-8 rounded-full flex justify-center items-center hover:ring-[green] hover:bg-[green]/25 hover:text-[green] hover:ring-1 '}}" icon="fa fa-clone" outlined rounded severity="danger" @click="duplicateRecord(slotProps.data)" /><!-- 
                            <Button :pt="{root:{class:'h-8 w-8 rounded-full justify-center flex items-center  hover:ring-[red] hover:bg-[red]/25 hover:text-[red] hover:ring-1' }}" icon="fa fa-trash" outlined rounded severity="danger" @click="deleteRecord(slotProps.data)" /> -->
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
                        <label class="block">Programme</label>
                        <Dropdown filter optionValue="id" optionLabel="name" :class="{'ring-1 ring-[red]':validation?.programme_id}" class="w-full" v-model="programmeCourse.programme_id" :options="programmesLists" />            
                        <span class="text-[red]" v-if="validation?.programme_id">Field is required</span>
                    </div>
                     <div class="">
                        <label class="block">Courses</label>
                        <MultiSelect filter :maxSelectedLabels="3"  :options="courses"  optionValue="id" optionLabel="code"  :class="{'ring-1 ring-[red]':validation?.course_ids}" class="w-full"  v-model="programmeCourse.course_ids"  >
                            <template #option="slotProps">
                                {{ slotProps.option.title }} <Tag :value='slotProps.option.code' class="ml-4" severity="warning" />
                            </template>
                        </MultiSelect>
                        <span class="text-[red]" v-if="validation?.course_ids">Field is required</span>
                    </div>
                    <div class="">
                        <label class="block">Level</label>
                        <Dropdown optionValue="id" optionLabel="title" :class="{'ring-1 ring-[red]':validation?.level_id}" class="w-full" v-model="programmeCourse.level_id" :options="levels" />            
                        <span class="text-[red]" v-if="validation?.level_id">Field is required</span>
                    </div>  
                    <div class="">
                        <label class="block">Semester</label>
                        <Dropdown optionValue="id" optionLabel="title" :class="{'ring-1 ring-[red]':validation?.semester_id}" class="w-full" v-model="programmeCourse.semester_id" :options="semesters" />            
                        <span class="text-[red]" v-if="validation?.semester_id">Field is required</span>
                    </div>  
                    <div class="">
                        <label class="block">session</label>
                        <Dropdown optionValue="id" optionLabel="name" :class="{'ring-1 ring-[red]':validation?.session_id}" class="w-full" v-model="programmeCourse.session_id" :options="sessions" />            
                        <span class="text-[red]" v-if="validation?.session_id">Field is required</span>
                    </div>  
                    <div class="d-none">
                        <label class="block">TP</label>
                        <Dropdown  :class="{'ring-1 ring-[red]':validation?.tp}" class="w-full" v-model="programmeCourse.tp" :options="['yes','no']" />            
                        <span class="text-[red]" v-if="validation?.tp">Field is required</span>
                    </div> 
                    <div class="d-none">
                        <label class="block">Special Course</label>
                        <Dropdown  :class="{'ring-1 ring-[red]':validation?.special_course}" class="w-full" v-model="programmeCourse.special_course" :options='["None","All","Blind","Deaf","Dumb","Handicapped","Others"]' />            
                        <span class="text-[red]" v-if="validation?.special_course">Field is required</span>
                    </div> 
                     
                 
                </div>
        <template #footer>            
            <Button label="Add" icon="pi pi-check" text @click="addCourse()" />
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
            loadingStates:{},
            filters:{ global: { value: null}},
            size: { label: 'small', value: 'null' },
            editingRows: [],
            lazyLoading:true,                    
            sessions:[],
            semesters:[],
            levels:[],
            programmes:[],                                    
            programmesLists:[],                                    
            programmeCourse:{},  
            Dropdownloading:false,            
            tableloading:true,
            dataTableloading:false,
            newRecordDialog:false,
            validation:{},            
        }
    },
    components:{MultiSelect,Toast,Tag,InputText,Dropdown,Button,DataTable,Column,Row,Column,SkeletonLoader, InputIcon,IconField},
    methods:{
        async fetchRecords(){
            this.tableloading= true;
            const res = await get(`${this.$endpoints.staff.getProgrammeCourses.url}?session_id=${this.$globals.currentSession()}`);                       
            this.tableloading = false
            this.programmes = res
        },    
        duplicateRecord(data){
            this.programmeCourse.programme_id = data.id;            
            this.programmeCourse.name = data.name;            
            this.newRecordDialog = true
        },
        exportCSV() {
            //console.log(this.$refs.dtable.values())
            this.$refs.dtable.exportCSV();
        },
        fetchData(){
            getFaculties
            getDepartments
        },
        refresh(){
            this.fetchRecords()
        },
        updateSchoolInfo() {            
            const schoolInfo = this.$globals?.school_info;
            if (schoolInfo) {                     
                this.programmesLists = schoolInfo.programmes || [];                
                this.semesters = schoolInfo.semesters || [];
                this.sessions = schoolInfo.sessions || [];
                this.levels = schoolInfo.levels || [];                
                this.entry_modes = schoolInfo.entry_modes || [];                
                this.departments = schoolInfo.departments || [];                
            }
        },
        async removeCourse(programe,course,index){            
            this.loadingStates[course.programme_course_id]= true;
            const res = await post(this.$endpoints.staff.unassignProgrammeCourse.url,{ids:[course.programme_course_id]})                
            this.loadingStates[course.programme_course_id] = false;
            if(res){                
                programe.courses.splice(index, 1);                
                this.$globals.showMessage(course.code +' course removed from '+programe.name, 'success')
                return;
            }
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');        
        },
        async addCourse(){            
            this.newRecordDialog = false
            this.dataTableloading = true     
            const name = this.programmeCourse.name;
            delete this.programmeCourse.name;       
            const res = await post(this.$endpoints.staff.assignProgrammeCourse.url,this.programmeCourse)    
            this.dataTableloading = false
            //console.log(res,3333333333333);
            if(res){
                this.$globals.showMessage('Courses added to '+name+' successfuly', 'success')
                this.fetchRecords()
                return;
            }
            const err = localStorage.getItem('error');
            this.$globals.showMessage(err, 'error');        
        }
    },    
    async created(){
        this.updateSchoolInfo();
        this.fetchRecords()            
        const res = await get(this.$endpoints.staff.getOpenCourses.url)
        this.courses = res;
    }
}
</script>