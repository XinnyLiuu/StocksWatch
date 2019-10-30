/**
 * Authentication + session helper 
 */
import User from '../../model/User';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    if(localStorage.getItem("isAuth") === "true") {
        return true;
    }

    return false;
}

/**
 * Adds user info into localStorage
 */
export const setSession = (user) => {
    localStorage.setItem('isAuth', user.getIsAuth());
    localStorage.setItem('id', user.gteId());
    localStorage.setItem('username', user.getUsername());
    localStorage.setItem('firstname', user.getFirstName());
    localStorage.setItem('lastname', user.getLastName()); 
}

/**
 * Destroys all contents of localStorage
 */
export const destroySession = () => {
    localStorage.clear();
}

/**
 * Gets user info from localStorage
 */
export const getUserInfo = () => {
    return new User(
        localStorage.getItem('id'),
        localStorage.getItem('username'),
        localStorage.getItem('firstname'),
        localStorage.getItem('lastname'), 
        localStorage.getItem('isAuth')
    );
}