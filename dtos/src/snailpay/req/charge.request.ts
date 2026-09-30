export interface ChargeRequest {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    fullName: string;
    amount: number;
}
