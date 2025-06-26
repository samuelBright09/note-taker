export interface Note {
    id: string;
    title: string;
    content: string;
    isArchived: boolean;
    createdAt: Date;
    editedAt?: Date;
    tags: string[];
}
