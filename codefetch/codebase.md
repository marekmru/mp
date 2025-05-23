Project Structure:
├── README.md
├── codefetch
│   └── codebase.md
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
20 |     "vue": "^3.5.13",
21 |     "vue-router": "4",
22 |     "vuetify": "^3.7.16"
23 |   },
24 |   "devDependencies": {
25 |     "@vitejs/plugin-vue": "^5.2.1",
26 |     "@vue/tsconfig": "^0.7.0",
27 |     "typescript": "~5.7.2",
28 |     "vite": "^6.2.0",
29 |     "vue-tsc": "^2.2.4"
30 |   }
31 | }
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
5 | .v-table .v-table__wrapper > table > thead > tr > th,
6 | .v-table .v-table__wrapper > table > tbody > tr > td {
7 |     border-bottom: 5px solid #fff !important;
8 | }
9 | 
10 | .v-theme--dark.v-table.projects-data-table .v-table__wrapper > table > thead > tr > th {
11 |     background-color: #4D4D4D;
12 | }
13 | 
14 | .v-theme--dark.v-table.projects-data-table .v-table__wrapper > table > tbody > tr > td {
15 |     background-color: #666666;
16 | }
17 | 
18 | .v-table.campaigns-data-table .v-table__wrapper > table > thead > tr > th {
19 |     background-color: #BBBBBB !important;
20 | }
21 | 
22 | .v-table.campaigns-data-table .v-table__wrapper > table > tbody > tr > td {
23 |     background-color: #E6E6E6 !important;
24 | }
25 | 
26 | .v-table.lineitem-data-table .v-table__wrapper > table > thead > tr > th {
27 |     background-color: #E6E6E6 !important;
28 | }
29 | 
30 | .v-table.lineitem-data-table .v-table__wrapper > table > tbody > tr > td {
31 |     background-color: #ffffff !important;
32 | }
33 | 
34 | /*.v-table .v-table__wrapper > table > thead > tr > th:last-child,*/
35 | .v-table .v-table__wrapper > table > tbody > tr > td:last-child {
36 |     position: relative;
37 |     box-shadow: -6px 0px 8px -4px rgba(0, 0, 0, 0.33);
38 |     overflow: visible;
39 |     z-index: 1;
40 | }
41 | 
42 | .v-table .v-table__wrapper > table > thead > tr > th:last-child,
43 | .v-table .v-table__wrapper > table > tbody > tr > td:last-child {
44 |     padding-right: 8px;
45 |     padding-left: 12px;
46 |     width: 102px;
47 |     max-width: 102px;
48 | }
49 | 
50 | .name-link {
51 |     text-decoration: none;
52 |     font-weight: 500;
53 | }
54 | 
55 | .name-link:hover {
56 |     text-decoration: underline;
57 | }
58 | 
59 | 
60 | .v-table .name-link {
61 |     color: rgba(0, 0, 0, 0.87);
62 | }
63 | 
64 | .v-table .name-link {
65 |     color: #000;
66 | }
67 | 
68 | .v-table.v-theme--dark .name-link {
69 |     color: #fff;
70 | }
71 | 
72 | .v-table.v-theme--dark .name-link {
73 |     color: #E0E0E0;
74 | }
```

src/vite-env.d.ts
```
1 | /// <reference types="vite/client" />
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

src/constants/campaign.ts
```
1 | // src/constants/campaign.ts
2 | import {ref} from 'vue';
3 | 
4 | export const campaignHeaders = ref([
5 |     {title: 'Campaign Name', key: 'campaignname', sortable: true, align: 'start'}, // Hinzugefügt
6 |     {title: 'Budget', key: 'budget', sortable: false},
7 |     {title: '', key: 'lock', sortable: false, align: 'center'},
8 |     { title: '', key: 'actions', sortable: false, align: 'center' }
9 | ]);
```

src/constants/lineitem.ts
```
1 | import type { VDataTableServer } from 'vuetify/components/VDataTable';
2 | 
3 | type ReadonlyHeaders = VDataTableServer['$props']['headers'];
4 | 
5 | // Headers für die Line Item Tabelle
6 | export const lineitemHeaders: ReadonlyHeaders = [
7 |     // Checkbox Spalte wird durch 'show-select' in v-data-table-server aktiviert, kein expliziter Header nötig,
8 |     // aber wir können einen leeren Header für die Ausrichtung hinzufügen, falls gewünscht.
9 |     // { title: '', key: 'data-table-select', sortable: false, width: '1rem' }, // Optional für Styling/Breite
10 |     { title: 'Line Item Name', key: 'lineitemname', sortable: true, align: 'start' },
11 |     { title: 'Product', key: 'product', sortable: true },
12 |     { title: 'Phase', key: 'phase', sortable: true },
13 |     { title: 'Goal', key: 'goals', sortable: true },
14 |     { title: 'Tactic', key: 'targetingtactic', sortable: true },
15 |     { title: 'Created', key: 'created_at', sortable: true },
16 |     // { title: 'Updated', key: 'updated_at', sortable: true }, // Falls benötigt
17 |     // { title: 'Creatives', key: 'creatives', sortable: false }, // Benötigt spezielle Darstellung
18 |     { title: '', key: 'actions', sortable: false, align: 'center' } // Beispiel für Aktionen
19 | ];
20 | 
21 | // Stelle sicher, dass die 'key'-Werte mit den Feldern im Lineitem-Objekt übereinstimmen.
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

src/constants/project.ts
```
1 | export const projectHeaders = [
2 |     { title: 'Name', key: 'abbreviation', sortable: true, align: 'start' },
3 |     { title: 'Country', key: 'descriptive_vars.country', sortable: true },
4 |     { title: 'Duration', key: 'duration.formatted', sortable: false },
5 |     { title: 'Detail', key: 'detail', sortable: true },
6 |     { title: 'Campaign Type', key: 'default_vars.campaigntype', sortable: true },
7 |     { title: 'Subsegment', key: 'default_vars.subsegment', sortable: true },
8 |     { title: 'Budget', key: 'budget', sortable: true },
9 |     { title: '', key: 'is_locked', sortable: true, align: 'center' },
10 |     //{ title: '', key: 'edit', sortable: false, width: '50px' },
11 |     { title: '', key: 'actions', sortable: false, align: 'center' }
12 | ];
```

src/helpers/brandUtils.ts
```
1 | // src/helpers/brandUtils.ts
2 | 
3 | import type { Brand, EntityReference } from '@/types/mediaplan.ts';
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
32 |     const key = brand.toUpperCase();
33 |     return brandLogos[key] || '/img/brands/logoipsum.svg';
34 |   }
35 | 
36 |   if ('logo' in brand && brand.logo) {
37 |     return brand.logo;
38 |   }
39 | 
40 |   return brandLogos[brand.abbreviation] || '/img/brands/logoipsum.svg';
41 | };
42 | /**
43 |  * Gets brand initials for brands without logos
44 |  */
45 | export const getBrandInitials = (brand?: Brand | EntityReference): string => {
46 |   if (!brand || !brand.name) return '?';
47 | 
48 |   const words = brand.name.split(' ');
49 | 
50 |   if (words.length === 1) {
51 |     return words[0].substring(0, 2).toUpperCase();
52 |   }
53 | 
54 |   return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
55 | };
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
1 | import emitter from '@/helpers/emitter';
2 | import router from '@/router';
3 | 
4 | const baseURL = `${import.meta.env.VITE_API_BASE_MEDIAPLAN}`;
5 | const baseURLCore4 = `${import.meta.env.VITE_API_BASE_CORE4}`;
6 | 
7 | let isRedirecting = false;
8 | 
9 | const customFetch = async (url: string, options: RequestInit = {}) => {
10 |     try {
11 |         const userLS = localStorage.getItem('user');
12 |         if (userLS != null) {
13 |             const user = JSON.parse(userLS);
14 |             options.headers = {
15 |                 ...options.headers,
16 |                 Authorization: `Bearer ${user.token}`,
17 |             };
18 |         }
19 | 
20 |         const response = await fetch(`${baseURL}${url}`, options);
21 | 
22 |         if (response.status === 401) {
23 |             localStorage.removeItem('user');
24 |             emitter.emit('unauthorized');
25 | 
26 |             if (!isRedirecting && router.currentRoute.value.name !== 'Login') {
27 |                 isRedirecting = true;
28 |                 router.push({ name: 'Login' }).finally(() => {
29 |                     isRedirecting = false;
30 |                 });
31 |             }
32 |             throw new Error('Unauthorized');
33 |         } else if (response.status >= 400 && response.status < 500) {
34 |             const errorData = await response.json();
35 |             emitter.emit('error', errorData);
36 |             throw new Error(`Client error! status: ${response.status}, message: ${errorData.message || errorData.data}`);
37 |         } else if (response.status >= 500) {
38 |             const errorData = await response.json();
39 |             emitter.emit('error', errorData);
40 |             throw new Error(`Server error! status: ${response.status}`);
41 |         }
42 | 
43 |         if (!response.ok) {
44 |             throw new Error(`HTTP error! status: ${response.status}`);
45 |         }
46 | 
47 |         const responseText = await response.text();
48 |         const data = JSON.parse(responseText);
49 | 
50 |         return data;
51 |     } catch (error) {
52 |         console.error('Fetch error in customFetch: ', error);
53 |         throw error;
54 |     }
55 | 
56 | };
57 | 
58 | export const customFetchCore4 = async (url:string, options: RequestInit = {}) => {
59 |     try {
60 |         if (!url.includes('login') && !url.includes('profile')) {
61 |             const userLS = localStorage.getItem('user')
62 |             if (userLS != null) {
63 |                 const user = JSON.parse(userLS)
64 |                 if (user.token) {
65 |                     options.headers = {
66 |                         ...options.headers,
67 |                         Authorization: `Bearer ${user.token}`,
68 |                     }
69 |                 } else if (!url.endsWith('login')) {
70 |                     throw new Error('User token not found in localStorage for Core4 fetch');
71 |                 }
72 |             } else if (!url.endsWith('login')) {
73 |                 throw new Error('User not found in localStorage for Core4 fetch');
74 |             }
75 |         } else if (url.includes('profile')) {
76 |             const userLS = localStorage.getItem('user')
77 |             if (userLS != null) {
78 |                 const user = JSON.parse(userLS)
79 |                 if (user.token) {
80 |                     options.headers = {
81 |                         ...options.headers,
82 |                         Authorization: `Bearer ${user.token}`,
83 |                     }
84 |                 }
85 |             }
86 |         }
87 | 
88 |         const response = await fetch(`${baseURLCore4}${url}`, options);
89 | 
90 |         if (!response.ok) {
91 |             let errorData;
92 |             try {
93 |                 errorData = await response.json();
94 |             } catch (jsonError) {
95 |                 errorData = { message: `An error occurred (${response.status})`, status: response.status };
96 |             }
97 | 
98 |             const error = new Error(errorData.message || `An error occurred (${response.status})`);
99 |             (error as any).response = {
100 |                 status: response.status,
101 |                 data: errorData,
102 |             };
103 |             throw error;
104 |         }
105 |         const contentType = response.headers.get("content-type");
106 |         if (contentType && contentType.includes("application/json")) {
107 |             return await response.json();
108 |         }
109 |         return await response.text();
110 | 
111 |     } catch (error) {
112 |         console.error('Fetch error in customFetchCore4: ', error);
113 |         throw error;
114 |     }
115 | };
116 | 
117 | export default customFetch;
```

src/helpers/dateUtils.ts
```
1 | // src/helpers/dateUtils.ts
2 | 
3 | /**
4 |  * Formats a date string to a readable format
5 |  */
6 | export const formatDate = (dateString?: string, format: string = 'DD.MM.YYYY'): string => {
7 |     if (!dateString) return '';
8 | 
9 |     const date = new Date(dateString);
10 |     return format === 'DD.MM.YYYY' ?
11 |         `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}` :
12 |         new Intl.DateTimeFormat('en-DE', {
13 |             year: 'numeric',
14 |             month: '2-digit',
15 |             day: '2-digit'
16 |         }).format(date);
17 | };
18 | 
19 | /**
20 |  * Formats a date range to a readable format
21 |  */
22 | export const formatDateRange = (startDate?: string, endDate?: string, format: string = 'DD.MM.YYYY'): string => {
23 |     if (!startDate || !endDate) return '';
24 | 
25 |     const startFormatted = formatDate(startDate, format);
26 |     const endFormatted = formatDate(endDate, format);
27 | 
28 |     return `${startFormatted} - ${endFormatted}`;
29 | };
30 | 
31 | /**
32 |  * Formats a date to DD.MM-DD.MM.YYYY format (used for campaign durations)
33 |  */
34 | export const formatCampaignDuration = (startDate?: string, endDate?: string): string => {
35 |     if (!startDate || !endDate) return '';
36 | 
37 |     const start = new Date(startDate);
38 |     const end = new Date(endDate);
39 | 
40 |     const startDay = String(start.getDate()).padStart(2, '0');
41 |     const startMonth = String(start.getMonth() + 1).padStart(2, '0');
42 |     const endDay = String(end.getDate()).padStart(2, '0');
43 |     const endMonth = String(end.getMonth() + 1).padStart(2, '0');
44 |     const year = end.getFullYear();
45 | 
46 |     return `${startDay}.${startMonth}-${endDay}.${endMonth}.${year}`;
47 | };
```

src/helpers/emitter.ts
```
1 | import mitt from 'mitt'
2 | 
3 | const emitter = mitt()
4 | 
5 | export default emitter
```

src/helpers/format.ts
```
1 | /**
2 |  * Performs the core percentage calculation with validation.
3 |  * Checks for valid finite number inputs and handles division by zero.
4 |  * Returns NaN if inputs are invalid or division by zero occurs (except potentially 0/0).
5 |  * Useful when needing the raw calculation result with built-in safety checks.
6 |  *
7 |  * @param {number} used - The amount used.
8 |  * @param {number} total - The total amount.
9 |  * @returns {number} The raw calculated percentage, or NaN if the operation is invalid.
10 |  */
11 | export const calculateRawPercentage = (used, total) => {
12 |     // 1. Input validation: Check if inputs are valid, finite numbers
13 |     if (typeof used !== 'number' || typeof total !== 'number' || !isFinite(used) || !isFinite(total)) {
14 |         console.error("calculateRawPercentage: Invalid input. 'used' and 'total' must be finite numbers.", { used, total });
15 |         return NaN;
16 |     }
17 | 
18 |     // 2. Handle division by zero
19 |     if (total === 0) {
20 |         // Mathematically, x/0 is undefined/infinite, 0/0 is indeterminate.
21 |         // Return NaN for both cases during raw calculation.
22 |         // Formatting function can later interpret 0/0 specifically if needed.
23 |         if (used !== 0) {
24 |             console.warn("calculateRawPercentage: Division by zero (used != 0).", { used, total });
25 |         }
26 |         return NaN;
27 |     }
28 | 
29 |     // 3. Calculate percentage
30 |     const percentage = (used / total) * 100;
31 | 
32 |     // 4. Ensure finite result
33 |     return isFinite(percentage) ? percentage : NaN;
34 | };
35 | 
36 | /**
37 |  * Calculates the raw percentage value.
38 |  * Provides the same result as calculateRawPercentage. Can be used interchangeably.
39 |  * Returns NaN if inputs are invalid or division by zero occurs.
40 |  *
41 |  * @param {number} used - The amount used.
42 |  * @param {number} total - The total amount.
43 |  * @returns {number} The raw percentage number, or NaN on error/invalid operation.
44 |  */
45 | export const percentage = (used, total) => {
46 |     // This function now directly uses the exported raw calculation function.
47 |     return calculateRawPercentage(used, total);
48 | };
49 | 
50 | /**
51 |  * Calculates and formats a percentage from used and total values to "xx,yy %".
52 |  * Handles errors gracefully based on the result from calculateRawPercentage.
53 |  *
54 |  * @param {number} used - The amount used.
55 |  * @param {number} total - The total amount.
56 |  * @returns {string} The formatted percentage string "xx,yy %" or an error string ('N/A %' or '0,00 %').
57 |  */
58 | export const formatPercentage = (used, total) => {
59 |     // Use the exported raw calculation function
60 |     const rawPercentage = calculateRawPercentage(used, total);
61 | 
62 |     // Check if the calculation resulted in NaN
63 |     if (isNaN(rawPercentage)) {
64 |         // Check original inputs specifically for the 0/0 case for special formatting.
65 |         if (typeof used === 'number' && used === 0 && typeof total === 'number' && total === 0) {
66 |             return '0,00 %'; // Display 0/0 as '0,00 %'
67 |         }
68 |         // Otherwise (invalid input, x/0 division), return 'N/A %'
69 |         return 'N/A %';
70 |     }
71 | 
72 |     // If rawPercentage is a valid number, proceed with formatting:
73 |     const fixedPercentage = rawPercentage.toFixed(2);
74 |     const formattedString = fixedPercentage.replace('.', ',');
75 |     return `${formattedString} %`; // Ensure space before %
76 | };
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
66 |       return 'mdi-pencil-outline-outline';
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
14 |         - Changelog
15 |       parameters:
16 |         - description: The tool for which to retrieve changelog entries.
17 |           in: query
18 |           name: tool
19 |           required: true
20 |           schema:
21 |             enum:
22 |               - CampaignBuilder
23 |               - Linkshortener
24 |               - Mediaplan
25 |             type: string
26 |       responses:
27 |         "200":
28 |           content:
29 |             application/json:
30 |               schema:
31 |                 properties:
32 |                   data:
33 |                     description: List of changelog entries.
34 |                     items:
35 |                       $ref: "#/components/schemas/ChangelogEntry"
36 |                     type: array
37 |                 type: object
38 |           description: Successful response - returns a list of changelog entries.
39 |         "400":
40 |           content:
41 |             application/json:
42 |               schema:
43 |                 $ref: "#/components/schemas/Error"
44 |           description: Bad Request (e.g., invalid 'tool' value)
45 |         "500":
46 |           content:
47 |             application/json:
48 |               schema:
49 |                 $ref: "#/components/schemas/Error"
50 |           description: Internal Server Error
51 | 
52 |   /mediaplans:
53 |     get:
54 |       summary: Get a list of Mediaplans (paginated, filtered, and sorted)
55 |       # ... (rest of definition including existing example - unchanged) ...
56 |       tags:
57 |         - Mediaplans
58 |       parameters:
59 |         - description: The number of items per page.
60 |           example: 10
61 |           in: query
62 |           name: per_page
63 |           schema:
64 |             default: 25
65 |             maximum: 100
66 |             minimum: 1
67 |             type: integer
68 |         - description: The page number to retrieve (0-based).
69 |           example: 0
70 |           in: query
71 |           name: page
72 |           schema:
73 |             default: 0
74 |             minimum: 0
75 |             type: integer
76 |         - content:
77 |             application/json:
78 |               example:
79 |                 brand_id: brand-001
80 |                 search: Campaign
81 |                 status: Draft
82 |               schema:
83 |                 $ref: "#/components/schemas/MediaplanFilter"
84 |           description: JSON formatted string for filtering resul ts.
85 |           in: query
86 |           name: filter
87 |         - description: The field to sort by.
88 |           example: updated_at
89 |           in: query
90 |           name: sort
91 |           schema:
92 |             type: string
93 |         - description: Sort order (ascending or descending).
94 |           example: desc
95 |           in: query
96 |           name: order
97 |           schema:
98 |             default: asc
99 |             enum:
100 |               - asc
101 |               - desc
102 |             type: string
103 |       responses:
104 |         "200":
105 |           content:
106 |             application/json:
107 |               example:
108 |                 current_page: 0
109 |                 items:
110 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d419
111 |                     brand:
112 |                       _id: brand-0
113 |                       name: MINI
114 |                     budget:
115 |                       available: 749.5
116 |                       total: 1500.0
117 |                       used: 750.5
118 |                     created_at: "2024-10-01T10:00:00Z"
119 |                     created_by:
120 |                       _id: user-001
121 |                       name: Fabian Krenzler
122 |                     end_date: "2025-05-31T00:00:00Z"
123 |                     name: MP 1 - Spring Campaign
124 |                     po_numbers:
125 |                       - _id: po-001
126 |                         name: "4700123456"
127 |                         value: 750.5
128 |                     start_date: "2025-03-15T00:00:00Z"
129 |                     status: in_planning
130 |                     updated_at: "2024-10-05T11:00:00Z"
131 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d429
132 |                     brand:
133 |                       _id: brand-1
134 |                       name: BMW
135 |                     budget:
136 |                       available: 2000.75
137 |                       total: 3200.75
138 |                       used: 1200.0
139 |                     created_at: "2024-10-15T14:30:00Z"
140 |                     created_by:
141 |                       _id: user-002
142 |                       name: Alice Smith
143 |                     end_date: "2025-07-15T00:00:00Z"
144 |                     name: MP 2 - Summer Sale
145 |                     po_numbers:
146 |                       - _id: po-002
147 |                         name: "4700987654"
148 |                         value: 1000.0
149 |                       - _id: po-003
150 |                         name: "4700112233"
151 |                         value: 200.0
152 |                     start_date: "2025-06-01T00:00:00Z"
153 |                     status: draft
154 |                     updated_at: "2024-10-18T09:15:00Z"
155 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d439
156 |                     brand:
157 |                       _id: brand-2
158 |                       name: Rolls-Royce
159 |                     budget:
160 |                       available: 500.0
161 |                       total: 5000.0
162 |                       used: 4500.0
163 |                     created_at: "2024-11-01T08:00:00Z"
164 |                     created_by:
165 |                       _id: user-003
166 |                       name: Bob Johnson
167 |                     end_date: "2025-10-31T00:00:00Z"
168 |                     name: MP 3 - Autumn Rollout
169 |                     po_numbers:
170 |                       - _id: po-004
171 |                         name: "4700555666"
172 |                         value: 4500.0
173 |                     start_date: "2025-09-01T00:00:00Z"
174 |                     status: for_approval
175 |                     updated_at: "2024-11-02T12:00:00Z"
176 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d449
177 |                     brand:
178 |                       _id: brand-1
179 |                       name: BMW
180 |                     budget:
181 |                       available: 1949.75
182 |                       total: 2100.0
183 |                       used: 150.25
184 |                     created_at: "2024-11-10T16:20:00Z"
185 |                     created_by:
186 |                       _id: user-004
187 |                       name: Charlie Brown
188 |                     end_date: "2025-12-31T00:00:00Z"
189 |                     name: MP 4 - Winter Special
190 |                     po_numbers:
191 |                       - _id: po-005
192 |                         name: "4700333444"
193 |                         value: 150.25
194 |                     start_date: "2025-11-15T00:00:00Z"
195 |                     status: draft
196 |                     updated_at: "2024-11-11T17:00:00Z"
197 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d459
198 |                     brand:
199 |                       _id: brand-0
200 |                       name: MINI
201 |                     budget:
202 |                       available: 850.0
203 |                       total: 850.0
204 |                       used: 0.0
205 |                     created_at: "2024-11-12T11:55:00Z"
206 |                     created_by:
207 |                       _id: user-001
208 |                       name: Fabian Krenzler
209 |                     end_date: "2025-11-30T00:00:00Z"
210 |                     name: MP 5 - Year End Review Prep
211 |                     po_numbers: [ ]
212 |                     start_date: "2025-10-01T00:00:00Z"
213 |                     status: in_planning
214 |                     updated_at: "2024-11-12T11:55:00Z"
215 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d469
216 |                     brand:
217 |                       _id: brand-1
218 |                       name: BMW
219 |                     budget:
220 |                       available: 2000.01
221 |                       total: 4000.0
222 |                       used: 1999.99
223 |                     created_at: "2024-11-15T09:05:00Z"
224 |                     created_by:
225 |                       _id: user-002
226 |                       name: Alice Smith
227 |                     end_date: "2026-01-31T00:00:00Z"
228 |                     name: MP 6 - Q1 Planning 2026
229 |                     po_numbers:
230 |                       - _id: po-006
231 |                         name: "4700777888"
232 |                         value: 1999.99
233 |                     start_date: "2025-12-01T00:00:00Z"
234 |                     status: draft
235 |                     updated_at: "2024-11-20T14:25:00Z"
236 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d479
237 |                     brand:
238 |                       _id: brand-0
239 |                       name: MINI
240 |                     budget:
241 |                       available: 0.5
242 |                       total: 1800.5
243 |                       used: 1800.0
244 |                     created_at: "2024-11-22T13:00:00Z"
245 |                     created_by:
246 |                       _id: user-003
247 |                       name: Bob Johnson
248 |                     end_date: "2025-06-30T00:00:00Z"
249 |                     name: MP 7 - Brand Awareness Push
250 |                     po_numbers:
251 |                       - _id: po-007
252 |                         name: "4700224466"
253 |                         value: 1800.0
254 |                     start_date: "2025-04-01T00:00:00Z"
255 |                     status: for_approval
256 |                     updated_at: "2024-11-25T10:10:00Z"
257 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d489
258 |                     brand:
259 |                       _id: brand-1
260 |                       name: BMW
261 |                     budget:
262 |                       available: 1.0
263 |                       total: 550.0
264 |                       used: 549.0
265 |                     created_at: "2024-11-28T15:00:00Z"
266 |                     created_by:
267 |                       _id: user-004
268 |                       name: Charlie Brown
269 |                     end_date: "2025-05-15T00:00:00Z"
270 |                     name: MP 8 - Lead Generation Test
271 |                     po_numbers:
272 |                       - _id: po-008
273 |                         name: "4700121212"
274 |                         value: 549.0
275 |                     start_date: "2025-05-01T00:00:00Z"
276 |                     status: in_planning
277 |                     updated_at: "2024-11-29T15:00:00Z"
278 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d499
279 |                     brand:
280 |                       _id: brand-2
281 |                       name: Rolls-Royce
282 |                     budget:
283 |                       available: 2800.0
284 |                       total: 2900.0
285 |                       used: 100.0
286 |                     created_at: "2024-12-02T10:30:00Z"
287 |                     created_by:
288 |                       _id: user-001
289 |                       name: Fabian Krenzler
290 |                     end_date: "2025-09-30T00:00:00Z"
291 |                     name: MP 9 - Social Media Engagement
292 |                     po_numbers:
293 |                       - _id: po-009
294 |                         name: "4700998877"
295 |                         value: 100.0
296 |                     start_date: "2025-07-01T00:00:00Z"
297 |                     status: draft
298 |                     updated_at: "2024-12-03T11:30:00Z"
299 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d409
300 |                     brand:
301 |                       _id: brand-0
302 |                       name: MINI
303 |                     budget:
304 |                       available: 0.0
305 |                       total: 1150.8
306 |                       used: 1150.8
307 |                     created_at: "2024-12-05T16:00:00Z"
308 |                     created_by:
309 |                       _id: user-002
310 |                       name: Alice Smith
311 |                     end_date: "2025-10-15T00:00:00Z"
312 |                     name: MP 10 - Partner Co-Marketing
313 |                     po_numbers:
314 |                       - _id: po-010
315 |                         name: "4700101010"
316 |                         value: 1150.8
317 |                     start_date: "2025-08-15T00:00:00Z"
318 |                     status: in_planning
319 |                     updated_at: "2024-12-10T08:45:00Z"
320 |                 total_items: 10
321 |                 total_pages: 1
322 |               schema:
323 |                 properties:
324 |                   current_page:
325 |                     description: The current page number (0-based).
326 |                     example: 0
327 |                     type: integer
328 |                   items:
329 |                     description: List of mediaplans on the current page.
330 |                     items:
331 |                       $ref: "#/components/schemas/Mediaplan"
332 |                     type: array
333 |                   total_items:
334 |                     description: Total number of mediaplans.
335 |                     example: 100
336 |                     type: integer
337 |                   total_pages:
338 |                     description: Total number of pages.
339 |                     example: 4
340 |                     type: integer
341 |                 type: object
342 |           description: Successful response - returns a list of Mediaplans.
343 |         "400":
344 |           content:
345 |             application/json:
346 |               schema:
347 |                 $ref: "#/components/schemas/Error"
348 |           description: Bad Request (e.g., invalid query parameters, invalid JSON filter)
349 |         "422":
350 |           content:
351 |             application/json:
352 |               schema:
353 |                 $ref: "#/components/schemas/Error"
354 |           description: Validation Error (e.g., invalid date format)
355 |         "500":
356 |           content:
357 |             application/json:
358 |               schema:
359 |                 $ref: "#/components/schemas/Error"
360 |           description: Internal Server Error
361 | 
362 |     post:
363 |       summary: Create a new Mediaplan
364 |       # ... (rest of definition - unchanged) ...
365 |       tags:
366 |         - Mediaplans
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
391 |           content:
392 |             application/json:
393 |               schema:
394 |                 $ref: "#/components/schemas/Mediaplan"
395 |           description: Mediaplan created successfully.
396 |           headers:
397 |             Location:
398 |               description: URL of the newly created resource.
399 |               schema:
400 |                 format: url
401 |                 type: string
402 |         "400":
403 |           content:
404 |             application/json:
405 |               schema:
406 |                 $ref: "#/components/schemas/Error"
407 |           description: Bad Request (e.g., invalid request body)
408 |         "422":
409 |           content:
410 |             application/json:
411 |               schema:
412 |                 $ref: "#/components/schemas/Error"
413 |           description: Unprocessable Entity (validation errors)
414 |         "500":
415 |           content:
416 |             application/json:
417 |               schema:
418 |                 $ref: "#/components/schemas/Error"
419 |           description: Internal Server Error
420 | 
421 |   /mediaplans/{id}:
422 |     get:
423 |       summary: Get a single Mediaplan by ID
424 |       # ... (rest of definition - unchanged) ...
425 |       tags:
426 |         - Mediaplans
427 |       parameters:
428 |         - description: The unique identifier of the Mediaplan.
429 |           in: path
430 |           name: id
431 |           required: true
432 |           schema:
433 |             format: uuid
434 |             type: string
435 |       responses:
436 |         "200":
437 |           content:
438 |             application/json:
439 |               schema:
440 |                 $ref: "#/components/schemas/Mediaplan"
441 |           description: Successful response - returns the Mediaplan.
442 |         "400":
443 |           content:
444 |             application/json:
445 |               schema:
446 |                 $ref: "#/components/schemas/Error"
447 |           description: Bad Request (e.g., invalid UUID format)
448 |         "404":
449 |           content:
450 |             application/json:
451 |               schema:
452 |                 $ref: "#/components/schemas/Error"
453 |           description: Mediaplan not found.
454 |         "500":
455 |           content:
456 |             application/json:
457 |               schema:
458 |                 $ref: "#/components/schemas/Error"
459 |           description: Internal Server Error
460 | 
461 |     put:
462 |       summary: Update a Mediaplan (replace entire resource)
463 |       # ... (rest of definition - unchanged) ...
464 |       tags:
465 |         - Mediaplans
466 |       parameters:
467 |         - description: The unique identifier of the Mediaplan.
468 |           in: path
469 |           name: id
470 |           required: true
471 |           schema:
472 |             format: uuid
473 |             type: string
474 |       requestBody:
475 |         content:
476 |           application/json:
477 |             schema:
478 |               $ref: "#/components/schemas/Mediaplan"
479 |         required: true
480 |       responses:
481 |         "200":
482 |           content:
483 |             application/json:
484 |               schema:
485 |                 $ref: "#/components/schemas/Mediaplan"
486 |           description: Mediaplan updated successfully.
487 |         "204":
488 |           description: Mediaplan updated successfully.
489 |         "400":
490 |           content:
491 |             application/json:
492 |               schema:
493 |                 $ref: "#/components/schemas/Error"
494 |           description: Bad Request
495 |         "404":
496 |           content:
497 |             application/json:
498 |               schema:
499 |                 $ref: "#/components/schemas/Error"
500 |           description: Mediaplan not found.
501 |         "422":
502 |           content:
503 |             application/json:
504 |               schema:
505 |                 $ref: "#/components/schemas/Error"
506 |           description: Unprocessable Entity
507 |         "500":
508 |           content:
509 |             application/json:
510 |               schema:
511 |                 $ref: "#/components/schemas/Error"
512 |           description: Internal Server Error
513 | 
514 |     delete:
515 |       summary: Delete a Mediaplan
516 |       # ... (rest of definition - unchanged) ...
517 |       tags:
518 |         - Mediaplans
519 |       parameters:
520 |         - description: The unique identifier of the Mediaplan.
521 |           in: path
522 |           name: id
523 |           required: true
524 |           schema:
525 |             format: uuid
526 |             type: string
527 |       responses:
528 |         "204":
529 |           description: Mediaplan deleted successfully.
530 |         "400":
531 |           content:
532 |             application/json:
533 |               schema:
534 |                 $ref: "#/components/schemas/Error"
535 |           description: Bad Request
536 |         "404":
537 |           content:
538 |             application/json:
539 |               schema:
540 |                 $ref: "#/components/schemas/Error"
541 |           description: Mediaplan not found.
542 |         "500":
543 |           content:
544 |             application/json:
545 |               schema:
546 |                 $ref: "#/components/schemas/Error"
547 |           description: Internal Server Error
548 | 
549 |   /mediaplans/{mediaplanId}/projects:
550 |     get:
551 |       summary: Get all projects for a given Mediaplan
552 |       # ... (rest of definition including previous example - unchanged) ...
553 |       tags:
554 |         - Projects
555 |       parameters:
556 |         - description: The ID of the Mediaplan.
557 |           in: path
558 |           name: mediaplanId
559 |           required: true
560 |           schema:
561 |             format: uuid
562 |             type: string
563 |       responses:
564 |         "200":
565 |           content:
566 |             application/json:
567 |               example:
568 |                 current_page: 0
569 |                 items:
570 |                   - _id: f47ac10b-58cc-4372-a567-0e02b2c3d479
571 |                     abbreviation: "NC-ALWAYS-ON-2024_Individ #1"
572 |                     created_at: "2024-10-02T09:15:00Z"
573 |                     default_vars:
574 |                       adtype: Banner
575 |                       campaigndetail: null
576 |                       campaigntype: Always On
577 |                       dimension: 300x250
578 |                       language: DEU
579 |                       subsegment: New Car
580 |                       targeturls: null
581 |                     descriptive_vars:
582 |                       adobecampaignname: Always On 2024
583 |                       bmwponumber: PO12345
584 |                       brand: MINI
585 |                       campaigntype: Always On
586 |                       country: SE
587 |                       projectname: NC-ALWAYS-ON-2024_Individ
588 |                       subsegment: New Car
589 |                       year: 2024
590 |                     detail: To be defined might be very long
591 |                     duration:
592 |                       end_date: "2024-04-15T00:00:00Z"
593 |                       formatted: 15.01-15.04.2024
594 |                       start_date: "2024-01-15T00:00:00Z"
595 |                     is_locked: false
596 |                     labels: [ ]
597 |                     lock_state: 0
598 |                     owner: user123
599 |                     updated_at: "2024-10-02T09:15:00Z"
600 |                     uploaded_at: "2024-10-02T09:15:00Z"
601 |                     budget:
602 |                       used: 12500.50
603 |                       total: 50000.00
604 |                       available: 37499.50
605 |                   - _id: a3b8d4e1-6c2f-4a1e-8b7d-9c1f0a3e2b1d
606 |                     abbreviation: "NC-SPECIAL-2024_Individ #2"
607 |                     created_at: "2024-10-03T11:30:00Z"
608 |                     default_vars:
609 |                       adtype: Banner
610 |                       campaigndetail: null
611 |                       campaigntype: Always On
612 |                       dimension: 300x250
613 |                       language: SWE
614 |                       subsegment: New Car
615 |                       targeturls: null
616 |                     descriptive_vars:
617 |                       adobecampaignname: Always On 2024
618 |                       bmwponumber: PO67890
619 |                       brand: MINI
620 |                       campaigntype: Always On
621 |                       country: NL
622 |                       projectname: NC-ALWAYS-ON-2024_Individ
623 |                       subsegment: New Car
624 |                       year: 2024
625 |                     detail: This project focuses on the Dutch market.
626 |                     duration:
627 |                       end_date: "2024-04-15T00:00:00Z"
628 |                       formatted: 01.01-30.04.2024
629 |                       start_date: "2024-01-15T00:00:00Z"
630 |                     is_locked: false
631 |                     labels: [ ]
632 |                     lock_state: 0
633 |                     owner: user123
634 |                     updated_at: "2024-10-03T11:30:00Z"
635 |                     uploaded_at: "2024-10-03T11:30:00Z"
636 |                     budget:
637 |                       used: 12500.50
638 |                       total: 50000.00
639 |                       available: 37499.50
640 |                   - _id: e1c7b6a0-8d3e-4f5a-9b8c-1d0e2f3a4b5c
641 |                     abbreviation: "NC-ALWAYS-ON-2024_Individ #3"
642 |                     created_at: "2024-10-04T15:20:00Z"
643 |                     default_vars:
644 |                       adtype: Banner
645 |                       campaigndetail: null
646 |                       campaigntype: Always On
647 |                       dimension: 300x250
648 |                       language: NLD
649 |                       subsegment: New Car
650 |                       targeturls: null
651 |                     descriptive_vars:
652 |                       adobecampaignname: Always On 2024
653 |                       bmwponumber: PO12345
654 |                       brand: MINI
655 |                       campaigntype: Always On
656 |                       country: FR
657 |                       projectname: NC-ALWAYS-ON-2024_Individ
658 |                       subsegment: New Car
659 |                       year: 2024
660 |                     detail: To be defined might be very long
661 |                     duration:
662 |                       end_date: "2024-04-15T00:00:00Z"
663 |                       formatted: 01.03-30.04.2024
664 |                       start_date: "2024-01-15T00:00:00Z"
665 |                     is_locked: false
666 |                     labels: [ ]
667 |                     lock_state: 0
668 |                     owner: user123
669 |                     updated_at: "2024-10-04T15:20:00Z"
670 |                     uploaded_at: "2024-10-04T15:20:00Z"
671 |                     budget:
672 |                       used: 32000.00
673 |                       total: 75000.00
674 |                       available: 43000.00
675 |                   - _id: b9d8c7e1-7a4f-4b6e-9c8d-0e1f2a3b4c5d
676 |                     abbreviation: "NC-SPECIAL-2024_Individ #4"
677 |                     created_at: "2024-10-05T10:45:00Z"
678 |                     default_vars:
679 |                       adtype: Banner
680 |                       campaigndetail: null
681 |                       campaigntype: Always On
682 |                       dimension: 300x250
683 |                       language: DEU
684 |                       subsegment: New Car
685 |                       targeturls: null
686 |                     descriptive_vars:
687 |                       adobecampaignname: Always On 2024
688 |                       bmwponumber: PO67890
689 |                       brand: MINI
690 |                       campaigntype: Always On
691 |                       country: SE
692 |                       projectname: NC-ALWAYS-ON-2024_Individ
693 |                       subsegment: New Car
694 |                       year: 2024
695 |                     detail: This is a special project for the Swedish market.
696 |                     duration:
697 |                       end_date: "2024-04-15T00:00:00Z"
698 |                       formatted: 15.01-15.04.2024
699 |                       start_date: "2024-01-15T00:00:00Z"
700 |                     is_locked: false
701 |                     labels: [ ]
702 |                     lock_state: 0
703 |                     owner: user123
704 |                     updated_at: "2024-10-05T10:45:00Z"
705 |                     uploaded_at: "2024-10-05T10:45:00Z"
706 |                     budget:
707 |                       used: 15000.00
708 |                       total: 60000.00
709 |                       available: 45000.00
710 |                   - _id: d3e4f5a0-8b7c-4a1e-8c7d-9f0a1b2c3d4e
711 |                     abbreviation: "NC-ALWAYS-ON-2024_Individ #5"
712 |                     created_at: "2024-10-06T13:15:00Z"
713 |                     default_vars:
714 |                       adtype: Banner
715 |                       campaigndetail: null
716 |                       campaigntype: Always On
717 |                       dimension: 300x250
718 |                       language: SWE
719 |                       subsegment: New Car
720 |                       targeturls: null
721 |                     descriptive_vars:
722 |                       adobecampaignname: Always On 2024
723 |                       bmwponumber: PO12345
724 |                       brand: MINI
725 |                       campaigntype: Always On
726 |                       country: NL
727 |                       projectname: NC-ALWAYS-ON-2024_Individ
728 |                       subsegment: New Car
729 |                       year: 2024
730 |                     detail: To be defined might be very long
731 |                     duration:
732 |                       end_date: "2024-04-15T00:00:00Z"
733 |                       formatted: 01.01-15.04.2024
734 |                       start_date: "2024-01-15T00:00:00Z"
735 |                     is_locked: false
736 |                     labels: [ ]
737 |                     lock_state: 0
738 |                     owner: user123
739 |                     updated_at: "2024-10-06T13:15:00Z"
740 |                     uploaded_at: "2024-10-06T13:15:00Z"
741 | 
742 |                     budget:
743 |                       used: 15000.00
744 |                       total: 60000.00
745 |                       available: 45000.00
746 |                   - _id: c7b8a9e1-6d3f-4c2a-9a8b-1e0f2d3c4b5a
747 |                     abbreviation: "NC-ALWAYS-ON-2024_Individ #6"
748 |                     created_at: "2024-10-07T09:15:00Z"
749 |                     default_vars:
750 |                       adtype: Banner
751 |                       campaigndetail: null
752 |                       campaigntype: Always On
753 |                       dimension: 300x250
754 |                       language: DEU
755 |                       subsegment: New Car
756 |                       targeturls: null
757 |                     descriptive_vars:
758 |                       adobecampaignname: Always On 2024
759 |                       bmwponumber: PO67890
760 |                       brand: MINI
761 |                       campaigntype: Always On
762 |                       country: FR
763 |                       projectname: NC-ALWAYS-ON-2024_Individ
764 |                       subsegment: New Car
765 |                       year: 2024
766 |                     detail: To be defined might be very long
767 |                     duration:
768 |                       end_date: "2024-04-15T00:00:00Z"
769 |                       formatted: 15.01-30.06.2024
770 |                       start_date: "2024-01-15T00:00:00Z"
771 |                     is_locked: false
772 |                     labels: [ ]
773 |                     lock_state: 0
774 |                     owner: user123
775 |                     updated_at: "2024-10-07T09:15:00Z"
776 |                     uploaded_at: "2024-10-07T09:15:00Z"
777 | 
778 |                     budget:
779 |                       used: 15000.00
780 |                       total: 60000.00
781 |                       available: 45000.00
782 |                   - _id: a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d
783 |                     abbreviation: "NC-SPECIAL-2024_Individ #7"
784 |                     created_at: "2024-10-08T11:30:00Z"
785 |                     default_vars:
786 |                       adtype: Banner
787 |                       campaigndetail: null
788 |                       campaigntype: Always On
789 |                       dimension: 300x250
790 |                       language: NLD
791 |                       subsegment: New Car
792 |                       targeturls: null
793 |                     descriptive_vars:
794 |                       adobecampaignname: Always On 2024
795 |                       bmwponumber: PO12345
796 |                       brand: MINI
797 |                       campaigntype: Always On
798 |                       country: SE
799 |                       projectname: NC-ALWAYS-ON-2024_Individ
800 |                       subsegment: New Car
801 |                       year: 2024
802 |                     detail: To be defined might be very long
803 |                     duration:
804 |                       end_date: "2024-04-15T00:00:00Z"
805 |                       formatted: 01.04-30.06.2024
806 |                       start_date: "2024-01-15T00:00:00Z"
807 |                     is_locked: false
808 |                     labels: [ ]
809 |                     lock_state: 0
810 |                     owner: user123
811 |                     updated_at: "2024-10-08T11:30:00Z"
812 |                     uploaded_at: "2024-10-08T11:30:00Z"
813 | 
814 |                     budget:
815 |                       used: 15000.00
816 |                       total: 60000.00
817 |                       available: 45000.00
818 |                   - _id: f0e1d2c3-4b5a-4c6d-8e9f-0a1b2c3d4e5f
819 |                     abbreviation: "NC-ALWAYS-ON-2024_Individ #8"
820 |                     created_at: "2024-10-09T15:20:00Z"
821 |                     default_vars:
822 |                       adtype: Banner
823 |                       campaigndetail: null
824 |                       campaigntype: Always On
825 |                       dimension: 300x250
826 |                       language: DEU
827 |                       subsegment: New Car
828 |                       targeturls: null
829 |                     descriptive_vars:
830 |                       adobecampaignname: Always On 2024
831 |                       bmwponumber: PO67890
832 |                       brand: MINI
833 |                       campaigntype: Always On
834 |                       country: NL
835 |                       projectname: NC-ALWAYS-ON-2024_Individ
836 |                       subsegment: New Car
837 |                       year: 2024
838 |                     detail: To be defined might be very long
839 |                     duration:
840 |                       end_date: "2024-04-15T00:00:00Z"
841 |                       formatted: 01.01-15.05.2024
842 |                       start_date: "2024-01-15T00:00:00Z"
843 |                     is_locked: false
844 |                     labels: [ ]
845 |                     lock_state: 0
846 |                     owner: user123
847 |                     updated_at: "2024-10-09T15:20:00Z"
848 |                     uploaded_at: "2024-10-09T15:20:00Z"
849 | 
850 |                     budget:
851 |                       used: 15000.00
852 |                       total: 60000.00
853 |                       available: 45000.00
854 |                   - _id: b4c5d6e7-8f9a-4b1c-9d0e-1f2a3b4c5d6e
855 |                     abbreviation: "NC-SPECIAL-2024_Individ #9"
856 |                     created_at: "2024-10-10T10:45:00Z"
857 |                     default_vars:
858 |                       adtype: Banner
859 |                       campaigndetail: null
860 |                       campaigntype: Always On
861 |                       dimension: 300x250
862 |                       language: SWE
863 |                       subsegment: New Car
864 |                       targeturls: null
865 |                     descriptive_vars:
866 |                       adobecampaignname: Always On 2024
867 |                       bmwponumber: PO12345
868 |                       brand: MINI
869 |                       campaigntype: Always On
870 |                       country: FR
871 |                       projectname: NC-ALWAYS-ON-2024_Individ
872 |                       subsegment: New Car
873 |                       year: 2024
874 |                     detail: To be defined might be very long
875 |                     duration:
876 |                       end_date: "2024-04-15T00:00:00Z"
877 |                       formatted: 15.01-30.06.2024
878 |                       start_date: "2024-01-15T00:00:00Z"
879 |                     is_locked: false
880 |                     labels: [ ]
881 |                     lock_state: 0
882 |                     owner: user123
883 |                     updated_at: "2024-10-10T10:45:00Z"
884 |                     uploaded_at: "2024-10-10T10:45:00Z"
885 | 
886 |                     budget:
887 |                       used: 15000.00
888 |                       total: 60000.00
889 |                       available: 45000.00
890 |                   - _id: d8e9f0a1-b2c3-4d4e-8f5a-0b1c2d3e4f5a
891 |                     abbreviation: "NC-ALWAYS-ON-2024_Individ #10"
892 |                     created_at: "2024-10-11T13:15:00Z"
893 |                     default_vars:
894 |                       adtype: Banner
895 |                       campaigndetail: null
896 |                       campaigntype: Always On
897 |                       dimension: 300x250
898 |                       language: NLD
899 |                       subsegment: New Car
900 |                       targeturls: null
901 |                     descriptive_vars:
902 |                       adobecampaignname: Always On 2024
903 |                       bmwponumber: PO67890
904 |                       brand: MINI
905 |                       campaigntype: Always On
906 |                       country: SE
907 |                       projectname: NC-ALWAYS-ON-2024_Individ
908 |                       subsegment: New Car
909 |                       year: 2024
910 |                     detail: To be defined might be very long
911 |                     duration:
912 |                       end_date: "2024-04-15T00:00:00Z"
913 |                       formatted: 01.05-30.06.2024
914 |                       start_date: "2024-01-15T00:00:00Z"
915 |                     is_locked: false
916 |                     labels: [ ]
917 |                     lock_state: 0
918 |                     owner: user123
919 |                     updated_at: "2024-10-11T13:15:00Z"
920 |                     uploaded_at: "2024-10-11T13:15:00Z"
921 | 
922 |                     budget:
923 |                       used: 15000.00
924 |                       total: 60000.00
925 |                       available: 45000.00
926 |                   - _id: 1f2a3b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c
927 |                     abbreviation: USED-CAR-Q3-2024_Campaign_11
928 |                     created_at: "2024-11-01T10:00:00Z"
929 |                     default_vars:
930 |                       adtype: Video
931 |                       campaigndetail: null
932 |                       campaigntype: Sales
933 |                       dimension: 1920x1080
934 |                       language: ENG
935 |                       subsegment: Used Car
936 |                       targeturls: https://example.com/used
937 |                     descriptive_vars:
938 |                       adobecampaignname: Used Car Q3
939 |                       bmwponumber: PO99887
940 |                       brand: BMW
941 |                       campaigntype: Sales
942 |                       country: GB
943 |                       projectname: USED-CAR-Q3-2024_Campaign
944 |                       subsegment: Used Car
945 |                       year: 2024
946 |                     detail: Focus on certified pre-owned vehicles.
947 |                     duration:
948 |                       end_date: "2024-09-30T00:00:00Z"
949 |                       formatted: 01.07-30.09.2024
950 |                       start_date: "2024-07-01T00:00:00Z"
951 |                     is_locked: true
952 |                     labels:
953 |                       - priority
954 |                       - video
955 |                     lock_state: 1
956 |                     owner: user456
957 |                     updated_at: "2024-11-05T14:00:00Z"
958 |                     uploaded_at: "2024-11-01T10:00:00Z"
959 |                     budget:
960 |                       used: 15000.00
961 |                       total: 60000.00
962 |                       available: 45000.00
963 |                   - _id: 2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d
964 |                     abbreviation: SERVICE-WINTER-CHECK_Promo_12
965 |                     created_at: "2024-11-02T11:20:00Z"
966 |                     default_vars:
967 |                       adtype: Social
968 |                       campaigndetail: Tyre Change
969 |                       campaigntype: Seasonal
970 |                       dimension: 1080x1080
971 |                       language: FRA
972 |                       subsegment: Aftersales
973 |                       targeturls: null
974 |                     descriptive_vars:
975 |                       adobecampaignname: Winter Check 24
976 |                       bmwponumber: PO77665
977 |                       brand: BMW
978 |                       campaigntype: Seasonal
979 |                       country: FR
980 |                       projectname: SERVICE-WINTER-CHECK_Promo
981 |                       subsegment: Aftersales
982 |                       year: 2024
983 |                     detail: Promotional offer for winter service checks.
984 |                     duration:
985 |                       end_date: "2024-12-15T00:00:00Z"
986 |                       formatted: 15.10-15.12.2024
987 |                       start_date: "2024-10-15T00:00:00Z"
988 |                     is_locked: false
989 |                     labels:
990 |                       - aftersales
991 |                     lock_state: 0
992 |                     owner: user789
993 |                     updated_at: "2024-11-03T11:20:00Z"
994 |                     uploaded_at: "2024-11-02T11:20:00Z"
995 |                     budget:
996 |                       used: 15000.00
997 |                       total: 60000.00
998 |                       available: 45000.00
999 |                   - _id: 3b4c5d6e-7f8a-4b9c-0d1e-2f3a4b5c6d7e
1000 |                     abbreviation: NC-LAUNCH-X5-2025_Awareness_13
1001 |                     created_at: "2024-11-10T09:00:00Z"
1002 |                     default_vars:
1003 |                       adtype: Display
1004 |                       campaigndetail: X5 Facelift
1005 |                       campaigntype: Launch
1006 |                       dimension: 728x90
1007 |                       language: DEU
1008 |                       subsegment: New Car
1009 |                       targeturls: null
1010 |                     descriptive_vars:
1011 |                       adobecampaignname: X5 Launch 2025
1012 |                       bmwponumber: PO11223
1013 |                       brand: BMW
1014 |                       campaigntype: Launch
1015 |                       country: DE
1016 |                       projectname: NC-LAUNCH-X5-2025_Awareness
1017 |                       subsegment: New Car
1018 |                       year: 2025
1019 |                     detail: Initial awareness phase for the new X5 model.
1020 |                     duration:
1021 |                       end_date: "2025-03-31T00:00:00Z"
1022 |                       formatted: 01.02-31.03.2025
1023 |                       start_date: "2025-02-01T00:00:00Z"
1024 |                     is_locked: false
1025 |                     labels:
1026 |                       - launch
1027 |                       - awareness
1028 |                     lock_state: 0
1029 |                     owner: user123
1030 |                     updated_at: "2024-11-12T16:30:00Z"
1031 |                     uploaded_at: "2024-11-10T09:00:00Z"
1032 |                     budget:
1033 |                       used: 15000.00
1034 |                       total: 60000.00
1035 |                       available: 45000.00
1036 |                   - _id: 4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f
1037 |                     abbreviation: MINI-EV-TESTDRIVE_LeadGen_14
1038 |                     created_at: "2024-11-15T13:45:00Z"
1039 |                     default_vars:
1040 |                       adtype: Search
1041 |                       campaigndetail: Electric Cooper
1042 |                       campaigntype: Lead Generation
1043 |                       dimension: null
1044 |                       language: NLD
1045 |                       subsegment: New Car
1046 |                       targeturls: https://mini.example.com/testdrive
1047 |                     descriptive_vars:
1048 |                       adobecampaignname: MINI EV Leads
1049 |                       bmwponumber: PO44556
1050 |                       brand: MINI
1051 |                       campaigntype: Lead Generation
1052 |                       country: NL
1053 |                       projectname: MINI-EV-TESTDRIVE_LeadGen
1054 |                       subsegment: New Car
1055 |                       year: 2024
1056 |                     detail: Campaign to generate test drive requests for MINI Electric.
1057 |                     duration:
1058 |                       end_date: "2024-12-20T00:00:00Z"
1059 |                       formatted: 20.11-20.12.2024
1060 |                       start_date: "2024-11-20T00:00:00Z"
1061 |                     is_locked: false
1062 |                     labels:
1063 |                       - electric
1064 |                       - leads
1065 |                     lock_state: 0
1066 |                     owner: user456
1067 |                     updated_at: "2024-11-15T13:45:00Z"
1068 |                     uploaded_at: "2024-11-15T13:45:00Z"
1069 |                     budget:
1070 |                       used: 15000.00
1071 |                       total: 60000.00
1072 |                       available: 45000.00
1073 |                   - _id: 5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a
1074 |                     abbreviation: BMW-M-PERFORMANCE_Consideration_15
1075 |                     created_at: "2024-11-20T10:10:00Z"
1076 |                     default_vars:
1077 |                       adtype: Video
1078 |                       campaigndetail: M Models
1079 |                       campaigntype: Consideration
1080 |                       dimension: 1920x1080
1081 |                       language: ITA
1082 |                       subsegment: New Car
1083 |                       targeturls: null
1084 |                     descriptive_vars:
1085 |                       adobecampaignname: M Power Consideration
1086 |                       bmwponumber: PO66778
1087 |                       brand: BMW
1088 |                       campaigntype: Consideration
1089 |                       country: IT
1090 |                       projectname: BMW-M-PERFORMANCE_Consideration
1091 |                       subsegment: New Car
1092 |                       year: 2024
1093 |                     detail: Highlighting M performance parts and models.
1094 |                     duration:
1095 |                       end_date: "2024-11-30T00:00:00Z"
1096 |                       formatted: 01.09-30.11.2024
1097 |                       start_date: "2024-09-01T00:00:00Z"
1098 |                     is_locked: false
1099 |                     labels:
1100 |                       - performance
1101 |                       - M
1102 |                     lock_state: 0
1103 |                     owner: user789
1104 |                     updated_at: "2024-11-21T12:00:00Z"
1105 |                     uploaded_at: "2024-11-20T10:10:00Z"
1106 |                     budget:
1107 |                       used: 15000.00
1108 |                       total: 60000.00
1109 |                       available: 45000.00
1110 |                   - _id: 6e7f8a9b-0c1d-4e2f-3a4b-5c6d7e8f9a0b
1111 |                     abbreviation: FINANCIAL-SERVICES-Q1-25_Offer_16
1112 |                     created_at: "2024-11-25T15:00:00Z"
1113 |                     default_vars:
1114 |                       adtype: Display
1115 |                       campaigndetail: Leasing 0%
1116 |                       campaigntype: Offer
1117 |                       dimension: 300x600
1118 |                       language: ESP
1119 |                       subsegment: Financial Services
1120 |                       targeturls: https://bmw-fs.example.com/offers
1121 |                     descriptive_vars:
1122 |                       adobecampaignname: FS Q1 Offers
1123 |                       bmwponumber: PO22334
1124 |                       brand: BMW
1125 |                       campaigntype: Offer
1126 |                       country: ES
1127 |                       projectname: FINANCIAL-SERVICES-Q1-25_Offer
1128 |                       subsegment: Financial Services
1129 |                       year: 2025
1130 |                     detail: Special financing offers for Q1 2025.
1131 |                     duration:
1132 |                       end_date: "2025-03-31T00:00:00Z"
1133 |                       formatted: 10.01-31.03.2025
1134 |                       start_date: "2025-01-10T00:00:00Z"
1135 |                     is_locked: false
1136 |                     labels:
1137 |                       - financing
1138 |                       - FS
1139 |                     lock_state: 0
1140 |                     owner: user123
1141 |                     updated_at: "2024-11-28T10:00:00Z"
1142 |                     uploaded_at: "2024-11-25T15:00:00Z"
1143 |                     budget:
1144 |                       used: 15000.00
1145 |                       total: 60000.00
1146 |                       available: 45000.00
1147 |                   - _id: 7f8a9b0c-1d2e-4f3a-4b5c-6d7e8f9a0b1c
1148 |                     abbreviation: MINI-USED-NEXT_Q4_Sales_17
1149 |                     created_at: "2024-12-01T12:12:12Z"
1150 |                     default_vars:
1151 |                       adtype: Search
1152 |                       campaigndetail: MINI Next
1153 |                       campaigntype: Sales
1154 |                       dimension: null
1155 |                       language: DEU
1156 |                       subsegment: Used Car
1157 |                       targeturls: null
1158 |                     descriptive_vars:
1159 |                       adobecampaignname: MINI Used Q4 AT
1160 |                       bmwponumber: PO55667
1161 |                       brand: MINI
1162 |                       campaigntype: Sales
1163 |                       country: AT
1164 |                       projectname: MINI-USED-NEXT_Q4_Sales
1165 |                       subsegment: Used Car
1166 |                       year: 2024
1167 |                     detail: Promoting MINI Next certified used cars in Austria.
1168 |                     duration:
1169 |                       end_date: "2024-12-31T00:00:00Z"
1170 |                       formatted: 01.10-31.12.2024
1171 |                       start_date: "2024-10-01T00:00:00Z"
1172 |                     is_locked: false
1173 |                     labels:
1174 |                       - used
1175 |                       - mini next
1176 |                     lock_state: 0
1177 |                     owner: user456
1178 |                     updated_at: "2024-12-01T12:12:12Z"
1179 |                     uploaded_at: "2024-12-01T12:12:12Z"
1180 |                     budget:
1181 |                       used: 15000.00
1182 |                       total: 60000.00
1183 |                       available: 45000.00
1184 |                   - _id: 8a9b0c1d-2e3f-4a4b-5c6d-7e8f9a0b1c2d
1185 |                     abbreviation: BMW-I4-SUSTAINABILITY_Brand_18
1186 |                     created_at: "2024-12-05T08:30:00Z"
1187 |                     default_vars:
1188 |                       adtype: Social
1189 |                       campaigndetail: i4 Electric
1190 |                       campaigntype: Brand
1191 |                       dimension: 1080x1920
1192 |                       language: ENG
1193 |                       subsegment: Corporate
1194 |                       targeturls: https://bmw.example.com/sustainability
1195 |                     descriptive_vars:
1196 |                       adobecampaignname: BMW Sustainability i4
1197 |                       bmwponumber: PO88990
1198 |                       brand: BMW
1199 |                       campaigntype: Brand
1200 |                       country: US
1201 |                       projectname: BMW-I4-SUSTAINABILITY_Brand
1202 |                       subsegment: Corporate
1203 |                       year: 2024
1204 |                     detail: Brand campaign focusing on the sustainability aspects of the BMW i4.
1205 |                     duration:
1206 |                       end_date: "2025-01-31T00:00:00Z"
1207 |                       formatted: 01.11-31.01.2025
1208 |                       start_date: "2024-11-01T00:00:00Z"
1209 |                     is_locked: true
1210 |                     labels:
1211 |                       - brand
1212 |                       - sustainability
1213 |                       - electric
1214 |                       - i4
1215 |                     lock_state: 1
1216 |                     owner: user789
1217 |                     updated_at: "2024-12-10T11:00:00Z"
1218 |                     uploaded_at: "2024-12-05T08:30:00Z"
1219 |                     budget:
1220 |                       used: 18000.00
1221 |                       total: 60000.00
1222 |                       available: 42000.00
1223 |                 total_items: 18
1224 |                 total_pages: 1
1225 |               schema:
1226 |                 items:
1227 |                   $ref: "#/components/schemas/Project"
1228 |                 type: array
1229 |           description: Successful response - returns a list of projects.
1230 |         "400":
1231 |           content:
1232 |             application/json:
1233 |               schema:
1234 |                 $ref: "#/components/schemas/Error"
1235 |           description: Bad Request (e.g., invalid Mediaplan ID format)
1236 |         "404":
1237 |           content:
1238 |             application/json:
1239 |               schema:
1240 |                 $ref: "#/components/schemas/Error"
1241 |           description: Mediaplan not found.
1242 |         "500":
1243 |           content:
1244 |             application/json:
1245 |               schema:
1246 |                 $ref: "#/components/schemas/Error"
1247 |           description: Internal Server Error
1248 | 
1249 |     post:
1250 |       summary: Create a new Project for a Mediaplan
1251 |       # ... (rest of definition - unchanged) ...
1252 |       tags:
1253 |         - Projects
1254 |       parameters:
1255 |         - description: The ID of the Mediaplan to which the project belongs.
1256 |           in: path
1257 |           name: mediaplanId
1258 |           required: true
1259 |           schema:
1260 |             format: uuid
1261 |             type: string
1262 |       requestBody:
1263 |         content:
1264 |           application/json:
1265 |             example:
1266 |               abbreviation: MyNewProject
1267 |               default_vars:
1268 |                 adtype: Banner
1269 |                 campaigndetail: null
1270 |                 campaigntype: Awareness
1271 |                 dimension: 300x250
1272 |                 language: en
1273 |                 subsegment: OT
1274 |                 targeturls: null
1275 |               descriptive_vars:
1276 |                 adobecampaignname: SummerSale
1277 |                 bmwponumber: PO12345
1278 |                 brand: BMW
1279 |                 campaigntype: Awareness
1280 |                 country: US
1281 |                 projectname: SummerSale_OT
1282 |                 subsegment: OT
1283 |                 year: 2025
1284 |               is_locked: false
1285 |               labels: [ ]
1286 |               lock_state: 0
1287 |               message: OK
1288 |               owner: user123
1289 |               version: v1
1290 |             schema:
1291 |               $ref: "#/components/schemas/ProjectCreate"
1292 |         required: true
1293 |       responses:
1294 |         "201":
1295 |           content:
1296 |             application/json:
1297 |               schema:
1298 |                 $ref: "#/components/schemas/Project"
1299 |           description: Project created successfully.
1300 |           headers:
1301 |             Location:
1302 |               description: URL of the newly created Project.
1303 |               schema:
1304 |                 format: url
1305 |                 type: string
1306 |         "400":
1307 |           content:
1308 |             application/json:
1309 |               schema:
1310 |                 $ref: "#/components/schemas/Error"
1311 |           description: Bad Request (e.g., invalid request body or Mediaplan ID)
1312 |         "404":
1313 |           content:
1314 |             application/json:
1315 |               schema:
1316 |                 $ref: "#/components/schemas/Error"
1317 |           description: Mediaplan not found.
1318 |         "422":
1319 |           content:
1320 |             application/json:
1321 |               schema:
1322 |                 $ref: "#/components/schemas/Error"
1323 |           description: Unprocessable Entity (validation errors)
1324 |         "500":
1325 |           content:
1326 |             application/json:
1327 |               schema:
1328 |                 $ref: "#/components/schemas/Error"
1329 |           description: Internal Server Error
1330 | 
1331 |   /mediaplans/{mediaplanId}/projects/{projectId}:
1332 |     get:
1333 |       summary: Get a Project
1334 |       tags:
1335 |         - Projects
1336 |       parameters:
1337 |         - in: path
1338 |           name: mediaplanId
1339 |           schema:
1340 |             type: string
1341 |             format: uuid
1342 |           required: true
1343 |           description: The ID of the Mediaplan.
1344 |         - in: path
1345 |           name: projectId
1346 |           schema:
1347 |             type: string
1348 |             format: uuid
1349 |           required: true
1350 |           description: The ID of the Project to get.
1351 |       responses:
1352 |         '200':
1353 |           description: Project fetched successfully.
1354 |           content:
1355 |             application/json:
1356 |               schema:
1357 |                 $ref: '#/components/schemas/Project'
1358 |               # --- START EXAMPLE ---
1359 |               example:
1360 |                 _id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Use a valid UUID
1361 |                 abbreviation: "NC-ALWAYS-ON-2024_Individ #1"
1362 |                 created_at: "2024-10-02T09:15:00Z"
1363 |                 default_vars:
1364 |                   targeturls: null
1365 |                   subsegment: "New Car"
1366 |                   campaigntype: "Always On"
1367 |                   language: "DEU"
1368 |                   campaigndetail: null
1369 |                   adtype: "Banner"
1370 |                   dimension: "300x250"
1371 |                 descriptive_vars:
1372 |                   brand: "MINI"
1373 |                   country: "SE"
1374 |                   bmwponumber: "PO12345"
1375 |                   adobecampaignname: "Always On 2024"
1376 |                   subsegment: "New Car"
1377 |                   campaigntype: "Always On"
1378 |                   projectname: "NC-ALWAYS-ON-2024_Individ"
1379 |                   year: 2024
1380 |                 is_locked: false
1381 |                 labels: [ ]
1382 |                 lock_state: 0
1383 |                 owner: "user123"
1384 |                 updated_at: "2024-10-02T09:15:00Z"
1385 |                 uploaded_at: "2024-10-02T09:15:00Z"
1386 |                 duration:
1387 |                   start_date: "2024-01-15T00:00:00Z"
1388 |                   end_date: "2024-04-15T00:00:00Z"
1389 |                   formatted: "15.01-15.04.2024"
1390 |                 detail: "This is the first project, focusing on Sweden."
1391 |               # --- END EXAMPLE ---
1392 |         '400':
1393 |           description: Bad Request
1394 |           # ... (rest unchanged)
1395 |         '404':
1396 |           description: Mediaplan or Project not found.
1397 |           # ... (rest unchanged)
1398 |         '500':
1399 |           description: Internal Server Error
1400 |           # ... (rest unchanged)
1401 | 
1402 |     put:
1403 |       summary: Update a Project (replace entire resource)
1404 |       # ... (rest of definition - unchanged) ...
1405 |       tags:
1406 |         - Projects
1407 |       parameters:
1408 |         - description: The ID of the Mediaplan.
1409 |           in: path
1410 |           name: mediaplanId
1411 |           required: true
1412 |           schema:
1413 |             format: uuid
1414 |             type: string
1415 |         - description: The ID of the Project to update.
1416 |           in: path
1417 |           name: projectId
1418 |           required: true
1419 |           schema:
1420 |             format: uuid
1421 |             type: string
1422 |       requestBody:
1423 |         content:
1424 |           application/json:
1425 |             schema:
1426 |               $ref: "#/components/schemas/Project"
1427 |         required: true
1428 |       responses:
1429 |         "200":
1430 |           content:
1431 |             application/json:
1432 |               schema:
1433 |                 $ref: "#/components/schemas/Project"
1434 |           description: Project updated successfully.
1435 |         "204":
1436 |           description: Project updated successfully.
1437 |         "400":
1438 |           content:
1439 |             application/json:
1440 |               schema:
1441 |                 $ref: "#/components/schemas/Error"
1442 |           description: Bad Request
1443 |         "404":
1444 |           content:
1445 |             application/json:
1446 |               schema:
1447 |                 $ref: "#/components/schemas/Error"
1448 |           description: Mediaplan or Project not found.
1449 |         "422":
1450 |           content:
1451 |             application/json:
1452 |               schema:
1453 |                 $ref: "#/components/schemas/Error"
1454 |           description: Unprocessable Entity
1455 |         "500":
1456 |           content:
1457 |             application/json:
1458 |               schema:
1459 |                 $ref: "#/components/schemas/Error"
1460 |           description: Internal Server Error
1461 | 
1462 |     delete:
1463 |       summary: Delete a Project
1464 |       # ... (rest of definition - unchanged) ...
1465 |       tags:
1466 |         - Projects
1467 |       parameters:
1468 |         - description: The ID of the Mediaplan.
1469 |           in: path
1470 |           name: mediaplanId
1471 |           required: true
1472 |           schema:
1473 |             format: uuid
1474 |             type: string
1475 |         - description: The ID of the Project to delete.
1476 |           in: path
1477 |           name: projectId
1478 |           required: true
1479 |           schema:
1480 |             format: uuid
1481 |             type: string
1482 |       responses:
1483 |         "204":
1484 |           description: Project deleted successfully.
1485 |         "400":
1486 |           content:
1487 |             application/json:
1488 |               schema:
1489 |                 $ref: "#/components/schemas/Error"
1490 |           description: Bad Request
1491 |         "404":
1492 |           content:
1493 |             application/json:
1494 |               schema:
1495 |                 $ref: "#/components/schemas/Error"
1496 |           description: Mediaplan or Project not found.
1497 |         "500":
1498 |           content:
1499 |             application/json:
1500 |               schema:
1501 |                 $ref: "#/components/schemas/Error"
1502 |           description: Internal Server Error
1503 | 
1504 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns:
1505 |     get:
1506 |       summary: Get all campaigns for a given Project within a Mediaplan
1507 |       tags:
1508 |         - Campaigns
1509 |       parameters:
1510 |         - in: path
1511 |           name: mediaplanId
1512 |           schema:
1513 |             type: string
1514 |             format: uuid
1515 |           required: true
1516 |           description: The ID of the Mediaplan.
1517 |         - in: path
1518 |           name: projectId
1519 |           schema:
1520 |             type: string
1521 |             format: uuid
1522 |           required: true
1523 |           description: The ID of the Project.
1524 |         # --- ADD Pagination parameters ---
1525 |         - in: query
1526 |           name: page
1527 |           schema:
1528 |             type: integer
1529 |             minimum: 0
1530 |             default: 0
1531 |           description: The page number to retrieve (0-based).
1532 |         - in: query
1533 |           name: per_page
1534 |           schema:
1535 |             type: integer
1536 |             minimum: 1
1537 |             maximum: 100
1538 |             default: 15 # Match store default
1539 |           description: The number of items per page.
1540 |         # Optional: Add sort/order parameters if API supports them
1541 |         # - in: query
1542 |         #   name: sort
1543 |         #   schema: { type: string }
1544 |         # - in: query
1545 |         #   name: order
1546 |         #   schema: { type: string, enum: [asc, desc] }
1547 |       responses:
1548 |         '200':
1549 |           description: Successful response - returns a list of campaigns.
1550 |           content:
1551 |             application/json:
1552 |               # --- ASSUME PAGINATED RESPONSE SCHEMA ---
1553 |               schema:
1554 |                 type: object
1555 |                 properties:
1556 |                   total_items:
1557 |                     type: integer
1558 |                   total_pages:
1559 |                     type: integer
1560 |                   current_page:
1561 |                     type: integer
1562 |                   items:
1563 |                     type: array
1564 |                     items:
1565 |                       $ref: '#/components/schemas/Campaign'
1566 |               # --- START EXAMPLE for Campaigns (Paginated) ---
1567 |               example:
1568 |                 total_items: 5 # Example total
1569 |                 total_pages: 1 # Example pages
1570 |                 current_page: 0 # Example current page
1571 |                 items:
1572 |                   - _id: "c1f0a3e2-b1d9-4a1e-8b7d-a3b8d4e16c2f" # UUID
1573 |                     campaignname: "SE_MINI_NC-AO-24_Summer_Display_DEU_Generic"
1574 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID from example above
1575 |                     campaigndetail: "Generic Summer Banner Ads"
1576 |                     campaigntype: "Always On"
1577 |                     created_at: "2024-10-15T10:00:00Z"
1578 |                     language: "DEU"
1579 |                     product: "Generic" # Example Product
1580 |                     subsegment: "New Car"
1581 |                     type: "display"
1582 |                     updated_at: "2024-10-16T11:00:00Z"
1583 |                   - _id: "d4e16c2f-9b8c-4f5a-8d3e-e1c7b6a08d3e" # UUID
1584 |                     campaignname: "SE_MINI_NC-AO-24_Summer_Video_DEU_Brand"
1585 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1586 |                     campaigndetail: "Brand Awareness Video"
1587 |                     campaigntype: "Always On"
1588 |                     created_at: "2024-10-15T11:00:00Z"
1589 |                     language: "DEU"
1590 |                     product: "Brand" # Example Product
1591 |                     subsegment: "New Car"
1592 |                     type: "video"
1593 |                     updated_at: "2024-10-17T09:30:00Z"
1594 |                   - _id: "1d0e2f3a-4b5c-4a1e-8c7d-b9d8c7e17a4f" # UUID
1595 |                     campaignname: "SE_MINI_NC-AO-24_Q3_Search_DEU_Electric"
1596 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1597 |                     campaigndetail: "Search Ads for Electric Models"
1598 |                     campaigntype: "Always On"
1599 |                     created_at: "2024-10-18T14:00:00Z"
1600 |                     language: "DEU"
1601 |                     product: "Electric" # Example Product
1602 |                     subsegment: "New Car"
1603 |                     type: "search"
1604 |                     updated_at: null # Example with null updated_at
1605 |                   - _id: "9f0a1b2c-3d4e-4a1e-8b7c-d3e4f5a08b7c" # UUID
1606 |                     campaignname: "SE_MINI_NC-AO-24_Q3_Social_DEU_Cooper"
1607 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1608 |                     campaigndetail: "Social Media Ads Cooper"
1609 |                     campaigntype: "Always On"
1610 |                     created_at: "2024-10-20T09:15:00Z"
1611 |                     language: "DEU"
1612 |                     product: "Cooper" # Example Product
1613 |                     subsegment: "New Car"
1614 |                     type: "social"
1615 |                     updated_at: "2024-10-20T09:15:00Z"
1616 |                   - _id: "1e0f2d3c-4b5a-4c2a-9a8b-c7b8a9e16d3f" # UUID
1617 |                     campaignname: "SE_MINI_NC-AO-24_Q4_Display_DEU_Countryman"
1618 |                     pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches Project UUID
1619 |                     campaigndetail: "Q4 Display Countryman"
1620 |                     campaigntype: "Always On"
1621 |                     created_at: "2024-10-25T16:30:00Z"
1622 |                     language: "DEU"
1623 |                     product: "Countryman" # Example Product
1624 |                     subsegment: "New Car"
1625 |                     type: "display"
1626 |                     updated_at: "2024-10-26T10:00:00Z"
1627 |               # --- END EXAMPLE ---
1628 |         '400':
1629 |           description: Bad Request
1630 |           # ... (rest unchanged)
1631 |         '404':
1632 |           description: Mediaplan or Project not found.
1633 |           # ... (rest unchanged)
1634 |         '500':
1635 |           description: Internal Server Error
1636 |           # ... (rest unchanged)
1637 |     post:
1638 |       summary: Create new Campaing
1639 |       # ... (rest of definition - unchanged) ...
1640 |       tags:
1641 |         - Campaigns
1642 |       parameters:
1643 |         - description: The ID of the Mediaplan.
1644 |           in: path
1645 |           name: mediaplanId
1646 |           required: true
1647 |           schema:
1648 |             format: uuid
1649 |             type: string
1650 |         - description: The ID of the Project.
1651 |           in: path
1652 |           name: projectId
1653 |           required: true
1654 |           schema:
1655 |             format: uuid
1656 |             type: string
1657 |       requestBody:
1658 |         content:
1659 |           application/json:
1660 |             example:
1661 |               campaignname: PL_BMW_NC_NC-AO-2025-weq_AMSF_2025_AO_POL_eqfwefw
1662 |               campaigndetail: eqfwefw
1663 |               campaigntype: AO
1664 |               language: POL
1665 |               pid: 6780ed13ea3ea0016ff8975e
1666 |               product: AMSF
1667 |               subsegment: NC
1668 |               type: display
1669 |             schema:
1670 |               $ref: "#/components/schemas/CampaignCreate"
1671 |         required: true
1672 |       responses:
1673 |         "201":
1674 |           content:
1675 |             application/json:
1676 |               schema:
1677 |                 $ref: "#/components/schemas/Campaign"
1678 |           description: Campaign created successfully.
1679 |         "400":
1680 |           content:
1681 |             application/json:
1682 |               schema:
1683 |                 $ref: "#/components/schemas/Error"
1684 |           description: Bad Request
1685 |         "404":
1686 |           content:
1687 |             application/json:
1688 |               schema:
1689 |                 $ref: "#/components/schemas/Error"
1690 |           description: Mediaplan or Project not found.
1691 |         "422":
1692 |           content:
1693 |             application/json:
1694 |               schema:
1695 |                 $ref: "#/components/schemas/Error"
1696 |           description: Unprocessable Entity
1697 |         "500":
1698 |           content:
1699 |             application/json:
1700 |               schema:
1701 |                 $ref: "#/components/schemas/Error"
1702 |           description: Internal Server Error
1703 | 
1704 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns/{campaignId}:
1705 |     get:
1706 |       summary: Get a single Campaign by ID
1707 |       # ... (rest of definition - unchanged) ...
1708 |       tags:
1709 |         - Campaigns
1710 |       parameters:
1711 |         - description: The ID of the Mediaplan.
1712 |           in: path
1713 |           name: mediaplanId
1714 |           required: true
1715 |           schema:
1716 |             format: uuid
1717 |             type: string
1718 |         - description: The ID of the Project.
1719 |           in: path
1720 |           name: projectId
1721 |           required: true
1722 |           schema:
1723 |             format: uuid
1724 |             type: string
1725 |         - description: The ID of the Campaign.
1726 |           in: path
1727 |           name: campaignId
1728 |           required: true
1729 |           schema:
1730 |             format: uuid
1731 |             type: string
1732 |       responses:
1733 |         "200":
1734 |           description: Successful response - returns the Campaign.
1735 |           content:
1736 |             application/json:
1737 |               schema:
1738 |                 $ref: "#/components/schemas/Campaign"
1739 |               # --- START EXAMPLE ---
1740 |               example:
1741 |                 _id: "c1f0a3e2-b1d9-4a1e-8b7d-a3b8d4e16c2f" # Matches a potential campaignId from the path
1742 |                 campaignname: "SE_MINI_NC-AO-24_Summer_Display_DEU_Generic"
1743 |                 pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Matches a potential projectId from the path
1744 |                 campaigndetail": "Generic Summer Banner Ads - Standard Sizes"
1745 |                 campaigntype: "Always On"
1746 |                 created_at: "2025-05-01T10:00:00Z"
1747 |                 language: "DEU"
1748 |                 product: "Generic"
1749 |                 subsegment: "New Car"
1750 |                 type: "display"
1751 |                 updated_at: "2025-05-02T11:05:00Z" # Current time: 2025-05-02T14:00:48+02:00
1752 |               # --- END EXAMPLE ---
1753 |         "400":
1754 |           content:
1755 |             application/json:
1756 |               schema:
1757 |                 $ref: "#/components/schemas/Error"
1758 |           description: Bad Request (e.g., invalid ID format)
1759 |         "404":
1760 |           content:
1761 |             application/json:
1762 |               schema:
1763 |                 $ref: "#/components/schemas/Error"
1764 |           description: Mediaplan, Project, or Campaign not found.
1765 |         "500":
1766 |           content:
1767 |             application/json:
1768 |               schema:
1769 |                 $ref: "#/components/schemas/Error"
1770 |           description: Internal Server Error
1771 | 
1772 |     put:
1773 |       summary: Update a Campaign (replace entire resource)
1774 |       # ... (rest of definition - unchanged) ...
1775 |       tags:
1776 |         - Campaigns
1777 |       parameters:
1778 |         - description: The ID of the Mediaplan.
1779 |           in: path
1780 |           name: mediaplanId
1781 |           required: true
1782 |           schema:
1783 |             format: uuid
1784 |             type: string
1785 |         - description: The ID of the Project.
1786 |           in: path
1787 |           name: projectId
1788 |           required: true
1789 |           schema:
1790 |             format: uuid
1791 |             type: string
1792 |         - description: The ID of the Campaign to update.
1793 |           in: path
1794 |           name: campaignId
1795 |           required: true
1796 |           schema:
1797 |             format: uuid
1798 |             type: string
1799 |       requestBody:
1800 |         content:
1801 |           application/json:
1802 |             schema:
1803 |               $ref: "#/components/schemas/Campaign"
1804 |         required: true
1805 |       responses:
1806 |         "200":
1807 |           content:
1808 |             application/json:
1809 |               schema:
1810 |                 $ref: "#/components/schemas/Campaign"
1811 |           description: Campaign updated successfully.
1812 |         "204":
1813 |           description: Campaign updated successfully.
1814 |         "400":
1815 |           content:
1816 |             application/json:
1817 |               schema:
1818 |                 $ref: "#/components/schemas/Error"
1819 |           description: Bad Request
1820 |         "404":
1821 |           content:
1822 |             application/json:
1823 |               schema:
1824 |                 $ref: "#/components/schemas/Error"
1825 |           description: Mediaplan, Project, or Campaign not found
1826 |         "422":
1827 |           content:
1828 |             application/json:
1829 |               schema:
1830 |                 $ref: "#/components/schemas/Error"
1831 |           description: Unprocessable Entity
1832 |         "500":
1833 |           content:
1834 |             application/json:
1835 |               schema:
1836 |                 $ref: "#/components/schemas/Error"
1837 |           description: Internal Server Error
1838 | 
1839 |     delete:
1840 |       summary: Delete a Campaign
1841 |       # ... (rest of definition - unchanged) ...
1842 |       tags:
1843 |         - Campaigns
1844 |       parameters:
1845 |         - description: The ID of the Mediaplan.
1846 |           in: path
1847 |           name: mediaplanId
1848 |           required: true
1849 |           schema:
1850 |             format: uuid
1851 |             type: string
1852 |         - description: The ID of the Project.
1853 |           in: path
1854 |           name: projectId
1855 |           required: true
1856 |           schema:
1857 |             format: uuid
1858 |             type: string
1859 |         - description: The ID of the Campaign to delete.
1860 |           in: path
1861 |           name: campaignId
1862 |           required: true
1863 |           schema:
1864 |             format: uuid
1865 |             type: string
1866 |       responses:
1867 |         "204":
1868 |           description: Campaign deleted successfully.
1869 |         "400":
1870 |           content:
1871 |             application/json:
1872 |               schema:
1873 |                 $ref: "#/components/schemas/Error"
1874 |           description: Bad Request
1875 |         "404":
1876 |           content:
1877 |             application/json:
1878 |               schema:
1879 |                 $ref: "#/components/schemas/Error"
1880 |           description: Mediaplan, Project, or Campaign not found
1881 |         "500":
1882 |           content:
1883 |             application/json:
1884 |               schema:
1885 |                 $ref: "#/components/schemas/Error"
1886 |           description: Internal Server Error
1887 | 
1888 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns/{campaignId}/lineitems:
1889 |     get:
1890 |       summary: Get all line items for a given Campaign
1891 |       tags:
1892 |         - LineItems
1893 |       parameters:
1894 |         - description: The ID of the Mediaplan.
1895 |           in: path
1896 |           name: mediaplanId
1897 |           required: true
1898 |           schema:
1899 |             format: uuid
1900 |             type: string
1901 |         - description: The ID of the Project.
1902 |           in: path
1903 |           name: projectId
1904 |           required: true
1905 |           schema:
1906 |             format: uuid
1907 |             type: string
1908 |         - description: The ID of the Campaign.
1909 |           in: path
1910 |           name: campaignId
1911 |           required: true
1912 |           schema:
1913 |             format: uuid
1914 |             type: string
1915 |       responses:
1916 |         "200":
1917 |           description: Successful response - returns a list of line items.
1918 |           content:
1919 |             application/json:
1920 |               schema:
1921 |                 type: array # Current spec indicates an array response
1922 |                 items:
1923 |                   $ref: "#/components/schemas/LineItem"
1924 |               # --- START EXAMPLE for LineItems ---
1925 |               example:
1926 |                 - _id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" # UUID
1927 |                   pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Example Project ID
1928 |                   # mid and cid might be added by the frontend/store, not present in API response
1929 |                   lineitemname: "Display_Banner_300x250_Summer_Generic_Prospecting"
1930 |                   product: "Generic"
1931 |                   phase: "Prospecting"
1932 |                   goals: "Awareness"
1933 |                   targetingtactic: "Contextual"
1934 |                   creatives: ["creative-001", "creative-002"]
1935 |                   created_at: "2024-10-20T10:30:00Z"
1936 |                   updated_at: "2024-10-21T11:00:00Z"
1937 |                 - _id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e" # UUID
1938 |                   pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Example Project ID
1939 |                   lineitemname: "Display_Video_15s_Summer_Generic_Retargeting"
1940 |                   product: "Generic"
1941 |                   phase: "Retargeting"
1942 |                   goals: "Consideration"
1943 |                   targetingtactic: "Behavioral"
1944 |                   creatives: ["creative-003"]
1945 |                   created_at: "2024-10-20T11:00:00Z"
1946 |                   updated_at: null # Example with null updated_at
1947 |                 - _id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f" # UUID
1948 |                   pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Example Project ID
1949 |                   lineitemname: "Video_30s_Summer_Brand_Awareness"
1950 |                   product: "Brand"
1951 |                   phase: "Awareness"
1952 |                   goals: "Reach"
1953 |                   targetingtactic: "Demographic"
1954 |                   creatives: ["creative-004", "creative-005", "creative-006"]
1955 |                   created_at: "2024-10-22T09:00:00Z"
1956 |                   updated_at: "2024-10-22T09:00:00Z"
1957 |               # --- END EXAMPLE ---
1958 |         "400":
1959 |           content:
1960 |             application/json:
1961 |               schema:
1962 |                 $ref: "#/components/schemas/Error"
1963 |           description: Bad Request
1964 |         "404":
1965 |           content:
1966 |             application/json:
1967 |               schema:
1968 |                 $ref: "#/components/schemas/Error"
1969 |           description: Mediaplan, Project, or Campaign not found.
1970 |         "500":
1971 |           content:
1972 |             application/json:
1973 |               schema:
1974 |                 $ref: "#/components/schemas/Error"
1975 |           description: Internal Server Error
1976 | 
1977 |   /mediaplans/{mediaplanId}/projects/{projectId}/campaigns/{campaignId}/lineitems/{lineItemId}:
1978 |     get:
1979 |       summary: Get a single Line Item by ID
1980 |       tags:
1981 |         - LineItems
1982 |       parameters:
1983 |         - description: The ID of the Mediaplan.
1984 |           in: path
1985 |           name: mediaplanId
1986 |           required: true
1987 |           schema:
1988 |             format: uuid
1989 |             type: string
1990 |         - description: The ID of the Project.
1991 |           in: path
1992 |           name: projectId
1993 |           required: true
1994 |           schema:
1995 |             format: uuid
1996 |             type: string
1997 |         - description: The ID of the Campaign.
1998 |           in: path
1999 |           name: campaignId
2000 |           required: true
2001 |           schema:
2002 |             format: uuid
2003 |             type: string
2004 |         - description: The ID of the Line Item.
2005 |           in: path
2006 |           name: lineItemId
2007 |           required: true
2008 |           schema:
2009 |             format: uuid
2010 |             type: string
2011 |       responses:
2012 |         "200":
2013 |           description: Successful response - returns the Line Item.
2014 |           content:
2015 |             application/json:
2016 |               schema:
2017 |                 $ref: "#/components/schemas/LineItem"
2018 |               example:
2019 |                 _id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" # Matches example from list
2020 |                 pid: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
2021 |                 # mid and cid might be added by the frontend/store, not present in API response
2022 |                 lineitemname: "Display_Banner_300x250_Summer_Generic_Prospecting"
2023 |                 product: "Generic"
2024 |                 phase: "Prospecting"
2025 |                 goals: "Awareness"
2026 |                 targetingtactic: "Contextual"
2027 |                 creatives: ["creative-001", "creative-002"]
2028 |                 created_at: "2024-10-20T10:30:00Z"
2029 |                 updated_at: "2024-10-21T11:00:00Z"
2030 |         "400":
2031 |           description: Bad Request (e.g., invalid ID format)
2032 |           content:
2033 |             application/json:
2034 |               schema:
2035 |                 $ref: "#/components/schemas/Error"
2036 |         "404":
2037 |           description: Mediaplan, Project, Campaign, or Line Item not found.
2038 |           content:
2039 |             application/json:
2040 |               schema:
2041 |                 $ref: "#/components/schemas/Error"
2042 |         "500":
2043 |           description: Internal Server Error
2044 |           content:
2045 |             application/json:
2046 |               schema:
2047 |                 $ref: "#/components/schemas/Error"
2048 | 
2049 | components:
2050 |   schemas:
2051 |     # ... (Error, ChangelogEntry, EntityReference, MediaplanFilter, MediaplanCreate, PONumber, Mediaplan - unchanged) ...
2052 |     Error:
2053 |       properties:
2054 |         _id:
2055 |           description: Unique identifier for this error instance.
2056 |           example: 1@mediaplan-app-2025-6d57887bb4-8t9z7
2057 |           type: string
2058 |         code:
2059 |           description: HTTP status code.
2060 |           example: 400
2061 |           type: integer
2062 |         error:
2063 |           description: Specific error details.
2064 |           example: Somethin went wrong.
2065 |           type: string
2066 |         message:
2067 |           description: A general message describing the error category.
2068 |           example: Bad Request
2069 |           type: string
2070 |         timestamp:
2071 |           description: Timestamp of when the error occurred.
2072 |           example: "2025-03-11T13:31:06.443086Z"
2073 |           format: date-time
2074 |           type: string
2075 |         version:
2076 |           description: Application version where the error occurred.
2077 |           example: mediaplan/0.1.45
2078 |           type: string
2079 |       type: object
2080 |     ChangelogEntry:
2081 |       properties:
2082 |         date:
2083 |           description: Date and time of the changelog entry.
2084 |           example: "2024-10-27T14:30:00Z"
2085 |           format: date-time
2086 |           type: string
2087 |         text:
2088 |           description: Description of the change.
2089 |           example: Added new feature for campaign optimization.
2090 |           type: string
2091 |         tool:
2092 |           description: The tool associated with this changelog entry.
2093 |           enum:
2094 |             - CampaignBuilder
2095 |             - Linkshortener
2096 |             - Mediaplan
2097 |           example: CampaignBuilder
2098 |           type: string
2099 |       required:
2100 |         - date
2101 |         - tool
2102 |         - text
2103 |       type: object
2104 |     EntityReference:
2105 |       properties:
2106 |         _id:
2107 |           description: Unique identifier.
2108 |           example: user-002
2109 |           format: uuid
2110 |           type: string
2111 |         name:
2112 |           description: Name of the entity.
2113 |           example: Alice Smith
2114 |           type: string
2115 |       required:
2116 |         - _id
2117 |         - name
2118 |       type: object
2119 |     MediaplanFilter:
2120 |       properties:
2121 |         brand_id:
2122 |           description: Filter by Brand ID.
2123 |           format: uuid
2124 |           type: string
2125 |         search:
2126 |           description: Search term for filtering by name or other relevant fields.
2127 |           type: string
2128 |         start_date_after:
2129 |           description: Filter for mediaplans starting after this date.
2130 |           format: date-time
2131 |           type: string
2132 |         start_date_before:
2133 |           description: Filter for mediaplans starting before this date.
2134 |           format: date-time
2135 |           type: string
2136 |         status:
2137 |           description: Filter by status.
2138 |           enum:
2139 |             - In Planning
2140 |             - Draft
2141 |             - For Approval
2142 |           type: string
2143 |       type: object
2144 |     MediaplanCreate:
2145 |       properties:
2146 |         brand:
2147 |           properties:
2148 |             _id:
2149 |               description: ID of the associated brand.
2150 |               format: uuid
2151 |               type: string
2152 |           required:
2153 |             - _id
2154 |           type: object
2155 |         budget:
2156 |           properties:
2157 |             total:
2158 |               description: Total budget allocated.
2159 |               format: double
2160 |               type: number
2161 |           type: object
2162 |         end_date:
2163 |           description: End date of the Mediaplan.
2164 |           example: "2024-08-31T18:00:00Z"
2165 |           format: date-time
2166 |           type: string
2167 |         name:
2168 |           description: Name of the Mediaplan.
2169 |           example: Summer Campaign 2024
2170 |           type: string
2171 |         po_numbers:
2172 |           items:
2173 |             $ref: "#/components/schemas/PONumber"
2174 |           type: array
2175 |         start_date:
2176 |           description: Start date of the Mediaplan.
2177 |           example: "2024-07-15T10:00:00Z"
2178 |           format: date-time
2179 |           type: string
2180 |         status:
2181 |           description: Status of the Mediaplan.
2182 |           enum:
2183 |             - In Planning
2184 |             - Draft
2185 |             - For Approval
2186 |           example: Draft
2187 |           type: string
2188 |       required:
2189 |         - name
2190 |         - status
2191 |         - start_date
2192 |         - end_date
2193 |         - brand
2194 |         - budget
2195 |       type: object
2196 |     PONumber:
2197 |       properties:
2198 |         _id:
2199 |           description: Unique identifier of the PO Number.
2200 |           example: po-001
2201 |           type: string
2202 |         name:
2203 |           description: Name or description of the PO Number.
2204 |           example: "4700551823"
2205 |           type: string
2206 |         value:
2207 |           description: The numerical value of the PO Number.
2208 |           example: 450.0
2209 |           format: float
2210 |           type: number
2211 |       required:
2212 |         - _id
2213 |         - name
2214 |         - value
2215 |       type: object
2216 |     Mediaplan:
2217 |       properties:
2218 |         _id:
2219 |           description: Unique identifier of the Mediaplan.
2220 |           example: f47ac10b-58cc-4372-a567-0e02b2c3d399
2221 |           format: uuid
2222 |           type: string
2223 |         brand:
2224 |           $ref: "#/components/schemas/EntityReference"
2225 |           description: Reference to the Brand information.
2226 |         budget:
2227 |           description: Budget details for the Mediaplan.
2228 |           properties:
2229 |             available:
2230 |               description: Budget remaining.
2231 |               example: 374.5
2232 |               format: double
2233 |               type: number
2234 |             total:
2235 |               description: Total budget allocated.
2236 |               example: 1250.0
2237 |               format: double
2238 |               type: number
2239 |             used:
2240 |               description: Amount of budget used.
2241 |               example: 875.5
2242 |               format: double
2243 |               type: number
2244 |           required:
2245 |             - total
2246 |             - used
2247 |             - available
2248 |           type: object
2249 |         created_at:
2250 |           description: Timestamp of creation.
2251 |           example: "2024-11-28T14:15:00Z"
2252 |           format: date-time
2253 |           type: string
2254 |         created_by:
2255 |           $ref: "#/components/schemas/EntityReference"
2256 |           description: Reference to the user who created the Mediaplan.
2257 |         end_date:
2258 |           description: End date of the Mediaplan.
2259 |           example: "2025-03-25T00:00:00Z"
2260 |           format: date-time
2261 |           type: string
2262 |         name:
2263 |           description: Name of the Mediaplan.
2264 |           example: Campaign Launch Q1
2265 |           type: string
2266 |         po_numbers:
2267 |           description: List of associated Purchase Order numbers.
2268 |           example:
2269 |             - _id: po-001
2270 |               name: "4700551823"
2271 |               value: 450.0
2272 |             - _id: po-002
2273 |               name: "4700551911"
2274 |               value: 425.5
2275 |           items:
2276 |             $ref: "#/components/schemas/PONumber"
2277 |           type: array
2278 |         start_date:
2279 |           description: Start date of the Mediaplan.
2280 |           example: "2025-02-10T00:00:00Z"
2281 |           format: date-time
2282 |           type: string
2283 |         status:
2284 |           description: Status of the Mediaplan.
2285 |           enum:
2286 |             - In Planning
2287 |             - Draft
2288 |             - For Approval
2289 |           example: In Planning
2290 |           type: string
2291 |         updated_at:
2292 |           description: Timestamp of last update.
2293 |           example: "2024-12-05T09:30:00Z"
2294 |           format: date-time
2295 |           type: string
2296 |       required:
2297 |         - _id
2298 |         - name
2299 |         - status
2300 |         - start_date
2301 |         - end_date
2302 |         - brand
2303 |         - budget
2304 |         - created_by
2305 |         - created_at
2306 |         - updated_at
2307 |       type: object
2308 | 
2309 |     Project:
2310 |       type: object
2311 |       properties:
2312 |         _id:
2313 |           type: string
2314 |           format: uuid
2315 |           description: Unique identifier of the Project.
2316 |         abbreviation:
2317 |           type: string
2318 |           description: Abbreviation for the project.
2319 |         created_at:
2320 |           type: string
2321 |           format: date-time
2322 |           description: Project creation timestamp.
2323 |         budget:
2324 |           type: object
2325 |           description: Budget information for the project.
2326 |           properties:
2327 |             used:
2328 |               type: number
2329 |               format: float
2330 |               example: 12500.50
2331 |               description: The amount of budget that has been used.
2332 |             total:
2333 |               type: number
2334 |               format: float
2335 |               example: 50000.00
2336 |               description: The total budget amount.
2337 |             available:
2338 |               type: number
2339 |               format: float
2340 |               example: 37499.50
2341 |               description: The remaining available budget.
2342 |         example:
2343 |           used: 12500.50
2344 |           total: 50000.00
2345 |           available: 37499.50
2346 |         default_vars:
2347 |           type: object
2348 |           description: Default variables for the project.
2349 |           properties:
2350 |             targeturls:
2351 |               type: string
2352 |               nullable: true
2353 |               description: Target URLs (can be null).
2354 |             subsegment:
2355 |               type: string
2356 |               nullable: true
2357 |               description: Subsegment (can be null).
2358 |             campaigntype:
2359 |               type: string
2360 |               nullable: true
2361 |               description: Campaign type (can be null).
2362 |             language:
2363 |               type: string
2364 |               nullable: true
2365 |               description: Language (can be null).
2366 |             campaigndetail:
2367 |               type: string
2368 |               nullable: true
2369 |               description: Campaign detail (can be null).
2370 |             adtype:
2371 |               type: string
2372 |               nullable: true
2373 |               description: Ad type (can be null).
2374 |             dimension:
2375 |               type: string
2376 |               nullable: true
2377 |               description: Dimension (can be null).
[TRUNCATED]
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
17 |         path: '/mediaplans/:mediaplanId',
18 |         name: 'MediaplanDetail',
19 |         component: () => import('../views/MediaplanDetail.vue'),
20 |         props: true,
21 |     },
22 |     {
23 |         path: '/mediaplans/:mediaplanId/projects/:projectId',
24 |         name: 'ProjectDetail',
25 |         component: () => import('../views/ProjectDetail.vue'), // Pfad zur neuen Komponente prüfen
26 |         props: true, // Übergibt mediaplanId und projectId als Props
27 |         //meta: { requiresAuth: true } // Annahme: Detail erfordert Login
28 |     },
29 |     {
30 |         path: '/mediaplans/:mediaplanId/projects/:projectId/campaigns/:campaignId/lineitems', // Pfad anpassen nach Bedarf
31 |         name: 'LineitemDetail',
32 |         component: () => import('../views/CampaignDetail.vue'), // Pfad zur neuen Komponente
33 |         props: true, // Übergibt mediaplanId, projectId und campaignId als Props
34 |         //meta: { requiresAuth: true } // Annahme: Detail erfordert Login
35 |     },
36 |     // Additional routes here
37 | ]
38 | 
39 | const router = createRouter({
40 |     history: createWebHashHistory(import.meta.env.BASE_URL),
41 |     routes,
42 | })
43 | router.beforeEach((to, from, next) => {
44 | /*    const authStore = useAuthStore()
45 |     console.log('Navigation Guard:', to.name, authStore.isAuthenticated)
46 |     if (to.name !== 'Login' && !authStore.isAuthenticated) {
47 |         next({name: 'Login'})
48 |     } else {
49 |         next()
50 |     }*/
51 |     next()
52 | })
53 | export default router
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
58 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns?${queryParams.toString()}`;
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
111 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}`;
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
163 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns`;
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
4 | import type { PONumber } from '@/types/mediaplan';
5 | import customFetch from "../helpers/customFetch.ts";
6 | import type {Mediaplan} from "../types";
7 | // useSourcesStore is no longer needed here directly for brands
8 | // import { useSourcesStore } from './sourcesStore';
9 | 
10 | export const useCreateMediaplanStore = defineStore('createMediaplan', () => {
11 |     // const sourcesStore = useSourcesStore(); // Not needed if brands are handled in component
12 | 
13 |     // State
14 |     // const brands = ref<Brand[]>([]); // Removed
15 |     const poNumbers = ref<PONumber[]>([]);
16 |     const isLoading = ref(false); // This can be for PO numbers fetching and mediaplan creation
17 |     const error = ref<string | null>(null);
18 | 
19 |     // Actions
20 |     // async function fetchBrands() { ... } // Removed
21 | 
22 |     async function fetchPONumbers() {
23 |         isLoading.value = true;
24 |         error.value = null;
25 | 
26 |         try {
27 |             // In a real application, this would be an API call to get PO numbers
28 |             // const response = await customFetch('/po-numbers');
29 |             // poNumbers.value = response;
30 | 
31 |             // For demo purposes, use mock data
32 |             poNumbers.value = [
33 |                 { _id: 'po-1', name: 'PO12345', value: 10000 },
34 |                 { _id: 'po-2', name: 'PO67890', value: 15000 },
35 |                 { _id: 'po-3', name: 'PO24680', value: 20000 },
36 |             ];
37 |         } catch (err) {
38 |             error.value = err instanceof Error ? err.message : 'Error fetching PO numbers';
39 |             console.error('Error fetching PO numbers:', err);
40 |         } finally {
41 |             isLoading.value = false;
42 |         }
43 |     }
44 | 
45 |     async function createPO(poData: Omit<PONumber, '_id'> & { metadata?: any }): Promise<PONumber> {
46 |         isLoading.value = true;
47 |         error.value = null;
48 | 
49 |         try {
50 |             // In a real application, this would be an API call to create a PO
51 |             // const response = await customFetch('/po-numbers', {
52 |             //   method: 'POST',
53 |             //   headers: {
54 |             //     'Content-Type': 'application/json',
55 |             //   },
56 |             //   body: JSON.stringify(poData),
57 |             // });
58 |             // return response;
59 | 
60 |             // For demo purposes, simulate API call
61 |             await new Promise(resolve => setTimeout(resolve, 500));
62 | 
63 |             const newPO: PONumber = {
64 |                 _id: `po-${Date.now()}`,
65 |                 name: poData.name,
66 |                 value: poData.value
67 |             };
68 | 
69 |             poNumbers.value.push(newPO);
70 | 
71 |             return newPO;
72 |         } catch (err) {
73 |             error.value = err instanceof Error ? err.message : 'Error creating PO';
74 |             console.error('Error creating PO:', err);
75 |             throw err;
76 |         } finally {
77 |             isLoading.value = false;
78 |         }
79 |     }
80 | 
81 |     // Mediaplan creation logic (example, can be expanded)
82 |     async function createMediaplan(mediaplanData: Mediaplan): Promise<Mediaplan | null> {
83 |         isLoading.value = true;
84 |         error.value = null;
85 |         try {
86 |             // Actual API call to POST /mediaplans
87 |             const newMediaplan = await customFetch('mediaplans', {
88 |                 method: 'POST',
89 |                 body: JSON.stringify(mediaplanData),
90 |             }) as Mediaplan; // Assuming the response is the created Mediaplan object
91 |             return newMediaplan;
92 |         } catch (err) {
93 |             error.value = err instanceof Error ? err.message : 'Error creating mediaplan';
94 |             console.error('Error creating mediaplan:', err);
95 |             // Optionally, you might want to emit an error event or rethrow
96 |             // depending on how you want to handle errors globally vs. locally
97 |             return null; // Or throw err;
98 |         } finally {
99 |             isLoading.value = false;
100 |         }
101 |     }
102 | 
103 | 
104 |     return {
105 |         // State
106 |         poNumbers,
107 |         isLoading,
108 |         error,
109 | 
110 |         // Actions
111 |         fetchPONumbers,
112 |         createPO,
113 |         createMediaplan, // Added for completeness if store handles creation
114 |     };
115 | });
```

src/stores/lineitemStore.ts
```
1 | // src/stores/lineItemStore.ts
2 | import { defineStore } from 'pinia';
3 | import { ref } from 'vue';
4 | import customFetch from '@/helpers/customFetch'; // Adjust path if necessary
5 | import type {
6 |     Lineitem,
7 |     LineitemListResponse,
8 |     LineitemCreate,
9 | } from '@/types/lineitem'; // Adjust path if necessary
10 | 
11 | export const useLineitemStore = defineStore('lineItem', () => {
12 |     // --- State ---
13 |     const lineitems = ref<Lineitem[]>([]);
14 |     const selectedLineitem = ref<Lineitem | null>(null);
15 |     const isLoading = ref(false);
16 |     const error = ref<string | null>(null);
17 | 
18 |     // New state variables for pagination and sorting
19 |     const totalItems = ref(0);
20 |     const totalPages = ref(0);
21 |     const currentPage = ref(0);
22 |     const perPage = ref(10);
23 |     const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([]);
24 | 
25 |     // Store context IDs for potential reload actions or context checking
26 |     const currentContextMediaplanId = ref<string | null>(null);
27 |     const currentContextProjectId = ref<string | null>(null);
28 |     const currentContextCampaignId = ref<string | null>(null);
29 | 
30 |     // --- Actions ---
31 | 
32 |     /**
33 |      * Fetches the list of Line Items for a specific Campaign within a Project and Mediaplan.
34 |      * NOTE: Based on the current Swagger spec, this endpoint returns an array, not a paginated response.
35 |      * If the API changes to support pagination, this function and the state need updates.
36 |      * @param {string} mediaplanId - The ID of the Mediaplan.
37 |      * @param {string} projectId - The ID of the Project.
38 |      * @param {string} campaignId - The ID of the Campaign.
39 |      */
40 |     async function fetchLineitems(
41 |         mediaplanId: string,
42 |         projectId: string,
43 |         campaignId: string
44 |     ) {
45 |         if (!mediaplanId || !projectId || !campaignId) {
46 |             error.value =
47 |                 'Mediaplan ID, Project ID, or Campaign ID is missing for fetching line items.';
48 |             console.error(error.value);
49 |             lineitems.value = [];
50 |             return;
51 |         }
52 | 
53 |         // Store context
54 |         currentContextMediaplanId.value = mediaplanId;
55 |         currentContextProjectId.value = projectId;
56 |         currentContextCampaignId.value = campaignId;
57 | 
58 |         isLoading.value = true;
59 |         error.value = null;
60 |         try {
61 |             // Construct the API URL
62 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}/lineitems`;
63 | 
64 |             // Make the API call
65 |             // Expecting LineitemListResponse which is currently typed as Lineitem[]
66 |             const response = (await customFetch(url)) as LineitemListResponse;
67 | 
68 |             // Validate response format (expecting an array)
69 |             if (Array.isArray(response)) {
70 |                 lineitems.value = response.map(item => ({
71 |                     ...item,
72 |                     // Add context IDs if not provided by API but needed locally
73 |                     mid: mediaplanId,
74 |                     pid: projectId, // pid should already be there from API
75 |                     cid: campaignId
76 |                 }));
77 |                 totalItems.value = response.length;
78 |                 totalPages.value = 1; // No real pagination yet
79 |                 currentPage.value = 0;
80 |             } else {
81 |                 console.warn(
82 |                     'Received unexpected response format for line items, expected an array.',
83 |                     response
84 |                 );
85 |                 lineitems.value = []; // Reset state on unexpected format
86 |                 error.value = 'Unexpected response format from server.';
87 |             }
88 |         } catch (err) {
89 |             error.value =
90 |                 err instanceof Error
91 |                     ? err.message
92 |                     : 'An error occurred while fetching line items';
93 |             console.error('Error fetching line items:', err);
94 |             lineitems.value = []; // Reset state on error
95 |         } finally {
96 |             isLoading.value = false;
97 |         }
98 |     }
99 | 
100 |     /**
101 |      * Fetches details for a single Line Item. (Optional but recommended)
102 |      * @param {string} mediaplanId - The ID of the Mediaplan.
103 |      * @param {string} projectId - The ID of the Project.
104 |      * @param {string} campaignId - The ID of the Campaign.
105 |      * @param {string} lineItemId - The ID of the Line Item to fetch.
106 |      */
107 |     async function fetchLineitem(
108 |         mediaplanId: string,
109 |         projectId: string,
110 |         campaignId: string,
111 |         lineItemId: string
112 |     ) {
113 |         if (!mediaplanId || !projectId || !campaignId || !lineItemId) {
114 |             error.value = 'Missing IDs to fetch line item details.';
115 |             console.error(error.value);
116 |             selectedLineitem.value = null;
117 |             return;
118 |         }
119 |         isLoading.value = true; // Consider a separate loading state if needed
120 |         error.value = null;
121 |         selectedLineitem.value = null; // Reset before fetching
122 |         try {
123 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}/lineitems/${lineItemId}`;
124 |             const response = (await customFetch(url)) as Lineitem;
125 |             selectedLineitem.value = {
126 |                 ...response,
127 |                 // Add context IDs if not provided by API but needed locally
128 |                 mid: mediaplanId,
129 |                 pid: projectId, // pid should already be there from API
130 |                 cid: campaignId
131 |             };
132 |         } catch (err) {
133 |             error.value =
134 |                 err instanceof Error
135 |                     ? err.message
136 |                     : 'Failed to load line item details';
137 |             console.error(`Error fetching line item ${lineItemId}:`, err);
138 |             selectedLineitem.value = null;
139 |         } finally {
140 |             isLoading.value = false;
141 |         }
142 |     }
143 | 
144 |     /**
145 |      * Creates a new Line Item for a specific Campaign. (Optional but recommended)
146 |      * @param {string} mediaplanId - The ID of the Mediaplan.
147 |      * @param {string} projectId - The ID of the Project.
148 |      * @param {string} campaignId - The ID of the Campaign.
149 |      * @param {LineitemCreate} lineItemData - The data for the new Line Item.
150 |      * @returns {Promise<Lineitem | null>} The created Line Item or null on failure.
151 |      */
152 |     async function createLineitem(
153 |         mediaplanId: string,
154 |         projectId: string,
155 |         campaignId: string,
156 |         lineItemData: LineitemCreate
157 |     ): Promise<Lineitem | null> {
158 |         if (!mediaplanId || !projectId || !campaignId) {
159 |             error.value = 'Missing IDs for creating line item.';
160 |             console.error(error.value);
161 |             return null;
162 |         }
163 |         isLoading.value = true; // Consider a separate loading state
164 |         error.value = null;
165 |         try {
166 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}/campaigns/${campaignId}/lineitems`;
167 |             const newLinteItem = (await customFetch(url, {
168 |                 method: 'POST',
169 |                 headers: { 'Content-Type': 'application/json' },
170 |                 body: JSON.stringify(lineItemData),
171 |             })) as Lineitem;
172 | 
173 |             // Optional: Refetch the list or manually add the new item
174 |             // For simplicity, refetching is often easier unless performance is critical
175 |             await fetchLineitems(mediaplanId, projectId, campaignId);
176 | 
177 |             return {
178 |                 ...newLinteItem,
179 |                 // Add context IDs if not provided by API but needed locally
180 |                 mid: mediaplanId,
181 |                 pid: projectId, // pid should already be there from API
182 |                 cid: campaignId
183 |             };
184 |         } catch (err) {
185 |             error.value =
186 |                 err instanceof Error ? err.message : 'Failed to create line item';
187 |             console.error('Error creating line item:', err);
188 |             return null;
189 |         } finally {
190 |             isLoading.value = false;
191 |         }
192 |     }
193 | 
194 |     // --- Return Store API ---
195 |     return {
196 |         // State
197 |         lineitems,
198 |         selectedLineitem,
199 |         isLoading,
200 |         error,
201 |         currentContextMediaplanId, // Expose context if needed externally
202 |         currentContextProjectId,
203 |         currentContextCampaignId,
204 | 
205 |         totalItems,
206 |         totalPages,
207 |         currentPage,
208 |         perPage,
209 |         sortBy,
210 | 
211 |         // Actions
212 |         fetchLineitems,
213 |         fetchLineitem, // Expose if needed
214 |         createLineitem, // Expose if needed
215 |     };
216 | });
```

src/stores/mediaplanStore.ts
```
1 | import {defineStore} from 'pinia';
2 | import {ref, computed} from 'vue';
3 | import customFetch from '@/helpers/customFetch';
4 | import type {
5 |     Mediaplan,
6 |     MediaplanFilter,
7 |     Brand,
8 |     Source
9 | } from '@/types';
10 | import {useSourcesStore} from './sourcesStore';
11 | 
12 | interface ActualMediaplanListResponse {
13 |     _id?: string;
14 |     version?: string;
15 |     timestamp?: string;
16 |     code?: number;
17 |     message?: string;
18 |     data: Mediaplan[];
19 |     count?: number;
20 |     page?: number;
21 |     page_count?: number;
22 |     per_page?: number;
23 |     total_count?: number;
24 | 
25 |     items?: Mediaplan[];
26 |     total_items?: number;
27 |     total_pages?: number;
28 |     current_page?: number;
29 | }
30 | 
31 | 
32 | export const useMediaplanStore = defineStore('mediaplan', () => {
33 |     const sourcesStore = useSourcesStore();
34 | 
35 |     const mediaplans = ref<Mediaplan[]>([]);
36 |     const isLoading = ref(false);
37 |     const error = ref<string | null>(null);
38 |     const selectedMediaplan = ref<Mediaplan | null>(null);
39 | 
40 |     const totalItems = ref(0);
41 |     const totalPages = ref(0);
42 |     const currentPage = ref(0);
43 |     const perPage = ref(10);
44 | 
45 |     const filters = ref<MediaplanFilter>({search: '', status: ''});
46 |     const sortBy = ref('updated_at');
47 |     const sortOrder = ref<'asc' | 'desc'>('desc');
48 | 
49 |     const hasFilters = computed(() =>
50 |         !!(
51 |             filters.value.search ||
52 |             filters.value.status ||
53 |             filters.value.brand_id ||
54 |             filters.value.country
55 |         )
56 |     );
57 | 
58 |     const overviewFilterSources = computed(() => ({
59 |         brands: (sourcesStore.getSourceList('brand') as Brand[] | undefined) || [],
60 |         countries: (sourcesStore.getSourceList('country') as Source[] | undefined) || [],
61 |         subsegments: (sourcesStore.getSourceList('subsegment') as Source[] | undefined) || [],
62 |         products: (sourcesStore.getSourceList('product') as Source[] | undefined) || [],
63 |         campaigntypes: (sourcesStore.getSourceList('campaigntype') as Source[] | undefined) || [],
64 |         languages: (sourcesStore.getSourceList('language') as Source[] | undefined) || [],
65 |     }));
66 | 
67 |     async function fetchMediaplan(id: string) {
68 |         isLoading.value = true;
69 |         error.value = null;
70 |         try {
71 |             const res = await customFetch(`mediaplans/${id}`) as Mediaplan;
72 |             selectedMediaplan.value = (res as any).data || res;
73 |         } catch (err) {
74 |             selectedMediaplan.value = null;
75 |             error.value = err instanceof Error ? err.message : 'Error fetching mediaplan';
76 |         } finally {
77 |             isLoading.value = false;
78 |         }
79 |     }
80 | 
81 |     async function fetchMediaplans() {
82 |         isLoading.value = true;
83 |         error.value = null;
84 |         try {
85 |             const params = new URLSearchParams({
86 |                 page: currentPage.value.toString(),
87 |                 per_page: perPage.value.toString(),
88 |                 sort: sortBy.value,
89 |                 order: sortOrder.value,
90 |             });
91 | 
92 |             const active: Record<string, any> = {};
93 |             Object.entries(filters.value).forEach(([k, v]) => {
94 |                 if (v !== '' && v != null) {
95 |                     active[k] = v;
96 |                 }
97 |             });
98 |             if (Object.keys(active).length) {
99 |                 params.append('filter', JSON.stringify(active));
100 |             }
101 | 
102 |             const url = `mediaplans?${params.toString()}`;
103 |             const resp = await customFetch(url) as ActualMediaplanListResponse;
104 | 
105 |             mediaplans.value = resp.data || resp.items || [];
106 |             totalItems.value = resp.total_count ?? resp.total_items ?? mediaplans.value.length;
107 |             totalPages.value = resp.page_count ?? resp.total_pages ?? 1;
108 |             currentPage.value = resp.page ?? resp.current_page ?? 0;
109 |             if (resp.per_page) {
110 |                 perPage.value = resp.per_page;
111 |             }
112 | 
113 |         } catch (err) {
114 |             error.value = err instanceof Error ? err.message : 'Error fetching mediaplans';
115 |             mediaplans.value = [];
116 |             totalItems.value = totalPages.value = 0;
117 |         } finally {
118 |             isLoading.value = false;
119 |         }
120 |     }
121 | 
122 |     function setFilter(key: keyof MediaplanFilter, value: unknown) {
123 |         filters.value = {...filters.value, [key]: value};
124 |         currentPage.value = 0;
125 |         fetchMediaplans();
126 |     }
127 | 
128 |     function clearFilters() {
129 |         filters.value = {search: '', status: ''};
130 |         currentPage.value = 0;
131 |         fetchMediaplans();
132 |     }
133 | 
134 |     function setSorting(field: string, order: 'asc' | 'desc') {
135 |         sortBy.value = field;
136 |         sortOrder.value = order;
137 |         fetchMediaplans();
138 |     }
139 | 
140 |     function setPage(page: number) {
141 |         currentPage.value = page;
142 |         fetchMediaplans();
143 |     }
144 | 
145 |     async function init() {
146 |         await sourcesStore.fetchSources('creation', 'mediaplan');
147 |         await fetchMediaplans();
148 |     }
149 | 
150 |     return {
151 |         overviewFilterSources,
152 |         mediaplans,
153 |         selectedMediaplan,
154 |         isLoading,
155 |         error,
156 |         totalItems,
157 |         totalPages,
158 |         currentPage,
159 |         perPage,
160 |         filters,
161 |         sortBy,
162 |         sortOrder,
163 |         hasFilters,
164 |         fetchMediaplans,
165 |         fetchMediaplan,
166 |         setFilter,
167 |         clearFilters,
168 |         setSorting,
169 |         setPage,
170 |         init
171 |     };
172 | });
```

src/stores/poNumberStore.ts
```
1 | import {defineStore} from 'pinia';
2 | import {ref, computed} from 'vue';
3 | import customFetch from '@/helpers/customFetch';
4 | import type {PONumber} from '@/types/mediaplan';
5 | 
6 | export interface PONumberCreatePayload {
7 |     name: string;
8 |     value: number;
9 |     metadata?: Record<string, any>;
10 | }
11 | 
12 | export interface PONumberUpdatePayload {
13 |     name?: string;
14 |     value?: number;
15 |     metadata?: Record<string, any>;
16 | }
17 | 
18 | export const usePoNumberStore = defineStore('poNumber', () => {
19 |     const poNumbers = ref<PONumber[]>([]);
20 |     const selectedPONumber = ref<PONumber | null>(null);
21 |     const isLoading = ref(false);
22 |     const error = ref<string | null>(null);
23 | 
24 |     const getPONumberById = computed(() => {
25 |         return (id: string) => poNumbers.value.find(po => po._id === id);
26 |     });
27 | 
28 |     const allPONumbers = computed(() => poNumbers.value);
29 | 
30 |     async function fetchPONumbers(): Promise<void> {
31 |         isLoading.value = true;
32 |         error.value = null;
33 |         try {
34 |             const response = await customFetch('po') as any;
35 |             poNumbers.value = response.data;
36 |         } catch (err) {
37 |             error.value = err instanceof Error ? err.message : 'Failed to fetch PO Numbers';
38 |             console.error('Error fetching PO Numbers:', err);
39 |             poNumbers.value = [];
40 |         } finally {
41 |             isLoading.value = false;
42 |         }
43 |     }
44 | 
45 |     async function fetchPONumber(id: string): Promise<PONumber | null> {
46 |         isLoading.value = true;
47 |         error.value = null;
48 |         selectedPONumber.value = null;
49 |         try {
50 |             const response = await customFetch(`po/${id}`) as PONumber;
51 |             const index = poNumbers.value.findIndex(p => p._id === id);
52 |             if (index !== -1) {
53 |                 poNumbers.value[index] = response;
54 |             } else {
55 |             }
56 |             selectedPONumber.value = response;
57 |             return response;
58 |         } catch (err) {
59 |             error.value = err instanceof Error ? err.message : `Failed to fetch PO Number with ID ${id}`;
60 |             console.error(`Error fetching PO Number ${id}:`, err);
61 |             return null;
62 |         } finally {
63 |             isLoading.value = false;
64 |         }
65 |     }
66 | 
67 |     async function createPONumber(payload: PONumberCreatePayload): Promise<PONumber | null> {
68 |         isLoading.value = true;
69 |         error.value = null;
70 |         try {
71 |             const requestBody: Record<string, any> = {
72 |                 name: payload.name,
73 |                 value: payload.value,
74 |             };
75 |             if (payload.metadata) {
76 |                 requestBody.metadata = payload.metadata;
77 |             }
78 | 
79 |             const newPONumber = await customFetch('po', {
80 |                 method: 'POST',
81 |                 body: JSON.stringify(requestBody),
82 |             }) as PONumber;
83 | 
84 |             poNumbers.value.push(newPONumber);
85 |             return newPONumber;
86 |         } catch (err) {
87 |             error.value = err instanceof Error ? err.message : 'Failed to create PO Number';
88 |             console.error('Error creating PO Number:', err);
89 |             return null;
90 |         } finally {
91 |             isLoading.value = false;
92 |         }
93 |     }
94 | 
95 |     async function updatePONumber(id: string, payload: PONumberUpdatePayload): Promise<PONumber | null> {
96 |         isLoading.value = true;
97 |         error.value = null;
98 |         try {
99 |             const updatedPONumber = await customFetch(`po/${id}`, {
100 |                 method: 'PUT',
101 |                 body: JSON.stringify(payload),
102 |             }) as PONumber;
103 | 
104 |             const index = poNumbers.value.findIndex(po => po._id === id);
105 |             if (index !== -1) {
106 |                 poNumbers.value[index] = {...poNumbers.value[index], ...updatedPONumber};
107 |             }
108 |             if (selectedPONumber.value?._id === id) {
109 |                 selectedPONumber.value = {...selectedPONumber.value, ...updatedPONumber};
110 |             }
111 |             return updatedPONumber;
112 |         } catch (err) {
113 |             error.value = err instanceof Error ? err.message : `Failed to update PO Number with ID ${id}`;
114 |             console.error(`Error updating PO Number ${id}:`, err);
115 |             return null;
116 |         } finally {
117 |             isLoading.value = false;
118 |         }
119 |     }
120 | 
121 |     async function deletePONumber(id: string): Promise<boolean> {
122 |         isLoading.value = true;
123 |         error.value = null;
124 |         try {
125 |             await customFetch(`po/${id}`, {
126 |                 method: 'DELETE',
127 |             });
128 |             poNumbers.value = poNumbers.value.filter(po => po._id !== id);
129 |             if (selectedPONumber.value?._id === id) {
130 |                 selectedPONumber.value = null;
131 |             }
132 |             return true;
133 |         } catch (err) {
134 |             error.value = err instanceof Error ? err.message : `Failed to delete PO Number with ID ${id}`;
135 |             console.error(`Error deleting PO Number ${id}:`, err);
136 |             return false;
137 |         } finally {
138 |             isLoading.value = false;
139 |         }
140 |     }
141 | 
142 |     return {
143 |         poNumbers,
144 |         selectedPONumber,
145 |         isLoading,
146 |         error,
147 |         allPONumbers,
148 |         getPONumberById,
149 |         fetchPONumbers,
150 |         fetchPONumber,
151 |         createPONumber,
152 |         updatePONumber,
153 |         deletePONumber,
154 |     };
155 | });
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
24 |     // Added pagination and sorting state variables
25 |     const totalItems = ref(0);
26 |     const totalPages = ref(0);
27 |     const currentPage = ref(0);
28 |     const perPage = ref(10);
29 |     const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([]);
30 | 
31 |     // Options for project form
32 |     const countries = ref<ProjectCountry[]>([]);
33 |     const languages = ref<ProjectLanguage[]>([]);
34 |     const campaignTypes = ref<ProjectCampaignType[]>([]);
35 |     const phases = ref<ProjectPhase[]>([]);
36 |     const goals = ref<ProjectGoal[]>([]);
37 |     const builders = ref<ProjectBuilder[]>([]);
38 | 
39 |     // Getters
40 |     const getProjectById = computed(() => {
41 |         return (id: string) => projects.value.find(project => project._id === id) || null;
42 |     });
43 | 
44 |     // Actions
45 |     async function fetchProjects(mediaplanId: string) {
46 |         isLoading.value = true;
47 |         error.value = null;
48 | 
49 |         try {
50 |             // Build query parameters
51 |             const queryParams = new URLSearchParams();
52 |             queryParams.append('page', currentPage.value.toString());
53 |             queryParams.append('per_page', perPage.value.toString());
54 | 
55 |             const url = `mediaplans/${mediaplanId}/projects?${queryParams.toString()}`;
56 |             const response = await customFetch(url) as ProjectListResponse;
57 | 
58 |             projects.value = response.items;
59 |             totalItems.value = response.total_items;
60 |             totalPages.value = response.total_pages;
61 |             currentPage.value = response.current_page;
62 | 
63 |         } catch (err) {
64 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching projects';
65 |             console.error('Error fetching projects:', err);
66 |         } finally {
67 |             isLoading.value = false;
68 |         }
69 |     }
70 | 
71 |     async function fetchProject(mediaplanId: string, projectId: string) {
72 |         isLoading.value = true;
73 |         error.value = null;
74 | 
75 |         try {
76 |             const url = `mediaplans/${mediaplanId}/projects/${projectId}`;
77 |             const response = await customFetch(url) as Project;
78 |             selectedProject.value = response;
79 |             return response;
80 |         } catch (err) {
81 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching project';
82 |             console.error('Error fetching project:', err);
83 |             throw err;
84 |         } finally {
85 |             isLoading.value = false;
86 |         }
87 |     }
88 | 
89 |     async function createProject(projectData: ProjectCreate) {
90 |         isLoading.value = true;
91 |         error.value = null;
92 | 
93 |         try {
94 |             const url = `mediaplans/${projectData.mediaplanId}/projects`;
95 | 
96 |             // For our implementation, we need to adjust the data structure to match the API expectations
97 |             const payload = {
98 |                 abbreviation: projectData.name,
99 |                 default_vars: {
100 |                     targeturls: null,
101 |                     subsegment: projectData.phase,
102 |                     campaigntype: projectData.campaignType,
103 |                     language: projectData.language,
104 |                     campaigndetail: null,
105 |                     adtype: "Banner",
106 |                     dimension: "300x250"
107 |                 },
108 |                 descriptive_vars: {
109 |                     brand: "BMW", // This would typically be dynamic
110 |                     country: projectData.country.code,
111 |                     bmwponumber: "PO12345", // This would be dynamic based on the selected PO
112 |                     adobecampaignname: projectData.name,
113 |                     subsegment: projectData.phase,
114 |                     campaigntype: projectData.campaignType,
115 |                     projectname: projectData.name,
116 |                     year: new Date().getFullYear()
117 |                 },
118 |                 is_locked: false,
119 |                 labels: [],
120 |                 lock_state: 0,
121 |                 owner: "user123", // Would be the current user
122 |                 message: "OK",
123 |                 version: "v1"
124 |             };
125 | 
126 |             // For demo purposes, log the payload
127 |             console.log('Creating project with data:', payload);
128 | 
129 |             // In a real implementation, we would send the API request
130 |             /*
131 |             const response = await customFetch(url, {
132 |               method: 'POST',
133 |               headers: {
134 |                 'Content-Type': 'application/json',
135 |               },
136 |               body: JSON.stringify(payload),
137 |             });
138 | 
139 |             return response._id;
140 |             */
141 | 
142 |             // For demo, simulate successful creation
143 |             await new Promise(resolve => setTimeout(resolve, 500));
144 | 
145 |             // Return a mock project ID
146 |             return `project-${Date.now()}`;
147 | 
148 |         } catch (err) {
149 |             error.value = err instanceof Error ? err.message : 'An error occurred while creating project';
150 |             console.error('Error creating project:', err);
151 |             throw err;
152 |         } finally {
153 |             isLoading.value = false;
154 |         }
155 |     }
156 | 
157 |     async function fetchProjectOptions() {
158 |         isLoading.value = true;
159 |         error.value = null;
160 | 
161 |         try {
162 |             // In a real application, we would fetch these from the API
163 |             // For this demo, we're using mock data
164 | 
165 |             // Mock countries
166 |             countries.value = [
167 |                 {code: 'AT', name: 'Austria'},
168 |                 {code: 'DE', name: 'Germany'},
169 |                 {code: 'PL', name: 'Poland'},
170 |                 {code: 'US', name: 'United States'}
171 |             ];
172 | 
173 |             // --- CORRECTED Mock languages ---
174 |             languages.value = [
175 |                 {code: 'DEU', name: 'German', country_codes: ['DE', 'AT']}, // Added country_codes
176 |                 {code: 'ENG', name: 'English', country_codes: ['US']},      // Added country_codes
177 |                 {code: 'POL', name: 'Polish', country_codes: ['PL']}       // Added country_codes
178 |                 // Add other languages and their associated country codes as needed
179 |             ];
180 |             // --- END CORRECTION ---
181 | 
182 |             // Mock campaign types
183 |             campaignTypes.value = [
184 |                 {id: 'always-on', name: 'Always On'},
185 |                 {id: 'awareness', name: 'Awareness'},
186 |                 {id: 'consideration', name: 'Consideration'}
187 |             ];
188 | 
189 |             // Mock phases
190 |             phases.value = [
191 |                 {id: 'sea', name: 'SEA'},
192 |                 {id: 'planning', name: 'Planning'},
193 |                 {id: 'execution', name: 'Execution'}
194 |             ];
195 | 
196 |             // Mock goals
197 |             goals.value = [
198 |                 {id: 'consideration', name: 'Consideration'},
199 |                 {id: 'configurator', name: 'Configurator'},
200 |                 {id: 'conversion', name: 'Conversion'}
201 |             ];
202 | 
203 |             // Mock builders
204 |             builders.value = [
205 |                 {id: 'sea', name: 'SEA'},
206 |                 {id: 'social', name: 'Social'},
207 |                 {id: 'display', name: 'Display'},
208 |                 {id: '2layer', name: '2Layer'}
209 |             ];
210 | 
211 |         } catch (err) {
212 |             error.value = err instanceof Error ? err.message : 'An error occurred while fetching project options';
213 |             console.error('Error fetching project options:', err);
214 |         } finally {
215 |             isLoading.value = false;
216 |         }
217 |     }
218 |     return {
219 |         // State
220 |         projects,
221 |         selectedProject,
222 |         isLoading,
223 |         error,
224 |         countries,
225 |         languages,
226 |         campaignTypes,
227 |         phases,
228 |         goals,
229 |         builders,
230 |         totalItems,
231 |         totalPages,
232 |         currentPage,
233 |         perPage,
234 |         sortBy,
235 | 
236 |         // Getters
237 |         getProjectById,
238 | 
239 |         // Actions
240 |         fetchProjects,
241 |         fetchProject,
242 |         createProject,
243 |         fetchProjectOptions
244 |     };
245 | });
```

src/stores/sourcesStore.ts
```
1 | import {defineStore} from 'pinia';
2 | import {ref, computed} from 'vue';
3 | import customFetch from '@/helpers/customFetch';
4 | import type {Source, Brand} from '@/types/mediaplan';
5 | 
6 | export type GlossaryHandlerResponse = Record<string, Array<Record<string, any>>>;
7 | 
8 | export interface SourcesStateValues {
9 |     [key: string]: Array<Source | Brand | Record<string, any>>;
10 | }
11 | 
12 | export const useSourcesStore = defineStore('sources', () => {
13 |     const sourcesData = ref<SourcesStateValues>({});
14 |     const isLoading = ref(false);
15 |     const error = ref<string | null>(null);
16 |     const currentType = ref<string | null>(null);
17 |     const currentLevel = ref<string | null>(null);
18 | 
19 |     const getSourceList = computed(() => {
20 | 
21 |         const tmp = (dimensionKey: string): Array<Source | Brand | Record<string, any>> | undefined => {
22 |             return sourcesData.value[dimensionKey];
23 |         };
24 |         return tmp
25 |     });
26 | 
27 |     async function fetchSources(type: string, level: string): Promise<boolean> {
28 |         if (!type || !level) {
29 |             error.value = 'Type and level are required to fetch sources.';
30 |             console.error(error.value);
31 |             currentType.value = null;
32 |             currentLevel.value = null;
33 |             return false;
34 |         }
35 | 
36 |         isLoading.value = true;
37 |         error.value = null;
38 |         try {
39 |             const endpoint = `settings?type=${encodeURIComponent(type)}&level=${encodeURIComponent(level)}`;
40 |             const response = await customFetch(endpoint) as GlossaryHandlerResponse;
41 |             const data = response.data
42 |             for (const key in data) {
43 |                 if (Object.prototype.hasOwnProperty.call(data, key)) {
44 |                     sourcesData.value[key] = data[key];
45 |                 }
46 |             }
47 |             currentType.value = type;
48 |             currentLevel.value = level;
49 | 
50 |             console.log(`Sources fetched and state updated for type: ${type}, level: ${level}`, sourcesData.value);
51 |             return true;
52 | 
53 |         } catch (err) {
54 |             const errorMessage = err instanceof Error ? err.message : `Failed to fetch sources for type '${type}' and level '${level}'`;
55 |             error.value = errorMessage;
56 |             console.error(`Error fetching sources (type: ${type}, level: ${level}):`, err);
57 |             return false;
58 |         } finally {
59 |             isLoading.value = false;
60 |         }
61 |     }
62 | 
63 |     return {
64 |         sourcesData,
65 |         isLoading,
66 |         error,
67 |         currentType,
68 |         currentLevel,
69 |         getSourceList,
70 |         fetchSources,
71 |     };
72 | });
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
5 | export * from './project'; // Assuming project types are needed elsewhere
6 | export * from './campaigns'; // Assuming campaign types are needed elsewhere
7 | export * from './lineitem'; // Added export for Lineitem types
8 | 
9 | // Add more exports as needed
```

src/types/lineitem.ts
```
1 | import { ref } from 'vue';
2 | import type { Lineitem, LineitemListResponse } from '@/types/lineitem';
3 | 
4 | export function useLineitemStore() {
5 |   const lineitems = ref<Lineitem[]>([]);
6 |   const totalItems = ref(0);
7 |   const totalPages = ref(0);
8 |   const currentPage = ref(1);
9 |   const perPage = ref(10);
10 |   const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([]);
11 | 
12 |   async function fetchLineitems() {
13 |     // Fetch line items from API
14 |     const response: LineitemListResponse = await fetch('/api/lineitems').then(res => res.json());
15 |     lineitems.value = response;
16 | 
17 |     totalItems.value = response.length;
18 |     totalPages.value = 1; // No real pagination yet
19 |     currentPage.value = 1;
20 |   }
21 | 
22 |   return {
23 |     lineitems,
24 |     fetchLineitems,
25 |     totalItems,
26 |     totalPages,
27 |     currentPage,
28 |     perPage,
29 |     sortBy,
30 |   };
31 | }
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
11 | /*export interface Brand {
12 |     _id: string;
13 |     name: string;
14 |     logo?: string;
15 | }*/
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
41 | export interface Brand {
42 |     _id?: string;
43 |     abbreviation: string;
44 |     value: string;
45 |     category?: string | null;
46 |     logo?: string;
47 | }
48 | 
49 | // Entity reference (used for created_by and other references)
50 | export interface EntityReference {
51 |     _id: string;
52 |     name: string;
53 | }
54 | 
55 | // Mediaplan filter options
56 | export interface MediaplanFilter {
57 |     search?: string;
58 |     status?: string;
59 |     start_date_before?: string;
60 |     start_date_after?: string;
61 |     brand_id?: string;
62 |     country?: string;
63 |     created_by_me?: boolean;
64 |     currently_running?: boolean;
65 | }
66 | 
67 | // Mediaplan create request
68 | 
69 | 
70 | // Complete Mediaplan object
71 | export interface Mediaplan {
72 |     _id?: string;
73 |     name: string;
74 |     status: 'in_planning' | 'draft' | 'for_approval';
75 |     start_date: string;
76 |     end_date: string;
77 |     brand: Brand;
78 |     po_numbers: PONumber[];
79 |     budget?: Budget;
80 |     mediaplan_type: string; // Added mediaplan_type
81 |     created_by?: EntityReference | string;
82 |     created_at?: string;
83 |     updated_at?: string;
84 | }
85 | 
86 | // API response for mediaplan list
87 | export interface MediaplanListResponse {
88 |     total_items: number;
89 |     total_pages: number;
90 |     current_page: number;
91 |     items: Mediaplan[];
92 | }
```

src/types/project.ts
```
1 | // src/types/project.ts
2 | 
3 | // Country reference
4 | import type {Budget} from "./mediaplan.ts";
5 | 
6 | export interface Country {
7 |   code: string;
8 |   name: string;
9 | }
10 | 
11 | // Basic structure for default variables
12 | export interface ProjectDefaultVars {
13 |   targeturls: string | null;
14 |   subsegment: string | null;
15 |   campaigntype: string | null;
16 |   language: string | null;
17 |   campaigndetail: string | null;
18 |   adtype: string | null;
19 |   dimension: string | null;
20 | }
21 | 
22 | // Basic structure for descriptive variables
23 | export interface ProjectDescriptiveVars {
24 |   brand: string;
25 |   country: string;
26 |   bmwponumber: string;
27 |   adobecampaignname: string;
28 |   subsegment: string;
29 |   campaigntype: string;
30 |   projectname: string;
31 |   year: number;
32 | }
33 | 
34 | // Duration information
35 | export interface ProjectDuration {
36 |   start_date: string;
37 |   end_date: string;
38 |   formatted: string;
39 | }
40 | 
41 | // Project object
42 | export interface Project {
43 |   _id: string;
44 |   abbreviation: string;
45 |   created_at: string;
46 |   default_vars: ProjectDefaultVars;
47 |   descriptive_vars: ProjectDescriptiveVars;
48 |   is_locked: boolean;
49 |   labels: string[];
50 |   lock_state: number;
51 |   owner: string;
52 |   updated_at: string;
53 |   uploaded_at: string;
54 |   message: string;
55 |   timestamp: string;
56 |   version: string;
57 |   duration?: ProjectDuration;
58 |   detail?: string;
59 |   budget?: Budget;
60 |   mediaplanId?: string;
61 | }
62 | 
63 | // Project create request
64 | export interface ProjectCreate {
65 |   abbreviation?: string;
66 |   default_vars: ProjectDefaultVars;
67 |   descriptive_vars: ProjectDescriptiveVars;
68 |   labels?: string[];
69 | }
70 | 
71 | // API response for project list
72 | export interface ProjectListResponse {
73 |   total_items: number;
74 |   total_pages: number;
75 |   current_page: number;
76 |   items: Project[];
77 | }
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

src/views/CampaignDetail.vue
```
1 | <template>
2 |   <MainLayout>
3 |     <div class="campaign-detail">
4 |       <v-alert v-if="error" type="error" density="compact" class="mb-4" closable>
5 |         {{ error }}
6 |       </v-alert>
7 | 
8 |       <div v-if="isLoading && !campaign" class="text-center my-10">
9 |         <v-progress-circular indeterminate color="primary" size="40"/>
10 |         <p class="mt-2 text-disabled">Loading Campaign Data...</p>
11 |       </div>
12 | 
13 |       <template v-if="campaign">
14 |         <MediaplanTopSection
15 |             :mediaplan="parentMediaplan"
16 |             :project="parentProject"
17 |             :campaign="campaign"
18 |             :search="searchTerm" :is-loading="isLoading"
19 |             :current-view="'planning'"
20 |             :builder-type="'display'"
21 |             @update:search="updateSearchTerm"
22 |         />
23 |         <CampaignListView
24 |             :mediaplan-id="mediaplanIdRef"
25 |             :items="campaigns"
26 |             :total-campaigns="1"
27 |             :is-loading="isLoading"
28 |             :current-page="0"
29 |             :items-per-page="1"
30 |             type="single"
31 |             class="pb-3"
32 |         />
33 | 
34 | 
35 |         <LineitemTable
36 |           class="mt-5"
37 |           :items="lineitems"
38 |           :is-loading="isLoadingLineitems"
39 |           :total-items="totalLineitems"
40 |           :current-page="currentPage"
41 |           :items-per-page="perPage"
42 |           :sort-by-server="sortBy"
43 |           :search="searchTerm"
44 |           :model-value="selectedLineitemIds"
45 |           @add-lineitem="openAddLineitemDialog"
46 |           @view-lineitem="handleViewLineitem"
47 |           @update:model-value="val => selectedLineitemIds.value = val"
48 |           @update:options="({ page, itemsPerPage, sortBy }) => {
49 |             lineitemStore.currentPage = page;
50 |             lineitemStore.perPage = itemsPerPage;
51 |             lineitemStore.sortBy = sortBy;
52 |           }"
53 |         />
54 | 
55 |       </template>
56 | 
57 |       <template v-else-if="!isLoading && !campaign && error">
58 |         <div class="text-center my-10 text-disabled">
59 |           <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
60 |           <p>Could not load Campaign data.</p>
61 |           <p class="text-caption">{{ error }}</p>
62 |           <v-btn color="primary" @click="goBack">Go Back</v-btn>
63 |         </div>
64 |       </template>
65 | 
66 |       <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
67 |         {{ snackbar.text }}
68 |         <template v-slot:actions>
69 |           <v-btn icon @click="snackbar.show = false"><v-icon>mdi-close</v-icon></v-btn>
70 |         </template>
71 |       </v-snackbar>
72 | 
73 |     </div>
74 |   </MainLayout>
75 | </template>
76 | 
77 | <script setup lang="ts">
78 | import { ref, computed, onMounted, reactive, watch } from 'vue';
79 | import { useRoute, useRouter } from 'vue-router';
80 | 
81 | // Komponenten
82 | import MainLayout from '@/layouts/MainLayout.vue';
83 | import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";
84 | import LineitemTable from '@/components/campaign/LineitemTable.vue'; // Spezifische Tabelle
85 | // Stores
86 | import { useCampaignStore } from '@/stores/campaignStore';
87 | import { useProjectStore } from '@/stores/projectStore';
88 | import { useMediaplanStore } from '@/stores/mediaplanStore';
89 | // Types
90 | import type { Campaign } from '@/types/campaign';
91 | import type { Lineitem } from '@/types/lineitem';
92 | import type { Project } from '@/types/project';
93 | import type { Mediaplan } from '@/types/mediaplan';
94 | import {useLineitemStore} from "@/stores/lineitemStore.ts";
95 | import MediaplanPlanningViewDatatable from "@/components/mediaplan/MediaplanPlanningViewDatatable.vue";
96 | import CampaignListView from "@/components/project/CampaignListView.vue";
97 | 
98 | // Props & Route
99 | const props = defineProps<{
100 |   mediaplanId?: string;
101 |   projectId?: string;
102 |   campaignId?: string;
103 | }>()
104 | const route = useRoute();
105 | const router = useRouter();
106 | 
107 | // IDs
108 | const mediaplanIdRef = ref(props.mediaplanId || (route.params.mediaplanId as string));
109 | const projectIdRef = ref(props.projectId || (route.params.projectId as string));
110 | const campaignIdRef = ref(props.campaignId || (route.params.campaignId as string));
111 | 
112 | // Stores
113 | const campaignStore = useCampaignStore();
114 | const lineitemStore = useLineitemStore();
115 | const projectStore = useProjectStore();
116 | const mediaplanStore = useMediaplanStore();
117 | 
118 | // State
119 | const isLoading = ref(false);
120 | const error = ref<string | null>(null);
121 | const searchTerm = ref(''); // Wird von TopSection gesetzt, aber hier nicht direkt zum Filtern verwendet
122 | // const canAddLineitems = ref(false); // Noch nicht implementiert
123 | 
124 | // Computed Properties
125 | const campaign = computed<Campaign | null>(() => campaignStore.selectedCampaign);
126 | const campaigns = computed(() => {
127 |   return campaignStore.selectedCampaign ? [campaignStore.selectedCampaign] : []
128 | });
129 | 
130 | 
131 | const parentProject = computed<Project | null>(() => projectStore.selectedProject);
132 | const parentMediaplan = computed<Mediaplan | null>(() => mediaplanStore.selectedMediaplan);
133 | const lineitems = computed<Lineitem[]>(() => lineitemStore.lineitems);
134 | const isLoadingLineitems = computed(() => lineitemStore.isLoading);
135 | // Kein Zugriff auf Line Item Paginierung/Sortierung hier, da v-data-table dies clientseitig macht
136 | 
137 | const totalLineitems = computed(() => lineitemStore.totalItems);
138 | const currentPage = computed(() => lineitemStore.currentPage);
139 | const perPage = computed(() => lineitemStore.perPage);
140 | const sortBy = computed(() => lineitemStore.sortBy);
141 | const selectedLineitemIds = ref<string[]>([]);
142 | 
143 | // Snackbar
144 | const snackbar = reactive({ show: false, text: '', color: 'success' });
145 | 
146 | // --- Methoden ---
147 | const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
148 |   snackbar.text = text;
149 |   snackbar.color = color;
150 |   snackbar.show = true;
151 | };
152 | 
153 | const loadData = async () => {
154 |   if (!mediaplanIdRef.value || !projectIdRef.value || !campaignIdRef.value) {
155 |     error.value = "Missing ID for loading campaign details.";
156 |     showSnackbar(error.value, "error");
157 |     return;
158 |   }
159 |   isLoading.value = true;
160 |   error.value = null;
161 |   try {
162 |     await Promise.all([
163 |       campaignStore.fetchCampaign(mediaplanIdRef.value, projectIdRef.value, campaignIdRef.value),
164 |       projectStore.fetchProject(mediaplanIdRef.value, projectIdRef.value), // Kontext
165 |       mediaplanStore.fetchMediaplan(mediaplanIdRef.value), // Kontext
166 |       lineitemStore.fetchLineitems(mediaplanIdRef.value, projectIdRef.value, campaignIdRef.value) // Kinder
167 |     ]);
168 |     // canAddLineitems.value = checkApi(); // Wenn API für Add existiert
169 | 
170 |   } catch (err: any) {
171 |     error.value = `Failed to load campaign data: ${err.message || err}`;
172 |     showSnackbar(error.value, 'error');
173 |     campaignStore.selectedCampaign = null;
174 |     projectStore.selectedProject = null;
175 |     mediaplanStore.selectedMediaplan = null;
176 |   } finally {
177 |     isLoading.value = false;
178 |   }
179 | };
180 | 
181 | const updateSearchTerm = (newSearchTerm: string) => {
182 |   searchTerm.value = newSearchTerm;
183 |   // Hier keine Aktion nötig, da die Tabelle clientseitig filtert (oder Suche ignoriert)
184 | };
185 | 
186 | const openAddLineitemDialog = () => {
187 |   console.log('Add Lineitem for Campaign:', campaignIdRef.value);
188 |   showSnackbar("Adding line items is not supported by the API yet.", "info");
189 |   // Logik zum Öffnen des Dialogs
190 | };
191 | 
192 | const handleViewLineitem = (item: Lineitem) => {
193 |   console.log('View Lineitem (Event received):', item._id);
194 |   showSnackbar("Viewing line item details is not supported by the API yet.", "info");
195 |   // Logik zum Anzeigen der Details (z.B. in einem Dialog)
196 | }
197 | 
198 | const goBack = () => {
199 |   router.back();
200 | }
201 | 
202 | // Lifecycle & Watchers
203 | onMounted(() => {
204 |   loadData();
205 | });
206 | 
207 | watch(() => [route.params.mediaplanId, route.params.projectId, route.params.campaignId],
208 |     ([newMpId, newPId, newCId], [oldMpId, oldPId, oldCId]) => {
209 |       let needsReload = false;
210 |       if (typeof newMpId === 'string' && newMpId !== oldMpId) { mediaplanIdRef.value = newMpId; needsReload = true; }
211 |       if (typeof newPId === 'string' && newPId !== oldPId) { projectIdRef.value = newPId; needsReload = true; }
212 |       if (typeof newCId === 'string' && newCId !== oldCId) { campaignIdRef.value = newCId; needsReload = true; }
213 |       if (needsReload) { loadData(); }
214 |     },
215 |     { immediate: false }
216 | );
217 | 
218 | watch(error, (err) => { if (err && !snackbar.show) { /* Fehler in loadData behandelt */ } });
219 | 
220 | </script>
221 | 
222 | <style scoped>
223 | .campaign-detail {
224 |   min-height: calc(100vh - 64px);
225 | }
226 | </style>
```

src/views/Login.vue
```
1 | <template>
2 |   <v-container fluid class="fill-height pa-0">
3 |     <v-row align="center" justify="center" class="fill-height ma-0">
4 |       <v-col cols="12" md="7" lg="8" class="d-none d-md-flex bg-img fill-height pa-0">
5 |       </v-col>
6 | 
7 |       <v-col cols="12" md="5" lg="4" class="d-flex align-center justify-center pa-6 fill-height">
8 |         <v-sheet class="pa-sm-10 pa-6" rounded elevation="4" max-width="480" width="100%">
9 |           <div class="text-center mb-6">
10 |             <img src="/img/the-marcom-engine.png" alt="The Marcom Engine" width="280"/>
11 |             <h4 class="text-h5 font-weight-medium mt-6">
12 |               BMW Group Mediaplan
13 |             </h4>
14 |           </div>
15 | 
16 |           <v-form ref="loginFormRef" @submit.prevent="onSubmit">
17 |             <v-alert
18 |                 v-if="authStore.error"
19 |                 class="mb-4"
20 |                 type="error"
21 |                 variant="tonal"
22 |                 border="start"
23 |                 closable
24 |                 @click:close="clearAuthError"
25 |                 icon="mdi-alert-circle-outline"
26 |                 density="compact"
27 |             >
28 |               {{ authStore.error }}
29 |             </v-alert>
30 | 
31 |             <v-text-field
32 |                 v-model="username"
33 |                 :rules="usernameRules"
34 |                 label="Username"
35 |                 variant="outlined"
36 |                 prepend-inner-icon="mdi-account-outline"
37 |                 class="mb-4"
38 |                 density="comfortable"
39 |                 autofocus
40 |                 required
41 |             />
42 | 
43 |             <v-text-field
44 |                 v-model="password"
45 |                 :rules="passwordRules"
46 |                 label="Password"
47 |                 type="password"
48 |                 variant="outlined"
49 |                 prepend-inner-icon="mdi-lock-outline"
50 |                 class="mb-6"
51 |                 density="comfortable"
52 |                 required
53 |             />
54 | 
55 |             <v-btn
56 |                 :loading="authStore.isLoading"
57 |                 :disabled="authStore.isLoading"
58 |                 type="submit"
59 |                 color="primary"
60 |                 block
61 |                 size="large"
62 |             >
63 |               Login
64 |             </v-btn>
65 |           </v-form>
66 |         </v-sheet>
67 |       </v-col>
68 |     </v-row>
69 |   </v-container>
70 | </template>
71 | 
72 | <script setup lang="ts">
73 | import {ref, onMounted} from 'vue';
74 | import {useAuthStore} from '@/stores/auth';
75 | import {useRouter} from 'vue-router';
76 | import type {VForm} from 'vuetify/components';
77 | 
78 | const router = useRouter();
79 | const authStore = useAuthStore();
80 | const loginFormRef = ref<InstanceType<typeof VForm> | null>(null);
81 | 
82 | const username = ref('admin');
83 | const password = ref('hans');
84 | 
85 | const usernameRules = [
86 |   (value: string) => !!value || 'Username is required.',
87 |   (value: string) => (value && value.length >= 2) || 'Username needs to be at least 2 characters.',
88 |   (value: string) => (value && value.length <= 100) || 'Username must be less than 100 characters.',
89 | ];
90 | 
91 | const passwordRules = [
92 |   (value: string) => !!value || 'Password is required.',
93 |   (value: string) => (value && value.length >= 3) || 'Password must be at least 3 characters.',
94 | ];
95 | 
96 | const clearAuthError = () => {
97 |   authStore.error = null;
98 | };
99 | 
100 | const onSubmit = async () => {
101 |   if (authStore.isLoading) return;
102 | 
103 |   const {valid} = await loginFormRef.value?.validate() || {valid: false};
104 | 
105 |   if (valid) {
106 |     await authStore.login(username.value, password.value);
107 |     if (authStore.isAuthenticated) {
108 |       router.push('/');
109 |     }
110 |   }
111 | };
112 | 
113 | onMounted(() => {
114 |   if (authStore.isAuthenticated) {
115 |     router.push('/');
116 |   }
117 | });
118 | 
119 | </script>
120 | 
121 | <style scoped>
122 | .fill-height {
123 |   min-height: 100vh;
124 | }
125 | 
126 | .bg-img {
127 |   background-image: url('/img/login-bg.jpg');
128 |   background-position: center center;
129 |   background-size: cover;
130 |   background-color: #e0e0e0;
131 | }
132 | </style>
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
9 |         <v-progress-circular indeterminate color="primary" size="40"/>
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
20 |             :builder-type="'display'"
21 |             @update:search="updateSearch"
22 |             @update:current-view="val => currentView = val"
23 |         />
24 | 
25 |         <div class="main-content">
26 |           <MediaplanPlanningView
27 |               v-if="currentView === 'planning'"
28 |               type="multi"
29 |               :projects="projects"
30 |               :total-projects="totalProjects"
31 |               :is-loading="isLoadingProjects"
32 |               :current-page="projectCurrentPage"
33 |               :items-per-page="projectItemsPerPage"
34 |               :mediaplan-id="mediaplanIdRef"
35 |               @update:options="handleProjectOptionsUpdate"
36 |               @add-project="openCreateProjectDialog"
37 |           />
38 | 
39 |           <MediaplanBudgetView v-else :mediaplan="mediaplan"/>
40 | 
41 |           <v-alert
42 |               v-if="projectError && currentView === 'planning'"
43 |               type="error"
44 |               density="compact"
45 |               class="mt-4"
46 |               closable
47 |           >
48 |             Failed to load projects: {{ projectError }}
49 |           </v-alert>
50 |         </div>
51 |       </template>
52 | 
53 |       <template v-else-if="!isLoadingMediaplan && !mediaplan && errorMediaplan">
54 |         <div class="text-center my-10 text-disabled">
55 |           <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
56 |           <p>Could not load Mediaplan data.</p>
57 |         </div>
58 |       </template>
59 | 
60 |       <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
61 |         {{ snackbar.text }}
62 |         <template v-slot:actions>
63 |           <v-btn icon @click="snackbar.show = false">
64 |             <v-icon>mdi-close</v-icon>
65 |           </v-btn>
66 |         </template>
67 |       </v-snackbar>
68 |     </div>
69 |   </MainLayout>
70 | </template>
71 | 
72 | <script setup lang="ts">
73 | import {ref, computed, onMounted, reactive, watch} from 'vue'
74 | import {useRoute} from 'vue-router'
75 | 
76 | import MainLayout from '@/layouts/MainLayout.vue'
77 | import MediaplanPlanningView from '@/components/mediaplan/MediaplanPlanningViewDatatable.vue'
78 | import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue'
79 | import {useMediaplanStore} from '@/stores/mediaplanStore'
80 | import {useProjectStore} from '@/stores/projectStore'
81 | import type {Mediaplan} from '@/types/mediaplan'
82 | import type {Project} from '@/types/project'
83 | import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";
84 | 
85 | // --- Props & Route ---
86 | const props = defineProps<{ mediaplanId?: string }>()
87 | const route = useRoute()
88 | const mediaplanIdRef = ref(props.mediaplanId || (route.params.id as string))
89 | 
90 | // --- Stores ---
91 | const mediaplanStore = useMediaplanStore()
92 | const projectStore = useProjectStore()
93 | 
94 | // --- Computed Properties ---
95 | const mediaplan = computed<Mediaplan | null>(() => mediaplanStore.selectedMediaplan)
96 | const isLoadingMediaplan = computed(() => mediaplanStore.isLoading)
97 | const errorMediaplan = computed(() => mediaplanStore.error)
98 | 
99 | const projects = computed<Project[]>(() => projectStore.projects)
100 | const totalProjects = computed(() => projectStore.totalItems)
101 | const isLoadingProjects = computed(() => projectStore.isLoading)
102 | const projectError = computed(() => projectStore.error)
103 | const projectCurrentPage = computed(() => projectStore.currentPage)
104 | const projectItemsPerPage = computed(() => projectStore.perPage)
105 | 
106 | // --- UI State ---
107 | const currentView = ref<'planning' | 'budget'>('planning')
108 | const search = ref('')
109 | 
110 | // --- Snackbar ---
111 | const snackbar = reactive({show: false, text: '', color: 'success'})
112 | 
113 | // --- Methods ---
114 | const handleProjectOptionsUpdate = (options: {
115 |   page: number
116 |   itemsPerPage: number
117 |   sortBy?: any[]
118 |   sortDesc?: boolean[]
119 | }) => {
120 |   const newPage = options.page - 1
121 |   if (newPage !== projectCurrentPage.value) {
122 |     projectStore.currentPage = newPage
123 |     projectStore.fetchProjects(mediaplanIdRef.value)
124 |   }
125 |   if (options.itemsPerPage !== projectItemsPerPage.value) {
126 |     projectStore.perPage = options.itemsPerPage
127 |     projectStore.currentPage = 0
128 |     projectStore.fetchProjects(mediaplanIdRef.value)
129 |   }
130 | }
131 | 
132 | const openCreateProjectDialog = () => {
133 |   console.log('Trigger create project for Mediaplan ID:', mediaplanIdRef.value)
134 |   // router.push or dialog logic here
135 | }
136 | 
137 | const updateSearch = (val: string) => {
138 |   search.value = val
139 |   // ggf. Filter-Logik hier
140 | }
141 | 
142 | const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
143 |   snackbar.text = text
144 |   snackbar.color = color
145 |   snackbar.show = true
146 | }
147 | 
148 | // --- Lifecycle ---
149 | onMounted(() => {
150 |   if (!mediaplanIdRef.value) {
151 |     mediaplanStore.error = 'No mediaplan ID provided'
152 |     return
153 |   }
154 |   mediaplanStore.fetchMediaplan(mediaplanIdRef.value)
155 |   projectStore.fetchProjects(mediaplanIdRef.value)
156 | })
157 | 
158 | // --- Watchers ---
159 | watch(() => route.params.id, (newId) => {
160 |   if (typeof newId === 'string' && newId !== mediaplanIdRef.value) {
161 |     mediaplanIdRef.value = newId
162 |     mediaplanStore.fetchMediaplan(newId)
163 |     projectStore.fetchProjects(newId)
164 |   }
165 | })
166 | 
167 | watch(errorMediaplan, (err) => err && showSnackbar(`Error loading mediaplan: ${err}`, 'error'))
168 | watch(projectError, (err) => err && showSnackbar(`Error loading projects: ${err}`, 'error'))
169 | </script>
170 | 
171 | <style scoped>
172 | .mediaplan-detail {
173 |   min-height: calc(100vh - 64px);
174 | }
175 | 
176 | .main-content {
177 |   min-height: 60vh;
178 | }
179 | </style>
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
10 |             <p>Mediaplan ID: {{ mediaplanId }}</p>
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
29 |   mediaplanId: string;
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
8 |             :loading="isLoading"
9 |             :sort-by="sortBy"
10 |             :sort-order="sortOrder"
11 |             @update:filter="handleFilterUpdate"
12 |             @update:sort="handleSortUpdate"
13 |         />
14 |       </v-col>
15 |     </v-row>
16 | 
17 |     <MediaplanList
18 |         :mediaplans="mediaplans"
19 |         :is-loading="isLoading"
20 |         :total-pages="totalPages"
21 |         :total-items="totalItems"
22 |         :current-page="currentPage"
23 |         :items-per-page="perPage"
24 |         @update:page="handlePageUpdate"
25 |         @update:items-per-page="handleItemsPerPageUpdate"
26 |     />
27 | 
28 |     <CreateMediaplanDialog
29 |         v-model="showCreateMediaplanDialog"
30 |         @created="handleMediaplanCreated"
31 |         @project-created="handleProjectCreated"
32 |     />
33 | 
34 |     <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
35 |       {{ snackbar.text }}
36 |     </v-snackbar>
37 |   </MainLayout>
38 | </template>
39 | 
40 | <script setup lang="ts">
41 | import { onMounted, computed, ref, reactive } from 'vue';
42 | import MainLayout from '@/layouts/MainLayout.vue';
43 | import MediaplanFilters from '@/components/overview/MediaplanFilters.vue';
44 | import MediaplanList from '@/components/overview/MediaplanList.vue';
45 | import CreateMediaplanDialog from '@/components/overview/CreateMediaplanDialog.vue';
46 | import { useMediaplanStore } from '@/stores/mediaplanStore';
47 | import type { MediaplanFilter } from '@/types';
48 | 
49 | // --- Store ---
50 | const store = useMediaplanStore();
51 | 
52 | // --- Computed from store ---
53 | const filters     = computed(() => store.filters);
54 | const sortBy      = computed(() => store.sortBy);
55 | const sortOrder   = computed(() => store.sortOrder);
56 | const currentPage = computed(() => store.currentPage);
57 | const perPage     = computed(() => store.perPage);
58 | const totalPages  = computed(() => store.totalPages);
59 | const totalItems  = computed(() => store.totalItems);
60 | const mediaplans  = computed(() => store.mediaplans);
61 | const isLoading   = computed(() => store.isLoading);
62 | 
63 | // --- Dialog control ---
64 | const showCreateMediaplanDialog = ref(false);
65 | 
66 | // --- Snackbar ---
67 | const snackbar = reactive({
68 |   show: false,
69 |   text: '',
70 |   color: 'success'
71 | });
72 | 
73 | // --- Event Handlers ---
74 | function handleFilterUpdate(key: keyof MediaplanFilter, value: any) {
75 |   store.setFilter(key, value);
76 | }
77 | 
78 | function handleSortUpdate(payload: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
79 |   if (payload.sortBy !== sortBy.value || payload.sortOrder !== sortOrder.value) {
80 |     store.setSorting(payload.sortBy, payload.sortOrder);
81 |   }
82 | }
83 | 
84 | function handlePageUpdate(newPage: number) {
85 |   // v-pagination is 1-based; our store is 0-based
86 |   const zeroPage = newPage - 1;
87 |   if (zeroPage !== currentPage.value) {
88 |     store.setPage(zeroPage);
89 |   }
90 | }
91 | 
92 | function handleItemsPerPageUpdate(newPerPage: number) {
93 |   if (newPerPage !== perPage.value) {
94 |     store.perPage = newPerPage;
95 |     store.setPage(0);
96 |   }
97 | }
98 | 
99 | function handleMediaplanCreated(id: string) {
100 |   console.log('Mediaplan created:', id);
101 | }
102 | 
103 | function handleProjectCreated(id: string) {
104 |   snackbar.color = 'success';
105 |   snackbar.text = 'Project created successfully';
106 |   snackbar.show = true;
107 |   showCreateMediaplanDialog.value = false;
108 | }
109 | 
110 | // --- Init ---
111 | onMounted(() => {
112 |   store.init();
113 | });
114 | </script>
```

src/views/ProjectDetail.vue
```
1 | <script setup lang="ts">
2 | import {ref, computed, onMounted, reactive, watch} from 'vue';
3 | import {useRouter, useRoute} from 'vue-router';
4 | import MainLayout from '@/layouts/MainLayout.vue';
5 | import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue';
6 | // import ProjectToolbar from '@/components/project/ProjectToolbar.vue';
7 | import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue';
8 | import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue';
9 | import CampaignListView from '@/components/project/CampaignListView.vue';
10 | import MediaplanBudgetView from '@/components/mediaplan/MediaplanBudgetView.vue';
11 | import {useMediaplanStore} from '@/stores/mediaplanStore';
12 | import {useProjectStore} from '@/stores/projectStore';
13 | import {useCampaignStore} from '@/stores/campaignStore';
14 | import type {Project} from '@/types/project';
15 | import {formatDateRange} from '@/helpers/dateUtils';
16 | import {calculatePercentage} from '@/helpers/currencyUtils';
17 | import MediaplanTopSection from "@/components/common/MediaplanTopSection.vue";
18 | import ProjectDetailTable from "@/components/project/ProjectDetailTable.vue";
19 | import MediaplanPlanningViewDatatable from "@/components/mediaplan/MediaplanPlanningViewDatatable.vue"; // Pfad prüfen
20 | 
21 | // --- Props & Route ---
22 | const props = defineProps<{ mediaplanId?: string; projectId?: string; }>();
23 | const route = useRoute();
24 | const router = useRouter();
25 | const currentMediaplanId = ref(props.mediaplanId || route.params.mediaplanId as string);
26 | const currentProjectId = ref(props.projectId || route.params.projectId as string);
27 | 
28 | // --- Stores ---
29 | const mediaplanStore = useMediaplanStore();
30 | const projectStore = useProjectStore();
31 | const campaignStore = useCampaignStore();
32 | 
33 | // --- Computed Properties ---
34 | const parentMediaplan = computed(() => mediaplanStore.selectedMediaplan);
35 | const project = computed(() => {
36 |   return projectStore.selectedProject ? [projectStore.selectedProject] : []
37 | });
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
53 | const snackbar = reactive({show: false, text: '', color: 'success'});
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
122 | }, {deep: true});
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
153 |             :builder-type="'display'"
154 |             @update:search="updateSearchHandler"
155 |             @update:current-view="val => currentView = val"
156 |         />
157 | 
158 |         <MediaplanPlanningViewDatatable
159 |             :projects="project"
160 |             :is-loading="isLoadingProject"
161 |             :mediaplan-id="route.params.mediaplanId"
162 |             :current-page="0"
163 |             :total-projects="1"
164 |             :items-per-page="1"
165 |             type="single"
166 |             class="pb-3"
167 |         />
168 | 
169 |         <template v-if="project">
170 |           <div class="main-content">
171 |             <CampaignListView
172 |                 v-if="currentView === 'planning'"
173 |                 :mediaplan-id="currentMediaplanId"
174 |                 :items="campaigns"
175 |                 :total-campaigns="totalCampaigns"
176 |                 :is-loading="isLoadingCampaigns"
177 |                 :current-page="campaignCurrentPage"
178 |                 :items-per-page="campaignItemsPerPage"
179 |                 @update:options="handleCampaignOptionsUpdate"
180 |                 @add-campaign="openCreateCampaignDialog"
181 |             />
182 |             <MediaplanBudgetView
183 |                 v-else-if="currentView === 'budget' && parentMediaplan"
184 |                 :mediaplan="parentMediaplan"
185 |             />
186 |             <div v-else-if="currentView === 'budget' && !parentMediaplan">
187 |               Loading budget data...
188 |             </div>
189 | 
190 |             <v-alert v-if="errorCampaigns && currentView === 'planning'" type="error" density="compact" class="mt-4"
191 |                      closable>
192 |               Failed to load campaigns: {{ errorCampaigns }}
193 |             </v-alert>
194 |           </div>
195 |         </template>
196 |         <template v-else-if="!isLoadingProject && errorProject">
197 |           <div class="text-center my-10 text-disabled">
198 |             <v-icon size="x-large" class="mb-2">mdi-alert-circle-outline</v-icon>
199 |             <p>Could not load Project data.</p>
200 |           </div>
201 |         </template>
202 |       </template>
203 | 
204 |       <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
205 |         {{ snackbar.text }}
206 |         <template v-slot:actions>
207 |           <v-btn icon="mdi-close" @click="snackbar.show = false"></v-btn>
208 |         </template>
209 |       </v-snackbar>
210 |     </div>
211 |   </MainLayout>
212 | </template>
213 | 
214 | <style scoped>
215 | .project-detail {
216 |   padding-bottom: 20px;
217 | }
218 | 
219 | .main-content {
220 |   min-height: 60vh;
221 | }
222 | </style>
```

src/components/campaign/LineItemTable.vue
```
1 | <template>
2 |   <v-card flat class="mt-4 lineitem-table-card">
3 |     <v-data-table-server
4 |         v-model="selectedItems"
5 |         :headers="lineitemHeaders"
6 |         :items="items"
7 |         :items-length="totalItems"
8 |         :loading="isLoading"
9 |         :search="search"
10 |         :page="currentPageInternal"
11 |         :items-per-page="itemsPerPageInternal"
12 |         :sort-by="sortBy"
13 |         class="elevation-0 lineitem-data-table"
14 |         item-value="_id"
15 |         show-select
16 |         select-strategy="page"
17 |         @update:options="handleOptionsUpdate"
18 |         @update:model-value="updateSelection"
19 |     >
20 |       <template v-slot:loading>
21 |         <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
22 |       </template>
23 | 
24 |       <template v-slot:item.created_at="{ value }">
25 |         {{ formatDate(value) }}
26 |       </template>
27 |       <template v-slot:item.updated_at="{ value }">
28 |         {{ formatDate(value) }}
29 |       </template>
30 | 
31 |       <template v-slot:item.lineitemname="{ item }">
32 |         <v-tooltip location="top" :text="item.lineitemname">
33 |           <template v-slot:activator="{ props }">
34 |                 <span v-bind="props" class="d-inline-block text-truncate" style="max-width: 250px;">
35 |                     {{ item.lineitemname }}
36 |                 </span>
37 |           </template>
38 |         </v-tooltip>
39 |       </template>
40 | 
41 |       <template v-slot:no-data>
42 |         <div class="text-center pa-4 text-disabled">
43 |           <v-icon size="x-large" class="mb-2">mdi-database-off-outline</v-icon>
44 |           <p v-if="search">No line items found matching your search "{{ search }}".</p>
45 |           <p v-else>No line items found for this campaign.</p>
46 |         </div>
47 |       </template>
48 | 
49 |       <template v-slot:item.actions="{ item }">
50 |         <v-btn icon density="compact" size="small" variant="text" @click.stop="() => console.log('Edit Lineitem:', item._id)" class="mr-2">
51 |           <v-icon>mdi-pencil-outline</v-icon>
52 |           <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
53 |         </v-btn>
54 |         <v-menu>
55 |           <template v-slot:activator="{ props: menuProps }">
56 |             <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
57 |           </template>
58 |           <v-list density="compact">
59 |             <v-list-item  @click.stop="() => console.log('Edit Lineitem:', item._id)">
60 |               <v-list-item-title>Edit</v-list-item-title>
61 |             </v-list-item>
62 |             <v-list-item @click.stop="() => console.log('Delete Lineitemjk:', item._id)" class="text-error">
63 |               <v-list-item-title>Delete</v-list-item-title>
64 |             </v-list-item>
65 |           </v-list>
66 |         </v-menu>
67 |       </template>
68 | 
69 |     </v-data-table-server>
70 |   </v-card>
71 | </template>
72 | 
73 | <script setup lang="ts">
74 | import { ref, computed, watch, PropType } from 'vue';
75 | import type { VDataTableServer } from 'vuetify/components/VDataTable';
76 | import { formatDate } from '@/helpers/dateUtils';
77 | import type { Lineitem } from '@/types/lineitem';
78 | import {lineitemHeaders} from "@/constants/lineitem.ts"; // Pfad anpassen
79 | 
80 | type ReadonlyHeaders = VDataTableServer['$props']['headers'];
81 | 
82 | const props = defineProps({
83 |   items: {
84 |     type: Array as PropType<Lineitem[]>,
85 |     required: true,
86 |     default: () => []
87 |   },
88 |   isLoading: {
89 |     type: Boolean,
90 |     default: false
91 |   },
92 |   totalItems: {
93 |     type: Number,
94 |     required: true
95 |   },
96 |   currentPage: { // 0-basiert vom Store
97 |     type: Number,
98 |     required: true
99 |   },
100 |   itemsPerPage: {
101 |     type: Number,
102 |     required: true
103 |   },
104 |   sortByServer: {
105 |     type: Array as PropType<{ key: string; order: 'asc' | 'desc' }[]>,
106 |     default: () => []
107 |   },
108 |   search: { // Suchbegriff von außen
109 |     type: String,
110 |     default: ''
111 |   },
112 |   // V-model für ausgewählte Elemente
113 |   modelValue: {
114 |     type: Array as PropType<string[]>, // Array von IDs (_id)
115 |     default: () => []
116 |   }
117 | });
118 | 
119 | const emit = defineEmits(['update:options', 'update:modelValue', 'add-item', 'edit-item', 'delete-item']);
120 | 
121 | // Lokaler State für Tabelle
122 | const currentPageInternal = ref(props.currentPage + 1); // Tabelle ist 1-basiert
123 | const itemsPerPageInternal = ref(props.itemsPerPage);
124 | const sortBy = ref(props.sortByServer);
125 | 
126 | // Lokaler State für v-model der Tabelle
127 | const selectedItems = ref<string[]>(props.modelValue);
128 | 
129 | // Handler für Optionen (Paginierung, Sortierung)
130 | const handleOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy: { key: string; order: 'asc' | 'desc' }[] }) => {
131 |   currentPageInternal.value = options.page;
132 |   itemsPerPageInternal.value = options.itemsPerPage;
133 |   sortBy.value = options.sortBy;
134 | 
135 |   emit('update:options', {
136 |     page: options.page - 1, // An Parent 0-basiert
137 |     itemsPerPage: options.itemsPerPage,
138 |     sortBy: options.sortBy
139 |   });
140 | };
141 | 
142 | // Handler für Selektionsänderung
143 | const updateSelection = (newSelection: string[]) => {
144 |   selectedItems.value = newSelection;
145 |   emit('update:modelValue', newSelection); // Parent informieren
146 | }
147 | 
148 | // Watchers zur Synchronisierung mit Parent Props
149 | watch(() => props.currentPage, (newVal) => {
150 |   currentPageInternal.value = newVal + 1;
151 | });
152 | watch(() => props.itemsPerPage, (newVal) => {
153 |   itemsPerPageInternal.value = newVal;
154 | });
155 | watch(() => props.sortByServer, (newVal) => {
156 |   sortBy.value = newVal;
157 | }, { deep: true });
158 | watch(() => props.modelValue, (newVal) => {
159 |   if (JSON.stringify(newVal) !== JSON.stringify(selectedItems.value)) {
160 |     selectedItems.value = newVal;
161 |   }
162 | }, { deep: true });
163 | 
164 | </script>
165 | 
166 | <style scoped>
167 | 
168 | </style>
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
39 |       to: props.project ? {name: 'MediaplanDetail', params: {mediaplanId: props.mediaplan._id}} : undefined,
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
2 |   <v-row align="center" justify="end" style="height: 57px;" class="mr-0">
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
13 |           style="width: 100px"
14 |       ></v-progress-linear>
15 |       <span class="text-subtitle-1 text-grey-darken-1">{{ usedPercentage }}%</span>
16 |     </div>
17 | 
18 |     <v-text-field
19 |         max-width="120px"
20 |         min-width="100px"
21 |         v-model="search"
22 |         placeholder="Search..."
23 |         hide-details
24 |         class="mr-2" append-inner-icon="mdi-magnify"
25 |         @update:modelValue="$emit('update:search', $event)"
26 |         bg-color="white"
27 |     ></v-text-field>
28 | 
29 |     <v-btn icon="mdi-dots-horizontal" variant="plain">
30 |     </v-btn>
31 |   </v-row>
32 | </template>
33 | 
34 | <script setup lang="ts">
35 | import {ref, watch} from 'vue';
36 | 
37 | // Define props
38 | interface Props {
39 |   planBudget: number;
40 |   usedPercentage: number;
41 |   search: string;
42 | }
43 | 
44 | // Define events
45 | defineEmits([
46 |   'update:search'
47 | ]);
48 | 
49 | // Receive props with defaults
50 | const props = withDefaults(defineProps<Props>(), {
51 |   planBudget: 0,
52 |   usedPercentage: 0,
53 |   search: ''
54 | });
55 | 
56 | // Local state
57 | const search = ref(props.search);
58 | 
59 | // Watch for prop changes
60 | watch(() => props.search, (newValue) => {
61 |   search.value = newValue;
62 | });
63 | 
64 | // Format currency
65 | const formatCurrency = (value: number): string => {
66 |   // Empfehlung: 'de-DE' für korrekte Euro-Formatierung in Deutschland
67 |   return new Intl.NumberFormat('de-DE', {
68 |     style: 'currency',
69 |     currency: 'EUR',
70 |     minimumFractionDigits: 0,
71 |     maximumFractionDigits: 0
72 |   }).format(value);
73 | };
74 | </script>
```

src/components/mediaplan/MediaplanPlanningViewDatatable.vue
```
1 | <template>
2 |   <div class="planning-view-container mt-4">
3 |     <EditOrCreateProjectDialog
4 |         v-model="isProjectDialogOpen"
5 |         :is-edit="!!selectedProject"
6 |         :initial-data="selectedProject || undefined"
7 |         @saved="onProjectSaved"
8 |     />
9 |     <v-card class="projects-table elevation-0" variant="flat">
10 |       <v-theme-provider theme="dark">
11 |         <v-data-table-server
12 |             v-model:items-per-page="itemsPerPageModel"
13 |             v-model:page="pageModel"
14 |             :headers="projectHeaders"
15 |             :hide-default-header="type === 'single'"
16 |             :hide-default-footer="type==='single'"
17 |             :items="projects"
18 |             :items-length="totalProjects"
19 |             :loading="isLoading"
20 |             item-value="_id"
21 |             hover
22 |             class="projects-data-table"
23 |             @update:options="onOptionsUpdate"
24 | 
25 |         >
26 | <!--          <template v-slot:item.edit="{ item }">
27 | 
28 |           </template>-->
29 | 
30 |           <template v-slot:item.abbreviation="{ item }">
31 |             <router-link
32 |                 :to="{ name: 'ProjectDetail', params: { mediaplanId: props.mediaplanId, projectId: item._id } }"
33 |                 class="name-link d-flex align-center"
34 |                 v-if="item.abbreviation && props.mediaplanId && type==='multi'"
35 |                 @click.stop
36 |             >
37 |               <v-avatar size="32" class="mr-2 grey lighten-4"
38 |                         :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
39 |               <span>{{ item.abbreviation }}</span>
40 |               <v-tooltip activator="parent" location="top">Open project</v-tooltip>
41 |             </router-link>
42 |             <div class="d-flex align-center" v-else-if="item.abbreviation">
43 |               <v-avatar size="32" class="mr-2 grey lighten-4"
44 |                         :image="getBrandLogo(item.descriptive_vars?.brand)"></v-avatar>
45 |               <span>{{ item.abbreviation }}</span>
46 |             </div>
47 |             <div v-else>N/A</div>
48 |           </template>
49 | 
50 |           <template v-slot:item.descriptive_vars.country="{ item }">
51 |             <div class="d-flex align-center" v-if="item.descriptive_vars?.country">
52 |               <CountryFlag size="1rem" :country="item.descriptive_vars.country" class="mr-2"/>
53 |               <span>{{ item.descriptive_vars.country }}</span>
54 |             </div>
55 |             <div v-else>N/A</div>
56 |           </template>
57 | 
58 |           <template v-slot:item.duration.formatted="{ item }">
59 |             <div class="d-flex align-center" v-if="item.duration?.formatted">
60 |               <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
61 |               <span>{{ item.duration.formatted }}</span>
62 |             </div>
63 |             <div v-else>N/A</div>
64 |           </template>
65 | 
66 |           <template v-slot:item.detail="{ item }">
67 |             <span class="d-inline-block text-truncate" style="max-width: 150px;">{{ item.detail || 'N/A' }}</span>
68 |             <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top"
69 |                        max-width="300px">{{ item.detail }}
70 |             </v-tooltip>
71 |           </template>
72 | 
73 |           <template v-slot:item.default_vars.campaigntype="{ item }">
74 |             {{ item.default_vars?.campaigntype || 'N/A' }}
75 |           </template>
76 | 
77 |           <template v-slot:item.default_vars.subsegment="{ item }">
78 |             {{ item.default_vars?.subsegment || 'N/A' }}
79 |           </template>
80 |           <template v-slot:item.budget="{ item }">
81 |             <BudgetProgress
82 |                 :used-budget="item?.budget?.used"
83 |                 :total-budget="item?.budget?.total"
84 |                 color="success"
85 |                 bg-color="#ffffff"
86 |             />
87 |           </template>
88 | 
89 |           <template v-slot:item.is_locked="{ item }">
90 |             <v-icon v-if="item.is_locked != null" :color="item.is_locked ? 'warning' : 'white'">
91 |               {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
92 |             </v-icon>
93 |             <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
94 |           </template>
95 | 
96 |           <template v-slot:item.actions="{ item }">
97 |             <v-btn icon density="compact" size="small" variant="text" @click.stop="openEditProject(item)" class="mr-2">
98 |               <v-icon>mdi-pencil-outline</v-icon>
99 |               <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
100 |             </v-btn>
101 |             <v-menu>
102 |               <template v-slot:activator="{ props: menuProps }">
103 |                 <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
104 |               </template>
105 |               <v-list density="compact">
106 |                 <v-list-item @click.stop="openEditProject(item)">
107 |                   <v-list-item-title>Edit</v-list-item-title>
108 |                 </v-list-item>
109 |                 <v-list-item @click.stop="() => console.log('Delete Project:', item._id)" class="text-error">
110 |                   <v-list-item-title>Delete</v-list-item-title>
111 |                 </v-list-item>
112 |               </v-list>
113 |             </v-menu>
114 |           </template>
115 | 
116 |           <template v-slot:loading>
117 |             <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
118 |           </template>
119 |           <template v-slot:no-data v-if="type === 'multi'">
120 | 
121 |             <div class="text-center pa-4 text-disabled">
122 |               <v-icon size="large" class="mb-2">mdi-database-off-outline</v-icon>
123 |               <p>No projects found for this mediaplan.</p>
124 |             </div>
125 |           </template>
126 | 
127 |           <template v-slot:bottom v-if="type === 'multi'">
128 |             <div class="d-flex align-center pa-4 bg-grey-lighten-2">
129 |               <v-btn
130 |                   prepend-icon="mdi-plus"
131 |                   class="black-text-button"
132 |                   variant="text"
133 |                   color="black"
134 |                   @click="addProject"
135 |                   :disabled="isLoading"
136 |               >
137 |                 Add Project
138 |               </v-btn>
139 |             </div>
140 |           </template>
141 |         </v-data-table-server>
142 |       </v-theme-provider>
143 |     </v-card>
144 |   </div>
145 | 
146 | </template>
147 | 
148 | <script setup lang="ts">
149 | import {ref, watch, computed} from 'vue';
150 | import {useRouter} from 'vue-router';
151 | import CountryFlag from '@/components/common/CountryFlag.vue';
152 | import {getBrandLogo} from "@/helpers/brandUtils";
153 | import type {Project} from '@/types/project';
154 | import {projectHeaders} from "@/constants/project.ts";
155 | import EditOrCreateProjectDialog from "@/components/project/EditOrCreateProjectDialog.vue";
156 | import BudgetProgress from "@/components/common/dialog/BudgetProgress.vue";
157 | 
158 | /* Single for Display on Overviewpage, multi for complete datatable*/
159 | type ComponentType = 'single' | 'multi';
160 | 
161 | // --- Props ---
162 | interface Props {
163 |   type: ComponentType | null | undefined;
164 |   projects: Project[];
165 |   totalProjects: number;
166 |   isLoading: boolean;
167 |   currentPage: number | null;
168 |   itemsPerPage: number;
169 |   mediaplanId: string;
170 | }
171 | 
172 | const props = withDefaults(defineProps<Props>(), {
173 |   type: 'multi',
174 |   projects: () => [],
175 |   totalProjects: 0,
176 |   isLoading: false,
177 |   currentPage: 0,
178 |   itemsPerPage: 10,
179 |   mediaplanId: null // Wichtig: Muss vom Parent (MediaplanDetail) übergeben werden!
180 | 
181 | });
182 | 
183 | // --- Emits ---
184 | const emit = defineEmits<{
185 |   (e: 'addProject'): void;
186 |   (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }): void;
187 | }>();
188 | 
189 | // Router Instanz
190 | const router = useRouter();
191 | 
192 | // --- Computed Properties für Tabelle ---
193 | const pageModel = computed({
194 |   get: () => props.currentPage + 1,
195 |   set: (value) => {
196 |   }
197 | });
198 | 
199 | const itemsPerPageModel = computed({
200 |   get: () => props.itemsPerPage,
201 |   set: (value) => {
202 |   }
203 | });
204 | 
205 | 
206 | // --- Methoden ---
207 | const onOptionsUpdate = (options: { page: number; itemsPerPage: number; sortBy?: any[]; sortDesc?: boolean[] }) => {
208 |   emit('update:options', options);
209 | };
210 | 
211 | const addProject = () => {
212 |   emit('addProject');
213 | };
214 | 
215 | const isProjectDialogOpen = ref(false);
216 | const selectedProject = ref<Project | null>(null);
217 | 
218 | const openCreateProject = () => {
219 |   selectedProject.value = null;
220 |   isProjectDialogOpen.value = true;
221 | };
222 | 
223 | const openEditProject = (project: Project) => {
224 |   selectedProject.value = project;
225 |   isProjectDialogOpen.value = true;
226 | };
227 | 
228 | const onProjectSaved = (project: Project) => {
229 |   isProjectDialogOpen.value = false;
230 |   console.log(project)
231 |   // Example: refetch list here if needed
232 |   // await fetchProjects()
233 | };
234 | </script>
235 | 
236 | 
237 | <style scoped>
238 | /* ... (Styles bleiben) ... */
239 | 
240 | </style>
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
89 |               <v-icon>mdi-pencil-outline</v-icon>
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
79 |           <v-icon>mdi-pencil-outline</v-icon>
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
16 |     fontSize: props.size || '1rem',
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
28 | 
29 | }
30 | 
31 | </style>
```

src/components/common/FormattedCurrencyInput.vue
```
1 | <!-- src/components/form/CurrencyInput.vue -->
2 | <template>
3 |   <v-text-field
4 |       v-model="displayValue"
5 |       v-bind="attrs"
6 |       type="text"
7 |       inputmode="decimal"
8 |       autocomplete="off"
9 |       @keydown="onKeyDown"
10 |       @input="onInput"
11 |       @blur="onBlur"
12 |   />
13 | </template>
14 | 
15 | <script setup lang="ts">
16 | import {ref, watch, useAttrs} from 'vue'
17 | 
18 | // Define only our custom props
19 | const props = defineProps<{
20 |   modelValue: number | null
21 |   decimal?: 'comma' | 'dot'
22 |   allowDecimals?: boolean
23 | }>()
24 | 
25 | // Emit the numeric value back to the parent
26 | const emit = defineEmits<{
27 |   (e: 'update:modelValue', value: number | null): void
28 | }>()
29 | 
30 | // Capture and pass through all other <v-text-field> props
31 | const attrs = useAttrs()
32 | 
33 | // Internal display value (formatted string)
34 | const displayValue = ref('')
35 | 
36 | // Default prop values
37 | const decimal = props.decimal ?? 'comma'
38 | const allowDecimals = props.allowDecimals ?? true
39 | 
40 | // Format number to string (1.000,00 or 1,000.00)
41 | function format(value: number | null): string {
42 |   if (value == null) return ''
43 | 
44 |   const hasDecimals = value % 1 !== 0
45 | 
46 |   return new Intl.NumberFormat(
47 |       decimal === 'dot' ? 'en-US' : 'de-DE',
48 |       {
49 |         minimumFractionDigits: hasDecimals && allowDecimals ? 2 : 0,
50 |         maximumFractionDigits: allowDecimals ? 2 : 0
51 |       }
52 |   ).format(value)
53 | }
54 | 
55 | // Parse user input string to number
56 | function parse(value: string): number | null {
57 |   const sanitized = value
58 |       .replace(/\s/g, '')
59 |       .replace(decimal === 'comma' ? /\./g : /,/g, '') // remove 1.000
60 |       .replace(decimal === 'comma' ? /,/g : /\./g, '.') // 1.000,00 → 1000.00
61 | 
62 |   const number = parseFloat(sanitized)
63 |   return isNaN(number) ? null : number
64 | }
65 | 
66 | // Initial sync: modelValue → display
67 | watch(() => props.modelValue, (val) => {
68 |   displayValue.value = format(val)
69 | }, {immediate: true})
70 | 
71 | // Key restriction handler
72 | function onKeyDown(e: KeyboardEvent) {
73 |   const decimalChar = decimal === 'comma' ? ',' : '.'
74 | 
75 |   const isAllowed = [
76 |     'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
77 |     ...Array.from({length: 10}, (_, i) => `${i}`)
78 |   ]
79 | 
80 |   if (allowDecimals) isAllowed.push(decimalChar)
81 | 
82 |   if (!isAllowed.includes(e.key)) {
83 |     e.preventDefault()
84 |   }
85 | }
86 | 
87 | // Input handler (while typing)
88 | function onInput(e: Event) {
89 |   const val = (e.target as HTMLInputElement).value
90 |   displayValue.value = val
91 |   emit('update:modelValue', parse(val))
92 | }
93 | 
94 | // Format final value on blur
95 | function onBlur() {
96 |   displayValue.value = format(parse(displayValue.value))
97 | }
98 | </script>
```

src/components/common/MediaplanBuilderTypeSwitch.vue
```
1 | <template>
2 |     <v-select
3 |         v-model="localBuilderType"
4 |         :items="builderOptions"
5 |         item-title="name"
6 |         item-value="id"
7 |         density="compact"
8 |         hide-details
9 |         variant="outlined"
10 |         class="ml-2"
11 |         style="max-width: 140px"
12 |         @update:model-value="emit('update:builderType', $event)"
13 |     />
14 | </template>
15 | 
16 | <script setup>
17 | 
18 | import {ref, watch, defineEmits} from 'vue'
19 | 
20 | const emit = defineEmits(['update:builderType'])
21 | const props = defineProps({
22 |   builderType: {type: String, default: 'sea'}
23 | })
24 | 
25 | const localBuilderType = ref(props.builderType)
26 | watch(() => props.builderType, (val) => localBuilderType.value = val)
27 | 
28 | const builderOptions = [
29 |   {id: 'sea', name: 'SEA'},
30 |   {id: 'social', name: 'Social'},
31 |   {id: 'display', name: 'Display'},
32 |   {id: '2layer', name: '2-Layer'}
33 | ]
34 | </script>
```

src/components/common/MediaplanTopSection.vue
```
1 | <template>
2 |   <!-- Top breadcrumb row -->
3 |   <v-row class="mb-0">
4 |     <v-col cols="12" md="5" class="d-flex align-center pt-0 pb-0">
5 |       <MediaplanBreadcrumb :mediaplan="mediaplan" :project="project"/>
6 |     </v-col>
7 |   </v-row>
8 | 
9 |   <!-- Main control bar -->
10 |   <v-row class="mb-7" no-gutters align="center">
11 |     <!-- Left side: Builder type & view toggle -->
12 |     <v-col class="d-flex align-center">
13 |       <MediaplanViewToggle
14 |           v-model="internalView"
15 |           class="ml-4"
16 |       />
17 |       <MediaplanBuilderTypeSwitch
18 |           :builder-type="selectedBuilderType"
19 |           @update:builderType="selectedBuilderType = $event"
20 |       />
21 |     </v-col>
22 | 
23 |     <!-- Right side: Header with budget and search -->
24 |     <v-col class="d-flex justify-end pr-0">
25 |       <MediaplanHeader
26 |           :plan-budget="mediaplan?.budget?.total || 0"
27 |           :used-percentage="calculatePercentage(mediaplan?.budget?.used, mediaplan?.budget?.total)"
28 |           :search="search"
29 |           @update:search="val => emit('update:search', val)"
30 |           :is-loading="isLoading"
31 |       />
32 |     </v-col>
33 |   </v-row>
34 | </template>
35 | 
36 | <script setup lang="ts">
37 | import {toRefs, computed} from 'vue'
38 | import MediaplanBreadcrumb from '@/components/mediaplan/MediaplanBreadcrumb.vue'
39 | import MediaplanHeader from '@/components/mediaplan/MediaplanHeader.vue'
40 | import MediaplanViewToggle from '@/components/mediaplan/MediaplanViewToggle.vue'
41 | import MediaplanBuilderTypeSwitch from '@/components/common/MediaplanBuilderTypeSwitch.vue'
42 | 
43 | import type {Mediaplan} from '@/types/mediaplan'
44 | import type {Project} from '@/types/project'
45 | import type {Campaign} from '@/types/campaign'
46 | 
47 | const props = defineProps<{
48 |   mediaplan: Mediaplan | null
49 |   project: Project | null
50 |   campaign?: Campaign | null
51 |   search: string
52 |   isLoading: boolean
53 |   currentView: 'planning' | 'budget'
54 |   builderType: 'sea' | 'social' | 'display' | '2layer'
55 | }>()
56 | 
57 | const emit = defineEmits<{
58 |   (e: 'update:search', value: string): void
59 |   (e: 'update:current-view', value: 'planning' | 'budget'): void
60 |   (e: 'update:builderType', value: 'sea' | 'social' | 'display' | '2layer'): void
61 | }>()
62 | 
63 | const {mediaplan, project, campaign, search, isLoading, currentView, builderType} = toRefs(props)
64 | 
65 | // Sync the internal view toggle with prop
66 | const internalView = computed<'planning' | 'budget'>({
67 |   get: () => currentView.value,
68 |   set: val => emit('update:current-view', val),
69 | })
70 | 
71 | // Sync builder type selection
72 | const selectedBuilderType = computed<'sea' | 'social' | 'display' | '2layer'>({
73 |   get: () => builderType.value,
74 |   set: val => emit('update:builderType', val),
75 | })
76 | 
77 | // Determine breadcrumb level
78 | const levelDisplay = computed(() => {
79 |   if (campaign?.value) return 'Campaign'
80 |   if (project.value) return 'Project'
81 |   return 'Mediaplan'
82 | })
83 | 
84 | function calculatePercentage(used: number | undefined, total: number | undefined): number {
85 |   if (!used || !total) return 0
86 |   return (used / total) * 100
87 | }
88 | </script>
89 | 
90 | <style scoped>
91 | /* Optional: eigene Styles hier hinzufügen */
92 | </style>
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

src/components/overview/CreateFirstProjectDialog.vue
```
1 | <template>
2 |   <v-dialog :model-value="modelValue" @update:model-value="handleClose" persistent max-width="450px">
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
64 |                       <country-flag :country="item.code" class="mr-2"/>
65 |                       {{ item.code }} - {{ item.name }}
66 |                     </div>
67 |                   </template>
68 |                   <template v-slot:item="{ item, props }">
69 |                     <v-list-item v-bind="props" :title="`${item.code} - ${item.name}`">
70 |                       <template v-slot:prepend>
71 |                         <country-flag :country="item.code" class="mr-2"/>
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
168 | import {ref, computed, onMounted, watch, nextTick} from 'vue';
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
195 | 
196 | const props = defineProps<CreateFirstProjectDialogProps>()
197 | 
198 | const emit = defineEmits<{
199 |   (e: 'update:modelValue', value: boolean): void;
200 |   (e: 'created', projectId: string): void;
201 | }>();
202 | 
203 | const form = ref<any>(null);
204 | const projectStore = useProjectStore();
205 | const isFormValid = ref(false);
206 | const isSubmitting = ref(false);
207 | 
208 | const selectedCountry = ref<ProjectCountry | null>(null);
209 | const selectedLanguage = ref<string | null>(null);
210 | const selectedBuilder = ref<string | null>(null);
211 | const selectedCampaignType = ref<string | null>(null);
212 | const selectedPhase = ref<string | null>(null);
213 | const selectedGoal = ref<string | null>(null);
214 | 
215 | const brandName = computed(() => props.brand?.name || 'Brand');
216 | const poNumbersDisplay = computed(() => {
217 |   if (!props.poNumbers || props.poNumbers.length === 0) return '-';
218 |   return props.poNumbers.map(po => po.name).join(', ');
219 | });
220 | const startDateValue = computed(() => props.startDate || null);
221 | const endDateValue = computed(() => props.endDate || null);
222 | 
223 | const countries = computed(() => projectStore.countries || []);
224 | const languageOptions = computed(() => projectStore.languages || []);
225 | const builders = computed(() => projectStore.builders?.map(b => ({code: b.id, name: b.name})) || []);
226 | const campaignTypes = computed(() => projectStore.campaignTypes?.map(t => ({code: t.id, name: t.name})) || []);
227 | const phases = computed(() => projectStore.phases?.map(p => ({code: p.id, name: p.name})) || []);
228 | const goals = computed(() => projectStore.goals?.map(g => ({code: g.id, name: g.name})) || []);
229 | 
230 | const formIsReady = computed(() => {
231 |   return isFormValid.value &&
232 |       !!selectedCountry.value &&
233 |       !!selectedLanguage.value &&
234 |       !!selectedBuilder.value &&
235 |       !!selectedCampaignType.value &&
236 |       !!selectedPhase.value &&
237 |       !!selectedGoal.value;
238 | });
239 | 
240 | const availableLanguages = computed(() => {
241 |   if (!selectedCountry.value) return [];
242 |   return languageOptions.value.filter((lang: any) =>
243 |       lang.country_codes?.includes(selectedCountry.value!.code)
244 |   );
245 | });
246 | 
247 | const validateForm = async (): Promise<boolean> => {
248 |   if (!form.value) return false;
249 |   const {valid} = await form.value.validate();
250 |   return valid && formIsReady.value;
251 | };
252 | 
253 | const resetFormFields = () => {
254 |   selectedCountry.value = null;
255 |   selectedLanguage.value = null;
256 |   selectedBuilder.value = null;
257 |   selectedCampaignType.value = null;
258 |   selectedPhase.value = null;
259 |   selectedGoal.value = null;
260 |   nextTick(() => {
261 |     form.value?.resetValidation();
262 |   });
263 | };
264 | 
265 | const submitForm = async () => {
266 |   const isValid = await validateForm();
267 |   if (!isValid) {
268 |     showWarning('Please fill in all required fields correctly.');
269 |     return;
270 |   }
271 | 
272 |   // Double-check that required refs have values before proceeding
273 |   // formIsReady should cover this, but an extra check can be helpful.
274 |   if (!selectedCountry.value || !selectedLanguage.value || !selectedPhase.value || !selectedCampaignType.value /* Add checks for other required fields if needed */) {
275 |     showError("Critical project information is missing. Please check selections.");
276 |     isSubmitting.value = false; // Ensure submission stops
277 |     return;
278 |   }
279 | 
280 |   isSubmitting.value = true;
281 |   try {
282 |     // --- Construct the single ProjectCreate object ---
283 |     // NOTE: Determine how the project 'name' should be generated.
284 |     // Using a combination of country/language as placeholder.
285 |     // You might need a dedicated input or different logic.
286 |     const projectCreateData: ProjectCreate = {
287 |       mediaplanId: props.mediaplanId,
288 |       name: `Project ${selectedCountry.value.code}-${selectedLanguage.value}`, // Placeholder name
289 |       country: selectedCountry.value, // Pass the whole country object
290 |       language: selectedLanguage.value, // Pass language code
291 |       phase: selectedPhase.value, // Pass phase code
292 |       campaignType: selectedCampaignType.value, // Pass campaign type code
293 |       // Add goal, builder etc. IF the ProjectCreate type defines them
294 |       // and if the store action uses them. Based on the store code provided,
295 |       // builder/goal don't seem directly mapped in the payload construction.
296 |       // goal: selectedGoal.value,
297 |       // builder: selectedBuilder.value,
298 |     };
299 | 
300 |     console.log("DEBUG: Submitting ProjectCreate object:", projectCreateData);
301 | 
302 |     // --- Call store action with the single object ---
303 |     // The store action 'createProject' now receives the correctly structured object
304 |     const newProjectResponse = await projectStore.createProject(projectCreateData);
305 | 
306 |     showSuccess(`Project created successfully`);
307 |     // Assuming createProject returns the ID or relevant data
308 |     // If it returns a mock ID like `project-${Date.now()}` as in the store code:
309 |     const newProjectId = typeof newProjectResponse === 'string' ? newProjectResponse : newProjectResponse?._id || `unknown-${Date.now()}`;
310 |     emit('created', newProjectId);
311 | 
312 |     emit('update:modelValue', false);
313 | 
314 |   } catch (error: any) {
315 |     console.error(`Error creating first project:`, error);
316 |     // Log the specific error from the store if possible
317 |     const message = error?.response?.data?.message || error?.message || `Failed to create project.`;
318 |     showError(message);
319 |   } finally {
320 |     isSubmitting.value = false;
321 |   }
322 | };
323 | const handleClose = (value: boolean) => {
324 |   if (!value) {
325 |     cancelDialog();
326 |   }
327 | }
328 | 
329 | const cancelDialog = () => {
330 |   if (isSubmitting.value) {
331 |     showWarning('Please wait, submission is in progress.');
332 |     return;
333 |   }
334 |   resetFormFields();
335 |   emit('update:modelValue', false);
336 | };
337 | 
338 | watch(() => props.modelValue, (isVisible) => {
339 |   if (isVisible) {
340 |     resetFormFields();
341 |   }
342 | });
343 | 
344 | watch(selectedCountry, (newCountry, oldCountry) => {
345 |   if (newCountry !== oldCountry && oldCountry !== undefined) {
346 |     selectedLanguage.value = null;
347 |     nextTick(() => {
348 |       if (availableLanguages.value.length === 1) {
349 |         selectedLanguage.value = availableLanguages.value[0].code;
350 |       }
351 |     });
352 |   }
353 | });
354 | 
355 | onMounted(async () => {
356 |   try {
357 |     await projectStore.fetchProjectOptions();
358 |     console.log("First Project Dialog options loaded on mount.");
359 |   } catch (error) {
360 |     console.error('Error fetching form options on mount:', error);
361 |     showError('Failed to load required form options.');
362 |   }
363 | });
364 | 
365 | </script>
366 | 
367 | <style scoped>
368 | .country-flag {
369 |   width: 20px;
370 |   height: auto;
371 |   display: inline-block;
372 |   vertical-align: middle;
373 | }
374 | </style>
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
10 |       <v-form v-model="valid" ref="form" @submit.prevent="submitForm">
11 |         <WithFormDefaults>
12 |           <!--          <pre>{{ formData }}</pre>-->
13 |           <v-card-text class="pa-0">
14 |             <FormElementVrowVcol label="Brand Output" required>
15 |               <v-select
16 |                   id="brand-select"
17 |                   v-model="formData.brand"
18 |                   :items="brands"
19 |                   item-title="value"
20 |                   item-value="abbreviation"
21 |                   placeholder="Please Select a brand"
22 |                   :rules="[v => !!v || 'Brand is required']"
23 |                   return-object
24 |                   :loading="isLoadingSources"
25 |               >
26 |                 <template v-slot:selection="{ item }">
27 |                   <template v-if="formData.brand">
28 |                     <v-avatar
29 |                         size="24"
30 |                         class="mr-2 grey lighten-4"
31 |                         :image="getBrandLogo(item.raw)"/>
32 |                     {{ item.raw.value }}
33 |                   </template>
34 |                 </template>
35 | 
36 |                 <template v-slot:item="{ item, props }">
37 |                   <v-list-item v-bind="props" :title="item.raw.value">
38 |                     <template v-slot:prepend>
39 |                       <v-avatar
40 |                           size="32"
41 |                           class="mr-2 grey lighten-4"
42 |                           :image="getBrandLogo(item.raw)"
43 |                       />
44 |                     </template>
45 |                   </v-list-item>
46 |                 </template>
47 |               </v-select>
48 |             </FormElementVrowVcol>
49 | 
50 |             <FormElementVrowVcol pb="pb-3" label="Mediaplan Type" required>
51 |               <v-radio-group v-model="formData.mediaplan_type" inline>
52 |                 <v-radio value="po" label="PO Based"/>
53 |                 <v-radio value="draft" label="Draft"/>
54 |               </v-radio-group>
55 |             </FormElementVrowVcol>
56 | 
57 |             <FormElementVrowVcol label="Individual Name">
58 |               <v-text-field
59 |                   id="mediaplan-name"
60 |                   v-model="formData.name"
61 |                   placeholder="please type in an individual title"
62 |                   :rules="[v => !!v || 'Name is required']"
63 |               />
64 |             </FormElementVrowVcol>
65 | 
66 |             <FormElementVrowVcol label="Select existing PO" required>
67 |               <v-row no-gutters>
68 |                 <v-col class="mr-2">
69 |                   <v-select
70 |                       id="po-select"
71 |                       v-model="formData.po_numbers"
72 |                       :items="poNumbersFromStore"
73 |                       item-title="name"
74 |                       item-value="_id"
75 |                       placeholder="Select POs"
76 |                       return-object
77 |                       :rules="[v => (v && v.length > 0) || 'At least one PO is required']"
78 |                       multiple
79 |                       chips
80 |                       closable-chips
81 |                       :loading="poStore.isLoading"/>
82 |                 </v-col>
83 |                 <v-col cols="auto">
84 |                   <v-btn
85 |                       color="primary"
86 |                       size="large"
87 |                       style="height: 48px;"
88 |                       variant="outlined"
89 |                       @click="openCreatePODialog"
90 |                       :disabled="poStore.isLoading">
91 |                     Create PO
92 |                   </v-btn>
93 |                 </v-col>
94 |               </v-row>
95 |             </FormElementVrowVcol>
96 | 
97 |             <FormElementVrowVcol label="Creator" required>
98 |               <v-text-field
99 |                   id="creator-name"
100 |                   :value="authStore.user?.name"
101 |                   placeholder="Your name"
102 |                   :rules="[v => !!v || 'Creator name is required']"
103 |                   readonly
104 |                   disabled
105 |               />
106 |             </FormElementVrowVcol>
107 | 
108 |             <FormElementVrowVcol label="Department">
109 |               <v-text-field
110 |                   id="department"
111 |                   v-model="department"
112 |                   placeholder="Department name"
113 |               />
114 |             </FormElementVrowVcol>
115 | 
116 |             <FormElementVrowVcol label="Start date - End date" required>
117 |               <DateRangePicker
118 |                   id="date-range"
119 |                   v-model="dateRange"
120 |                   placeholder="Select start and end dates"
121 |                   :rules="[v => !!v || 'Date range is required']"
122 |                   :required="true"
123 |                   dialog-title="Choose a date range"
124 |                   @update:model-value="handleDateRangeChange"
125 |               />
126 |             </FormElementVrowVcol>
127 |           </v-card-text>
128 |         </WithFormDefaults>
129 |         <DialogFooter
130 |             cancel-text="Cancel"
131 |             confirm-text="Next Step"
132 |             :loading="isSubmitting"
133 |             :disabled="!valid || isLoadingSources || poStore.isLoading"
134 |             :submit-button="true"
135 |             @cancel="cancelDialog"
136 |         />
137 |       </v-form>
138 |     </v-card>
139 |   </v-dialog>
140 | 
141 |   <CreatePoDialog
142 |       v-model="createPODialogVisible"
143 |       :initial-brand-id="formData.brand?.abbreviation" @created="handlePoCreated"
144 |   />
145 | 
146 |   <CreateFirstProjectDialog
147 |       mode="create-mediaplan"
148 |       v-if="showProjectDialog"
149 |       v-model="showProjectDialog"
150 |       :mediaplan-id="createdMediaplanId"
151 |       :mediaplan-name="formData.name"
152 |       :po-numbers="formData.po_numbers"
153 |       :start-date="formData.start_date"
154 |       :end-date="formData.end_date"
155 |       :brand="formData.brand ? { _id: formData.brand.abbreviation, name: formData.brand.value } : undefined"
156 |       @created="handleProjectCreated"
157 |   />
158 | </template>
159 | 
160 | <script setup lang="ts">
161 | import {ref, computed, onMounted, watch, nextTick, reactive} from 'vue';
162 | import {useAuthStore} from '@/stores/auth';
163 | import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
164 | import {useSourcesStore} from '@/stores/sourcesStore';
165 | import {usePoNumberStore} from '@/stores/poNumberStore';
166 | import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
167 | import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
168 | import DateRangePicker from './DateRangePicker.vue';
169 | import CreateFirstProjectDialog from '@/components/overview/CreateFirstProjectDialog.vue';
170 | import CreatePoDialog from '@/components/overview/CreatePoDialog.vue';
171 | import type {MediaplanCreate, Brand as MediaplanBrandType, PONumber, Source, Mediaplan} from '@/types/mediaplan';
172 | import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
173 | import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
174 | import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
175 | import {getBrandLogo} from "@/helpers/brandUtils.ts";
176 | 
177 | const valid = ref(null)
178 | 
179 | type ComponentBrandType = Source;
180 | 
181 | const props = defineProps<{
182 |   modelValue: boolean;
183 | }>();
184 | 
185 | const emit = defineEmits<{
186 |   (e: 'update:modelValue', value: boolean): void;
187 |   (e: 'created', mediaplanId: string): void;
188 |   (e: 'project-created', projectId: string): void;
189 | }>();
190 | 
191 | const authStore = useAuthStore();
192 | const createMediaplanStore = useCreateMediaplanStore();
193 | const sourcesStore = useSourcesStore();
194 | const poStore = usePoNumberStore();
195 | 
196 | const dialog = computed({
197 |   get: () => props.modelValue,
198 |   set: (value) => emit('update:modelValue', value)
199 | });
200 | 
201 | const department = ref('');
202 | 
203 | const isSubmitting = ref(false);
204 | const dateRange = ref<[string, string] | null>(null);
205 | const showProjectDialog = ref(false);
206 | const createdMediaplanId = ref('');
207 | const createPODialogVisible = ref(false);
208 | 
209 | const brands = ref<ComponentBrandType[]>([]);
210 | const isLoadingSources = ref(false);
211 | 
212 | const poNumbersFromStore = computed(() => poStore.allPONumbers);
213 | 
214 | const formData = reactive<Mediaplan>({
215 |   name: '',
216 |   status: 'Draft', // Default status
217 |   start_date: '',
218 |   end_date: '',
219 |   brand: null,     // Initialized to null
220 |   po_numbers: [],
221 |   mediaplan_type: '',
222 |   created_by: authStore.user?.name || '',
223 | });
224 | 
225 | const handleDateRangeChange = (range: [string, string] | null) => {
226 |   if (range) {
227 |     formData.start_date = range[0];
228 |     formData.end_date = range[1];
229 |   } else {
230 |     formData.start_date = '';
231 |     formData.end_date = '';
232 |   }
233 | };
234 | 
235 | const handleProjectCreated = (projectId: string) => {
236 |   showProjectDialog.value = false;
237 |   emit('project-created', projectId);
238 |   dialog.value = false;
239 |   showSuccess('Project created successfully');
240 | };
241 | 
242 | const handlePoCreated = async (po: PONumber) => {
243 |   selectedPOs.value = [...selectedPOs.value, po._id];
244 |   showSuccess(`PO "${po.name}" created successfully and added to selection`);
245 | };
246 | 
247 | const loadInitialData = async () => {
248 |   isLoadingSources.value = true;
249 | 
250 |   try {
251 |     let brandList = sourcesStore.getSourceList('brand') as ComponentBrandType[] | undefined;
252 |     if (!brandList || brandList.length === 0) {
253 |       const fetchSuccess = await sourcesStore.fetchSources('creation', 'mediaplan');
254 |       if (fetchSuccess) {
255 |         brandList = sourcesStore.getSourceList('brand') as ComponentBrandType[] | undefined;
256 |       } else {
257 |         showError(sourcesStore.error || 'Failed to fetch brand sources.');
258 |       }
259 |     }
260 |     brands.value = brandList || [];
261 |     isLoadingSources.value = false;
262 | 
263 |     if (poStore.allPONumbers.length === 0) {
264 |       await poStore.fetchPONumbers();
265 |     }
266 | 
267 |   } catch (error) {
268 |     console.error('Error loading initial form data:', error);
269 |     showError('Failed to load initial form data.');
270 |     isLoadingSources.value = false;
271 |   }
272 | };
273 | 
274 | const submitForm = async () => {
275 |   if (!form.value) return;
276 |   const {valid} = await form.value.validate();
277 |   if (!valid) return;
278 | 
279 |   isSubmitting.value = true;
280 |   try {
281 | 
282 |     const finalPayloadForMediaplan: Mediaplan = {
283 |       ...formData,
284 |     };
285 |     const createdMediaplan = await createMediaplanStore.createMediaplan(finalPayloadForMediaplan);
286 |     createdMediaplanId.value = createdMediaplan._id;
287 | 
288 |     showSuccess('Mediaplan created successfully');
289 |     emit('created', createdMediaplanId.value);
290 |     showProjectDialog.value = true;
291 | 
292 |   } catch (error) {
293 |     console.error('Error creating mediaplan:', error);
294 |     showError('Failed to create mediaplan: ' + (error instanceof Error ? error.message : 'Unknown API error'));
295 |   } finally {
296 |     isSubmitting.value = false;
297 |   }
298 | };
299 | 
300 | const openCreatePODialog = () => {
301 |   if (!formData.brand?.abbreviation) {
302 |     showWarning('Please select a brand first');
303 |     return;
304 |   }
305 |   createPODialogVisible.value = true;
306 | };
307 | 
308 | const cancelDialog = () => {
309 |   resetForm();
310 |   dialog.value = false;
311 | };
312 | 
313 | const resetForm = async () => {
314 |   if (form.value) {
315 |     form.value.resetValidation();
316 |     form.value.reset();
317 |   }
318 |   await nextTick();
319 |   formData.name = '';
320 |   formData.brand = null;
321 |   formData.start_date = '';
322 |   formData.end_date = '';
323 |   formData.budget = {total: 0, used: 0, available: 0};
324 |   formData.po_numbers = [];
325 |   formData.mediaplan_type = 'po';
326 |   formData.created_by = authStore.user?.name || '';
327 |   dateRange.value = null;
328 |   department.value = '';
329 |   showProjectDialog.value = false;
330 |   createdMediaplanId.value = '';
331 | };
332 | 
333 | onMounted(async () => {
334 |   await loadInitialData();
335 | 
336 |   if (!authStore.user) {
337 |     await authStore.fetchProfile();
338 | 
339 |   }
340 | 
341 | });
342 | 
343 | watch(dialog, (newValue) => {
344 |   if (newValue) {
345 |     if (brands.value.length === 0 || poStore.allPONumbers.length === 0) {
346 |       loadInitialData();
347 |     }
348 |   } else {
349 |     resetForm();
350 |   }
351 | });
352 | </script>
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
15 |             <v-col cols="12" md="6">
16 |               <div class="mb-4">
17 |                 <label for="client-department" class="text-body-2 mb-1 d-block">Client Department</label>
18 |                 <v-text-field
19 |                     id="client-department"
20 |                     v-model="formData.clientDepartment"
21 |                     placeholder="Enter the client's department name"
22 |                     variant="outlined"
23 |                     hide-details
24 |                 />
25 |               </div>
26 | 
27 |               <div class="mb-4">
28 |                 <label for="brand-select" class="text-body-2 mb-1 d-block">Brand*</label>
29 |                 <v-select
30 |                     id="brand-select"
31 |                     v-model="formData.brand"
32 |                     :items="componentBrands" item-title="name"
33 |                     item-value="_id"
34 |                     placeholder="Select the brand for this PO"
35 |                     :rules="[v => !!v || 'Brand is required']"
36 |                     variant="outlined"
37 |                     hide-details
38 |                     :loading="isLoadingBrands"/>
39 |               </div>
40 | 
41 |               <div class="mb-4">
42 |                 <label for="client-name" class="text-body-2 mb-1 d-block">Client Name</label>
43 |                 <v-text-field
44 |                     id="client-name"
45 |                     v-model="formData.clientName"
46 |                     placeholder="Enter client's full name"
47 |                     variant="outlined"
48 |                     hide-details
49 |                 />
50 |               </div>
51 | 
52 |               <div class="mb-4">
53 |                 <label for="market-select" class="text-body-2 mb-1 d-block">Market*</label>
54 |                 <v-select
55 |                     id="market-select"
56 |                     v-model="formData.market"
57 |                     :items="markets"
58 |                     item-title="name"
59 |                     item-value="_id"
60 |                     placeholder="Select target market region"
61 |                     :rules="[v => !!v || 'Market is required']"
62 |                     variant="outlined"
63 |                     hide-details
64 |                 />
65 |               </div>
66 | 
67 |               <div class="mb-4">
68 |                 <label for="purpose-text" class="text-body-2 mb-1 d-block">Purpose</label>
69 |                 <v-textarea
70 |                     id="purpose-text"
71 |                     v-model="formData.purpose"
72 |                     placeholder="Describe the purpose of this purchase order"
73 |                     variant="outlined"
74 |                     rows="4"
75 |                     counter="250"
76 |                     :rules="[v => !v || v.length <= 250 || 'Maximum 250 characters']"
77 |                     hide-details="auto"
78 |                 />
79 |               </div>
80 |             </v-col>
81 | 
82 |             <v-col cols="12" md="6">
83 |               <div class="mb-4">
84 |                 <label for="po-number" class="text-body-2 mb-1 d-block">PO Number*</label>
85 |                 <v-text-field
86 |                     id="po-number"
87 |                     v-model="formData.poNumber"
88 |                     placeholder="Enter official purchase order number"
89 |                     :rules="[v => !!v || 'PO Number is required']"
90 |                     variant="outlined"
91 |                     hide-details
92 |                 />
93 |               </div>
94 | 
95 |               <div class="d-flex">
96 |                 <div class="flex-grow-1 mr-2">
97 |                   <label for="budget" class="text-body-2 mb-1 d-block">Budget*</label>
98 |                   <v-text-field
99 |                       id="budget"
100 |                       v-model="formData.budget"
101 |                       placeholder="Enter budget amount"
102 |                       type="number"
103 |                       :rules="[
104 |                         v => !!v || 'Budget is required',
105 |                         v => parseFloat(v) > 0 || 'Budget must be greater than 0'
106 |                       ]"
107 |                       variant="outlined"
108 |                       class="mb-4"
109 |                       hide-details
110 |                   />
111 |                 </div>
112 | 
113 |                 <div class="flex-grow-0" style="width: 100px">
114 |                   <label for="currency" class="text-body-2 mb-1 d-block">Currency</label>
115 |                   <v-select
116 |                       id="currency"
117 |                       v-model="formData.currency"
118 |                       :items="currencies"
119 |                       variant="outlined"
120 |                       class="mb-4"
121 |                       hide-details
122 |                   />
123 |                 </div>
124 |               </div>
125 | 
126 |               <div class="mb-4">
127 |                 <label for="validity-range" class="text-body-2 mb-1 d-block">Validity Period*</label>
128 |                 <DateRangePicker
129 |                     id="validity-range"
130 |                     v-model="dateRange"
131 |                     label=""
132 |                     placeholder="Select validity period"
133 |                     required
134 |                     :rules="[v => !!v || 'Validity period is required']"
135 |                     variant="outlined"
136 |                     dialog-title="Select PO Validity Period"
137 |                     hide-details
138 |                 />
139 |               </div>
140 | 
141 |               <div class="mb-4">
142 |                 <label for="contractor-department" class="text-body-2 mb-1 d-block">Contractor Department</label>
143 |                 <v-text-field
144 |                     id="contractor-department"
145 |                     v-model="formData.contractorDepartment"
146 |                     placeholder="Enter contractor's department name"
147 |                     variant="outlined"
148 |                     hide-details
149 |                 />
150 |               </div>
151 | 
152 |               <div class="mb-4">
153 |                 <label for="contractor-name" class="text-body-2 mb-1 d-block">Contractor Name</label>
154 |                 <v-text-field
155 |                     id="contractor-name"
156 |                     v-model="formData.contractorName"
157 |                     placeholder="Enter contractor's full name"
158 |                     variant="outlined"
159 |                     hide-details
160 |                 />
161 |               </div>
162 |             </v-col>
163 |           </v-row>
164 |         </v-card-text>
165 |         <DialogFooter
166 |             cancel-text="Cancel"
167 |             confirm-text="Create PO"
168 |             :loading="isSubmitting"
169 |             :disabled="!form?.isValid || isLoadingBrands"
170 |             :submit-button="true"
171 |             @cancel="cancelDialog"
172 |         />
173 |       </v-form>
174 |     </v-card>
175 |   </v-dialog>
176 | </template>
177 | 
178 | <script setup lang="ts">
179 | import {ref, reactive, computed, onMounted} from 'vue';
180 | import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
181 | import {useCreateMediaplanStore} from '@/stores/createMediaplanStore';
182 | import {useSourcesStore} from '@/stores/sourcesStore';
183 | import type {Brand, PONumber} from '@/types/mediaplan';
184 | import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
185 | import DateRangePicker from "./DateRangePicker.vue";
186 | import {showSuccess, showError, showWarning} from '@/helpers/notificationUtils';
187 | import {formatCurrency} from '@/helpers/currencyUtils';
188 | 
189 | const props = defineProps<{
190 |   modelValue: boolean;
191 |   initialBrandId?: string;
192 | }>();
193 | 
194 | const emit = defineEmits<{
195 |   (e: 'update:modelValue', value: boolean): void;
196 |   (e: 'created', po: PONumber): void;
197 | }>();
198 | 
199 | const form = ref<any>();
200 | const createMediaplanStore = useCreateMediaplanStore();
201 | const sourcesStore = useSourcesStore();
202 | 
203 | const dialog = computed({
204 |   get: () => props.modelValue,
205 |   set: (value) => emit('update:modelValue', value)
206 | });
207 | 
208 | const dateRange = ref<[string, string] | null>(null);
209 | const isSubmitting = ref(false);
210 | 
211 | const componentBrands = ref<Brand[]>([]);
212 | const isLoadingBrands = ref(false);
213 | 
214 | const markets = ref([
215 |   {_id: 'de', name: 'Germany'},
216 |   {_id: 'us', name: 'United States'},
217 |   {_id: 'uk', name: 'United Kingdom'},
218 | ]);
219 | 
220 | const currencies = ref(['EUR', 'USD', 'GBP', 'PLN']);
221 | 
222 | const formData = reactive({
223 |   clientDepartment: '',
224 |   brand: '',
225 |   clientName: '',
226 |   market: '',
227 |   purpose: '',
228 |   poNumber: '',
229 |   budget: null as number | null,
230 |   currency: 'EUR',
231 |   contractorDepartment: '',
232 |   contractorName: ''
233 | });
234 | 
235 | const submitForm = async () => {
236 |   if (!form.value) return;
237 |   const {valid} = await form.value.validate();
238 |   if (!valid) return;
239 | 
240 |   isSubmitting.value = true;
241 |   try {
242 |     const newPO = await createMediaplanStore.createPO({
243 |       name: formData.poNumber,
244 |       value: Number(formData.budget),
245 |       metadata: {
246 |         clientDepartment: formData.clientDepartment,
247 |         brand: formData.brand,
248 |         clientName: formData.clientName,
249 |         market: formData.market,
250 |         purpose: formData.purpose,
251 |         currency: formData.currency,
252 |         validFrom: dateRange.value ? dateRange.value[0] : undefined,
253 |         validTo: dateRange.value ? dateRange.value[1] : undefined,
254 |         contractorDepartment: formData.contractorDepartment,
255 |         contractorName: formData.contractorName
256 |       }
257 |     });
258 | 
259 |     showSuccess(
260 |         `PO "${formData.poNumber}" created successfully with budget ${formatCurrency(Number(formData.budget))}`
261 |     );
262 |     emit('created', newPO);
263 |     dialog.value = false;
264 |   } catch (error) {
265 |     console.error('Error creating PO:', error);
266 |     showError('Failed to create PO. Please try again.');
267 |   } finally {
268 |     isSubmitting.value = false;
269 |   }
270 | };
271 | 
272 | const cancelDialog = () => {
273 |   dialog.value = false;
274 | };
275 | 
276 | onMounted(async () => {
277 |   const today = new Date();
278 |   const nextYear = new Date(today);
279 |   nextYear.setFullYear(today.getFullYear() + 1);
280 |   dateRange.value = [today.toISOString().split('T')[0], nextYear.toISOString().split('T')[0]];
281 | 
282 |   isLoadingBrands.value = true;
283 |   try {
284 |     let brandList = sourcesStore.getSourceList('brand') as Brand[] | undefined;
285 |     if (!brandList || brandList.length === 0) {
286 |       const fetchSuccess = await sourcesStore.fetchSources('creation', 'mediaplan');
287 |       if (fetchSuccess) {
288 |         brandList = sourcesStore.getSourceList('brand') as Brand[] | undefined;
289 |       } else {
290 |         showError(sourcesStore.error || 'Failed to fetch brand sources.');
291 |       }
292 |     }
293 |     componentBrands.value = brandList || [];
294 | 
295 |     if (props.initialBrandId && componentBrands.value.some(b => b._id === props.initialBrandId)) {
296 |       formData.brand = props.initialBrandId;
297 |     } else if (componentBrands.value.length > 0) {
298 |       formData.brand = componentBrands.value[0]._id;
299 |     } else {
300 |       formData.brand = '';
301 |     }
302 | 
303 |   } catch (error) {
304 |     showError('Failed to load brands. Please try again later.');
305 |     console.error("Error loading brands in CreatePoDialog:", error);
306 |   } finally {
307 |     isLoadingBrands.value = false;
308 |   }
309 | });
310 | </script>
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
4 |         class="h-100 pa-3 mediaplan-card"
5 |         elevation="3"
6 |         :data-mediaplan-id="mediaplan._id"
7 |         @click="handleCardClick"
8 |     >
9 |       <v-card-item class="pb-8">
10 |         <div class="d-flex align-center">
11 |           <v-tooltip
12 |               location="top"
13 |               open-delay="300"
14 |           >
15 |             <template v-slot:activator="{ props }">
16 |               <div
17 |                   class="text-h6 text-truncate mediaplan-title pr-1"
18 |                   v-bind="props"
19 |               >
20 |                 {{ mediaplan.name }}
21 |               </div>
22 |             </template>
23 |             <span>{{ mediaplan.name }}</span>
24 |           </v-tooltip>
25 |           <v-icon size="x-small" color="primary" icon="mdi-pencil-outline" class="mr-3"/>
26 | 
27 |           <!-- Brand logo -->
28 |           <v-img
29 |               :src="getBrandLogo(mediaplan.brand)"
30 |               max-width="40"
31 |               contain
32 |               class="ml-auto"
33 |           />
34 |         </div>
35 | 
36 |         <!-- Status and date range on same row -->
37 |         <div class="d-flex align-center justify-space-between mt-2">
38 |           <div class="d-flex align-center">
39 |             <v-icon
40 |                 icon="mdi-circle"
41 |                 :color="getMediaplanStatusColor(mediaplan.status)"
42 |                 size="x-small"
43 |                 class="mr-1"
44 |             />
45 |             <span class="status-text text-grey">{{ getMediaplanStatusLabel(mediaplan.status) }}</span>
46 |           </div>
47 | 
48 |           <div class="d-flex align-center">
49 |             <v-icon size="small" icon="mdi-calendar-range" class="mr-1"/>
50 |             <span class="date-range-text text-grey">{{
51 |                 formatDateRange(mediaplan.start_date, mediaplan.end_date)
52 |               }}</span>
53 |           </div>
54 |         </div>
55 |       </v-card-item>
56 | 
57 |       <v-card-text>
58 |         <!-- Creator row -->
59 |         <div class="d-flex justify-space-between mb-3">
60 |           <span class="text-subtitle-2">Creator</span>
61 |           <span class="text-subtitle-2 font-weight-medium">{{ mediaplan.created_by?.name || 'N/A' }}</span>
62 |         </div>
63 | 
64 |         <v-divider class="pt-1 pb-4"></v-divider>
65 |         <!-- Total Budget row -->
66 |         <div class="d-flex justify-space-between mb-3">
67 |           <span class="text-subtitle-2">Total Budget</span>
68 |           <div class="d-flex align-center">
69 |             <v-icon size="x-small" icon="mdi-circle" color="green" class="mr-1"/>
70 |             <span class="text-subtitle-2 font-weight-medium">{{ formatCurrency(mediaplan.budget?.total) }}</span>
71 |           </div>
72 |         </div>
73 | 
74 |         <v-divider class="pt-1 pb-4"></v-divider>
75 |         <!-- Used Budget row -->
76 |         <div class="d-flex justify-space-between mb-3">
77 |           <span class="text-subtitle-2">Used Budget</span>
78 |           <div class="d-flex align-center">
79 |             <v-icon size="x-small" icon="mdi-circle" color="red" class="mr-1"/>
80 |             <span class="text-subtitle-2 font-weight-medium">{{ formatCurrency(mediaplan.budget?.used) }}</span>
81 |           </div>
82 |         </div>
83 | 
84 |         <v-divider class="pt-1 pb-4"></v-divider>
85 |         <!-- PO Numbers row -->
86 |         <div class="d-flex justify-space-between" v-if="mediaplan.po_numbers && mediaplan.po_numbers.length > 0">
87 |           <span class="text-subtitle-2">PO</span>
88 |           <span class="text-subtitle-2 font-weight-medium text-truncate" style="max-width: 70%">
89 |           {{ mediaplan.po_numbers.map(po => po.name).join(', ') }}
90 |         </span>
91 |         </div>
92 |       </v-card-text>
93 | 
94 |       <v-card-actions>
95 |         <!-- Action buttons -->
96 |         <v-spacer/>
97 | 
98 |         <!-- Options menu -->
99 |         <mediaplan-options-menu
100 |             :mediaplan-id="mediaplan._id"
101 |             @action="handleMenuAction"
102 |         />
103 | 
104 |         <!-- Navigation button -->
105 |         <v-btn
106 |             variant="flat"
107 |             color="primary"
108 |             :to="{ name: 'MediaplanDetail', params: { mediaplanId: mediaplan._id }}"
109 |         >
110 |           Show Mediaplan
111 |         </v-btn>
112 |         <br>
113 | 
114 |       </v-card-actions>
115 |     </v-card>
116 |   </div>
117 | </template>
118 | 
119 | 
120 | <script setup lang="ts">
121 | import {ref} from 'vue';
122 | import {Mediaplan} from '@/types/mediaplan';
123 | import {getMediaplanStatusColor, getMediaplanStatusLabel} from '@/constants/mediaplanStatuses';
124 | import MediaplanOptionsMenu from "@/components/overview/MediaplanOptionsMenu.vue";
125 | import {useRouter} from 'vue-router';
126 | import {formatDateRange} from '@/helpers/dateUtils';
127 | import {formatCurrency} from '@/helpers/currencyUtils';
128 | import {getBrandLogo} from '@/helpers/brandUtils';
129 | 
130 | // Store mediaplan prop in a variable to access it throughout the component
131 | const props = defineProps<{
132 |   mediaplan: Mediaplan;
133 | }>();
134 | 
135 | const emit = defineEmits<{
136 |   (e: 'view', mediaplanId: string): void;
137 |   (e: 'edit', mediaplanId: string): void;
138 |   (e: 'add-po', mediaplanId: string): void;
139 |   (e: 'export', mediaplanId: string): void;
140 |   (e: 'duplicate', mediaplanId: string): void;
141 |   (e: 'archive', mediaplanId: string): void;
142 |   (e: 'delete', mediaplanId: string): void;
143 | }>();
144 | 
145 | const router = useRouter();
146 | 
147 | // Handle card click for navigation
148 | const handleCardClick = (event: MouseEvent) => {
149 |   // Don't navigate if clicking on buttons or menu items
150 |   if ((event.target as HTMLElement).closest('.v-card__actions')) {
151 |     return;
152 |   }
153 | 
154 |   // Navigate to detail page
155 |   router.push({name: 'MediaplanDetail', params: {mediaplanId: props.mediaplan._id}});
156 | };
157 | 
158 | const handleMenuAction = (action: string, mediaplanId: string) => {
159 |   switch (action) {
160 |     case 'view':
161 |       router.push({name: 'MediaplanDetail', params: {mediaplanId: id}});
162 |       break;
163 |     case 'edit':
164 |       router.push({name: 'MediaplanEdit', params: {mediaplanId: id}});
165 |       break;
166 |     case 'addPo':
167 |       emit('add-po', id);
168 |       break;
169 |     case 'export':
170 |       emit('export', id);
171 |       break;
172 |     case 'duplicate':
173 |       emit('duplicate', id);
174 |       break;
175 |     case 'archive':
176 |       emit('archive', id);
177 |       break;
178 |     case 'delete':
179 |       emit('delete', id);
180 |       break;
181 |   }
182 | };
183 | </script>
184 | 
185 | <style scoped>
186 | .mediaplan-title {
187 |   overflow: hidden;
188 |   text-overflow: ellipsis;
189 |   white-space: nowrap;
190 |   flex: 1;
191 | }
192 | 
193 | .status-text, .date-range-text {
194 |   font-size: 12px;
195 | }
196 | 
197 | .mediaplan-card {
198 |   cursor: pointer;
199 |   transition: transform 0.2s, box-shadow 0.2s;
200 | }
201 | 
202 | .mediaplan-card:hover {
203 |   transform: translateY(-4px);
204 |   box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
205 | }
206 | 
207 | /* Override cursor for buttons and menu */
208 | .v-menu__content,
209 | .v-card__actions .v-btn {
210 |   cursor: default;
211 | }
212 | </style>
```

src/components/overview/MediaplanFilters.vue
```
1 | <template>
2 |   <div class="filter-container">
3 |     <div class="filter-item">
4 |       <v-select
5 |           v-model="localBrandId"
6 |           :items="brandsFromStore"
7 |           item-title="value"
8 |           item-value="abbreviation"
9 |           label="Brand"
10 |           variant="underlined"
11 |           return-object
12 |           hide-details
13 |           prepend-inner-icon="mdi-filter"
14 |           :disabled="props.loading || sourcesStore.isLoading"
15 |           :loading="sourcesStore.isLoading && !brandsFromStore.length"/>
16 |     </div>
17 |     <div class="filter-item">
18 |       <v-select
19 |           v-model="localSort"
20 |           :items="sortOptions"
21 |           item-title="text"
22 |           item-value="value"
23 |           label="Sort by"
24 |           variant="underlined"
25 |           hide-details
26 |           prepend-inner-icon="mdi-sort"
27 |           :disabled="props.loading"
28 |       />
29 |     </div>
30 | 
31 |     <div class="filter-item">
32 |       <v-autocomplete
33 |           v-model="localCountries"
34 |           :items="countriesFromStore" item-title="value" item-value="abbreviation" label="Country Selection"
35 |           variant="underlined"
36 |           hide-details
37 |           multiple
38 |           chips
39 |           closable-chips
40 |           prepend-inner-icon="mdi-filter"
41 |           :disabled="props.loading || sourcesStore.isLoading"
42 |           :loading="sourcesStore.isLoading && !countriesFromStore.length"/>
43 |     </div>
44 | 
45 |     <div class="filter-item">
46 |       <v-select
47 |           v-model="localStatus"
48 |           :items="filterOptions"
49 |           item-title="text"
50 |           item-value="value"
51 |           label="Filter by"
52 |           variant="underlined"
53 |           hide-details
54 |           prepend-inner-icon="mdi-filter"
55 |           :disabled="props.loading"
56 |       />
57 |     </div>
58 | 
59 |     <div class="filter-item search-field">
60 |       <v-text-field
61 |           v-model="localSearch"
62 |           placeholder="Search..."
63 |           prepend-inner-icon="mdi-magnify"
64 |           variant="underlined"
65 |           hide-details
66 |           flat
67 |           single-line
68 |           clearable
69 |           :disabled="props.loading"
70 |       />
71 |     </div>
72 | 
73 |     <div class="filter-item create-button">
74 |       <create-mediaplan-button :disabled="props.loading"/>
75 |     </div>
76 |   </div>
77 | </template>
78 | 
79 | <script setup lang="ts">
80 | import {computed} from 'vue';
81 | import type {MediaplanFilter, Brand, Source} from '@/types';
82 | import CreateMediaplanButton from "@/components/overview/CreateMediaplanButton.vue";
83 | import {useSourcesStore} from '@/stores/sourcesStore';
84 | 
85 | const sourcesStore = useSourcesStore();
86 | 
87 | const props = defineProps<{
88 |   filters: MediaplanFilter;
89 |   loading: boolean;
90 |   sortBy: string;
91 |   sortOrder: 'asc' | 'desc';
92 | }>();
93 | 
94 | const emit = defineEmits<{
95 |   (e: 'update:filter', payload: { key: keyof MediaplanFilter; value: unknown }): void;
96 |   (e: 'update:sort', payload: { sortBy: string; sortOrder: 'asc' | 'desc' }): void;
97 | }>();
98 | 
99 | const sortOptions = [
100 |   {text: 'Last updated first', value: 'updated_at:desc'},
101 |   {text: 'Earliest Start Date first', value: 'start_date:asc'},
102 |   {text: 'Budget Lowest First', value: 'budget.total:asc'}
103 | ];
104 | const filterOptions = [
105 |   {text: 'All', value: ''},
106 |   {text: 'Created by me', value: 'created_by_me'},
107 |   {text: 'For Approval', value: 'for_approval'}
108 | ];
109 | 
110 | const localSearch = computed({
111 |   get: () => props.filters.search || '',
112 |   set: v => emit('update:filter', {key: 'search', value: v})
113 | });
114 | const localBrandId = computed({
115 |   get: () => props.filters.brand_id || null,
116 |   set: v => emit('update:filter', {key: 'brand_id', value: v})
117 | });
118 | const localStatus = computed({
119 |   get: () => props.filters.status || '',
120 |   set: v => emit('update:filter', {key: 'status', value: v})
121 | });
122 | const localCountries = computed<string[]>({
123 |   get: () => props.filters.country ? (props.filters.country as string).split(',') : [],
124 |   set: arr => emit('update:filter', {key: 'country', value: arr.join(',')})
125 | });
126 | const localSort = computed({
127 |   get: () => `${props.sortBy}:${props.sortOrder}`,
128 |   set: v => {
129 |     const [by, order] = v.split(':') as [string, 'asc' | 'desc'];
130 |     emit('update:sort', {sortBy: by, sortOrder: order});
131 |   }
132 | });
133 | 
134 | const brandsFromStore = computed((): Brand[] => {
135 |   return (sourcesStore.getSourceList('brand') as Brand[] | undefined) || [];
136 | });
137 | 
138 | const countriesFromStore = computed((): Source[] => {
139 |   return (sourcesStore.getSourceList('country') as Source[] | undefined) || [];
140 | });
141 | 
142 | </script>
143 | 
144 | <style scoped>
145 | .filter-container {
146 |   display: flex;
147 |   flex-wrap: wrap;
148 |   gap: 16px;
149 |   align-items: center;
150 |   width: 100%;
151 | }
152 | 
153 | .filter-item {
154 |   min-width: 180px;
155 | }
156 | 
157 | .search-field {
158 |   flex-grow: 1;
159 |   min-width: 200px;
160 |   max-width: 280px;
161 | }
162 | 
163 | .create-button {
164 |   margin-left: auto;
165 |   min-width: auto;
166 | }
167 | 
168 | @media (max-width: 1200px) {
169 |   .filter-item {
170 |     min-width: 160px;
171 |   }
172 | }
173 | 
174 | @media (max-width: 960px) {
175 |   .filter-container {
176 |     grid-template-columns: 1fr 1fr;
177 |   }
178 | 
179 |   .filter-item {
180 |     min-width: 140px;
181 |   }
182 | 
183 |   .search-field {
184 |     flex-basis: 100%;
185 |     order: 5;
186 |   }
187 | 
188 |   .create-button {
189 |     margin-left: 0;
190 |     flex-basis: 100%;
191 |     order: 6;
192 |     display: flex;
193 |     justify-content: flex-end;
194 |   }
195 | }
196 | 
197 | @media (max-width: 600px) {
198 |   .filter-item {
199 |     flex-basis: 100%;
200 |   }
201 | }
202 | </style>
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
102 |   router.push({name: 'MediaplanDetail', params: {mediaplanId}});
103 | };
104 | 
105 | </script>
106 | 
107 | 
108 | <style scoped>
109 | .mediaplan-col {
110 |   min-width: 300px; /* Etwas kleiner für bessere Anpassung */
111 |   /* max-width: 420px; */ /* Max-Breite kann oft weggelassen werden, wenn cols gesetzt sind */
112 | }
113 | 
114 | .d-flex {
115 |   display: flex;
116 | }
117 | 
118 | .flex-grow-1 {
119 |   flex-grow: 1;
120 | }
121 | </style>
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
2 | import {computed, ref} from 'vue';
3 | import type {Campaign} from '@/types/campaigns'; // Corrected path
4 | import {useRouter} from 'vue-router';
5 | import {campaignHeaders} from "@/constants/campaign";
6 | import {formatDate} from '@/helpers/dateUtils';
7 | import type {VDataTableServer} from 'vuetify/components/VDataTable';
8 | import {getBrandLogo} from "@/helpers/brandUtils.ts";
9 | 
10 | type ReadonlyHeaders = VDataTableServer['$props']['headers'];
11 | type Options = VDataTableServer['$props']['options']; // Type for options
12 | 
13 | // --- Props (Restored original props) ---
14 | interface Props {
15 |   items: Campaign[];
16 |   totalCampaigns: number;
17 |   isLoading: boolean;
18 |   currentPage: number; // 0-basiert
19 |   itemsPerPage: number;
20 |   type?: 'multi' | 'single';
21 |   modelValue?: string[]; // For selection checkboxes
22 |   mediaplanId: string;   // Needed for links
23 | }
24 | 
25 | const props = withDefaults(defineProps<Props>(), {
26 |   type: 'multi',
27 |   modelValue: () => []
28 | });
29 | 
30 | // --- Emits (Original emits) ---
31 | const emit = defineEmits<{
32 |   (e: 'addCampaign'): void;
33 |   (e: 'update:options', options: Options): void; // Event für Parent zum Aktualisieren
34 |   (e: 'editCampaign', campaign: Campaign): void;
35 |   (e: 'deleteCampaign', campaign: Campaign): void;
36 |   (e: 'update:modelValue', selectedIds: string[]): void; // For selection
37 | }>();
38 | 
39 | // --- Router (unverändert) ---
40 | const router = useRouter();
41 | 
42 | // --- Tabelle Models & Header ---
43 | const pageModel = computed({
44 |   get: () => props.currentPage + 1,
45 |   // SET: (Nicht implementiert wie gewünscht)
46 | });
47 | 
48 | const itemsPerPageModel = computed({
49 |   get: () => props.itemsPerPage,
50 |   // SET: (Nicht implementiert wie gewünscht)
51 | });
52 | 
53 | const selectedCampaigns = computed({
54 |   get: () => props.modelValue,
55 |   set: (value) => {
56 |     emit('update:modelValue', value);
57 |   }
58 | });
59 | 
60 | // --- Methoden ---
61 | const onOptionsUpdate = (options: Options) => {
62 |   emit('update:options', options);
63 | };
64 | 
65 | const triggerAddCampaign = () => {
66 |   emit('addCampaign');
67 | };
68 | const editCampaign = (item: Campaign) => {
69 |   emit('editCampaign', item);
70 | };
71 | const deleteCampaign = (item: Campaign) => {
72 |   emit('deleteCampaign', item);
73 | };
74 | 
75 | // Add missing method stubs
76 | const editProject = (item: Campaign) => {
77 |   console.log('Edit project:', item);
78 |   // TODO: Implement edit project logic
79 | };
80 | 
81 | // --- UI Steuerung ---
82 | const hideFooter = computed(() => props.type === 'single');
83 | const itemsPerPageOptions = computed(() => props.type === 'single' ? [] : [15, 30, 50, 100]);
84 | 
85 | // --- Funktion zum Erstellen des Detail-Links (unverändert) ---
86 | const getCampaignDetailRoute = (campaign: Campaign) => {
87 |   if (!props.mediaplanId || !campaign.pid || !campaign._id) {
88 |     console.warn('Missing IDs for campaign detail route', props.mediaplanId, campaign.pid, campaign._id);
89 |     return {};
90 |   }
91 |   return {
92 |     name: 'LineitemDetail', // Assuming this is the correct route name
93 |     params: {
94 |       mediaplanId: props.mediaplanId,
95 |       projectId: campaign.pid,
96 |       campaignId: campaign._id
97 |     }
98 |   };
99 | };
100 | 
101 | </script>
102 | 
103 | <template>
104 | 
105 |   <div class="campaign-list-container">
106 |     <v-card class="campaigns-table elevation-1">
107 |       <v-data-table-server
108 |           v-model="selectedCampaigns"
109 |           v-model:items-per-page="itemsPerPageModel"
110 |           v-model:page="pageModel"
111 |           :headers="campaignHeaders"
112 |           :items="props.items"
113 |           :items-length="props.totalCampaigns"
114 |           :loading="props.isLoading"
115 |           :items-per-page-options="itemsPerPageOptions"
116 |           item-value="_id"
117 |           hover
118 |           class="campaigns-data-table"
119 |           :hide-default-footer="hideFooter"
120 |           :hide-default-header="hideFooter"
121 |           @update:options="onOptionsUpdate"
122 |       >
123 |         <template v-slot:item.campaignname="{ item }">
124 |           <router-link
125 |               :to="getCampaignDetailRoute(item)"
126 |               v-if="item.campaignname && type==='multi'"
127 |               class="name-link d-flex align-center"
128 |               @click.stop>
129 |             {{ item.campaignname }}
130 |           </router-link>
131 |           <div class="d-flex align-center" v-else-if="item.campaignname">
132 |             <span>{{ item.campaignname }}</span>
133 |           </div>
134 |         </template>
135 | 
136 | 
137 |         <template v-slot:item.actions="{ item }">
138 |           <v-btn icon density="compact" size="small" variant="text" @click.stop="openEditProject(item)" class="mr-2">
139 |             <v-icon>mdi-pencil-outline</v-icon>
140 |             <v-tooltip activator="parent" location="top">Edit Campaign</v-tooltip>
141 |           </v-btn>
142 |           <v-menu>
143 |             <template v-slot:activator="{ props: menuProps }">
144 |               <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
145 |             </template>
146 |             <v-list density="compact">
147 |               <v-list-item @click.stop="() => console.log('Edit Campaign:', item._id)">
148 |                 <v-list-item-title>Edit</v-list-item-title>
149 |               </v-list-item>
150 |               <v-list-item @click.stop="() => console.log('Delete Campaign:', item._id)" class="text-error">
151 |                 <v-list-item-title>Delete</v-list-item-title>
152 |               </v-list-item>
153 |             </v-list>
154 |           </v-menu>
155 |         </template>
156 |         <template v-slot:loading>
157 |           <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
158 |         </template>
159 |         <template v-slot:no-data>
160 |           <div class="text-center pa-4">No campaigns found.</div>
161 |         </template>
162 | 
163 |         <template v-slot:bottom v-if="props.type === 'multi'">
164 |           <div class="d-flex align-center pa-4 bg-grey-lighten-2">
165 |             <v-btn
166 |                 prepend-icon="mdi-plus"
167 |                 variant="text" color="black" @click="triggerAddCampaign"
168 |                 :disabled="props.isLoading"
169 |                 class="black-text-button">
170 |               Add Campaign
171 |             </v-btn>
172 |             <v-spacer></v-spacer>
173 |           </div>
174 |         </template>
175 |       </v-data-table-server>
176 |     </v-card>
177 |   </div>
178 | </template>
179 | 
180 | <style scoped>
181 | </style>
```

src/components/project/EditOrCreateProjectDialog.vue
```
1 | <template>
2 |   <v-dialog :model-value="modelValue" max-width="550px" persistent @update:model-value="close">
3 |     <v-card class="pa-6">
4 |       <DialogHeader
5 |           :title="isEdit ? 'Edit Project Data' : 'Create New Project'"
6 |           :show-close-button="true"
7 |           @close="close"
8 |           :show-back-button="false"
9 |       />
10 | 
11 |       <v-form ref="form" @submit.prevent="onSubmit" v-model="isFormValid" validate-on="input">
12 |         <WithFormDefaults>
13 |           <!-- Country & Language -->
14 |           <CountryLanguageSelector v-model="countryLanguage"/>
15 |           <!-- Date Range -->
16 |           <FormElementVrowVcol label="Start date - End date" required>
17 |             <DateRangePicker
18 |                 id="date-range"
19 |                 v-model="dateRange"
20 |                 placeholder="Select start and end dates"
21 |                 :rules="[required]"
22 |                 dialog-title="Choose a date range"
23 |                 @update:model-value="handleDateRangeChange"
24 |             />
25 |           </FormElementVrowVcol>
26 | 
27 |           <FormElementVrowVcol label="PO Number">
28 |             <v-select
29 |                 id="po-select"
30 |                 v-model="project.poNumber"
31 |                 :items="poNumbers"
32 |                 item-title="name"
33 |                 item-value="_id"
34 |                 placeholder="Select POs"
35 |                 :rules="[(v && v.length > 0) || 'At least one PO is required']"
36 |                 multiple
37 |                 chips
38 |                 closable-chips
39 |             />
40 |           </FormElementVrowVcol>
41 | 
42 |           <FormElementVrowVcol label="Builder" required>
43 |             <v-select
44 |                 v-model="project.builder"
45 |                 :items="builders"
46 |                 item-title="name"
47 |                 item-value="code"
48 |                 placeholder="Select Builder"
49 |                 :rules="[required]"
50 |             />
51 |           </FormElementVrowVcol>
52 | 
53 |           <FormElementVrowVcol label="Campaign Type" required>
54 |             <v-select
55 |                 v-model="project.campaignType"
56 |                 :items="campaignTypes"
57 |                 item-title="name"
58 |                 item-value="code"
59 |                 placeholder="Select Campaign Type"
60 |                 :rules="[required]"
61 |             />
62 |           </FormElementVrowVcol>
63 | 
64 |           <FormElementVrowVcol label="Phase" required>
65 |             <v-select
66 |                 v-model="project.phase"
67 |                 :items="phases"
68 |                 item-title="name"
69 |                 item-value="code"
70 |                 placeholder="Select Phase"
71 |                 :rules="[required]"
72 |             />
73 |           </FormElementVrowVcol>
74 | 
75 |           <FormElementVrowVcol label="Goal" required>
76 |             <v-select
77 |                 v-model="project.goal"
78 |                 :items="goals"
79 |                 item-title="name"
80 |                 item-value="code"
81 |                 placeholder="Select Goal"
82 |                 :rules="[required]"
83 |             />
84 |           </FormElementVrowVcol>
85 | 
86 |           <FormElementVrowVcol label="Budget">
87 |             <FormattedCurrencyInput
88 |                 v-model="project.budget"
89 |                 suffix="€"
90 |                 :decimal="'comma'"
91 |                 :allowDecimals="true"
92 |                 outlined
93 |                 density="compact"
94 |                 hide-details="auto"
95 |             />
96 |           </FormElementVrowVcol>
97 | 
98 |           <DialogFooter
99 |               class="mt-5"
100 |               cancel-text="Cancel"
101 |               :confirm-text="isEdit ? 'Save' : 'Create'"
102 |               :disabled="!isFormValid"
103 |               @cancel="close"
104 |               @confirm="onSubmit"
105 |           />
106 |         </WithFormDefaults>
107 | 
108 |       </v-form>
109 |     </v-card>
110 |   </v-dialog>
111 | </template>
112 | 
113 | <script setup lang="ts">
114 | import {ref, onMounted, computed} from 'vue';
115 | import type {Project} from '@/types/project';
116 | import type {ProjectCountry} from '@/types/project'; // already imported in your other dialog
117 | 
118 | import {useProjectStore} from '@/stores/projectStore';
119 | import {showSuccess, showError} from '@/helpers/notificationUtils';
120 | import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
121 | import DateRangePicker from "@/components/overview/DateRangePicker.vue";
122 | import DialogHeader from "@/components/common/dialog/DialogHeader.vue";
123 | import DialogFooter from "@/components/common/dialog/DialogFooter.vue";
124 | import CountryLanguageSelector from "@/components/common/dialog/CountryLanguageSelector.vue";
125 | import WithFormDefaults from "@/components/common/dialog/WithFormDefaults.vue";
126 | import FormattedCurrencyInput from "@/components/common/FormattedCurrencyInput.vue";
127 | 
128 | const props = defineProps<{
129 |   modelValue: boolean;
130 |   isEdit?: boolean;
131 |   initialData?: Project;
132 | }>();
133 | 
134 | const emit = defineEmits<{
135 |   (e: 'update:modelValue', value: boolean): void;
136 |   (e: 'saved', project: Project): void;
137 | }>();
138 | 
139 | const form = ref<any>(null);
140 | const isFormValid = ref(false);
141 | const projectStore = useProjectStore();
142 | 
143 | const required = (v: any) => !!v || 'Required';
144 | 
145 | // Separate "shallow" editable model
146 | const project = ref<Partial<Project>>({
147 |   startDate: '',
148 |   endDate: '',
149 |   poNumber: '',
150 |   builder: null,
151 |   campaignType: null,
152 |   phase: null,
153 |   goal: null,
154 |   budget: undefined
155 | });
156 | 
157 | const countryLanguage = ref<{
158 |   country: ProjectCountry | null;
159 |   language: string | null;
160 | }>({
161 |   country: null,
162 |   language: null
163 | });
164 | 
165 | const dateRange = ref<[string, string] | null>(null);
166 | 
167 | const handleDateRangeChange = ([start, end]: [string, string]) => {
168 |   project.value.startDate = start;
169 |   project.value.endDate = end;
170 | };
171 | 
172 | const close = () => emit('update:modelValue', false);
173 | import { watch } from 'vue'
174 | 
175 | watch(
176 |     () => props.initialData,
177 |     (newData) => {
178 |       if (props.isEdit && newData) {
179 |         const startDate = newData.duration?.start_date ?? '';
180 |         const endDate = newData.duration?.end_date ?? '';
181 | 
182 |         project.value = {
183 |           startDate,
184 |           endDate,
185 |           poNumber: newData.descriptive_vars?.bmwponumber ?? '',
186 |           builder: newData.builder ?? null,
187 |           campaignType: newData.default_vars?.campaigntype ?? '',
188 |           phase: newData.phase ?? '',
189 |           goal: newData.goal ?? '',
190 |           budget: newData.budget?.total ?? undefined,
191 |         };
192 | 
193 |         dateRange.value = [startDate, endDate];
194 | 
195 |         countryLanguage.value = {
196 |           country: newData.descriptive_vars?.country
197 |               ? { name: newData.descriptive_vars.country, code: newData.descriptive_vars.country }
198 |               : null,
199 |           language: newData.default_vars?.language ?? ''
200 |         };
201 |       }
202 |     },
203 |     { immediate: true } // Trigger the watcher also on component mount
204 | );
205 | onMounted(async () => {
206 |   await projectStore.fetchProjectOptions();
207 | /*  console.log(props.initialData, 'props.initialData')
208 |   if (!(props.isEdit && props.initialData)) {
209 |     return;
210 |   }
211 |   project.value = {
212 |     ...props.initialData,
213 |     poNumber: props.initialData.descriptive_vars?.bmwponumber || '',
214 |     budget: props.initialData.budget,
215 |     startDate: props.initialData.duration?.start_date || '',
216 |     endDate: props.initialData.duration?.end_date || ''
217 |   };
218 |   countryLanguage.value = {
219 |     country: {
220 |       name: props.initialData.descriptive_vars.country,
221 |       code: props.initialData.descriptive_vars.country // fallback
222 |     },
223 |     language: props.initialData.default_vars.language
224 |   };
225 |   dateRange.value = [project.value.startDate, project.value.endDate];*/
226 | });
227 | 
228 | const builders = computed(() => projectStore.builders);
229 | const campaignTypes = computed(() => projectStore.campaignTypes);
230 | const phases = computed(() => projectStore.phases);
231 | const goals = computed(() => projectStore.goals);
232 | const poNumbers = computed(() => projectStore.poNumbers);
233 | 
234 | const onSubmit = async () => {
235 |   const isValid = await form.value.validate();
236 |   if (!isValid) return;
237 | 
238 |   try {
239 |     const payload: Partial<Project> = {
240 |       ...project.value,
241 |       duration: {
242 |         start_date: project.value.startDate!,
243 |         end_date: project.value.endDate!,
244 |         formatted: '' // add formatted logic here if needed
245 |       },
246 |       descriptive_vars: {
247 |         country: countryLanguage.value.country?.code || '',
248 |         bmwponumber: project.value.poNumber || '',
249 |         brand: '',
250 |         adobecampaignname: '',
251 |         campaigntype: '',
252 |         projectname: '',
253 |         subsegment: '',
254 |         year: new Date().getFullYear()
255 |       },
256 |       default_vars: {
257 |         language: countryLanguage.value.language || '',
258 |         campaigntype: project.value.campaignType || '',
259 |         subsegment: '',
260 |         adtype: '',
261 |         dimension: '',
262 |         targeturls: null,
263 |         campaigndetail: null
264 |       }
265 |     };
266 | 
267 |     const result = props.isEdit
268 |         ? await projectStore.updateProject(payload)
269 |         : await projectStore.createProject(payload);
270 | 
271 |     showSuccess(`Project ${props.isEdit ? 'updated' : 'created'} successfully`);
272 |     emit('saved', result);
273 |     close();
274 |   } catch (err: any) {
275 |     showError(err?.message || 'Operation failed');
276 |   }
277 | };
278 | </script>
```

src/components/project/ProjectDetailTable.vue
```
1 | <script setup lang="ts">
2 | import { computed } from 'vue'
3 | import CountryFlag from '@/components/common/CountryFlag.vue'
4 | import { getBrandLogo } from '@/helpers/brandUtils'
5 | import type { Project } from '@/types/project'
6 | import { projectHeaders } from '@/constants/project.ts'
7 | 
8 | const props = defineProps<{ project: Project }>()
9 | const items = computed(() => props.project ? [props.project] : [])
10 | 
11 | const editProject = (project: Project) => {
12 |   console.log('Edit project:', project._id);
13 |   // Navigation zur Edit-Seite oder Dialog öffnen
14 |   // router.push({ name: 'ProjectEdit', params: { mediaplanId: props.mediaplanId, projectId: project._id } });
15 | };
16 | </script>
17 | 
18 | <template>
19 |   <v-card class="projects-table elevation-0" variant="flat">
20 |     <v-theme-provider theme="dark">
21 |       <v-data-table
22 |           :headers="projectHeaders"
23 |           :items="items"
24 |           class="projects-data-table project-detail-table"
25 |           hide-default-footer
26 |           hide-default-header
27 |           item-value="_id"
28 |           density="compact"
29 |       >
30 | 
31 |         <template #item.abbreviation="{ item }">
32 |           <div class="d-flex align-center">
33 |             <v-avatar size="32" class="mr-2 grey lighten-4" :image="getBrandLogo(item.descriptive_vars?.brand)" />
34 |             <span>{{ item.abbreviation }} </span>
35 |           </div>
36 |         </template>
37 | 
38 |         <template #item.descriptive_vars.country="{ item }">
39 |           <div class="d-flex align-center" v-if="item.descriptive_vars?.country">
40 |             <CountryFlag size="1rem" :country="item.descriptive_vars.country" class="mr-2" />
41 |             <span>{{ item.descriptive_vars.country }}</span>
42 |           </div>
43 |         </template>
44 | 
45 |         <template #item.duration.formatted="{ item }">
46 |           <div class="d-flex align-center" v-if="item.duration?.formatted">
47 |             <v-icon size="small" class="mr-2">mdi-calendar-range</v-icon>
48 |             <span>{{ item.duration.formatted }}</span>
49 |           </div>
50 |         </template>
51 | 
52 |         <template #item.detail="{ item }">
53 |           <span class="d-inline-block text-truncate" style="max-width: 150px;">{{ item.detail || 'N/A' }}</span>
54 |           <v-tooltip v-if="item.detail && item.detail.length > 30" activator="parent" location="top">
55 |             {{ item.detail }}
56 |           </v-tooltip>
57 |         </template>
58 | 
59 |         <template #item.default_vars.campaigntype="{ item }">
60 |           {{ item.default_vars?.campaigntype || 'N/A' }}
61 |         </template>
62 | 
63 |         <template #item.default_vars.subsegment="{ item }">
64 |           {{ item.default_vars?.subsegment || 'N/A' }}
65 |         </template>
66 | 
67 |         <template #item.is_locked="{ item }">
68 |           <v-icon :color="item.is_locked ? 'orange' : 'grey-lighten-1'">
69 |             {{ item.is_locked ? 'mdi-lock' : 'mdi-lock-open-variant' }}
70 |           </v-icon>
71 |           <v-tooltip activator="parent" location="top">{{ item.is_locked ? 'Locked' : 'Unlocked' }}</v-tooltip>
72 |         </template>
73 |         <template v-slot:item.actions="{ item }">
74 |           <v-btn icon density="compact" size="small" variant="text" @click.stop="editProject(item)">
75 |             <v-icon>mdi-pencil-outline</v-icon>
76 |             <v-tooltip activator="parent" location="top">Edit Project</v-tooltip>
77 |           </v-btn>
78 |           <v-menu>
79 |             <template v-slot:activator="{ props: menuProps }">
80 |               <v-btn icon="mdi-dots-vertical" variant="text" density="comfortable" v-bind="menuProps"></v-btn>
81 |             </template>
82 |             <v-list density="compact">
83 |               <v-list-item @click.stop="editProject(item)">
84 |                 <v-list-item-title>Edit</v-list-item-title>
85 |               </v-list-item>
86 |               <v-list-item @click.stop="() => console.log('Delete Project:', item._id)" class="text-error">
87 |                 <v-list-item-title>Delete</v-list-item-title>
88 |               </v-list-item>
89 |             </v-list>
90 |           </v-menu>
91 |         </template>
92 |       </v-data-table>
93 |     </v-theme-provider>
94 |   </v-card>
95 | </template>
96 | 
97 | <style scoped>
98 | /* Increase vertical spacing in the row */
99 | ::v-deep(.project-detail-table .v-data-table__td) {
100 |   padding-top: 6px !important;
101 |   padding-bottom: 6px !important;
102 | }
103 | </style>
```

src/components/common/dialog/BudgetProgress.vue
```
1 | <template>
2 |   <v-row no-gutters align="center" class="budget-progress-row">
3 |     <v-col class="budget-progress-bar-col">
4 |       <v-progress-linear
5 |           :model-value="progressBarValue"
6 |           :color="progressColor"
7 |           rounded="pill"
8 |           :bg-color="bgColor" height="6"
9 |           bg-opacity=".8"
10 |           style="min-width: 42px"
11 |       ></v-progress-linear>
12 |     </v-col>
13 |     <v-col cols="auto" class="budget-progress-text-col pl-2">
14 |       {{ formattedDisplayPercentage }}
15 |     </v-col>
16 |   </v-row>
17 | </template>
18 | 
19 | <script setup lang="ts">
20 | import { computed } from 'vue';
21 | import {formatPercentage, percentage} from "@/helpers/format.ts";
22 | 
23 | // --- Props ---
24 | 
25 | interface Props {
26 |   usedBudget: number | null | undefined;
27 |   totalBudget: number | null | undefined;
28 |   color?: string; // Color for the active progress bar
29 |   bgColor?: string; // New prop for the background color
30 | }
31 | 
32 | // Definieren der Props mit Standardwerten
33 | const props = withDefaults(defineProps<Props>(), {
34 |   usedBudget: undefined,
35 |   totalBudget: undefined,
36 |   color: 'success',
37 |   bgColor: 'white', // Default background color set to white
38 | });
39 | 
40 | // --- Computed Properties ---
41 | 
42 | // Value for the progress bar (0-100)
43 | const progressBarValue = computed<number>(() => {
44 |   const usedNum = Number(props.usedBudget ?? 0);
45 |   const totalNum = Number(props.totalBudget ?? 0);
46 |   const rawPercent = percentage(usedNum, totalNum);
47 |   if (isNaN(rawPercent)) {
48 |     return 0;
49 |   }
50 |   return Math.min(100, Math.max(0, rawPercent));
51 | });
52 | 
53 | // Formatted percentage string (e.g., "75,00 %")
54 | const formattedDisplayPercentage = computed<string>(() => {
55 |   const usedNum = Number(props.usedBudget ?? 0);
56 |   const totalNum = Number(props.totalBudget ?? 0);
57 |   return formatPercentage(usedNum, totalNum);
58 | });
59 | 
60 | // Color for the active part of the progress bar
61 | const progressColor = computed<string>(() => props.color);
62 | 
63 | // Background color for the progress bar track (directly from props)
64 | // We don't strictly need a computed prop here as we use the prop directly
65 | // in the template, but if needed for logic, it would be:
66 | // const backgroundColor = computed<string>(() => props.bgColor);
67 | // However, :bg-color="bgColor" in the template is sufficient.
68 | 
69 | </script>
70 | 
71 | <style scoped>
72 | /* Styles remain unchanged */
73 | .budget-progress-row {
74 |   flex-wrap: nowrap;
75 |   width: 100%;
76 | }
77 | 
78 | .budget-progress-bar-col {
79 |   flex-grow: 1;
80 |   flex-shrink: 1;
81 |   overflow: hidden;
82 | }
83 | 
84 | .budget-progress-text-col {
85 |   flex-shrink: 0;
86 |   white-space: nowrap;
87 | }
88 | </style>
```

src/components/common/dialog/CountryLanguageSelector.vue
```
1 | <!-- src/components/common/form/CountryLanguageSelector.vue -->
2 | <template>
3 |   <v-row>
4 |     <v-col>
5 | 
6 |       <FormElementVrowVcol label="Country" required>
7 |         <v-select
8 |             v-model="selectedCountry"
9 |             :items="countries"
10 |             item-title="name"
11 |             item-value="code"
12 |             placeholder="Select Country"
13 |             return-object
14 |             :rules="[required]"
15 |             :loading="loading"
16 |         >
17 |           <template v-slot:selection="{ item }">
18 |             <div class="d-flex align-center">
19 |               <country-flag :country="item.raw.code" class="mr-2" size="1rem"/>
20 |               {{ item.raw.code }} - {{ item.raw.name }}
21 |             </div>
22 |           </template>
23 |           <template v-slot:item="{ item, props }">
24 |             <v-list-item v-bind="props" :title="`${item.raw.code} - ${item.raw.name}`">
25 |               <template v-slot:prepend>
26 |                 <country-flag :country="item.raw.code" class="mr-2" size="1rem"/>
27 |               </template>
28 |             </v-list-item>
29 |           </template>
30 |         </v-select>
31 |       </FormElementVrowVcol>
32 |     </v-col>
33 |     <v-col>
34 |       <FormElementVrowVcol label="Language" required>
35 |         <v-select
36 |             v-model="selectedLanguage"
37 |             :items="filteredLanguages"
38 |             item-title="name"
39 |             item-value="code"
40 |             placeholder="Select Language"
41 |             persistent-hint
42 |             hint="*Depends on Country"
43 |             :rules="[required]"
44 |             :disabled="!selectedCountry"
45 |             :loading="loading"
46 |         />
47 |       </FormElementVrowVcol>
48 |     </v-col>
49 |   </v-row>
50 | </template>
51 | 
52 | <script setup lang="ts">
53 | import {ref, computed, watch, onMounted} from 'vue';
54 | import {useProjectStore} from '@/stores/projectStore';
55 | import FormElementVrowVcol from "@/components/common/dialog/FormElementVrowVcol.vue";
56 | import CountryFlag from "@/components/common/CountryFlag.vue";
57 | 
58 | const emit = defineEmits<{
59 |   (e: 'update:modelValue', val: { country: any; language: string | null }): void;
60 | }>();
61 | 
62 | const props = defineProps<{
63 |   modelValue?: {
64 |     country: any;
65 |     language: string | null;
66 |   };
67 | }>();
68 | 
69 | const projectStore = useProjectStore();
70 | const loading = ref(false);
71 | 
72 | const selectedCountry = ref(props.modelValue?.country || null);
73 | const selectedLanguage = ref(props.modelValue?.language || null);
74 | 
75 | const required = (v: any) => !!v || 'Required';
76 | 
77 | const countries = computed(() => projectStore.countries);
78 | const allLanguages = computed(() => projectStore.languages);
79 | 
80 | const filteredLanguages = computed(() => {
81 |   if (!selectedCountry.value) return [];
82 |   return allLanguages.value.filter(lang => lang.country_codes?.includes(selectedCountry.value.code));
83 | });
84 | 
85 | watch([selectedCountry, selectedLanguage], () => {
86 |   emit('update:modelValue', {
87 |     country: selectedCountry.value,
88 |     language: selectedLanguage.value,
89 |   });
90 | });
91 | 
92 | watch(selectedCountry, (newVal, oldVal) => {
93 |   if (newVal?.code !== oldVal?.code) {
94 |     selectedLanguage.value = null;
95 |   }
96 | });
97 | 
98 | onMounted(async () => {
99 |   if (!projectStore.countries.length || !projectStore.languages.length) {
100 |     loading.value = true;
101 |     await projectStore.fetchProjectOptions();
102 |     loading.value = false;
103 |   }
104 | });
105 | </script>
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
26 |   },
27 |   VDialog: {
28 |     maxWidth: 450
29 |   }
30 | };
31 | </script>
```
