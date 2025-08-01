/**
 * School Info Mixin
 * 
 * This mixin provides easy access to school information data that's already loaded
 * from the api/school-info endpoint. It eliminates the need for individual API calls
 * to get sessions, levels, programmes, faculties, departments, etc.
 */

export const schoolInfoMixin = {
    computed: {
        // Basic school information
        schoolInfo() {
            return this.$globals.school_info || {};
        },
        schoolGateways() {
            return this.schoolInfo.gateways || [];
        },
        
        schoolName() {
            return this.schoolInfo.school_name || 'Institution';
        },
        
        schoolShortName() {
            return this.schoolInfo.school_short_name || 'INST';
        },
        
        schoolLogo() {
            return this.schoolInfo.logo;
        },

        // Academic data from school info
        schoolSessions() {
            return this.schoolInfo.sessions || [];
        },
        
        schoolLevels() {
            return this.schoolInfo.levels || [];
        },
        
        schoolProgrammes() {
            return this.schoolInfo.programmes || [];
        },
        
        schoolFaculties() {
            return this.schoolInfo.faculties || [];
        },
        
        schoolDepartments() {
            return this.schoolInfo.departments || [];
        },
        
        schoolSemesters() {
            return this.schoolInfo.semesters || [];
        },
        
        schoolProgrammeTypes() {
            return this.schoolInfo.programme_types || [];
        },
        
        schoolEntryModes() {
            return this.schoolInfo.entry_modes || [];
        },
        
        schoolCountries() {
            return this.schoolInfo.countries || [];
        },
        
        schoolPaymentTypes() {
            return this.schoolInfo.payment_types || [];
        },
        
        schoolCourseCategories() {
            return this.schoolInfo.course_categories || [];
        },

        // Configuration helpers
        schoolConfigurations() {
            return this.schoolInfo.configurations || [];
        },
        
        currentSession() {
            const config = this.schoolConfigurations.find(c => c.name === 'current_session');
            return this.getSessionById(config.value)?.name;
        },
        
        currentSemester() {
            const config = this.schoolConfigurations.find(c => c.name === 'current_semester');
            return this.getSemesterById(config.value)?.name;
        },
        
         currentSessionId() {
            const config = this.schoolConfigurations.find(c => c.name === 'current_session');
            return config ? config.value : null;
        },
        
        currentSemesterId() {
            const config = this.schoolConfigurations.find(c => c.name === 'current_semester');
            return config ? config.value : null;
        },
        
        currentApplicationSession() {
            const config = this.schoolConfigurations.find(c => c.name === 'current_application_session');
            return config ? config.value : null;
        },
        
        graduationMinCGPA() {
            const config = this.schoolConfigurations.find(c => c.name === 'grad_min_cgpa');
            return config ? parseFloat(config.value) : 1.50;
        },
        
        graduationLevelId() {
            const config = this.schoolConfigurations.find(c => c.name === 'grad_level_id');
            return config ? config.value : null;
        },
        
        graduationMinCreditUnits() {
            const config = this.schoolConfigurations.find(c => c.name === 'grad_min_credit_units');
            return config ? parseInt(config.value) : 10;
        },

        // Feature flags from configurations
        isApplicantRegistrationEnabled() {
            return this.getConfigurationBoolean('applicant_registration');
        },
        
        isAcceptanceFeeEnabled() {
            return this.getConfigurationBoolean('enable_acceptance_fee');
        },
        
        isFacultyEnabled() {
            return this.getConfigurationBoolean('enable_faculty');
        },
        
        isDepartmentEnabled() {
            return this.getConfigurationBoolean('enable_department');
        },
        
        isEntryModeEnabled() {
            return this.getConfigurationBoolean('enable_entry_mode');
        },
        
        isProgrammeTypeEnabled() {
            return this.getConfigurationBoolean('enable_programme_type');
        },
        
        isCourseRegistrationAllowed() {
            return this.getConfigurationBoolean('allow_course_registration');
        },
        
        arePaymentsAllowed() {
            return this.getConfigurationBoolean('allow_payments');
        },
        
        isJambRequiredForApplication() {
            return this.getConfigurationBoolean('required_jamb_for_application');
        },

        // Photo display settings
        showPhotoOnReceipt() {
            return this.getConfigurationBoolean('show_photo_on_receipt');
        },
        
        showPhotoOnResultSlip() {
            return this.getConfigurationBoolean('show_photo_on_result_slip');
        },
        
        showPhotoOnInvoice() {
            return this.getConfigurationBoolean('show_photo_on_invoice');
        },
        
        showPhotoOnCourseReg() {
            return this.getConfigurationBoolean('show_photo_on_course_reg');
        },
        
        showPhotoOnExamCard() {
            return this.getConfigurationBoolean('show_photo_on_exam_card');
        },

        // Formatted data helpers
        sessionsForDropdown() {
            return this.schoolSessions.map(session => ({
                label: session.name,
                value: session.id
            }));
        },
        
        levelsForDropdown() {
            return this.schoolLevels.map(level => ({
                label: `${level.title} Level`,
                value: level.id
            }));
        },
        
        programmesForDropdown() {
            return this.schoolProgrammes.map(programme => ({
                label: programme.name,
                value: programme.id
            }));
        },
        
        facultiesForDropdown() {
            return this.schoolFaculties.map(faculty => ({
                label: faculty.name,
                value: faculty.id
            }));
        },
        
        departmentsForDropdown() {
            return this.schoolDepartments.map(department => ({
                label: department.name,
                value: department.id
            }));
        },
        
        semestersForDropdown() {
            return this.schoolSemesters.map(semester => ({
                label: this.formatSemesterName(semester.name),
                value: semester.id
            }));
        },
        
        programmeTypesForDropdown() {
            return this.schoolProgrammeTypes.map(type => ({
                label: type.name,
                value: type.id
            }));
        },
        
        entryModesForDropdown() {
            return this.schoolEntryModes.map(mode => ({
                label: mode.title,
                value: mode.id
            }));
        },
        
        countriesForDropdown() {
            return this.schoolCountries.map(country => ({
                label: country.name,
                value: country.id
            }));
        }
    },
    
    methods: {
        /**
         * Get configuration value by name
         */
        getConfigurationValue(name) {
            const config = this.schoolConfigurations.find(c => c.name === name);
            return config ? config.value : null;
        },
        
        
        /**
         * Get configuration as boolean
         */
        getConfigurationBoolean(name) {
            const value = this.getConfigurationValue(name);
            return value === 'true' || value === true;
        },
        
        /**
         * Get session by ID
         */
        getSessionById(sessionId) {
            return this.schoolSessions.find(session => session.id == sessionId);
        },
        
        /**
         * Get level by ID
         */
        getLevelById(levelId) {
            return this.schoolLevels.find(level => level.id == levelId);
        },
        
        /**
         * Get programme by ID
         */
        getProgrammeById(programmeId) {
            return this.schoolProgrammes.find(programme => programme.id == programmeId);
        },
        
        /**
         * Get faculty by ID
         */
        getFacultyById(facultyId) {
            return this.schoolFaculties.find(faculty => faculty.id == facultyId);
        },
        
        /**
         * Get department by ID
         */
        getDepartmentById(departmentId) {
            return this.schoolDepartments.find(department => department.id == departmentId);
        },
        
        /**
         * Get semester by ID
         */
        getSemesterById(semesterId) {
            return this.schoolSemesters.find(semester => semester.id == semesterId);
        },
        
        /**
         * Format semester name for display
         */
        formatSemesterName(semesterName) {
            const names = {
                'first': 'First Semester',
                'second': 'Second Semester',
                'third': 'Third Semester'
            };
            return names[semesterName] || `${semesterName} Semester`;
        },
        
        /**
         * Get programmes by faculty ID
         */
        getProgrammesByFaculty(facultyId) {
            return this.schoolProgrammes.filter(programme => programme.faculty_id == facultyId);
        },
        
        /**
         * Get programmes by department ID
         */
        getProgrammesByDepartment(departmentId) {
            return this.schoolProgrammes.filter(programme => programme.department_id == departmentId);
        },
        
        /**
         * Get programmes by programme type ID
         */
        getProgrammesByType(programmeTypeId) {
            return this.schoolProgrammes.filter(programme => programme.programme_type_id == programmeTypeId);
        },
        
        /**
         * Get departments by faculty ID
         */
        getDepartmentsByFaculty(facultyId) {
            return this.schoolDepartments.filter(department => department.faculty_id == facultyId);
        },
        
        /**
         * Check if school info is loaded
         */
        isSchoolInfoLoaded() {
            return Object.keys(this.schoolInfo).length > 0;
        },
        
        /**
         * Wait for school info to be loaded
         */
        async waitForSchoolInfo(maxWait = 5000) {
            const startTime = Date.now();
            while (!this.isSchoolInfoLoaded() && (Date.now() - startTime) < maxWait) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.isSchoolInfoLoaded();
        }
    }
};
