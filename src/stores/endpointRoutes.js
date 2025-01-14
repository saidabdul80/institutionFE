
export default {        
        schoolInfo:'api/school-info',
        getStates:{url:'api/states', method:'post'},
        getLgas:{url:'api/lgas', method:'post'},
        subjects:{url:'api/subjects', method:'get'},
        export:{url:'api/export', method:'post'},    
        getTemplates:{url:'api/templates', method:'get'},    
        createTemplate:{url:'api/templates', method:'post'},    
        updateTemplate:{url:'api/templates/update', method:'post'},    
        deleateTemplate:{url:'api/templates', method:'post'},              
        staff:{
            login: { url: 'api/staff/login', method: 'post' },
            logout: { url: 'api/staff/logout', method: 'post' },
            changeApplicantProgramme: { url: 'api/staff/staff/change_applicant_programme', method: 'post' },
            changePassword: { url: 'api/staff/staff/change_password', method: 'post' },
            resetPassword: { url: 'api/staff/staff/reset_password', method: 'post' },
            updateStaff: { url: 'api/staff/staff/update', method: 'post' },
            createStaff: { url: 'api/staff/staff/create', method: 'post' },
            bulkUploadStaff: { url: 'api/staff/staff/bulk_upload', method: 'post' },
            deactivateStaff: { url: 'api/staff/staff/deactivate', method: 'post' },
            activateStaff: { url: 'api/staff/staff/activate', method: 'post' },
            deassignRole: { url: 'api/staff/staff/deassign_role', method: 'post' },
            assignRole: { url: 'api/staff/staff/assign_role', method: 'post' },
            staffByRole: { url: 'api/staff/staff/staff_by_role', method: 'post' },
            staffs: { url: 'api/staff/staff/staffs', method: 'post' },
            uploadPicture: { url: 'api/staff/staff/uploadPicture', method: 'post' },
            applicationFees: { url: 'api/staff/staff/application_fees', method: 'post' },
            getStaffById: { url: 'api/staff/staff/{id?}', method: 'get' },
            staffCourses: { url: 'api/staff/staff/staff_courses/{staff_id?}', method: 'get' },
            assignCourse: { url: 'api/staff/staff/assign_course', method: 'post' },
            unassignCourse: { url: 'api/staff/staff/unassign_course', method: 'post' },
            getTemplate: { url: 'api/staff/staff/template', method: 'get' },
            getStaffCourses: { url: 'api/staff/staff/courses', method: 'get' },
            updateFaculty: { url: 'api/staff/faculty/update', method: 'post' },
            createFaculty: { url: 'api/staff/faculty/create', method: 'post' },
            bulkUploadFaculty: { url: 'api/staff/faculty/bulk_upload', method: 'post' },
            deactivateFaculty: { url: 'api/staff/faculty/deactivate', method: 'post' },
            activateFaculty: { url: 'api/staff/faculty/activate', method: 'post' },
            getFacultyTemplate: { url: 'api/staff/faculty/template', method: 'get' },
            getFaculties: { url: 'api/staff/faculty/faculties', method: 'get' },
            updateDepartment: { url: 'api/staff/department/update', method: 'post' },
            createDepartment: { url: 'api/staff/department/create', method: 'post' },
            bulkUploadDepartment: { url: 'api/staff/department/bulk_upload', method: 'post' },
            deactivateDepartment: { url: 'api/staff/department/deactivate', method: 'post' },
            activateDepartment: { url: 'api/staff/department/activate', method: 'post' },
            getDepartmentTemplate: { url: 'api/staff/department/template', method: 'get' },
            getDepartments: { url: 'api/staff/department/departments', method: 'get' },
            updateCourse: { url: 'api/staff/course/update', method: 'post' },
            createCourse: { url: 'api/staff/course/create', method: 'post' },
            bulkUploadCourse: { url: 'api/staff/course/bulk_upload', method: 'post' },
            deactivateCourse: { url: 'api/staff/course/deactivate', method: 'post' },
            activateCourse: { url: 'api/staff/course/activate', method: 'post' },
            getCourses: { url: 'api/staff/course/courses', method: 'get' },
            getOpenCourses: { url: 'api/open/courses', method: 'get' },
            getCourseTemplate: { url: 'api/staff/course/template', method: 'get' },
            updateCourseCategory: { url: 'api/staff/course_category/update', method: 'post' },
            createCourseCategory: { url: 'api/staff/course_category/create', method: 'post' },
            deactivateCourseCategory: { url: 'api/staff/course_category/deactivate', method: 'post' },
            activateCourseCategory: { url: 'api/staff/course_category/activate', method: 'post' },
            getCourseCategories: { url: 'api/staff/course_category/course_categories', method: 'get' },
            getCourseCategoriesWithInactive: { url: 'api/staff/course_category/course_categories_with_inactive', method: 'get' },
            getCourseCategoryById: { url: 'api/staff/course_category/id/{id}', method: 'get' },
            updateProgramme: { url: 'api/staff/programme/update', method: 'post' },
            createProgramme: { url: 'api/staff/programme/create', method: 'post' },
            bulkUploadProgramme: { url: 'api/staff/programme/bulk_upload', method: 'post' },
            deactivateProgramme: { url: 'api/staff/programme/deactivate', method: 'post' },
            activateProgramme: { url: 'api/staff/programme/activate', method: 'post' },
            getProgrammes: { url: 'api/staff/programme/programmes', method: 'get' },
            getProgrammeTemplate: { url: 'api/staff/programme/template', method: 'get' },
            assignProgrammeCourse: { url: 'api/staff/programme_course/assign_course', method: 'post' },
            updateProgrammeCourse: { url: 'api/staff/programme_course/update_programme_course', method: 'post' },
            unassignProgrammeCourse: { url: 'api/staff/programme_course/unassign_course', method: 'post' },
            getProgrammeCourses: { url: 'api/staff/programme_course/programme_courses', method: 'get' },
            createAdmissionBatch: { url: 'api/staff/admission_batch/create', method: 'post' },
            updateAdmissionBatch: { url: 'api/staff/admission_batch/update', method: 'post' },
            deleteAdmissionBatch: { url: 'api/staff/admission_batch/delete', method: 'post' },
            getAllAdmissionBatches: { url: 'api/staff/admission_batch/all', method: 'get' },
            createSession: { url: 'api/staff/sessions/create', method: 'post' },
            updateSession: { url: 'api/staff/sessions/update', method: 'post' },
            deleteSession: { url: 'api/staff/sessions/delete', method: 'post' },
            getAllSessions: { url: 'api/staff/sessions/all', method: 'get' },
            admissionDashboard: { url: 'api/staff/dashboard/admission', method: 'post' },
            reportDashboard: { url: 'api/staff/dashboard/report', method: 'post' },
            infoDashboard: { url: 'api/staff/dashboard/info', method: 'post' },
            financialDashboard: { url: 'api/staff/dashboard/financial', method: 'post' },
            paidApplicant: { url: 'api/staff/dashboard/paid_applicant', method: 'post' },
            paidStudents: { url: 'api/staff/dashboard/paid_students', method: 'post' },
            byPaymentCategory: { url: 'api/staff/dashboard/by_payment_category', method: 'post' },
            totalPaidByInvoiceTypeId: { url: 'api/staff/dashboard/total_paid_by_invoice_type_id', method: 'post' },
            totalPaidByPaymentName: { url: 'api/staff/dashboard/total_paid_by_payment_name', method: 'post' },
            feesReport: { url: 'api/staff/dashboard/fees_report', method: 'post' },
            invoicesByPaymentName: { url: 'api/staff/dashboard/invoices_by_payment_name', method: 'post' },
            sessionsFeeReport: { url: 'api/staff/dashboard/sessions_fee_report', method: 'post' },
            programmeTypesReport: { url: 'api/staff/dashboard/programme_types_report', method: 'post' },
            recentLogins: { url: 'api/staff/dashboard/recent_logins', method: 'post' },
            admissionReportAdmittedByProgramme: { url: 'api/staff/dashboard/admission_report_admitted_by_programme', method: 'post' },
            admissionReportAdmittedByProgrammeType: { url: 'api/staff/dashboard/admission_report_admitted_by_programme_type', method: 'post' },
            admissionReportQualifiedByProgramme: { url: 'api/staff/dashboard/admission_report_qualified_by_programme', method: 'post' },
            admissionReportQualifiedByProgrammeType: { url: 'api/staff/dashboard/admission_report_qualified_by_programme_type', method: 'post' },
            totalPaidAndUnpaid: { url: 'api/staff/dashboard/total_paid_and_unpaid', method: 'post' },
            totalPaidAndUnpaidByProgrammeType: { url: 'api/staff/dashboard/total_paid_and_unpaid_by_progamme_type', method: 'post' },
            totalPaidAndUnpaidByProgramme: { url: 'api/staff/dashboard/total_paid_and_unpaid_by_progamme', method: 'post' },
            studentByPhysicalChallenge: { url: 'api/staff/dashboard/student_by_physical_challenge', method: 'post' },
            applicantByPhysicalChallenge: { url: 'api/staff/dashboard/applicant_by_physical_challenge', method: 'post' },
            admittedByEntryMode: { url: 'api/staff/dashboard/admitted_by_entry_mode', method: 'post' },
            activeAndNonActiveStudent: { url: 'api/staff/dashboard/active_and_non_active_student', method: 'post' },
            studentRegisteredAndUnregisteredCount: { url: 'api/staff/dashboard/student_registered_and_unregistered_count', method: 'post' },
            schoolFeeTotalPaidAndUnpaid: { url: 'api/staff/dashboard/school_fee_total_paid_and_unpaid', method: 'post' },
            allFeeReport: { url: 'api/staff/dashboard/all_fee_report', method: 'post' },
            allFeeByDateRange: { url: 'api/staff/dashboard/all_fee_by_date_range', method: 'post' },
            candidatesCountBySponsorship: { url: 'api/staff/dashboard/candidates_count_by_sponsorship', method: 'post' },
            totalStudentsByLevel: { url: 'api/staff/dashboard/total_students_by_level', method: 'post' },
            totalStudentsByProgrammes: { url: 'api/staff/dashboard/total_students_by_programmes', method: 'post' },
            totalPaidAndUnpaidAmountByProgrammeType: { url: 'api/staff/dashboard/total_paid_and_unpaid_amount_by_programme_type', method: 'post' },
            totalPaidAndUnpaidAmountByLevelProgrammeType: { url: 'api/staff/dashboard/total_paid_and_unpaid_amount_by_level_programme_type', method: 'post' },
            totalPaidAndUnpaidAmountByLevelProgramme: { url: 'api/staff/dashboard/total_paid_and_unpaid_amount_by_level_programme', method: 'post' },
            totalPaidAndUnpaidAmountByProgramme: { url: 'api/staff/dashboard/total_paid_and_unpaid_amount_by_progamme', method: 'post' },
            walletReport: { url: 'api/staff/dashboard/wallet_report', method: 'post' },
            walletFundingLog: { url: 'api/staff/dashboard/wallet_funding_log', method: 'post' },
            walletSettlementLog: { url: 'api/staff/dashboard/wallet_settlement_log', method: 'post' },
            walletFunding: { url: 'api/staff/dashboard/wallet_funding', method: 'post' },
            paymentReports: { url: 'api/staff/dashboard/payment_reports', method: 'post' },
            updateApplicant: { url: 'api/staff/applicants/update', method: 'post' },
            exportApplicants: { url: 'api/staff/applicants/export', method: 'post' },
            updateStudent: { url: 'api/staff/student/update', method: 'post' },
            getStudents: { url: 'api/staff/student/students', method: 'post' },
            updateStudentStatus: { url: 'api/staff/student/status', method: 'post' },
            requeryPayment: { url: 'api/staff/student/requery/{payment_reference?}', method: 'post' },
            promoteStudents: { url: 'api/staff/student/promote_students', method: 'post' },
            reverseStudentPromotion: { url: 'api/staff/student/reverse_student_promotion', method: 'post' },
            promotionLogs: { url: 'api/staff/student/promotion_logs', method: 'get' },
            exportStudents: { url: 'api/staff/student/export', method: 'post' },
            updateSession: { url: 'api/staff/session/update', method: 'post' },
            createSession: { url: 'api/staff/session/create', method: 'post' },
            getSessions: { url: 'api/staff/session/sessions', method: 'get' },
            createProgrammeType: { url: 'api/staff/programme_type/create', method: 'post' },
            updateProgrammeType: { url: 'api/staff/programme_type/update', method: 'post' },
            deleteProgrammeType: { url: 'api/staff/programme_type/delete', method: 'post' },
            getProgrammeTypes: { url: 'api/staff/programme_type/all', method: 'get' },
            createInvoiceType: { url: 'api/staff/invoice_type/create', method: 'post' },
            updateInvoiceType: { url: 'api/staff/invoice_type/update', method: 'post' },
            deleteInvoiceType: { url: 'api/staff/invoice_type/delete', method: 'post' },
            updateInvoiceTypeStatus: { url: 'api/staff/invoice_type/update_status', method: 'post' },
            getInvoiceTypes: { url: 'api/staff/invoice_type/all', method: 'get' },
            manualConfirmation: { url: 'api/staff/invoice/manual_confirmation', method: 'post' },
            exportInvoices: { url: 'api/staff/invoice/export', method: 'post' },
            saveConfiguration: { url: 'api/staff/configuration/save', method: 'post' },
            getAllConfigurations: { url: 'api/staff/configuration/all', method: 'get' },
            getConfiguration: { url: 'api/staff/configuration/{name}', method: 'get' },
            givePermission: { url: 'api/staff/permission/give', method: 'post' },
            revokePermission: { url: 'api/staff/permission/revoke', method: 'post' },
            getPermissions: { url: 'api/staff/permission/permissions', method: 'get' },
            getStaffPermissions: { url: 'api/staff/permission/staff_permissions/{staff_id}', method: 'get' },
            createRole: { url: 'api/staff/role/create', method: 'post' },
            deleteRole: { url: 'api/staff/role/delete', method: 'post' },
            assignRoleToStaff: { url: 'api/staff/role/assign_role_to_staff', method: 'post' },
            unassignRoleFromStaff: { url: 'api/staff/role/unassign_role_from_staff', method: 'post' },
            updateRole: { url: 'api/staff/role/update', method: 'post' },
            addPermissionToRole: { url: 'api/staff/role/add_permission', method: 'get' },
            removePermissionFromRole: { url: 'api/staff/role/remove_permission', method: 'get' },
            getRolePermissions: { url: 'api/staff/role/get_role_permission', method: 'get' },
            getAllRoles: { url: 'api/staff/role/roles', method: 'get' },
            getRolesById: { url: 'api/staff/role/roles/{id?}', method: 'get' },
            getOfficeRoles: { url: 'api/staff/role/office_roles', method: 'get' },
            updateLevel: { url: 'api/staff/level/update', method: 'post' },
            getLevels: { url: 'api/staff/level/', method: 'get' },
            getOffices: { url: 'api/staff/management/offices', method: 'get' },
            confirmPayment: { url: 'api/staff/confirm_payment', method: 'post' },
            updateStudentInfo: { url: 'api/staff/update_student_info', method: 'post' },
            updateSchoolInfo: { url: 'api/staff/update_school_info', method: 'post' },
          },
        student:{

        },
        applicant:{
          applicantLoginPost: {
            url: "api/applicants/login",
            method: "post"
          },
          applicantLoginGet: {
            url: "api/applicants/login",
            method: "get"
          },
          applicantCreate: {
            url: "api/applicants/create",
            method: "post"
          },
          registrationProgress: {
            url: "api/applicants/registration_progress/{applicant_id}",
            method: "get"
          },
          aLevelResult: {
            url: "api/applicants/alevel/{id}",
            method: "get"
          },
          getDocuments: {
            url: "api/applicants/get_documents",
            method: "get"
          },
          updateApplicant: {
            url: "api/applicants/update",
            method: "post"
          },
          applicantLogout: {
            url: "api/applicants/logout",
            method: "post"
          },
          uploadPicture: {
            url: "api/applicants/uploadPicture",
            method: "post"
          },
          getApplicants: {
            url: "api/applicants/applicants",
            method: "post"
          },
          getOLevelResults: {
            url: "api/applicants/get_olevel_results",
            method: "post"
          },
          updateOLevelResults: {
            url: "api/applicants/olevel_results",
            method: "post"
          },
          updateDocument: {
            url: "api/applicants/update_documents",
            method: "post"
          },
          updateALevel: {
            url: "api/applicants/alevel",
            method: "post"
          },
          getWallet: {
            url: "api/applicants/wallet",
            method: "post"
          },
          storePayment: {
            url: "api/applicants/payment",
            method: "post"
          },
          getPayment: {
            url: "api/applicants/get_payment",
            method: "post"
          },
          getApplicantInvoices: {
            url: "api/applicants/invoices",
            method: "get"
          },
          generateInvoice: {
            url: "api/applicants/invoices/generate",
            method: "post"
          },
          initiatePayment: {
            url: "api/applicants/invoices/initiate_payment",
            method: "post"
          },
          paymentDetails: {
            url: "api/applicants/payments/details",
            method: "post"
          },
          getApplicantPayments: {
            url: "api/applicants/payments/{invoice_id}",
            method: "get"
          },
          requeryPayment: {
            url: "api/applicants/payments/requery/{payment_reference?}",
            method: "post"
          },
          payPayment: {
            url: "api/applicants/payments/pay",
            method: "post"
          },
          distinctPaymentDetails: {
            url: "api/applicants/payments/distinct_payment_details",
            method: "post"
          },
          getAllInvoiceTypes: {
            url: "api/applicants/payments/all_invoice_types",
            method: "post"
          }
        }
    }



