<template>
    <div class="admission-letter-preview">
        <!-- Applicant Information -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 class="font-semibold text-lg mb-2">{{ applicant.full_name }}</h3>
                    <div class="space-y-1 text-sm">
                        <p><span class="font-medium">Application No:</span> {{ applicant.application_number }}</p>
                        <p><span class="font-medium">Email:</span> {{ applicant.email }}</p>
                        <p><span class="font-medium">Phone:</span> {{ applicant.phone_number }}</p>
                    </div>
                </div>
                <div>
                    <div class="space-y-1 text-sm">
                        <p><span class="font-medium">Programme:</span> {{ applicant.programme_name }}</p>
                        <p><span class="font-medium">Faculty:</span> {{ applicant.faculty }}</p>
                        <p><span class="font-medium">Department:</span> {{ applicant.department }}</p>
                        <p><span class="font-medium">Verification Status:</span> 
                            <Tag value="VERIFIED" severity="success" class="text-xs ml-1" />
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Letter Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Letter Content -->
            <div>
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-semibold">Admission Letter Preview</h4>
                    <div class="flex items-center gap-2">
                        <Button 
                            icon="fa fa-refresh" 
                            size="small" 
                            outlined 
                            @click="generatePreview"
                            :loading="generating" />
                        <Button 
                            icon="fa fa-external-link-alt" 
                            size="small" 
                            outlined 
                            @click="openPreviewInNewTab"
                            :disabled="!letterHtml" />
                    </div>
                </div>

                <div class="border rounded-lg bg-white" style="height: 600px;">
                    <div v-if="generating" class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <i class="fa fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Generating letter preview...</p>
                        </div>
                    </div>

                    <div v-else-if="!letterHtml" class="flex items-center justify-center h-full text-gray-500">
                        <div class="text-center">
                            <i class="fa fa-file-alt text-4xl mb-4"></i>
                            <p>Click "Generate Preview" to see the admission letter</p>
                        </div>
                    </div>

                    <iframe 
                        v-else
                        :srcdoc="letterHtml"
                        class="w-full h-full rounded-lg"
                        frameborder="0">
                    </iframe>
                </div>
            </div>

            <!-- Issue Letter Form -->
            <div>
                <h4 class="font-semibold mb-4">Issue Admission Letter</h4>
                
                <div class="space-y-4">
                    <!-- Letter Type -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Letter Type</label>
                        <Select 
                            v-model="letterForm.letter_type" 
                            :options="letterTypes" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Select letter type"
                            class="w-full" />
                    </div>

                    <!-- Issue Date -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                        <Calendar 
                            v-model="letterForm.issue_date" 
                            dateFormat="yy-mm-dd"
                            placeholder="Select issue date"
                            class="w-full" />
                    </div>

                    <!-- Issued By -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Issued By</label>
                        <InputText 
                            v-model="letterForm.issued_by" 
                            placeholder="Name of issuing officer"
                            class="w-full" />
                    </div>

                    <!-- Additional Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                        <Textarea 
                            v-model="letterForm.notes"
                            rows="3"
                            placeholder="Any additional notes or instructions..."
                            class="w-full" />
                    </div>

                    <!-- Send Email Option -->
                    <div class="flex items-center">
                        <Checkbox 
                            v-model="letterForm.send_email" 
                            inputId="send_email" 
                            binary />
                        <label for="send_email" class="ml-2 text-sm">Send admission letter via email</label>
                    </div>

                    <!-- Process Mode (if configurable) -->
                    <div v-if="showProcessModeOption" class="p-4 bg-blue-50 rounded-lg">
                        <h5 class="font-medium text-blue-900 mb-2">Process Mode</h5>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <RadioButton 
                                    v-model="letterForm.process_mode" 
                                    inputId="manual" 
                                    value="manual" />
                                <label for="manual" class="ml-2 text-sm">Manual Review (Requires approval)</label>
                            </div>
                            <div class="flex items-center">
                                <RadioButton 
                                    v-model="letterForm.process_mode" 
                                    inputId="automatic" 
                                    value="automatic" />
                                <label for="automatic" class="ml-2 text-sm">Automatic Issue (Immediate)</label>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3 pt-4">
                        <Button 
                            label="Issue Admission Letter" 
                            icon="fa fa-certificate" 
                            severity="success"
                            @click="issueAdmissionLetter"
                            :loading="issuing"
                            :disabled="!canIssueLetter" />
                        <Button 
                            label="Save as Draft" 
                            icon="fa fa-save" 
                            outlined
                            @click="saveAsDraft"
                            :loading="saving" />
                    </div>
                </div>

                <!-- Verification Checklist -->
                <div class="mt-6 p-4 bg-green-50 rounded-lg">
                    <h5 class="font-medium text-green-900 mb-3">Pre-Issue Checklist</h5>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center">
                            <i class="fa fa-check-circle text-green-600 mr-2"></i>
                            <span>Documents verified and approved</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fa fa-check-circle text-green-600 mr-2"></i>
                            <span>Acceptance fee payment confirmed</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fa fa-check-circle text-green-600 mr-2"></i>
                            <span>Applicant meets admission requirements</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fa fa-check-circle text-green-600 mr-2"></i>
                            <span>Programme capacity available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post } from '@/api/client';
import Button from 'primevue/button';
//import Tag from 'primevue/tag';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';

export default {
    name: 'AdmissionLetterPreview',
    components: {
        Button,
        //Tag,
        Select,
        InputText,
        Textarea,
        Calendar,
        Checkbox,
        RadioButton
    },
    props: {
        applicant: {
            type: Object,
            required: true
        }
    },
    emits: ['letter-issued'],
    data() {
        return {
            letterHtml: null,
            generating: false,
            issuing: false,
            saving: false,
            letterForm: {
                letter_type: 'standard',
                issue_date: new Date(),
                issued_by: '',
                notes: '',
                send_email: true,
                process_mode: 'manual'
            },
            letterTypes: [
                { label: 'Standard Admission Letter', value: 'standard' },
                { label: 'Conditional Admission Letter', value: 'conditional' },
                { label: 'Provisional Admission Letter', value: 'provisional' }
            ],
            showProcessModeOption: false
        }
    },
    computed: {
        canIssueLetter() {
            return this.letterForm.letter_type && 
                   this.letterForm.issue_date && 
                   this.letterForm.issued_by.trim() !== '';
        }
    },
    mounted() {
        this.loadConfiguration();
        this.generatePreview();
    },
    methods: {
        async loadConfiguration() {
            try {
                const response = await get(this.$endpoints.staff.admission.getAdmissionConfiguration.url);
                if (response && !response.error) {
                    this.showProcessModeOption = response.admission_letter_process_mode === 'configurable';
                    this.letterForm.process_mode = response.default_process_mode || 'manual';
                }
            } catch (error) {
                console.error('Error loading configuration:', error);
            }
        },

        async generatePreview() {
            this.generating = true;
            try {
                const response = await post(this.$endpoints.staff.admission.generateAdmissionLetterPreview.url, {
                    applicant_id: this.applicant.id,
                    letter_type: this.letterForm.letter_type,
                    issue_date: this.letterForm.issue_date,
                    issued_by: this.letterForm.issued_by,
                    notes: this.letterForm.notes
                });

                if (response && !response.error) {
                    this.letterHtml = response.letter_html;
                }
            } catch (error) {
                console.error('Error generating preview:', error);
                this.$globals.showMessage('Failed to generate letter preview', 'error');
            } finally {
                this.generating = false;
            }
        },

        async issueAdmissionLetter() {
            this.issuing = true;
            try {
                const response = await post(this.$endpoints.staff.admission.issueAdmissionLetter.url, {
                    applicant_id: this.applicant.id,
                    ...this.letterForm
                });

                if (response && !response.error) {
                    this.$globals.showMessage('Admission letter issued successfully', 'success');
                    this.$emit('letter-issued');
                }
            } catch (error) {
                console.error('Error issuing admission letter:', error);
                this.$globals.showMessage('Failed to issue admission letter', 'error');
            } finally {
                this.issuing = false;
            }
        },

        async saveAsDraft() {
            this.saving = true;
            try {
                const response = await post(this.$endpoints.staff.admission.saveAdmissionLetterDraft.url, {
                    applicant_id: this.applicant.id,
                    ...this.letterForm
                });

                if (response && !response.error) {
                    this.$globals.showMessage('Draft saved successfully', 'success');
                }
            } catch (error) {
                console.error('Error saving draft:', error);
                this.$globals.showMessage('Failed to save draft', 'error');
            } finally {
                this.saving = false;
            }
        },

        openPreviewInNewTab() {
            if (this.letterHtml) {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(this.letterHtml);
                newWindow.document.close();
            }
        }
    },
    watch: {
        'letterForm.letter_type'() {
            this.generatePreview();
        },
        'letterForm.issue_date'() {
            this.generatePreview();
        },
        'letterForm.issued_by'() {
            this.generatePreview();
        }
    }
}
</script>
