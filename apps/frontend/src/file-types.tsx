export interface FileItem {
    id: string;
    name: string;
    path: string;
    size: number;
    type: string;
    lastModified: Date;
    thumbnail?: string;
}

export interface FolderItem {
    id: string;
    name: string;
    path: string;
    items: number;
}

export type FileType = "video" | "image" | "document" | "other";

export interface FileBrowserProps {
    onFileSelect?: (file: FileItem) => void;
    allowedExtensions?: string[];
    multiple?: boolean;
    showPreview?: boolean;
}

export interface FileListProps {
    files: FileItem[];
    onFileSelect: (file: FileItem) => void;
    selectedFileId?: string;
}
