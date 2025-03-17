// src/constants/mediaplanStatuses.ts

export interface MediaplanStatus {
    value: string;
    label: string;
    color: string;
}

export const MEDIAPLAN_STATUSES: Record<string, MediaplanStatus> = {
    IN_PLANNING: {
        value: 'in_planning',
        label: 'In Planning',
        color: 'blue'
    },
    DRAFT: {
        value: 'draft',
        label: 'Draft',
        color: 'grey'
    },
    FOR_APPROVAL: {
        value: 'for_approval',
        label: 'For Approval',
        color: 'amber'
    }
};

// Helper functions to use throughout the application
export const getMediaplanStatusValues = (): string[] => {
    return Object.values(MEDIAPLAN_STATUSES).map(status => status.value);
};

export const getMediaplanStatusColor = (statusValue: string): string => {
    const status = Object.values(MEDIAPLAN_STATUSES).find(s => s.value === statusValue);
    return status?.color || 'grey';
};

export const getMediaplanStatusLabel = (statusValue: string): string => {
    const status = Object.values(MEDIAPLAN_STATUSES).find(s => s.value === statusValue);
    return status?.label || 'draft';
};