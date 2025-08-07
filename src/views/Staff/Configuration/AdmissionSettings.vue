<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Admission Settings</h1>
                <p class="text-gray-600">Configure admission process settings and templates</p>
            </div>
            <div class="flex items-center gap-3">
                <Button 
                    icon="fa fa-save" 
                    label="Save Settings" 
                    @click="saveSettings" 
                    :loading="saving" />
            </div>
        </div>

        <!-- Settings Sections -->
        <div class="space-y-6">
            <!-- Admission Letter Process -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold mb-4">Admission Letter Process</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Process Mode</label>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <RadioButton 
                                    v-model="settings.admission_letter_process_mode" 
                                    inputId="manual" 
                                    value="manual" />
                                <label for="manual" class="ml-2">
                                    <span class="font-medium">Manual Process</span>
                                    <p class="text-sm text-gray-500">Admission officers must manually review and issue admission letters after document verification</p>
                                </label>
                            </div>
                            <div class="flex items-center">
                                <RadioButton 
                                    v-model="settings.admission_letter_process_mode" 
                                    inputId="automated" 
                                    value="automated" />
                                <label for="automated" class="ml-2">
                                    <span class="font-medium">Automated Process</span>
                                    <p class="text-sm text-gray-500">Admission letters are automatically issued after successful document verification</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div v-if="settings.admission_letter_process_mode === 'automated'" class="p-4 bg-yellow-50 rounded-lg">
                        <div class="flex items-start">
                            <i class="fa fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
                            <div>
                                <h4 class="font-medium text-yellow-800">Automated Process Warning</h4>
                                <p class="text-sm text-yellow-700 mt-1">
                                    In automated mode, admission letters will be issued immediately after document verification is completed. 
                                    Ensure all verification processes are properly configured before enabling this mode.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Document Templates -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold mb-4">Document Templates</h3>
                <div class="space-y-6">
                    <!-- Acknowledgment Letter Template -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Acknowledgment Letter Template
                            <span class="text-xs text-gray-500">(Issued after final submission)</span>
                        </label>
                        <div class="flex items-center gap-3 mb-2">
                            <Button 
                                icon="fa fa-eye" 
                                label="Preview" 
                                size="small" 
                                outlined 
                                @click="previewTemplate('acknowledgment')" />
                            <Button 
                                icon="fa fa-edit" 
                                label="Edit Template" 
                                size="small" 
                                outlined 
                                @click="editTemplate('acknowledgment')" />
                        </div>
                        <div class="text-xs text-gray-500">
                            This template is used for the acknowledgment slip that applicants receive after final submission.
                        </div>
                    </div>

                    <!-- Admission Notification Template -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Admission Notification Template
                            <span class="text-xs text-gray-500">(Informal admission notice)</span>
                        </label>
                        <div class="flex items-center gap-3 mb-2">
                            <Button 
                                icon="fa fa-eye" 
                                label="Preview" 
                                size="small" 
                                outlined 
                                @click="previewTemplate('notification')" />
                            <Button 
                                icon="fa fa-edit" 
                                label="Edit Template" 
                                size="small" 
                                outlined 
                                @click="editTemplate('notification')" />
                        </div>
                        <div class="text-xs text-gray-500">
                            This template is used for the informal admission notification sent after admission publication.
                        </div>
                    </div>

                    <!-- Verification Slip Template -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Verification Slip Template
                            <span class="text-xs text-gray-500">(Issued after acceptance fee payment)</span>
                        </label>
                        <div class="flex items-center gap-3 mb-2">
                            <Button 
                                icon="fa fa-eye" 
                                label="Preview" 
                                size="small" 
                                outlined 
                                @click="previewTemplate('verification')" />
                            <Button 
                                icon="fa fa-edit" 
                                label="Edit Template" 
                                size="small" 
                                outlined 
                                @click="editTemplate('verification')" />
                        </div>
                        <div class="text-xs text-gray-500">
                            This template is used for the verification slip sent after acceptance fee payment with next steps.
                        </div>
                    </div>

                    <!-- Admission Letter Template -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Official Admission Letter Template
                            <span class="text-xs text-gray-500">(Final official admission letter)</span>
                        </label>
                        <div class="flex items-center gap-3 mb-2">
                            <Button 
                                icon="fa fa-eye" 
                                label="Preview" 
                                size="small" 
                                outlined 
                                @click="previewTemplate('admission')" />
                            <Button 
                                icon="fa fa-edit" 
                                label="Edit Template" 
                                size="small" 
                                outlined 
                                @click="editTemplate('admission')" />
                        </div>
                        <div class="text-xs text-gray-500">
                            This template is used for the official admission letter issued after document verification.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Email Settings -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <h3 class="text-lg font-semibold mb-4">Email Settings</h3>
                <div class="space-y-4">
                    <div class="flex items-center">
                        <Checkbox 
                            v-model="settings.auto_send_acknowledgment_email" 
                            inputId="auto_acknowledgment" 
                            binary />
                        <label for="auto_acknowledgment" class="ml-2">
                            <span class="font-medium">Auto-send Acknowledgment Emails</span>
                            <p class="text-sm text-gray-500">Automatically send acknowledgment emails after final submission</p>
                        </label>
                    </div>

                    <div class="flex items-center">
                        <Checkbox 
                            v-model="settings.auto_send_notification_email" 
                            inputId="auto_notification" 
                            binary />
                        <label for="auto_notification" class="ml-2">
                            <span class="font-medium">Auto-send Admission Notification Emails</span>
                            <p class="text-sm text-gray-500">Automatically send admission notification emails after publication</p>
                        </label>
                    </div>

                    <div class="flex items-center">
                        <Checkbox 
                            v-model="settings.auto_send_verification_email" 
                            inputId="auto_verification" 
                            binary />
                        <label for="auto_verification" class="ml-2">
                            <span class="font-medium">Auto-send Verification Slip Emails</span>
                            <p class="text-sm text-gray-500">Automatically send verification slip emails after acceptance fee payment</p>
                        </label>
                    </div>

                    <div class="flex items-center">
                        <Checkbox 
                            v-model="settings.auto_send_admission_letter_email" 
                            inputId="auto_admission_letter" 
                            binary />
                        <label for="auto_admission_letter" class="ml-2">
                            <span class="font-medium">Auto-send Admission Letter Emails</span>
                            <p class="text-sm text-gray-500">Automatically send admission letter emails when issued</p>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Template Editor Modal -->
        <Dialog 
            :header="templateEditorTitle" 
            v-model:visible="showTemplateEditor" 
            class="w-[90%] max-w-6xl" 
            :modal="true">
            <TemplateEditor 
                v-if="currentTemplate"
                :template-type="currentTemplate"
                @template-saved="onTemplateSaved" />
        </Dialog>

        <!-- Template Preview Modal -->
        <Dialog 
            :header="templatePreviewTitle" 
            v-model:visible="showTemplatePreview" 
            class="w-[80%] max-w-4xl" 
            :modal="true">
            <TemplatePreview 
                v-if="currentTemplate"
                :template-type="currentTemplate" />
        </Dialog>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import TemplateEditor from './components/TemplateEditor.vue';
import TemplatePreview from './components/TemplatePreview.vue';

export default {
    name: 'AdmissionSettings',
    components: {
        Button,
        RadioButton,
        Checkbox,
        Dialog,
        TemplateEditor,
        TemplatePreview
    },
    data() {
        return {
            loading: false,
            saving: false,
            settings: {
                admission_letter_process_mode: 'manual',
                auto_send_acknowledgment_email: true,
                auto_send_notification_email: true,
                auto_send_verification_email: true,
                auto_send_admission_letter_email: true
            },
            showTemplateEditor: false,
            showTemplatePreview: false,
            currentTemplate: null
        }
    },
    computed: {
        templateEditorTitle() {
            const titles = {
                'acknowledgment': 'Edit Acknowledgment Letter Template',
                'notification': 'Edit Admission Notification Template',
                'verification': 'Edit Verification Slip Template',
                'admission': 'Edit Admission Letter Template'
            };
            return titles[this.currentTemplate] || 'Edit Template';
        },
        templatePreviewTitle() {
            const titles = {
                'acknowledgment': 'Acknowledgment Letter Preview',
                'notification': 'Admission Notification Preview',
                'verification': 'Verification Slip Preview',
                'admission': 'Admission Letter Preview'
            };
            return titles[this.currentTemplate] || 'Template Preview';
        }
    },
    mounted() {
        this.loadSettings();
    },
    methods: {
        async loadSettings() {
            this.loading = true;
            try {
                const response = await get(this.$endpoints.staff.configuration.getAdmissionSettings.url);
                if (response && !response.error) {
                    this.settings = { ...this.settings, ...response };
                }
            } catch (error) {
                console.error('Error loading settings:', error);
                this.$globals.showMessage('Failed to load settings', 'error');
            } finally {
                this.loading = false;
            }
        },

        async saveSettings() {
            this.saving = true;
            try {
                const response = await post(this.$endpoints.staff.configuration.saveAdmissionSettings.url, this.settings);
                if (response && !response.error) {
                    this.$globals.showMessage('Settings saved successfully', 'success');
                }
            } catch (error) {
                console.error('Error saving settings:', error);
                this.$globals.showMessage('Failed to save settings', 'error');
            } finally {
                this.saving = false;
            }
        },

        editTemplate(templateType) {
            this.currentTemplate = templateType;
            this.showTemplateEditor = true;
        },

        previewTemplate(templateType) {
            this.currentTemplate = templateType;
            this.showTemplatePreview = true;
        },

        onTemplateSaved() {
            this.showTemplateEditor = false;
            this.$globals.showMessage('Template saved successfully', 'success');
        }
    }
}
</script>
