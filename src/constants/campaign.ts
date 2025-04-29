// src/constants/campaign.ts
import {ref} from 'vue';

export const campaignHeaders = ref([
    {title: 'Campaign Name', key: 'campaignname', sortable: true, align: 'start'}, // Hinzugefügt
    {title: 'Product', key: 'product', sortable: true},
    {title: 'Lang', key: 'language', sortable: true},
    {title: 'Detail', key: 'campaigndetail', sortable: false},
/*    {title: 'Phase', key: 'phase', sortable: true},
    {title: 'Channel Type', key: 'channeltype', sortable: true},
    {title: 'Channel Name', key: 'channelname', sortable: true},*/
    {title: 'Goal', key: 'goal', sortable: true},
    {title: 'Tactic', key: 'tactic', sortable: true},
    {title: 'Device', key: 'device', sortable: true},
    {title: 'Budget', key: 'budget', sortable: false},
    {title: '', key: 'lock', sortable: false, align: 'center'},
    {title: '', key: 'actions', sortable: false, align: 'center'}
]);