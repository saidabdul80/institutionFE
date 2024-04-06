import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import userMiddleware from '../middleware/auth.js';
import StafIndex from '../views/Staff/StaffIndex.vue';
import ApplicantIndex from '../views/Application/ApplicantIndex.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // Group routes for application user
    {
      path: '/application',
      component: ApplicantIndex, // Empty component for grouping
      children: [
        {
          path: 'login',
          name: 'applicant-login',
          component: () => import('../views/Application/Home.vue'),
          meta: { user_type: 'applicant' }
        },
        {
          path: '',
          name: 'application-home',
          component: () => import('@/components/Application/Announcement.vue'),
          meta: { user_type: 'applicant' }
        },
        // Add more routes for application user as needed
      ]
    },
    // Group routes for student user
    {
      path: '/student',
      component: {
        render: () => null
      }, // Empty component for grouping
      children: [
        {
          path: 'login',
          name: 'student-login',
          component: () => import('../views/Student/Login.vue'),
          meta: { user_type: 'student' }
        },
        {
          path: '',
          name: 'student-home',
          component: () => import('../views/Student/Home.vue'),
          meta: { requiresStudentAuth: true }
        },
        // Add more routes for student user as needed
      ]
    },
    // Group routes for staff user
    {
      path: '/staff',
      component: StafIndex, // Empty component for grouping     
      children: [
        {
          path: '',
          name: 'staff-home',
          component: () => import('../views/Staff/Home.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'invoice_types',
          name: 'staff-invoice-types',
          component: () => import('../views/Staff/Preference/InvoiceTypes.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'faculty',
          name: 'staff-faculty',
          component: () => import('../views/Staff/Preference/FacultyPage.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'department',
          name: 'staff-department',
          component: () => import('../views/Staff/Preference/DepartmentPage.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'course_category',
          name: 'staff-course-category',
          component: () => import('../views/Staff/Preference/CourseCategory.vue'),
          meta: { requiresStaffAuth: true }
        },        
        {
          path: 'courses',
          name: 'staff-courses',
          component: () => import('../views/Staff/Preference/CoursePage.vue'),
          meta: { requiresStaffAuth: true }
        }, 
        {
          path: 'programme',
          name: 'staff-programme',
          component: () => import('../views/Staff/Preference/ProgramPage.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'programme_courses',
          name: 'staff-programme-courses',
          component: () => import('../views/Staff/Preference/ProgramCourse.vue'),
          meta: { requiresStaffAuth: true }
        },        
        {
          path: 'staff',
          name: 'staff-staff',
          component: () => import('../views/Staff/Staff.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'signatories',
          name: 'staff-signatories',
          component: () => import('../views/Staff/Preference/InvoiceTypes.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'sessions',
          name: 'staff-session',
          component: () => import('../views/Staff/Preference/SessionPage.vue'),
          meta: { requiresStaffAuth: true }
        },  
        {
          path: 'level',
          name: 'staff-level',
          component: () => import('../views/Staff/Preference/LevelPage.vue'),
          meta: { requiresStaffAuth: true }
        },
        {
          path: 'controls',
          name: 'staff-control',
          component: () => import('../views/Staff/Preference/ControlPage.vue'),
          meta: { requiresStaffAuth: true }
        },
        // Add more routes for staff user as needed
      ]
    },
    {
      path: '/staff/login',
      name: 'staff-login',
      component: () => import('../views/Staff/Login.vue'),
      meta: { user_type: 'staff' }
    },
  ]
})

router.beforeEach(userMiddleware);
export default router
