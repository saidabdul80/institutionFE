<template>
    <div class="p-6">
        <div class="bg-white rounded-lg shadow-md">
            <!-- Header -->
            <div class="border-b border-gray-200 p-6">
                <h2 class="text-2xl font-bold text-gray-800">Student Profile</h2>
                <p class="text-gray-600">Manage your personal information</p>
            </div>

            <!-- Profile Content -->
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Profile Picture Section -->
                    <div class="lg:col-span-1">
                        <div class="text-center">
                            <div class="relative inline-block">
                                <img :src="studentInfo.picture || '/default-avatar.png'" 
                                     alt="Profile Picture" 
                                     class="w-32 h-32 rounded-full object-cover border-4 border-gray-200">
                                <button @click="showPictureUpload = true" 
                                        class="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
                                    <i class="fa fa-camera"></i>
                                </button>
                            </div>
                            <h3 class="mt-4 text-xl font-semibold">{{ studentInfo.full_name }}</h3>
                            <p class="text-gray-600">{{ studentInfo.matric_number }}</p>
                            <p class="text-sm text-gray-500">{{ studentInfo.programme_name }}</p>
                        </div>
                    </div>

                    <!-- Profile Form -->
                    <div class="lg:col-span-2">
                        <form @submit.prevent="updateProfile">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Personal Information -->
                                <div class="md:col-span-2">
                                    <h4 class="text-lg font-semibold mb-4 text-gray-800">Personal Information</h4>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input v-model="form.first_name" type="text" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input v-model="form.last_name" type="text" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                                    <input v-model="form.middle_name" type="text" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input v-model="form.email" type="email" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input v-model="form.phone_number" type="tel" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input v-model="form.date_of_birth" type="date" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select v-model="form.gender" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                                    <select v-model="form.religion" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Religion</option>
                                        <option value="Christianity">Christianity</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Traditional">Traditional</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>

                                <!-- Address Information -->
                                <div class="md:col-span-2 mt-6">
                                    <h4 class="text-lg font-semibold mb-4 text-gray-800">Address Information</h4>
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <textarea v-model="form.address" rows="3" 
                                              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <select v-model="form.state_id" @change="loadLgas" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select State</option>
                                        <option v-for="state in states" :key="state.id" :value="state.id">
                                            {{ state.name }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">LGA</label>
                                    <select v-model="form.lga_id" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select LGA</option>
                                        <option v-for="lga in lgas" :key="lga.id" :value="lga.id">
                                            {{ lga.name }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Emergency Contact -->
                                <div class="md:col-span-2 mt-6">
                                    <h4 class="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h4>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                                    <input v-model="form.emergency_contact_name" type="text" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                                    <input v-model="form.emergency_contact_phone" type="tel" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                                    <input v-model="form.emergency_contact_relationship" type="text" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="mt-8 flex justify-end">
                                <button type="submit" :disabled="loading" 
                                        class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
                                    <i v-if="loading" class="fa fa-spinner fa-spin mr-2"></i>
                                    {{ loading ? 'Updating...' : 'Update Profile' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Picture Upload Modal -->
        <Dialog v-model:visible="showPictureUpload" modal header="Upload Profile Picture" :style="{width: '450px'}">
            <div class="p-4">
                <input type="file" @change="handleFileSelect" accept="image/*" class="mb-4">
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" severity="secondary" @click="showPictureUpload = false" />
                    <Button label="Upload" @click="uploadPicture" :disabled="!selectedFile" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script>
import { get, post, postFormData } from '@/api/client';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    components: {
        Dialog,
        Button
    },
    data() {
        return {
            studentInfo: {},
            form: {},
            states: [],
            lgas: [],
            loading: false,
            showPictureUpload: false,
            selectedFile: null
        }
    },
    methods: {
        async loadStudentData() {
            try {
                const res = await get(this.$endpoints.student.getStudentById.url);
                if (res) {
                    this.studentInfo = res;
                    this.form = { ...res };
                    if (res.state_id) {
                        await this.loadLgas();
                    }
                }
            } catch (error) {
                console.error('Error loading student data:', error);
            }
        },
        async loadStates() {
            try {
                const res = await get('api/states');
                if (res) {
                    this.states = res;
                }
            } catch (error) {
                console.error('Error loading states:', error);
            }
        },
        async loadLgas() {
            if (!this.form.state_id) return;
            try {
                const res = await get(`api/lgas/${this.form.state_id}`);
                if (res) {
                    this.lgas = res;
                }
            } catch (error) {
                console.error('Error loading LGAs:', error);
            }
        },
        async updateProfile() {
            this.loading = true;
            try {
                const res = await post(this.$endpoints.student.updateStudent.url, this.form);
                if (res && !res.error) {
                    this.$globals.message = {
                        text: 'Profile updated successfully',
                        type: 'success'
                    };
                    setTimeout(() => {
                        this.$globals.message.text = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            } finally {
                this.loading = false;
            }
        },
        handleFileSelect(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadPicture() {
            if (!this.selectedFile) return;
            
            const formData = new FormData();
            formData.append('picture', this.selectedFile);
            
            try {
                const res = await postFormData(this.$endpoints.student.uploadPicture.url, formData);
                if (res) {
                    this.showPictureUpload = false;
                    await this.loadStudentData();
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
        }
    },
    async mounted() {
        await this.loadStudentData();
        await this.loadStates();
    }
}
</script>
