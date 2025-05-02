// src/constants/campaign.ts
import {ref} from 'vue';

export const campaignHeaders = ref([
    {title: 'Campaign Name', key: 'campaignname', sortable: true, align: 'start'}, // Hinzugefügt
    {title: 'Budget', key: 'budget', sortable: false},
    {title: '', key: 'lock', sortable: false, align: 'center'},
    { title: '', key: 'actions', sortable: false, align: 'center' }
]);