
export interface IListBooks {
    message: string;
    data:    Datum[];
}

//interface for user book details 
export interface Datum {
    id:              string;
    title:           string;
    author:          string;
    description:     string;
    summary:         string;
    publicationDate: Date | null;
    createdBy:       string;
    updatedBy:       null;
    deletedBy:       null;
    createdAt:       Date;
    updatedAt:       Date;
    deletedAt:       null;
    files:           any[];
}