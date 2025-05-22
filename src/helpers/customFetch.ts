import emitter from '@/helpers/emitter';
import router from '@/router';

const baseURL = `${import.meta.env.VITE_API_BASE_MEDIAPLAN}`;
const baseURLCore4 = `${import.meta.env.VITE_API_BASE_CORE4}`;

let isRedirecting = false;

const customFetch = async (url: string, options: RequestInit = {}) => {
    try {
        const userLS = localStorage.getItem('user');
        if (userLS != null) {
            const user = JSON.parse(userLS);
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${user.token}`,
            };
        }

        const response = await fetch(`${baseURL}${url}`, options);

        if (response.status === 401) {
            localStorage.removeItem('user');
            emitter.emit('unauthorized');

            if (!isRedirecting && router.currentRoute.value.name !== 'Login') {
                isRedirecting = true;
                router.push({ name: 'Login' }).finally(() => {
                    isRedirecting = false;
                });
            }
            throw new Error('Unauthorized');
        } else if (response.status >= 400 && response.status < 500) {
            const errorData = await response.json();
            emitter.emit('error', errorData);
            throw new Error(`Client error! status: ${response.status}, message: ${errorData.message || errorData.data}`);
        } else if (response.status >= 500) {
            const errorData = await response.json();
            emitter.emit('error', errorData);
            throw new Error(`Server error! status: ${response.status}`);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        const data = JSON.parse(responseText);

        return data;
    } catch (error) {
        console.error('Fetch error in customFetch: ', error);
        throw error;
    }

};

export const customFetchCore4 = async (url:string, options: RequestInit = {}) => {
    try {
        if (!url.includes('login') && !url.includes('profile')) {
            const userLS = localStorage.getItem('user')
            if (userLS != null) {
                const user = JSON.parse(userLS)
                if (user.token) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${user.token}`,
                    }
                } else if (!url.endsWith('login')) {
                    throw new Error('User token not found in localStorage for Core4 fetch');
                }
            } else if (!url.endsWith('login')) {
                throw new Error('User not found in localStorage for Core4 fetch');
            }
        } else if (url.includes('profile')) {
            const userLS = localStorage.getItem('user')
            if (userLS != null) {
                const user = JSON.parse(userLS)
                if (user.token) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${user.token}`,
                    }
                }
            }
        }

        const response = await fetch(`${baseURLCore4}${url}`, options);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                errorData = { message: `An error occurred (${response.status})`, status: response.status };
            }

            const error = new Error(errorData.message || `An error occurred (${response.status})`);
            (error as any).response = {
                status: response.status,
                data: errorData,
            };
            throw error;
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return await response.text();

    } catch (error) {
        console.error('Fetch error in customFetchCore4: ', error);
        throw error;
    }
};

export default customFetch;