<template>
    <div class="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div class="relative h-[84vh] overflow-y-auto p-5 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div v-for="config in configurations" :key="config.id" class="my-6 hover:bg-sky-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <p class="m-0 w-full grid grid-cols-3">
                <h2 class="font-semibold mb-2 text-lg text-gray-800 dark:text-gray-200 transition-colors duration-200" style="text-transform: capitalize;">Set {{ config.title }}:</h2>
                <InputText v-if="config.field_type=='input'" v-model="config.value" class="w-full" />
                <div v-if="config.field_type=='select'" class="w-full">
                    
                    <Dropdown v-if="config.model.includes('Session') || config.model.includes('AdmissionBatch') || config.model.includes('State') || config.model.includes('Semester') || config.model.includes('ProgrammeType')"                    
                        class="w-full"
                        :options="updateIdToString(config.data)" optionValue="id" optionLabel="name" v-model="config.value" />
                    <Dropdown v-else-if="config.model.includes('Level') || config.model.includes('Course')" 
                        class="w-full"
                        :options="updateIdToString(config.data)" optionValue="id" optionLabel="title" v-model="config.value" />
                    <Dropdown v-else :options="config.data" v-model="config.value"  optionValue="id" optionLabel="name" class="w-full" />
                </div>
                
                <div v-if="config.field_type=='checkbox'">  
                    <div v-if="config.model.includes('Session') || config.model.includes('AdmissionBatch') || config.model.includes('State') || config.model.includes('Semester') || config.model.includes('ProgrammeType')">                        
                        <MultiSelect  
                        optionValue="id" optionLabel="name" 
                        :options="updateConfigData(config)"  v-model="config.value" display="chip" />
                    </div>
                    <MultiSelect v-else-if="config.model.includes('Level') || config.model.includes('Course')" 
                        :options="updateIdToString(config.data)" optionValue="id" optionLabel="title" v-model="config.value" 
                        display="chip"
                        />
                    <MultiSelect v-else :options="config.data" v-model="config.value"
                        display="chip"
                     />
                </div>
                
                <div v-if="config.field_type == 'textarea'" class="flex flex-wrap gap-3" >
                    <Inplace :active="config.closeInline" :closable="true">
                        <template #display>
                            <span v-tooltip.top="'Click to Edit'" > 
                                <span v-if="config.value == ''">Click here to edit</span>
                                <span v-else> {{ stripAndTruncateHtml(config.value) }} ...</span>
                            </span>
                        </template>
                        <template #content>                            
                              <Editor  v-model="config.value"  editorStyle="height: 320px" />
                        </template>
                    </Inplace>
                </div>
                <div v-if="config.field_type == 'radio'" class="flex flex-wrap gap-3">                    
                    <div class="flex items-center" v-for="radio in config.data" :key="radio.name">  
                        <input type="radio" v-model="config.value" :name="config.name" :value="radio.name" />                        
                        <label :for="`${config.name}`" class="ml-2 capitalize">{{ radio.name }}</label>
                    </div>
                </div>
                <div v-if="config.field_type == 'arrange'" class="flex flex-wrap gap-3" >
                    <Inplace  :active="config.closeInline" :closable="true">
                        <template #display>
                            <span v-tooltip.top="'Click to Edit'">{{config.value}} </span></template>
                        <template #content>
                            <AutoComplete  v-model="config.value"  dropdown :suggestions="config.data"  optionLabel="name2"  optionValue="name"  @complete="searchComplete($event, config)"  />
                        </template>
                    </Inplace>
                </div>
                <Button 
                    :label="''" 
                    :pt="{ icon:{class:'ml-1'}, root:{class:'mx-2 hover:bg-sky-500 hover:text-white  p-2 border border-sky-500 text-sky-500 rounded-md  text-sm w-[40px] h-[40px] flex items-center justify-center text-center'}}"
                    :icon="config.saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'" 
                    @click="updateConfiguration(config)"
                ></Button>
            </p>            
        </div>
        </div>
    </div>
</template>
  
<script>
import MultiSelect from 'primevue/multiselect';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { get, post } from '@/api/client';
import { showModal } from '@/plugins/modal';

import Editor from 'primevue/editor';

import Inplace from 'primevue/inplace';

import AutoComplete from 'primevue/autocomplete';

export default {
    data() {
        return {
            configurations: [],
            configuration: {},
            newConfigurationDialog: false,
            editConfigurationDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows:null
        }
    },
    components: {
        Textarea,        
        InputText,    
        AutoComplete,    
        MultiSelect,
        Inplace,
        Editor
        
    },
    methods: {
        stripAndTruncateHtml(html, maxLength = 100) {
            // Remove HTML tags
            const strippedString = html.replace(/<[^>]+>/g, '');
            // Truncate the stripped string
            if (strippedString.length > maxLength) {
                return strippedString.substring(0, maxLength) + '...';
            }
            return strippedString;
        },
        updateConfigData(config) {
            try{

                const updatedData = config.data.map(item => ({
                    ...item,
                    id: item.id.toString(),
                }));           
                if(!Array.isArray(config.value)){
                    config.value = config.value.split(',')
                }         
                return updatedData;            
            }catch(e){
                console.log(e, config.value)
            }
        },
        searchComplete(event,config){
            config.data = config.data.map((item) =>{
                item.name2 = event.query + item.name
                return item;
                });
        },
        updateIdToString(data){
            return data.map(item=> {
               item.id = item.id.toString()
               return item;
            })
        },
        async fetchRecords() {
            this.tableloading = true;
            const res = await get(`${this.$endpoints.staff.getAllConfigurations.url}`);
            this.configurations = res;
            this.tableloading = false;
        },
        async updateConfiguration(config) {            
            config.saving = true;            
            const res = await post(this.$endpoints.staff.saveConfiguration.url, {
                name: config.name,
                value: config.value
            });
            config.saving = false;    
            config.closeInline = false              
            if (res) {                                
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
/*         async createConfiguration() {
            this.validation = {};
            if (!this.configuration.min_score) {
                this.validation.min_score = true;
                return;
            }
            if (!this.configuration.max_score) {
                this.validation.max_score = true;
                return;
            }
            if (!this.configuration.grade) {
                this.validation.grade = true;
                return;
            }
            if (!this.configuration.grade_point) {
                this.validation.grade_point = true;
                return;
            }
            const res = await post(this.$endpoints.staff.createConfiguration.url, this.configuration);
            this.openNewradingDialog = false
            if (res) {
                this.fetchRecords();
                this.newConfigurationDialog = false;
                this.$globals.showMessage('configuration created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create configuration', 'error');
            }
        }, */
        async deactivateConfiguration(configuration) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this configuration?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateConfiguration.url, { id: configuration.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('configuration deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateConfiguration(configuration) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this configuration?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateConfiguration.url, { id: configuration.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('configuration activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewConfigurationDialog() {
            this.configuration = {}; // Reset configuration object
            this.newConfigurationDialog = true;
        },
        duplicateRecord(configuration) {
            this.configuration = Object.assign({}, configuration); // Clone configuration object
            this.newConfigurationDialog = true;
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
  