// src/mocks/mediaplans.ts
import type { Mediaplan } from "../types/mediaplan.ts";
import { MEDIAPLAN_STATUSES, getMediaplanStatusValues } from "../constants/mediaplanStatuses";

export const mockMediaplans: Mediaplan[] = [
    {
        _id: "mp-001",
        name: "Campaign Launch Q1",
        status: MEDIAPLAN_STATUSES.IN_PLANNING.value,
        start_date: "2025-02-10T00:00:00Z",
        end_date: "2025-03-25T00:00:00Z",
        brand: {
            _id: "brand-001",
            name: "MINI"
        },
        budget: {
            total: 1250.00,
            used: 875.50,
            available: 374.50
        },
        po_numbers: [
            {
                _id: "po-001",
                name: "4700551823",
                value: 450.00
            },
            {
                _id: "po-002",
                name: "4700551911",
                value: 425.50
            }
        ],
        created_by: {
            _id: "user-002",
            name: "Alice Smith"
        },
        created_at: "2024-11-28T14:15:00Z",
        updated_at: "2024-12-05T09:30:00Z"
    },
    {
        _id: "mp-002",
        name: "Summer Promotion",
        status: MEDIAPLAN_STATUSES.DRAFT.value,
        start_date: "2025-06-01T00:00:00Z",
        end_date: "2025-08-31T00:00:00Z",
        brand: {
            _id: "brand-001",
            name: "MINI"
        },
        budget: {
            total: 2500.00,
            used: 180.20,
            available: 2319.80
        },
        po_numbers: [
            {
                _id: "po-003",
                name: "4700552045",
                value: 180.20
            }
        ],
        created_by: {
            _id: "user-003",
            name: "Bob Johnson"
        },
        created_at: "2024-12-03T11:00:00Z",
        updated_at: "2024-12-18T16:45:00Z"
    },
];

// Generate a larger dataset for testing pagination
export const generateMockMediaplans = (count: number = 50): Mediaplan[] => {
    const result: Mediaplan[] = [];
    const statuses = getMediaplanStatusValues();
    const userIds = ["user-001", "user-002", "user-003", "user-004"];
    const userNames = ["Fabian Krenzler", "Alice Smith", "Bob Johnson", "Charlie Brown"];
    const brandNames = ["MINI", "BMW", "Rolls-Royce"];  // Added more brands

    for (let i = 0; i < count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const userIndex = Math.floor(Math.random() * userIds.length);
        const brandIndex = Math.floor(Math.random() * brandNames.length);
        const totalBudget = Math.random() * (5000 - 500) + 500; // Random budget between 500 and 5000
        const usedBudget = Math.random() * totalBudget;      // Used budget up to total
        const availableBudget = totalBudget - usedBudget;
        const numPoNumbers = Math.floor(Math.random() * 3) + 1; // 1-3 PO numbers
        const poNumbers = [];
        let usedBudgetFromPo = 0;

        for (let j = 0; j < numPoNumbers; j++) {
            const poValue = Math.random() * (totalBudget - usedBudgetFromPo); //Ensure PO values don't go over budget.
            usedBudgetFromPo += poValue;
            poNumbers.push({
                _id: `po-${(i * numPoNumbers + j + 1).toString().padStart(3, '0')}`,
                name: `4700${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`, // More realistic PO number
                value: parseFloat(poValue.toFixed(2)),
            });
        }

        const creationDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1); // Random date in 2024
        const updateDate = new Date(creationDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000); // Updated up to 7 days later


        result.push({
            _id: `mp-${(i + 1).toString().padStart(3, '0')}`,
            name: `MP ${i + 1} - ${['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor(Math.random() * 4)]} Campaign`, //More descriptive names
            status: status,
            start_date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)+1).toISOString(),  //Random Start in 2025
            end_date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(), //Random End in 2025
            brand: {
                _id: `brand-${brandIndex.toString().padStart(3, '0')}`, //Consistent Brand IDs.
                name: brandNames[brandIndex]
            },
            budget: {
                total: parseFloat(totalBudget.toFixed(2)),
                used: parseFloat(usedBudget.toFixed(2)),
                available: parseFloat(availableBudget.toFixed(2))
            },
            po_numbers: poNumbers,
            created_by: {
                _id: userIds[userIndex],
                name: userNames[userIndex]
            },
            created_at: creationDate.toISOString(),
            updated_at: updateDate.toISOString()
        });
    }

    return result;
};

// Rest of the file remains unchanged
export interface MockApiResponse {
    items: Mediaplan[];
    total_items: number;
    total_pages: number;
    current_page: number;
}

export const mockFetchMediaplans = (
    page: number = 0,
    perPage: number = 25,
    filters: any = {},
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc'
): Promise<MockApiResponse> => {
    return new Promise((resolve) => {
        // Generate dataset if needed
        const allMediaplans = generateMockMediaplans(50);

        // Filter logic
        let filteredMediaplans = [...allMediaplans];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredMediaplans = filteredMediaplans.filter(mp =>
                mp.name.toLowerCase().includes(searchLower) ||
                mp.brand.name.toLowerCase().includes(searchLower) || // Search by Brand Name
                mp.po_numbers.some(po => po.name.toLowerCase().includes(searchLower)) //Search in PO Numbers.
            );
        }

        if (filters.status) {
            filteredMediaplans = filteredMediaplans.filter(mp =>
                mp.status === filters.status
            );
        }

        // Sorting logic
        if (sortBy) {
            filteredMediaplans.sort((a: any, b: any) => {
                const valueA = a[sortBy] || '';
                const valueB = b[sortBy] || '';

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return sortOrder === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }  else if (sortBy.startsWith('budget.')) {
                    // Handle nested budget sorting
                    const budgetField = sortBy.split('.')[1];
                    return sortOrder === 'asc'
                        ? (a.budget[budgetField] - b.budget[budgetField])
                        : (b.budget[budgetField] - a.budget[budgetField]);

                } else {
                    return sortOrder === 'asc'
                        ? (valueA - valueB)
                        : (valueB - valueA);
                }
            });
        }

        // Pagination
        const totalItems = filteredMediaplans.length;
        const totalPages = Math.ceil(totalItems / perPage);
        const startIndex = page * perPage;
        const endIndex = Math.min(startIndex + perPage, totalItems);
        const paginatedItems = filteredMediaplans.slice(startIndex, endIndex);

        // Simulate network delay
        setTimeout(() => {
            resolve({
                items: paginatedItems,
                total_items: totalItems,
                total_pages: totalPages,
                current_page: page
            });
        }, 300); // 300ms delay to simulate network
    });
};