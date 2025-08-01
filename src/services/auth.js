
const AUTH_TOKEN_KEY = 'authToken';


// Function to check if the user is logged in
export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

export function user(){
    return !!localStorage.getItem('userInfo');
}

export function token(){
    let token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        try {
            // Try to parse as JSON first (in case it's stored as JSON)
            token = JSON.parse(token);
        } catch (e) {
            // If parsing fails, use as is
        }
    }
    return token;
}