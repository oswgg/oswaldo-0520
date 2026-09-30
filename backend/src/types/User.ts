export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    balance: number;
    sessionCounter: number;
}
