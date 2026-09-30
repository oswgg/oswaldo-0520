export interface ChargeResponse {
    id: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    date_created: string;
    authorization_code?: string;
    reference: string;
    payer_id: string;
    payer_email: string;
    cardNumber: string;
    cvv: string;
}
