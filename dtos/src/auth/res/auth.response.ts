export interface User {
    id: string;
    name: string;
    email: string;
    sessionCounter: number;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
}
