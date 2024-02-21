
const AUTH_TOKEN_KEY = 'authToken';


// Function to check if the user is logged in
export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

export function user(){
    return !!localStorage.getItem('userInfo');
}

export function token(){
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
}