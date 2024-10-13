import { isLoggedIn, user } from '@/services/auth';

const userMiddleware = (to, from, next) => {
  const loginRoutes = ['applicant-login', 'staff-login', 'student-login'];
  const openRoutes = []; 

  // Check if the route is in the allowed routes
  if (!to.meta?.required) {
     next();
     return;
  }

  if (loginRoutes.includes(to.name)) {
    if (!isLoggedIn()) {
      return next(); // Allow navigation
    } else {
      return next(getLoginPage(user, to));
    }
  } else {
    if (!isLoggedIn()) {
      return next(getLoginPage(user, to));
    } else {
      if (user.user_type === to.meta.user_type) {
        return next();
      } else {
        return next(getLoginPage(user, to));
      }
    }
  }
};

function getLoginPage(user, to) {
  if (user.user_type === 'staff' || to.name?.includes('staff')) {
    return { name: 'staff-login' };
  } else if (user.user_type === 'applicant') {
    return { name: 'applicant-login' };
  } else {
    return { name: 'student-login' };
  }
}

export default userMiddleware;
