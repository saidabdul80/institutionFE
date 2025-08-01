<template>
    <div class="p-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="relative">
                        <img :src="profileData.picture || '/src/assets/default-avatar.png'" 
                             alt="Profile Picture" 
                             class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg">
                        <button @click="showPictureModal = true" 
                                class="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                            <i class="fa fa-camera text-xs"></i>
                        </button>
                    </div>
                    <div class="ml-6">
                        <h2 class="text-2xl font-bold text-gray-800">
                            {{ profileData.first_name }} {{ profileData.last_name }}
                        </h2>
                        <p class="text-gray-600">{{ profileData.email }}</p>
                        <p class="text-sm text-gray-500">Application ID: {{ profileData.application_id || 'N/A' }}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Account Status</p>
                    <span :class="getStatusColor(profileData.status)" 
                          class="px-3 py-1 rounded-full text-sm font-medium">
                        {{ profileData.status || 'Active' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Profile Tabs -->
        <div class="bg-white rounded-lg shadow-md">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-8 px-6">
                    <button v-for="(tab, index) in tabs" :key="index"
                            @click="activeTab = index" 
                            :class="activeTab === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                            class="py-4 px-1 border-b-2 font-medium text-sm">
                        {{ tab.title }}
                    </button>
                </nav>
            </div>

            <!-- Personal Information Tab -->
            <div v-if="activeTab === 0" class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold">Personal Information</h3>
                    <button @click="editMode.personal = !editMode.personal" 
                            :class="editMode.personal ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
                            class="text-white px-4 py-2 rounded-md">
                        <i :class="editMode.personal ? 'fa fa-save' : 'fa fa-edit'" class="mr-2"></i>
                        {{ editMode.personal ? 'Save Changes' : 'Edit' }}
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input v-model="profileData.first_name" :disabled="!editMode.personal" type="text"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input v-model="profileData.last_name" :disabled="!editMode.personal" type="text"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                        <input v-model="profileData.middle_name" :disabled="!editMode.personal" type="text"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input v-model="profileData.email" :disabled="!editMode.personal" type="email"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input v-model="profileData.phone_number" :disabled="!editMode.personal" type="tel"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input v-model="profileData.date_of_birth" :disabled="!editMode.personal" type="date"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select v-model="profileData.gender" :disabled="!editMode.personal"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                        <select v-model="profileData.religion" :disabled="!editMode.personal"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                            <option value="Christianity">Christianity</option>
                            <option value="Islam">Islam</option>
                            <option value="Traditional">Traditional</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea v-model="profileData.address" :disabled="!editMode.personal" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"></textarea>
                    </div>
                </div>
            </div>

            <!-- Academic Information Tab -->
            <div v-if="activeTab === 1" class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold">Academic Information</h3>
                    <button @click="editMode.academic = !editMode.academic" 
                            :class="editMode.academic ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
                            class="text-white px-4 py-2 rounded-md">
                        <i :class="editMode.academic ? 'fa fa-save' : 'fa fa-edit'" class="mr-2"></i>
                        {{ editMode.academic ? 'Save Changes' : 'Edit' }}
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Programme Choice</label>
                        <input v-model="profileData.programme_name" disabled type="text"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Entry Mode</label>
                        <input v-model="profileData.entry_mode" disabled type="text"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Registration Number</label>
                        <input v-model="profileData.jamb_reg_number" :disabled="!editMode.academic" type="text"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">JAMB Score</label>
                        <input v-model="profileData.jamb_score" :disabled="!editMode.academic" type="number"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                    </div>
                </div>
            </div>

            <!-- Security Tab -->
            <div v-if="activeTab === 2" class="p-6">
                <h3 class="text-lg font-semibold mb-6">Security Settings</h3>
                
                <form @submit.prevent="changePassword" class="max-w-md">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input v-model="passwordForm.current_password" type="password" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input v-model="passwordForm.new_password" type="password" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input v-model="passwordForm.confirm_password" type="password" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                    
                    <button type="submit" :disabled="loading"
                            class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                        <i v-if="loading" class="fa fa-spinner fa-spin mr-2"></i>
                        Change Password
                    </button>
                </form>
            </div>

            <!-- Activity Log Tab -->
            <div v-if="activeTab === 3" class="p-6">
                <h3 class="text-lg font-semibold mb-6">Recent Activity</h3>
                
                <div class="space-y-4">
                    <div v-for="activity in activityLog" :key="activity.id" 
                         class="flex items-center p-4 bg-gray-50 rounded-lg">
                        <i :class="activity.icon" class="text-2xl mr-4"></i>
                        <div class="flex-1">
                            <p class="font-medium">{{ activity.title }}</p>
                            <p class="text-sm text-gray-600">{{ activity.description }}</p>
                            <p class="text-xs text-gray-500">{{ formatDate(activity.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Picture Upload Modal -->
        <Dialog v-model:visible="showPictureModal" modal header="Update Profile Picture" :style="{width: '400px'}">
            <div class="p-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select Picture</label>
                    <input type="file" @change="handlePictureSelect" accept="image/*" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <p class="text-xs text-gray-500 mt-1">
                        Supported formats: JPG, JPEG, PNG (Max size: 2MB)
                    </p>
                </div>
                
                <div v-if="selectedPicture" class="mb-4">
                    <img :src="picturePreview" alt="Preview" class="w-32 h-32 rounded-full object-cover mx-auto">
                </div>
                
                <div class="flex justify-end gap-2 mt-6">
                    <Button label="Cancel" severity="secondary" @click="showPictureModal = false" />
                    <Button label="Upload" @click="uploadPicture" :disabled="!selectedPicture" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post, postFormData } from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    components: {
        Dialog,
        Button
    },
    data() {
        return {
            activeTab: 0,
            loading: false,
            showPictureModal: false,
            selectedPicture: null,
            picturePreview: '',
            profileData: {},
            editMode: {
                personal: false,
                academic: false
            },
            passwordForm: {
                current_password: '',
                new_password: '',
                confirm_password: ''
            },
            tabs: [
                { title: 'Personal Information' },
                { title: 'Academic Information' },
                { title: 'Security' },
                { title: 'Activity Log' }
            ],
            activityLog: [
                {
                    id: 1,
                    title: 'Profile Updated',
                    description: 'Personal information was updated',
                    icon: 'fa fa-user text-blue-500',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Document Uploaded',
                    description: 'Passport photograph was uploaded',
                    icon: 'fa fa-upload text-green-500',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 3,
                    title: 'Login',
                    description: 'Logged in from new device',
                    icon: 'fa fa-sign-in text-purple-500',
                    created_at: new Date(Date.now() - 172800000).toISOString()
                }
            ],
            store: useAuthStore()
        }
    },
    methods: {
        async loadProfileData() {
            try {
                if (this.store.getUser) {
                    this.profileData = { ...this.store.getUser };
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            }
        },
        handlePictureSelect(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedPicture = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.picturePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        async uploadPicture() {
            if (!this.selectedPicture) return;
            
            const formData = new FormData();
            formData.append('file', this.selectedPicture); // Backend expects 'file' not 'picture'
            
            try {
                const res = await postFormData(this.$endpoints.applicant.uploadPicture.url, formData);
                if (res && !res.error) {
                    // Update profile data with new picture URL from the response
                    this.profileData.picture = res.picture;
                    this.showPictureModal = false;
                    this.selectedPicture = null;
                    this.picturePreview = '';
                    
                    this.$globals.message = {
                        text: 'Profile picture updated successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error uploading picture:', error);
            }
        },
        async changePassword() {
            if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
                alert('New passwords do not match');
                return;
            }
            
            this.loading = true;
            try {
                const res = await post(this.$endpoints.applicant.changePassword.url, this.passwordForm);
                if (res && !res.error) {
                    this.passwordForm = {
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                    };
                    
                    this.$globals.message = {
                        text: 'Password changed successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error changing password:', error);
            } finally {
                this.loading = false;
            }
        },
        getStatusColor(status) {
            const colors = {
                'active': 'bg-green-100 text-green-800',
                'pending': 'bg-yellow-100 text-yellow-800',
                'suspended': 'bg-red-100 text-red-800'
            };
            return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    async mounted() {
        await this.loadProfileData();
    }
}
</script>
