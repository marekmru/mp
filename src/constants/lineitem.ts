import type { VDataTableServer } from 'vuetify/components/VDataTable';

type ReadonlyHeaders = VDataTableServer['$props']['headers'];

// Headers für die Line Item Tabelle
export const lineitemHeaders: ReadonlyHeaders = [
    // Checkbox Spalte wird durch 'show-select' in v-data-table-server aktiviert, kein expliziter Header nötig,
    // aber wir können einen leeren Header für die Ausrichtung hinzufügen, falls gewünscht.
    // { title: '', key: 'data-table-select', sortable: false, width: '1rem' }, // Optional für Styling/Breite
    { title: 'Line Item Name', key: 'lineitemname', sortable: true, align: 'start' },
    { title: 'Product', key: 'product', sortable: true },
    { title: 'Phase', key: 'phase', sortable: true },
    { title: 'Goal', key: 'goals', sortable: true },
    { title: 'Tactic', key: 'targetingtactic', sortable: true },
    { title: 'Created', key: 'created_at', sortable: true },
    // { title: 'Updated', key: 'updated_at', sortable: true }, // Falls benötigt
    // { title: 'Creatives', key: 'creatives', sortable: false }, // Benötigt spezielle Darstellung
    { title: '', key: 'actions', sortable: false, align: 'center' } // Beispiel für Aktionen
];

// Stelle sicher, dass die 'key'-Werte mit den Feldern im LineItem-Objekt übereinstimmen.