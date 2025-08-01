import { createRouter, createWebHistory } from 'vue-router';
import StaffIndex from '../views/Staff/StaffIndex.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/application/login',
      name: 'applicant-login',
      component: () => import('../views/Application/Login.vue'),
      meta: { user_type: 'applicant', require: false }
    },
    {
      path: '/application/register',
      name: 'applicant-register',
      component: () => import('../views/Application/Register.vue'),
      meta: { user_type: 'applicant', require: false }
    },
    {
      path: '/application',
      component: () => import('../views/Application/ApplicantIndex.vue'),
      children: [
        {
          path: '',
          name: 'applicant-index',
          component: () => import('../views/Application/Home.vue'),
          meta: { user_type: 'applicant', require: true }
        },
        {
          path: 'application',
          name: 'applicant-application',
          component: () => import('../views/Application/MyApplication.vue'),
          meta: { user_type: 'applicant', require: true }
        },
        {
          path: 'payments',
          name: 'applicant-payments',
          component: () => import('../views/Application/Payments.vue'),
          meta: { user_type: 'applicant', require: true }
        },
        {
          path: 'documents',
          name: 'applicant-documents',
          component: () => import('../views/Application/Documents.vue'),
          meta: { user_type: 'applicant', require: true }
        },
        {
          path: 'profile',
          name: 'applicant-profile',
          component: () => import('../views/Application/Profile.vue'),
          meta: { user_type: 'applicant', require: true }
        }
      ]
    },
    // Group routes for student user
    {
      path: '/student',
      component: () => import('../views/Student/StudentIndex.vue'),
      children: [
        {
          path: '',
          name: 'student-home',
          component: () => import('../views/Student/Home.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'profile',
          name: 'student-profile',
          component: () => import('../views/Student/Profile.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'courses',
          name: 'student-courses',
          component: () => import('../views/Student/CourseRegistration.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'results',
          name: 'student-results',
          component: () => import('../views/Student/Results.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'payments',
          name: 'student-payments',
          component: () => import('../views/Student/Payments.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'invoices',
          name: 'student-invoices',
          component: () => import('../views/Student/Invoices.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'wallet',
          name: 'student-wallet',
          component: () => import('../views/Student/Wallet.vue'),
          meta: { user_type: 'student', require: true }
        },
        {
          path: 'documents',
          name: 'student-documents',
          component: () => import('../views/Student/Documents.vue'),
          meta: { user_type: 'student', require: true }
        }
      ]
    },
    {
      path: '/student/login',
      name: 'student-login',
      component: () => import('../views/Student/Login.vue'),
      meta: { user_type: 'student', require: false }
    },
    // Group routes for staff user
    {
      path: '/staff',
      component: StaffIndex, // Main component for grouping
      children: [
        {
          path: '',
          name: 'staff-home',
          component: () => import('../views/Staff/Home.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'invoice_types',
          name: 'staff-invoice-types',
          component: () => import('../views/Staff/Preference/InvoiceTypes.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'faculty',
          name: 'staff-faculty',
          component: () => import('../views/Staff/Preference/FacultyPage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'department',
          name: 'staff-department',
          component: () => import('../views/Staff/Preference/DepartmentPage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'course_category',
          name: 'staff-course-category',
          component: () => import('../views/Staff/Preference/CourseCategory.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'courses',
          name: 'staff-courses',
          component: () => import('../views/Staff/Preference/CoursePage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'my-courses',
          name: 'staff-my-courses',
          component: () => import('../views/Staff/Courses/StaffCourseManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'programme',
          name: 'staff-programme',
          component: () => import('../views/Staff/Preference/ProgramPage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'programme_courses',
          name: 'staff-programme-courses',
          component: () => import('../views/Staff/Preference/ProgramCourse.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'staff',
          name: 'staff-staff',
          component: () => import('../views/Staff/Staff.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'signatories',
          name: 'staff-signatories',
          component: () => import('../views/Staff/Preference/InvoiceTypes.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'sessions',
          name: 'staff-session',
          component: () => import('../views/Staff/Preference/SessionPage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'level',
          name: 'staff-level',
          component: () => import('../views/Staff/Preference/LevelPage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'controls',
          name: 'staff-control',
          component: () => import('../views/Staff/Preference/ControlPage.vue'),
          meta: { user_type: 'staff', require: true }
        },
        // Student Management Routes
        {
          path: 'students',
          name: 'staff-students',
          component: () => import('../views/Staff/Students/StudentManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'students/profile/:id',
          name: 'staff-student-profile',
          component: () => import('../views/Staff/Students/StudentProfile.vue'),
          meta: { user_type: 'staff', require: true }
        },
        // Applicant Management Routes
        {
          path: 'applicants',
          name: 'staff-applicants',
          component: () => import('../views/Staff/Applicants/ApplicantManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'courses/allocation',
          name: 'staff-course-allocation',
          component: () => import('../views/Staff/Courses/StaffCourseAllocation.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'applicants/dashboard',
          name: 'staff-applicant-dashboard',
          component: () => import('../views/Staff/Applicants/ApplicantDashboard.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'applicants/admission',
          name: 'staff-admission',
          component: () => import('../views/Staff/Applicants/AdmissionManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'applicants/qualification',
          name: 'staff-qualification',
          component: () => import('../views/Staff/Applicants/QualificationManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'applicants/import',
          name: 'staff-applicant-import',
          component: () => import('../views/Staff/Applicants/ApplicantImportManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        // Result Management Routes
        {
          path: 'results',
          name: 'staff-results',
          component: () => import('../views/Staff/Results/ResultManagement.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'results/input',
          name: 'staff-result-input',
          component: () => import('../views/Staff/Results/ResultInput.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'results/computation',
          name: 'staff-result-computation',
          component: () => import('../views/Staff/Results/ResultComputation.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'results/transcript',
          name: 'staff-transcript',
          component: () => import('../views/Staff/Results/TranscriptGeneration.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'results/advanced-compilation',
          name: 'staff-advanced-result-compilation',
          component: () => import('../views/Staff/Results/AdvancedResultCompilation.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'results/gpa-tracking',
          name: 'staff-gpa-tracking',
          component: () => import('../views/Staff/Results/StudentGpaTracking.vue'),
          meta: { user_type: 'staff', require: true }
        },
        // Score Input Routes
        {
          path: 'scores',
          name: 'staff-scores',
          component: () => import('../views/Staff/Scores/ScoreInput.vue'),
          meta: { user_type: 'staff', require: true }
        },
        {
          path: 'scores/batch',
          name: 'staff-batch-scores',
          component: () => import('../views/Staff/Scores/BatchScoreInput.vue'),
          meta: { user_type: 'staff', require: true }
        },
        // Grade Settings Route
        {
          path: 'grade-settings',
          name: 'staff-grade-settings',
          component: () => import('../views/Staff/Preference/GradeSettings.vue'),
          meta: { user_type: 'staff', require: true }
        },
        // Dashboard Route
        {
          path: 'dashboard',
          name: 'staff-dashboard',
          component: () => import('../views/Staff/Dashboard/StaffDashboard.vue'),
          meta: { user_type: 'staff', require: true }
        }
      ]
    },
    {
      path: '/staff/login',
      name: 'staff-login',
      component: () => import('../views/Staff/Login.vue'),
      meta: { user_type: 'staff', require: false }
    },
  ]
});

// Route guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  console.log('Router guard:', {
    to: to.name,
    from: _from.name,
    isAuthenticated: authStore.isAuthenticated,
    userType: authStore.userType,
    requireAuth: to.meta?.require,
    expectedUserType: to.meta?.user_type
  });

  // Skip guard for home page and public routes
  if (to.name === 'home' || to.name === 'about' || !to.meta) {
    console.log('Skipping guard for public route');
    return next();
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (authStore.isAuthenticated && to.name && to.name.includes('login')) {
    console.log('Authenticated user trying to access login page, redirecting...');
    if (authStore.userType === 'staff') {
      return next({ name: 'staff-home' });
    } else if (authStore.userType === 'student') {
      return next({ name: 'student-home' });
    } else if (authStore.userType === 'applicant') {
      return next({ name: 'applicant-index' });
    }
    return next();
  }

  // Check if route requires authentication
  if (to.meta.require === true) {
    console.log('Route requires authentication');
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      // Redirect to appropriate login page based on route meta
      if (to.meta.user_type === 'staff') {
        return next({ name: 'staff-login' });
      } else if (to.meta.user_type === 'student') {
        return next({ name: 'student-login' });
      } else if (to.meta.user_type === 'applicant') {
        return next({ name: 'applicant-login' });
      }
      return next({ name: 'home' });
    }

    // Check if user type matches route requirement
    if (to.meta.user_type && authStore.userType !== to.meta.user_type) {
      console.log('User type mismatch, redirecting to appropriate dashboard');
      // Redirect to appropriate dashboard
      if (authStore.userType === 'staff') {
        return next({ name: 'staff-home' });
      } else if (authStore.userType === 'student') {
        return next({ name: 'student-home' });
      } else if (authStore.userType === 'applicant') {
        return next({ name: 'applicant-index' });
      }
      return next({ name: 'home' });
    }
  }

  console.log('Router guard allowing navigation to:', to.name);
  // Continue with navigation
  next();
});

export default router;
