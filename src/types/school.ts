

export interface SchoolData {
    name: string;
    phone: string | null;
    email: string | null    ;
    address: string | null;
    logo: string | null;
    website: string | null;
}

export interface SchoolApiResponse {
    status: boolean;
    data: SchoolData;
    message?: string;
}

export interface FetchParams {
    endpoint: string;
    token?: string | null;
}