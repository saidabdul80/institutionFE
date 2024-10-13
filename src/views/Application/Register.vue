<template>
    <div class="md:h-[100vh]">
      <div class="flex justify-center items-start md:items-center h-[100vh] w-full">
        <div class="flex flex-1 flex-col justify-center px-4 border py-12 sm:px-6 lg:flex-none md:px-0">
          <div class="mx-auto w-full md:w-[80%]">
            <div>
              <div class="flex justify-center mb-10">
                <img class="md:h-24 h-20 w-auto" src="@/assets/logo.jpg" alt="Your Company" />
              </div>
              <p class="my-6 text-center font-semibold text-[16px] text-green-900">
                Application Process
              </p>
            </div>
            <div ref="form">
              <div>
                <div class="w-full mx-auto grid md:grid-cols-3 gap-4">
                    <PInput
                    v-model="authStore.registerData.first_name"
                    label="First Name"
                    class="mb-2"
                    fluid
                    :error_messages="errors.first_name"
                    placeholder="First Name"
                  />
                  <PInput
                    v-model="authStore.registerData.surname"
                    label="Surname"
                    class="mb-2"
                    fluid
                    :error_messages="errors.surname"
                    placeholder="Surname"
                  />
                  <PInput
                    v-model="authStore.registerData.email"
                    label="Email"
                    class="mb-2"
                    fluid
                    :error_messages="errors.email"
                    placeholder="Email"
                  />
                  
                  <PSelect
                    @change="globalStore.fetchProgrammes(authStore.registerData.programme_type_id)"
                    :options="globalStore.school_info.programme_types"
                    option-value="id"
                    option-label="name"
                    v-model="authStore.registerData.programme_type_id"
                    label="Programme Type"
                    class="mb-2"
                    fluid
                  />
                  <PSelect
                    :loading="globalStore?.programmesLoading"
                    :options="globalStore.programmes"
                    option-value="id"
                    option-label="name"
                    v-model="authStore.registerData.applied_programme_id"
                    label="Programme Type"
                    class="mb-2"
                    fluid
                  />

                  <PSelect
                    v-if="globalStore.getConfiguration('enable_faculty')"
                    @change="globalStore.fetchDepartmentsByFaculty(authStore.registerData.faculty_id)"
                    :options="globalStore.school_info.faculties"
                    option-value="id"
                    option-label="name"
                    v-model="authStore.registerData.faculty_id"
                    label="Faculty"
                    class="mb-2"
                    fluid
                  />
                  <PSelect
                    v-if="globalStore.getConfiguration('enable_department')"
                    :loading="globalStore?.departmentLoading"
                    :options="globalStore.departments"
                    option-value="id"
                    option-label="name"
                    v-model="authStore.registerData.department_id"
                    label="Department"
                    class="mb-2"
                    fluid
                  />
                  <PSelect
                    v-if="globalStore.getConfiguration('enable_entry_mode')"
                    :options="globalStore.school_info.entry_modes"
                    option-value="id"
                    option-label="title"
                    v-model="authStore.registerData.mode_of_entry_id"
                    label="Entry Mode"
                    class="mb-2"
                    fluid
                  />
                  <PasswordField
                    label="Password"
                    class="mb-2"
                    type="password"
                    placeholder="**********"
                    fluid
                    v-model="authStore.registerData.password"
                    :error_messages="errors.password"
                  />
                  <PasswordField
                    label="Confirm Password"
                    class="mb-2"
                    type="password"
                    placeholder="**********"
                    fluid
                    v-model="authStore.registerData.password_confirmation"
                    :error_messages="errors.password_confirmation"
                  />
                </div>
              </div>
              <div class="w-[80%] mx-auto">
                <div>
                  <Button
                    :loading="isLoading"
                    @click.prevent="register"
                    type="submit"
                    fluid
                    size="large"
                    label="Register"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useGlobalsStore } from '@/stores/globals';
  import InputText from 'primevue/inputtext';
  import Checkbox from 'primevue/checkbox';
  import Button from 'primevue/button';
  import Password from 'primevue/password';
  import PInput from '@/components/PInput.vue';
  import { useClient } from '@/stores/client';
  import PasswordField from '@/components/PasswordField.vue';
  import PSelect from '@/components/PSelect.vue';
  
  export default {
    name: "register",
    components: {
      InputText,
      PasswordField,
      Button,
      PInput,
      Checkbox,
      PSelect,
    },
    data() {
      return {
        isLoading: false,
        showPassword: false,
        authStore: {
          registerData: {
            username: '',
            programme_type_id: '',
            programme_id: '',
            password: '',
            password_confirmation: '',
          },
        },
        globalStore: useGlobalsStore(),
        errors: {},
      };
    },
    methods: {
      async register() {
        this.isLoading = true;
        try {
          const res = await useClient().http({
            method: 'post',
            path: 'api/applicants/create',
            data: this.authStore.registerData,
          });
          // Handle successful registration (e.g., redirect to login page)
        } catch (error) {
          if (error.response && error.response.status === 422) {
            this.errors = error.response.data.errors;
          } else {
            // Handle other types of errors (e.g., network errors)
            console.error(error);
          }
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
  </script>
  
  <style></style>
  