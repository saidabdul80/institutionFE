
import { isLoggedIn, user } from '@/services/auth';

const userMiddleware = (to, from, next) => {
    const loginRoutes = ['applicant-login', 'staff-login', 'student-login'];
    const openRoutes = [];
  
    // Check if the route is in the allowed routes
    return next(); 
    if (openRoutes.includes(to.name)) {
        next(); 
    }

    if (loginRoutes.includes(to.name)) {
        if (!isLoggedIn()) {
            next(); // Allow navigation
        }else{            
            next(getLoginPage(user))
        }
    } else {
        //alert(getLoginPage(user))
        if (!isLoggedIn()) {            
            next(getLoginPage(user))
        } else {
            if(user.user_type == to.meta.user_type) {                
                next();
            }
        }
    }
};

function getLoginPage(user){
    if(user.user_type == 'staff'){
        return 'staff/login';
    }else if(user.user_type == 'applicant'){
        return 'application/login';
    }else{
        return 'student/login';
    }
}
export default userMiddleware;
