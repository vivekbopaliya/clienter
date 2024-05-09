interface FolderDataTableProps {
    User: {
        name: string;
    } | null;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    parentFolderId?: string | null;
}

interface FileDataTableProps {
    User: {
        name: string;
    } | null;
    id: string;
    name: string;
    url: string;
    size: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    folderId: string | null;
}
    
export function isFolderData(data: FolderDataTableProps | FileDataTableProps | null): data is FolderDataTableProps {
        return (data !== null && typeof (data as FileDataTableProps).url === 'undefined');
}