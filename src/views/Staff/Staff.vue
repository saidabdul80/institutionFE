<template>
    <div>
        <div class="grid grid-cols-2 gap-4 place-content-between w-full" >
            <div></div>
            <Button label="New staff" icon="fa fa-plus" @click="openNewStaffDialog" class="p-mb-3 place-self-end" />
        </div>
        <div class="bg-white  relative">
            <DataTable v-model:expandedRows="expandedRows" ref="dtable" v-model:editingRows="editingRows" :value="staffs.data" editMode="row" dataKey="id"
                class="w-full mt-4 bg-white rounded-2xl shadow-lg" lazy
                @rowExpand="onRowExpand"
                :paginator="true" :rows="6" :totalRecords="staffs.total" :loading="tableloading"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                @page="onPage($event)" :currentPageReportTemplate="`${staffs.from} to ${staffs.to} of ${staffs.total}`" scrollable
                scrollHeight="400px" style="position:absolute !important; min-height: 70vh;" @row-edit-save="updateStaff">
                <template #header>
                    <div class="flex justify-between">
                        <div style="text-align: left">
                            <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                        </div>
                        <IconField iconPosition="left">
                            <i class="fa fa-search absolute top-[35%] left-2 text-gray-400" />
                            <InputText v-model="filters['global'].value"  @input="searchStaff($event)" class="pl-7" placeholder="Global Search" />
                        </IconField>
                    </div>
                </template>
                <template #paginatorstart>
                    <Button @click="refresh()" type="button" icon="fa fa-refresh" text />
                </template>
                <Column expander style="width: 5rem" />
                <Column header="Staff Number" field="staff_number">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.staff_number }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.staff_number" />
                    </template>
                </Column>
                <Column header="First Name" field="first_name">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.first_name }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.first_name" />
                    </template>
                </Column>
                <Column header="Middle name" field="middle_name">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.middle_name }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.middle_name" />
                    </template>
                </Column>
                <Column header="Surname" field="surname">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.surname }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.surname" />
                    </template>
                </Column>
                <Column header="Gender" field="gender">                    
                    <template #editor="{ data, field }">
                        <Dropdown v-model="data.gender" :options="['male', 'female']" placeholder="gender ">
                        </Dropdown>
                    </template>
                </Column>
                <Column header="Phone Number">
                    <template #body="slotProps">
                        <SkeletonLoader v-if="dataTableloading" /><span v-else>{{ slotProps.data.phone_number }}</span>
                    </template>
                    <template #editor="{ data, field }">
                        <InputText v-model="data.phone_number" />
                    </template>
                </Column>        
                <Column v-if="$globals.getConfiguration('enable_faculty')" header="Faculty" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.faculty}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.faculty_id" @change="onSelectFaculty($event)" :options="faculties" optionLabel="name" optionValue="id" placeholder="Select faculty Type"></Dropdown></template>            
                </Column>
                <Column v-if="$globals.getConfiguration('enable_department')" header="Department" style="min-width: 200px">
                    <template #body="slotProps"><SkeletonLoader v-if="dataTableloading" /><span v-else>{{slotProps.data.department}}</span></template>
                    <template #editor="{ data, field }"><Dropdown  v-model="data.department_id"  :options="departments" optionLabel="name" optionValue="id" placeholder="Select department Type"></Dropdown></template>
                </Column>
                <Column header="Roles & Permissions" style="min-width: 250px">
                    <template #body="slotProps">
                        <div class="flex flex-col gap-2">
                            <div class="flex flex-wrap gap-1">
                                <Tag v-for="role in slotProps.data.roles" :key="role.id"
                                     :value="role.name"
                                     :severity="getRoleSeverity(role.name)"
                                     class="text-xs" />
                                <span v-if="!slotProps.data.roles || slotProps.data.roles.length === 0"
                                      class="text-xs text-gray-400">No roles assigned</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-1 text-xs text-gray-500">
                                    <i class="fa fa-key"></i>
                                    <span>{{ slotProps.data.all_permissions ? slotProps.data.all_permissions.length : 0 }} permissions</span>
                                </div>
                                <div class="flex gap-1">
                                    <Button
                                        v-tooltip.top="'Manage Roles'"
                                        icon="fa fa-users-cog"
                                        size="small"
                                        outlined
                                        severity="info"
                                        @click="openRoleManagementModal(slotProps.data)"
                                        class="h-6 w-6 text-xs" />
                                    <Button
                                        v-tooltip.top="'Manage Permissions'"
                                        icon="fa fa-key"
                                        size="small"
                                        outlined
                                        severity="secondary"
                                        @click="openPermissionManagementModal(slotProps.data)"
                                        class="h-6 w-6 text-xs" />
                                </div>
                            </div>
                        </div>
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 20px" v-tooltip.top="'Edit'" bodyStyle="text-align:center" class="bg-white"></Column>
                <Column style="width: 100px; min-width: 100px" bodyStyle="text-align:center" class="bg-white">
                    <template #body="slotProps">
                        <div class="flex justify-between">
                            
                            <Button
                                v-tooltip.top="'reset password'"
                                :pt="{ root: { class: 'h-8  w-8 rounded-full flex justify-center items-center hover:ring-[green] hover:bg-[green]/25 hover:text-[green] hover:ring-1 ' } }"
                                outlined rounded severity="danger"
                                :icon="loadingStates[slotProps.data.id] ? 'pi pi-spin pi-spinner' : 'pi pi-key'" 
                                @click="resetPassword(slotProps.data)" />
                            <Button
                                v-tooltip.top="'Clone staff'"
                                :pt="{ root: { class: 'h-8  w-8 rounded-full flex justify-center items-center hover:ring-[green] hover:bg-[green]/25 hover:text-[green] hover:ring-1 ' } }"
                                icon="fa fa-clone" outlined rounded severity="danger"
                                @click="duplicateRecord(slotProps.data)" />
                        </div>
                    </template>
                </Column>
                <!-- <template #expansion="slotProps">
                    <div class="p-3">                                            
                        <div class="grid grid-col">                            
                            <PickList v-model="staffPermissions[slotProps.data.staff_number]"  listStyle="height:342px" dataKey="name" breakpoint="1400px"
                            @move-to-source="unassignPermission" @move-all-to-source="unassignPermission" @move-all-to-target="assignPermission" @move-to-target="assignPermission"
                            :pt="{sourceControls:{class:'hidden'}, targetControls:{class:'hidden'}}"
                            >                               
                                <template #sourceheader> 
                                    <div class="flex justify-between">
                                        <span class="font-semibold">Unassigned Permisssions </span>
                                        <span class="font-normal text-gray-500">
                                            <input v-model="sourceFilter" placeholder="Search..." @input="applyFilter($event)" class="p-inputtext border p-component">
                                        </span>
                                    </div>
                                 </template>
                                <template #targetheader> 
                                    <div class="flex justify-between">
                                        <span class="font-semibold">Assigned Permisssions</span>
                                        <span class="font-normal text-gray-500">
                                            <input v-model="targetFilter" placeholder="Search..." @input="applyFilter($event)" class="p-inputtext border p-component">
                                        </span>
                                    </div>
                                </template>
                                <template #item="slotProps2">                                    
                                    <div class="flex flex-wrap p-0 align-items-center gap-3">                                        
                                        <div class="flex-1 flex items-center border--2 gap-2">
                                            <i class="pi pi-key"></i>
                                            <span class="text-xs permission">{{ slotProps2.item.name.replaceAll('_', ' ').toUpperCase() }}</span>                                         
                                        </div>                                        
                                    </div>
                                </template>
                            </PickList>
                        </div>
                    </div>
                </template> -->
            </DataTable>
        </div>
        <Dialog header="New staff" v-model:visible="newStaffDialog" class="w-[45%]" :modal="true">
            <div class="p-fluid">
                <div class="p-field mb-3">
                    <label for="name">Email</label>
                    <InputText id="name" v-model="staff.email" :class="{ 'p-invalid': validation.email,'w-full':true }" />
                    <small class="p-error" v-if="validation.email">Email is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="name">First Name</label>
                    <InputText id="name" v-model="staff.first_name" :class="{ 'p-invalid': validation.first_name,'w-full':true }" />
                    <small class="p-error" v-if="validation.first_name">First Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="name">Middle Name</label>
                    <InputText id="name" v-model="staff.middle_name" :class="{ 'p-invalid': validation.middle_name,'w-full':true }" />
                    <small class="p-error" v-if="validation.middle_name">Middle Name is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="name">Surname</label>
                    <InputText id="name" v-model="staff.surname" :class="{ 'p-invalid': validation.surname,'w-full':true }" />
                    <small class="p-error" v-if="validation.surname">surname is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="name">Gender</label>
                    <Dropdown v-model="staff.gender" :options="['male', 'female']" placeholder="gender ">
                        </Dropdown>
                    <small class="p-error" v-if="validation.gender">Gender is required.</small>
                </div>                
                <div class="p-field mb-3">
                    <label for="abbr">Phone Number</label>
                    <InputText id="abbr" v-model="staff.phone_number" :class="{ 'p-invalid': validation.phone_number,'w-full':true }" />
                    <small class="p-error" v-if="validation.phone_number">Phone Number is required.</small>
                </div>
                <div class="p-field mb-3">
                    <label for="name">Type</label>
                    <Dropdown v-model="staff.type" :options="['academic', 'non-academic']" placeholder="Type ">
                        </Dropdown>
                    <small class="p-error" v-if="validation.type">Type is required.</small>
                </div>
                <div class="" v-if="$globals.getConfiguration('enable_faculty')">
                    <label class="block">Faculty</label>
                    <Dropdown :class="{'ring-1 ring-[red]':validation?.faculty_id}" class="w-full" v-model="staff.faculty_id" @change="onSelectFaculty($event)" :options="faculties" optionLabel="name" optionValue="id" />            
                    <span class="text-[red]" v-if="validation?.faculty_id">Field is required</span>
                </div>
                <div class="" v-if="$globals.getConfiguration('enable_department')">
                    <label class="block">Department</label>
                    <Dropdown :class="{'ring-1 ring-[red]':validation?.department_id}" class="w-full" v-model="staff.department_id"  :options="departments" optionLabel="name" optionValue="id" />            
                    <span class="text-[red]" v-if="validation?.department_id">Field is required</span>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="newStaffDialog = false" class="p-button-text" />
                <Button label="Save"
                :disabled="savingState"
                :icon="savingState ? 'pi pi-spin pi-spinner' : 'pi pi-check'" 
                @click="createStaff" />
            </template>
        </Dialog>

        <!-- Role Management Modal -->
        <Dialog header="Manage Staff Roles" v-model:visible="roleManagementModal" class="w-[60%]" :modal="true">
            <div v-if="selectedStaff" class="p-fluid">
                <div class="mb-4">
                    <h4 class="text-lg font-semibold mb-2">{{ selectedStaff.full_name }}</h4>
                    <p class="text-sm text-gray-600">{{ selectedStaff.email }} • {{ selectedStaff.staff_number }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Available Roles -->
                    <div>
                        <h5 class="font-semibold mb-3 flex items-center gap-2">
                            <i class="fa fa-users"></i>
                            Available Roles
                        </h5>
                        <div class="space-y-2 max-h-80 overflow-y-auto">
                            <div v-for="role in availableRoles" :key="role.id"
                                 class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                 @click="assignRoleToStaff(role)">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium">{{ role.name }}</div>
                                        <div class="text-sm text-gray-500">{{ role.permissions_count }} permissions</div>
                                    </div>
                                    <Button icon="fa fa-plus" size="small" outlined severity="success" />
                                </div>
                            </div>
                            <div v-if="availableRoles.length === 0" class="text-center text-gray-500 py-4">
                                All roles have been assigned
                            </div>
                        </div>
                    </div>

                    <!-- Assigned Roles -->
                    <div>
                        <h5 class="font-semibold mb-3 flex items-center gap-2">
                            <i class="fa fa-user-check"></i>
                            Assigned Roles
                        </h5>
                        <div class="space-y-2 max-h-80 overflow-y-auto">
                            <div v-for="role in selectedStaff.roles" :key="role.id"
                                 class="p-3 border rounded-lg bg-blue-50 border-blue-200">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium">{{ role.name }}</div>
                                        <div class="text-sm text-gray-500">Active role</div>
                                    </div>
                                    <Button icon="fa fa-times"
                                            size="small"
                                            outlined
                                            severity="danger"
                                            @click="removeRoleFromStaff(role)" />
                                </div>
                            </div>
                            <div v-if="!selectedStaff.roles || selectedStaff.roles.length === 0"
                                 class="text-center text-gray-500 py-4">
                                No roles assigned
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="fa fa-times" @click="roleManagementModal = false" />
            </template>
        </Dialog>

        <!-- Permission Management Modal -->
        <Dialog header="Manage Staff Permissions" v-model:visible="permissionManagementModal" class="w-[80%]" :modal="true">
            <div v-if="selectedStaff" class="p-fluid">
                <div class="mb-4">
                    <h4 class="text-lg font-semibold mb-2">{{ selectedStaff.full_name }}</h4>
                    <p class="text-sm text-gray-600">{{ selectedStaff.email }} • {{ selectedStaff.staff_number }}</p>
                </div>

                <!-- Permission Categories -->
                <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                        <Button v-for="category in permissionCategories" :key="category.category"
                                :label="category.name"
                                :severity="selectedCategory === category.category ? 'primary' : 'secondary'"
                                :outlined="selectedCategory !== category.category"
                                size="small"
                                @click="selectedCategory = category.category" />
                    </div>
                </div>

                <!-- Permissions List -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Available Permissions -->
                    <div>
                        <h5 class="font-semibold mb-3 flex items-center gap-2">
                            <i class="fa fa-key"></i>
                            Available Permissions
                            <span class="text-sm font-normal text-gray-500">({{ filteredAvailablePermissions.length }})</span>
                        </h5>
                        <div class="space-y-1 max-h-96 overflow-y-auto">
                            <div v-for="permission in filteredAvailablePermissions" :key="permission.name"
                                 class="p-2 border rounded hover:bg-gray-50 cursor-pointer text-sm"
                                 @click="assignPermissionToStaff(permission)">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium">{{ formatPermissionName(permission.name) }}</div>
                                        <div class="text-xs text-gray-500">{{ permission.description }}</div>
                                    </div>
                                    <Button icon="fa fa-plus" size="small" outlined severity="success" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Assigned Permissions -->
                    <div>
                        <h5 class="font-semibold mb-3 flex items-center gap-2">
                            <i class="fa fa-check-circle"></i>
                            Assigned Permissions
                            <span class="text-sm font-normal text-gray-500">({{ filteredAssignedPermissions.length }})</span>
                        </h5>
                        <div class="space-y-1 max-h-96 overflow-y-auto">
                            <div v-for="permission in filteredAssignedPermissions" :key="permission"
                                 class="p-2 border rounded bg-green-50 border-green-200 text-sm">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="font-medium">{{ formatPermissionName(permission) }}</div>
                                        <div class="text-xs text-gray-500">Active permission</div>
                                    </div>
                                    <Button icon="fa fa-times"
                                            size="small"
                                            outlined
                                            severity="danger"
                                            @click="removePermissionFromStaff(permission)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="fa fa-times" @click="permissionManagementModal = false" />
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
import ColumnGroup from 'primevue/columngroup';
import PickList from 'primevue/picklist';
import InputIcon from 'primevue/inputicon'
import IconField from 'primevue/iconfield'
import Tag from 'primevue/Tag';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';

export default {
    data() {
        return {
            staffs: [],
            staff: {},
            newStaffDialog: false,
            editStaffDialog: false,
            tableloading: true,
            validation: {},
            dataTableloading: false,
            editingRows:null,
            permissions:[],
            selectedPermissions:[],
            selected_permissions:[],
            expandedRows: [],
            staffPermissions:{},
            filters:{ global: { value: null}},
            search:'',
            loadingStates:{},
            savingState: false,
            faculties:[],
            departments:[],

            // Role and Permission Management
            roleManagementModal: false,
            permissionManagementModal: false,
            selectedStaff: null,
            allRoles: [],
            permissionCategories: [],
            selectedCategory: 'all',
            roleAssignmentLoading: false,
            permissionAssignmentLoading: false
        }
    },
    computed: {
        availableRoles() {
            if (!this.selectedStaff || !this.allRoles) return [];
            const assignedRoleIds = this.selectedStaff.roles?.map(role => role.id) || [];
            return this.allRoles.filter(role => !assignedRoleIds.includes(role.id));
        },

        filteredAvailablePermissions() {
            if (!this.permissionCategories || !this.selectedStaff) return [];

            const assignedPermissions = this.selectedStaff.all_permissions || [];
            let allPermissions = [];

            if (this.selectedCategory === 'all') {
                this.permissionCategories.forEach(category => {
                    allPermissions = allPermissions.concat(category.permissions);
                });
            } else {
                const category = this.permissionCategories.find(cat => cat.category === this.selectedCategory);
                if (category) {
                    allPermissions = category.permissions;
                }
            }

            return allPermissions.filter(permission => !assignedPermissions.includes(permission.name));
        },

        filteredAssignedPermissions() {
            if (!this.selectedStaff || !this.selectedStaff.all_permissions) return [];

            if (this.selectedCategory === 'all') {
                return this.selectedStaff.all_permissions;
            }

            const category = this.permissionCategories.find(cat => cat.category === this.selectedCategory);
            if (!category) return [];

            const categoryPermissionNames = category.permissions.map(p => p.name);
            return this.selectedStaff.all_permissions.filter(permission =>
                categoryPermissionNames.includes(permission)
            );
        }
    },
    components: {
        InputText,
        Button,
        DataTable,
        Column,
        Row,
        PickList,
        ColumnGroup,
        InputIcon,
        IconField,
        Tag,
        Dialog,
        Select
    },
    methods: {
        onRowExpand(data){
            this.staff = data.data
        },
        async unassignPermission(permissions){            
            const res = await post(`${this.$endpoints.staff.revokePermission.url}`,{
                staff_id:this.staff.id,
                permissions: permissions.items.map(item=>item.name)
            });            
            if(res){
                this.$globals.showMessage('staff permissions revoked successfully', 'success');
            }
            this.$globals.showMessage(err, 'error');
        },
        async assignPermission(permissions){            
            const res = await post(`${this.$endpoints.staff.givePermission.url}`,{
                staff_id:this.staff.id,
                permissions: permissions.items.map(item=>item.name)
            });            
            if(res){
                this.$globals.showMessage('staff permissions assigned successfully', 'success');
            }
            this.$globals.showMessage(err, 'error');
        },
        applyFilter(e) {
            const filter = e.target.value.toLowerCase();
            const list = e.target.parentElement.parentElement.parentElement.nextElementSibling;
            const permissionElements = list.querySelectorAll('li');
            permissionElements.forEach(el => {
                const permissionName = el.querySelector('.permission').textContent.toLowerCase();
                if (permissionName.includes(filter)) {
                el.style.display = ''; // Show the element
                } else {
                el.style.display = 'none'; // Hide the element
                }
            });
        },
        async fetchRecords() {
            this.tableloading = true;
            const res = await post(`${this.$endpoints.staff.staffs.url}?paginate`,{
                search:this.search
            });            
            if(res){
                this.staffs = res.data;

                    // this.staffs?.forEach(staff => {
                    //     this.staffPermissions[staff.staff_number] = [ 
                    //         this.permissions.filter(perm=> !staff.permissions.map(item=>item.name).includes(perm.name)), staff.permissions
                    //     ]            
                    // }); 
            }
            this.tableloading = false;
        },
        async getPermissions(){
            const res = await get(`${this.$endpoints.staff.getPermissions.url}`);            
            this.permissions = res;
        },
        async updateStaff(event) {
            let { newData, index } = event;
            this.validation = {};                    
            const res = await post(this.$endpoints.staff.updateStaff.url, newData);
            if (res) {
                this.fetchRecords();
                this.editStaffDialog = false;
                this.$globals.showMessage(this.$globals.updateMessage, 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async createStaff() {
            this.validation = {};
            if (!this.staff.first_name) {
                this.validation.first_name = true;
                return;
            }
            if (!this.staff.surname) {
                this.validation.surname = true;
                return;
            }
            if (!this.staff.gender) {
                this.validation.gender = true;
                return;
            }
            if (!this.staff.phone_number) {
                this.validation.phone_number = true;
                return;
            }
            this.savingState = true
            const res = await post(this.$endpoints.staff.createStaff.url, this.staff);
            this.savingState = false
            this.openNewradingDialog = false
            if (res) {
                this.fetchRecords();
                this.newStaffDialog = false;
                this.$globals.showMessage('staff created successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
                //this.$globals.showMessage('Failed to create staff', 'error');
            }
        },
        async deactivateStaff(staff) {
            const confirm = await showModal({ title: 'Confirm Deactivation', text: 'Are you sure you want to deactivate this staff?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.deactivateStaff.url, { id: staff.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('staff deactivated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        async activateStaff(staff) {
            const confirm = await showModal({ title: 'Confirm Activation', text: 'Are you sure you want to activate this staff?', confirmText: 'Yes', cancelText: 'No' });
            if (!confirm) return;
            const res = await post(this.$endpoints.staff.activateStaff.url, { id: staff.id });
            if (res) {
                this.fetchRecords();
                this.$globals.showMessage('staff activated successfully', 'success');
            } else {
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        openNewStaffDialog() {
            this.staff = {}; // Reset staff object
            this.newStaffDialog = true;
        },
        duplicateRecord(staff) {
            this.staff = Object.assign({}, staff); // Clone staff object
            delete this.staff.staff_number;
            this.newStaffDialog = true;
        },
        async resetPassword(staff){
            this.loadingStates[staff.id]= true;            
            const res = await post(`${this.$endpoints.staff.resetPassword.url}`,{
                id:staff.id
            });   
            this.loadingStates[staff.id]= false;    
            if(res){
                this.$globals.showMessage('staff activated successfully', 'success');
            }else{
                const err = localStorage.getItem('error');
                this.$globals.showMessage(err, 'error');
            }
        },
        exportCSV() {
            this.$refs.dtable.exportCSV();
        },   
        onSelectFaculty(e){
            this.departments =  this.departments.filter(department=>department.faculty_id == e.value);
        },     
        refresh(){            
            this.fetchRecords()
        },
        searchStaff(e){
        this.search = e.target.value;
        setTimeout(() => {

            this.fetchRecords(search);
        }, 2500);
        },

        // Role and Permission Management Methods
        async openRoleManagementModal(staff) {
            this.selectedStaff = staff;
            this.roleManagementModal = true;
            await this.loadAllRoles();
        },

        async openPermissionManagementModal(staff) {
            this.selectedStaff = staff;
            this.permissionManagementModal = true;
            this.selectedCategory = 'all';
            await this.loadPermissionCategories();
        },

        async loadAllRoles() {
            try {
                const response = await get(this.$endpoints.staff.getPermissionRoles.url);
                if (response) {
                    this.allRoles = response;
                }
            } catch (error) {
                console.error('Error loading roles:', error);
                this.$globals.showMessage('Failed to load roles', 'error');
            }
        },

        async loadPermissionCategories() {
            try {
                const response = await get(this.$endpoints.staff.getPermissionsList.url);
                if (response) {
                    this.permissionCategories = response;
                    // Add 'all' category
                    this.permissionCategories.unshift({
                        category: 'all',
                        name: 'All Categories',
                        permissions: []
                    });
                }
            } catch (error) {
                console.error('Error loading permissions:', error);
                this.$globals.showMessage('Failed to load permissions', 'error');
            }
        },

        async assignRoleToStaff(role) {
            if (this.roleAssignmentLoading) return;

            this.roleAssignmentLoading = true;
            try {
                const response = await post(this.$endpoints.staff.assignUserRole.url, {
                    user_id: this.selectedStaff.id,
                    role_name: role.name
                });

                if (response) {
                    // Update the selected staff's roles
                    if (!this.selectedStaff.roles) {
                        this.selectedStaff.roles = [];
                    }
                    this.selectedStaff.roles.push(role);

                    // Update the staff in the main list
                    const staffIndex = this.staffs.data.findIndex(s => s.id === this.selectedStaff.id);
                    if (staffIndex !== -1) {
                        this.staffs.data[staffIndex].roles = [...this.selectedStaff.roles];
                    }

                    this.$globals.showMessage(`Role "${role.name}" assigned successfully`, 'success');
                }
            } catch (error) {
                console.error('Error assigning role:', error);
                this.$globals.showMessage('Failed to assign role', 'error');
            } finally {
                this.roleAssignmentLoading = false;
            }
        },

        async removeRoleFromStaff(role) {
            if (this.roleAssignmentLoading) return;

            this.roleAssignmentLoading = true;
            try {
                const response = await post(this.$endpoints.staff.removeUserRole.url, {
                    user_id: this.selectedStaff.id,
                    role_name: role.name
                });

                if (response) {
                    // Remove the role from selected staff
                    this.selectedStaff.roles = this.selectedStaff.roles.filter(r => r.id !== role.id);

                    // Update the staff in the main list
                    const staffIndex = this.staffs.data.findIndex(s => s.id === this.selectedStaff.id);
                    if (staffIndex !== -1) {
                        this.staffs.data[staffIndex].roles = [...this.selectedStaff.roles];
                    }

                    this.$globals.showMessage(`Role "${role.name}" removed successfully`, 'success');
                }
            } catch (error) {
                console.error('Error removing role:', error);
                this.$globals.showMessage('Failed to remove role', 'error');
            } finally {
                this.roleAssignmentLoading = false;
            }
        },

        async assignPermissionToStaff(permission) {
            if (this.permissionAssignmentLoading) return;

            this.permissionAssignmentLoading = true;
            try {
                const response = await post(this.$endpoints.staff.givePermission.url, {
                    staff_id: this.selectedStaff.id,
                    permissions: [permission.name]
                });

                if (response) {
                    // Update the selected staff's permissions
                    if (!this.selectedStaff.all_permissions) {
                        this.selectedStaff.all_permissions = [];
                    }
                    this.selectedStaff.all_permissions.push(permission.name);

                    // Update the staff in the main list
                    const staffIndex = this.staffs.data.findIndex(s => s.id === this.selectedStaff.id);
                    if (staffIndex !== -1) {
                        this.staffs.data[staffIndex].all_permissions = [...this.selectedStaff.all_permissions];
                    }

                    this.$globals.showMessage(`Permission "${this.formatPermissionName(permission.name)}" assigned successfully`, 'success');
                }
            } catch (error) {
                console.error('Error assigning permission:', error);
                this.$globals.showMessage('Failed to assign permission', 'error');
            } finally {
                this.permissionAssignmentLoading = false;
            }
        },

        async removePermissionFromStaff(permissionName) {
            if (this.permissionAssignmentLoading) return;

            this.permissionAssignmentLoading = true;
            try {
                const response = await post(this.$endpoints.staff.revokePermission.url, {
                    staff_id: this.selectedStaff.id,
                    permissions: [permissionName]
                });

                if (response) {
                    // Remove the permission from selected staff
                    this.selectedStaff.all_permissions = this.selectedStaff.all_permissions.filter(p => p !== permissionName);

                    // Update the staff in the main list
                    const staffIndex = this.staffs.data.findIndex(s => s.id === this.selectedStaff.id);
                    if (staffIndex !== -1) {
                        this.staffs.data[staffIndex].all_permissions = [...this.selectedStaff.all_permissions];
                    }

                    this.$globals.showMessage(`Permission "${this.formatPermissionName(permissionName)}" removed successfully`, 'success');
                }
            } catch (error) {
                console.error('Error removing permission:', error);
                this.$globals.showMessage('Failed to remove permission', 'error');
            } finally {
                this.permissionAssignmentLoading = false;
            }
        },

        // Utility Methods
        getRoleSeverity(roleName) {
            const severityMap = {
                'super-admin': 'danger',
                'admin': 'warning',
                'registrar': 'info',
                'admission-officer': 'success',
                'academic-officer': 'info',
                'lecturer': 'secondary',
                'accountant': 'warning'
            };
            return severityMap[roleName.toLowerCase()] || 'secondary';
        },

        formatPermissionName(permissionName) {
            return permissionName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    },
    async created() {
        this.getPermissions();
        this.fetchRecords();
        const schoolInfo = this.$globals?.school_info;
            if (schoolInfo) {
                this.faculties = schoolInfo.faculties || [];                              
            }
    },
  
}
</script>
  
<style scoped>
/* Add your styles here */
</style>
  