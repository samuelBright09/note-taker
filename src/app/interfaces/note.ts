export interface Note {
    id: number;
    title: string;
    content: string;
    isArchived: boolean;
    createdAt: string;
    editedAt?: string;
    tags: string[];
}
