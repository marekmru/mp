import { defineStore } from 'pinia';
import { customFetchCore4 } from '../helpers/customFetch'; // Importiere customFetchCore4
import router from '../router';

const setLocalStorage = (key: string, value: any) => { // Use string for key
    localStorage.setItem(key, JSON.stringify(value)); // Always stringify for localStorage
};

const getLocalStorage = (key: string): any | null => { // Use string for key, and handle null
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};


interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null; // Add an error state
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: getLocalStorage('user'), // Initialize from localStorage
        isAuthenticated: !!getLocalStorage('user'), // Check if user exists in localStorage
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchProfile() {
            this.isLoading = true;
            this.error = null; // Reset error on each attempt
            try {
                const userLS = getLocalStorage('user'); // Use getLocalStorage
                if (userLS && userLS.token) { // IMPORTANT: Check for token
                    const profile = await customFetchCore4('profile'); // Verwende customFetchCore4 für den API-Aufruf
                    // Combine user data from localStorage with profile data
                    this.user = { ...userLS, ...profile.data };  // Merge LS data and API data.
                    this.isAuthenticated = true;
                } else {
                    // No user in localStorage, or no token.  Treat as unauthenticated.
                    this.isAuthenticated = false;
                    this.user = null;
                    localStorage.removeItem('user'); // Clear any partial data.
                }
            } catch (error) {
                this.isAuthenticated = false;
                this.user = null;
                localStorage.removeItem('user');
                this.error = "Profile fetch failed"; // Set error message, don't log to console here
                console.error('Profile fetch failed:', error); //  Log the full error for debugging.
            } finally {
                this.isLoading = false;
            }
        },
        async login(username: string, password: string) {
            this.isLoading = true;
            this.error = null;
            try {
                const login = await customFetchCore4('login', {  // Corrected endpoint (added /)
                    method: 'POST',
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });

                if (login.data.token) {
                    const userToken = { token: login.data.token };
                    setLocalStorage('user', userToken); // Store *only* the token initially

                    const profile = await customFetchCore4('profile');
                    const user = { ...userToken, ...profile.data }; // Combine token and profile
                    setLocalStorage('user', user);  // Store the *complete* user object.

                    this.user = user;  // Update store state
                    this.isAuthenticated = true;
                } else {
                    // Handle login failure (no token)
                    this.isAuthenticated = false;
                    this.user = null;
                    this.error = "Login failed: No token received."; //  Informative error
                }

            } catch (error: any) { //  Type the error
                // Handle network or API errors during login
                this.isAuthenticated = false;
                this.user = null;
                this.error = `Login failed: ${error.message || 'Unknown error'}`; // More detailed error
                console.error("Login Error:", error); //  Log the full error
            } finally {
                this.isLoading = false;
            }
        },
        async logout() {
            this.isLoading = true; // Set loading state
            this.error = null;
            try {
                await customFetchCore4('logout', { // Corrected endpoint (added /)
                    method: 'GET',
                });
            } catch (error) {
                this.error = "Logout failed"; // Set an error if logout fails
                console.error("Logout Error:", error); //  Log for debugging
            } finally {
                localStorage.removeItem('user');
                this.user = null;
                this.isAuthenticated = false;
                this.isLoading = false; // Reset loading
                router.push('/login');
            }
        },
    },
});