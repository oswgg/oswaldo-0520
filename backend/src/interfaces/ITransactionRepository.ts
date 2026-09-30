import { Transaction } from '../types/Transaction';

export interface ITransactionRepository {
    create(transaction: Omit<Transaction, 'id'>): Promise<Transaction>;
    findByUserId(userId: string): Promise<Transaction[]>;
}
