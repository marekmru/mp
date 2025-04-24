Project Structure:
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── vite.svg
├── src
│   ├── App.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock


index.html
```
1 | <!doctype html>
2 | <html lang="en">
3 | <head>
4 |     <meta charset="UTF-8"/>
5 |     <link rel="icon" type="image/png" href="/favicon-32-32.png">
6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
7 |     <title>Mediaplan</title>
8 | </head>
9 | <body>
10 | <div id="app"></div>
11 | <script type="module" src="/src/main.ts"></script>
12 | </body>
13 | </html>
```

package.json
```
1 | {
2 |   "name": "mediaplan",
3 |   "private": true,
4 |   "version": "0.0.0",
5 |   "type": "module",
6 |   "scripts": {
7 |     "dev": "vite",
8 |     "build": "vue-tsc -b && vite build",
9 |     "preview": "vite preview"
10 |   },
11 |   "dependencies": {
12 |     "@mdi/font": "^7.4.47",
13 |     "@vee-validate/rules": "^4.15.0",
14 |     "date-fns": "^4.1.0",
15 |     "flag-icons": "^7.2.1",
16 |     "mitt": "^3.0.1",
17 |     "path": "^0.12.7",
18 |     "pinia": "^3.0.1",
19 |     "sass": "^1.85.1",
20 |     "vee-validate": "^4.15.0",
21 |     "vue": "^3.5.13",
22 |     "vue-router": "4",
23 |     "vuetify": "^3.7.16",
24 |     "yup": "^1.6.1"
25 |   },
26 |   "devDependencies": {
27 |     "@vitejs/plugin-vue": "^5.2.1",
28 |     "@vue/tsconfig": "^0.7.0",
29 |     "typescript": "~5.7.2",
30 |     "vite": "^6.2.0",
31 |     "vue-tsc": "^2.2.4"
32 |   }
33 | }
```

tsconfig.app.json
```
1 | {
2 |   "extends": "@vue/tsconfig/tsconfig.dom.json",
3 |   "compilerOptions": {
4 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
5 | 
6 |     /* Linting */
7 |     "strict": true,
8 |     "noUnusedLocals": true,
9 |     "noUnusedParameters": true,
10 |     "noFallthroughCasesInSwitch": true,
11 |     "noUncheckedSideEffectImports": true
12 |   },
13 |   "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
14 | }
```

tsconfig.json
```
1 | {
2 |   "files": [],
3 |   "references": [
4 |     { "path": "./tsconfig.app.json" },
5 |     { "path": "./tsconfig.node.json" }
6 |   ]
7 | }
```

tsconfig.node.json
```
1 | {
2 |   "compilerOptions": {
3 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
4 |     "target": "ES2022",
5 |     "lib": ["ES2023"],
6 |     "module": "ESNext",
7 |     "skipLibCheck": true,
8 | 
9 |     /* Bundler mode */
10 |     "moduleResolution": "bundler",
11 |     "allowImportingTsExtensions": true,
12 |     "isolatedModules": true,
13 |     "moduleDetection": "force",
14 |     "noEmit": true,
15 | 
16 |     /* Linting */
17 |     "strict": true,
18 |     "noUnusedLocals": true,
19 |     "noUnusedParameters": true,
20 |     "noFallthroughCasesInSwitch": true,
21 |     "noUncheckedSideEffectImports": true
22 |   },
23 |   "include": ["vite.config.ts"]
24 | }
```

vite.config.ts
```
1 | import { defineConfig } from 'vite';
2 | import vue from '@vitejs/plugin-vue';
3 | import path from 'path';
4 | 
5 | export default defineConfig({
6 |   plugins: [vue()],
7 |   resolve: {
8 |     alias: {
9 |       '@': path.resolve(__dirname, 'src'),
10 |     },
11 |   },
12 | });
```

src/App.vue
```
1 | <template>
2 |   <v-app>
3 |     <router-view/>
4 |     
5 |     <!-- Global notification component -->
6 |     <notification-snackbar />
7 |   </v-app>
8 | </template>
9 | 
10 | <script setup lang="ts">
11 | import { useAuthStore } from './stores/auth';
12 | import { onMounted } from "vue";
13 | import NotificationSnackbar from '@/components/common/NotificationSnackbar.vue';
14 | 
15 | const authStore = useAuthStore();
16 | 
17 | onMounted(async () => {
18 |   await authStore.fetchProfile();
19 | });
20 | </script>
```

src/main.ts
```
1 | import './style.css'
2 | 
3 | import {createApp} from 'vue';
4 | import App from './App.vue';
5 | import {createPinia} from 'pinia';
6 | import vuetify from './plugins/vuetify';
7 | import router from './router'
8 | 
9 | const pinia = createPinia();
10 | const app = createApp(App);
11 | 
12 | app.config.warnHandler = (msg, vm, trace) => {
13 |     if (msg.includes('Slot "default" invoked outside of the render function')) {
14 |         // swallow this specific warning
15 |         return
16 |     }
17 |     // let all other warnings through
18 |     console.warn(`[Vue warn]: ${msg}${trace}`)
19 | }
20 | app.use(pinia);
21 | app.use(vuetify);
22 | app.use(router);
23 | app.mount('#app');
```

src/style.css
```
1 | .v-btn {
2 |     text-transform: none !important;
3 | }
4 | 
5 | /* Gemeinsame Border-Regel */
6 | .v-table .v-table__wrapper > table > thead > tr > th,
7 | .v-table .v-table__wrapper > table > tbody > tr > td {
8 |     border-bottom: 5px solid #fff !important;
9 | }
10 | 
11 | /* --- Project --- */
12 | .v-theme--dark.v-table.projects-data-table .v-table__wrapper > table > thead > tr > th {
13 |     background-color: #4D4D4D;
14 | }
15 | 
16 | .v-theme--dark.v-table.projects-data-table .v-table__wrapper > table > tbody > tr > td {
17 |     background-color: #666666;
18 | }
19 | 
20 | /* --- Campaign --- */
21 | .v-table.campaigns-data-table .v-table__wrapper > table > thead > tr > th {
22 |     background-color: #666666 !important;
23 |     color: #fff;
24 | }
25 | 
26 | .v-table.campaigns-data-table .v-table__wrapper > table > tbody > tr > td {
27 |     background-color: #E6E6E6 !important;
28 | }
29 | 
30 | /* --- Lineitem --- */
31 | .v-table.lineitem-data-table .v-table__wrapper > table > thead > tr > th {
32 |     background-color: #E6E6E6 !important;
33 | }
34 | 
35 | .v-table.lineitem-data-table .v-table__wrapper > table > tbody > tr > td {
36 |     background-color: #ffffff !important;
37 | }
```

src/vite-env.d.ts
```
1 | /// <reference types="vite/client" />
```

src/constants/mediaplanStatuses.ts
```
1 | // src/constants/mediaplanStatuses.ts
2 | 
3 | // Define the available mediaplan statuses
4 | export enum MediaplanStatus {
5 |   IN_PLANNING = 'in_planning',
6 |   DRAFT = 'draft',
7 |   FOR_APPROVAL = 'for_approval',
8 | }
9 | 
10 | // MEDIAPLAN_STATUSES object structure for backward compatibility with existing code
11 | export const MEDIAPLAN_STATUSES = {
12 |   IN_PLANNING: { value: MediaplanStatus.IN_PLANNING, label: 'In Planning' },
13 |   DRAFT: { value: MediaplanStatus.DRAFT, label: 'Draft' },
14 |   FOR_APPROVAL: { value: MediaplanStatus.FOR_APPROVAL, label: 'For Approval' },
15 | };
16 | 
17 | // Get array of status values
18 | export const getMediaplanStatusValues = (): string[] => {
19 |   return Object.values(MediaplanStatus);
20 | };
21 | 
22 | // Get array of status objects with value and label
23 | export const getMediaplanStatusOptions = (): { value: string; label: string }[] => {
24 |   return Object.entries(MEDIAPLAN_STATUSES).map(([_, statusObj]) => ({
25 |     value: statusObj.value,
26 |     label: statusObj.label,
27 |   }));
28 | };
29 | 
30 | // Get color for a mediaplan status
31 | export const getMediaplanStatusColor = (status?: string): string => {
32 |   if (!status) return 'grey';
33 |   
34 |   const statusColors: Record<string, string> = {
35 |     [MediaplanStatus.IN_PLANNING]: 'blue',
36 |     [MediaplanStatus.DRAFT]: 'grey',
37 |     [MediaplanStatus.FOR_APPROVAL]: 'amber'
38 |   };
39 |   
40 |   return statusColors[status] || 'grey';
41 | };
42 | 
43 | // Get label for a mediaplan status
44 | export const getMediaplanStatusLabel = (status?: string): string => {
45 |   if (!status) return 'Unknown';
46 |   
47 |   const statusLabels: Record<string, string> = {
48 |     [MediaplanStatus.IN_PLANNING]: 'In Planning',
49 |     [MediaplanStatus.DRAFT]: 'Draft',
50 |     [MediaplanStatus.FOR_APPROVAL]: 'For Approval'
51 |   };
52 |   
53 |   return statusLabels[status] || 'Unknown';
54 | };
```

src/components/TopBar.vue
```
1 | <template>
2 |   <v-app-bar app color="white" class="px-5" fixed height="68" scroll-behavior="elevate" scroll-threshold="200" px-7>
3 |     <v-menu>
4 |       <template #activator="{ props }">
5 |         <v-btn size="x-large" class="mr-2" icon="mdi-dots-grid" :="props"></v-btn>
6 |       </template>
7 |       <v-list class="pt-0 pb-0">
8 |         <v-list-item color="primary" to="/">
9 |           <template #prepend>
10 |             <v-icon icon="mdi-view-dashboard" color="primary"></v-icon>
11 |           </template>
12 |           <v-list-item-title>Overview</v-list-item-title>
13 |         </v-list-item>
14 |       </v-list>
15 |     </v-menu>
16 |     <router-link to="/">
17 |       <v-row align="center" no-gutters>
18 |         <h4 class="text-h5 mr-4">Mediaplan</h4>
19 |         <img alt="BMW Logo" class="mr-3" src="/img/brands/BMW.svg" width="35" />
20 |         <img alt="MINI Logo" class="mr-3" src="/img/brands/MINI.svg" width="76" />
21 |         <img alt="MINI Logo" class="mr-3" src="/img/the-marcom-engine.png" width="240" />
22 |       </v-row>
23 |     </router-link>
24 |     <v-spacer />
25 |   </v-app-bar>
26 | </template>
27 | 
28 | <script setup>
29 | // No script setup needed
30 | </script>
31 | 
32 | <style scoped>
33 | h4 {
34 |   text-decoration: none !important;
35 |   color: rgba(0, 0, 0, 0.87);
36 | }
37 | 
38 | .router-link-active,
39 | a,
40 | .router-link {
41 |   text-decoration: none !important;
42 | 
43 |   &:visited {
44 |     color: inherit;
45 |   }
46 | }
47 | </style>
```

src/helpers/brandUtils.ts
```
1 | // src/helpers/brandUtils.ts
2 | 
3 | import type { Brand, EntityReference } from '@/types/mediaplan';
4 | 
5 | /**
6 |  * Determines if a brand has a logo
7 |  */
8 | export const hasBrandLogo = (brand?: Brand | EntityReference): boolean => {
9 |   if (!brand) return false;
10 |   
11 |   // Check if it's a Brand with logo property
12 |   if ('logo' in brand) {
13 |     return !!brand.logo;
14 |   }
15 |   
16 |   // Default logos for known brands
17 |   const knownBrands = ['BMW', 'MINI'];
18 |   return knownBrands.includes(brand.name);
19 | };
20 | /**
21 |  * Gets the brand logo URL
22 |  */
23 | export const getBrandLogo = (brand?: Brand | EntityReference | string): string => {
24 |   const brandLogos: Record<string, string> = {
25 |     'BMW': '/img/brands/BMW.svg',
26 |     'MINI': '/img/brands/MINI.svg'
27 |   };
28 | 
29 |   if (!brand) return '/img/brands/logoipsum.svg';
30 | 
31 |   if (typeof brand === 'string') {
32 |     return brandLogos[brand] || '/img/brands/logoipsum.svg';
33 |   }
34 | 
35 |   if ('logo' in brand && brand.logo) {
36 |     return brand.logo;
37 |   }
38 | 
39 |   return brandLogos[brand.name] || '/img/brands/logoipsum.svg';
40 | };
41 | /**
42 |  * Gets brand initials for brands without logos
43 |  */
44 | export const getBrandInitials = (brand?: Brand | EntityReference): string => {
45 |   if (!brand || !brand.name) return '?';
46 |   
47 |   const words = brand.name.split(' ');
48 |   
49 |   if (words.length === 1) {
50 |     return words[0].substring(0, 2).toUpperCase();
51 |   }
52 |   
53 |   return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
54 | };
```

src/helpers/campaignTypeUtils.ts
```
1 | // src/helpers/campaignTypeUtils.ts
2 | 
3 | /**
4 |  * Returns a color for a campaign type
5 |  */
6 | export const getCampaignTypeColor = (type?: string): string => {
7 |   if (!type) return 'grey';
8 |   
9 |   const typeColors: Record<string, string> = {
10 |     'Always On': 'primary',
11 |     'Product Launch': 'success',
12 |     'Seasonal': 'info',
13 |     'Promotion': 'warning',
14 |     'Event': 'purple',
15 |     'Brand': 'orange'
16 |   };
17 |   
18 |   return typeColors[type] || 'grey';
19 | };
20 | 
21 | /**
22 |  * Returns a label for a campaign type
23 |  */
24 | export const getCampaignTypeLabel = (type?: string): string => {
25 |   if (!type) return 'Unknown';
26 |   return type;
27 | };
28 | 
29 | /**
30 |  * Returns an icon for a campaign type
31 |  */
32 | export const getCampaignTypeIcon = (type?: string): string => {
33 |   if (!type) return 'mdi-help-circle-outline';
34 |   
35 |   const typeIcons: Record<string, string> = {
36 |     'Always On': 'mdi-sync',
37 |     'Product Launch': 'mdi-rocket-launch',
38 |     'Seasonal': 'mdi-calendar-month',
39 |     'Promotion': 'mdi-tag',
40 |     'Event': 'mdi-calendar-star',
41 |     'Brand': 'mdi-badge-account'
42 |   };
43 |   
44 |   return typeIcons[type] || 'mdi-help-circle-outline';
45 | };
```

src/helpers/currencyUtils.ts
```
1 | // src/helpers/currencyUtils.ts
2 | 
3 | /**
4 |  * Formats a number as currency
5 |  */
6 | export const formatCurrency = (value?: number): string => {
7 |   if (value === undefined || value === null) return '€0';
8 |   
9 |   return new Intl.NumberFormat('en-DE', {
10 |     style: 'currency',
11 |     currency: 'EUR',
12 |     minimumFractionDigits: 0,
13 |     maximumFractionDigits: 0
14 |   }).format(value);
15 | };
16 | 
17 | /**
18 |  * Calculates percentage
19 |  */
20 | export const calculatePercentage = (used?: number, total?: number): number => {
21 |   if (!used || !total || total === 0) return 0;
22 |   return Math.round((used / total) * 100);
23 | };
24 | 
25 | /**
26 |  * Gets color for budget status based on usage percentage
27 |  */
28 | export const getBudgetStatusColor = (budget?: { used?: number, total?: number }): string => {
29 |   if (!budget || !budget.used || !budget.total || budget.total === 0) return 'success';
30 |   
31 |   const percentage = calculatePercentage(budget.used, budget.total);
32 |   
33 |   if (percentage < 70) return 'success';
34 |   if (percentage < 90) return 'warning';
35 |   return 'error';
36 | };
```

src/helpers/customFetch.ts
```
1 | // customFetch.ts
2 | 
3 | import emitter from '@/helpers/emitter'
4 | 
5 | const baseURL = `${import.meta.env.VITE_API_BASE_MEDIAPLAN}`
6 | const baseURLCore4 = `${import.meta.env.VITE_API_BASE_CORE4}`
7 | let ti = null
8 | const customFetch = async (url: string, options: RequestInit = {}) => {
9 |     // Request interceptor
10 |     clearTimeout(ti)
11 |     try {
12 |         const userLS = localStorage.getItem('user')
13 |         if (userLS != null) {
14 |             const user = JSON.parse(userLS)
15 |             options.headers = {
16 |                 ...options.headers,
17 |                 Authorization: `Bearer ${user.token}`,
18 |             }
19 |         } else {
20 |             // throw new Error('User not found in localStorage')
21 |         }
22 | 
23 |         // const token = JSON.parse(user).token
24 |         // const response = await fetch(`${baseURL}${url}?token=${token}`, options)
25 |         const response = await fetch(`${baseURL}${url}`, options)
26 |         // Response interceptor
27 |         if (response.status === 401) {
28 |             localStorage.removeItem('user')
29 | 
30 |             if (window.location.hostname === 'localhost') {
31 |                 await navigateTo('/login')
32 |             } else {
33 |                 window.location.href = `${baseURLCore4}login?next=${baseURL}#/`
34 |             }
35 |             throw new Error('Unauthorized')
36 |             /* } else if (response.status >= 412) { */
37 |         } else if (response.status >= 400 && response.status < 500) {
38 |             // Client-side error (400-499)
39 |             const errorData = await response.json() // If your API returns error details in JSON format
40 |             emitter.emit('error', errorData)
41 | 
42 |             throw new Error(`Client error! status: ${response.status}, message: ${errorData.message || errorData.data}`)
43 |         } else if (response.status >= 500) {
44 |             const errorData = await response.json() // If your API returns error details in JSON format
45 | 
46 |             // Server-side error (500-599)
47 |             emitter.emit('error', errorData)
48 |             throw new Error(`Server error! status: ${response.status}`)
49 |         }
50 | 
51 |         if (!response.ok) {
52 |             throw new Error(`HTTP error! status: ${response.status}`)
53 |         }
54 | 
55 |         // Dispatch 'cud-event' for PUT, POST, DELETE methods
56 | 
57 |         // Unpack the data from the response
58 |         const responseText = await response.text()
59 |         // Replace "NaN" string with null
60 |         // Parse the sanitized response text as JSON
61 |         const data = JSON.parse(responseText)
62 | 
63 |         // const data = await response.json()
64 |         return data
65 |     } catch (error) {
66 |         console.error('Fetch error: ', error)
67 |         throw error
68 |     }
69 | }
70 | 
71 | export const customFetchCore4 = async (url: string, options: RequestInit = {}) => {
72 |     // Request interceptor
73 |     try {
74 |         if (!url.includes('login')) {
75 |             const userLS = localStorage.getItem('user')
76 |             if (userLS != null) {
77 |                 const user = JSON.parse(userLS)
78 |                 options.headers = {
79 |                     ...options.headers,
80 |                     Authorization: `Bearer ${user.token}`,
81 |                 }
82 |             } else {
83 |                 throw new Error('User not found in localStorage')
84 |             }
85 |         }
86 | 
87 |         const response = await fetch(`${baseURLCore4}${url}`, options);
88 | 
89 |         if (!response.ok) { // This is the KEY CHANGE: Handle errors *before* trying to parse JSON
90 |             let errorData;
91 |             try {
92 |                 errorData = await response.json(); // Attempt to get JSON error details
93 |             } catch (jsonError) {
94 |                 // If parsing JSON fails (e.g., the response is plain text), use a generic message
95 |                 errorData = { message: 'An error occurred', status: response.status };
96 |             }
97 | 
98 |             // Construct an error object that mimics the structure expected by your component
99 |             const error = new Error(errorData.message || 'An error occurred');
100 |             (error as any).response = { // Add the .response property
101 |                 status: response.status,
102 |                 data: errorData,
103 |             };
104 |             throw error; // Reject the promise with the structured error
105 |         }
106 | 
107 |         // If the response *is* OK, proceed as before
108 |         let data;
109 |         try {
110 |             data = await response.json();
111 |         } catch (err) {
112 |             data = response; //  Handle cases where response might not be JSON
113 |         }
114 |         return data;
115 | 
116 |     } catch (error) {
117 |         console.error('Fetch error: ', error);
118 |         throw error; // Re-throw the (possibly modified) error
119 |     }
120 | };
121 | 
122 | export default customFetch
```

src/helpers/dateUtils.ts
```
1 | // src/helpers/dateUtils.ts
2 | 
3 | /**
4 |  * Formats a date string to a readable format
5 |  */
6 | export const formatDate = (dateString?: string): string => {
7 |   if (!dateString) return '';
8 |   
9 |   const date = new Date(dateString);
10 |   return new Intl.DateTimeFormat('en-DE', {
11 |     year: 'numeric',
12 |     month: '2-digit',
13 |     day: '2-digit'
14 |   }).format(date);
15 | };
16 | 
17 | /**
18 |  * Formats a date range to a readable format
19 |  */
20 | export const formatDateRange = (startDate?: string, endDate?: string): string => {
21 |   if (!startDate || !endDate) return '';
22 |   
23 |   const start = new Date(startDate);
24 |   const end = new Date(endDate);
25 |   
26 |   const startFormatted = formatDate(startDate);
27 |   const endFormatted = formatDate(endDate);
28 |   
29 |   return `${startFormatted} - ${endFormatted}`;
30 | };
31 | 
32 | /**
33 |  * Formats a date to DD.MM-DD.MM.YYYY format (used for campaign durations)
34 |  */
35 | export const formatCampaignDuration = (startDate?: string, endDate?: string): string => {
36 |   if (!startDate || !endDate) return '';
37 |   
38 |   const start = new Date(startDate);
39 |   const end = new Date(endDate);
40 |   
41 |   const startDay = String(start.getDate()).padStart(2, '0');
42 |   const startMonth = String(start.getMonth() + 1).padStart(2, '0');
43 |   const endDay = String(end.getDate()).padStart(2, '0');
44 |   const endMonth = String(end.getMonth() + 1).padStart(2, '0');
45 |   const year = end.getFullYear();
46 |   
47 |   return `${startDay}.${startMonth}-${endDay}.${endMonth}.${year}`;
48 | };
```

src/helpers/emitter.ts
```
1 | import mitt from 'mitt'
2 | 
3 | const emitter = mitt()
4 | 
5 | export default emitter
```

src/helpers/notificationUtils.ts
```
1 | // src/helpers/notificationUtils.ts
2 | 
3 | import { reactive } from 'vue';
4 | 
5 | /**
6 |  * Notification types for consistent styling
7 |  */
8 | export enum NotificationType {
9 |   SUCCESS = 'success',
10 |   ERROR = 'error',
11 |   WARNING = 'warning',
12 |   INFO = 'info',
13 | }
14 | 
15 | /**
16 |  * Interface for notification data
17 |  */
18 | export interface Notification {
19 |   show: boolean;
20 |   text: string;
21 |   type: NotificationType;
22 |   timeout?: number;
23 |   closable?: boolean;
24 | }
25 | 
26 | // Create a shared notification state
27 | export const notification = reactive<Notification>({
28 |   show: false,
29 |   text: '',
30 |   type: NotificationType.INFO,
31 |   timeout: 5000,
32 |   closable: true,
33 | });
34 | 
35 | /**
36 |  * Show a success notification
37 |  * @param message The message to display
38 |  * @param options Optional configuration
39 |  */
40 | export const showSuccess = (
41 |   message: string,
42 |   options: {
43 |     timeout?: number;
44 |     closable?: boolean;
45 |   } = {}
46 | ): void => {
47 |   notification.text = message;
48 |   notification.type = NotificationType.SUCCESS;
49 |   notification.timeout = options.timeout ?? 5000;
50 |   notification.closable = options.closable ?? true;
51 |   notification.show = true;
52 | };
53 | 
54 | /**
55 |  * Show an error notification
56 |  * @param message The message to display
57 |  * @param options Optional configuration
58 |  */
59 | export const showError = (
60 |   message: string,
61 |   options: {
62 |     timeout?: number;
63 |     closable?: boolean;
64 |   } = {}
65 | ): void => {
66 |   notification.text = message;
67 |   notification.type = NotificationType.ERROR;
68 |   notification.timeout = options.timeout ?? 8000; // Longer timeout for errors
69 |   notification.closable = options.closable ?? true;
70 |   notification.show = true;
71 | };
72 | 
73 | /**
74 |  * Show a warning notification
75 |  * @param message The message to display
76 |  * @param options Optional configuration
77 |  */
78 | export const showWarning = (
79 |   message: string,
80 |   options: {
81 |     timeout?: number;
82 |     closable?: boolean;
83 |   } = {}
84 | ): void => {
85 |   notification.text = message;
86 |   notification.type = NotificationType.WARNING;
87 |   notification.timeout = options.timeout ?? 6000;
88 |   notification.closable = options.closable ?? true;
89 |   notification.show = true;
90 | };
91 | 
92 | /**
93 |  * Show an info notification
94 |  * @param message The message to display
95 |  * @param options Optional configuration
96 |  */
97 | export const showInfo = (
98 |   message: string,
99 |   options: {
100 |     timeout?: number;
101 |     closable?: boolean;
102 |   } = {}
103 | ): void => {
104 |   notification.text = message;
105 |   notification.type = NotificationType.INFO;
106 |   notification.timeout = options.timeout ?? 5000;
107 |   notification.closable = options.closable ?? true;
108 |   notification.show = true;
109 | };
110 | 
111 | /**
112 |  * Close the current notification
113 |  */
114 | export const closeNotification = (): void => {
115 |   notification.show = false;
116 | };
```

src/helpers/statusUtils.ts
```
1 | // src/helpers/statusUtils.ts
2 | 
3 | /**
4 |  * Maps mediaplan statuses to color names for consistent UI presentation
5 |  * @param status Mediaplan status string
6 |  * @returns Vuetify color name
7 |  */
8 | export const getMediaplanStatusColor = (status?: string): string => {
9 |   if (!status) return 'grey';
10 |   
11 |   switch (status.toLowerCase()) {
12 |     case 'draft':
13 |       return 'info';
14 |     case 'in_planning':
15 |     case 'in planning':
16 |       return 'warning';
17 |     case 'for_approval':
18 |     case 'for approval':
19 |       return 'success';
20 |     case 'approved':
21 |       return 'success-darken-2';
22 |     case 'rejected':
23 |       return 'error';
24 |     case 'cancelled':
25 |       return 'grey';
26 |     case 'completed':
27 |       return 'purple';
28 |     default:
29 |       return 'grey';
30 |   }
31 | };
32 | 
33 | /**
34 |  * Gets the display text for a mediaplan status (for normalization)
35 |  * @param status Mediaplan status string
36 |  * @returns Formatted display text
37 |  */
38 | export const getMediaplanStatusDisplayText = (status?: string): string => {
39 |   if (!status) return '';
40 |   
41 |   const statusMap: Record<string, string> = {
42 |     'draft': 'Draft',
43 |     'in_planning': 'In Planning',
44 |     'in planning': 'In Planning',
45 |     'for_approval': 'For Approval',
46 |     'for approval': 'For Approval',
47 |     'approved': 'Approved',
48 |     'rejected': 'Rejected',
49 |     'cancelled': 'Cancelled',
50 |     'completed': 'Completed'
51 |   };
52 |   
53 |   return statusMap[status.toLowerCase()] || status;
54 | };
55 | 
56 | /**
57 |  * Maps mediaplan statuses to icon names for consistent UI presentation
58 |  * @param status Mediaplan status string
59 |  * @returns Material Design Icon name
60 |  */
61 | export const getMediaplanStatusIcon = (status?: string): string => {
62 |   if (!status) return 'mdi-help-circle-outline';
63 |   
64 |   switch (status.toLowerCase()) {
65 |     case 'draft':
66 |       return 'mdi-pencil-outline';
67 |     case 'in_planning':
68 |     case 'in planning':
69 |       return 'mdi-clock-outline';
70 |     case 'for_approval':
71 |     case 'for approval':
72 |       return 'mdi-thumb-up-down-outline';
73 |     case 'approved':
74 |       return 'mdi-check-circle-outline';
75 |     case 'rejected':
76 |       return 'mdi-close-circle-outline';
77 |     case 'cancelled':
78 |       return 'mdi-cancel';
79 |     case 'completed':
80 |       return 'mdi-flag-checkered';
81 |     default:
82 |       return 'mdi-help-circle-outline';
83 |   }
84 | };
85 | 
86 | // Export a complete set of all known mediaplan statuses
87 | export const MEDIAPLAN_STATUSES = [
88 |   'Draft',
89 |   'In Planning',
90 |   'For Approval',
91 |   'Approved',
92 |   'Rejected',
93 |   'Cancelled',
94 |   'Completed'
95 | ];
```

src/layouts/MainLayout.vue
```
1 | <template>
2 |   <TopBar/>
3 | 
4 |   <v-main>
5 |     <v-container fluid class="max-width-container">
6 |       <slot/>
7 |     </v-container>
8 |   </v-main>
9 | </template>
10 | 
11 | <script setup>
12 | import TopBar from "@/components/TopBar.vue";
13 | </script>
14 | 
15 | <style scoped>
16 | .max-width-container {
17 |   max-width: 1440px;
18 | }
19 | </style>
```

src/mocks/mediaplanProjects.ts
```
1 | export const mockProjects = [
2 |   {
3 |     _id: 'project-1',
4 |     abbreviation: 'NC-ALWAYS-ON-2024_Individ #1',
5 |     created_at: '2024-10-02T09:15:00Z',
6 |     default_vars: {
7 |       targeturls: null,
8 |       subsegment: 'New Car',
9 |       campaigntype: 'Always On',
10 |       language: 'DEU',
11 |       campaigndetail: null,
12 |       adtype: 'Banner',
13 |       dimension: '300x250'
14 |     },
15 |     descriptive_vars: {
16 |       brand: 'MINI',
17 |       country: 'SE',
18 |       bmwponumber: 'PO12345',
19 |       adobecampaignname: 'Always On 2024',
20 |       subsegment: 'New Car',
21 |       campaigntype: 'Always On',
22 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
23 |       year: 2024
24 |     },
25 |     is_locked: false,
26 |     labels: [],
27 |     lock_state: 0,
28 |     owner: 'user123',
29 |     updated_at: '2024-10-02T09:15:00Z',
30 |     uploaded_at: '2024-10-02T09:15:00Z',
31 |     message: 'OK',
32 |     timestamp: '2024-10-02T09:15:00Z',
33 |     version: 'v1',
34 |     duration: {
35 |       start_date: '2024-01-15T00:00:00Z',
36 |       end_date: '2024-04-15T00:00:00Z',
37 |       formatted: '15.01-15.04.2024'
38 |     },
39 |     detail: 'To be defined might be very long'
40 |   },
41 |   {
42 |     _id: 'project-2',
43 |     abbreviation: 'NC-SPECIAL-2024_Individ #2',
44 |     created_at: '2024-10-03T11:30:00Z',
45 |     default_vars: {
46 |       targeturls: null,
47 |       subsegment: 'New Car',
48 |       campaigntype: 'Always On',
49 |       language: 'SWE',
50 |       campaigndetail: null,
51 |       adtype: 'Banner',
52 |       dimension: '300x250'
53 |     },
54 |     descriptive_vars: {
55 |       brand: 'MINI',
56 |       country: 'NL',
57 |       bmwponumber: 'PO67890',
58 |       adobecampaignname: 'Always On 2024',
59 |       subsegment: 'New Car',
60 |       campaigntype: 'Always On',
61 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
62 |       year: 2024
63 |     },
64 |     is_locked: false,
65 |     labels: [],
66 |     lock_state: 0,
67 |     owner: 'user123',
68 |     updated_at: '2024-10-03T11:30:00Z',
69 |     uploaded_at: '2024-10-03T11:30:00Z',
70 |     message: 'OK',
71 |     timestamp: '2024-10-03T11:30:00Z',
72 |     version: 'v1',
73 |     duration: {
74 |       start_date: '2024-01-15T00:00:00Z',
75 |       end_date: '2024-04-15T00:00:00Z',
76 |       formatted: '01.01-30.04.2024'
77 |     },
78 |     detail: 'This project focuses on the Dutch market.'
79 |   },
80 |   {
81 |     _id: 'project-3',
82 |     abbreviation: 'NC-ALWAYS-ON-2024_Individ #3',
83 |     created_at: '2024-10-04T15:20:00Z',
84 |     default_vars: {
85 |       targeturls: null,
86 |       subsegment: 'New Car',
87 |       campaigntype: 'Always On',
88 |       language: 'NLD',
89 |       campaigndetail: null,
90 |       adtype: 'Banner',
91 |       dimension: '300x250'
92 |     },
93 |     descriptive_vars: {
94 |       brand: 'MINI',
95 |       country: 'FR',
96 |       bmwponumber: 'PO12345',
97 |       adobecampaignname: 'Always On 2024',
98 |       subsegment: 'New Car',
99 |       campaigntype: 'Always On',
100 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
101 |       year: 2024
102 |     },
103 |     is_locked: false,
104 |     labels: [],
105 |     lock_state: 0,
106 |     owner: 'user123',
107 |     updated_at: '2024-10-04T15:20:00Z',
108 |     uploaded_at: '2024-10-04T15:20:00Z',
109 |     message: 'OK',
110 |     timestamp: '2024-10-04T15:20:00Z',
111 |     version: 'v1',
112 |     duration: {
113 |       start_date: '2024-01-15T00:00:00Z',
114 |       end_date: '2024-04-15T00:00:00Z',
115 |       formatted: '01.03-30.04.2024'
116 |     },
117 |     detail: 'To be defined might be very long'
118 |   },
119 |   {
120 |     _id: 'project-4',
121 |     abbreviation: 'NC-SPECIAL-2024_Individ #4',
122 |     created_at: '2024-10-05T10:45:00Z',
123 |     default_vars: {
124 |       targeturls: null,
125 |       subsegment: 'New Car',
126 |       campaigntype: 'Always On',
127 |       language: 'DEU',
128 |       campaigndetail: null,
129 |       adtype: 'Banner',
130 |       dimension: '300x250'
131 |     },
132 |     descriptive_vars: {
133 |       brand: 'MINI',
134 |       country: 'SE',
135 |       bmwponumber: 'PO67890',
136 |       adobecampaignname: 'Always On 2024',
137 |       subsegment: 'New Car',
138 |       campaigntype: 'Always On',
139 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
140 |       year: 2024
141 |     },
142 |     is_locked: false,
143 |     labels: [],
144 |     lock_state: 0,
145 |     owner: 'user123',
146 |     updated_at: '2024-10-05T10:45:00Z',
147 |     uploaded_at: '2024-10-05T10:45:00Z',
148 |     message: 'OK',
149 |     timestamp: '2024-10-05T10:45:00Z',
150 |     version: 'v1',
151 |     duration: {
152 |       start_date: '2024-01-15T00:00:00Z',
153 |       end_date: '2024-04-15T00:00:00Z',
154 |       formatted: '15.01-15.04.2024'
155 |     },
156 |     detail: 'This is a special project for the Swedish market.'
157 |   },
158 |   {
159 |     _id: 'project-5',
160 |     abbreviation: 'NC-ALWAYS-ON-2024_Individ #5',
161 |     created_at: '2024-10-06T13:15:00Z',
162 |     default_vars: {
163 |       targeturls: null,
164 |       subsegment: 'New Car',
165 |       campaigntype: 'Always On',
166 |       language: 'SWE',
167 |       campaigndetail: null,
168 |       adtype: 'Banner',
169 |       dimension: '300x250'
170 |     },
171 |     descriptive_vars: {
172 |       brand: 'MINI',
173 |       country: 'NL',
174 |       bmwponumber: 'PO12345',
175 |       adobecampaignname: 'Always On 2024',
176 |       subsegment: 'New Car',
177 |       campaigntype: 'Always On',
178 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
179 |       year: 2024
180 |     },
181 |     is_locked: false,
182 |     labels: [],
183 |     lock_state: 0,
184 |     owner: 'user123',
185 |     updated_at: '2024-10-06T13:15:00Z',
186 |     uploaded_at: '2024-10-06T13:15:00Z',
187 |     message: 'OK',
188 |     timestamp: '2024-10-06T13:15:00Z',
189 |     version: 'v1',
190 |     duration: {
191 |       start_date: '2024-01-15T00:00:00Z',
192 |       end_date: '2024-04-15T00:00:00Z',
193 |       formatted: '01.01-15.04.2024'
194 |     },
195 |     detail: 'To be defined might be very long'
196 |   },
197 |   {
198 |     _id: 'project-6',
199 |     abbreviation: 'NC-ALWAYS-ON-2024_Individ #6',
200 |     created_at: '2024-10-07T09:15:00Z',
201 |     default_vars: {
202 |       targeturls: null,
203 |       subsegment: 'New Car',
204 |       campaigntype: 'Always On',
205 |       language: 'DEU',
206 |       campaigndetail: null,
207 |       adtype: 'Banner',
208 |       dimension: '300x250'
209 |     },
210 |     descriptive_vars: {
211 |       brand: 'MINI',
212 |       country: 'FR',
213 |       bmwponumber: 'PO67890',
214 |       adobecampaignname: 'Always On 2024',
215 |       subsegment: 'New Car',
216 |       campaigntype: 'Always On',
217 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
218 |       year: 2024
219 |     },
220 |     is_locked: false,
221 |     labels: [],
222 |     lock_state: 0,
223 |     owner: 'user123',
224 |     updated_at: '2024-10-07T09:15:00Z',
225 |     uploaded_at: '2024-10-07T09:15:00Z',
226 |     message: 'OK',
227 |     timestamp: '2024-10-07T09:15:00Z',
228 |     version: 'v1',
229 |     duration: {
230 |       start_date: '2024-01-15T00:00:00Z',
231 |       end_date: '2024-04-15T00:00:00Z',
232 |       formatted: '15.01-30.06.2024'
233 |     },
234 |     detail: 'To be defined might be very long'
235 |   },
236 |   {
237 |     _id: 'project-7',
238 |     abbreviation: 'NC-SPECIAL-2024_Individ #7',
239 |     created_at: '2024-10-08T11:30:00Z',
240 |     default_vars: {
241 |       targeturls: null,
242 |       subsegment: 'New Car',
243 |       campaigntype: 'Always On',
244 |       language: 'NLD',
245 |       campaigndetail: null,
246 |       adtype: 'Banner',
247 |       dimension: '300x250'
248 |     },
249 |     descriptive_vars: {
250 |       brand: 'MINI',
251 |       country: 'SE',
252 |       bmwponumber: 'PO12345',
253 |       adobecampaignname: 'Always On 2024',
254 |       subsegment: 'New Car',
255 |       campaigntype: 'Always On',
256 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
257 |       year: 2024
258 |     },
259 |     is_locked: false,
260 |     labels: [],
261 |     lock_state: 0,
262 |     owner: 'user123',
263 |     updated_at: '2024-10-08T11:30:00Z',
264 |     uploaded_at: '2024-10-08T11:30:00Z',
265 |     message: 'OK',
266 |     timestamp: '2024-10-08T11:30:00Z',
267 |     version: 'v1',
268 |     duration: {
269 |       start_date: '2024-01-15T00:00:00Z',
270 |       end_date: '2024-04-15T00:00:00Z',
271 |       formatted: '01.04-30.06.2024'
272 |     },
273 |     detail: 'To be defined might be very long'
274 |   },
275 |   {
276 |     _id: 'project-8',
277 |     abbreviation: 'NC-ALWAYS-ON-2024_Individ #8',
278 |     created_at: '2024-10-09T15:20:00Z',
279 |     default_vars: {
280 |       targeturls: null,
281 |       subsegment: 'New Car',
282 |       campaigntype: 'Always On',
283 |       language: 'DEU',
284 |       campaigndetail: null,
285 |       adtype: 'Banner',
286 |       dimension: '300x250'
287 |     },
288 |     descriptive_vars: {
289 |       brand: 'MINI',
290 |       country: 'NL',
291 |       bmwponumber: 'PO67890',
292 |       adobecampaignname: 'Always On 2024',
293 |       subsegment: 'New Car',
294 |       campaigntype: 'Always On',
295 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
296 |       year: 2024
297 |     },
298 |     is_locked: false,
299 |     labels: [],
300 |     lock_state: 0,
301 |     owner: 'user123',
302 |     updated_at: '2024-10-09T15:20:00Z',
303 |     uploaded_at: '2024-10-09T15:20:00Z',
304 |     message: 'OK',
305 |     timestamp: '2024-10-09T15:20:00Z',
306 |     version: 'v1',
307 |     duration: {
308 |       start_date: '2024-01-15T00:00:00Z',
309 |       end_date: '2024-04-15T00:00:00Z',
310 |       formatted: '01.01-15.05.2024'
311 |     },
312 |     detail: 'To be defined might be very long'
313 |   },
314 |   {
315 |     _id: 'project-9',
316 |     abbreviation: 'NC-SPECIAL-2024_Individ #9',
317 |     created_at: '2024-10-10T10:45:00Z',
318 |     default_vars: {
319 |       targeturls: null,
320 |       subsegment: 'New Car',
321 |       campaigntype: 'Always On',
322 |       language: 'SWE',
323 |       campaigndetail: null,
324 |       adtype: 'Banner',
325 |       dimension: '300x250'
326 |     },
327 |     descriptive_vars: {
328 |       brand: 'MINI',
329 |       country: 'FR',
330 |       bmwponumber: 'PO12345',
331 |       adobecampaignname: 'Always On 2024',
332 |       subsegment: 'New Car',
333 |       campaigntype: 'Always On',
334 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
335 |       year: 2024
336 |     },
337 |     is_locked: false,
338 |     labels: [],
339 |     lock_state: 0,
340 |     owner: 'user123',
341 |     updated_at: '2024-10-10T10:45:00Z',
342 |     uploaded_at: '2024-10-10T10:45:00Z',
343 |     message: 'OK',
344 |     timestamp: '2024-10-10T10:45:00Z',
345 |     version: 'v1',
346 |     duration: {
347 |       start_date: '2024-01-15T00:00:00Z',
348 |       end_date: '2024-04-15T00:00:00Z',
349 |       formatted: '15.01-30.06.2024'
350 |     },
351 |     detail: 'To be defined might be very long'
352 |   },
353 |   {
354 |     _id: 'project-10',
355 |     abbreviation: 'NC-ALWAYS-ON-2024_Individ #10',
356 |     created_at: '2024-10-11T13:15:00Z',
357 |     default_vars: {
358 |       targeturls: null,
359 |       subsegment: 'New Car',
360 |       campaigntype: 'Always On',
361 |       language: 'NLD',
362 |       campaigndetail: null,
363 |       adtype: 'Banner',
364 |       dimension: '300x250'
365 |     },
366 |     descriptive_vars: {
367 |       brand: 'MINI',
368 |       country: 'SE',
369 |       bmwponumber: 'PO67890',
370 |       adobecampaignname: 'Always On 2024',
371 |       subsegment: 'New Car',
372 |       campaigntype: 'Always On',
373 |       projectname: 'NC-ALWAYS-ON-2024_Individ',
374 |       year: 2024
375 |     },
376 |     is_locked: false,
377 |     labels: [],
378 |     lock_state: 0,
379 |     owner: 'user123',
380 |     updated_at: '2024-10-11T13:15:00Z',
381 |     uploaded_at: '2024-10-11T13:15:00Z',
382 |     message: 'OK',
383 |     timestamp: '2024-10-11T13:15:00Z',
384 |     version: 'v1',
385 |     duration: {
386 |       start_date: '2024-01-15T00:00:00Z',
387 |       end_date: '2024-04-15T00:00:00Z',
388 |       formatted: '01.05-30.06.2024'
389 |     },
390 |     detail: 'To be defined might be very long'
391 |   }
392 | ];
```

src/mocks/swagger_mp.yaml
```
1 | openapi: 3.0.3
2 | 
3 | info:
4 |   title: Mediaplan API
5 |   version: 1.0.0
6 |   description: API for managing Mediaplans and Changelogs
7 | 
8 | paths:
9 |   /changelog:
10 |     get:
11 |       summary: Get changelog entries
12 |       # ... (rest of definition - unchanged) ...
13 |       tags:
14 |        - Changelog
15 |       parameters:
16 |        - description: The tool for which to retrieve changelog entries.
17 |          in: query
18 |          name: tool
19 |          required: true
20 |          schema:
21 |            enum:
22 |              - CampaignBuilder
23 |              - Linkshortener
24 |              - Mediaplan
25 |            type: string
26 |       responses:
27 |         "200":
28 |          content:
29 |            application/json:
30 |              schema:
31 |                properties:
32 |                  data:
33 |                    description: List of changelog entries.
34 |                    items:
35 |                      $ref: "#/components/schemas/ChangelogEntry"
36 |                    type: array
37 |                type: object
38 |          description: Successful response - returns a list of changelog entries.
39 |         "400":
40 |          content:
41 |            application/json:
42 |              schema:
43 |                $ref: "#/components/schemas/Error"
44 |          description: Bad Request (e.g., invalid 'tool' value)
45 |         "500":
46 |          content:
47 |            application/json:
48 |              schema:
49 |                $ref: "#/components/schemas/Error"
50 |          description: Internal Server Error
51 | 
52 |   /mediaplans:
53 |     get:
54 |       summary: Get a list of Mediaplans (paginated, filtered, and sorted)
55 |       # ... (rest of definition including existing example - unchanged) ...
56 |       tags:
57 |        - Mediaplans
58 |       parameters:
59 |        - description: The number of items per page.
60 |          example: 10
61 |          in: query
62 |          name: per_page
63 |          schema:
64 |            default: 25
65 |            maximum: 100
66 |            minimum: 1
67 |            type: integer
68 |        - description: The page number to retrieve (0-based).
69 |          example: 0
70 |          in: query
71 |          name: page
72 |          schema:
73 |            default: 0
74 |            minimum: 0
75 |            type: integer
76 |        - content:
77 |            application/json:
78 |              example:
79 |                brand_id: brand-001
80 |                search: Campaign
81 |                status: Draft
82 |              schema:
83 |                $ref: "#/components/schemas/MediaplanFilter"
84 |          description: JSON formatted string for filtering resul ts.
85 |          in: query
86 |          name: filter
87 |        - description: The field to sort by.
88 |          example: updated_at
89 |          in: query
90 |          name: sort
91 |          schema:
92 |            type: string
93 |        - description: Sort order (ascending or descending).
94 |          example: desc
95 |          in: query
96 |          name: order
97 |          schema:
98 |            default: asc
99 |            enum:
100 |              - asc
101 |              - desc
102 |            type: string
103 |       responses:
104 |         "200":
105 |          content:
106 |            application/json:
107 |              example:
108 |                current_page: 0
109 |                items:
110 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d419
111 |                    brand:
112 |                      _id: brand-0
113 |                      name: MINI
114 |                    budget:
115 |                      available: 749.5
116 |                      total: 1500.0
117 |                      used: 750.5
118 |                    created_at: "2024-10-01T10:00:00Z"
119 |                    created_by:
120 |                      _id: user-001
121 |                      name: Fabian Krenzler
122 |                    end_date: "2025-05-31T00:00:00Z"
123 |                    name: MP 1 - Spring Campaign
124 |                    po_numbers:
125 |                      - _id: po-001
126 |                        name: "4700123456"
127 |                        value: 750.5
128 |                    start_date: "2025-03-15T00:00:00Z"
129 |                    status: in_planning
130 |                    updated_at: "2024-10-05T11:00:00Z"
131 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d429
132 |                    brand:
133 |                      _id: brand-1
134 |                      name: BMW
135 |                    budget:
136 |                      available: 2000.75
137 |                      total: 3200.75
138 |                      used: 1200.0
139 |                    created_at: "2024-10-15T14:30:00Z"
140 |                    created_by:
141 |                      _id: user-002
142 |                      name: Alice Smith
143 |                    end_date: "2025-07-15T00:00:00Z"
144 |                    name: MP 2 - Summer Sale
145 |                    po_numbers:
146 |                      - _id: po-002
147 |                        name: "4700987654"
148 |                        value: 1000.0
149 |                      - _id: po-003
150 |                        name: "4700112233"
151 |                        value: 200.0
152 |                    start_date: "2025-06-01T00:00:00Z"
153 |                    status: draft
154 |                    updated_at: "2024-10-18T09:15:00Z"
155 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d439
156 |                    brand:
157 |                      _id: brand-2
158 |                      name: Rolls-Royce
159 |                    budget:
160 |                      available: 500.0
161 |                      total: 5000.0
162 |                      used: 4500.0
163 |                    created_at: "2024-11-01T08:00:00Z"
164 |                    created_by:
165 |                      _id: user-003
166 |                      name: Bob Johnson
167 |                    end_date: "2025-10-31T00:00:00Z"
168 |                    name: MP 3 - Autumn Rollout
169 |                    po_numbers:
170 |                      - _id: po-004
171 |                        name: "4700555666"
172 |                        value: 4500.0
173 |                    start_date: "2025-09-01T00:00:00Z"
174 |                    status: for_approval
175 |                    updated_at: "2024-11-02T12:00:00Z"
176 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d449
177 |                    brand:
178 |                      _id: brand-1
179 |                      name: BMW
180 |                    budget:
181 |                      available: 1949.75
182 |                      total: 2100.0
183 |                      used: 150.25
184 |                    created_at: "2024-11-10T16:20:00Z"
185 |                    created_by:
186 |                      _id: user-004
187 |                      name: Charlie Brown
188 |                    end_date: "2025-12-31T00:00:00Z"
189 |                    name: MP 4 - Winter Special
190 |                    po_numbers:
191 |                      - _id: po-005
192 |                        name: "4700333444"
193 |                        value: 150.25
194 |                    start_date: "2025-11-15T00:00:00Z"
195 |                    status: draft
196 |                    updated_at: "2024-11-11T17:00:00Z"
197 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d459
198 |                    brand:
199 |                      _id: brand-0
200 |                      name: MINI
201 |                    budget:
202 |                      available: 850.0
203 |                      total: 850.0
204 |                      used: 0.0
205 |                    created_at: "2024-11-12T11:55:00Z"
206 |                    created_by:
207 |                      _id: user-001
208 |                      name: Fabian Krenzler
209 |                    end_date: "2025-11-30T00:00:00Z"
210 |                    name: MP 5 - Year End Review Prep
211 |                    po_numbers: []
212 |                    start_date: "2025-10-01T00:00:00Z"
213 |                    status: in_planning
214 |                    updated_at: "2024-11-12T11:55:00Z"
215 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d469
216 |                    brand:
217 |                      _id: brand-1
218 |                      name: BMW
219 |                    budget:
220 |                      available: 2000.01
221 |                      total: 4000.0
222 |                      used: 1999.99
223 |                    created_at: "2024-11-15T09:05:00Z"
224 |                    created_by:
225 |                      _id: user-002
226 |                      name: Alice Smith
227 |                    end_date: "2026-01-31T00:00:00Z"
228 |                    name: MP 6 - Q1 Planning 2026
229 |                    po_numbers:
230 |                      - _id: po-006
231 |                        name: "4700777888"
232 |                        value: 1999.99
233 |                    start_date: "2025-12-01T00:00:00Z"
234 |                    status: draft
235 |                    updated_at: "2024-11-20T14:25:00Z"
236 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d479
237 |                    brand:
238 |                      _id: brand-0
239 |                      name: MINI
240 |                    budget:
241 |                      available: 0.5
242 |                      total: 1800.5
243 |                      used: 1800.0
244 |                    created_at: "2024-11-22T13:00:00Z"
245 |                    created_by:
246 |                      _id: user-003
247 |                      name: Bob Johnson
248 |                    end_date: "2025-06-30T00:00:00Z"
249 |                    name: MP 7 - Brand Awareness Push
250 |                    po_numbers:
251 |                      - _id: po-007
252 |                        name: "4700224466"
253 |                        value: 1800.0
254 |                    start_date: "2025-04-01T00:00:00Z"
255 |                    status: for_approval
256 |                    updated_at: "2024-11-25T10:10:00Z"
257 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d489
258 |                    brand:
259 |                      _id: brand-1
260 |                      name: BMW
261 |                    budget:
262 |                      available: 1.0
263 |                      total: 550.0
264 |                      used: 549.0
265 |                    created_at: "2024-11-28T15:00:00Z"
266 |                    created_by:
267 |                      _id: user-004
268 |                      name: Charlie Brown
269 |                    end_date: "2025-05-15T00:00:00Z"
270 |                    name: MP 8 - Lead Generation Test
271 |                    po_numbers:
272 |                      - _id: po-008
273 |                        name: "4700121212"
274 |                        value: 549.0
275 |                    start_date: "2025-05-01T00:00:00Z"
276 |                    status: in_planning
277 |                    updated_at: "2024-11-29T15:00:00Z"
278 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d499
279 |                    brand:
280 |                      _id: brand-2
281 |                      name: Rolls-Royce
282 |                    budget:
283 |                      available: 2800.0
284 |                      total: 2900.0
285 |                      used: 100.0
286 |                    created_at: "2024-12-02T10:30:00Z"
287 |                    created_by:
288 |                      _id: user-001
289 |                      name: Fabian Krenzler
290 |                    end_date: "2025-09-30T00:00:00Z"
291 |                    name: MP 9 - Social Media Engagement
292 |                    po_numbers:
293 |                      - _id: po-009
294 |                        name: "4700998877"
295 |                        value: 100.0
296 |                    start_date: "2025-07-01T00:00:00Z"
297 |                    status: draft
298 |                    updated_at: "2024-12-03T11:30:00Z"
299 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d409
300 |                    brand:
301 |                      _id: brand-0
302 |                      name: MINI
303 |                    budget:
304 |                      available: 0.0
305 |                      total: 1150.8
306 |                      used: 1150.8
307 |                    created_at: "2024-12-05T16:00:00Z"
308 |                    created_by:
309 |                      _id: user-002
310 |                      name: Alice Smith
311 |                    end_date: "2025-10-15T00:00:00Z"
312 |                    name: MP 10 - Partner Co-Marketing
313 |                    po_numbers:
314 |                      - _id: po-010
315 |                        name: "4700101010"
316 |                        value: 1150.8
317 |                    start_date: "2025-08-15T00:00:00Z"
318 |                    status: in_planning
319 |                    updated_at: "2024-12-10T08:45:00Z"
320 |                total_items: 10
321 |                total_pages: 1
322 |              schema:
323 |                properties:
324 |                  current_page:
325 |                    description: The current page number (0-based).
326 |                    example: 0
327 |                    type: integer
328 |                  items:
329 |                    description: List of mediaplans on the current page.
330 |                    items:
331 |                      $ref: "#/components/schemas/Mediaplan"
332 |                    type: array
333 |                  total_items:
334 |                    description: Total number of mediaplans.
335 |                    example: 100
336 |                    type: integer
337 |                  total_pages:
338 |                    description: Total number of pages.
339 |                    example: 4
340 |                    type: integer
341 |                type: object
342 |          description: Successful response - returns a list of Mediaplans.
343 |         "400":
344 |          content:
345 |            application/json:
346 |              schema:
347 |                $ref: "#/components/schemas/Error"
348 |          description: Bad Request (e.g., invalid query parameters, invalid JSON filter)
349 |         "422":
350 |          content:
351 |            application/json:
352 |              schema:
353 |                $ref: "#/components/schemas/Error"
354 |          description: Validation Error (e.g., invalid date format)
355 |         "500":
356 |          content:
357 |            application/json:
358 |              schema:
359 |                $ref: "#/components/schemas/Error"
360 |          description: Internal Server Error
361 | 
362 |     post:
363 |       summary: Create a new Mediaplan
364 |       # ... (rest of definition - unchanged) ...
365 |       tags:
366 |        - Mediaplans
367 |       requestBody:
368 |         content:
369 |           application/json:
370 |             example:
371 |               brand:
372 |                 _id: brand-uuid-here
373 |                 name: Example Brand
374 |               budget:
375 |                 available: 100.0
376 |                 total: 10000.0
377 |                 used: 900.0
378 |               end_date: "2024-12-31T00:00:00Z"
379 |               name: My New Campaign
380 |               po_numbers:
381 |                 - _id: 12837912864
382 |                   name: abc
383 |                   value: 123.0
384 |               start_date: "2024-11-15T00:00:00Z"
385 |               status: Draft
386 |             schema:
387 |               $ref: "#/components/schemas/MediaplanCreate"
388 |         required: true
389 |       responses:
390 |         "201":
391 |          content:
392 |            application/json:
393 |              schema:
394 |                $ref: "#/components/schemas/Mediaplan"
395 |          description: Mediaplan created successfully.
396 |          headers:
397 |            Location:
398 |              description: URL of the newly created resource.
399 |              schema:
400 |                format: url
401 |                type: string
402 |         "400":
403 |          content:
404 |            application/json:
405 |              schema:
406 |                $ref: "#/components/schemas/Error"
407 |          description: Bad Request (e.g., invalid request body)
408 |         "422":
409 |          content:
410 |            application/json:
411 |              schema:
412 |                $ref: "#/components/schemas/Error"
413 |          description: Unprocessable Entity (validation errors)
414 |         "500":
415 |          content:
416 |            application/json:
417 |              schema:
418 |                $ref: "#/components/schemas/Error"
419 |          description: Internal Server Error
420 | 
421 |   /mediaplans/{id}:
422 |     get:
423 |       summary: Get a single Mediaplan by ID
424 |       # ... (rest of definition - unchanged) ...
425 |       tags:
426 |        - Mediaplans
427 |       parameters:
428 |        - description: The unique identifier of the Mediaplan.
429 |          in: path
430 |          name: id
431 |          required: true
432 |          schema:
433 |            format: uuid
434 |            type: string
435 |       responses:
436 |         "200":
437 |          content:
438 |            application/json:
439 |              schema:
440 |                $ref: "#/components/schemas/Mediaplan"
441 |          description: Successful response - returns the Mediaplan.
442 |         "400":
443 |          content:
444 |            application/json:
445 |              schema:
446 |                $ref: "#/components/schemas/Error"
447 |          description: Bad Request (e.g., invalid UUID format)
448 |         "404":
449 |          content:
450 |            application/json:
451 |              schema:
452 |                $ref: "#/components/schemas/Error"
453 |          description: Mediaplan not found.
454 |         "500":
455 |          content:
456 |            application/json:
457 |              schema:
458 |                $ref: "#/components/schemas/Error"
459 |          description: Internal Server Error
460 | 
461 |     put:
462 |       summary: Update a Mediaplan (replace entire resource)
463 |       # ... (rest of definition - unchanged) ...
464 |       tags:
465 |        - Mediaplans
466 |       parameters:
467 |        - description: The unique identifier of the Mediaplan.
468 |          in: path
469 |          name: id
470 |          required: true
471 |          schema:
472 |            format: uuid
473 |            type: string
474 |       requestBody:
475 |         content:
476 |           application/json:
477 |             schema:
478 |               $ref: "#/components/schemas/Mediaplan"
479 |         required: true
480 |       responses:
481 |         "200":
482 |          content:
483 |            application/json:
484 |              schema:
485 |                $ref: "#/components/schemas/Mediaplan"
486 |          description: Mediaplan updated successfully.
487 |         "204":
488 |          description: Mediaplan updated successfully.
489 |         "400":
490 |          content:
491 |            application/json:
492 |              schema:
493 |                $ref: "#/components/schemas/Error"
494 |          description: Bad Request
495 |         "404":
496 |          content:
497 |            application/json:
498 |              schema:
499 |                $ref: "#/components/schemas/Error"
500 |          description: Mediaplan not found.
501 |         "422":
502 |          content:
503 |            application/json:
504 |              schema:
505 |                $ref: "#/components/schemas/Error"
506 |          description: Unprocessable Entity
507 |         "500":
508 |          content:
509 |            application/json:
510 |              schema:
511 |                $ref: "#/components/schemas/Error"
512 |          description: Internal Server Error
513 | 
514 |     delete:
515 |       summary: Delete a Mediaplan
516 |       # ... (rest of definition - unchanged) ...
517 |       tags:
518 |        - Mediaplans
519 |       parameters:
520 |        - description: The unique identifier of the Mediaplan.
521 |          in: path
522 |          name: id
523 |          required: true
524 |          schema:
525 |            format: uuid
526 |            type: string
527 |       responses:
528 |         "204":
529 |          description: Mediaplan deleted successfully.
530 |         "400":
531 |          content:
532 |            application/json:
533 |              schema:
534 |                $ref: "#/components/schemas/Error"
535 |          description: Bad Request
536 |         "404":
537 |          content:
538 |            application/json:
539 |              schema:
540 |                $ref: "#/components/schemas/Error"
541 |          description: Mediaplan not found.
542 |         "500":
543 |          content:
544 |            application/json:
545 |              schema:
546 |                $ref: "#/components/schemas/Error"
547 |          description: Internal Server Error
548 | 
549 |   /mediaplans/{mediaplanId}/projects:
550 |     get:
551 |       summary: Get all projects for a given Mediaplan
552 |       # ... (rest of definition including previous example - unchanged) ...
553 |       tags:
554 |        - Projects
555 |       parameters:
556 |        - description: The ID of the Mediaplan.
557 |          in: path
558 |          name: mediaplanId
559 |          required: true
560 |          schema:
561 |            format: uuid
562 |            type: string
563 |       responses:
564 |         "200":
565 |          content:
566 |            application/json:
567 |              example:
568 |                current_page: 0
569 |                items:
570 |                  - _id: f47ac10b-58cc-4372-a567-0e02b2c3d479
571 |                    abbreviation: "NC-ALWAYS-ON-2024_Individ #1"
572 |                    created_at: "2024-10-02T09:15:00Z"
573 |                    default_vars:
574 |                      adtype: Banner
575 |                      campaigndetail: null
576 |                      campaigntype: Always On
577 |                      dimension: 300x250
578 |                      language: DEU
579 |                      subsegment: New Car
580 |                      targeturls: null
581 |                    descriptive_vars:
582 |                      adobecampaignname: Always On 2024
583 |                      bmwponumber: PO12345
584 |                      brand: MINI
585 |                      campaigntype: Always On
586 |                      country: SE
587 |                      projectname: NC-ALWAYS-ON-2024_Individ
588 |                      subsegment: New Car
589 |                      year: 2024
590 |                    detail: To be defined might be very long
591 |                    duration:
592 |                      end_date: "2024-04-15T00:00:00Z"
593 |                      formatted: 15.01-15.04.2024
594 |                      start_date: "2024-01-15T00:00:00Z"
595 |                    is_locked: false
596 |                    labels: []
597 |                    lock_state: 0
598 |                    owner: user123
599 |                    updated_at: "2024-10-02T09:15:00Z"
600 |                    uploaded_at: "2024-10-02T09:15:00Z"
601 |                  - _id: a3b8d4e1-6c2f-4a1e-8b7d-9c1f0a3e2b1d
602 |                    abbreviation: "NC-SPECIAL-2024_Individ #2"
603 |                    created_at: "2024-10-03T11:30:00Z"
604 |                    default_vars:
605 |                      adtype: Banner
606 |                      campaigndetail: null
607 |                      campaigntype: Always On
608 |                      dimension: 300x250
609 |                      language: SWE
610 |                      subsegment: New Car
611 |                      targeturls: null
612 |                    descriptive_vars:
613 |                      adobecampaignname: Always On 2024
614 |                      bmwponumber: PO67890
615 |                      brand: MINI
616 |                      campaigntype: Always On
617 |                      country: NL
618 |                      projectname: NC-ALWAYS-ON-2024_Individ
619 |                      subsegment: New Car
620 |                      year: 2024
621 |                    detail: This project focuses on the Dutch market.
622 |                    duration:
623 |                      end_date: "2024-04-15T00:00:00Z"
624 |                      formatted: 01.01-30.04.2024
625 |                      start_date: "2024-01-15T00:00:00Z"
626 |                    is_locked: false
627 |                    labels: []
628 |                    lock_state: 0
629 |                    owner: user123
630 |                    updated_at: "2024-10-03T11:30:00Z"
631 |                    uploaded_at: "2024-10-03T11:30:00Z"
632 |                  - _id: e1c7b6a0-8d3e-4f5a-9b8c-1d0e2f3a4b5c
633 |                    abbreviation: "NC-ALWAYS-ON-2024_Individ #3"
634 |                    created_at: "2024-10-04T15:20:00Z"
635 |                    default_vars:
636 |                      adtype: Banner
637 |                      campaigndetail: null
638 |                      campaigntype: Always On
639 |                      dimension: 300x250
640 |                      language: NLD
641 |                      subsegment: New Car
642 |                      targeturls: null
643 |                    descriptive_vars:
644 |                      adobecampaignname: Always On 2024
645 |                      bmwponumber: PO12345
646 |                      brand: MINI
647 |                      campaigntype: Always On
648 |                      country: FR
649 |                      projectname: NC-ALWAYS-ON-2024_Individ
650 |                      subsegment: New Car
651 |                      year: 2024
652 |                    detail: To be defined might be very long
653 |                    duration:
654 |                      end_date: "2024-04-15T00:00:00Z"
655 |                      formatted: 01.03-30.04.2024
656 |                      start_date: "2024-01-15T00:00:00Z"
657 |                    is_locked: false
658 |                    labels: []
659 |                    lock_state: 0
660 |                    owner: user123
661 |                    updated_at: "2024-10-04T15:20:00Z"
662 |                    uploaded_at: "2024-10-04T15:20:00Z"
663 |                  - _id: b9d8c7e1-7a4f-4b6e-9c8d-0e1f2a3b4c5d
664 |                    abbreviation: "NC-SPECIAL-2024_Individ #4"
665 |                    created_at: "2024-10-05T10:45:00Z"
666 |                    default_vars:
667 |                      adtype: Banner
668 |                      campaigndetail: null
669 |                      campaigntype: Always On
670 |                      dimension: 300x250
671 |                      language: DEU
672 |                      subsegment: New Car
673 |                      targeturls: null
674 |                    descriptive_vars:
675 |                      adobecampaignname: Always On 2024
676 |                      bmwponumber: PO67890
677 |                      brand: MINI
678 |                      campaigntype: Always On
679 |                      country: SE
680 |                      projectname: NC-ALWAYS-ON-2024_Individ
681 |                      subsegment: New Car
682 |                      year: 2024
683 |                    detail: This is a special project for the Swedish market.
684 |                    duration:
685 |                      end_date: "2024-04-15T00:00:00Z"
686 |                      formatted: 15.01-15.04.2024
687 |                      start_date: "2024-01-15T00:00:00Z"
688 |                    is_locked: false
689 |                    labels: []
690 |                    lock_state: 0
691 |                    owner: user123
692 |                    updated_at: "2024-10-05T10:45:00Z"
693 |                    uploaded_at: "2024-10-05T10:45:00Z"
694 |                  - _id: d3e4f5a0-8b7c-4a1e-8c7d-9f0a1b2c3d4e
695 |                    abbreviation: "NC-ALWAYS-ON-2024_Individ #5"
696 |                    created_at: "2024-10-06T13:15:00Z"
697 |                    default_vars:
698 |                      adtype: Banner
699 |                      campaigndetail: null
700 |                      campaigntype: Always On
701 |                      dimension: 300x250
702 |                      language: SWE
703 |                      subsegment: New Car
704 |                      targeturls: null
705 |                    descriptive_vars:
706 |                      adobecampaignname: Always On 2024
707 |                      bmwponumber: PO12345
708 |                      brand: MINI
709 |                      campaigntype: Always On
710 |                      country: NL
711 |                      projectname: NC-ALWAYS-ON-2024_Individ
712 |                      subsegment: New Car
713 |                      year: 2024
714 |                    detail: To be defined might be very long
715 |                    duration:
716 |                      end_date: "2024-04-15T00:00:00Z"
717 |                      formatted: 01.01-15.04.2024
718 |                      start_date: "2024-01-15T00:00:00Z"
719 |                    is_locked: false
720 |                    labels: []
721 |                    lock_state: 0
722 |                    owner: user123
723 |                    updated_at: "2024-10-06T13:15:00Z"
724 |                    uploaded_at: "2024-10-06T13:15:00Z"
725 |                  - _id: c7b8a9e1-6d3f-4c2a-9a8b-1e0f2d3c4b5a
726 |                    abbreviation: "NC-ALWAYS-ON-2024_Individ #6"
727 |                    created_at: "2024-10-07T09:15:00Z"
728 |                    default_vars:
729 |                      adtype: Banner
730 |                      campaigndetail: null
731 |                      campaigntype: Always On
732 |                      dimension: 300x250
733 |                      language: DEU
734 |                      subsegment: New Car
735 |                      targeturls: null
736 |                    descriptive_vars:
737 |                      adobecampaignname: Always On 2024
738 |                      bmwponumber: PO67890
739 |                      brand: MINI
740 |                      campaigntype: Always On
741 |                      country: FR
742 |                      projectname: NC-ALWAYS-ON-2024_Individ
743 |                      subsegment: New Car
744 |                      year: 2024
745 |                    detail: To be defined might be very long
746 |                    duration:
747 |                      end_date: "2024-04-15T00:00:00Z"
748 |                      formatted: 15.01-30.06.2024
749 |                      start_date: "2024-01-15T00:00:00Z"
750 |                    is_locked: false
751 |                    labels: []
752 |                    lock_state: 0
753 |                    owner: user123
754 |                    updated_at: "2024-10-07T09:15:00Z"
755 |                    uploaded_at: "2024-10-07T09:15:00Z"
756 |                  - _id: a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d
757 |                    abbreviation: "NC-SPECIAL-2024_Individ #7"
758 |                    created_at: "2024-10-08T11:30:00Z"
759 |                    default_vars:
760 |                      adtype: Banner
761 |                      campaigndetail: null
762 |                      campaigntype: Always On
763 |                      dimension: 300x250
764 |                      language: NLD
765 |                      subsegment: New Car
766 |                      targeturls: null
767 |                    descriptive_vars:
768 |                      adobecampaignname: Always On 2024
769 |                      bmwponumber: PO12345
770 |                      brand: MINI
771 |                      campaigntype: Always On
772 |                      country: SE
773 |                      projectname: NC-ALWAYS-ON-2024_Individ
774 |                      subsegment: New Car
775 |                      year: 2024
776 |                    detail: To be defined might be very long
777 |                    duration:
778 |                      end_date: "2024-04-15T00:00:00Z"
779 |                      formatted: 01.04-30.06.2024
780 |                      start_date: "2024-01-15T00:00:00Z"
781 |                    is_locked: false
782 |                    labels: []
783 |                    lock_state: 0
784 |                    owner: user123
785 |                    updated_at: "2024-10-08T11:30:00Z"
786 |                    uploaded_at: "2024-10-08T11:30:00Z"
787 |                  - _id: f0e1d2c3-4b5a-4c6d-8e9f-0a1b2c3d4e5f
788 |                    abbreviation: "NC-ALWAYS-ON-2024_Individ #8"
789 |                    created_at: "2024-10-09T15:20:00Z"
790 |                    default_vars:
791 |                      adtype: Banner
792 |                      campaigndetail: null
793 |                      campaigntype: Always On
794 |                      dimension: 300x250
795 |                      language: DEU
796 |                      subsegment: New Car
797 |                      targeturls: null
798 |                    descriptive_vars:
799 |                      adobecampaignname: Always On 2024
800 |                      bmwponumber: PO67890
801 |                      brand: MINI
802 |                      campaigntype: Always On
803 |                      country: NL
804 |                      projectname: NC-ALWAYS-ON-2024_Individ
805 |                      subsegment: New Car
806 |                      year: 2024
807 |                    detail: To be defined might be very long
808 |                    duration:
809 |                      end_date: "2024-04-15T00:00:00Z"
810 |                      formatted: 01.01-15.05.2024
811 |                      start_date: "2024-01-15T00:00:00Z"
812 |                    is_locked: false
813 |                    labels: []
814 |                    lock_state: 0
815 |                    owner: user123
816 |                    updated_at: "2024-10-09T15:20:00Z"
817 |                    uploaded_at: "2024-10-09T15:20:00Z"
818 |                  - _id: b4c5d6e7-8f9a-4b1c-9d0e-1f2a3b4c5d6e
819 |                    abbreviation: "NC-SPECIAL-2024_Individ #9"
820 |                    created_at: "2024-10-10T10:45:00Z"
821 |                    default_vars:
822 |                      adtype: Banner
823 |                      campaigndetail: null
824 |                      campaigntype: Always On
825 |                      dimension: 300x250
826 |                      language: SWE
827 |                      subsegment: New Car
828 |                      targeturls: null
829 |                    descriptive_vars:
830 |                      adobecampaignname: Always On 2024
831 |                      bmwponumber: PO12345
832 |                      brand: MINI
833 |                      campaigntype: Always On
834 |                      country: FR
835 |                      projectname: NC-ALWAYS-ON-2024_Individ
836 |                      subsegment: New Car
837 |                      year: 2024
838 |                    detail: To be defined might be very long
839 |                    duration:
840 |                      end_date: "2024-04-15T00:00:00Z"
841 |                      formatted: 15.01-30.06.2024
842 |                      start_date: "2024-01-15T00:00:00Z"
843 |                    is_locked: false
844 |                    labels: []
845 |                    lock_state: 0
846 |                    owner: user123
847 |                    updated_at: "2024-10-10T10:45:00Z"
848 |                    uploaded_at: "2024-10-10T10:45:00Z"
849 |                  - _id: d8e9f0a1-b2c3-4d4e-8f5a-0b1c2d3e4f5a
850 |                    abbreviation: "NC-ALWAYS-ON-2024_Individ #10"
851 |                    created_at: "2024-10-11T13:15:00Z"
852 |                    default_vars:
853 |                      adtype: Banner
854 |                      campaigndetail: null
855 |                      campaigntype: Always On
856 |                      dimension: 300x250
857 |                      language: NLD
858 |                      subsegment: New Car
859 |                      targeturls: null
860 |                    descriptive_vars:
861 |                      adobecampaignname: Always On 2024
862 |                      bmwponumber: PO67890
863 |                      brand: MINI
864 |                      campaigntype: Always On
865 |                      country: SE
866 |                      projectname: NC-ALWAYS-ON-2024_Individ
867 |                      subsegment: New Car
868 |                      year: 2024
869 |                    detail: To be defined might be very long
870 |                    duration:
871 |                      end_date: "2024-04-15T00:00:00Z"
872 |                      formatted: 01.05-30.06.2024
873 |                      start_date: "2024-01-15T00:00:00Z"
874 |                    is_locked: false
875 |                    labels: []
876 |                    lock_state: 0
877 |                    owner: user123
878 |                    updated_at: "2024-10-11T13:15:00Z"
879 |                    uploaded_at: "2024-10-11T13:15:00Z"
880 |                  - _id: 1f2a3b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c
881 |                    abbreviation: USED-CAR-Q3-2024_Campaign_11
882 |                    created_at: "2024-11-01T10:00:00Z"
883 |                    default_vars:
884 |                      adtype: Video
885 |                      campaigndetail: null
886 |                      campaigntype: Sales
887 |                      dimension: 1920x1080
888 |                      language: ENG
889 |                      subsegment: Used Car
890 |                      targeturls: https://example.com/used
891 |                    descriptive_vars:
892 |                      adobecampaignname: Used Car Q3
893 |                      bmwponumber: PO99887
894 |                      brand: BMW
895 |                      campaigntype: Sales
896 |                      country: GB
897 |                      projectname: USED-CAR-Q3-2024_Campaign
898 |                      subsegment: Used Car
899 |                      year: 2024
900 |                    detail: Focus on certified pre-owned vehicles.
901 |                    duration:
902 |                      end_date: "2024-09-30T00:00:00Z"
903 |                      formatted: 01.07-30.09.2024
904 |                      start_date: "2024-07-01T00:00:00Z"
905 |                    is_locked: true
906 |                    labels:
907 |                      - priority
908 |                      - video
909 |                    lock_state: 1
910 |                    owner: user456
911 |                    updated_at: "2024-11-05T14:00:00Z"
912 |                    uploaded_at: "2024-11-01T10:00:00Z"
913 |                  - _id: 2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d
914 |                    abbreviation: SERVICE-WINTER-CHECK_Promo_12
915 |                    created_at: "2024-11-02T11:20:00Z"
916 |                    default_vars:
917 |                      adtype: Social
918 |                      campaigndetail: Tyre Change
919 |                      campaigntype: Seasonal
920 |                      dimension: 1080x1080
921 |                      language: FRA
922 |                      subsegment: Aftersales
923 |                      targeturls: null
924 |                    descriptive_vars:
925 |                      adobecampaignname: Winter Check 24
926 |                      bmwponumber: PO77665
927 |                      brand: BMW
928 |                      campaigntype: Seasonal
929 |                      country: FR
930 |                      projectname: SERVICE-WINTER-CHECK_Promo
931 |                      subsegment: Aftersales
932 |                      year: 2024
933 |                    detail: Promotional offer for winter service checks.
934 |                    duration:
935 |                      end_date: "2024-12-15T00:00:00Z"
936 |                      formatted: 15.10-15.12.2024
937 |                      start_date: "2024-10-15T00:00:00Z"
938 |                    is_locked: false
939 |                    labels:
940 |                      - aftersales
941 |                    lock_state: 0
942 |                    owner: user789
943 |                    updated_at: "2024-11-03T11:20:00Z"
944 |                    uploaded_at: "2024-11-02T11:20:00Z"
945 |                  - _id: 3b4c5d6e-7f8a-4b9c-0d1e-2f3a4b5c6d7e
946 |                    abbreviation: NC-LAUNCH-X5-2025_Awareness_13
947 |                    created_at: "2024-11-10T09:00:00Z"
948 |                    default_vars:
949 |                      adtype: Display
950 |                      campaigndetail: X5 Facelift
951 |                      campaigntype: Launch
952 |                      dimension: 728x90
953 |                      language: DEU
954 |                      subsegment: New Car
955 |                      targeturls: null
956 |                    descriptive_vars:
957 |                      adobecampaignname: X5 Launch 2025
958 |                      bmwponumber: PO11223
959 |                      brand: BMW
960 |                      campaigntype: Launch
961 |                      country: DE
962 |                      projectname: NC-LAUNCH-X5-2025_Awareness
963 |                      subsegment: New Car
964 |                      year: 2025
965 |                    detail: Initial awareness phase for the new X5 model.
966 |                    duration:
967 |                      end_date: "2025-03-31T00:00:00Z"
968 |                      formatted: 01.02-31.03.2025
969 |                      start_date: "2025-02-01T00:00:00Z"
970 |                    is_locked: false
971 |                    labels:
972 |                      - launch
973 |                      - awareness
974 |                    lock_state: 0
975 |                    owner: user123
976 |                    updated_at: "2024-11-12T16:30:00Z"
977 |                    uploaded_at: "2024-11-10T09:00:00Z"
978 |                  - _id: 4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f
979 |                    abbreviation: MINI-EV-TESTDRIVE_LeadGen_14
980 |                    created_at: "2024-11-15T13:45:00Z"
981 |                    default_vars:
982 |                      adtype: Search
983 |                      campaigndetail: Electric Cooper
984 |                      campaigntype: Lead Generation
985 |                      dimension: null
986 |                      language: NLD
987 |                      subsegment: New Car
988 |                      targeturls: https://mini.example.com/testdrive
989 |                    descriptive_vars:
990 |                      adobecampaignname: MINI EV Leads
991 |                      bmwponumber: PO44556
992 |                      brand: MINI
993 |                      campaigntype: Lead Generation
994 |                      country: NL
995 |                      projectname: MINI-EV-TESTDRIVE_LeadGen
996 |                      subsegment: New Car
997 |                      year: 2024
998 |                    detail: Campaign to generate test drive requests for MINI Electric.
999 |                    duration:
1000 |                      end_date: "2024-12-20T00:00:00Z"
1001 |                      formatted: 20.11-20.12.2024
1002 |                      start_date: "2024-11-20T00:00:00Z"
1003 |                    is_locked: false
1004 |                    labels:
1005 |                      - electric
1006 |                      - leads
1007 |                    lock_state: 0
1008 |                    owner: user456
1009 |                    updated_at: "2024-11-15T13:45:00Z"
1010 |                    uploaded_at: "2024-11-15T13:45:00Z"
1011 |                  - _id: 5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a
1012 |                    abbreviation: BMW-M-PERFORMANCE_Consideration_15
1013 |                    created_at: "2024-11-20T10:10:00Z"
1014 |                    default_vars:
1015 |                      adtype: Video
1016 |                      campaigndetail: M Models
1017 |                      campaigntype: Consideration
1018 |                      dimension: 1920x1080
1019 |                      language: ITA
1020 |                      subsegment: New Car
1021 |                      targeturls: null
1022 |                    descriptive_vars:
1023 |                      adobecampaignname: M Power Consideration
1024 |                      bmwponumber: PO66778
1025 |                      brand: BMW
1026 |                      campaigntype: Consideration
1027 |                      country: IT
1028 |                      projectname: BMW-M-PERFORMANCE_Consideration
1029 |                      subsegment: New Car
1030 |                      year: 2024
1031 |                    detail: Highlighting M performance parts and models.
1032 |                    duration:
1033 |                      end_date: "2024-11-30T00:00:00Z"
1034 |                      formatted: 01.09-30.11.2024
1035 |                      start_date: "2024-09-01T00:00:00Z"
1036 |                    is_locked: false
1037 |                    labels:
1038 |                      - performance
1039 |                      - M
1040 |                    lock_state: 0
1041 |                    owner: user789
1042 |                    updated_at: "2024-11-21T12:00:00Z"
1043 |                    uploaded_at: "2024-11-20T10:10:00Z"
1044 |                  - _id: 6e7f8a9b-0c1d-4e2f-3a4b-5c6d7e8f9a0b
1045 |                    abbreviation: FINANCIAL-SERVICES-Q1-25_Offer_16
1046 |                    created_at: "2024-11-25T15:00:00Z"
1047 |                    default_vars:
1048 |                      adtype: Display
1049 |                      campaigndetail: Leasing 0%
1050 |                      campaigntype: Offer
1051 |                      dimension: 300x600
1052 |                      language: ESP
1053 |                      subsegment: Financial Services
1054 |                      targeturls: https://bmw-fs.example.com/offers
1055 |                    descriptive_vars:
1056 |                      adobecampaignname: FS Q1 Offers
1057 |                      bmwponumber: PO22334
1058 |                      brand: BMW
1059 |                      campaigntype: Offer
1060 |                      country: ES
1061 |                      projectname: FINANCIAL-SERVICES-Q1-25_Offer
1062 |                      subsegment: Financial Services
1063 |                      year: 2025
1064 |                    detail: Special financing offers for Q1 2025.
1065 |                    duration:
1066 |                      end_date: "2025-03-31T00:00:00Z"
1067 |                      formatted: 10.01-31.03.2025
1068 |                      start_date: "2025-01-10T00:00:00Z"
1069 |                    is_locked: false
1070 |                    labels:
1071 |                      - financing
1072 |                      - FS
1073 |                    lock_state: 0
1074 |                    owner: user123
1075 |                    updated_at: "2024-11-28T10:00:00Z"
1076 |                    uploaded_at: "2024-11-25T15:00:00Z"
1077 |                  - _id: 7f8a9b0c-1d2e-4f3a-4b5c-6d7e8f9a0b1c
1078 |                    abbreviation: MINI-USED-NEXT_Q4_Sales_17
1079 |                    created_at: "2024-12-01T12:12:12Z"
1080 |                    default_vars:
1081 |                      adtype: Search
1082 |                      campaigndetail: MINI Next
1083 |                      campaigntype: Sales
1084 |                      dimension: null
1085 |                      language: DEU
1086 |                      subsegment: Used Car
1087 |                      targeturls: null
1088 |                    descriptive_vars:
1089 |                      adobecampaignname: MINI Used Q4 AT
1090 |                      bmwponumber: PO55667
1091 |                      brand: MINI
1092 |                      campaigntype: Sales
1093 |                      country: AT
1094 |                      projectname: MINI-USED-NEXT_Q4_Sales
1095 |                      subsegment: Used Car
1096 |                      year: 2024
1097 |                    detail: Promoting MINI Next certified used cars in Austria.
1098 |                    duration:
1099 |                      end_date: "2024-12-31T00:00:00Z"
1100 |                      formatted: 01.10-31.12.2024
1101 |                      start_date: "2024-10-01T00:00:00Z"
1102 |                    is_locked: false
1103 |                    labels:
1104 |                      - used
1105 |                      - mini next
1106 |                    lock_state: 0
1107 |                    owner: user456
1108 |                    updated_at: "2024-12-01T12:12:12Z"
1109 |                    uploaded_at: "2024-12-01T12:12:12Z"
1110 |                  - _id: 8a9b0c1d-2e3f-4a4b-5c6d-7e8f9a0b1c2d
1111 |                    abbreviation: BMW-I4-SUSTAINABILITY_Brand_18
1112 |                    created_at: "2024-12-05T08:30:00Z"
1113 |                    default_vars:
1114 |                      adtype: Social
1115 |                      campaigndetail: i4 Electric
1116 |                      campaigntype: Brand
1117 |                      dimension: 1080x1920
1118 |                      language: ENG
1119 |                      subsegment: Corporate
1120 |                      targeturls: https://bmw.example.com/sustainability
1121 |                    descriptive_vars:
1122 |                      adobecampaignname: BMW Sustainability i4
1123 |                      bmwponumber: PO88990
1124 |                      brand: BMW
1125 |                      campaigntype: Brand
1126 |                      country: US
1127 |                      projectname: BMW-I4-SUSTAINABILITY_Brand
1128 |                      subsegment: Corporate
1129 |                      year: 2024
1130 |                    detail: Brand campaign focusing on the sustainability aspects of the BMW i4.
1131 |                    duration:
1132 |                      end_date: "2025-01-31T00:00:00Z"
1133 |                      formatted: 01.11-31.01.2025
1134 |                      start_date: "2024-11-01T00:00:00Z"
1135 |                    is_locked: true
1136 |                    labels:
1137 |                      - brand
1138 |                      - sustainability
1139 |                      - electric
1140 |                      - i4
1141 |                    lock_state: 1
1142 |                    owner: user789
1143 |                    updated_at: "2024-12-10T11:00:00Z"
1144 |                    uploaded_at: "2024-12-05T08:30:00Z"
1145 |                total_items: 18
1146 |                total_pages: 1
1147 |              schema:
1148 |                items:
1149 |                  $ref: "#/components/schemas/Project"
1150 |                type: array
1151 |          description: Successful response - returns a list of projects.
1152 |         "400":
1153 |          content:
1154 |            application/json:
1155 |              schema:
1156 |                $ref: "#/components/schemas/Error"
1157 |          description: Bad Request (e.g., invalid Mediaplan ID format)
1158 |         "404":
1159 |          content:
1160 |            application/json:
1161 |              schema:
1162 |                $ref: "#/components/schemas/Error"
1163 |          description: Mediaplan not found.
1164 |         "500":
1165 |          content:
1166 |            application/json:
1167 |              schema:
1168 |                $ref: "#/components/schemas/Error"
1169 |          description: Internal Server Error
1170 | 
1171 |     post:
1172 |       summary: Create a new Project for a Mediaplan
1173 |       # ... (rest of definition - unchanged) ...
1174 |       tags:
1175 |        - Projects
1176 |       parameters:
1177 |        - description: The ID of the Mediaplan to which the project belongs.
1178 |          in: path
1179 |          name: mediaplanId
1180 |          required: true
1181 |          schema:
1182 |            format: uuid
1183 |            type: string
1184 |       requestBody:
1185 |         content:
1186 |           application/json:
1187 |             example:
1188 |               abbreviation: MyNewProject
1189 |               default_vars:
1190 |                 adtype: Banner
1191 |                 campaigndetail: null
1192 |                 campaigntype: Awareness
1193 |                 dimension: 300x250
1194 |                 language: en
1195 |                 subsegment: OT
1196 |                 targeturls: null
1197 |               descriptive_vars:
1198 |                 adobecampaignname: SummerSale
1199 |                 bmwponumber: PO12345
1200 |                 brand: BMW
1201 |                 campaigntype: Awareness
1202 |                 country: US
1203 |                 projectname: SummerSale_OT
1204 |                 subsegment: OT
1205 |                 year: 2025
1206 |               is_locked: false
1207 |               labels: []
1208 |               lock_state: 0
1209 |               message: OK
1210 |               owner: user123
1211 |               version: v1
1212 |             schema:
1213 |               $ref: "#/components/schemas/ProjectCreate"
1214 |         required: true
1215 |       responses:
1216 |         "201":
1217 |          content:
1218 |            application/json:
1219 |              schema:
1220 |                $ref: "#/components/schemas/Project"
1221 |          description: Project created successfully.
1222 |          headers:
1223 |            Location:
1224 |              description: URL of the newly created Project.
1225 |              schema:
1226 |                format: url
1227 |                type: string
1228 |         "400":
1229 |          content:
1230 |            application/json:
1231 |              schema:
1232 |                $ref: "#/components/schemas/Error"
1233 |          description: Bad Request (e.g., invalid request body or Mediaplan ID)
1234 |         "404":
1235 |          content:
1236 |            application/json:
1237 |              schema:
1238 |                $ref: "#/components/schemas/Error"
1239 |          description: Mediaplan not found.
1240 |         "422":
1241 |          content:
1242 |            application/json:
1243 |              schema:
1244 |                $ref: "#/components/schemas/Error"
1245 |          description: Unprocessable Entity (validation errors)
1246 |         "500":
1247 |          content:
1248 |            application/json:
1249 |              schema:
1250 |                $ref: "#/components/schemas/Error"
1251 |          description: Internal Server Error
1252 | 
1253 |   /mediaplans/{mediaplanId}/projects/{projectId}:
1254 |     get:
1255 |       summary: Get a Project
1256 |       tags:
1257 |         - Projects
1258 |       parameters:
1259 |         - in: path
1260 |           name: mediaplanId
1261 |           schema:
1262 |             type: string
1263 |             format: uuid
1264 |           required: true
1265 |           description: The ID of the Mediaplan.
1266 |         - in: path
1267 |           name: projectId
1268 |           schema:
1269 |             type: string
1270 |             format: uuid
1271 |           required: true
1272 |           description: The ID of the Project to get.
1273 |       responses:
1274 |         '200':
1275 |           description: Project fetched successfully.
1276 |           content:
1277 |             application/json:
1278 |               schema:
1279 |                 $ref: '#/components/schemas/Project'
1280 |               # --- START EXAMPLE ---
1281 |               example:
1282 |                 _id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Use a valid UUID
1283 |                 abbreviation: "NC-ALWAYS-ON-2024_Individ #1"
1284 |                 created_at: "2024-10-02T09:15:00Z"
1285 |                 default_vars:
1286 |                   targeturls: null
1287 |                   subsegment: "New Car"
1288 |                   campaigntype: "Always On"
1289 |                   language: "DEU"
1290 |                   campaigndetail: null
1291 |                   adtype: "Banner"
1292 |                   dimension: "300x250"
1293 |                 descriptive_vars:
1294 |                   brand: "MINI"
1295 |                   country: "SE"
1296 |                   bmwponumber: "PO12345"
1297 |                   adobecampaignname: "Always On 2024"
1298 |                   subsegment: "New Car"
1299 |                   campaigntype: "Always On"
1300 |                   projectname: "NC-ALWAYS-ON-2024_Individ"
1301 |                   year: 2024
1302 |                 is_locked: false
1303 |                 labels: []
1304 |                 lock_state: 0
1305 |                 owner: "user123"
1306 |                 updated_at: "2024-10-02T09:15:00Z"
1307 |                 uploaded_at: "2024-10-02T09:15:00Z"
1308 |                 duration:
1309 |                   start_date: "2024-01-15T00:00:00Z"
1310 |                   end_date: "2024-04-15T00:00:00Z"
1311 |                   formatted: "15.01-15.04.2024"
1312 |                 detail: "This is the first project, focusing on Sweden."
1313 |               # --- END EXAMPLE ---
1314 |         '400':
1315 |           description: Bad Request
1316 |           # ... (rest unchanged)
1317 |         '404':
1318 |           description: Mediaplan or Project not found.
1319 |           # ... (rest unchanged)
1320 |         '500':
1321 |           description: Internal Server Error
1322 |           # ... (rest unchanged)
1323 | 
1324 |     put:
1325 |       summary: Update a Project (replace entire resource)
1326 |       # ... (rest of definition - unchanged) ...
1327 |       tags:
1328 |        - Projects
1329 |       parameters:
1330 |        - description: The ID of the Mediaplan.
1331 |          in: path
1332 |          name: mediaplanId
1333 |          required: true
1334 |          schema:
1335 |            format: uuid
1336 |            type: string
1337 |        - description: The ID of the Project to update.
1338 |          in: path
1339 |          name: projectId
1340 |          required: true
1341 |          schema:
1342 |            format: uuid
1343 |            type: string
1344 |       requestBody:
1345 |         content:
1346 |           application/json:
1347 |             schema:
1348 |               $ref: "#/components/schemas/Project"
1349 |         required: true
1350 |       responses:
1351 |         "200":
1352 |          content:
1353 |            application/json:
1354 |              schema:
1355 |                $ref: "#/components/schemas/Project"
1356 |          description: Project updated successfully.
1357 |         "204":
1358 |          description: Project updated successfully.
1359 |         "400":
1360 |          content:
1361 |            application/json:
1362 |              schema:
1363 |                $ref: "#/components/schemas/Error"
1364 |          description: Bad Request
1365 |         "404":
1366 |          content:
1367 |            application/json:
1368 |              schema:
1369 |                $ref: "#/components/schemas/Error"
1370 |          description: Mediaplan or Project not found.
1371 |         "422":
1372 |          content:
1373 |            application/json:
1374 |              schema:
1375 |                $ref: "#/components/schemas/Error"
1376 |          description: Unprocessable Entity
1377 |         "500":
1378 |          content:
1379 |            application/json:
1380 |              schema:
1381 |                $ref: "#/components/schemas/Error"
1382 |          description: Internal Server Error
1383 | 
1384 |     delete:
1385 |       summary: Delete a Project
1386 |       # ... (rest of definition - unchanged) ...
1387 |       tags:
1388 |        - Projects
1389 |       parameters:
1390 |        - description: The ID of the Mediaplan.
1391 |          in: path
1392 |          name: mediaplanId
1393 |          required: true
1394 |          schema:
1395 |            format: uuid
1396 |            type: string
1397 |        - description: The ID of the Project to delete.
1398 |          in: path
1399 |          name: projectId
1400 |          required: true
1401 |          schema:
1402 |            format: uuid
1403 |            type: string
1404 |       responses:
1405 |         "204":
1406 |          description: Project deleted successfully.
1407 |         "400":
1408 |          content:
1409 |            application/json:
1410 |              schema:
1411 |                $ref: "#/components/schemas/Error"
1412 |          description: Bad Request
1413 |         "404":
1414 |          content:
1415 |            application/json:
1416 |              schema:
1417 |                $ref: "#/components/schemas/Error"
1418 |          description: Mediaplan or Project not found.
1419 |         "500":
1420 |          content:
1421 |            application/json:
1422 |              schema:
1423 |                $ref: "#/components/schemas/Error"
1424 |          description: Internal Server Error
1425 | 
1426 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns:
1427 |     get:
1428 |       summary: Get all campaigns for a given Project within a Mediaplan
1429 |       tags:
1430 |         - Campaigns
1431 |       parameters:
1432 |         - in: path
1433 |           name: mediaplanId
1434 |           schema:
1435 |             type: string
1436 |             format: uuid
1437 |           required: true
1438 |           description: The ID of the Mediaplan.
1439 |         - in: path
1440 |           name: projectId
1441 |           schema:
1442 |             type: string
1443 |             format: uuid
1444 |           required: true
1445 |           description: The ID of the Project.
1446 |         # --- ADD Pagination parameters ---
1447 |         - in: query
1448 |           name: page
1449 |           schema:
1450 |             type: integer
1451 |             minimum: 0
1452 |             default: 0
1453 |           description: The page number to retrieve (0-based).
1454 |         - in: query
1455 |           name: per_page
1456 |           schema:
1457 |             type: integer
1458 |             minimum: 1
1459 |             maximum: 100
1460 |             default: 15 # Match store default
1461 |           description: The number of items per page.
1462 |         # Optional: Add sort/order parameters if API supports them
1463 |         # - in: query
1464 |         #   name: sort
1465 |         #   schema: { type: string }
1466 |         # - in: query
1467 |         #   name: order
1468 |         #   schema: { type: string, enum: [asc, desc] }
1469 |       responses:
1470 |         '200':
1471 |           description: Successful response - returns a list of campaigns.
1472 |           content:
1473 |             application/json:
1474 |               # --- ASSUME PAGINATED RESPONSE SCHEMA ---
1475 |               schema:
1476 |                 type: object
1477 |                 properties:
1478 |                   total_items:
1479 |                     type: integer
1480 |                   total_pages:
1481 |                     type: integer
1482 |                   current_page:
1483 |                     type: integer
1484 |                   items:
1485 |                     type: array
1486 |                     items:
1487 |                       $ref: '#/components/schemas/Campaign'
1488 |               # --- START EXAMPLE for Campaigns (Paginated) ---
1489 |               example:
1490 |                 total_items: 5 # Example total
1491 |                 total_pages: 1 # Example pages
1492 |                 current_page: 0 # Example current page
1493 |                 items:
1494 |                   - _id: "c1f0a3e2-b1d9-4a1e-8b7d-a3b8d4e16c2f" # UUID
1495 |                     campaignname: "SE_MINI_NC-AO-24_Summer_Display_DEU_Generic"
1496 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID from example above
1497 |                     campaigndetail: "Generic Summer Banner Ads"
1498 |                     campaigntype: "Always On"
1499 |                     created_at: "2024-10-15T10:00:00Z"
1500 |                     language: "DEU"
1501 |                     product: "Generic" # Example Product
1502 |                     subsegment: "New Car"
1503 |                     type: "display"
1504 |                     updated_at: "2024-10-16T11:00:00Z"
1505 |                   - _id: "d4e16c2f-9b8c-4f5a-8d3e-e1c7b6a08d3e" # UUID
1506 |                     campaignname: "SE_MINI_NC-AO-24_Summer_Video_DEU_Brand"
1507 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1508 |                     campaigndetail: "Brand Awareness Video"
1509 |                     campaigntype: "Always On"
1510 |                     created_at: "2024-10-15T11:00:00Z"
1511 |                     language: "DEU"
1512 |                     product: "Brand" # Example Product
1513 |                     subsegment: "New Car"
1514 |                     type: "video"
1515 |                     updated_at: "2024-10-17T09:30:00Z"
1516 |                   - _id: "1d0e2f3a-4b5c-4a1e-8c7d-b9d8c7e17a4f" # UUID
1517 |                     campaignname: "SE_MINI_NC-AO-24_Q3_Search_DEU_Electric"
1518 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1519 |                     campaigndetail: "Search Ads for Electric Models"
1520 |                     campaigntype: "Always On"
1521 |                     created_at: "2024-10-18T14:00:00Z"
1522 |                     language: "DEU"
1523 |                     product: "Electric" # Example Product
1524 |                     subsegment: "New Car"
1525 |                     type: "search"
1526 |                     updated_at: null # Example with null updated_at
1527 |                   - _id: "9f0a1b2c-3d4e-4a1e-8b7c-d3e4f5a08b7c" # UUID
1528 |                     campaignname: "SE_MINI_NC-AO-24_Q3_Social_DEU_Cooper"
1529 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1530 |                     campaigndetail: "Social Media Ads Cooper"
1531 |                     campaigntype: "Always On"
1532 |                     created_at: "2024-10-20T09:15:00Z"
1533 |                     language: "DEU"
1534 |                     product: "Cooper" # Example Product
1535 |                     subsegment: "New Car"
1536 |                     type: "social"
1537 |                     updated_at: "2024-10-20T09:15:00Z"
1538 |                   - _id: "1e0f2d3c-4b5a-4c2a-9a8b-c7b8a9e16d3f" # UUID
1539 |                     campaignname: "SE_MINI_NC-AO-24_Q4_Display_DEU_Countryman"
1540 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1541 |                     campaigndetail: "Q4 Display Countryman"
1542 |                     campaigntype: "Always On"
1543 |                     created_at: "2024-10-25T16:30:00Z"
1544 |                     language: "DEU"
1545 |                     product: "Countryman" # Example Product
1546 |                     subsegment: "New Car"
1547 |                     type: "display"
1548 |                     updated_at: "2024-10-26T10:00:00Z"
1549 |               # --- END EXAMPLE ---
1550 |         '400':
1551 |           description: Bad Request
1552 |           # ... (rest unchanged)
1553 |         '404':
1554 |           description: Mediaplan or Project not found.
1555 |           # ... (rest unchanged)
1556 |         '500':
1557 |           description: Internal Server Error
1558 |           # ... (rest unchanged)
1559 |     post:
1560 |       summary: Create new Campaing
1561 |       # ... (rest of definition - unchanged) ...
1562 |       tags:
1563 |        - Campaigns
1564 |       parameters:
1565 |        - description: The ID of the Mediaplan.
1566 |          in: path
1567 |          name: mediaplanId
1568 |          required: true
1569 |          schema:
1570 |            format: uuid
1571 |            type: string
1572 |        - description: The ID of the Project.
1573 |          in: path
1574 |          name: projectId
1575 |          required: true
1576 |          schema:
1577 |            format: uuid
1578 |            type: string
1579 |       requestBody:
1580 |         content:
1581 |           application/json:
1582 |             example:
1583 |               campaignname: PL_BMW_NC_NC-AO-2025-weq_AMSF_2025_AO_POL_eqfwefw
1584 |               campaigndetail: eqfwefw
1585 |               campaigntype: AO
1586 |               language: POL
1587 |               pid: 6780ed13ea3ea0016ff8975e
1588 |               product: AMSF
1589 |               subsegment: NC
1590 |               type: display
1591 |             schema:
1592 |               $ref: "#/components/schemas/CampaignCreate"
1593 |         required: true
1594 |       responses:
1595 |         "201":
1596 |          content:
1597 |            application/json:
1598 |              schema:
1599 |                $ref: "#/components/schemas/Campaign"
1600 |          description: Campaign created successfully.
1601 |         "400":
1602 |          content:
1603 |            application/json:
1604 |              schema:
1605 |                $ref: "#/components/schemas/Error"
1606 |          description: Bad Request
1607 |         "404":
1608 |          content:
1609 |            application/json:
1610 |              schema:
1611 |                $ref: "#/components/schemas/Error"
1612 |          description: Mediaplan or Project not found.
1613 |         "422":
1614 |          content:
1615 |            application/json:
1616 |              schema:
1617 |                $ref: "#/components/schemas/Error"
1618 |          description: Unprocessable Entity
1619 |         "500":
1620 |          content:
1621 |            application/json:
1622 |              schema:
1623 |                $ref: "#/components/schemas/Error"
1624 |          description: Internal Server Error
1625 | 
1626 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns/{campaignId}:
1627 |     get:
1628 |       summary: Get a single Campaign by ID
1629 |       # ... (rest of definition - unchanged) ...
1630 |       tags:
1631 |        - Campaigns
1632 |       parameters:
1633 |        - description: The ID of the Mediaplan.
1634 |          in: path
1635 |          name: mediaplanId
1636 |          required: true
1637 |          schema:
1638 |            format: uuid
1639 |            type: string
1640 |        - description: The ID of the Project.
1641 |          in: path
1642 |          name: projectId
1643 |          required: true
1644 |          schema:
1645 |            format: uuid
1646 |            type: string
1647 |        - description: The ID of the Campaign.
1648 |          in: path
1649 |          name: campaignId
1650 |          required: true
1651 |          schema:
1652 |            format: uuid
1653 |            type: string
1654 |       responses:
1655 |         "200":
1656 |          content:
1657 |            application/json:
1658 |              schema:
1659 |                $ref: "#/components/schemas/Campaign"
1660 |          description: Successful response - returns the Campaign.
1661 |         "400":
1662 |          content:
1663 |            application/json:
1664 |              schema:
1665 |                $ref: "#/components/schemas/Error"
1666 |          description: Bad Request (e.g., invalid ID format)
1667 |         "404":
1668 |          content:
1669 |            application/json:
1670 |              schema:
1671 |                $ref: "#/components/schemas/Error"
1672 |          description: Mediaplan, Project, or Campaign not found.
1673 |         "500":
1674 |          content:
1675 |            application/json:
1676 |              schema:
1677 |                $ref: "#/components/schemas/Error"
1678 |          description: Internal Server Error
1679 | 
1680 |     put:
1681 |       summary: Update a Campaign (replace entire resource)
1682 |       # ... (rest of definition - unchanged) ...
1683 |       tags:
1684 |        - Campaigns
1685 |       parameters:
1686 |        - description: The ID of the Mediaplan.
1687 |          in: path
1688 |          name: mediaplanId
1689 |          required: true
1690 |          schema:
1691 |            format: uuid
1692 |            type: string
1693 |        - description: The ID of the Project.
1694 |          in: path
1695 |          name: projectId
1696 |          required: true
1697 |          schema:
1698 |            format: uuid
1699 |            type: string
1700 |        - description: The ID of the Campaign to update.
1701 |          in: path
1702 |          name: campaignId
1703 |          required: true
1704 |          schema:
1705 |            format: uuid
1706 |            type: string
1707 |       requestBody:
1708 |         content:
1709 |           application/json:
1710 |             schema:
1711 |               $ref: "#/components/schemas/Campaign"
1712 |         required: true
1713 |       responses:
1714 |         "200":
1715 |          content:
1716 |            application/json:
1717 |              schema:
1718 |                $ref: "#/components/schemas/Campaign"
1719 |          description: Campaign updated successfully.
1720 |         "204":
1721 |          description: Campaign updated successfully.
1722 |         "400":
1723 |          content:
1724 |            application/json:
1725 |              schema:
1726 |                $ref: "#/components/schemas/Error"
1727 |          description: Bad Request
1728 |         "404":
1729 |          content:
1730 |            application/json:
1731 |              schema:
1732 |                $ref: "#/components/schemas/Error"
1733 |          description: Mediaplan, Project, or Campaign not found
1734 |         "422":
1735 |          content:
1736 |            application/json:
1737 |              schema:
1738 |                $ref: "#/components/schemas/Error"
1739 |          description: Unprocessable Entity
1740 |         "500":
1741 |          content:
1742 |            application/json:
1743 |              schema:
1744 |                $ref: "#/components/schemas/Error"
1745 |          description: Internal Server Error
1746 | 
1747 |     delete:
1748 |       summary: Delete a Campaign
1749 |       # ... (rest of definition - unchanged) ...
1750 |       tags:
1751 |        - Campaigns
1752 |       parameters:
1753 |        - description: The ID of the Mediaplan.
1754 |          in: path
1755 |          name: mediaplanId
1756 |          required: true
1757 |          schema:
1758 |            format: uuid
1759 |            type: string
1760 |        - description: The ID of the Project.
1761 |          in: path
1762 |          name: projectId
1763 |          required: true
1764 |          schema:
1765 |            format: uuid
1766 |            type: string
1767 |        - description: The ID of the Campaign to delete.
1768 |          in: path
1769 |          name: campaignId
1770 |          required: true
1771 |          schema:
1772 |            format: uuid
1773 |            type: string
1774 |       responses:
1775 |         "204":
1776 |          description: Campaign deleted successfully.
1777 |         "400":
1778 |          content:
1779 |            application/json:
1780 |              schema:
1781 |                $ref: "#/components/schemas/Error"
1782 |          description: Bad Request
1783 |         "404":
1784 |          content:
1785 |            application/json:
1786 |              schema:
1787 |                $ref: "#/components/schemas/Error"
1788 |          description: Mediaplan, Project, or Campaign not found
1789 |         "500":
1790 |          content:
1791 |            application/json:
1792 |              schema:
1793 |                $ref: "#/components/schemas/Error"
1794 |          description: Internal Server Error
1795 | 
1796 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns/{campaignId}/lineitems:
1797 |     get:
1798 |       summary: Get all line items for a given Campaign
1799 |       # ... (rest of definition - unchanged) ...
1800 |       tags:
1801 |        - LineItems
1802 |       parameters:
1803 |        - description: The ID of the Mediaplan.
1804 |          in: path
1805 |          name: mediaplanId
1806 |          required: true
1807 |          schema:
1808 |            format: uuid
1809 |            type: string
1810 |        - description: The ID of the Project.
1811 |          in: path
1812 |          name: projectId
1813 |          required: true
1814 |          schema:
1815 |            format: uuid
1816 |            type: string
1817 |        - description: The ID of the Campaign.
1818 |          in: path
1819 |          name: campaignId
1820 |          required: true
1821 |          schema:
1822 |            format: uuid
1823 |            type: string
1824 |       responses:
1825 |         "200":
1826 |          content:
1827 |            application/json:
1828 |              schema:
1829 |                items:
1830 |                  $ref: "#/components/schemas/LineItem"
1831 |                type: array
1832 |          description: Successful response - returns a list of line items.
1833 |         "400":
1834 |          content:
1835 |            application/json:
1836 |              schema:
1837 |                $ref: "#/components/schemas/Error"
1838 |          description: Bad Request
1839 |         "404":
1840 |          content:
1841 |            application/json:
1842 |              schema:
1843 |                $ref: "#/components/schemas/Error"
1844 |          description: Mediaplan, Project, or Campaign not found.
1845 |         "500":
1846 |          content:
1847 |            application/json:
1848 |              schema:
1849 |                $ref: "#/components/schemas/Error"
1850 |          description: Internal Server Error
1851 | 
1852 | components:
1853 |   schemas:
1854 |     # ... (Error, ChangelogEntry, EntityReference, MediaplanFilter, MediaplanCreate, PONumber, Mediaplan - unchanged) ...
1855 |     Error:
1856 |       properties:
1857 |         _id:
1858 |           description: Unique identifier for this error instance.
1859 |           example: 1@mediaplan-app-2025-6d57887bb4-8t9z7
1860 |           type: string
1861 |         code:
1862 |           description: HTTP status code.
1863 |           example: 400
1864 |           type: integer
1865 |         error:
1866 |           description: Specific error details.
1867 |           example: Somethin went wrong.
1868 |           type: string
1869 |         message:
1870 |           description: A general message describing the error category.
1871 |           example: Bad Request
1872 |           type: string
1873 |         timestamp:
1874 |           description: Timestamp of when the error occurred.
1875 |           example: "2025-03-11T13:31:06.443086Z"
1876 |           format: date-time
1877 |           type: string
1878 |         version:
1879 |           description: Application version where the error occurred.
1880 |           example: mediaplan/0.1.45
1881 |           type: string
1882 |       type: object
1883 |     ChangelogEntry:
1884 |       properties:
1885 |         date:
1886 |           description: Date and time of the changelog entry.
1887 |           example: "2024-10-27T14:30:00Z"
1888 |           format: date-time
1889 |           type: string
1890 |         text:
1891 |           description: Description of the change.
1892 |           example: Added new feature for campaign optimization.
1893 |           type: string
1894 |         tool:
1895 |           description: The tool associated with this changelog entry.
1896 |           enum:
1897 |             - CampaignBuilder
1898 |             - Linkshortener
1899 |             - Mediaplan
1900 |           example: CampaignBuilder
1901 |           type: string
1902 |       required:
1903 |         - date
1904 |         - tool
1905 |         - text
1906 |       type: object
1907 |     EntityReference:
1908 |       properties:
1909 |         _id:
1910 |           description: Unique identifier.
1911 |           example: user-002
1912 |           format: uuid
1913 |           type: string
1914 |         name:
1915 |           description: Name of the entity.
1916 |           example: Alice Smith
1917 |           type: string
1918 |       required:
1919 |         - _id
1920 |         - name
1921 |       type: object
1922 |     MediaplanFilter:
1923 |       properties:
1924 |         brand_id:
1925 |           description: Filter by Brand ID.
1926 |           format: uuid
1927 |           type: string
1928 |         search:
1929 |           description: Search term for filtering by name or other relevant fields.
1930 |           type: string
1931 |         start_date_after:
1932 |           description: Filter for mediaplans starting after this date.
1933 |           format: date-time
1934 |           type: string
1935 |         start_date_before:
1936 |           description: Filter for mediaplans starting before this date.
1937 |           format: date-time
1938 |           type: string
1939 |         status:
1940 |           description: Filter by status.
1941 |           enum:
1942 |             - In Planning
1943 |             - Draft
1944 |             - For Approval
1945 |           type: string
1946 |       type: object
1947 |     MediaplanCreate:
1948 |       properties:
1949 |         brand:
1950 |           properties:
1951 |             _id:
1952 |               description: ID of the associated brand.
1953 |               format: uuid
1954 |               type: string
1955 |           required:
1956 |             - _id
1957 |           type: object
1958 |         budget:
1959 |           properties:
1960 |             total:
1961 |               description: Total budget allocated.
1962 |               format: double
1963 |               type: number
1964 |           type: object
1965 |         end_date:
1966 |           description: End date of the Mediaplan.
1967 |           example: "2024-08-31T18:00:00Z"
1968 |           format: date-time
1969 |           type: string
1970 |         name:
1971 |           description: Name of the Mediaplan.
1972 |           example: Summer Campaign 2024
1973 |           type: string
1974 |         po_numbers:
1975 |           items:
1976 |             $ref: "#/components/schemas/PONumber"
1977 |           type: array
1978 |         start_date:
1979 |           description: Start date of the Mediaplan.
1980 |           example: "2024-07-15T10:00:00Z"
1981 |           format: date-time
1982 |           type: string
1983 |         status:
1984 |           description: Status of the Mediaplan.
1985 |           enum:
1986 |             - In Planning
1987 |             - Draft
1988 |             - For Approval
1989 |           example: Draft
1990 |           type: string
1991 |       required:
1992 |         - name
1993 |         - status
1994 |         - start_date
1995 |         - end_date
1996 |         - brand
1997 |         - budget
1998 |       type: object
1999 |     PONumber:
2000 |       properties:
2001 |         _id:
2002 |           description: Unique identifier of the PO Number.
2003 |           example: po-001
2004 |           type: string
2005 |         name:
2006 |           description: Name or description of the PO Number.
2007 |           example: "4700551823"
2008 |           type: string
2009 |         value:
2010 |           description: The numerical value of the PO Number.
2011 |           example: 450.0
2012 |           format: float
2013 |           type: number
2014 |       required:
2015 |         - _id
2016 |         - name
2017 |         - value
2018 |       type: object
2019 |     Mediaplan:
2020 |       properties:
2021 |         _id:
2022 |           description: Unique identifier of the Mediaplan.
2023 |           example: f47ac10b-58cc-4372-a567-0e02b2c3d399
2024 |           format: uuid
2025 |           type: string
2026 |         brand:
2027 |           $ref: "#/components/schemas/EntityReference"
2028 |           description: Reference to the Brand information.
2029 |         budget:
2030 |           description: Budget details for the Mediaplan.
2031 |           properties:
2032 |             available:
2033 |               description: Budget remaining.
2034 |               example: 374.5
2035 |               format: double
2036 |               type: number
2037 |             total:
2038 |               description: Total budget allocated.
2039 |               example: 1250.0
2040 |               format: double
2041 |               type: number
2042 |             used:
2043 |               description: Amount of budget used.
2044 |               example: 875.5
2045 |               format: double
2046 |               type: number
2047 |           required:
2048 |             - total
2049 |             - used
2050 |             - available
2051 |           type: object
2052 |         created_at:
2053 |           description: Timestamp of creation.
2054 |           example: "2024-11-28T14:15:00Z"
2055 |           format: date-time
2056 |           type: string
2057 |         created_by:
2058 |           $ref: "#/components/schemas/EntityReference"
2059 |           description: Reference to the user who created the Mediaplan.
2060 |         end_date:
2061 |           description: End date of the Mediaplan.
2062 |           example: "2025-03-25T00:00:00Z"
2063 |           format: date-time
2064 |           type: string
2065 |         name:
2066 |           description: Name of the Mediaplan.
2067 |           example: Campaign Launch Q1
2068 |           type: string
2069 |         po_numbers:
2070 |           description: List of associated Purchase Order numbers.
2071 |           example:
2072 |             - _id: po-001
2073 |               name: "4700551823"
2074 |               value: 450.0
2075 |             - _id: po-002
2076 |               name: "4700551911"
2077 |               value: 425.5
2078 |           items:
2079 |             $ref: "#/components/schemas/PONumber"
2080 |           type: array
2081 |         start_date:
2082 |           description: Start date of the Mediaplan.
2083 |           example: "2025-02-10T00:00:00Z"
2084 |           format: date-time
2085 |           type: string
2086 |         status:
2087 |           description: Status of the Mediaplan.
2088 |           enum:
2089 |             - In Planning
2090 |             - Draft
2091 |             - For Approval
2092 |           example: In Planning
2093 |           type: string
2094 |         updated_at:
2095 |           description: Timestamp of last update.
2096 |           example: "2024-12-05T09:30:00Z"
2097 |           format: date-time
2098 |           type: string
2099 |       required:
2100 |         - _id
2101 |         - name
2102 |         - status
2103 |         - start_date
2104 |         - end_date
2105 |         - brand
2106 |         - budget
2107 |         - created_by
2108 |         - created_at
2109 |         - updated_at
2110 |       type: object
2111 | 
2112 |     Project:
2113 |       type: object
2114 |       properties:
2115 |         _id:
2116 |           type: string
2117 |           format: uuid
2118 |           description: Unique identifier of the Project.
2119 |         abbreviation:
2120 |           type: string
2121 |           description: Abbreviation for the project.
2122 |         created_at:
2123 |           type: string
2124 |           format: date-time
2125 |           description: Project creation timestamp.
2126 |         default_vars:
2127 |           type: object
2128 |           description: Default variables for the project.
2129 |           properties:
2130 |             targeturls:
2131 |               type: string
2132 |               nullable: true
2133 |               description: Target URLs (can be null).
2134 |             subsegment:
2135 |               type: string
2136 |               nullable: true
2137 |               description: Subsegment (can be null).
2138 |             campaigntype:
2139 |               type: string
2140 |               nullable: true
2141 |               description: Campaign type (can be null).
2142 |             language:
2143 |               type: string
2144 |               nullable: true
2145 |               description: Language (can be null).
2146 |             campaigndetail:
2147 |               type: string
2148 |               nullable: true
2149 |               description: Campaign detail (can be null).
2150 |             adtype:
2151 |               type: string
2152 |               nullable: true
2153 |               description: Ad type (can be null).
2154 |             dimension:
2155 |               type: string
2156 |               nullable: true
2157 |               description: Dimension (can be null).
2158 |         descriptive_vars:
2159 |           type: object
2160 |           description: Descriptive variables for the project.
2161 |           properties:
2162 |             brand:
2163 |               type: string
2164 |               description: Brand name.
2165 |             country:
2166 |               type: string
2167 |               description: Country code.
2168 |             bmwponumber:
2169 |               type: string
2170 |               description: BMW purchase order number.
2171 |             adobecampaignname:
2172 |               type: string
2173 |               description: Adobe campaign name.
2174 |             subsegment:
2175 |               type: string
2176 |               description: Subsegment.
2177 |             campaigntype:
2178 |               type: string
2179 |               description: Campaign type.
2180 |             projectname:
2181 |               type: string
2182 |               description: Project name.
2183 |             year:
2184 |               type: integer
2185 |               description: Year.
2186 |         is_locked:
2187 |           type: boolean
2188 |           description: Indicates if the project is locked.
2189 |         labels:
2190 |           type: array
2191 |           items:
2192 |             type: string
2193 |           description: Labels associated with project
2194 |         lock_state:
2195 |           type: integer
2196 |           description: Lock state of the project.
2197 |         owner:
2198 |           type: string
2199 |           description: Owner of the project.
2200 |         updated_at:
2201 |           type: string
2202 |           format: date-time
2203 |           nullable: true
2204 |           description: Project last update timestamp.
2205 |         uploaded_at:
2206 |           type: string
2207 |           format: date-time
2208 |           description: Project upload timestamp.
2209 |         # Optional fields based on mock data (add here if part of schema)
2210 |         duration:
2211 |            type: object
2212 |            properties:
2213 |              start_date:
2214 |                type: string
2215 |                format: date-time
2216 |              end_date:
2217 |                type: string
2218 |                format: date-time
2219 |              formatted:
2220 |                type: string
2221 |         detail:
2222 |            type: string
2223 |            nullable: true
2224 |       required:
2225 |         - _id
2226 |         - abbreviation
2227 |         - created_at
2228 |         - default_vars
2229 |         - descriptive_vars
2230 |         - is_locked
2231 |         - lock_state
2232 |         # Removed message, version, timestamp from required
2233 |         - owner
2234 |         - uploaded_at
2235 |         # updated_at is nullable
2236 | 
2237 |     ProjectCreate:
2238 |       # ... (unchanged) ...
2239 |       properties:
2240 |         default_vars:
2241 |           description: Default variables for the project.
2242 |           properties:
2243 |             adtype:
2244 |               description: Ad type (can be null).
2245 |               nullable: true
2246 |               type: string
2247 |             campaigndetail:
2248 |               description: Campaign detail (can be null).
2249 |               nullable: true
2250 |               type: string
2251 |             campaigntype:
2252 |               description: Campaign type (can be null).
2253 |               nullable: true
2254 |               type: string
2255 |             dimension:
2256 |               description: Dimension (can be null).
2257 |               nullable: true
2258 |               type: string
2259 |             language:
2260 |               description: Language (can be null).
2261 |               nullable: true
2262 |               type: string
2263 |             subsegment:
2264 |               description: Subsegment (can be null).
2265 |               nullable: true
2266 |               type: string
2267 |             targeturls:
2268 |               description: Target URLs (can be null).
2269 |               nullable: true
2270 |               type: string
2271 |           type: object
2272 |         descriptive_vars:
2273 |           description: Descriptive variables for the project.
2274 |           properties:
2275 |             adobecampaignname:
2276 |               description: Adobe campaign name.
2277 |               type: string
2278 |             bmwponumber:
2279 |               description: BMW purchase order number.
2280 |               type: string
2281 |             brand:
2282 |               description: Brand name.
2283 |               type: string
2284 |             campaigntype:
2285 |               description: Campaign type.
2286 |               type: string
2287 |             country:
2288 |               description: Country code.
2289 |               type: string
2290 |             subsegment:
2291 |               description: Subsegment.
2292 |               type: string
2293 |           type: object
2294 |         labels:
2295 |           description: Labels associated with project
2296 |           items:
2297 |             type: string
2298 |           type: array
2299 |       type: object
2300 | 
2301 |     CampaignCreate:
2302 |       # ... (unchanged) ...
2303 |       properties:
2304 |         campaignname:
2305 |           description: Name of the campaign.
2306 |           type: string
2307 |         campaigndetail:
2308 |           description: Details about the campaign.
2309 |           nullable: true
2310 |           type: string
2311 |         campaigntype:
2312 |           description: Type of the campaign.
2313 |           type: string
2314 |         language:
2315 |           description: Language of the campaign.
2316 |           type: string
2317 |         pid:
2318 |           description: ID of the parent Project.  IMPORTANT!
2319 |           format: uuid
2320 |           type: string
2321 |         product:
2322 |           description: Product associated with the campaign.
2323 |           type: string
2324 |         subsegment:
2325 |           description: Subsegment of the campaign.
2326 |           type: string
2327 |         type:
2328 |           description: Campaign type (e.g., display, video).
2329 |           type: string
2330 |       required:
2331 |         - campaignname
2332 |         - pid
2333 |         - campaigntype
2334 |       type: object
2335 | 
2336 |     Campaign:
2337 |       type: object
2338 |       properties:
2339 |         _id:
2340 |           type: string
2341 |           format: uuid
2342 |           description: Unique identifier of the Campaign.
2343 |         campaignname:
2344 |           type: string
2345 |           description: Name of the campaign.
2346 |         pid:
2347 |           type: string
2348 |           format: uuid
2349 |           description: ID of the parent Project.
2350 |         campaigndetail:
2351 |           type: string
2352 |           nullable: true
2353 |           description: Details about the campaign.
2354 |         campaigntype:
2355 |           type: string
2356 |           description: Type of the campaign.
2357 |         created_at:
2358 |           type: string
2359 |           format: date-time
2360 |           description: Campaign creation timestamp.
2361 |         language:
2362 |           type: string
2363 |           description: Language of the campaign.
2364 |         product:
2365 |           type: string
2366 |           description: Product associated with the campaign.
2367 |         subsegment:
2368 |           type: string
2369 |           description: Subsegment of the campaign.
2370 |         type:
2371 |           type: string
2372 |           description: Campaign type (e.g., display, video).
2373 |         updated_at:
2374 |           type: string
2375 |           format: date-time
2376 |           nullable: true
2377 |           description: Campaign last update timestamp.
2378 |       required:
2379 |         - _id
2380 |         - campaignname
2381 |         - pid
2382 |         - campaigntype
2383 |         - created_at
2384 |         - language
2385 |         - product
2386 |         - subsegment
2387 |         - type
2388 | 
2389 |     LineItem:
2390 |       # ... (unchanged) ...
2391 |       properties:
2392 |         _id:
2393 |           description: Unique identifier of the Line Item.
2394 |           format: uuid
2395 |           type: string
2396 |         created_at:
2397 |           description: Line item creation timestamp.
2398 |           format: date-time
2399 |           type: string
2400 |         creatives:
2401 |           description: Array of creative IDs.
2402 |           items:
2403 |             type: string
2404 |           type: array
2405 |         goals:
2406 |           description: Goal of the line item.
2407 |           type: string
2408 |         lineitem:
2409 |           description: (Clarify purpose)
2410 |           type: string
2411 |         lineitemname:
2412 |           description: Name of the line item.
2413 |           type: string
2414 |         mid:
2415 |           description: (Clarify purpose)
2416 |           type: string
2417 |         phase:
2418 |           description: Phase of the line item.
2419 |           type: string
2420 |         pid:
2421 |           description: ID of the parent Project.
2422 |           format: uuid
2423 |           type: string
2424 |         product:
2425 |           description: Product associated with the line item.
2426 |           type: string
2427 |         targetingtactic:
2428 |           description: Targeting tactic.
2429 |           type: string
2430 |         updated_at:
2431 |           description: Line item last update timestamp.
2432 |           format: date-time
2433 |           type: string
2434 |       required:
2435 |         - _id
2436 |         - pid
2437 |         - lineitemname
2438 |         - created_at
2439 |         - goals
2440 |         - phase
2441 |         - product
2442 |         - targetingtactic
2443 |       type: object
```

src/plugins/vuetify.ts
```
1 | import {createVuetify} from 'vuetify'
2 | import 'vuetify/styles'
3 | import * as components from 'vuetify/components'
4 | import * as directives from 'vuetify/directives'
5 | import {aliases, mdi} from 'vuetify/iconsets/mdi'
6 | import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
7 | 
8 | const myCustomLightTheme = {
9 |     dark: false,
10 |     colors: {
11 |         background: '#FFFFFF', // Keep these if you have specific background/surface needs
12 |         surface: '#FFFFFF',
13 |         primary: '#1C69D4', // Your blue
14 |         'primary-darken-1': '#134b9a', // Good practice: darken variant for hover states etc.
15 |         secondary: '#262626', // Your black (for the "Declined" button)
16 |         'secondary-darken-1': '#1a1a1a', // Darker black
17 |         error: '#B00020', // Keep these standard Vuetify colors, or customize
18 |         info: '#2196F3',
19 |         success: '#4CAF50',
20 |         warning: '#FB8C00',
21 |     }
22 | }
23 | 
24 | export default createVuetify({
25 |     defaults: {
26 |         VBtn: {
27 |             rounded: 'xs',
28 |         },
29 |         VTextField: {
30 |             clearable: true,
31 |         },
32 |         VCard: {}
33 |         // Add defaults for other components as needed
34 |     },
35 |     theme: {
36 |         options: {customProperties: true},
37 |         defaultTheme: 'myCustomLightTheme',
38 |         themes: {
39 |             myCustomLightTheme,
40 |         },
41 |     },
42 |     ssr: false,
43 |     components,
44 |     directives,
45 |     icons: {
46 |         defaultSet: 'mdi',
47 |         aliases,
48 |         sets: {
49 |             mdi,
50 |         },
51 |     }
52 | })
```

src/router/index.ts
```
1 | import {createRouter, createWebHashHistory} from 'vue-router'
2 | import type {RouteRecordRaw} from 'vue-router' // Explicit import
3 | import {useAuthStore} from '../stores/auth'
4 | 
5 | const routes: Array<RouteRecordRaw> = [
6 |     {
7 |         path: '/',
8 |         name: 'Overview',
9 |         component: () => import('../views/Overview.vue'),
10 |     },
11 |     {
12 |         path: '/login',
13 |         name: 'Login',
14 |         component: () => import('../views/Login.vue'),
15 |     },
16 |     {
17 |         path: '/mediaplans/:id',
18 |         name: 'MediaplanDetail',
19 |         component: () => import('../views/MediaplanDetail.vue'),
20 |         props: true,
21 |     },
22 |     // *** NEUE ROUTE für Project Detail ***
23 |     {
24 |         path: '/mediaplans/:mediaplanId/projects/:projectId',
25 |         name: 'ProjectDetail',
26 |         component: () => import('../views/ProjectDetail.vue'), // Pfad zur neuen Komponente prüfen
27 |         props: true, // Übergibt mediaplanId und projectId als Props
28 |         meta: { requiresAuth: true } // Annahme: Detail erfordert Login
29 |     },
30 |     // Additional routes here
31 | ]
32 | 
33 | const router = createRouter({
34 |     history: createWebHashHistory(import.meta.env.BASE_URL),
35 |     routes,
36 | })
37 | router.beforeEach((to, from, next) => {
38 | /*    const authStore = useAuthStore()
39 |     console.log('Navigation Guard:', to.name, authStore.isAuthenticated)
40 |     if (to.name !== 'Login' && !authStore.isAuthenticated) {
41 |         next({name: 'Login'})
42 |     } else {
43 |         next()
44 |     }*/
45 |     next()
46 | })
47 | export default router
```

src/stores/auth.ts
```
1 | import { defineStore } from 'pinia';
2 | import { customFetchCore4 } from '../helpers/customFetch'; // Importiere customFetchCore4
3 | import router from '../router';
4 | 
5 | const setLocalStorage = (key: string, value: any) => { // Use string for key
6 |     localStorage.setItem(key, JSON.stringify(value)); // Always stringify for localStorage
7 | };
8 | 
9 | const getLocalStorage = (key: string): any | null => { // Use string for key, and handle null
10 |     const value = localStorage.getItem(key);
11 |     return value ? JSON.parse(value) : null;
12 | };
13 | 
14 | 
15 | interface AuthState {
16 |     user: any | null;
17 |     isAuthenticated: boolean;
18 |     isLoading: boolean;
19 |     error: string | null; // Add an error state
20 | }
21 | 
22 | export const useAuthStore = defineStore('auth', {
23 |     state: (): AuthState => ({
24 |         user: getLocalStorage('user'), // Initialize from localStorage
25 |         isAuthenticated: !!getLocalStorage('user'), // Check if user exists in localStorage
26 |         isLoading: false,
27 |         error: null,
28 |     }),
29 |     actions: {
30 |         async fetchProfile() {
31 |             this.isLoading = true;
32 |             this.error = null; // Reset error on each attempt
33 |             try {
34 |                 const userLS = getLocalStorage('user'); // Use getLocalStorage
35 |                 if (userLS && userLS.token) { // IMPORTANT: Check for token
36 |                     const profile = await customFetchCore4('profile'); // Verwende customFetchCore4 für den API-Aufruf
37 |                     // Combine user data from localStorage with profile data
38 |                     this.user = { ...userLS, ...profile.data };  // Merge LS data and API data.
39 |                     this.isAuthenticated = true;
40 |                 } else {
41 |                     // No user in localStorage, or no token.  Treat as unauthenticated.
42 |                     this.isAuthenticated = false;
43 |                     this.user = null;
44 |                     localStorage.removeItem('user'); // Clear any partial data.
45 |                 }
46 |             } catch (error) {
47 |                 this.isAuthenticated = false;
48 |                 this.user = null;
49 |                 localStorage.removeItem('user');
50 |                 this.error = "Profile fetch failed"; // Set error message, don't log to console here
51 |                 console.error('Profile fetch failed:', error); //  Log the full error for debugging.
52 |             } finally {
53 |                 this.isLoading = false;
54 |             }
55 |         },
56 |         async login(username: string, password: string) {
57 |             this.isLoading = true;
58 |             this.error = null;
59 |             try {
60 |                 const login = await customFetchCore4('login', {  // Corrected endpoint (added /)
61 |                     method: 'POST',
62 |                     body: JSON.stringify({
63 |                         username,
64 |                         password,
65 |                     }),
66 |                 });
67 | 
68 |                 if (login.data.token) {
69 |                     const userToken = { token: login.data.token };
70 |                     setLocalStorage('user', userToken); // Store *only* the token initially
71 | 
72 |                     const profile = await customFetchCore4('profile');
73 |                     const user = { ...userToken, ...profile.data }; // Combine token and profile
74 |                     setLocalStorage('user', user);  // Store the *complete* user object.
75 | 
76 |                     this.user = user;  // Update store state
77 |                     this.isAuthenticated = true;
78 |                 } else {
79 |                     // Handle login failure (no token)
80 |                     this.isAuthenticated = false;
81 |                     this.user = null;
82 |                     this.error = "Login failed: No token received."; //  Informative error
83 |                 }
84 | 
85 |             } catch (error: any) { //  Type the error
86 |                 // Handle network or API errors during login
87 |                 this.isAuthenticated = false;
88 |                 this.user = null;
89 |                 this.error = `Login failed: ${error.message || 'Unknown error'}`; // More detailed error
90 |                 console.error("Login Error:", error); //  Log the full error
91 |             } finally {
92 |                 this.isLoading = false;
93 |             }
94 |         },
95 |         async logout() {
96 |             this.isLoading = true; // Set loading state
97 |             this.error = null;
98 |             try {
99 |                 await customFetchCore4('logout', { // Corrected endpoint (added /)
100 |                     method: 'GET',
101 |                 });
102 |             } catch (error) {
103 |                 this.error = "Logout failed"; // Set an error if logout fails
104 |                 console.error("Logout Error:", error); //  Log for debugging
105 |             } finally {
106 |                 localStorage.removeItem('user');
107 |                 this.user = null;
108 |                 this.isAuthenticated = false;
109 |                 this.isLoading = false; // Reset loading
110 |                 router.push('/login');
111 |             }
112 |         },
113 |     },
114 | });
```

src/stores/campaignStore.ts
```
1 | // src/stores/campaignStore.ts (NEUE DATEI)
2 | import {defineStore} from 'pinia';
3 | import {ref, computed} from 'vue';
4 | import customFetch from '@/helpers/customFetch'; // Pfad prüfen
5 | import type {Campaign, CampaignListResponse, CampaignCreate} from '@/types/campaign'; // Pfade/Typen prüfen
6 | 
7 | export const useCampaignStore = defineStore('campaign', () => {
8 |     // State
9 |     const campaigns = ref<Campaign[]>([]);
10 |     const selectedCampaign = ref<Campaign | null>(null);
11 |     const isLoading = ref(false);
12 |     const error = ref<string | null>(null);
13 | 
14 |     // Pagination state
15 |     const totalItems = ref(0);
16 |     const totalPages = ref(0);
17 |     const currentPage = ref(0); // 0-basiert
18 |     const perPage = ref(15);    // Standard Items pro Seite
19 | 
20 |     // Store context IDs for pagination/reload actions
21 |     const currentContextMediaplanId = ref<string | null>(null);
22 |     const currentContextProjectId = ref<string | null>(null);
23 | 
24 |     // Optional: Sorting state
25 |     // const sortBy = ref('created_at');
26 |     // const sortOrder = ref<'asc' | 'desc'>('desc');
27 | 
28 |     // --- Actions ---
29 | 
30 |     /**
31 |      * Lädt eine Liste von Kampagnen für ein bestimmtes Projekt innerhalb eines Mediaplans.
32 |      * Geht von einer paginierten API-Antwort aus.
33 |      */
34 |     async function fetchCampaigns(mediaplanId: string, projectId: string) {
35 |         if (!mediaplanId || !projectId) {
36 |             error.value = "Mediaplan ID or Project ID is missing for fetching campaigns.";
37 |             console.error(error.value);
38 |             campaigns.value = [];
39 |             totalItems.value = 0;
40 |             totalPages.value = 0;
41 |             currentPage.value = 0; // Reset
42 |             return;
43 |         }
44 |         // Store context for pagination actions
45 |         currentContextMediaplanId.value = mediaplanId;
46 |         currentContextProjectId.value = projectId;
47 | 
48 |         isLoading.value = true;
49 |         error.value = null;
50 |         try {
51 |             const queryParams = new URLSearchParams();
52 |             queryParams.append('page', currentPage.value.toString());
53 |             queryParams.append('per_page', perPage.value.toString());
54 |             // Optional: Add sorting params
55 |             // queryParams.append('sort', sortBy.value);
56 |             // queryParams.append('order', sortOrder.value);
57 | 
58 |             const url = `/mediaplans/${mediaplanId}/projects/${projectId}/campaigns?${queryParams.toString()}`;
59 | 
60 |             // Annahme: API liefert paginierte Antwort
61 |             const response = await customFetch(url) as CampaignListResponse;
62 | 
63 |             if (response && response.items) {
64 |                 campaigns.value = response.items;
65 |                 totalItems.value = response.total_items;
66 |                 totalPages.value = response.total_pages;
67 |                 // Stelle sicher, dass current_page vom Backend mit dem lokalen State übereinstimmt
68 |                 // Es ist sicherer, den Wert vom Backend zu übernehmen.
69 |                 currentPage.value = response.current_page;
70 |             } else {
71 |                 // Fallback, falls die API doch nur ein Array liefert (oder unerwartete Antwort)
72 |                 console.warn("Received unexpected response format for campaigns, expected paginated object.", response);
73 |                 if (Array.isArray(response)) {
74 |                     campaigns.value = response as Campaign[];
75 |                     totalItems.value = campaigns.value.length;
76 |                     totalPages.value = 1;
77 |                     currentPage.value = 0;
78 |                 } else {
79 |                     campaigns.value = [];
80 |                     totalItems.value = 0;
81 |                     totalPages.value = 0;
82 |                     currentPage.value = 0;
83 |                 }
84 |             }
85 | 
86 |         } catch (err) {
87 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching campaigns';
88 |             console.error('Error fetching campaigns:', err);
89 |             campaigns.value = [];
90 |             totalItems.value = 0;
91 |             totalPages.value = 0; // Reset state on error
92 |         } finally {
93 |             isLoading.value = false;
94 |         }
95 |     }
96 | 
97 |     /**
98 |      * Lädt die Details einer einzelnen Kampagne.
99 |      */
100 |     async function fetchCampaign(mediaplanId: string, projectId: string, campaignId: string) {
101 |         if (!mediaplanId || !projectId || !campaignId) {
102 |             error.value = "Missing IDs to fetch campaign details.";
103 |             console.error(error.value);
104 |             selectedCampaign.value = null;
105 |             return;
106 |         }
107 |         isLoading.value = true; // Generisches Loading oder separates?
108 |         error.value = null;
109 |         selectedCampaign.value = null; // Reset
110 |         try {
111 |             const url = `/mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}`;
112 |             selectedCampaign.value = await customFetch(url) as Campaign;
113 |         } catch (err) {
114 |             error.value = err instanceof Error ? err.message : 'Failed to load campaign details';
115 |             console.error(`Error fetching campaign ${campaignId}:`, err);
116 |             selectedCampaign.value = null;
117 |         } finally {
118 |             isLoading.value = false;
119 |         }
120 |     }
121 | 
122 |     /**
123 |      * Setzt die aktuelle Seite und lädt die Kampagnen neu.
124 |      * Verwendet die gespeicherten Kontext-IDs.
125 |      */
126 |     function setPage(page: number) {
127 |         if (currentContextMediaplanId.value && currentContextProjectId.value && page >= 0) {
128 |             currentPage.value = page;
129 |             fetchCampaigns(currentContextMediaplanId.value, currentContextProjectId.value);
130 |         } else {
131 |             console.error("Cannot set page, context IDs are missing or page is invalid.");
132 |         }
133 |     }
134 | 
135 |     /**
136 |      * Setzt die Anzahl der Items pro Seite, setzt auf Seite 0 zurück und lädt neu.
137 |      * Verwendet die gespeicherten Kontext-IDs.
138 |      */
139 |     function setPerPage(newPerPage: number) {
140 |         if (currentContextMediaplanId.value && currentContextProjectId.value && newPerPage > 0) {
141 |             perPage.value = newPerPage;
142 |             currentPage.value = 0; // Reset to first page
143 |             fetchCampaigns(currentContextMediaplanId.value, currentContextProjectId.value);
144 |         } else {
145 |             console.error("Cannot set perPage, context IDs are missing or value is invalid.");
146 |         }
147 |     }
148 | 
149 |     // Optional: setSorting(...) implementieren, falls benötigt
150 | 
151 |     /**
152 |      * Erstellt eine neue Kampagne.
153 |      */
154 |     async function createCampaign(mediaplanId: string, projectId: string, campaignData: CampaignCreate): Promise<Campaign | null> {
155 |         if (!mediaplanId || !projectId) {
156 |             error.value = "Missing IDs for creating campaign.";
157 |             console.error(error.value);
158 |             return null;
159 |         }
160 |         isLoading.value = true;
161 |         error.value = null;
162 |         try {
163 |             const url = `/mediaplans/${mediaplanId}/projects/${projectId}/campaigns`;
164 |             const newCampaign = await customFetch(url, {
165 |                 method: 'POST',
166 |                 headers: {'Content-Type': 'application/json'},
167 |                 body: JSON.stringify(campaignData),
168 |             }) as Campaign;
169 | 
170 |             // Optional: Liste neu laden oder die neue Kampagne manuell hinzufügen
171 |             // fetchCampaigns(mediaplanId, projectId); // Einfachste Variante
172 |             return newCampaign;
173 | 
174 |         } catch (err) {
175 |             error.value = err instanceof Error ? err.message : 'Failed to create campaign';
176 |             console.error('Error creating campaign:', err);
177 |             return null;
178 |         } finally {
179 |             isLoading.value = false;
180 |         }
181 |     }
182 | 
183 |     return {
184 |         // State
185 |         campaigns,
186 |         selectedCampaign,
187 |         isLoading,
188 |         error,
189 |         totalItems,
190 |         totalPages,
191 |         currentPage,
192 |         perPage,
193 |         // Optional: Sortierung
194 |         // sortBy,
195 |         // sortOrder,
196 | 
197 |         // Actions
198 |         fetchCampaigns,
199 |         fetchCampaign,
200 |         setPage,
201 |         setPerPage,
202 |         createCampaign,
203 |         // Optional: setSorting
204 |     };
205 | });
```

src/stores/createMediaplanStore.ts
```
1 | // src/stores/createMediaplanStore.ts
2 | import { defineStore } from 'pinia';
3 | import { ref } from 'vue';
4 | import customFetch from '@/helpers/customFetch';
5 | import type { Brand, PONumber } from '@/types/mediaplan';
6 | 
7 | export const useCreateMediaplanStore = defineStore('createMediaplan', () => {
8 |   // State
9 |   const brands = ref<Brand[]>([]);
10 |   const poNumbers = ref<PONumber[]>([]);
11 |   const isLoading = ref(false);
12 |   const error = ref<string | null>(null);
13 | 
14 |   // Actions
15 |   async function fetchBrands() {
16 |     isLoading.value = true;
17 |     error.value = null;
18 | 
19 |     try {
20 |       // In a real application, this would be an API call to get brands
21 |       // const response = await customFetch('/brands');
22 |       // brands.value = response;
23 | 
24 |       // For demo purposes, use mock data
25 |       brands.value = [
26 |         { _id: 'bmw', name: 'BMW' },
27 |         { _id: 'mini', name: 'MINI' },
28 |       ];
29 |     } catch (err) {
30 |       error.value = err instanceof Error ? err.message : 'Error fetching brands';
31 |       console.error('Error fetching brands:', err);
32 |     } finally {
33 |       isLoading.value = false;
34 |     }
35 |   }
36 | 
37 |   async function fetchPONumbers() {
38 |     isLoading.value = true;
39 |     error.value = null;
40 | 
41 |     try {
42 |       // In a real application, this would be an API call to get PO numbers
43 |       // const response = await customFetch('/po-numbers');
44 |       // poNumbers.value = response;
45 | 
46 |       // For demo purposes, use mock data
47 |       poNumbers.value = [
48 |         { _id: 'po-1', name: 'PO12345', value: 10000 },
49 |         { _id: 'po-2', name: 'PO67890', value: 15000 },
50 |         { _id: 'po-3', name: 'PO24680', value: 20000 },
51 |       ];
52 |     } catch (err) {
53 |       error.value = err instanceof Error ? err.message : 'Error fetching PO numbers';
54 |       console.error('Error fetching PO numbers:', err);
55 |     } finally {
56 |       isLoading.value = false;
57 |     }
58 |   }
59 | 
60 |   async function createPO(poData: Omit<PONumber, '_id'> & { metadata?: any }): Promise<PONumber> {
61 |     isLoading.value = true;
62 |     error.value = null;
63 | 
64 |     try {
65 |       // In a real application, this would be an API call to create a PO
66 |       // const response = await customFetch('/po-numbers', {
67 |       //   method: 'POST',
68 |       //   headers: {
69 |       //     'Content-Type': 'application/json',
70 |       //   },
71 |       //   body: JSON.stringify(poData),
72 |       // });
73 |       // return response;
74 | 
75 |       // For demo purposes, simulate API call
76 |       await new Promise(resolve => setTimeout(resolve, 500));
77 |       
78 |       // Create a new PO object with a generated ID
79 |       const newPO: PONumber = {
80 |         _id: `po-${Date.now()}`,
81 |         name: poData.name,
82 |         value: poData.value
83 |       };
84 |       
85 |       // Add to the store
86 |       poNumbers.value.push(newPO);
87 |       
88 |       return newPO;
89 |     } catch (err) {
90 |       error.value = err instanceof Error ? err.message : 'Error creating PO';
91 |       console.error('Error creating PO:', err);
92 |       throw err;
93 |     } finally {
94 |       isLoading.value = false;
95 |     }
96 |   }
97 | 
98 |   return {
99 |     // State
100 |     brands,
101 |     poNumbers,
102 |     isLoading,
103 |     error,
104 | 
105 |     // Actions
106 |     fetchBrands,
107 |     fetchPONumbers,
108 |     createPO
109 |   };
110 | });
```

src/stores/mediaplanStore.ts
```
1 | // File: src/stores/mediaplanStore.ts
2 | import { defineStore } from 'pinia';
3 | import { ref, computed } from 'vue';
4 | import customFetch from '@/helpers/customFetch';
5 | import type {
6 |     FilterSources,
7 |     Mediaplan,
8 |     MediaplanFilter,
9 |     MediaplanListResponse,
10 |     SourcesResponse
11 | } from '@/types';
12 | 
13 | export const useMediaplanStore = defineStore('mediaplan', () => {
14 |     // --- State ---
15 |     const sources = ref<FilterSources>({
16 |         brands: [
17 |             { _id: 'bmw', name: 'BMW' },
18 |             { _id: 'mini', name: 'MINI' }
19 |         ],
20 |         countries: [
21 |             { abbreviation: 'DE', value: 'Germany', category: null },
22 |             { abbreviation: 'AT', value: 'Austria', category: null },
23 |             // …other mock countries…
24 |         ],
25 |         subsegments: [],
26 |         products: [],
27 |         campaigntypes: [],
28 |         languages: []
29 |     });
30 |     const mediaplans  = ref<Mediaplan[]>([]);
31 |     const isLoading   = ref(false);
32 |     const error       = ref<string | null>(null);
33 | 
34 |     // Pagination
35 |     const totalItems  = ref(0);
36 |     const totalPages  = ref(0);
37 |     const currentPage = ref(0);
38 |     const perPage     = ref(10);
39 | 
40 |     // Filters & Sorting
41 |     const filters   = ref<MediaplanFilter>({ search: '', status: '' });
42 |     const sortBy    = ref('updated_at');
43 |     const sortOrder = ref<'asc' | 'desc'>('desc');
44 | 
45 |     const hasFilters = computed(() =>
46 |         !!(
47 |             filters.value.search ||
48 |             filters.value.status ||
49 |             filters.value.brand_id ||
50 |             filters.value.country
51 |         )
52 |     );
53 | 
54 |     // --- Actions ---
55 |     /** Load real source‐lists (when API is available) */
56 |     async function fetchSources() {
57 |         isLoading.value = true;
58 |         try {
59 |             const res = await customFetch('/mediaplans/sources?type=overview') as SourcesResponse;
60 |             sources.value = {
61 |                 brands:       res.data.brand       ?? [],
62 |                 countries:    res.data.country     ?? [],
63 |                 subsegments:  res.data.subsegment  ?? [],
64 |                 products:     res.data.product     ?? [],
65 |                 campaigntypes:res.data.campaigntype ?? [],
66 |                 languages:    res.data.language    ?? []
67 |             };
68 |         } catch {
69 |             // keep the mock data
70 |         } finally {
71 |             isLoading.value = false;
72 |         }
73 |     }
74 | 
75 |     /** Fetch paginated & filtered list */
76 |     async function fetchMediaplans() {
77 |         isLoading.value = true;
78 |         error.value = null;
79 |         try {
80 |             const params = new URLSearchParams({
81 |                 page:        currentPage.value.toString(),
82 |                 per_page:    perPage.value.toString(),
83 |                 sort:        sortBy.value,
84 |                 order:       sortOrder.value,
85 |             });
86 | 
87 |             // apply filters
88 |             const active: Record<string, any> = {};
89 |             Object.entries(filters.value).forEach(([k, v]) => {
90 |                 if (v !== '' && v != null) {
91 |                     active[k] = v;
92 |                 }
93 |             });
94 |             if (Object.keys(active).length) {
95 |                 params.append('filter', JSON.stringify(active));
96 |             }
97 | 
98 |             const url = `/mediaplans?${params.toString()}`;
99 |             const resp = await customFetch(url) as MediaplanListResponse;
100 | 
101 |             mediaplans.value  = resp.items;
102 |             totalItems.value  = resp.total_items;
103 |             totalPages.value  = resp.total_pages;
104 |             currentPage.value = resp.current_page;
105 |         } catch (err) {
106 |             error.value = err instanceof Error ? err.message : 'Error fetching mediaplans';
107 |             mediaplans.value = [];
108 |             totalItems.value = totalPages.value = 0;
109 |         } finally {
110 |             isLoading.value = false;
111 |         }
112 |     }
113 | 
114 |     /** Update a single filter and reload */
115 |     function setFilter(key: keyof MediaplanFilter, value: unknown) {
116 |         filters.value = { ...filters.value, [key]: value };
117 |         currentPage.value = 0;
118 |         fetchMediaplans();
119 |     }
120 | 
121 |     /** Clear all filters back to defaults */
122 |     function clearFilters() {
123 |         filters.value = { search: '', status: '' };
124 |         currentPage.value = 0;
125 |         fetchMediaplans();
126 |     }
127 | 
128 |     /** Change sorting and reload */
129 |     function setSorting(field: string, order: 'asc' | 'desc') {
130 |         sortBy.value    = field;
131 |         sortOrder.value = order;
132 |         fetchMediaplans();
133 |     }
134 | 
135 |     /** Change page and reload */
136 |     function setPage(page: number) {
137 |         currentPage.value = page;
138 |         fetchMediaplans();
139 |     }
140 | 
141 |     /** Initialize both sources and list */
142 |     function init() {
143 |         fetchSources();
144 |         fetchMediaplans();
145 |     }
146 | 
147 |     return {
148 |         // state
149 |         sources,
150 |         mediaplans,
151 |         isLoading,
152 |         error,
153 |         totalItems,
154 |         totalPages,
155 |         currentPage,
156 |         perPage,
157 |         filters,
158 |         sortBy,
159 |         sortOrder,
160 |         hasFilters,
161 |         // actions
162 |         fetchSources,
163 |         fetchMediaplans,
164 |         setFilter,
165 |         clearFilters,
166 |         setSorting,
167 |         setPage,
168 |         init
169 |     };
170 | });
```

src/stores/projectStore.ts
```
1 | // src/stores/projectStore.ts
2 | import {defineStore} from 'pinia';
3 | import {ref, computed} from 'vue';
4 | import customFetch from '@/helpers/customFetch';
5 | import type {
6 |     Project,
7 |     ProjectCreate,
8 |     ProjectCountry,
9 |     ProjectLanguage,
10 |     ProjectCampaignType,
11 |     ProjectPhase,
12 |     ProjectGoal,
13 |     ProjectBuilder,
14 |     ProjectListResponse
15 | } from '@/types/project';
16 | 
17 | export const useProjectStore = defineStore('project', () => {
18 |     // State
19 |     const projects = ref<Project[]>([]);
20 |     const selectedProject = ref<Project | null>(null);
21 |     const isLoading = ref(false);
22 |     const error = ref<string | null>(null);
23 | 
24 |     // Options for project form
25 |     const countries = ref<ProjectCountry[]>([]);
26 |     const languages = ref<ProjectLanguage[]>([]);
27 |     const campaignTypes = ref<ProjectCampaignType[]>([]);
28 |     const phases = ref<ProjectPhase[]>([]);
29 |     const goals = ref<ProjectGoal[]>([]);
30 |     const builders = ref<ProjectBuilder[]>([]);
31 | 
32 |     // Pagination state
33 |     const totalItems = ref(0);
34 |     const totalPages = ref(0);
35 |     const currentPage = ref(0);
36 |     const perPage = ref(10);
37 | 
38 |     // Getters
39 |     const getProjectById = computed(() => {
40 |         return (id: string) => projects.value.find(project => project._id === id) || null;
41 |     });
42 | 
43 |     // Actions
44 |     async function fetchProjects(mediaplanId: string) {
45 |         isLoading.value = true;
46 |         error.value = null;
47 | 
48 |         try {
49 |             // Build query parameters
50 |             const queryParams = new URLSearchParams();
51 |             queryParams.append('page', currentPage.value.toString());
52 |             queryParams.append('per_page', perPage.value.toString());
53 | 
54 |             const url = `/mediaplans/${mediaplanId}/projects?${queryParams.toString()}`;
55 |             const response = await customFetch(url) as ProjectListResponse;
56 | 
57 |             projects.value = response.items;
58 |             totalItems.value = response.total_items;
59 |             totalPages.value = response.total_pages;
60 |             currentPage.value = response.current_page;
61 | 
62 |         } catch (err) {
63 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching projects';
64 |             console.error('Error fetching projects:', err);
65 |         } finally {
66 |             isLoading.value = false;
67 |         }
68 |     }
69 | 
70 |     async function fetchProject(mediaplanId: string, projectId: string) {
71 |         isLoading.value = true;
72 |         error.value = null;
73 | 
74 |         try {
75 |             const url = `/mediaplans/${mediaplanId}/projects/${projectId}`;
76 |             const response = await customFetch(url) as Project;
77 |             selectedProject.value = response;
78 |             return response;
79 |         } catch (err) {
80 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching project';
81 |             console.error('Error fetching project:', err);
82 |             throw err;
83 |         } finally {
84 |             isLoading.value = false;
85 |         }
86 |     }
87 | 
88 |     async function createProject(projectData: ProjectCreate) {
89 |         isLoading.value = true;
90 |         error.value = null;
91 | 
92 |         try {
93 |             const url = `/mediaplans/${projectData.mediaplanId}/projects`;
94 | 
95 |             // For our implementation, we need to adjust the data structure to match the API expectations
96 |             const payload = {
97 |                 abbreviation: projectData.name,
98 |                 default_vars: {
99 |                     targeturls: null,
100 |                     subsegment: projectData.phase,
101 |                     campaigntype: projectData.campaignType,
102 |                     language: projectData.language,
103 |                     campaigndetail: null,
104 |                     adtype: "Banner",
105 |                     dimension: "300x250"
106 |                 },
107 |                 descriptive_vars: {
108 |                     brand: "BMW", // This would typically be dynamic
109 |                     country: projectData.country.code,
110 |                     bmwponumber: "PO12345", // This would be dynamic based on the selected PO
111 |                     adobecampaignname: projectData.name,
112 |                     subsegment: projectData.phase,
113 |                     campaigntype: projectData.campaignType,
114 |                     projectname: projectData.name,
115 |                     year: new Date().getFullYear()
116 |                 },
117 |                 is_locked: false,
118 |                 labels: [],
119 |                 lock_state: 0,
120 |                 owner: "user123", // Would be the current user
121 |                 message: "OK",
122 |                 version: "v1"
123 |             };
124 | 
125 |             // For demo purposes, log the payload
126 |             console.log('Creating project with data:', payload);
127 | 
128 |             // In a real implementation, we would send the API request
129 |             /*
130 |             const response = await customFetch(url, {
131 |               method: 'POST',
132 |               headers: {
133 |                 'Content-Type': 'application/json',
134 |               },
135 |               body: JSON.stringify(payload),
136 |             });
137 | 
138 |             return response._id;
139 |             */
140 | 
141 |             // For demo, simulate successful creation
142 |             await new Promise(resolve => setTimeout(resolve, 500));
143 | 
144 |             // Return a mock project ID
145 |             return `project-${Date.now()}`;
146 | 
147 |         } catch (err) {
148 |             error.value = err instanceof Error ? err.message : 'An error occurred while creating project';
149 |             console.error('Error creating project:', err);
150 |             throw err;
151 |         } finally {
152 |             isLoading.value = false;
153 |         }
154 |     }
155 | 
156 |     async function fetchProjectOptions() {
157 |         isLoading.value = true;
158 |         error.value = null;
159 | 
160 |         try {
161 |             // In a real application, we would fetch these from the API
162 |             // For this demo, we're using mock data
163 | 
164 |             // Mock countries
165 |             countries.value = [
166 |                 {code: 'AT', name: 'Austria'},
167 |                 {code: 'DE', name: 'Germany'},
168 |                 {code: 'PL', name: 'Poland'},
169 |                 {code: 'US', name: 'United States'}
170 |             ];
171 | 
172 |             // --- CORRECTED Mock languages ---
173 |             languages.value = [
174 |                 {code: 'DEU', name: 'German', country_codes: ['DE', 'AT']}, // Added country_codes
175 |                 {code: 'ENG', name: 'English', country_codes: ['US']},      // Added country_codes
176 |                 {code: 'POL', name: 'Polish', country_codes: ['PL']}       // Added country_codes
177 |                 // Add other languages and their associated country codes as needed
178 |             ];
179 |             // --- END CORRECTION ---
180 | 
181 |             // Mock campaign types
182 |             campaignTypes.value = [
183 |                 {id: 'always-on', name: 'Always On'},
184 |                 {id: 'awareness', name: 'Awareness'},
185 |                 {id: 'consideration', name: 'Consideration'}
186 |             ];
187 | 
188 |             // Mock phases
189 |             phases.value = [
190 |                 {id: 'sea', name: 'SEA'},
191 |                 {id: 'planning', name: 'Planning'},
192 |                 {id: 'execution', name: 'Execution'}
193 |             ];
194 | 
195 |             // Mock goals
196 |             goals.value = [
197 |                 {id: 'consideration', name: 'Consideration'},
198 |                 {id: 'configurator', name: 'Configurator'},
199 |                 {id: 'conversion', name: 'Conversion'}
200 |             ];
201 | 
202 |             // Mock builders
203 |             builders.value = [
204 |                 {id: 'sea', name: 'SEA'},
205 |                 {id: 'social', name: 'Social'},
206 |                 {id: 'display', name: 'Display'},
207 |                 {id: '2layer', name: '2Layer'}
208 |             ];
209 | 
210 |         } catch (err) {
211 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching project options';
212 |             console.error('Error fetching project options:', err);
213 |         } finally {
214 |             isLoading.value = false;
215 |         }
216 |     }
217 |     return {
218 |         // State
219 |         projects,
220 |         selectedProject,
221 |         isLoading,
222 |         error,
223 |         countries,
224 |         languages,
225 |         campaignTypes,
226 |         phases,
227 |         goals,
228 |         builders,
229 |         totalItems,
230 |         totalPages,
231 |         currentPage,
232 |         perPage,
233 | 
234 |         // Getters
235 |         getProjectById,
236 | 
237 |         // Actions
238 |         fetchProjects,
239 |         fetchProject,
240 |         createProject,
241 |         fetchProjectOptions
242 |     };
243 | });
```

src/types/campaigns.ts
```
1 | // src/types/campaign.ts (Beispiel - erstellen oder anpassen)
2 | 
3 | export interface Campaign {
4 |     _id: string;
5 |     campaignname: string;
6 |     pid: string; // Project ID
7 |     campaigndetail?: string | null;
8 |     campaigntype: string;
9 |     created_at: string;
10 |     language: string;
11 |     product: string;
12 |     subsegment: string;
13 |     type: string; // z.B. display, video
14 |     updated_at?: string | null;
15 |     // Füge weitere Felder hinzu, falls von der API geliefert
16 | }
17 | 
18 | export interface CampaignListResponse {
19 |     items: Campaign[];
20 |     total_items: number;
21 |     total_pages: number;
22 |     current_page: number; // 0-basiert
23 | }
24 | 
25 | // Optional: Typ für das Erstellen einer Kampagne (aus Spec)
26 | export interface CampaignCreate {
27 |     campaignname: string;
28 |     pid: string;
29 |     campaigndetail?: string | null;
30 |     campaigntype: string;
31 |     language?: string;
32 |     product?: string;
33 |     subsegment?: string;
34 |     type?: string;
35 | }
```

src/types/index.ts
```
1 | // src/types/index.ts
2 | // This file exports all types from the directory
3 | 
4 | export * from './mediaplan';
5 | /*export * from './project';
6 | export * from './campaign';*/
7 | // Add more exports as needed
```

src/types/mediaplan.ts
```
1 | // src/types/mediaplan.ts
2 | 
3 | // Basic source type used across various dropdowns
4 | export interface Source {
5 |     abbreviation: string;
6 |     category: string | null;
7 |     value: string;
8 | }
9 | 
10 | // Brand reference
11 | export interface Brand {
12 |     _id: string;
13 |     name: string;
14 |     logo?: string;
15 | }
16 | 
17 | // Filter sources from API
18 | export interface FilterSources {
19 |     brands: Brand[];
20 |     countries: Source[];
21 |     subsegments: Source[];
22 |     products: Source[];
23 |     campaigntypes: Source[];
24 |     languages: Source[];
25 | }
26 | 
27 | // Budget information
28 | export interface Budget {
29 |     used: number;
30 |     total: number;
31 |     available: number;
32 | }
33 | 
34 | // PO Number structure
35 | export interface PONumber {
36 |     _id: string;
37 |     name: string;
38 |     value: number;
39 | }
40 | 
41 | // Entity reference (used for created_by and other references)
42 | export interface EntityReference {
43 |     _id: string;
44 |     name: string;
45 | }
46 | 
47 | // Mediaplan filter options
48 | export interface MediaplanFilter {
49 |     search?: string;
50 |     status?: string;
51 |     start_date_before?: string;
52 |     start_date_after?: string;
53 |     brand_id?: string;
54 |     country?: string;
55 |     created_by_me?: boolean;
56 |     currently_running?: boolean;
57 | }
58 | 
59 | // Mediaplan create request
60 | export interface MediaplanCreate {
61 |     name: string;
62 |     status: 'In Planning' | 'Draft' | 'For Approval';
63 |     start_date: string;
64 |     end_date: string;
65 |     brand: {
66 |         _id: string;
67 |         name?: string;
68 |     };
69 |     budget: {
70 |         total: number;
71 |         used?: number;
72 |         available?: number;
73 |     };
74 |     po_numbers?: PONumber[];
75 | }
76 | 
77 | // Complete Mediaplan object
78 | export interface Mediaplan {
79 |     _id: string;
80 |     name: string;
81 |     status: 'in_planning' | 'draft' | 'for_approval';
82 |     start_date: string;
83 |     end_date: string;
84 |     brand: EntityReference;
85 |     budget: Budget;
86 |     po_numbers?: PONumber[];
87 |     created_by: EntityReference;
88 |     created_at: string;
89 |     updated_at: string;
90 | }
91 | 
92 | // API response for mediaplan list
93 | export interface MediaplanListResponse {
94 |     total_items: number;
95 |     total_pages: number;
96 |     current_page: number;
97 |     items: Mediaplan[];
98 | }
99 | 
100 | // Sources response type
101 | export interface SourcesResponse {
102 |     _id: string;
103 |     version: string;
104 |     timestamp: string;
105 |     message: string;
106 |     code: number;
107 |     data: {
108 |         subsegment?: Source[];
109 |         product?: Source[];
110 |         campaigntype?: Source[];
111 |         language?: Source[];
112 |         [key: string]: Source[] | undefined;
113 |     };
114 | }
```

src/types/project.ts
```
1 | // src/types/project.ts
2 | 
3 | // Country reference
4 | export interface Country {
5 |   code: string;
6 |   name: string;
7 | }
8 | 
9 | // Basic structure for default variables
10 | export interface ProjectDefaultVars {
11 |   targeturls: string | null;
12 |   subsegment: string | null;
13 |   campaigntype: string | null;
14 |   language: string | null;
15 |   campaigndetail: string | null;
16 |   adtype: string | null;
17 |   dimension: string | null;
18 | }
19 | 
20 | // Basic structure for descriptive variables
21 | export interface ProjectDescriptiveVars {
22 |   brand: string;
23 |   country: string;
24 |   bmwponumber: string;
25 |   adobecampaignname: string;
26 |   subsegment: string;
27 |   campaigntype: string;
28 |   projectname: string;
29 |   year: number;
30 | }
31 | 
32 | // Duration information
33 | export interface ProjectDuration {
34 |   start_date: string;
35 |   end_date: string;
36 |   formatted: string;
37 | }
38 | 
39 | // Project object
40 | export interface Project {
41 |   _id: string;
42 |   abbreviation: string;
43 |   created_at: string;
44 |   default_vars: ProjectDefaultVars;
45 |   descriptive_vars: ProjectDescriptiveVars;
46 |   is_locked: boolean;
47 |   labels: string[];
48 |   lock_state: number;
49 |   owner: string;
50 |   updated_at: string;
51 |   uploaded_at: string;
52 |   message: string;
53 |   timestamp: string;
54 |   version: string;
55 |   duration?: ProjectDuration;
56 |   detail?: string;
57 |   mediaplanId?: string;
58 | }
59 | 
60 | // Project create request
61 | export interface ProjectCreate {
62 |   abbreviation?: string;
63 |   default_vars: ProjectDefaultVars;
64 |   descriptive_vars: ProjectDescriptiveVars;
65 |   labels?: string[];
66 | }
67 | 
68 | // API response for project list
69 | export interface ProjectListResponse {
70 |   total_items: number;
71 |   total_pages: number;
72 |   current_page: number;
73 |   items: Project[];
74 | }
```

src/validations/validations.ts
```
1 | // src/validations/validations.ts
2 | import * as yup from 'yup';
3 | 
4 | export const loginValidationSchema = yup.object({
5 |     username: yup.string().required('Username is required').max(100, 'Username must be less than 100 characters'),
6 |     password: yup.string().required('Password is required').min(2, 'Password must be at least 2 characters'),
7 | });
8 | 
9 | 
10 | 
11 | // Füge hier weitere Validierungsschemata hinzu
```

src/views/Login.vue
```
1 | <template>
2 |   <v-container fluid style="max-width: 1600px" class="d-flex justify-center">
3 |     <v-sheet class="pa-6" rounded elevation="4" max-width="480" width="100%" style="margin-top: 100px;">
4 |       <v-form @submit.prevent="onSubmit" class="form-container">
5 |         <h4 class="text-h4 font-weight-medium mb-3">
6 |           Welcome to the BMW Group Mediaplan.
7 |         </h4>
8 |         <v-text-field
9 |             v-model="name.value.value"
10 |             :error-messages="name.errorMessage.value"
11 |             label="Name"
12 |             variant="outlined"
13 |             clearable
14 |             class="mb-3"
15 |         />
16 | 
17 |         <v-text-field
18 |             v-model="password.value.value"
19 |             :error-messages="password.errorMessage.value"
20 |             label="Password"
21 |             type="password"
22 |             variant="outlined"
23 |             clearable
24 |             class="mb-6"
25 |         />
26 | 
27 |         <v-alert
28 |             v-if="authStore.error"
29 |             class="mb-4"
30 |             type="error"
31 |             variant="tonal"
32 |             border="start"
33 |             closable
34 |             @close="authStore.error = null"
35 |             icon="mdi-alert-circle-outline"
36 |         >
37 |           {{ authStore.error }}
38 |         </v-alert>
39 | 
40 |         <v-row justify="end">
41 |           <v-col cols="auto">
42 |             <v-btn :disabled="authStore.isLoading" type="submit" color="primary">
43 |               Login
44 |             </v-btn>
45 |           </v-col>
46 |         </v-row>
47 |       </v-form>
48 |     </v-sheet>
49 |   </v-container>
50 | </template>
51 | 
52 | <script setup lang="ts">
53 | import {reactive} from 'vue'; // No need to import ref if not used independently
54 | import {useAuthStore} from '../stores/auth';
55 | import {useRouter} from 'vue-router';
56 | import {useField, useForm} from 'vee-validate';
57 | import {VAlert} from 'vuetify/components'; // Correct import for VAlert
58 | 
59 | const router = useRouter();
60 | const authStore = useAuthStore();
61 | const validationSchema = {
62 |   name(value: string) { // Type annotation for value
63 |     if (value?.length >= 2) {
64 |       return true;
65 |     }
66 |     return 'Name needs to be at least 2 characters.';
67 |   },
68 |   password(value: string) { // Type annotation for value
69 |     if (value?.length >= 6) {
70 |       return true;
71 |     }
72 |     return 'Password needs to be at least 6 characters.';
73 |   },
74 | }
75 | 
76 | 
77 | const {handleSubmit, handleReset} = useForm({ //Removed the Reset, not used
78 |   validationSchema
79 | });
80 | 
81 | const name = useField('name', validationSchema,
82 |     {
83 |       initialValue: 'onebuilderPlanner'
84 |     }
85 | );
86 | const password = useField('password', validationSchema,
87 |     {
88 |       initialValue: 'OnebuilderPlanner1'
89 |     });
90 | 
91 | const onSubmit = handleSubmit(async (values) => {
92 |   // No need for local errorMessage, use authStore.error
93 |   // No need for local form.pending, use authStore.isLoading
94 | 
95 |   try {
96 |     await authStore.login(values.name, values.password);
97 |     // Redirect *after* successful login (handled in the store)
98 |     if (authStore.isAuthenticated) {
99 |       router.push('/');
100 |     }
101 | 
102 |   } catch (error: any) {
103 |     //  Error handling is now done in the store, so we don't need this here.
104 |     //  The store will set authStore.error appropriately.
105 |     console.error("Login Error in Component:", error); // Good for debugging
106 |   }
107 |   // No finally block needed, authStore.isLoading is handled in the store.
108 | });
109 | </script>
110 | 
111 | <style scoped>
112 | .form-container {
113 |   max-width: 430px;
114 |   margin: 0 auto;
115 | }
116 | </style>
```

src/views/MediaplanDetail.vue
```
1 | <template>
2 |   <MainLayout>
3 |     <div class="mediaplan-detail">
4 |       <v-alert v-if="errorMediaplan" type="error" density="compact" class="mb-4" closable>
5 |         {{ errorMediaplan }}
6 |       </v-alert>
7 | 
8 |       <div v-if="isLoadingMediaplan && !mediaplan" class="text-center my-10">
9 |         <v-progress-circular indeterminate color="primary" size="40" />
10 |         <p class="mt-2 text-disabled">Loading Mediaplan...</p>
11 |       </div>
12 | 
13 |       <template v-if="!isLoadingMediaplan && mediaplan">
14 |         <MediaplanTopSection
15 |             :mediaplan="mediaplan"
16 |             :project="null"
17 |             :search="search"
18 |             :is-loading="isLoadingMediaplan"
19 |             :current-view="currentView"
20 |             @update:search="updateSearch"
21 |             @update:current-view="val => currentView = val"
22 |         >
23 |           <!-- Slot für späteren Campaign-Type-Select, falls benötigt -->
24 |           <template #campaign-type-select>
25 |             <!-- ggf. v-select hier -->
26 |           </template>
27 |         </MediaplanTopSection>
28 | 
29 |         <div class="main-content">
30 |           <MediaplanPlanningView
31 |               v-if="currentView === 'planning'"
32 |               :projects="projects"
33 |               :total-projects="totalProjects"
34 |               :is-loading="isLoadingProjects"
35 |               :current-page="projectCurrentPage"
36 |               :items-per-page="projectItemsPerPage"
37 |               :mediaplan-id="mediaplanId"
38 |               @update:options="handleProjectOptionsUpdate"
39 |               @add-project="openCreateProjectDialog"
40 |           />
41 | 
42 |           <MediaplanBudgetView v-else :mediaplan="mediaplan" />
43 | 
44 |           <v-alert
45 |               v-if="projectError && currentView === 'planning'"
46 |               type="error"
47 |               density="compact"
48 |               class="mt-4"
49 |               closable
50 |           >
51 |             Failed to load projects: {{ projectError }}
52 |           </v-alert>
53 |         </div>
54 |       </template>
55 | 
56 |       <template v-else-if="!isLoadingMediaplan && !mediaplan && errorMediaplan">
57 |         <div class="text-center my-10 text-disabled">
58 |           <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
59 |           <p>Could not load Mediaplan data.</p>
60 |         </div>
61 |       </template>
62 | 
63 |       <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
64 |         {{ snackbar.text }}
65 |         <template v-slot:actions>
66 |           <v-btn icon @click="snackbar.show = false">
67 |             <v-icon>mdi-close</v-icon>
68 |           </v-btn>
69 |         </template>
70 |       </v-snackbar>
71 |     </div>
72 |   </MainLayout>
73 | </template>
74 | 
75 | <script setup lang="ts">
76 | import { ref, computed, onMounted, reactive, watch } from 'vue'
77 | import { useRoute } from 'vue-router'
78 | 
79 | import MainLayout from '@/layouts/MainLayout.vue'
80 | import MediaplanPlanningView from '@/components/mediaplan/MediaplanPlanningView.vue'
81 | import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue'
82 | import { useMediaplanStore } from '@/stores/mediaplanStore'
83 | import { useProjectStore } from '@/stores/projectStore'
84 | import type { Mediaplan } from '@/types/mediaplan'
85 | import type { Project } from '@/types/project'
86 | import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";
87 | 
88 | // --- Props & Route ---
89 | const props = defineProps<{ id?: string }>()
90 | const route = useRoute()
91 | const mediaplanId = ref(props.id || (route.params.id as string))
92 | 
93 | // --- Stores ---
94 | const mediaplanStore = useMediaplanStore()
95 | const projectStore = useProjectStore()
96 | 
97 | // --- Computed Properties ---
98 | const mediaplan = computed<Mediaplan | null>(() => mediaplanStore.selectedMediaplan)
99 | const isLoadingMediaplan = computed(() => mediaplanStore.isLoading)
100 | const errorMediaplan = computed(() => mediaplanStore.error)
101 | 
102 | const projects = computed<Project[]>(() => projectStore.projects)
103 | const totalProjects = computed(() => projectStore.totalItems)
104 | const isLoadingProjects = computed(() => projectStore.isLoading)
105 | const projectError = computed(() => projectStore.error)
106 | const projectCurrentPage = computed(() => projectStore.currentPage)
107 | const projectItemsPerPage = computed(() => projectStore.perPage)
108 | 
109 | // --- UI State ---
110 | const currentView = ref<'planning' | 'budget'>('planning')
111 | const search = ref('')
112 | 
113 | // --- Snackbar ---
114 | const snackbar = reactive({ show: false, text: '', color: 'success' })
115 | 
116 | // --- Methods ---
117 | const handleProjectOptionsUpdate = (options: {
118 |   page: number
119 |   itemsPerPage: number
120 |   sortBy?: any[]
121 |   sortDesc?: boolean[]
122 | }) => {
123 |   const newPage = options.page - 1
124 |   if (newPage !== projectCurrentPage.value) {
125 |     projectStore.currentPage = newPage
126 |     projectStore.fetchProjects(mediaplanId.value)
127 |   }
128 |   if (options.itemsPerPage !== projectItemsPerPage.value) {
129 |     projectStore.perPage = options.itemsPerPage
130 |     projectStore.currentPage = 0
131 |     projectStore.fetchProjects(mediaplanId.value)
132 |   }
133 | }
134 | 
135 | const openCreateProjectDialog = () => {
136 |   console.log('Trigger create project for Mediaplan ID:', mediaplanId.value)
137 |   // router.push or dialog logic here
138 | }
139 | 
140 | const updateSearch = (val: string) => {
141 |   search.value = val
142 |   // ggf. Filter-Logik hier
143 | }
144 | 
145 | const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
146 |   snackbar.text = text
147 |   snackbar.color = color
148 |   snackbar.show = true
149 | }
150 | 
151 | // --- Lifecycle ---
152 | onMounted(() => {
153 |   if (!mediaplanId.value) {
154 |     mediaplanStore.error = 'No mediaplan ID provided'
155 |     return
156 |   }
157 |   mediaplanStore.fetchMediaplan(mediaplanId.value)
158 |   projectStore.fetchProjects(mediaplanId.value)
159 | })
160 | 
161 | // --- Watchers ---
162 | watch(() => route.params.id, (newId) => {
163 |   if (typeof newId === 'string' && newId !== mediaplanId.value) {
164 |     mediaplanId.value = newId
165 |     mediaplanStore.fetchMediaplan(newId)
166 |     projectStore.fetchProjects(newId)
167 |   }
168 | })
169 | 
170 | watch(errorMediaplan, (err) => err && showSnackbar(`Error loading mediaplan: ${err}`, 'error'))
171 | watch(projectError, (err) => err && showSnackbar(`Error loading projects: ${err}`, 'error'))
172 | </script>
173 | 
174 | <style scoped>
175 | .mediaplan-detail {
176 |   min-height: calc(100vh - 64px);
177 | }
178 | .main-content {
179 |   min-height: 60vh;
180 | }
181 | </style>
```

src/views/MediaplanEdit.vue
```
1 | <template>
2 |   <v-container>
3 |     <v-row>
4 |       <v-col cols="12">
5 |         <v-card>
6 |           <v-card-title class="text-h4">
7 |             Edit Mediaplan
8 |           </v-card-title>
9 |           <v-card-text>
10 |             <p>Mediaplan ID: {{ id }}</p>
11 |             <p>This page would allow editing of the mediaplan details.</p>
12 |           </v-card-text>
13 |           <v-card-actions>
14 |             <v-btn color="primary" @click="goBack">
15 |               Back to Overview
16 |             </v-btn>
17 |           </v-card-actions>
18 |         </v-card>
19 |       </v-col>
20 |     </v-row>
21 |   </v-container>
22 | </template>
23 | 
24 | <script setup lang="ts">
25 | import { useRouter } from 'vue-router';
26 | 
27 | // Props
28 | const props = defineProps<{
29 |   id: string;
30 | }>();
31 | 
32 | // Router
33 | const router = useRouter();
34 | 
35 | // Methods
36 | const goBack = () => {
37 |   router.push('/');
38 | };
39 | </script>
```

src/views/Overview.vue
```
1 | <!-- File: src/views/Overview.vue -->
2 | <template>
3 |   <MainLayout>
4 |     <v-row class="pb-6 pt-1">
5 |       <v-col>
6 |         <MediaplanFilters
7 |             :filters="filters"
8 |             :sources="sources"
9 |             :loading="isLoading"
10 |             :sort-by="sortBy"
11 |             :sort-order="sortOrder"
12 |             @update:filter="handleFilterUpdate"
13 |             @update:sort="handleSortUpdate"
14 |         />
15 |       </v-col>
16 |     </v-row>
17 | 
18 |     <MediaplanList
19 |         :mediaplans="mediaplans"
20 |         :is-loading="isLoading"
21 |         :total-pages="totalPages"
22 |         :total-items="totalItems"
23 |         :current-page="currentPage"
24 |         :items-per-page="perPage"
25 |         @update:page="handlePageUpdate"
26 |         @update:items-per-page="handleItemsPerPageUpdate"
27 |     />
28 | 
29 |     <CreateMediaplanDialog
30 |         v-model="showCreateMediaplanDialog"
31 |         @created="handleMediaplanCreated"
32 |         @project-created="handleProjectCreated"
33 |     />
34 | 
35 |     <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
36 |       {{ snackbar.text }}
37 |     </v-snackbar>
38 |   </MainLayout>
39 | </template>
40 | 
41 | <script setup lang="ts">
42 | import { onMounted, computed, ref, reactive } from 'vue';
43 | import MainLayout from '@/layouts/MainLayout.vue';
44 | import MediaplanFilters from '@/components/overview/MediaplanFilters.vue';
45 | import MediaplanList from '@/components/overview/MediaplanList.vue';
46 | import CreateMediaplanDialog from '@/components/overview/CreateMediaplanDialog.vue';
47 | import { useMediaplanStore } from '@/stores/mediaplanStore';
48 | import type { MediaplanFilter } from '@/types';
49 | 
50 | // --- Store ---
51 | const store = useMediaplanStore();
52 | 
53 | // --- Computed from store ---
54 | const filters     = computed(() => store.filters);
55 | const sortBy      = computed(() => store.sortBy);
56 | const sortOrder   = computed(() => store.sortOrder);
57 | const currentPage = computed(() => store.currentPage);
58 | const perPage     = computed(() => store.perPage);
59 | const totalPages  = computed(() => store.totalPages);
60 | const totalItems  = computed(() => store.totalItems);
61 | const mediaplans  = computed(() => store.mediaplans);
62 | const isLoading   = computed(() => store.isLoading);
63 | const sources     = computed(() => store.sources);
64 | 
65 | // --- Dialog control ---
66 | const showCreateMediaplanDialog = ref(false);
67 | 
68 | // --- Snackbar ---
69 | const snackbar = reactive({
70 |   show: false,
71 |   text: '',
72 |   color: 'success'
73 | });
74 | 
75 | // --- Event Handlers ---
76 | function handleFilterUpdate(key: keyof MediaplanFilter, value: any) {
77 |   store.setFilter(key, value);
78 | }
79 | 
80 | function handleSortUpdate(payload: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
81 |   if (payload.sortBy !== sortBy.value || payload.sortOrder !== sortOrder.value) {
82 |     store.setSorting(payload.sortBy, payload.sortOrder);
83 |   }
84 | }
85 | 
86 | function handlePageUpdate(newPage: number) {
87 |   // v-pagination is 1-based; our store is 0-based
88 |   const zeroPage = newPage - 1;
89 |   if (zeroPage !== currentPage.value) {
90 |     store.setPage(zeroPage);
91 |   }
92 | }
93 | 
94 | function handleItemsPerPageUpdate(newPerPage: number) {
95 |   if (newPerPage !== perPage.value) {
96 |     store.perPage = newPerPage;
97 |     store.setPage(0);
98 |   }
99 | }
100 | 
101 | function handleMediaplanCreated(id: string) {
102 |   console.log('Mediaplan created:', id);
103 | }
104 | 
105 | function handleProjectCreated(id: string) {
106 |   snackbar.color = 'success';
107 |   snackbar.text = 'Project created successfully';
108 |   snackbar.show = true;
109 |   showCreateMediaplanDialog.value = false;
110 | }
111 | 
112 | // --- Init ---
113 | onMounted(() => {
114 |   store.init();
115 | });
116 | </script>
```

src/views/ProjectDetail.vue
```
1 | <script setup lang="ts">
2 | import { ref, computed, onMounted, reactive, watch } from 'vue';
3 | import { useRouter, useRoute } from 'vue-router';
4 | import MainLayout from '@/layouts/MainLayout.vue';
5 | import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue';
6 | // Entferne den Import von ProjectToolbar
7 | // import ProjectToolbar from '@/components/project/ProjectToolbar.vue';
8 | // Füge den Import von MediaplanHeader hinzu
9 | import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue';
10 | // Füge den Import von MediaplanViewToggle hinzu (falls noch nicht vorhanden)
11 | import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue';
12 | import CampaignListView from '@/components/project/CampaignListView.vue';
13 | import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue';
14 | import { useMediaplanStore } from '@/stores/mediaplanStore';
15 | import { useProjectStore } from '@/stores/projectStore';
16 | import { useCampaignStore } from '@/stores/campaignStore';
17 | import type { Project } from '@/types/project';
18 | import { formatDateRange } from '@/helpers/dateUtils';
19 | // Importiere den Helper für die Prozentrechnung
20 | import { calculatePercentage } from '@/helpers/currencyUtils';
21 | import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue"; // Pfad prüfen
22 | 
23 | // --- Props & Route ---
24 | const props = defineProps<{ mediaplanId?: string; projectId?: string; }>();
25 | const route = useRoute();
26 | const router = useRouter();
27 | const currentMediaplanId = ref(props.mediaplanId || route.params.mediaplanId as string);
28 | const currentProjectId = ref(props.projectId || route.params.projectId as string);
29 | 
30 | // --- Stores ---
31 | const mediaplanStore = useMediaplanStore();
32 | const projectStore = useProjectStore();
33 | const campaignStore = useCampaignStore();
34 | 
35 | // --- Computed Properties ---
36 | const parentMediaplan = computed(() => mediaplanStore.selectedMediaplan);
37 | const project = computed(() => projectStore.selectedProject);
38 | const isLoadingProject = computed(() => projectStore.isLoading);
39 | const errorProject = computed(() => projectStore.error);
40 | const campaigns = computed(() => campaignStore.campaigns);
41 | const totalCampaigns = computed(() => campaignStore.totalItems);
42 | const isLoadingCampaigns = computed(() => campaignStore.isLoading);
43 | const errorCampaigns = computed(() => campaignStore.error);
44 | const campaignCurrentPage = computed(() => campaignStore.currentPage);
45 | const campaignItemsPerPage = computed(() => campaignStore.perPage);
46 | 
47 | // --- UI State ---
48 | // currentView wird jetzt für den MediaplanViewToggle benötigt
49 | const currentView = ref<string>('planning'); // 'planning' or 'budget'
50 | const search = ref<string>('');
51 | 
52 | // --- Snackbar ---
53 | const snackbar = reactive({ show: false, text: '', color: 'success' });
54 | 
55 | // --- Methods ---
56 | const handleCampaignOptionsUpdate = (options: { /* ... */ page: number; itemsPerPage: number; }) => {
57 |   const newZeroBasedPage = options.page - 1;
58 |   let needsReload = false;
59 |   if (newZeroBasedPage !== campaignCurrentPage.value) {
60 |     campaignStore.currentPage = newZeroBasedPage;
61 |     needsReload = true;
62 |   }
63 |   if (options.itemsPerPage !== campaignItemsPerPage.value) {
64 |     campaignStore.perPage = options.itemsPerPage;
65 |     if (campaignStore.currentPage !== 0) campaignStore.currentPage = 0;
66 |     needsReload = true;
67 |   }
68 |   if (needsReload && currentMediaplanId.value && currentProjectId.value) {
69 |     campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
70 |   }
71 | };
72 | 
73 | const openCreateCampaignDialog = () => { /* ... */
74 |   console.log('Trigger create campaign');
75 | };
76 | const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => { /* ... */
77 |   snackbar.text = text;
78 |   snackbar.color = color;
79 |   snackbar.show = true;
80 | };
81 | 
82 | // Handler für das @update:search Event von MediaplanHeader
83 | const updateSearchHandler = (value: string | null) => {
84 |   search.value = value || '';
85 |   // Hier Logik zum Filtern der Kampagnen basierend auf 'search.value' hinzufügen, falls gewünscht
86 |   // z.B. campaignStore.setFilter('search', search.value); campaignStore.fetchCampaigns(...)
87 | };
88 | 
89 | 
90 | // --- Lifecycle Hooks ---
91 | onMounted(() => {
92 |   if (!currentMediaplanId.value || !currentProjectId.value) {
93 |     console.error('Missing ID(s) for Project Detail view');
94 |     errorProject.value = 'Missing Mediaplan or Project ID.'; // Set error directly or via store
95 |     return;
96 |   }
97 |   projectStore.fetchProject(currentMediaplanId.value, currentProjectId.value);
98 |   campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
99 |   // Lade den Parent-Mediaplan nur, wenn er noch nicht geladen ist oder ein anderer ist
100 |   if (!parentMediaplan.value || parentMediaplan.value._id !== currentMediaplanId.value) {
101 |     mediaplanStore.fetchMediaplan(currentMediaplanId.value);
102 |   }
103 | });
104 | 
105 | // --- Watchers ---
106 | // Beobachte Routenänderungen, um Daten neu zu laden
107 | watch(() => [route.params.mediaplanId, route.params.projectId], ([newMpId, newPId]) => {
108 |   let needsReload = false;
109 |   if (newMpId && typeof newMpId === 'string' && newMpId !== currentMediaplanId.value) {
110 |     currentMediaplanId.value = newMpId;
111 |     needsReload = true;
112 |   }
113 |   if (newPId && typeof newPId === 'string' && newPId !== currentProjectId.value) {
114 |     currentProjectId.value = newPId;
115 |     needsReload = true;
116 |   }
117 |   if (needsReload && currentMediaplanId.value && currentProjectId.value) {
118 |     mediaplanStore.fetchMediaplan(currentMediaplanId.value);
119 |     projectStore.fetchProject(currentMediaplanId.value, currentProjectId.value);
120 |     campaignStore.fetchCampaigns(currentMediaplanId.value, currentProjectId.value);
121 |   }
122 | }, { deep: true }); // deep watch might be needed if params object changes identity
123 | 
124 | watch(errorProject, (newError) => {
125 |   if (newError) showSnackbar(`Error loading project: ${newError}`, 'error');
126 | });
127 | watch(errorCampaigns, (newError) => {
128 |   if (newError) showSnackbar(`Error loading campaigns: ${newError}`, 'error');
129 | });
130 | 
131 | // Optional: Watch search changes for immediate filtering
132 | // watch(search, (newValue) => { ... });
133 | </script>
134 | 
135 | <template>
136 |   <MainLayout>
137 |     <div class="project-detail">
138 |       <v-alert v-if="errorProject && !isLoadingProject" type="error" density="compact" class="mb-4" closable>
139 |         Error loading project details: {{ errorProject }}
140 |       </v-alert>
141 |       <div v-if="isLoadingProject && !project" class="text-center my-10">
142 |         <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
143 |         <p class="mt-2 text-disabled">Loading Project...</p>
144 |       </div>
145 | 
146 |       <template v-if="!isLoadingProject && project">
147 |         <MediaplanTopSection
148 |             :mediaplan="parentMediaplan"
149 |             :project="project"
150 |             :search="search"
151 |             :is-loading="isLoadingProject || mediaplanStore.isLoading"
152 |             :current-view="currentView"
153 |             @update:search="updateSearchHandler"
154 |             @update:current-view="val => currentView = val"
155 |         >
156 |           <template #campaign-type-select>
157 |             <!-- TODO v-select - select campaigntyppe -->
158 |           </template>
159 |         </MediaplanTopSection>
160 |         <v-row v-if="project" class="mb-4">
161 |           <v-col>
162 |             <v-card variant="outlined">
163 |               <v-card-title class="d-flex align-center text-h6">
164 |                 <span>Project: {{ project.abbreviation }}</span>
165 |                 <v-spacer></v-spacer>
166 |                 <v-chip size="small" class="ml-2" :color="project.is_locked ? 'orange' : 'grey-lighten-1'" label>
167 |                   <v-icon start :icon="project.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant'"></v-icon>
168 |                   {{ project.is_locked ? 'Locked' : 'Unlocked' }}
169 |                 </v-chip>
170 |               </v-card-title>
171 |               <v-card-subtitle class="pb-2">
172 |                 {{ project.descriptive_vars?.projectname }}
173 |               </v-card-subtitle>
174 |               <v-card-text class="pt-2">
175 |                 <v-chip size="small" class="mr-2 mb-1" label prepend-icon="mdi-flag">
176 |                   {{ project.descriptive_vars?.country || 'N/A' }}
177 |                 </v-chip>
178 |                 <v-chip size="small" class="mr-2 mb-1" label prepend-icon="mdi-tag-outline">
179 |                   {{ project.default_vars?.campaigntype || 'N/A' }}
180 |                 </v-chip>
181 |                 <v-chip size="small" class="mr-2 mb-1" label prepend-icon="mdi-account-outline">
182 |                   {{ project.owner || 'N/A' }}
183 |                 </v-chip>
184 |                 <v-chip v-if="project.duration" size="small" class="mr-2 mb-1" label prepend-icon="mdi-calendar-range">
185 |                   {{
186 |                     project.duration.formatted || formatDateRange(project.duration.start_date, project.duration.end_date)
187 |                   }}
188 |                 </v-chip>
189 |                 <p v-if="project.detail" class="text-body-2 mt-3">{{ project.detail }}</p>
190 |               </v-card-text>
191 |             </v-card>
192 |           </v-col>
193 |         </v-row>
194 | 
195 |         <template v-if="project">
196 |           <div class="main-content">
197 |             <CampaignListView
198 |                 v-if="currentView === 'planning'"
199 |                 :campaigns="campaigns"
200 |                 :total-campaigns="totalCampaigns"
201 |                 :is-loading="isLoadingCampaigns"
202 |                 :current-page="campaignCurrentPage"
203 |                 :items-per-page="campaignItemsPerPage"
204 |                 @update:options="handleCampaignOptionsUpdate"
205 |                 @add-campaign="openCreateCampaignDialog"
206 |             />
207 |             <MediaplanBudgetView
208 |                 v-else-if="currentView === 'budget' && parentMediaplan"
209 |                 :mediaplan="parentMediaplan"
210 |             />
211 |             <div v-else-if="currentView === 'budget' && !parentMediaplan">
212 |               Loading budget data... </div>
213 | 
214 |             <v-alert v-if="errorCampaigns && currentView === 'planning'" type="error" density="compact" class="mt-4"
215 |                      closable>
216 |               Failed to load campaigns: {{ errorCampaigns }}
217 |             </v-alert>
218 |           </div>
219 |         </template>
220 |         <template v-else-if="!isLoadingProject && errorProject">
221 |           <div class="text-center my-10 text-disabled">
222 |             <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
223 |             <p>Could not load Project data.</p>
224 |           </div>
225 |         </template>
226 |       </template>
227 | 
228 |       <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
229 |         {{ snackbar.text }}
230 |         <template v-slot:actions>
231 |           <v-btn icon="mdi-close" @click="snackbar.show = false"></v-btn>
232 |         </template>
233 |       </v-snackbar>
234 |     </div>
235 |   </MainLayout>
236 | </template>
237 | 
238 | <style scoped>
239 | .project-detail {
240 |   padding-bottom: 20px;
241 | }
242 | 
243 | .main-content {
244 |   min-height: 60vh;
245 | }
246 | </style>
```

src/components/common/CountryFlag.vue
```
1 | <template>
2 |   <span :class="`fi fi-${country.toLowerCase()}`" :style="flagStyle"></span>
3 | </template>
4 | 
5 | <script setup lang="ts">
6 | import {computed} from 'vue';
7 | import 'flag-icons/css/flag-icons.min.css';
8 | 
9 | const props = defineProps<{
10 |   country: string;
11 |   size?: string;
12 | }>();
13 | 
14 | const flagStyle = computed(() => {
15 |   return {
16 |     fontSize: props.size || '1.5em',
17 |     lineHeight: 1,
18 |     verticalAlign: 'middle',
19 |     display: 'inline-block'
20 |   };
21 | });
22 | </script>
23 | 
24 | <style scoped>
25 | 
26 | 
27 | span[class^="fi"] {
28 | }
29 | 
30 | </style>
```

src/components/common/MediaplanTopSection.vue
```
1 | <template>
2 |   <!-- Wrapper with native tooltip showing the current level on hover -->
3 |   <div :title="levelDisplay">
4 |     <v-row class="mb-0">
5 |       <v-col cols="12" md="5" class="d-flex align-center pt-0 pb-0">
6 |         <MediaplanBreadcrumb :mediaplan="mediaplan" :project="project" />
7 |       </v-col>
8 |       <v-col cols="12" md="7">
9 |         <MediaplanHeader
10 |             :plan-budget="mediaplan?.budget?.total || 0"
11 |             :used-percentage="calculatePercentage(mediaplan?.budget?.used, mediaplan?.budget?.total)"
12 |             :search="search"
13 |             @update:search="val => emit('update:search', val)"
14 |             :is-loading="isLoading"
15 |         />
16 |       </v-col>
17 |     </v-row>
18 | 
19 |     <v-row class="mb-4">
20 |       <v-col cols="12" sm="auto">
21 |         <MediaplanViewToggle v-model="internalView" />
22 |       </v-col>
23 |       <v-col>
24 |         <slot name="campaign-type-select" />
25 |       </v-col>
26 |     </v-row>
27 | 
28 |   </div>
29 | </template>
30 | 
31 | <script setup lang="ts">
32 | import { toRefs, computed } from 'vue'
33 | import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue'
34 | import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue'
35 | import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue'
36 | import type { Mediaplan } from '@/types/mediaplan'
37 | import type { Project } from '@/types/project'
38 | import type { Campaign } from '@/types/campaign'
39 | 
40 | const props = defineProps<{
41 |   mediaplan: Mediaplan | null
42 |   project: Project | null
43 |   campaign?: Campaign | null
44 |   search: string
45 |   isLoading: boolean
46 |   currentView: 'planning' | 'budget'
47 | }>()
48 | 
49 | const emit = defineEmits<{
50 |   (e: 'update:search', value: string): void
51 |   (e: 'update:current-view', value: 'planning' | 'budget'): void
52 | }>()
53 | 
54 | const { mediaplan, project, campaign, search, isLoading, currentView } = toRefs(props)
55 | 
56 | // Internal binding for the view toggle
57 | const internalView = computed<'planning' | 'budget'>({
58 |   get: () => currentView.value,
59 |   set: val => emit('update:current-view', val),
60 | })
61 | 
62 | // Determine which level we’re in
63 | const levelDisplay = computed(() => {
64 |   if (campaign?.value) return 'Campaign'
65 |   if (project.value)    return 'Project'
66 |   return 'Mediaplan'
67 | })
68 | 
69 | function calculatePercentage(used: number | undefined, total: number | undefined): number {
70 |   if (!used || !total) return 0
71 |   return (used / total) * 100
72 | }
73 | </script>
74 | 
75 | <style scoped>
76 | /* Optional: eigene Styles hier hinzufügen */
77 | </style>
```

src/components/common/NotificationSnackbar.vue
```
1 | <template>
2 |   <v-snackbar
3 |     v-model="notification.show"
4 |     :color="notification.type"
5 |     :timeout="notification.timeout"
6 |     class="notification-snackbar"
7 |   >
8 |     <div class="d-flex align-center">
9 |       <v-icon :icon="getIconForType(notification.type)" class="mr-3" />
10 |       <span>{{ notification.text }}</span>
11 |     </div>
12 |     <template v-slot:actions v-if="notification.closable">
13 |       <v-btn
14 |         icon
15 |         variant="text"
16 |         @click="closeNotification"
17 |         size="small"
18 |       >
19 |         <v-icon>mdi-close</v-icon>
20 |       </v-btn>
21 |     </template>
22 |   </v-snackbar>
23 | </template>
24 | 
25 | <script setup lang="ts">
26 | import { notification, closeNotification, NotificationType } from '@/helpers/notificationUtils';
27 | 
28 | /**
29 |  * Gets the appropriate icon for the notification type
30 |  * @param type Notification type
31 |  * @returns Material Design Icon name
32 |  */
33 | const getIconForType = (type: NotificationType): string => {
34 |   switch (type) {
35 |     case NotificationType.SUCCESS:
36 |       return 'mdi-check-circle';
37 |     case NotificationType.ERROR:
38 |       return 'mdi-alert-circle';
39 |     case NotificationType.WARNING:
40 |       return 'mdi-alert';
41 |     case NotificationType.INFO:
42 |     default:
43 |       return 'mdi-information';
44 |   }
45 | };
46 | </script>
47 | 
48 | <style scoped>
49 | .notification-snackbar {
50 |   z-index: 9999;
51 | }
52 | </style>
```

src/components/common/PaginationControls.vue
```
1 | <template>
2 |   <div class="d-flex justify-center align-center my-4">
3 |     <v-pagination
4 |         v-model="modelValue"
5 |         :length="length"
6 |         :disabled="disabled"
7 |         :total-visible="totalVisible"
8 |         rounded="circle"
9 |         @update:model-value="updatePage"
10 |     />
11 | 
12 |     <div v-if="showItemsPerPage" class="ml-4 d-flex align-center">
13 |       <span class="text-caption mr-2">Items per page:</span>
14 |       <v-select
15 |           v-model="itemsPerPage"
16 |           :items="itemsPerPageOptions"
17 |           density="compact"
18 |           variant="outlined"
19 |           hide-details
20 |           class="items-per-page-select"
21 |           @update:model-value="updateItemsPerPage"
22 |       />
23 |     </div>
24 |   </div>
25 | </template>
26 | 
27 | <script setup lang="ts">
28 | import { computed, ref, watch } from 'vue';
29 | 
30 | interface Props {
31 |   modelValue: number;
32 |   length: number;
33 |   disabled?: boolean;
34 |   totalVisible?: number;
35 |   showItemsPerPage?: boolean;
36 |   itemsPerPageValue?: number;
37 |   itemsPerPageOptions?: number[];
38 | }
39 | 
40 | const props = withDefaults(defineProps<Props>(), {
41 |   disabled: false,
42 |   totalVisible: 7,
43 |   showItemsPerPage: true,
44 |   itemsPerPageValue: 10,
45 |   itemsPerPageOptions: () => [10, 25, 50, 100]
46 | });
47 | 
48 | const emit = defineEmits<{
49 |   (e: 'update:model-value', value: number): void;
50 |   (e: 'update:items-per-page', value: number): void;
51 | }>();
52 | 
53 | // Internal model value for v-pagination (needs to be 1-based)
54 | const modelValue = computed({
55 |   get: () => props.modelValue + 1, // Convert from 0-based to 1-based
56 |   set: (value: number) => {
57 |     emit('update:model-value', value - 1); // Convert from 1-based to 0-based
58 |   }
59 | });
60 | 
61 | // Items per page handling
62 | const itemsPerPage = ref(props.itemsPerPageValue);
63 | 
64 | // When props change, update the local state
65 | watch(() => props.itemsPerPageValue, (newValue) => {
66 |   itemsPerPage.value = newValue;
67 | });
68 | 
69 | const updatePage = (page: number) => {
70 |   emit('update:model-value', page - 1); // Convert from 1-based to 0-based
71 | };
72 | 
73 | const updateItemsPerPage = (value: number) => {
74 |   itemsPerPage.value = value;
75 |   emit('update:items-per-page', value);
76 | };
77 | </script>
78 | 
79 | <style scoped>
80 | .items-per-page-select {
81 |   width: 80px;
82 | }
83 | </style>
```

src/components/mediaplan/DeleteProjectDialog.vue
```
1 | <template>
2 |   <v-dialog v-model="internalValue" max-width="500" persistent>
3 |     <v-card>
4 |       <v-toolbar color="error" density="comfortable" dark>
5 |         <v-toolbar-title>Confirm Delete</v-toolbar-title>
6 |       </v-toolbar>
7 |       
8 |       <v-card-text class="pa-6">
9 |         <v-alert
10 |           v-if="error"
11 |           type="error"
12 |           variant="tonal"
13 |           class="mb-4"
14 |           closable
15 |         >
16 |           {{ error }}
17 |         </v-alert>
18 |         
19 |         <p class="text-body-1">
20 |           Are you sure you want to delete the project <strong>{{ project?.name }}</strong>?
21 |         </p>
22 |         <p class="text-body-2 mt-2 text-red">
23 |           This action cannot be undone.
24 |         </p>
25 |       </v-card-text>
26 |       
27 |       <v-card-actions class="pa-6 pt-0">
28 |         <v-spacer></v-spacer>
29 |         <v-btn 
30 |           variant="text" 
31 |           @click="closeDialog"
32 |           :disabled="isLoading"
33 |         >
34 |           Cancel
35 |         </v-btn>
36 |         <v-btn 
37 |           color="error" 
38 |           variant="flat"
39 |           :loading="isLoading"
40 |           @click="confirmDeletion"
41 |         >
42 |           Delete Project
43 |         </v-btn>
44 |       </v-card-actions>
45 |     </v-card>
46 |   </v-dialog>
47 | </template>
48 | 
49 | <script setup lang="ts">
50 | import { computed } from 'vue';
51 | import type { Project } from '@/types/project';
52 | 
53 | // Define props
54 | interface Props {
55 |   modelValue: boolean;
56 |   project: Project | null;
57 |   isLoading: boolean;
58 |   error: string | null;
59 | }
60 | 
61 | // Define emits
62 | const emit = defineEmits<{
63 |   (e: 'update:modelValue', value: boolean): void;
64 |   (e: 'confirm'): void;
65 |   (e: 'cancel'): void;
66 | }>();
67 | 
68 | // Computed property for v-model binding
69 | const internalValue = computed({
70 |   get: () => props.modelValue,
71 |   set: (value: boolean) => emit('update:modelValue', value)
72 | });
73 | 
74 | const closeDialog = () => {
75 |   emit('cancel');
76 | };
77 | 
78 | const confirmDeletion = () => {
79 |   emit('confirm');
80 | };
81 | 
82 | // Receive props with defaults
83 | const props = withDefaults(defineProps<Props>(), {
84 |   project: null,
85 |   error: null
86 | });
87 | </script>
```

src/components/mediaplan/MediaplanBreadcrumb.vue
```
1 | // src/components/mediaplan/MediaplanBreadcrumb.vue (Angepasst)
2 | 
3 | <script setup lang="ts">
4 | import {computed} from 'vue';
5 | import {useRouter} from 'vue-router';
6 | import type {Mediaplan} from '@/types/mediaplan'; // Pfad prüfen
7 | import type {Project} from '@/types/project';
8 | import {getBrandLogo} from "@/helpers/brandUtils.ts";   // Pfad prüfen
9 | const router = useRouter();
10 | 
11 | // --- Props ---
12 | // Akzeptiert jetzt optional ein ganzes Project-Objekt
13 | interface Props {
14 |   mediaplan?: Mediaplan | null;
15 |   project?: Project | null;     // NEU: Akzeptiert Project-Objekt statt nur Name
16 |   campaignName?: string;        // Bleibt vorerst als String
17 | }
18 | 
19 | // Define events
20 | const emit = defineEmits(['back']);
21 | 
22 | // Props mit Defaults
23 | const props = withDefaults(defineProps<Props>(), {
24 |   mediaplan: null,
25 |   project: null,
26 |   campaignName: '',
27 | });
28 | 
29 | // --- Computed Properties für die Anzeige ---
30 | const breadcrumbItems = computed(() => {
31 |   const items = [];
32 |   // Immer Home/Übersicht als Basis? Oder dynamisch? Hier als Beispiel statisch.
33 |   items.push({title: 'Mediaplans', to: '/', disabled: !props.mediaplan});
34 | 
35 |   if (props.mediaplan) {
36 |     items.push({
37 |       title: props.mediaplan.name || 'Mediaplan',
38 |       // Link nur aktiv, wenn wir tiefer sind (also wenn ein Projekt übergeben wurde)
39 |       to: props.project ? {name: 'MediaplanDetail', params: {id: props.mediaplan._id}} : undefined,
40 |       disabled: !props.project
41 |     });
42 | 
43 |     if (props.project) {
44 |       items.push({
45 |         title: props.project.abbreviation || props.project.descriptive_vars?.projectname || 'Project',
46 |         // Link nur aktiv, wenn wir tiefer sind (also wenn campaignName übergeben wurde)
47 |         to: props.campaignName ? {
48 |           name: 'ProjectDetail',
49 |           params: {mediaplanId: props.mediaplan._id, projectId: props.project._id}
50 |         } : undefined,
51 |         disabled: !props.campaignName
52 |       });
53 | 
54 |       if (props.campaignName) {
55 |         items.push({
56 |           title: props.campaignName,
57 |           // Kein Link für das letzte Element
58 |           disabled: true
59 |         });
60 |       }
61 |     }
62 |   }
63 |   return items;
64 | });
65 | 
66 | 
67 | // --- Methods ---
68 | const handleBack = () => {
69 |   emit('back'); // Event auslösen
70 |   // Gehe zur Mediaplan-Übersicht (oder eine Ebene höher, falls möglich/gewünscht)
71 |   router.push({name: 'Overview'}); // Gehe zur allgemeinen Übersicht
72 | };
73 | 
74 | </script>
75 | 
76 | <template>
77 |   <div class="d-flex align-center">
78 |     <v-btn
79 |         icon
80 |         variant="text"
81 |         size="small"
82 |         class="mr-1"
83 |         @click="handleBack"
84 |         aria-label="Go back to overview"
85 |     >
86 |       <v-icon> mdi-arrow-u-left-top
87 |       </v-icon>
88 |       <v-tooltip activator="parent" location="bottom">Back to Overview</v-tooltip>
89 |     </v-btn>
90 | 
91 |     <div class="breadcrumb-content d-flex align-center flex-wrap">
92 |       <div class="brand-logo mr-2 flex-shrink-0" v-if="mediaplan?.brand">
93 |         <v-img
94 |             :src="getBrandLogo(mediaplan.brand)"
95 |             :alt="mediaplan.brand.name || ''"
96 |             width="50"
97 |             height="25"
98 |             contain
99 |         ></v-img>
100 |       </div>
101 | 
102 |       <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
103 |         <template v-slot:title="{ item }">
104 |               <span :class="{ 'text-disabled': item.disabled }">
105 |                   {{ item.title }}
106 |               </span>
107 |         </template>
108 |       </v-breadcrumbs>
109 | 
110 |     </div>
111 |   </div>
112 | </template>
113 | 
114 | <style scoped>
115 | .breadcrumb-content {
116 |   min-height: 40px; /* Höhe beibehalten */
117 |   overflow: hidden; /* Verhindert Umbruchprobleme bei sehr langen Namen */
118 | }
119 | 
120 | .brand-logo {
121 |   display: flex;
122 |   align-items: center;
123 |   justify-content: center;
124 | }
125 | 
126 | /* Optional: Stelle sicher, dass Breadcrumbs nicht zu viel Platz einnehmen */
127 | .v-breadcrumbs {
128 |   flex-grow: 1;
129 |   /* white-space: nowrap; */ /* Verhindert Umbruch, ggf. mit text-overflow */
130 | }
131 | 
132 | .v-breadcrumbs :deep(.v-breadcrumbs-item) {
133 |   font-size: 0.86rem; /* Etwas kleinere Schrift */
134 | }
135 | 
136 | .text-disabled {
137 |   color: #757575 !important; /* Vuetify Standard für disabled */
138 | }
139 | </style>
```

src/components/mediaplan/MediaplanBudgetView.vue
```
1 | <template>
2 |   <div class="budget-view-container">
3 |     <v-card class="pa-6">
4 |       <v-card-title class="text-h5 mb-4">Budget View</v-card-title>
5 |       <v-card-text>
6 |         <p class="text-body-1">
7 |           This is a placeholder for the Budget View. This section will be implemented later.
8 |         </p>
9 |         <v-divider class="my-4"></v-divider>
10 |         <p class="text-body-2 text-grey">
11 |           The Budget View will allow users to manage financial aspects of campaigns, track spending, and allocate resources.
12 |         </p>
13 |       </v-card-text>
14 |     </v-card>
15 |   </div>
16 | </template>
17 | 
18 | <script setup lang="ts">
19 | // No props or state needed for this placeholder component
20 | </script>
21 | 
22 | <style scoped>
23 | .budget-view-container {
24 |   margin-top: 16px;
25 | }
26 | </style>
```

src/components/mediaplan/MediaplanHeader.vue
```
1 | <template>
2 |   <v-row align="center" style="height: 57px;">
3 |     <div class="d-flex align-center border-b border-grey-lighten-2 mr-2 h-100">
4 |       <div class="text-subtitle-1 text-grey-darken-1 mr-4">Plan Budget:</div>
5 |       <div class="text-subtitle-1 text-grey-darken-1 mr-4">{{ formatCurrency(planBudget) }}</div>
6 | 
7 |       <div class="text-subtitle-1 text-grey-darken-1 mr-4">Used:</div>
8 |       <v-progress-linear
9 |           :model-value="usedPercentage"
10 |           color="success"
11 |           height="8"
12 |           class="ml-2 mr-4"
13 |           style="width: 120px"
14 |       ></v-progress-linear>
15 |       <span class="text-subtitle-1 text-grey-darken-1">{{ usedPercentage }}%</span>
16 |     </div>
17 | 
18 |     <v-text-field
19 |         v-model="search"
20 |         placeholder="Search..."
21 |         hide-details
22 |         class="mr-2"
23 |         append-inner-icon="mdi-magnify"
24 |         @update:modelValue="$emit('update:search', $event)"
25 |         bg-color="white"
26 |     ></v-text-field>
27 |     <v-btn icon="mdi-dots-horizontal" variant="plain">
28 |     </v-btn>
29 | 
30 |   </v-row>
31 | </template>
32 | 
33 | <script setup lang="ts">
34 | import {ref, watch} from 'vue';
35 | 
36 | // Define props
37 | interface Props {
38 |   planBudget: number;
39 |   usedPercentage: number;
40 |   search: string;
41 | }
42 | 
43 | // Define events
44 | defineEmits([
45 |   'update:search'
46 | ]);
47 | 
48 | // Receive props with defaults
49 | const props = withDefaults(defineProps<Props>(), {
50 |   planBudget: 0,
51 |   usedPercentage: 0,
52 |   search: ''
53 | });
54 | 
55 | // Local state
56 | const search = ref(props.search);
57 | 
58 | // Watch for prop changes
59 | watch(() => props.search, (newValue) => {
60 |   search.value = newValue;
61 | });
62 | 
63 | // Format currency
64 | const formatCurrency = (value: number): string => {
65 |   return new Intl.NumberFormat('en-US', {
66 |     style: 'currency',
67 |     currency: 'EUR',
68 |     minimumFractionDigits: 0,
69 |     maximumFractionDigits: 0
70 |   }).format(value);
71 | };
72 | </script>
73 | 
```

src/components/mediaplan/MediaplanInfo.vue
```
1 | <template>
2 |   <v-card class="mb-4">
3 |     <v-card-title class="d-flex align-center justify-space-between py-4 px-6">
4 |       <div class="d-flex align-center">
5 |         <div class="text-h5">{{ mediaplan?.name || 'Mediaplan Details' }}</div>
6 |         <v-chip
7 |           :color="getMediaplanStatusColor(mediaplan?.status)"
8 |           class="ml-4"
9 |           size="small"
10 |           variant="elevated"
11 |         >
12 |           {{ getMediaplanStatusLabel(mediaplan?.status) }}
13 |         </v-chip>
14 |       </div>
15 |       
16 |       <v-btn 
17 |         color="primary" 
18 |         variant="flat" 
19 |         prepend-icon="mdi-pencil"
20 |         :to="`/mediaplans/${mediaplanId}/edit`"
21 |       >
22 |         Edit
23 |       </v-btn>
24 |     </v-card-title>
25 |     
26 |     <v-divider></v-divider>
27 |     
28 |     <v-card-text v-if="mediaplan" class="pa-6">
29 |       <v-row>
30 |         <v-col cols="12" md="4">
31 |           <div class="text-subtitle-2 text-grey-darken-1 mb-1">Brand</div>
32 |           <div class="d-flex align-center">
33 |             <v-avatar size="32" color="grey-lighten-3" class="mr-2">
34 |               <v-img v-if="hasBrandLogo(mediaplan.brand)" :src="getBrandLogo(mediaplan.brand)"></v-img>
35 |               <span v-else>{{ getBrandInitials(mediaplan.brand) }}</span>
36 |             </v-avatar>
37 |             <span class="font-weight-medium">{{ mediaplan.brand.name }}</span>
38 |           </div>
39 |         </v-col>
40 |         
41 |         <v-col cols="12" md="4">
42 |           <div class="text-subtitle-2 text-grey-darken-1 mb-1">Campaign Period</div>
43 |           <div class="font-weight-medium">{{ formatDateRange(mediaplan.start_date, mediaplan.end_date) }}</div>
44 |         </v-col>
45 |         
46 |         <v-col cols="12" md="4">
47 |           <div class="text-subtitle-2 text-grey-darken-1 mb-1">Budget</div>
48 |           <div class="d-flex align-center justify-space-between mb-1">
49 |             <span class="font-weight-medium">{{ formatCurrency(mediaplan.budget.used) }} / {{ formatCurrency(mediaplan.budget.total) }}</span>
50 |             <span class="text-body-2">{{ calculatePercentage(mediaplan.budget.used, mediaplan.budget.total) }}%</span>
51 |           </div>
52 |           <v-progress-linear 
53 |             :model-value="calculatePercentage(mediaplan.budget.used, mediaplan.budget.total)" 
54 |             height="8" 
55 |             :color="getBudgetStatusColor(mediaplan.budget)" 
56 |             rounded
57 |             bg-color="grey-lighten-3"
58 |           ></v-progress-linear>
59 |         </v-col>
60 |       </v-row>
61 |       
62 |       <v-row class="mt-6">
63 |         <v-col cols="12" md="4">
64 |           <div class="text-subtitle-2 text-grey-darken-1 mb-1">PO Numbers</div>
65 |           <div v-if="mediaplan.po_numbers && mediaplan.po_numbers.length > 0">
66 |             <v-chip
67 |               v-for="po in mediaplan.po_numbers"
68 |               :key="po._id"
69 |               class="mr-2 mb-2"
70 |               variant="outlined"
71 |               size="small"
72 |             >
73 |               {{ po.name }}: {{ formatCurrency(po.value) }}
74 |             </v-chip>
75 |           </div>
76 |           <div v-else class="text-body-2 text-grey">No PO numbers added</div>
77 |         </v-col>
78 |         
79 |         <v-col cols="12" md="4">
80 |           <div class="text-subtitle-2 text-grey-darken-1 mb-1">Created By</div>
81 |           <div class="font-weight-medium">{{ mediaplan.created_by?.name || 'Unknown' }}</div>
82 |         </v-col>
83 |         
84 |         <v-col cols="12" md="4">
85 |           <div class="text-subtitle-2 text-grey-darken-1 mb-1">Last Updated</div>
86 |           <div class="font-weight-medium">{{ formatDate(mediaplan.updated_at) }}</div>
87 |         </v-col>
88 |       </v-row>
89 |     </v-card-text>
90 |     
91 |     <div v-if="isLoading" class="d-flex justify-center align-center my-6">
92 |       <v-progress-circular indeterminate color="primary"></v-progress-circular>
93 |     </div>
94 |     
95 |     <div v-if="error" class="error-container mx-6 my-4 pa-4">
96 |       <v-alert type="error" title="Error Loading Mediaplan">
97 |         {{ error }}
98 |       </v-alert>
99 |     </div>
100 |   </v-card>
101 | </template>
102 | 
103 | <script setup lang="ts">
104 | import { formatDate, formatDateRange } from '@/helpers/dateUtils';
105 | import { formatCurrency, calculatePercentage, getBudgetStatusColor } from '@/helpers/currencyUtils';
106 | import { getBrandLogo, getBrandInitials, hasBrandLogo } from '@/helpers/brandUtils';
107 | import { getMediaplanStatusColor, getMediaplanStatusLabel } from '@/constants/mediaplanStatuses';
108 | import type { Mediaplan } from '@/types/mediaplan';
109 | 
110 | // Define props
111 | interface Props {
112 |   mediaplan: Mediaplan | null;
113 |   mediaplanId: string;
114 |   isLoading: boolean;
115 |   error: string | null;
116 | }
117 | 
118 | // Receive props
119 | const props = defineProps<Props>();
120 | </script>
121 | 
122 | <style scoped>
123 | .error-container {
124 |   border-radius: 4px;
125 |   background-color: rgba(var(--v-theme-error), 0.1);
126 | }
127 | </style>
```

src/components/mediaplan/MediaplanPlanningView.vue
```
1 | <script setup lang="ts">
2 | import { ref, watch, computed } from 'vue';
3 | import { useRouter } from 'vue-router'; // Router importieren für Links
4 | import CountryFlag from '@/components/common/CountryFlag.vue'; // Pfad prüfen
5 | import { getBrandLogo } from "@/helpers/brandUtils"; // Pfad prüfen
6 | import type { Project } from '@/types/project'; // Pfad prüfen
7 | 
8 | // --- Props ---
9 | interface Props {
10 |   projects: Project[];
11 |   totalProjects: number;
12 |   isLoading: boolean;
13 |   currentPage: number;
14 |   itemsPerPage: number;
15 |   mediaplanId: string; // *** Diese Prop ist entscheidend für den Link ***
16 | }
17 | 
18 | const props = withDefaults(defineProps<Props>(), {
19 |   projects: () => [],
20 |   totalProjects: 0,
21 |   isLoading: false,
22 |   currentPage: 0,
23 |   itemsPerPage: 10,
24 |   mediaplanId: '' // Wichtig: Muss vom Parent (MediaplanDetail) übergeben werden!
25 | });
26 | 
27 | // --- Emits ---
28 | const emit = defineEmits<{
29 |   (e: 'addProject'): void;
30 |   (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
31 | }>();
32 | 
33 | // Router Instanz
34 | const router = useRouter();
35 | 
36 | // --- Computed Properties für Tabelle ---
37 | const pageModel = computed({
38 |   get: () => props.currentPage + 1,
39 |   set: (value) => {}
40 | });
41 | 
42 | const itemsPerPageModel = computed({
43 |   get: () => props.itemsPerPage,
44 |   set: (value) => {}
45 | });
46 | 
47 | // --- Tabellen-Header ---
48 | const headers = [
49 |   { title: '', key: 'edit', sortable: false, width: '50px' },
50 |   { title: 'Name', key: 'abbreviation', sortable: true, align: 'start' },
51 |   { title: 'Country', key: 'descriptive_vars.country', sortable: true },
52 |   { title: 'Duration', key: 'duration.formatted', sortable: false },
53 |   { title: 'Detail', key: 'detail', sortable: true },
54 |   { title: 'Campaign Type', key: 'default_vars.campaigntype', sortable: true },
55 |   { title: 'Subsegment', key: 'default_vars.subsegment', sortable: true },
56 |   { title: 'Locked', key: 'is_locked', sortable: true, align: 'center' },
57 |   { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '50px' }
58 | ];
59 | 
60 | // --- Methoden ---
61 | const onOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
62 |   emit('update:options', options);
63 | };
64 | 
65 | const addProject = () => {
66 |   emit('addProject');
67 | };
68 | 
69 | const editProject = (project: Project) => {
70 |   console.log('Edit project:', project._id);
71 |   // Navigation zur Edit-Seite oder Dialog öffnen
72 |   // router.push({ name: 'ProjectEdit', params: { mediaplanId: props.mediaplanId, projectId: project._id } });
73 | };
74 | 
75 | </script>
76 | 
77 | <template>
78 |   <div class="planning-view-container mt-4">
79 |     <v-card class="projects-table elevation-0" variant="flat">
80 |       <v-theme-provider theme="dark">
81 |         <v-data-table-server
82 |             v-model:items-per-page="itemsPerPageModel"
83 |             v-model:page="pageModel"
84 |             :headers="headers"
85 |             :items="projects"
86 |             :items-length="totalProjects"
87 |             :loading="isLoading"
88 |             item-value="_id"
89 |             hover
90 |             class="projects-data-table"
91 |             @update:options="onOptionsUpdate"
92 | 
93 |         >
94 |           <template v-slot:item.edit="{ item }">
95 |             <v-btn icon density="comfortable" variant="text" color="grey" @click.stop="editProject(item)">
96 |               <v-icon>mdi-pencil</v-icon>
97 |               <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
98 |             </v-btn>
99 |           </template>
100 | 
101 |           <template v-slot:item.abbreviation="{ item }">
102 |             <router-link
103 |                 :to="{ name: 'ProjectDetail', params: { mediaplanId: props.mediaplanId, projectId: item._id } }"
104 |                 class="project-link d-flex align-center"
105 |                 v-if="item.abbreviation && props.mediaplanId"
106 |                 @click.stop
107 |             >
108 |               <v-avatar size="32" class="mr-2 grey lighten-4"
109 |                         :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
110 |               <span>{{ item.abbreviation }}</span>
111 |             </router-link>
112 |             <div class="d-flex align-center" v-else-if="item.abbreviation">
113 |               <v-avatar size="32" class="mr-2 grey lighten-4"
114 |                         :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
115 |               <span>{{ item.abbreviation }}</span>
116 |               <v-tooltip activator="parent" location="top">Cannot link project (missing Mediaplan ID)</v-tooltip>
117 |             </div>
118 |             <div v-else>N/A</div>
119 |           </template>
120 | 
121 |           <template v-slot:item.descriptive_vars.country="{ item }">
122 |             <div class="d-flex align-center" v-if="item.descriptive_vars?.country">
123 |               <CountryFlag size="1rem" :country="item.descriptive_vars.country" class="mr-2"/>
124 |               <span>{{ item.descriptive_vars.country }}</span>
125 |             </div>
126 |             <div v-else>N/A</div>
127 |           </template>
128 | 
129 |           <template v-slot:item.duration.formatted="{ item }">
130 |             <div class="d-flex align-center" v-if="item.duration?.formatted">
131 |               <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
132 |               <span>{{ item.duration.formatted }}</span>
133 |             </div>
134 |             <div v-else>N/A</div>
135 |           </template>
136 | 
137 |           <template v-slot:item.detail="{ item }">
138 |             <span class="d-inline-block text-truncate" style="max-width: 150px;">{{ item.detail || 'N/A' }}</span>
139 |             <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top" max-width="300px">{{ item.detail }}</v-tooltip>
140 |           </template>
141 | 
142 |           <template v-slot:item.default_vars.campaigntype="{ item }">
143 |             {{ item.default_vars?.campaigntype || 'N/A' }}
144 |           </template>
145 | 
146 |           <template v-slot:item.default_vars.subsegment="{ item }">
147 |             {{ item.default_vars?.subsegment || 'N/A' }}
148 |           </template>
149 | 
150 |           <template v-slot:item.is_locked="{ item }">
151 |             <v-icon v-if="item.is_locked != null" :color="item.is_locked ? 'orange' : 'grey-lighten-1'">
152 |               {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
153 |             </v-icon>
154 |             <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
155 |           </template>
156 | 
157 |           <template v-slot:item.actions="{ item }">
158 |             <v-menu>
159 |               <template v-slot:activator="{ props: menuProps }">
160 |                 <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
161 |               </template>
162 |               <v-list density="compact">
163 |                 <v-list-item @click.stop="editProject(item)">
164 |                   <v-list-item-title>Edit</v-list-item-title>
165 |                 </v-list-item>
166 |                 <v-list-item @click.stop="() => console.log('Delete Project:', item._id)" class="text-error">
167 |                   <v-list-item-title>Delete</v-list-item-title>
168 |                 </v-list-item>
169 |               </v-list>
170 |             </v-menu>
171 |           </template>
172 | 
173 |           <template v-slot:loading>
174 |             <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
175 |           </template>
176 |           <template v-slot:no-data>
177 |             <div class="text-center pa-4 text-disabled">
178 |               <v-icon size="large" class="mb-2">mdi-database-off-outline</v-icon>
179 |               <p>No projects found for this mediaplan.</p>
180 |             </div>
181 |           </template>
182 | 
183 |           <template v-slot:bottom>
184 |             <div class="d-flex align-center pa-4 bg-grey-lighten-2">
185 |               <v-btn
186 |                   prepend-icon="mdi-plus"
187 |                   class="black-text-button"
188 |                   variant="text"
189 |                   color="black"
190 |                   @click="addProject"
191 |                   :disabled="isLoading"
192 |               >
193 |                 Add Project
194 |               </v-btn>
195 |             </div>
196 |           </template>
197 |         </v-data-table-server>
198 |       </v-theme-provider>
199 |     </v-card>
200 |   </div>
201 | 
202 | </template>
203 | 
204 | <style scoped>
205 | /* ... (Styles bleiben) ... */
206 | .project-link {
207 |   color: white; /* Oder eine andere passende Farbe im Dark Theme */
208 |   text-decoration: none;
209 |   font-weight: 500;
210 | }
211 | .project-link:hover {
212 |   text-decoration: underline;
213 |   color: #E0E0E0; /* Leichte Aufhellung beim Hover */
214 | }
215 | </style>
```

src/components/mediaplan/MediaplanProjects.vue
```
1 | <template>
2 |   <v-card>
3 |     <v-toolbar flat color="primary" density="comfortable">
4 |       <v-toolbar-title>Projects</v-toolbar-title>
5 |       <v-spacer></v-spacer>
6 |       <v-btn 
7 |         variant="outlined" 
8 |         prepend-icon="mdi-plus" 
9 |         @click="$emit('createProject')"
10 |         :disabled="isLoading"
11 |         color="white"
12 |       >
13 |         Add Project
14 |       </v-btn>
15 |     </v-toolbar>
16 |     
17 |     <div v-if="isLoading" class="d-flex justify-center align-center my-6">
18 |       <v-progress-circular indeterminate color="primary"></v-progress-circular>
19 |     </div>
20 |     
21 |     <div v-else-if="error" class="error-container mx-6 my-4 pa-4">
22 |       <v-alert type="error" title="Error Loading Projects">
23 |         {{ error }}
24 |       </v-alert>
25 |     </div>
26 |     
27 |     <v-data-table-server
28 |       v-else
29 |       v-model:items-per-page="itemsPerPage"
30 |       v-model:page="page"
31 |       :headers="projectHeaders"
32 |       :items="projects"
33 |       :items-length="totalProjects"
34 |       :loading="isLoading"
35 |       class="elevation-0"
36 |       @update:options="onOptionsUpdate"
37 |     >
38 |       <!-- Country column with flag -->
39 |       <template v-slot:item.country="{ item }">
40 |         <div class="d-flex align-center">
41 |           <v-avatar size="24" class="mr-2">
42 |             <v-img :src="`/flags/${item.raw.country.code.toLowerCase()}.svg`"></v-img>
43 |           </v-avatar>
44 |           <span>{{ item.raw.country.name }} ({{ item.raw.country.code }})</span>
45 |         </div>
46 |       </template>
47 |       
48 |       <!-- Campaign Type column -->
49 |       <template v-slot:item.campaignType="{ item }">
50 |         <v-chip
51 |           size="small"
52 |           :color="getCampaignTypeColor(item.raw.campaignType)"
53 |           class="text-capitalize"
54 |         >
55 |           {{ item.raw.campaignType }}
56 |         </v-chip>
57 |       </template>
58 |       
59 |       <!-- Created date column -->
60 |       <template v-slot:item.createdAt="{ item }">
61 |         {{ formatDate(item.raw.createdAt) }}
62 |       </template>
63 |       
64 |       <!-- Actions column -->
65 |       <template v-slot:item.actions="{ item }">
66 |         <v-tooltip text="View Details">
67 |           <template v-slot:activator="{ props }">
68 |             <v-btn
69 |               icon
70 |               variant="text"
71 |               density="comfortable"
72 |               v-bind="props"
73 |               :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}`"
74 |             >
75 |               <v-icon>mdi-eye</v-icon>
76 |             </v-btn>
77 |           </template>
78 |         </v-tooltip>
79 |         
80 |         <v-tooltip text="Edit Project">
81 |           <template v-slot:activator="{ props }">
82 |             <v-btn
83 |               icon
84 |               variant="text"
85 |               density="comfortable"
86 |               v-bind="props"
87 |               :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}/edit`"
88 |             >
89 |               <v-icon>mdi-pencil</v-icon>
90 |             </v-btn>
91 |           </template>
92 |         </v-tooltip>
93 |         
94 |         <v-tooltip text="Delete Project">
95 |           <template v-slot:activator="{ props }">
96 |             <v-btn
97 |               icon
98 |               variant="text"
99 |               density="comfortable"
100 |               color="error"
101 |               v-bind="props"
102 |               @click="$emit('deleteProject', item.raw)"
103 |             >
104 |               <v-icon>mdi-delete</v-icon>
105 |             </v-btn>
106 |           </template>
107 |         </v-tooltip>
108 |       </template>
109 |       
110 |       <!-- Empty state -->
111 |       <template v-slot:no-data>
112 |         <v-sheet class="d-flex flex-column align-center justify-center pa-6" height="300">
113 |           <v-icon icon="mdi-folder-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
114 |           <div class="text-h6 text-grey-darken-1">No Projects Found</div>
115 |           <div class="text-body-2 text-grey mb-4">This mediaplan doesn't have any projects yet.</div>
116 |           <v-btn color="primary" prepend-icon="mdi-plus" @click="$emit('createProject')">
117 |             Add First Project
118 |           </v-btn>
119 |         </v-sheet>
120 |       </template>
121 |     </v-data-table-server>
122 |   </v-card>
123 | </template>
124 | 
125 | <script setup lang="ts">
126 | import { ref, watch } from 'vue';
127 | import { formatDate } from '@/helpers/dateUtils';
128 | import { getCampaignTypeColor } from '@/helpers/campaignTypeUtils';
129 | import type { Project } from '@/types/project';
130 | 
131 | // Define props
132 | interface Props {
133 |   projects: Project[];
134 |   mediaplanId: string;
135 |   totalProjects: number;
136 |   isLoading: boolean;
137 |   error: string | null;
138 | }
139 | 
140 | // Define emits
141 | const emit = defineEmits<{
142 |   (e: 'createProject'): void;
143 |   (e: 'deleteProject', project: Project): void;
144 |   (e: 'update:page', page: number): void;
145 |   (e: 'update:itemsPerPage', itemsPerPage: number): void;
146 | }>();
147 | 
148 | // Component state
149 | const page = ref<number>(1);
150 | const itemsPerPage = ref<number>(10);
151 | 
152 | // Watch for pagination changes
153 | watch([page, itemsPerPage], () => {
154 |   emit('update:page', page.value);
155 |   emit('update:itemsPerPage', itemsPerPage.value);
156 | });
157 | 
158 | // Project Table Headers
159 | const projectHeaders = [
160 |   { title: 'Name', key: 'name', sortable: true },
161 |   { title: 'Country', key: 'country', sortable: true },
162 |   { title: 'Language', key: 'language', sortable: true },
163 |   { title: 'Campaign Type', key: 'campaignType', sortable: true },
164 |   { title: 'Phase', key: 'phase', sortable: true },
165 |   { title: 'Goal', key: 'goal', sortable: true },
166 |   { title: 'Created At', key: 'createdAt', sortable: true },
167 |   { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
168 | ];
169 | 
170 | // Method to handle datatable option updates (sorting, etc)
171 | const onOptionsUpdate = (options: any) => {
172 |   // You can add additional logic here for sorting if needed
173 |   // For now, we just update pagination
174 |   page.value = options.page;
175 |   itemsPerPage.value = options.itemsPerPage;
176 | };
177 | 
178 | // Receive props with defaults
179 | const props = withDefaults(defineProps<Props>(), {
180 |   projects: () => [],
181 |   totalProjects: 0,
182 |   error: null
183 | });
184 | </script>
185 | 
186 | <style scoped>
187 | .error-container {
188 |   border-radius: 4px;
189 |   background-color: rgba(var(--v-theme-error), 0.1);
190 | }
191 | </style>
```

src/components/mediaplan/MediaplanViewToggle.vue
```
1 | <template>
2 |   <div class="view-toggle-container">
3 |     <v-btn-toggle
4 |         v-model="selectedView"
5 |         class="view-toggle"
6 |         density="comfortable"
7 |         @update:modelValue="$emit('update:modelValue', $event)"
8 |     >
9 |       <v-btn value="planning">Planning view</v-btn>
10 |       <v-btn value="budget">Budget view</v-btn>
11 |     </v-btn-toggle>
12 |   </div>
13 | </template>
14 | 
15 | <script setup lang="ts">
16 | import { ref, watch } from 'vue'
17 | 
18 | // Define props
19 | interface Props {
20 |   modelValue: string
21 | }
22 | 
23 | defineEmits(['update:modelValue'])
24 | const props = defineProps<Props>()
25 | 
26 | const selectedView = ref(props.modelValue)
27 | 
28 | watch(
29 |     () => props.modelValue,
30 |     (newValue) => {
31 |       selectedView.value = newValue
32 |     },
33 |     { immediate: true }
34 | )
35 | </script>
36 | 
37 | <style scoped>
38 | .view-toggle .v-btn {
39 |   background-color: white;
40 |   color: black;
41 |   border: 1px solid #ccc;
42 |   border-radius: 0;
43 |   font-weight: 500;
44 | }
45 | 
46 | .view-toggle .v-btn.v-btn--active {
47 |   background-color: black;
48 |   color: white;
49 |   border-color: black;
50 | }
51 | </style>
```

src/components/mediaplan/ProjectsList.vue
```
1 | <template>
2 |   <v-card>
3 |     <v-card-title class="d-flex justify-space-between align-center py-4 px-6">
4 |       <div class="text-h6">Projects</div>
5 |       <v-btn 
6 |         color="primary" 
7 |         prepend-icon="mdi-plus" 
8 |         @click="emit('createProject')"
9 |       >
10 |         Add Project
11 |       </v-btn>
12 |     </v-card-title>
13 |     
14 |     <v-divider></v-divider>
15 |     
16 |     <div v-if="isLoading" class="d-flex justify-center align-center my-6">
17 |       <v-progress-circular indeterminate color="primary"></v-progress-circular>
18 |     </div>
19 |     
20 |     <div v-else-if="error" class="error-container mx-6 my-4 pa-4">
21 |       <v-alert type="error" title="Error Loading Projects">
22 |         {{ error }}
23 |       </v-alert>
24 |     </div>
25 |     
26 |     <v-data-table-server
27 |       v-else
28 |       v-model:items-per-page="itemsPerPage"
29 |       v-model:page="page"
30 |       :headers="projectHeaders"
31 |       :items="projects"
32 |       :items-length="totalItems"
33 |       :loading="isLoading"
34 |       class="elevation-0"
35 |       @update:options="onOptionsUpdate"
36 |     >
37 |       <!-- Country column with flag -->
38 |       <template v-slot:item.country="{ item }">
39 |         <div class="d-flex align-center">
40 |           <v-avatar size="24" class="mr-2">
41 |             <v-img :src="`/flags/${item.raw.country.code.toLowerCase()}.svg`"></v-img>
42 |           </v-avatar>
43 |           <span>{{ item.raw.country.name }} ({{ item.raw.country.code }})</span>
44 |         </div>
45 |       </template>
46 |       
47 |       <!-- Campaign Type column -->
48 |       <template v-slot:item.campaignType="{ item }">
49 |         <v-chip
50 |           size="small"
51 |           :color="getCampaignTypeColor(item.raw.campaignType)"
52 |           class="text-capitalize"
53 |         >
54 |           {{ item.raw.campaignType }}
55 |         </v-chip>
56 |       </template>
57 |       
58 |       <!-- Created date column -->
59 |       <template v-slot:item.createdAt="{ item }">
60 |         {{ formatDate(item.raw.createdAt) }}
61 |       </template>
62 |       
63 |       <!-- Actions column -->
64 |       <template v-slot:item.actions="{ item }">
65 |         <v-btn
66 |           icon
67 |           variant="text"
68 |           density="comfortable"
69 |           :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}`"
70 |         >
71 |           <v-icon>mdi-eye</v-icon>
72 |         </v-btn>
73 |         <v-btn
74 |           icon
75 |           variant="text"
76 |           density="comfortable"
77 |           :to="`/mediaplans/${mediaplanId}/projects/${item.raw._id}/edit`"
78 |         >
79 |           <v-icon>mdi-pencil</v-icon>
80 |         </v-btn>
81 |         <v-btn
82 |           icon
83 |           variant="text"
84 |           density="comfortable"
85 |           color="error"
86 |           @click="emit('deleteProject', item.raw)"
87 |         >
88 |           <v-icon>mdi-delete</v-icon>
89 |         </v-btn>
90 |       </template>
91 |       
92 |       <!-- Empty state -->
93 |       <template v-slot:no-data>
94 |         <div class="d-flex flex-column align-center justify-center pa-6">
95 |           <v-icon icon="mdi-folder-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
96 |           <div class="text-h6 text-grey-darken-1">No Projects Found</div>
97 |           <div class="text-body-2 text-grey mb-4">This mediaplan doesn't have any projects yet.</div>
98 |           <v-btn color="primary" prepend-icon="mdi-plus" @click="emit('createProject')">
99 |             Add First Project
100 |           </v-btn>
101 |         </div>
102 |       </template>
103 |     </v-data-table-server>
104 |   </v-card>
105 | </template>
106 | 
107 | <script setup lang="ts">
108 | import { ref, watch } from 'vue';
109 | import { formatDate } from '@/helpers/dateUtils';
110 | import { getCampaignTypeColor } from '@/helpers/campaignTypeUtils';
111 | import type { Project } from '@/types/project';
112 | 
113 | // Define props
114 | interface Props {
115 |   projects: Project[];
116 |   mediaplanId: string;
117 |   totalItems: number;
118 |   isLoading: boolean;
119 |   error: string | null;
120 | }
121 | 
122 | // Define emits
123 | const emit = defineEmits<{
124 |   (e: 'createProject'): void;
125 |   (e: 'deleteProject', project: Project): void;
126 |   (e: 'updatePage', page: number): void;
127 |   (e: 'updateItemsPerPage', itemsPerPage: number): void;
128 | }>();
129 | 
130 | //
```

src/components/overview/CreateFirstProjectDialog.vue
```
1 | <template>
2 |   <v-dialog :model-value="modelValue" @update:model-value="handleClose" persistent max-width="550px">
3 |     <v-card class="px-6 pa-4">
4 |       <DialogHeader
5 |           title="Create new Mediaplan"
6 |           :show-back-button="true"
7 |           :show-close-button="true"
8 |           margin-bottom="4"
9 |           @back="cancelDialog"
10 |           @close="cancelDialog"
11 |       />
12 | 
13 |       <v-card-text class="pa-0 mb-4">
14 |         <v-row class="align-center mb-3 pl-2">
15 |           <v-img :src="getBrandLogo(brand)" class="mr-2" width="40" max-width="40"></v-img>
16 |           <span class="text-h6 font-weight-regular">{{ brandName }} </span>
17 |         </v-row>
18 |       </v-card-text>
19 |       <v-card-text class="pa-0">
20 |         <v-row no-gutters class="pb-3 align-center">
21 |           <v-col cols="3" class="text-body-2 text-medium-emphasis">Name:</v-col>
22 |           <v-col class="text-body-2 text-right">{{ mediaplanName || '-' }}</v-col>
23 |         </v-row>
24 |         <v-row no-gutters class="pb-3 align-center">
25 |           <v-col cols="3" class="text-body-2 text-medium-emphasis">PO:</v-col>
26 |           <v-col class="text-body-2 text-right">{{ poNumbersDisplay }}</v-col>
27 |         </v-row>
28 |         <v-row no-gutters class="pb-0 align-start">
29 |           <v-col cols="3" class="text-body-2 text-medium-emphasis">Duration:</v-col>
30 |           <v-col class="text-body-2 text-right">
31 |             Start: {{ formatDate(startDateValue) }}<br>
32 |             End: {{ formatDate(endDateValue) }}
33 |           </v-col>
34 |         </v-row>
35 |       </v-card-text>
36 |       <v-divider class="mt-4 mb-5"></v-divider>
37 | 
38 |       <v-form ref="form" @submit.prevent="submitForm" v-model="isFormValid" validate-on="input"
39 |               :disabled="isSubmitting">
40 |         <WithFormDefaults>
41 |           <v-card-text class="pa-0">
42 | 
43 |             <v-row>
44 |               <v-col cols="12">
45 |                 <h6 class="text-h6 font-weight-regular mb-0">Add first project</h6>
46 |               </v-col>
47 |             </v-row>
48 | 
49 |             <v-row>
50 |               <v-col cols="12" md="6">
51 |                 <div class="text-caption text-medium-emphasis">Country *</div>
52 |                 <v-select
53 |                     v-model="selectedCountry"
54 |                     :items="countries"
55 |                     item-title="name"
56 |                     item-value="code"
57 |                     :rules="[v => !!v || 'Country is required']"
58 |                     return-object
59 |                     :loading="!projectStore.countries.length"
60 |                     placeholder="Select Country"
61 |                 >
62 |                   <template v-slot:selection="{ item }">
63 |                     <div class="d-flex align-center">
64 |                       <country-flag :country="item.raw.code" class="mr-2"/>
65 |                       {{ item.raw.code }} - {{ item.raw.name }}
66 |                     </div>
67 |                   </template>
68 |                   <template v-slot:item="{ item, props }">
69 |                     <v-list-item v-bind="props" :title="`${item.raw.code} - ${item.raw.name}`">
70 |                       <template v-slot:prepend>
71 |                         <country-flag :country="item.raw.code" class="mr-2"/>
72 |                       </template>
73 |                     </v-list-item>
74 |                   </template>
75 |                 </v-select>
76 |               </v-col>
77 |               <v-col cols="12" md="6">
78 |                 <div class="text-caption text-medium-emphasis mb-0">Language *</div>
79 |                 <v-select
80 |                     v-model="selectedLanguage"
81 |                     :items="availableLanguages"
82 |                     item-title="name"
83 |                     item-value="code"
84 |                     :disabled="!selectedCountry || availableLanguages.length === 0"
85 |                     :rules="[v => !!v || 'Language is required']"
86 |                     placeholder="Select Language"
87 |                 />
88 |                 <div v-if="selectedCountry" class="text-caption text-medium-emphasis mt-1">* Depends on Country</div>
89 |               </v-col>
90 |             </v-row>
91 | 
92 |             <v-row>
93 |               <v-col cols="12">
94 |                 <div class="text-caption text-medium-emphasis">Builder *</div>
95 |                 <v-select
96 |                     v-model="selectedBuilder"
97 |                     :items="builders"
98 |                     item-title="name"
99 |                     item-value="code"
100 |                     :rules="[v => !!v || 'Builder is required']"
101 |                     placeholder="Select Builder"
102 |                     :loading="!projectStore.builders?.length"
103 |                 />
104 |               </v-col>
105 |             </v-row>
106 |             <v-row>
107 |               <v-col cols="12">
108 |                 <div class="text-caption text-medium-emphasis">Campaign type *</div>
109 |                 <v-select
110 |                     v-model="selectedCampaignType"
111 |                     :items="campaignTypes"
112 |                     item-title="name"
113 |                     item-value="code"
114 |                     :rules="[v => !!v || 'Campaign type is required']"
115 |                     placeholder="Select Campaign Type"
116 |                     :loading="!projectStore.campaignTypes?.length"
117 |                 />
118 |               </v-col>
119 |             </v-row>
120 |             <v-row>
121 |               <v-col cols="12">
122 |                 <div class="text-caption text-medium-emphasis">Phase *</div>
123 |                 <v-select
124 |                     v-model="selectedPhase"
125 |                     :items="phases"
126 |                     item-title="name"
127 |                     item-value="code"
128 |                     :rules="[v => !!v || 'Phase is required']"
129 |                     placeholder="Select Phase"
130 |                     :loading="!projectStore.phases?.length"
131 |                 />
132 |               </v-col>
133 |             </v-row>
134 |             <v-row>
135 |               <v-col cols="12">
136 |                 <div class="text-caption text-medium-emphasis">Goal *</div>
137 |                 <v-select
138 |                     v-model="selectedGoal"
139 |                     :items="goals"
140 |                     item-title="name"
141 |                     item-value="code"
142 |                     :rules="[v => !!v || 'Goal is required']"
143 |                     placeholder="Select Goal"
144 |                     :loading="!projectStore.goals?.length"
145 |                 />
146 |               </v-col>
147 |             </v-row>
148 | 
149 |           </v-card-text>
150 |         </WithFormDefaults>
151 | 
152 |         <DialogFooter
153 |             class="px-4 mt-5"
154 |             cancel-text="Cancel"
155 |             confirm-text="Create Project"
156 |             :loading="isSubmitting"
157 |             :disabled="!formIsReady || isSubmitting"
158 |             :submit-button="true"
159 |             @cancel="cancelDialog"
160 |             @confirm="submitForm"/>
161 |       </v-form>
162 |     </v-card>
163 |   </v-dialog>
164 | </template>
165 | 
166 | <script setup lang="ts">
167 | // Script content remains the same as the previous correct version
168 | import {ref, computed, onMounted, watch, nextTick } from 'vue';
169 | import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
170 | import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
171 | import {useProjectStore} from '@/stores/projectStore';
172 | import type {
173 |   ProjectCountry,
174 |   ProjectLanguage,
175 |   ProjectCampaignType,
176 |   ProjectPhase,
177 |   ProjectGoal,
178 |   ProjectBuilder
179 | } from '@/types/project';
180 | import CountryFlag from '@/components/common/CountryFlag.vue';
181 | import {getBrandLogo} from '@/helpers/brandUtils';
182 | import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
183 | import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
184 | import {formatDate} from "@/helpers/dateUtils.ts";
185 | 
186 | interface CreateFirstProjectDialogProps {
187 |   modelValue: boolean
188 |   mediaplanId: string
189 |   mediaplanName?: string
190 |   poNumbers?: { _id: string; name: string; value: number }[]
191 |   startDate?: string | Date | null
192 |   endDate?: string | Date | null
193 |   brand?: { _id: string; name: string }
194 | }
195 | const props = defineProps<CreateFirstProjectDialogProps>()
196 | 
197 | const emit = defineEmits<{
198 |   (e: 'update:modelValue', value: boolean): void;
199 |   (e: 'created', projectId: string): void;
200 | }>();
201 | 
202 | const form = ref<any>(null);
203 | const projectStore = useProjectStore();
204 | const isFormValid = ref(false);
205 | const isSubmitting = ref(false);
206 | 
207 | const selectedCountry = ref<ProjectCountry | null>(null);
208 | const selectedLanguage = ref<string | null>(null);
209 | const selectedBuilder = ref<string | null>(null);
210 | const selectedCampaignType = ref<string | null>(null);
211 | const selectedPhase = ref<string | null>(null);
212 | const selectedGoal = ref<string | null>(null);
213 | 
214 | const brandName = computed(() => props.brand?.name || 'Brand');
215 | const poNumbersDisplay = computed(() => {
216 |   if (!props.poNumbers || props.poNumbers.length === 0) return '-';
217 |   return props.poNumbers.map(po => po.name).join(', ');
218 | });
219 | const startDateValue = computed(() => props.startDate || null);
220 | const endDateValue = computed(() => props.endDate || null);
221 | 
222 | const countries = computed(() => projectStore.countries || []);
223 | const languageOptions = computed(() => projectStore.languages || []);
224 | const builders = computed(() => projectStore.builders?.map(b => ({code: b.id, name: b.name})) || []);
225 | const campaignTypes = computed(() => projectStore.campaignTypes?.map(t => ({code: t.id, name: t.name})) || []);
226 | const phases = computed(() => projectStore.phases?.map(p => ({code: p.id, name: p.name})) || []);
227 | const goals = computed(() => projectStore.goals?.map(g => ({code: g.id, name: g.name})) || []);
228 | 
229 | const formIsReady = computed(() => {
230 |   return isFormValid.value &&
231 |       !!selectedCountry.value &&
232 |       !!selectedLanguage.value &&
233 |       !!selectedBuilder.value &&
234 |       !!selectedCampaignType.value &&
235 |       !!selectedPhase.value &&
236 |       !!selectedGoal.value;
237 | });
238 | 
239 | const availableLanguages = computed(() => {
240 |   if (!selectedCountry.value) return [];
241 |   return languageOptions.value.filter((lang: any) =>
242 |       lang.country_codes?.includes(selectedCountry.value!.code)
243 |   );
244 | });
245 | 
246 | const validateForm = async (): Promise<boolean> => {
247 |   if (!form.value) return false;
248 |   const {valid} = await form.value.validate();
249 |   return valid && formIsReady.value;
250 | };
251 | 
252 | const resetFormFields = () => {
253 |   selectedCountry.value = null;
254 |   selectedLanguage.value = null;
255 |   selectedBuilder.value = null;
256 |   selectedCampaignType.value = null;
257 |   selectedPhase.value = null;
258 |   selectedGoal.value = null;
259 |   nextTick(() => {
260 |     form.value?.resetValidation();
261 |   });
262 | };
263 | 
264 | const submitForm = async () => {
265 |   const isValid = await validateForm();
266 |   if (!isValid) {
267 |     showWarning('Please fill in all required fields correctly.');
268 |     return;
269 |   }
270 | 
271 |   isSubmitting.value = true;
272 |   try {
273 |     const payload = {
274 |       country_code: selectedCountry.value?.code,
275 |       language_code: selectedLanguage.value,
276 |       builder_code: selectedBuilder.value,
277 |       campaign_type_code: selectedCampaignType.value,
278 |       phase_code: selectedPhase.value,
279 |       goal_code: selectedGoal.value,
280 |     };
281 |     console.log("Submitting First Project Payload:", payload);
282 | 
283 |     console.log(`Calling create for mediaplan ID: ${props.mediaplanId}`);
284 |     const newProject = await projectStore.createProject(props.mediaplanId, payload);
285 |     showSuccess(`Project created successfully`);
286 |     emit('created', newProject._id);
287 | 
288 |     emit('update:modelValue', false);
289 | 
290 |   } catch (error: any) {
291 |     console.error(`Error creating first project:`, error);
292 |     const message = error?.response?.data?.message || error?.message || `Failed to create project.`;
293 |     showError(message);
294 |   } finally {
295 |     isSubmitting.value = false;
296 |   }
297 | };
298 | 
299 | const handleClose = (value: boolean) => {
300 |   if (!value) {
301 |     cancelDialog();
302 |   }
303 | }
304 | 
305 | const cancelDialog = () => {
306 |   if (isSubmitting.value) {
307 |     showWarning('Please wait, submission is in progress.');
308 |     return;
309 |   }
310 |   resetFormFields();
311 |   emit('update:modelValue', false);
312 | };
313 | 
314 | watch(() => props.modelValue, (isVisible) => {
315 |   if (isVisible) {
316 |     resetFormFields();
317 |   }
318 | });
319 | 
320 | watch(selectedCountry, (newCountry, oldCountry) => {
321 |   if (newCountry !== oldCountry && oldCountry !== undefined) {
322 |     selectedLanguage.value = null;
323 |     nextTick(() => {
324 |       if (availableLanguages.value.length === 1) {
325 |         selectedLanguage.value = availableLanguages.value[0].code;
326 |       }
327 |     });
328 |   }
329 | });
330 | 
331 | onMounted(async () => {
332 |   try {
333 |     await projectStore.fetchProjectOptions();
334 |     console.log("First Project Dialog options loaded on mount.");
335 |   } catch (error) {
336 |     console.error('Error fetching form options on mount:', error);
337 |     showError('Failed to load required form options.');
338 |   }
339 | });
340 | 
341 | </script>
342 | 
343 | <style scoped>
344 | .country-flag {
345 |   width: 20px;
346 |   height: auto;
347 |   display: inline-block;
348 |   vertical-align: middle;
349 | }
350 | </style>
```

src/components/overview/CreateMediaplanButton.vue
```
1 | <template>
2 |   <div>
3 |     <v-btn
4 |         color="black"
5 |         class="text-white px-4"
6 |         prepend-icon="mdi-plus"
7 |         @click="showDialog"
8 |     >
9 |       Mediaplan
10 |     </v-btn>
11 | 
12 |     <create-mediaplan-dialog
13 |         v-model="dialogVisible"
14 |         @created="handleMediaplanCreated"
15 |         @project-created="handleProjectCreated"
16 |     />
17 |   </div>
18 | </template>
19 | 
20 | <script setup lang="ts">
21 | import { ref } from 'vue';
22 | import CreateMediaplanDialog from './CreateMediaplanDialog.vue';
23 | import { useRouter } from 'vue-router';
24 | import { useMediaplanStore } from '@/stores/mediaplanStore';
25 | 
26 | const router = useRouter();
27 | const mediaplanStore = useMediaplanStore();
28 | const dialogVisible = ref(false);
29 | 
30 | const showDialog = () => {
31 |   dialogVisible.value = true;
32 | };
33 | 
34 | const handleMediaplanCreated = (mediaplanId: string) => {
35 |   // Store the mediaplan ID but don't close the dialog yet
36 |   // as the project creation will follow
37 |   console.log('Mediaplan created with ID:', mediaplanId);
38 | };
39 | 
40 | const handleProjectCreated = (projectId: string) => {
41 |   console.log('Project created with ID:', projectId);
42 | 
43 |   // Refresh the mediaplans list
44 |   mediaplanStore.fetchMediaplans();
45 | 
46 |   // Emit event to notify parent component
47 |   emit('project-created', projectId);
48 | };
49 | 
50 | const emit = defineEmits<{
51 |   (e: 'mediaplan-created'): void;
52 |   (e: 'project-created', projectId: string): void;
53 | }>();
54 | </script>
```

src/components/overview/CreateMediaplanDialog.vue
```
1 | <template>
2 |   <v-dialog v-model="dialog" persistent max-width="450px">
3 |     <v-card class="px-6 pa-4">
4 |       <DialogHeader
5 |           title="Create new Mediaplan"
6 |           :show-back-button="false"
7 |           margin-bottom="4"
8 |           @close="cancelDialog"
9 |       />
10 |       <v-form ref="form" @submit.prevent="submitForm">
11 |         <WithFormDefaults>
12 |           <v-card-text class="pa-0">
13 |             <!-- Brand Selection -->
14 |             <FormElementVrowVcol label="Brand Output" required>
15 |               <v-select
16 |                   id="brand-select"
17 |                   v-model="formData.brand._id"
18 |                   :items="brands"
19 |                   item-title="name"
20 |                   item-value="_id"
21 |                   placeholder="Please Select a brand"
22 |                   :rules="[v => !!v || 'Brand is required']"
23 |               />
24 |             </FormElementVrowVcol>
25 | 
26 |             <!-- Mediaplan Type -->
27 |             <FormElementVrowVcol pb="pb-3" label="Mediaplan Type" required>
28 |               <v-radio-group v-model="mediaplanType" inline>
29 |                 <v-radio value="po" label="PO Based"/>
30 |                 <v-radio value="draft" label="Draft"/>
31 |               </v-radio-group>
32 |             </FormElementVrowVcol>
33 | 
34 |             <!-- Mediaplan Name -->
35 |             <FormElementVrowVcol label="Individual Name">
36 |               <v-text-field
37 |                   id="mediaplan-name"
38 |                   v-model="formData.name"
39 |                   placeholder="please type in an individual title"
40 |                   :rules="[v => !!v || 'Name is required']"
41 |               />
42 |             </FormElementVrowVcol>
43 | 
44 |             <!-- PO Selection -->
45 |             <FormElementVrowVcol label="Select existing PO" required>
46 |               <v-row no-gutters>
47 |                 <v-col class="mr-2">
48 |                   <v-select
49 |                       id="po-select"
50 |                       v-model="selectedPOs"
51 |                       :items="poNumbers"
52 |                       item-title="name"
53 |                       item-value="_id"
54 |                       placeholder="Select POs"
55 |                       :rules="[v => mediaplanType !== 'po' || (v && v.length > 0) || 'At least one PO is required']"
56 |                       multiple
57 |                       chips
58 |                       closable-chips
59 |                   />
60 |                 </v-col>
61 |                 <v-col cols="auto">
62 |                   <v-btn
63 |                       color="primary"
64 |                       size="large"
65 |                       style="height: 48px;"
66 |                       variant="outlined"
67 |                       @click="openCreatePODialog"
68 |                   >
69 |                     Create PO
70 |                   </v-btn>
71 |                 </v-col>
72 |               </v-row>
73 |             </FormElementVrowVcol>
74 | 
75 |             <!-- Creator and Department -->
76 |             <FormElementVrowVcol label="Creator" required>
77 | 
78 |               <v-text-field
79 |                   id="creator-name"
80 |                   v-model="creatorName"
81 |                   placeholder="Your name"
82 |                   :rules="[v => !!v || 'Creator name is required']"
83 |                   readonly
84 |                   disabled
85 |               />
86 |             </FormElementVrowVcol>
87 | 
88 |             <FormElementVrowVcol label="Department">
89 |               <v-text-field
90 |                   id="department"
91 |                   v-model="department"
92 |                   placeholder="Department name"
93 |               />
94 |             </FormElementVrowVcol>
95 | 
96 | 
97 |             <!-- Date Range -->
98 |             <FormElementVrowVcol label="Start date - End date" required>
99 |               <DateRangePicker
100 |                   id="date-range"
101 |                   v-model="dateRange"
102 |                   placeholder="Select start and end dates"
103 |                   :rules="[v => !!v || 'Date range is required']"
104 |                   :required="true"
105 |                   dialog-title="Choose a date range"
106 |                   @update:model-value="handleDateRangeChange"
107 |               />
108 |             </FormElementVrowVcol>
109 | 
110 | 
111 |           </v-card-text>
112 |         </WithFormDefaults>
113 | 
114 |         <DialogFooter
115 |             cancel-text="Cancel"
116 |             confirm-text="Next Step"
117 |             :loading="isSubmitting"
118 |             :disabled="!form?.isValid"
119 |             :submit-button="true"
120 |             @cancel="cancelDialog"
121 |         />
122 |       </v-form>
123 |     </v-card>
124 |   </v-dialog>
125 | 
126 |   <!-- Create PO Dialog -->
127 |   <CreatePoDialog
128 |       v-model="createPODialogVisible"
129 |       :initial-brand-id="formData.brand._id"
130 |       @created="handlePoCreated"
131 |   />
132 | 
133 |   <!-- Project Creation Dialog (shown after mediaplan creation) -->
134 |   <CreateProjectDialog
135 |       mode="create-mediaplan"
136 |       v-if="showProjectDialog"
137 |       v-model="showProjectDialog"
138 |       :mediaplan-id="createdMediaplanId"
139 |       :mediaplan-name="formData.name"
140 |       :po-numbers="formData.po_numbers"
141 |       :start-date="formData.start_date"
142 |       :end-date="formData.end_date"
143 |       :brand="{ _id: formData.brand._id, name: selectedBrandName }"
144 |       @created="handleProjectCreated"
145 |   />
146 | </template>
147 | 
148 | 
149 | <script setup lang="ts">
150 | import {ref, computed, onMounted, watch, nextTick, reactive} from 'vue';
151 | import {useAuthStore} from '@/stores/auth';
152 | import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
153 | import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
154 | import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
155 | import DateRangePicker from './DateRangePicker.vue';
156 | import CreateProjectDialog from '@/components/overview/CreateFirstProjectDialog.vue';
157 | import CreatePoDialog from '@/components/overview/CreatePoDialog.vue';
158 | import type {MediaplanCreate, Brand, PONumber} from '@/types/mediaplan';
159 | import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
160 | import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
161 | import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
162 | 
163 | // Props
164 | const props = defineProps<{
165 |   modelValue: boolean;
166 | }>();
167 | // Emits
168 | const emit = defineEmits<{
169 |   (e: 'update:modelValue', value: boolean): void;
170 |   (e: 'created', mediaplanId: string): void;
171 |   (e: 'project-created', projectId: string): void;
172 | }>();
173 | 
174 | // References
175 | const form = ref();
176 | const authStore = useAuthStore();
177 | const createMediaplanStore = useCreateMediaplanStore();
178 | 
179 | // Reactive State
180 | const dialog = computed({
181 |   get: () => props.modelValue,
182 |   set: (value) => emit('update:modelValue', value)
183 | });
184 | 
185 | const mediaplanType = ref('po'); // Default to PO Based
186 | const selectedPOs = ref<string[]>([]); // Changed to array for multi-select
187 | const department = ref('');
188 | const creatorName = ref('Current User');
189 | const isSubmitting = ref(false);
190 | const dateRange = ref<[string, string] | null>(null);
191 | 
192 | // Project dialog state
193 | const showProjectDialog = ref(false);
194 | const createdMediaplanId = ref('');
195 | 
196 | // Create PO Dialog
197 | const createPODialogVisible = ref(false);
198 | 
199 | // Use values from the store
200 | const brands = computed(() => createMediaplanStore.brands);
201 | const poNumbers = computed(() => createMediaplanStore.poNumbers);
202 | 
203 | const selectedBrandName = computed(() => {
204 |   const selectedBrand = brands.value.find(brand => brand._id === formData.brand._id);
205 |   return selectedBrand ? selectedBrand.name : '';
206 | });
207 | 
208 | // Form data structure
209 | const formData = reactive<MediaplanCreate>({
210 |   name: '',
211 |   status: 'Draft', // Default status
212 |   start_date: '',
213 |   end_date: '',
214 |   brand: {
215 |     _id: '',
216 |   },
217 |   budget: {
218 |     total: 0,
219 |     used: 0,
220 |     available: 0
221 |   },
222 |   po_numbers: []
223 | });
224 | 
225 | // Methods
226 | const handleDateRangeChange = (range: [string, string] | null) => {
227 |   if (range) {
228 |     formData.start_date = range[0];
229 |     formData.end_date = range[1];
230 |   } else {
231 |     formData.start_date = '';
232 |     formData.end_date = '';
233 |   }
234 | };
235 | 
236 | // Method to handle project creation completion
237 | const handleProjectCreated = (projectId: string) => {
238 |   // Close the project dialog
239 |   showProjectDialog.value = false;
240 | 
241 |   // Emit the project created event
242 |   emit('project-created', projectId);
243 | 
244 |   // Close the main dialog as well
245 |   dialog.value = false;
246 | 
247 |   // Show success notification
248 |   showSuccess('Project created successfully');
249 | };
250 | 
251 | // Method to handle PO creation
252 | const handlePoCreated = (po: PONumber) => {
253 |   // Add the newly created PO to the selected POs
254 |   selectedPOs.value = [...selectedPOs.value, po._id];
255 | 
256 |   // Show success message
257 |   showSuccess(`PO "${po.name}" created successfully and added to selection`);
258 | };
259 | 
260 | const loadFormData = async () => {
261 |   try {
262 |     // Load data from the store
263 |     if (brands.value.length === 0) {
264 |       await createMediaplanStore.fetchBrands();
265 |     }
266 | 
267 |     if (poNumbers.value.length === 0) {
268 |       await createMediaplanStore.fetchPONumbers();
269 |     }
270 |   } catch (error) {
271 |     console.error('Error loading form data:', error);
272 |     showError('Failed to load form data');
273 |   }
274 | };
275 | 
276 | const submitForm = async () => {
277 |   const {valid} = await form.value.validate();
278 | 
279 |   if (!valid) return;
280 | 
281 |   isSubmitting.value = true;
282 | 
283 |   try {
284 |     // Add selected POs to the form data
285 |     if (mediaplanType.value === 'po' && selectedPOs.value.length > 0) {
286 |       const selectedPOObjects = poNumbers.value.filter(po => selectedPOs.value.includes(po._id));
287 |       if (selectedPOObjects.length > 0) {
288 |         formData.po_numbers = selectedPOObjects;
289 |         // Calculate total budget from all selected POs
290 |         formData.budget.total = selectedPOObjects.reduce((sum, po) => sum + po.value, 0);
291 |       }
292 |     }
293 | 
294 |     // Set status based on the type
295 |     formData.status = mediaplanType.value === 'po' ? 'Draft' : 'Draft';
296 | 
297 |     // For demo purposes, log the payload
298 |     console.log('Creating mediaplan with data:', formData);
299 | 
300 |     // In real application, send to API:
301 |     try {
302 |       // This would be the actual API call in production
303 |       /*
304 |       const response = await customFetch('/mediaplans', {
305 |         method: 'POST',
306 |         headers: {
307 |           'Content-Type': 'application/json',
308 |         },
309 |         body: JSON.stringify(formData),
310 |       });
311 |       createdMediaplanId.value = response._id;
312 |       */
313 | 
314 |       // For demo, simulate successful API call
315 |       await new Promise(resolve => setTimeout(resolve, 800));
316 | 
317 |       // Simulate a response with a mock ID
318 |       createdMediaplanId.value = `mediaplan-${Date.now()}`;
319 | 
320 |       // Notify success
321 |       showSuccess('Mediaplan created successfully');
322 | 
323 |       // Emit the created event
324 |       emit('created', createdMediaplanId.value);
325 | 
326 |       // Important: Here we don't cancelDoalog the dialog, but instead show the project dialog
327 |       showProjectDialog.value = true;
328 | 
329 |     } catch (apiError) {
330 |       console.error('API error creating mediaplan:', apiError);
331 |       showError('Failed to create mediaplan: API error', {timeout: 10000});
332 |       throw apiError;
333 |     }
334 | 
335 |   } catch (error) {
336 |     console.error('Error creating mediaplan:', error);
337 |     showError('Failed to create mediaplan');
338 |   } finally {
339 |     isSubmitting.value = false;
340 |   }
341 | };
342 | 
343 | // PO Dialog methods
344 | const openCreatePODialog = () => {
345 |   if (!formData.brand._id) {
346 |     showWarning('Please select a brand first');
347 |     return;
348 |   }
349 |   createPODialogVisible.value = true;
350 | };
351 | 
352 | const cancelDialog = () => {
353 |   resetForm();
354 |   dialog.value = false;
355 | };
356 | 
357 | const resetForm = async () => {
358 |   if (form.value) {
359 |     form.value.reset();
360 |   }
361 |   await nextTick();
362 | 
363 |   formData.name = '';
364 |   formData.brand._id = '';
365 |   formData.start_date = '';
366 |   formData.end_date = '';
367 |   dateRange.value = null;
368 |   selectedPOs.value = [];
369 |   department.value = '';
370 |   mediaplanType.value = 'po';
371 |   showProjectDialog.value = false;
372 |   createdMediaplanId.value = '';
373 | };
374 | 
375 | // Lifecycle
376 | onMounted(async () => {
377 |   await loadFormData();
378 |   // Set creator name from auth store if available
379 |   if (authStore.user) {
380 |     creatorName.value = authStore.user.name || 'Current User';
381 |   } else {
382 |     creatorName.value = 'Current User';
383 |   }
384 | });
385 | 
386 | // Watch for dialog changes to reset form
387 | watch(dialog, (newValue) => {
388 |   if (newValue === false) {
389 |     resetForm();
390 |   }
391 | });
392 | </script>
```

src/components/overview/CreatePoDialog.vue
```
1 | <template>
2 |   <v-dialog v-model="dialog" max-width="800px" persistent>
3 |     <v-card class="px-6 py-4">
4 |       <DialogHeader
5 |           title="Create new PO"
6 |           :show-back-button="false"
7 |           :show-close-button="true"
8 |           close-icon-color="primary"
9 |           @close="cancelDialog"
10 |       />
11 | 
12 |       <v-form ref="form" @submit.prevent="submitForm" class="mt-2">
13 |         <v-card-text class="pa-0">
14 |           <v-row>
15 |             <!-- Left column -->
16 |             <v-col cols="12" md="6">
17 |               <div class="mb-4">
18 |                 <label for="client-department" class="text-body-2 mb-1 d-block">Client Department</label>
19 |                 <v-text-field
20 |                     id="client-department"
21 |                     v-model="formData.clientDepartment"
22 |                     placeholder="Enter the client's department name"
23 |                     variant="outlined"
24 |                     hide-details
25 |                 />
26 |               </div>
27 | 
28 |               <div class="mb-4">
29 |                 <label for="brand-select" class="text-body-2 mb-1 d-block">Brand*</label>
30 |                 <v-select
31 |                     id="brand-select"
32 |                     v-model="formData.brand"
33 |                     :items="brands"
34 |                     item-title="name"
35 |                     item-value="_id"
36 |                     placeholder="Select the brand for this PO"
37 |                     :rules="[v => !!v || 'Brand is required']"
38 |                     variant="outlined"
39 |                     hide-details
40 |                 />
41 |               </div>
42 | 
43 |               <div class="mb-4">
44 |                 <label for="client-name" class="text-body-2 mb-1 d-block">Client Name</label>
45 |                 <v-text-field
46 |                     id="client-name"
47 |                     v-model="formData.clientName"
48 |                     placeholder="Enter client's full name"
49 |                     variant="outlined"
50 |                     hide-details
51 |                 />
52 |               </div>
53 | 
54 |               <div class="mb-4">
55 |                 <label for="market-select" class="text-body-2 mb-1 d-block">Market*</label>
56 |                 <v-select
57 |                     id="market-select"
58 |                     v-model="formData.market"
59 |                     :items="markets"
60 |                     item-title="name"
61 |                     item-value="_id"
62 |                     placeholder="Select target market region"
63 |                     :rules="[v => !!v || 'Market is required']"
64 |                     variant="outlined"
65 |                     hide-details
66 |                 />
67 |               </div>
68 | 
69 |               <div class="mb-4">
70 |                 <label for="purpose-text" class="text-body-2 mb-1 d-block">Purpose</label>
71 |                 <v-textarea
72 |                     id="purpose-text"
73 |                     v-model="formData.purpose"
74 |                     placeholder="Describe the purpose of this purchase order"
75 |                     variant="outlined"
76 |                     rows="4"
77 |                     counter="250"
78 |                     :rules="[v => !v || v.length <= 250 || 'Maximum 250 characters']"
79 |                     hide-details="auto"
80 |                 />
81 |               </div>
82 |             </v-col>
83 | 
84 |             <!-- Right column -->
85 |             <v-col cols="12" md="6">
86 |               <div class="mb-4">
87 |                 <label for="po-number" class="text-body-2 mb-1 d-block">PO Number*</label>
88 |                 <v-text-field
89 |                     id="po-number"
90 |                     v-model="formData.poNumber"
91 |                     placeholder="Enter official purchase order number"
92 |                     :rules="[v => !!v || 'PO Number is required']"
93 |                     variant="outlined"
94 |                     hide-details
95 |                 />
96 |               </div>
97 | 
98 |               <div class="d-flex">
99 |                 <div class="flex-grow-1 mr-2">
100 |                   <label for="budget" class="text-body-2 mb-1 d-block">Budget*</label>
101 |                   <v-text-field
102 |                       id="budget"
103 |                       v-model="formData.budget"
104 |                       placeholder="Enter budget amount"
105 |                       type="number"
106 |                       :rules="[
107 |                         v => !!v || 'Budget is required',
108 |                         v => v > 0 || 'Budget must be greater than 0'
109 |                       ]"
110 |                       variant="outlined"
111 |                       class="mb-4"
112 |                       hide-details
113 |                   />
114 |                 </div>
115 | 
116 |                 <div class="flex-grow-0" style="width: 100px">
117 |                   <label for="currency" class="text-body-2 mb-1 d-block">Currency</label>
118 |                   <v-select
119 |                       id="currency"
120 |                       v-model="formData.currency"
121 |                       :items="currencies"
122 |                       variant="outlined"
123 |                       class="mb-4"
124 |                       hide-details
125 |                   />
126 |                 </div>
127 |               </div>
128 | 
129 |               <div class="mb-4">
130 |                 <label for="validity-range" class="text-body-2 mb-1 d-block">Validity Period*</label>
131 |                 <DateRangePicker
132 |                     id="validity-range"
133 |                     v-model="dateRange"
134 |                     label=""
135 |                     placeholder="Select validity period"
136 |                     required
137 |                     :rules="[v => !!v || 'Validity period is required']"
138 |                     variant="outlined"
139 |                     dialog-title="Select PO Validity Period"
140 |                     hide-details
141 |                 />
142 |               </div>
143 | 
144 |               <div class="mb-4">
145 |                 <label for="contractor-department" class="text-body-2 mb-1 d-block">Contractor Department</label>
146 |                 <v-text-field
147 |                     id="contractor-department"
148 |                     v-model="formData.contractorDepartment"
149 |                     placeholder="Enter contractor's department name"
150 |                     variant="outlined"
151 |                     hide-details
152 |                 />
153 |               </div>
154 | 
155 |               <div class="mb-4">
156 |                 <label for="contractor-name" class="text-body-2 mb-1 d-block">Contractor Name</label>
157 |                 <v-text-field
158 |                     id="contractor-name"
159 |                     v-model="formData.contractorName"
160 |                     placeholder="Enter contractor's full name"
161 |                     variant="outlined"
162 |                     hide-details
163 |                 />
164 |               </div>
165 |             </v-col>
166 |           </v-row>
167 |         </v-card-text>
168 |         <DialogFooter
169 |             cancel-text="Cancel"
170 |             confirm-text="Create PO"
171 |             :loading="isSubmitting"
172 |             :disabled="!form?.isValid"
173 |             :submit-button="true"
174 |             @cancel="cancelDialog"
175 |         />
176 |       </v-form>
177 |     </v-card>
178 |   </v-dialog>
179 | </template>
180 | 
181 | <script setup lang="ts">
182 | import { ref, reactive, computed, onMounted } from 'vue';
183 | import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
184 | import { useCreateMediaplanStore } from '@/stores/createMediaplanStore';
185 | import type { Brand, PONumber } from '@/types/mediaplan';
186 | import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
187 | import DateRangePicker from "./DateRangePicker.vue";
188 | import { showSuccess, showError, showWarning } from '@/helpers/notificationUtils';
189 | import { formatCurrency } from '@/helpers/currencyUtils';
190 | 
191 | // Props
192 | const props = defineProps<{
193 |   modelValue: boolean;
194 |   initialBrandId?: string;
195 | }>();
196 | 
197 | // Emits
198 | const emit = defineEmits<{
199 |   (e: 'update:modelValue', value: boolean): void;
200 |   (e: 'created', po: PONumber): void;
201 | }>();
202 | 
203 | // References and computed values
204 | const form = ref();
205 | const createMediaplanStore = useCreateMediaplanStore();
206 | const dialog = computed({
207 |   get: () => props.modelValue,
208 |   set: (value) => emit('update:modelValue', value)
209 | });
210 | 
211 | // Date range for the DateRangePicker
212 | const dateRange = ref<[string, string] | null>(null);
213 | 
214 | // Loading state
215 | const isSubmitting = ref(false);
216 | 
217 | // Brands from store
218 | const brands = computed(() => createMediaplanStore.brands);
219 | 
220 | const markets = ref([
221 |   { _id: 'de', name: 'Germany' },
222 |   { _id: 'us', name: 'United States' },
223 |   { _id: 'uk', name: 'United Kingdom' },
224 |   { _id: 'fr', name: 'France' },
225 |   { _id: 'it', name: 'Italy' },
226 |   { _id: 'es', name: 'Spain' },
227 |   { _id: 'pl', name: 'Poland' },
228 | ]);
229 | 
230 | const currencies = ref(['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'PLN']);
231 | 
232 | // Form data
233 | const formData = reactive({
234 |   clientDepartment: '',
235 |   brand: props.initialBrandId || '',
236 |   clientName: '',
237 |   market: '',
238 |   purpose: '',
239 |   poNumber: '',
240 |   budget: 0,
241 |   currency: 'EUR',
242 |   contractorDepartment: '',
243 |   contractorName: ''
244 | });
245 | 
246 | // Methods
247 | const submitForm = async () => {
248 |   if (!form.value) return;
249 | 
250 |   const { valid } = await form.value.validate();
251 |   if (!valid) return;
252 | 
253 |   isSubmitting.value = true;
254 | 
255 |   try {
256 |     // Create the PO through the store
257 |     const newPO = await createMediaplanStore.createPO({
258 |       name: formData.poNumber,
259 |       value: Number(formData.budget),
260 |       // Pass the dateRange values to the API
261 |       metadata: {
262 |         clientDepartment: formData.clientDepartment,
263 |         brand: formData.brand,
264 |         clientName: formData.clientName,
265 |         market: formData.market,
266 |         purpose: formData.purpose,
267 |         currency: formData.currency,
268 |         validFrom: dateRange.value ? dateRange.value[0] : '',
269 |         validTo: dateRange.value ? dateRange.value[1] : '',
270 |         contractorDepartment: formData.contractorDepartment,
271 |         contractorName: formData.contractorName
272 |       }
273 |     });
274 | 
275 |     // Show success message with formatted currency
276 |     showSuccess(
277 |       `PO "${formData.poNumber}" created successfully with budget ${formatCurrency(Number(formData.budget), { currency: formData.currency })}`
278 |     );
279 | 
280 |     // Emit the created event with the new PO
281 |     emit('created', newPO);
282 | 
283 |     // Close the dialog
284 |     setTimeout(() => {
285 |       dialog.value = false;
286 |     }, 500);
287 |   } catch (error) {
288 |     console.error('Error creating PO:', error);
289 |     showError('Failed to create PO. Please try again.', { timeout: 8000 });
290 |   } finally {
291 |     isSubmitting.value = false;
292 |   }
293 | };
294 | 
295 | const cancelDialog = () => {
296 |   if (isSubmitting.value) {
297 |     showWarning('Please wait while the form is submitting...');
298 |     return;
299 |   }
300 |   dialog.value = false;
301 | };
302 | 
303 | // Lifecycle
304 | onMounted(async () => {
305 |   // Set default dates (today to 1 year from now)
306 |   const today = new Date();
307 |   const nextYear = new Date(today);
308 |   nextYear.setFullYear(today.getFullYear() + 1);
309 | 
310 |   const todayStr = today.toISOString().split('T')[0];
311 |   const nextYearStr = nextYear.toISOString().split('T')[0];
312 | 
313 |   // Set the default date range
314 |   dateRange.value = [todayStr, nextYearStr];
315 | 
316 |   // Initialize with the brand from the prop if provided
317 |   if (props.initialBrandId) {
318 |     formData.brand = props.initialBrandId;
319 |   } else if (brands.value.length > 0) {
320 |     // Set the first brand as default if no initial brand is provided
321 |     formData.brand = brands.value[0]._id;
322 |   }
323 | 
324 |   // Make sure brands are loaded
325 |   if (brands.value.length === 0) {
326 |     try {
327 |       await createMediaplanStore.fetchBrands();
328 |       if (brands.value.length > 0 && !formData.brand) {
329 |         formData.brand = brands.value[0]._id;
330 |       }
331 |     } catch (error) {
332 |       showError('Failed to load brands. Please try again later.');
333 |     }
334 |   }
335 | });
336 | </script>
```

src/components/overview/DateRangePicker.vue
```
1 | <template>
2 |   <div class="date-range-picker">
3 |     <!-- Single input field that triggers the dialog -->
4 |     <v-text-field
5 |         v-model="displayValue"
6 |         :label="label"
7 |         :placeholder="placeholder"
8 |         :rules="rules"
9 |         :hint="hint"
10 |         :disabled="disabled"
11 |         readonly
12 |         @click="openDialog"
13 |         append-inner-icon="mdi-calendar-month-outline"
14 |         v-bind="$attrs"
15 |     >
16 |     </v-text-field>
17 | 
18 |     <!-- Date Picker Dialog -->
19 |     <v-dialog v-model="showDialog" width="auto" max-width="420px">
20 |       <v-card class="date-picker-dialog">
21 |         <!-- Dialog Title -->
22 |         <v-card-title class="d-flex align-center pb-0">
23 |           <span class="text-subtitle-1">{{ dialogTitle }}</span>
24 |           <v-spacer></v-spacer>
25 |           <v-btn icon variant="text" @click="closeDialog">
26 |             <v-icon>mdi-close</v-icon>
27 |           </v-btn>
28 |         </v-card-title>
29 | 
30 |         <!-- Display Selected Dates -->
31 |         <v-card-text class="pt-2 pb-0">
32 |           <div v-if="selectedDates.length >= 2" class="selected-dates">
33 |             <span class="text-subtitle-1">Selected Range:</span>
34 |             {{ formatSelectedDatePreview(selectedDates[0]) }} -
35 |             {{ formatSelectedDatePreview(selectedDates[selectedDates.length - 1]) }}
36 |           </div>
37 |           <div v-else class="selected-dates">
38 |             <strong>No date range selected</strong>
39 |           </div>
40 |         </v-card-text>
41 | 
42 |         <!-- Date Picker Component -->
43 |         <v-date-picker
44 |             v-model="selectedDates"
45 |             :min="minDate"
46 |             :max="maxDate"
47 |             multiple="range"
48 |             elevation="0"
49 |             color="primary"
50 |             width="100%"
51 |             hide-header
52 |             show-adjacent-months
53 |         >
54 |         </v-date-picker>
55 | 
56 |         <!-- Dialog Actions -->
57 |         <v-card-actions class="pt-0 pb-4 px-6">
58 |           <v-btn
59 |               size="large"
60 |               variant="outlined"
61 |               color="grey-darken-1"
62 |               @click="clearSelection"
63 |           >
64 |             Clear selection
65 |           </v-btn>
66 |           <v-btn
67 |               size="large"
68 |               color="primary"
69 |               variant="flat"
70 |               @click="setDates"
71 |               :disabled="!canSetDates"
72 |           >
73 |             Set dates
74 |           </v-btn>
75 |         </v-card-actions>
76 |       </v-card>
77 |     </v-dialog>
78 |   </div>
79 | </template>
80 | 
81 | <script setup lang="ts">
82 | import {ref, computed, watch} from 'vue';
83 | import {formatDate} from '@/helpers/dateUtils';
84 | import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
85 | 
86 | // Define props with TypeScript interface
87 | interface Props {
88 |   modelValue: [string, string] | null; // [startDate, endDate] as a tuple or null
89 |   label?: string;
90 |   placeholder?: string;
91 |   hint?: string;
92 |   disabled?: boolean;
93 |   required?: boolean;
94 |   dialogTitle?: string;
95 |   dateFormat?: string;
96 |   minDate?: string;
97 |   maxDate?: string;
98 | }
99 | 
100 | const props = withDefaults(defineProps<Props>(), {
101 |   label: 'Date range',
102 |   placeholder: 'Select a date range',
103 |   hint: '',
104 |   disabled: false,
105 |   required: false,
106 |   dialogTitle: 'Choose a date range',
107 |   dateFormat: 'DD.MM.YYYY',
108 |   minDate: undefined,
109 |   maxDate: undefined,
110 |   density: 'default',
111 |   variant: 'outlined'
112 | });
113 | 
114 | // Define emits with TypeScript
115 | const emit = defineEmits<{
116 |   (e: 'update:modelValue', value: [string, string] | null): void;
117 | }>();
118 | 
119 | // State
120 | const showDialog = ref(false);
121 | const selectedDates = ref<string[]>([]);
122 | const displayValue = ref('');
123 | 
124 | // Computed properties
125 | const canSetDates = computed(() => {
126 |   return selectedDates.value.length >= 2;
127 | });
128 | 
129 | // Rules for validation
130 | const rules = computed(() => {
131 |   const rules = [];
132 |   if (props.required) {
133 |     rules.push((v: string) => !!v || `${props.label} is required`);
134 |   }
135 |   return rules;
136 | });
137 | 
138 | // Format date for the dialog preview
139 | const formatSelectedDatePreview = (dateStr: string): string => {
140 |   return formatDate(dateStr, props.dateFormat);
141 | };
142 | 
143 | // Methods
144 | const openDialog = () => {
145 |   if (props.disabled) return;
146 | 
147 |   // Initialize selected dates based on current values
148 |   selectedDates.value = [];
149 |   if (props.modelValue) {
150 |     selectedDates.value = [...props.modelValue];
151 |   }
152 | 
153 |   showDialog.value = true;
154 | };
155 | 
156 | const closeDialog = () => {
157 |   showDialog.value = false;
158 | };
159 | 
160 | const clearSelection = () => {
161 |   selectedDates.value = [];
162 |   displayValue.value = '';
163 |   emit('update:modelValue', null);
164 |   closeDialog();
165 | };
166 | 
167 | const setDates = () => {
168 |   if (selectedDates.value.length >= 2) {
169 |     // Sort the dates to ensure start is before end
170 |     const sortedDates = [...selectedDates.value].sort();
171 |     const startDate = sortedDates[0];
172 |     const endDate = sortedDates[sortedDates.length - 1];
173 | 
174 |     emit('update:modelValue', [startDate, endDate]);
175 |     closeDialog();
176 |   }
177 | };
178 | 
179 | // Update display value when model value changes
180 | const updateDisplayValue = () => {
181 |   if (!props.modelValue || props.modelValue.length !== 2) {
182 |     displayValue.value = '';
183 |     return;
184 |   }
185 | 
186 |   const [start, end] = props.modelValue;
187 | 
188 |   if (start && end) {
189 |     const startFormatted = formatDate(start, props.dateFormat);
190 |     const endFormatted = formatDate(end, props.dateFormat);
191 |     displayValue.value = `${startFormatted} - ${endFormatted}`;
192 |   } else {
193 |     displayValue.value = '';
194 |   }
195 | };
196 | 
197 | // Watch for model value changes
198 | watch(() => props.modelValue, () => {
199 |   updateDisplayValue();
200 | }, {immediate: true});
201 | 
202 | // Watch for selected dates changes
203 | watch(() => selectedDates.value, (newVal) => {
204 |   if (newVal.length >= 2) {
205 |     // Update the preview in the input field even before confirming
206 |     const sortedDates = [...newVal].sort();
207 |     const startPreview = formatDate(sortedDates[0], props.dateFormat);
208 |     const endPreview = formatDate(sortedDates[sortedDates.length - 1], props.dateFormat);
209 |     displayValue.value = `${startPreview} - ${endPreview}`;
210 |   }
211 | });
212 | </script>
213 | 
214 | <style scoped>
215 | .date-picker-dialog {
216 |   overflow: hidden;
217 | }
218 | 
219 | .weekday-header {
220 |   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
221 |   position: relative;
222 |   z-index: 1;
223 |   background-color: white;
224 | }
225 | </style>
```

src/components/overview/MediaplanActionMenu.vue
```
```

src/components/overview/MediaplanCard.vue
```
1 | <template>
2 |   <div class="position-relative card-wrapper">
3 |     <v-card 
4 |       class="h-100 pa-3 mediaplan-card" 
5 |       elevation="3" 
6 |       :data-mediaplan-id="mediaplan._id"
7 |       @click="handleCardClick"
8 |     >
9 |     <v-card-item class="pb-8">
10 |       <div class="d-flex align-center">
11 |         <v-tooltip
12 |             location="top"
13 |             open-delay="300"
14 |         >
15 |           <template v-slot:activator="{ props }">
16 |             <div
17 |                 class="text-h6 text-truncate mediaplan-title pr-1"
18 |                 v-bind="props"
19 |             >
20 |               {{ mediaplan.name }}
21 |             </div>
22 |           </template>
23 |           <span>{{ mediaplan.name }}</span>
24 |         </v-tooltip>
25 |         <v-icon size="x-small" color="primary" icon="mdi-pencil" class="mr-3"/>
26 | 
27 |         <!-- Brand logo -->
28 |         <v-img
29 |             :src="getBrandLogo(mediaplan.brand)"
30 |             max-width="40"
31 |             contain
32 |             class="ml-auto"
33 |         />
34 |       </div>
35 | 
36 |       <!-- Status and date range on same row -->
37 |       <div class="d-flex align-center justify-space-between mt-2">
38 |         <div class="d-flex align-center">
39 |           <v-icon
40 |               icon="mdi-circle"
41 |               :color="getMediaplanStatusColor(mediaplan.status)"
42 |               size="x-small"
43 |               class="mr-1"
44 |           />
45 |           <span class="status-text text-grey">{{ getMediaplanStatusLabel(mediaplan.status) }}</span>
46 |         </div>
47 | 
48 |         <div class="d-flex align-center">
49 |           <v-icon size="small" icon="mdi-calendar-range" class="mr-1"/>
50 |           <span class="date-range-text text-grey">{{ formatDateRange(mediaplan.start_date, mediaplan.end_date) }}</span>
51 |         </div>
52 |       </div>
53 |     </v-card-item>
54 | 
55 |     <v-card-text>
56 |       <!-- Creator row -->
57 |       <div class="d-flex justify-space-between mb-3">
58 |         <span class="text-subtitle-2">Creator</span>
59 |         <span class="text-subtitle-2 font-weight-medium">{{ mediaplan.created_by?.name || 'N/A' }}</span>
60 |       </div>
61 | 
62 |       <v-divider class="pt-1 pb-4"></v-divider>
63 |       <!-- Total Budget row -->
64 |       <div class="d-flex justify-space-between mb-3">
65 |         <span class="text-subtitle-2">Total Budget</span>
66 |         <div class="d-flex align-center">
67 |           <v-icon size="x-small" icon="mdi-circle" color="green" class="mr-1"/>
68 |           <span class="text-subtitle-2 font-weight-medium">{{ formatCurrency(mediaplan.budget?.total) }}</span>
69 |         </div>
70 |       </div>
71 | 
72 |       <v-divider class="pt-1 pb-4"></v-divider>
73 |       <!-- Used Budget row -->
74 |       <div class="d-flex justify-space-between mb-3">
75 |         <span class="text-subtitle-2">Used Budget</span>
76 |         <div class="d-flex align-center">
77 |           <v-icon size="x-small" icon="mdi-circle" color="red" class="mr-1"/>
78 |           <span class="text-subtitle-2 font-weight-medium">{{ formatCurrency(mediaplan.budget?.used) }}</span>
79 |         </div>
80 |       </div>
81 | 
82 |       <v-divider class="pt-1 pb-4"></v-divider>
83 |       <!-- PO Numbers row -->
84 |       <div class="d-flex justify-space-between" v-if="mediaplan.po_numbers && mediaplan.po_numbers.length > 0">
85 |         <span class="text-subtitle-2">PO</span>
86 |         <span class="text-subtitle-2 font-weight-medium text-truncate" style="max-width: 70%">
87 |           {{ mediaplan.po_numbers.map(po => po.name).join(', ') }}
88 |         </span>
89 |       </div>
90 |     </v-card-text>
91 | 
92 |     <v-card-actions>
93 |       <!-- Action buttons -->
94 |       <v-spacer/>
95 |       
96 |       <!-- Options menu -->
97 |       <mediaplan-options-menu
98 |           :mediaplan-id="mediaplan._id"
99 |           @action="handleMenuAction"
100 |       />
101 | 
102 |       <!-- Navigation button -->
103 |       <v-btn
104 |           variant="flat"
105 |           color="primary"
106 |           :to="{ name: 'MediaplanDetail', params: { id: mediaplan._id }}"
107 |       >
108 |         Show Mediaplan
109 |       </v-btn>
110 |       <br>
111 | 
112 |     </v-card-actions>
113 |   </v-card>
114 |   </div>
115 | </template>
116 | 
117 | 
118 | <script setup lang="ts">
119 | import { ref } from 'vue';
120 | import { Mediaplan } from '@/types/mediaplan';
121 | import { getMediaplanStatusColor, getMediaplanStatusLabel } from '@/constants/mediaplanStatuses';
122 | import MediaplanOptionsMenu from "@/components/overview/MediaplanOptionsMenu.vue";
123 | import { useRouter } from 'vue-router';
124 | import { formatDateRange } from '@/helpers/dateUtils';
125 | import { formatCurrency } from '@/helpers/currencyUtils';
126 | import { getBrandLogo } from '@/helpers/brandUtils';
127 | 
128 | // Store mediaplan prop in a variable to access it throughout the component
129 | const props = defineProps<{
130 |   mediaplan: Mediaplan;
131 | }>();
132 | 
133 | const emit = defineEmits<{
134 |   (e: 'view', id: string): void;
135 |   (e: 'edit', id: string): void;
136 |   (e: 'add-po', id: string): void;
137 |   (e: 'export', id: string): void;
138 |   (e: 'duplicate', id: string): void;
139 |   (e: 'archive', id: string): void;
140 |   (e: 'delete', id: string): void;
141 | }>();
142 | 
143 | const router = useRouter();
144 | 
145 | // Handle card click for navigation
146 | const handleCardClick = (event: MouseEvent) => {
147 |   // Don't navigate if clicking on buttons or menu items
148 |   if ((event.target as HTMLElement).closest('.v-card__actions')) {
149 |     return;
150 |   }
151 |   
152 |   // Navigate to detail page
153 |   router.push({ name: 'MediaplanDetail', params: { id: props.mediaplan._id }});
154 | };
155 |   
156 | const handleMenuAction = (action: string, id: string) => {
157 |   switch (action) {
158 |     case 'view':
159 |       router.push({ name: 'MediaplanDetail', params: { id }});
160 |       break;
161 |     case 'edit':
162 |       router.push({ name: 'MediaplanEdit', params: { id }});
163 |       break;
164 |     case 'addPo':
165 |       emit('add-po', id);
166 |       break;
167 |     case 'export':
168 |       emit('export', id);
169 |       break;
170 |     case 'duplicate':
171 |       emit('duplicate', id);
172 |       break;
173 |     case 'archive':
174 |       emit('archive', id);
175 |       break;
176 |     case 'delete':
177 |       emit('delete', id);
178 |       break;
179 |   }
180 | };
181 | </script>
182 | 
183 | <style scoped>
184 | .mediaplan-title {
185 |   overflow: hidden;
186 |   text-overflow: ellipsis;
187 |   white-space: nowrap;
188 |   flex: 1;
189 | }
190 | 
191 | .status-text, .date-range-text {
192 |   font-size: 12px;
193 | }
194 | 
195 | .mediaplan-card {
196 |   cursor: pointer;
197 |   transition: transform 0.2s, box-shadow 0.2s;
198 | }
199 | 
200 | .mediaplan-card:hover {
201 |   transform: translateY(-4px);
202 |   box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
203 | }
204 | 
205 | /* Override cursor for buttons and menu */
206 | .v-menu__content, 
207 | .v-card__actions .v-btn {
208 |   cursor: default;
209 | }
210 | </style>
```

src/components/overview/MediaplanFilters.vue
```
1 | <!-- File: src/components/overview/MediaplanFilters.vue -->
2 | <template>
3 |   <!-- Main filters row -->
4 |   <div class="filter-container">
5 |     <!-- Brand dropdown -->
6 |     <div class="filter-item">
7 |       <v-select
8 |           v-model="localBrandId"
9 |           :items="props.sources.brands"
10 |           item-title="name"
11 |           item-value="_id"
12 |           label="Brand"
13 |           variant="underlined"
14 |           hide-details
15 |           prepend-inner-icon="mdi-filter"
16 |           :disabled="props.loading"
17 |       />
18 |     </div>
19 | 
20 |     <!-- Sort dropdown -->
21 |     <div class="filter-item">
22 |       <v-select
23 |           v-model="localSort"
24 |           :items="sortOptions"
25 |           item-title="text"
26 |           item-value="value"
27 |           label="Sort by"
28 |           variant="underlined"
29 |           hide-details
30 |           prepend-inner-icon="mdi-sort"
31 |           :disabled="props.loading"
32 |       />
33 |     </div>
34 | 
35 |     <!-- Countries dropdown -->
36 |     <div class="filter-item">
37 |       <v-autocomplete
38 |           v-model="localCountries"
39 |           :items="props.sources.countries"
40 |           item-title="value"
41 |           item-value="abbreviation"
42 |           label="Country Selection"
43 |           variant="underlined"
44 |           hide-details
45 |           multiple
46 |           chips
47 |           closable-chips
48 |           prepend-inner-icon="mdi-filter"
49 |           :disabled="props.loading"
50 |       />
51 |     </div>
52 | 
53 |     <!-- Filter type dropdown -->
54 |     <div class="filter-item">
55 |       <v-select
56 |           v-model="localStatus"
57 |           :items="filterOptions"
58 |           item-title="text"
59 |           item-value="value"
60 |           label="Filter by"
61 |           variant="underlined"
62 |           hide-details
63 |           prepend-inner-icon="mdi-filter"
64 |           :disabled="props.loading"
65 |       />
66 |     </div>
67 | 
68 |     <!-- Search field -->
69 |     <div class="filter-item search-field">
70 |       <v-text-field
71 |           v-model="localSearch"
72 |           placeholder="Search..."
73 |           prepend-inner-icon="mdi-magnify"
74 |           variant="underlined"
75 |           hide-details
76 |           flat
77 |           single-line
78 |           clearable
79 |           :disabled="props.loading"
80 |       />
81 |     </div>
82 | 
83 |     <!-- Create button -->
84 |     <div class="filter-item create-button">
85 |       <create-mediaplan-button :disabled="props.loading" />
86 |     </div>
87 |   </div>
88 | </template>
89 | 
90 | <script setup lang="ts">
91 | import { computed } from 'vue';
92 | import type { MediaplanFilter, FilterSources } from '@/types';
93 | import CreateMediaplanButton from "@/components/overview/CreateMediaplanButton.vue";
94 | 
95 | // Props
96 | const props = defineProps<{
97 |   filters: MediaplanFilter;
98 |   sources: FilterSources;
99 |   loading: boolean;
100 |   sortBy: string;
101 |   sortOrder: 'asc' | 'desc';
102 | }>();
103 | 
104 | // Emits
105 | const emit = defineEmits<{
106 |   (e: 'update:filter', payload: { key: keyof MediaplanFilter; value: unknown }): void;
107 |   (e: 'update:sort',   payload: { sortBy: string; sortOrder: 'asc'|'desc' }): void;
108 | }>();
109 | 
110 | // Sort & filter options
111 | const sortOptions = [
112 |   { text: 'Last updated first', value: 'updated_at:desc' },
113 |   { text: 'Earliest Start Date first', value: 'start_date:asc' },
114 |   { text: 'Start Date Descending', value: 'start_date:desc' },
115 |   { text: 'Creation Date Ascending', value: 'created_at:asc' },
116 |   { text: 'Creation Date Descending', value: 'created_at:desc' },
117 |   { text: 'End Date Ascending', value: 'end_date:asc' },
118 |   { text: 'End Date Descending', value: 'end_date:desc' },
119 |   { text: 'Budget Highest First', value: 'budget.total:desc' },
120 |   { text: 'Budget Lowest First', value: 'budget.total:asc' }
121 | ];
122 | const filterOptions = [
123 |   { text: 'All', value: '' },
124 |   { text: 'Created by me', value: 'created_by_me' },
125 |   { text: 'Approval requested', value: 'approval_requested' },
126 |   { text: 'Currently running', value: 'currently_running' },
127 |   { text: 'Active', value: 'active' },
128 |   { text: 'Inactive', value: 'inactive' },
129 |   { text: 'Draft', value: 'draft' },
130 |   { text: 'Archived', value: 'archived' },
131 |   { text: 'For Approval', value: 'for_approval' }
132 | ];
133 | 
134 | // Computed bridges for v-model
135 | const localSearch = computed({
136 |   get: () => props.filters.search || '',
137 |   set: v => emit('update:filter', { key: 'search', value: v })
138 | });
139 | const localBrandId = computed({
140 |   get: () => props.filters.brand_id || null,
141 |   set: v => emit('update:filter', { key: 'brand_id', value: v })
142 | });
143 | const localStatus = computed({
144 |   get: () => props.filters.status || '',
145 |   set: v => emit('update:filter', { key: 'status', value: v })
146 | });
147 | const localCountries = computed<string[]>({
148 |   get: () => props.filters.country ? (props.filters.country as string).split(',') : [],
149 |   set: arr => emit('update:filter', { key: 'country', value: arr.join(',') })
150 | });
151 | const localSort = computed({
152 |   get: () => `${props.sortBy}:${props.sortOrder}`,
153 |   set: v => {
154 |     const [by, order] = v.split(':') as [string, 'asc'|'desc'];
155 |     emit('update:sort', { sortBy: by, sortOrder: order });
156 |   }
157 | });
158 | </script>
159 | 
160 | <style scoped>
161 | .filter-container {
162 |   display: flex;
163 |   flex-wrap: wrap;
164 |   gap: 16px;
165 |   align-items: center;
166 |   width: 100%;
167 | }
168 | .filter-item {
169 |   min-width: 180px;
170 | }
171 | /* Search field grows to fill available space */
172 | .search-field {
173 |   flex-grow: 1;
174 |   min-width: 200px;
175 |   max-width: 280px;
176 | }
177 | /* Create button stays on the right */
178 | .create-button {
179 |   margin-left: auto;
180 |   min-width: auto;
181 | }
182 | /* Media queries for smaller screens */
183 | @media (max-width: 1200px) {
184 |   .filter-item {
185 |     min-width: 160px;
186 |   }
187 | }
188 | @media (max-width: 960px) {
189 |   .filter-container {
190 |     grid-template-columns: 1fr 1fr;
191 |   }
192 |   .filter-item {
193 |     min-width: 140px;
194 |   }
195 |   .search-field {
196 |     flex-basis: 100%;
197 |     order: 5;
198 |   }
199 |   .create-button {
200 |     margin-left: 0;
201 |     flex-basis: 100%;
202 |     order: 6;
203 |     display: flex;
204 |     justify-content: flex-end;
205 |   }
206 | }
207 | @media (max-width: 600px) {
208 |   .filter-item {
209 |     flex-basis: 100%;
210 |   }
211 | }
212 | </style>
```

src/components/overview/MediaplanList.vue
```
1 | <template>
2 |   <div v-if="isLoading && mediaplans.length === 0" class="d-flex justify-center align-center my-10">
3 |     <v-progress-circular indeterminate color="primary" size="64"/>
4 |   </div>
5 |   <div v-else>
6 |     <v-row v-if="mediaplans.length > 0" class="justify-center">
7 |       <v-col
8 |           v-for="mediaplan in mediaplans"
9 |           :key="mediaplan._id"
10 |           cols="12" sm="6" md="4" lg="3"
11 |           class="mb-4 mediaplan-col d-flex"
12 |       >
13 |         <mediaplan-card
14 |             :mediaplan="mediaplan"
15 |             class="flex-grow-1"
16 |             @view="viewMediaplan"
17 |         />
18 |       </v-col>
19 |     </v-row>
20 | 
21 |     <div v-if="!isLoading && mediaplans.length === 0" class="text-center my-10 text-disabled">
22 |       <v-icon size="x-large" class="mb-2">mdi-database-off-outline</v-icon>
23 |       <p>No mediaplans found</p>
24 |       <p class="text-caption">Try adjusting your filters.</p>
25 |     </div>
26 | 
27 |     <pagination-controls
28 |         v-if="!isLoading && totalPages > 1"
29 |         v-model="paginationModel"
30 |         :length="totalPages"
31 |         :disabled="isLoading"
32 |         :items-per-page-value="itemsPerPageModel"
33 |         @update:items-per-page="itemsPerPageModel = $event"
34 |     />
35 | 
36 |     <div v-if="!isLoading && totalItems > 0" class="text-center text-caption text-medium-emphasis mt-2">
37 |       {{ paginationInfo }}
38 |     </div>
39 |   </div>
40 | </template>
41 | 
42 | <script setup lang="ts">
43 | import {ref, computed, watch} from 'vue';
44 | import {useRouter} from 'vue-router';
45 | import type {Mediaplan} from '@/types/mediaplan'; // Pfad prüfen
46 | import MediaplanCard from '@/components/overview/MediaplanCard.vue'; // Pfad prüfen
47 | import PaginationControls from '@/components/common/PaginationControls.vue'; // Pfad prüfen
48 | 
49 | // --- Props ---
50 | // Empfängt jetzt Daten und Zustand direkt von Overview.vue (aus dem Store)
51 | interface Props {
52 |   mediaplans: Mediaplan[];
53 |   isLoading: boolean;
54 |   totalPages: number;
55 |   totalItems: number;
56 |   currentPage: number; // 0-basiert
57 |   itemsPerPage: number;
58 | }
59 | 
60 | const props = defineProps<Props>();
61 | 
62 | // --- Emits ---
63 | // Meldet nur noch Benutzerinteraktionen nach oben, die eine Änderung im Store erfordern
64 | const emit = defineEmits<{
65 |   (e: 'update:page', page: number): void; // Meldet gewünschte Seitenänderung (1-basiert von PaginationControls)
66 |   (e: 'update:items-per-page', perPage: number): void; // Meldet gewünschte Items pro Seite Änderung
67 | }>();
68 | 
69 | // --- Router ---
70 | const router = useRouter();
71 | 
72 | // --- Computed Properties ---
73 | 
74 | // Aktuelle Seite für PaginationControls (oft 1-basiert)
75 | const paginationModel = computed({
76 |   get: () => props.currentPage + 1, // Konvertiere 0-basierte Prop zu 1-basierter Anzeige
77 |   set: (value: number) => {
78 |     // Wenn das v-model von PaginationControls sich ändert, wird das Event nach oben emittiert
79 |     emit('update:page', value);
80 |   }
81 | });
82 | 
83 | // Aktuelle Items pro Seite für PaginationControls
84 | const itemsPerPageModel = computed({
85 |   get: () => props.itemsPerPage,
86 |   set: (value: number) => {
87 |     emit('update:items-per-page', value);
88 |   }
89 | });
90 | 
91 | // Info-Text für Paginierung
92 | const paginationInfo = computed(() => {
93 |   if (props.totalItems === 0) return '';
94 |   const startItem = (props.currentPage * props.itemsPerPage) + 1;
95 |   const endItem = Math.min(startItem + props.itemsPerPage - 1, props.totalItems);
96 |   return `${startItem}-${endItem} of ${props.totalItems} mediaplans`;
97 | });
98 | 
99 | 
100 | // --- Methods ---
101 | const viewMediaplan = (mediaplanId: string) => {
102 |   router.push({name: 'MediaplanDetail', params: {id: mediaplanId}});
103 | };
104 | 
105 | // --- Interne Logik ---
106 | // Keine eigene Datenabfrage (fetchMediaplans) mehr
107 | // Kein eigener Ladezustand, Fehlerstatus, etc. - kommt alles über Props
108 | 
109 | </script>
110 | 
111 | 
112 | <style scoped>
113 | .mediaplan-col {
114 |   min-width: 300px; /* Etwas kleiner für bessere Anpassung */
115 |   /* max-width: 420px; */ /* Max-Breite kann oft weggelassen werden, wenn cols gesetzt sind */
116 | }
117 | 
118 | .d-flex {
119 |   display: flex;
120 | }
121 | 
122 | .flex-grow-1 {
123 |   flex-grow: 1;
124 | }
125 | </style>
```

src/components/overview/MediaplanOptionsMenu.vue
```
1 | <template>
2 |   <v-menu v-model="isOpen" :close-on-content-click="false">
3 |     <template v-slot:activator="{ props }">
4 |       <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop></v-btn>
5 |     </template>
6 | 
7 |     <v-card min-width="280">
8 |       <v-toolbar density="compact" color="white">
9 |         <v-toolbar-title class="text-body-1 font-weight-medium">Options</v-toolbar-title>
10 |         <v-spacer></v-spacer>
11 |         <v-btn icon variant="text" color="primary" size="small" @click.stop="isOpen = false">
12 |           <v-icon>mdi-close</v-icon>
13 |         </v-btn>
14 |       </v-toolbar>
15 | 
16 |       <v-list class="menu-list">
17 |         <v-list-item @click.stop="handleAction('view')" class="menu-item">
18 |           <template v-slot:prepend>
19 |             <v-icon icon="mdi-eye" size="small"></v-icon>
20 |           </template>
21 |           <v-list-item-title>View Mediaplan</v-list-item-title>
22 |         </v-list-item>
23 | 
24 |         <v-list-item @click.stop="handleAction('edit')" class="menu-item">
25 |           <template v-slot:prepend>
26 |             <v-icon icon="mdi-pencil-outline" size="small"></v-icon>
27 |           </template>
28 |           <v-list-item-title>Edit base data</v-list-item-title>
29 |         </v-list-item>
30 | 
31 |         <v-list-item @click.stop="handleAction('addPo')" class="menu-item">
32 |           <template v-slot:prepend>
33 |             <v-icon icon="mdi-plus" size="small"></v-icon>
34 |           </template>
35 |           <v-list-item-title>Add PO Number</v-list-item-title>
36 |         </v-list-item>
37 | 
38 |         <v-list-item @click.stop="handleAction('export')" class="menu-item">
39 |           <template v-slot:prepend>
40 |             <v-icon icon="mdi-download" size="small"></v-icon>
41 |           </template>
42 |           <v-list-item-title>Export Mediaplan</v-list-item-title>
43 |         </v-list-item>
44 | 
45 |         <v-list-item @click.stop="handleAction('duplicate')" class="menu-item">
46 |           <template v-slot:prepend>
47 |             <v-icon icon="mdi-content-copy" size="small"></v-icon>
48 |           </template>
49 |           <v-list-item-title>Duplicate MediaPlan</v-list-item-title>
50 |         </v-list-item>
51 | 
52 |         <v-list-item @click.stop="handleAction('archive')" class="menu-item">
53 |           <template v-slot:prepend>
54 |             <v-icon icon="mdi-archive-outline" size="small"></v-icon>
55 |           </template>
56 |           <v-list-item-title>Archive Mediaplan</v-list-item-title>
57 |         </v-list-item>
58 | 
59 |         <v-list-item @click.stop="handleAction('delete')" class="menu-item">
60 |           <template v-slot:prepend>
61 |             <v-icon icon="mdi-delete-outline" size="small"></v-icon>
62 |           </template>
63 |           <v-list-item-title>Delete MediaPlan</v-list-item-title>
64 |         </v-list-item>
65 |       </v-list>
66 |     </v-card>
67 |   </v-menu>
68 | </template>
69 | 
70 | <script setup lang="ts">
71 | import {ref} from 'vue';
72 | 
73 | // Props
74 | const props = defineProps<{
75 |   mediaplanId: string;
76 | }>();
77 | 
78 | // Emit events
79 | const emit = defineEmits<{
80 |   (e: 'action', action: string, mediaplanId: string): void;
81 | }>();
82 | 
83 | // State
84 | const isOpen = ref(false);
85 | 
86 | // Methods
87 | const handleAction = (action: string) => {
88 |   // Prevent event propagation
89 |   event?.stopPropagation();
90 |   
91 |   emit('action', action, props.mediaplanId);
92 |   isOpen.value = false;
93 | };
94 | </script>
95 | 
96 | <style scoped>
97 | .menu-list .v-list-item {
98 |   border-top: 1px solid #e0e0e0;
99 | }
100 | 
101 | </style>
```

src/components/overview/PaginationControls.vue
```
```

src/components/project/CampaignListView.vue
```
1 | <script setup lang="ts">
2 | import {ref, computed} from 'vue';
3 | import type {Campaign} from '@/types/campaign';
4 | import {useRouter} from 'vue-router';
5 | 
6 | // --- Props ---
7 | interface Props {
8 |   campaigns: Campaign[];
9 |   totalCampaigns: number;
10 |   isLoading: boolean;
11 |   currentPage: number;
12 |   itemsPerPage: number;
13 | }
14 | 
15 | const props = withDefaults(defineProps<Props>(), { /* ... defaults ... */});
16 | 
17 | // --- Emits ---
18 | const emit = defineEmits<{
19 |   (e: 'addCampaign'): void;
20 |   (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
21 | }>();
22 | 
23 | // --- Router ---
24 | const router = useRouter();
25 | 
26 | // --- Tabelle Models & Header ---
27 | const pageModel = computed({
28 |   get: () => props.currentPage + 1, set: () => {
29 |   }
30 | });
31 | const itemsPerPageModel = computed({
32 |   get: () => props.itemsPerPage, set: () => {
33 |   }
34 | });
35 | const headers = ref([
36 |   {title: 'Campaign Name', key: 'campaignname', sortable: true},
37 |   {title: 'Type', key: 'type', sortable: true},
38 |   {title: 'Subsegment', key: 'subsegment', sortable: true},
39 |   {title: 'Product', key: 'product', sortable: true},
40 |   {title: 'Language', key: 'language', sortable: true},
41 |   {title: 'Campaign Type', key: 'campaigntype', sortable: true},
42 |   {title: 'Detail', key: 'campaigndetail', sortable: false, width: '200px'},
43 |   {title: 'Created', key: 'created_at', sortable: true},
44 |   {title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '60px'}
45 | ]);
46 | 
47 | // --- Methoden ---
48 | const onOptionsUpdate = (options: any) => {
49 |   emit('update:options', options);
50 | };
51 | const triggerAddCampaign = () => {
52 |   emit('addCampaign');
53 | };
54 | const editCampaign = (item: Campaign) => {
55 |   console.log('Edit Campaign:', item._id);
56 | };
57 | const deleteCampaign = (item: Campaign) => {
58 |   console.log('Delete Campaign:', item._id);
59 | };
60 | 
61 | </script>
62 | 
63 | <template>
64 |   <div class="campaign-list-container">
65 |     <v-card class="campaigns-table elevation-1" variant="outlined">
66 |       <v-data-table-server
67 |           v-model:items-per-page="itemsPerPageModel"
68 |           v-model:page="pageModel"
69 |           :headers="headers"
70 |           :items="campaigns"
71 |           :items-length="totalCampaigns"
72 |           :loading="isLoading"
73 |           :items-per-page-options="[15, 30, 50, 100]"
74 |           item-value="_id"
75 |           hover
76 |           class="campaigns-data-table"
77 |           @update:options="onOptionsUpdate"
78 |       >
79 |         <template v-slot:item.campaignname="{ item }"> {{ item.campaignname }}</template>
80 |         <template v-slot:item.created_at="{ item }">
81 |           {{ item.created_at ? new Date(item.created_at).toLocaleDateString('de-DE') : '-' }}
82 |         </template>
83 |         <template v-slot:item.campaigndetail="{ item }">
84 |           <span class="d-inline-block text-truncate" style="max-width: 200px;"> {{ item.campaigndetail || '-' }} </span>
85 |           <v-tooltip v-if="item.campaigndetail && item.campaigndetail.length > 30" activator="parent" location="top"
86 |                      max-width="300px"> {{ item.campaigndetail }}
87 |           </v-tooltip>
88 |         </template>
89 |         <template v-slot:item.actions="{ item }">
90 |           <v-menu>
91 |             <template v-slot:activator="{ props: menuProps }">
92 |               <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
93 |             </template>
94 |             <v-list density="compact">
95 |               <v-list-item @click.stop="editCampaign(item)">
96 |                 <template v-slot:prepend>
97 |                   <v-icon size="small">mdi-pencil</v-icon>
98 |                 </template>
99 |                 <v-list-item-title>Edit</v-list-item-title>
100 |               </v-list-item>
101 |               <v-list-item @click.stop="deleteCampaign(item)" class="text-error">
102 |                 <template v-slot:prepend>
103 |                   <v-icon size="small">mdi-delete-outline</v-icon>
104 |                 </template>
105 |                 <v-list-item-title>Delete</v-list-item-title>
106 |               </v-list-item>
107 |             </v-list>
108 |           </v-menu>
109 |         </template>
110 |         <template v-slot:loading>
111 |           <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
112 |         </template>
113 |         <template v-slot:no-data>
114 |           <div class="text-center pa-4 text-grey">
115 |             <v-icon size="large" class="mb-2">mdi-bullhorn-off-outline</v-icon>
116 |             <p>No campaigns found for this project.</p></div>
117 |         </template>
118 | 
119 |         <template v-slot:bottom>
120 |           <v-divider></v-divider>
121 |           <div class="d-flex align-center pa-3">
122 |             <v-btn prepend-icon="mdi-plus" variant="text" @click="triggerAddCampaign" :disabled="isLoading">
123 |               Add Campaign
124 |             </v-btn>
125 |             <v-spacer></v-spacer>
126 |             <span class="text-caption mr-4 text-disabled" v-if="totalCampaigns > 0 && !isLoading">
127 |                   Total: {{ totalCampaigns }} Campaigns
128 |                </span>
129 |           </div>
130 |         </template>
131 |       </v-data-table-server>
132 |     </v-card>
133 |   </div>
134 | </template>
135 | 
136 | <style scoped> /* ... */ </style>
```

src/components/common/dialog/DialogFooter.vue
```
1 | <template>
2 |   <v-card-actions class="pt-4 px-0 d-flex justify-end">
3 |     <v-btn
4 |         size="large"
5 |         min-width="120"
6 |         variant="outlined"
7 |         @click="$emit('cancel')"
8 |         class="mr-2"
9 |         :disabled="cancelDisabled"
10 |     >
11 |       {{ cancelText }}
12 |     </v-btn>
13 |     <v-btn
14 |         min-width="120"
15 |         size="large"
16 |         color="primary"
17 |         :type="submitButton ? 'submit' : 'button'"
18 |         variant="flat"
19 |         :loading="loading"
20 |         :disabled="disabled"
21 |         @click="submitButton ? null : $emit('confirm')"
22 |     >
23 |       {{ confirmText }}
24 |     </v-btn>
25 |   </v-card-actions>
26 | </template>
27 | 
28 | <script setup lang="ts">
29 | interface Props {
30 |   /**
31 |    * Text for cancel button
32 |    * @default "Cancel"
33 |    */
34 |   cancelText?: string;
35 | 
36 |   /**
37 |    * Text for confirm button
38 |    * @default "Next Step"
39 |    */
40 |   confirmText?: string;
41 | 
42 |   /**
43 |    * Whether confirm button is in loading state
44 |    * @default false
45 |    */
46 |   loading?: boolean;
47 | 
48 |   /**
49 |    * Whether confirm button is disabled
50 |    * @default false
51 |    */
52 |   disabled?: boolean;
53 | 
54 |   /**
55 |    * Whether cancel button is disabled
56 |    * @default false
57 |    */
58 |   cancelDisabled?: boolean;
59 | 
60 |   /**
61 |    * Whether confirm button should be a submit button
62 |    * @default true
63 |    */
64 |   submitButton?: boolean;
65 | }
66 | 
67 | const props = withDefaults(defineProps<Props>(), {
68 |   cancelText: "Cancel",
69 |   confirmText: "Next Step",
70 |   loading: false,
71 |   disabled: false,
72 |   cancelDisabled: false,
73 |   submitButton: true
74 | });
75 | 
76 | defineEmits<{
77 |   (e: 'cancel'): void;
78 |   (e: 'confirm'): void;
79 | }>();
80 | </script>
```

src/components/common/dialog/DialogHeader.vue
```
1 | <template>
2 |   <v-card-title :class="['px-0', marginClass]">
3 |     <div class="d-flex align-center w-100">
4 |       <v-icon
5 |           v-if="showBackButton"
6 |           size="small"
7 |           @click="$emit('back')"
8 |           class="mr-2"
9 |           :color="backIconColor"
10 |       >
11 |         mdi-arrow-u-left-top
12 |       </v-icon>
13 |       <span :class="titleClass">{{ title }}</span>
14 |       <v-spacer></v-spacer>
15 |       <v-icon
16 |           v-if="showCloseButton"
17 |           size="small"
18 |           :color="closeIconColor"
19 |           @click="$emit('close')"
20 |       >
21 |         mdi-close
22 |       </v-icon>
23 |     </div>
24 |   </v-card-title>
25 | </template>
26 | 
27 | <script setup lang="ts">
28 | import {computed} from 'vue';
29 | 
30 | interface Props {
31 |   /**
32 |    * The title to display in the header
33 |    */
34 |   title: string;
35 | 
36 |   /**
37 |    * Whether to show the back button
38 |    * @default true
39 |    */
40 |   showBackButton?: boolean;
41 | 
42 |   /**
43 |    * Whether to show the close button
44 |    * @default true
45 |    */
46 |   showCloseButton?: boolean;
47 | 
48 |   /**
49 |    * The margin bottom to apply
50 |    * @default 6
51 |    */
52 |   marginBottom?: number | string;
53 | 
54 |   /**
55 |    * Color for the back icon
56 |    * @default undefined
57 |    */
58 |   backIconColor?: string;
59 | 
60 |   /**
61 |    * Color for the close icon
62 |    * @default undefined
63 |    */
64 |   closeIconColor?: string;
65 | 
66 |   /**
67 |    * CSS class for the title
68 |    * @default 'text-h5'
69 |    */
70 |   titleClass?: string;
71 | }
72 | 
73 | const props = withDefaults(defineProps<Props>(), {
74 |   showBackButton: true,
75 |   showCloseButton: true,
76 |   marginBottom: 2,
77 |   backIconColor: 'primary',
78 |   closeIconColor: 'primary',
79 |   titleClass: 'text-h6'
80 | });
81 | 
82 | /**
83 |  * Emitted when the back button is clicked
84 |  */
85 | /**
86 |  * Emitted when the close button is clicked
87 |  */
88 | const emit = defineEmits<{
89 |   (e: 'back'): void;
90 |   (e: 'close'): void;
91 | }>();
92 | 
93 | // Computed property for dynamic margin class
94 | const marginClass = computed(() => {
95 |   return `mb-${props.marginBottom}`;
96 | });
97 | </script>
```

src/components/common/dialog/FormElementVrowVcol.vue
```
1 | <template>
2 |   <v-row no-gutters class="align-center" :class="pb">
3 |     <v-col :class="pb">
4 |       <div class="text-caption text-medium-emphasis mb-1">
5 |         {{ label }}<span v-if="required">*</span>
6 |       </div>
7 |       <slot></slot>
8 |     </v-col>
9 |   </v-row>
10 | </template>
11 | 
12 | <script setup lang="ts">
13 | 
14 | const props = defineProps({
15 |   /** Label text for the form element (e.g. "Country") */
16 |   label: {
17 |     type: String,
18 |     required: true
19 |   },
20 |   /** If true, shows a required asterisk after the label */
21 |   required: {
22 |     type: Boolean,
23 |     default: false
24 |   },
25 |   /** Padding-bottom utility class, e.g. 'pb-0', 'pb-3' */
26 |   pb: {
27 |     type: String,
28 |     default: 'pb-0'
29 |   }
30 | });
31 | </script>
32 | 
33 | <style scoped>
34 | /* Inherits Vuetify theming; .text-error will color the asterisk */
35 | </style>
```

src/components/common/dialog/WithFormDefaults.vue
```
1 | <template>
2 |   <v-defaults-provider :defaults="defaults">
3 |     <slot />
4 |   </v-defaults-provider>
5 | </template>
6 | 
7 | <script setup lang="ts">
8 | const defaults = {
9 |   VTextField: {
10 |     variant: 'outlined',
11 |     density: 'comfortable',
12 |   },
13 |   VSelect: {
14 |     variant: 'outlined',
15 |     density: 'comfortable',
16 |   },
17 |   VDatePicker: {
18 |     variant: 'outlined',
19 |     density: 'comfortable',
20 |   },
21 |   VRadioGroup: {
22 |     density: 'comfortable',
23 |     hideDetails: true
24 |   },
25 |   VBtn: {
26 |   }
27 | };
28 | </script>
```
