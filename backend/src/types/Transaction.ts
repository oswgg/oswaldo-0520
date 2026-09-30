export interface Transaction {
    id: string;
    userId: string;
    userEmail: string;
    amount: number;
    status: string;
    statusDetail: string;
    transactionId: string;
    cardNumber: string;
    cvv: string;
    dateCreated: string;
}
