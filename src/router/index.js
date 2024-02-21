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
          component: () => import('../views/Application/Home.vue'),
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
          path: 'login',
          name: 'staff-login',
          component: () => import('../views/Staff/Login.vue'),
          meta: { user_type: 'staff' }
        },
        {
          path: '',
          name: 'staff-home',
          component: () => import('../views/Staff/Home.vue'),
          meta: { requiresStaffAuth: true }
        },
        // Add more routes for staff user as needed
      ]
    }
  ]
})

router.beforeEach(userMiddleware);
export default router
