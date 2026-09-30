// Tipos específicos del frontend
// La mayoría de los tipos vienen del paquete @oswaldo/dtos

export interface FrontendUser {
    id: string;
    name: string;
    email: string;
    balance: number;
    sessionCounter: number;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}
