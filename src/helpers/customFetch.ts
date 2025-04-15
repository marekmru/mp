// customFetch.ts

import emitter from '@/helpers/emitter'

const baseURL = `${import.meta.env.VITE_API_BASE_MEDIAPLAN}`
const baseURLCore4 = `${import.meta.env.VITE_API_BASE_CORE4}`
let ti = null
const customFetch = async (url: string, options: RequestInit = {}) => {
    // Request interceptor
    clearTimeout(ti)
    try {
        const userLS = localStorage.getItem('user')
        if (userLS != null) {
            const user = JSON.parse(userLS)
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${user.token}`,
            }
        } else {
            // throw new Error('User not found in localStorage')
        }

        // const token = JSON.parse(user).token
        // const response = await fetch(`${baseURL}${url}?token=${token}`, options)
        const response = await fetch(`${baseURL}${url}`, options)
        // Response interceptor
        if (response.status === 401) {
            localStorage.removeItem('user')

            if (window.location.hostname === 'localhost') {
                await navigateTo('/login')
            } else {
                window.location.href = `${baseURLCore4}login?next=${baseURL}#/`
            }
            throw new Error('Unauthorized')
            /* } else if (response.status >= 412) { */
        } else if (response.status >= 400 && response.status < 500) {
            // Client-side error (400-499)
            const errorData = await response.json() // If your API returns error details in JSON format
            emitter.emit('error', errorData)

            throw new Error(`Client error! status: ${response.status}, message: ${errorData.message || errorData.data}`)
        } else if (response.status >= 500) {
            const errorData = await response.json() // If your API returns error details in JSON format

            // Server-side error (500-599)
            emitter.emit('error', errorData)
            throw new Error(`Server error! status: ${response.status}`)
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Dispatch 'cud-event' for PUT, POST, DELETE methods

        // Unpack the data from the response
        const responseText = await response.text()
        // Replace "NaN" string with null
        // Parse the sanitized response text as JSON
        const data = JSON.parse(responseText)

        // const data = await response.json()
        return data
    } catch (error) {
        console.error('Fetch error: ', error)
        throw error
    }
}

export const customFetchCore4 = async (url: string, options: RequestInit = {}) => {
    // Request interceptor
    try {
        if (!url.includes('login')) {
            const userLS = localStorage.getItem('user')
            if (userLS != null) {
                const user = JSON.parse(userLS)
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${user.token}`,
                }
            } else {
                throw new Error('User not found in localStorage')
            }
        }

        const response = await fetch(`${baseURLCore4}${url}`, options);

        if (!response.ok) { // This is the KEY CHANGE: Handle errors *before* trying to parse JSON
            let errorData;
            try {
                errorData = await response.json(); // Attempt to get JSON error details
            } catch (jsonError) {
                // If parsing JSON fails (e.g., the response is plain text), use a generic message
                errorData = { message: 'An error occurred', status: response.status };
            }

            // Construct an error object that mimics the structure expected by your component
            const error = new Error(errorData.message || 'An error occurred');
            (error as any).response = { // Add the .response property
                status: response.status,
                data: errorData,
            };
            throw error; // Reject the promise with the structured error
        }

        // If the response *is* OK, proceed as before
        let data;
        try {
            data = await response.json();
        } catch (err) {
            data = response; //  Handle cases where response might not be JSON
        }
        return data;

    } catch (error) {
        console.error('Fetch error: ', error);
        throw error; // Re-throw the (possibly modified) error
    }
};

export default customFetch