import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ITransactionRepository } from '../interfaces/ITransactionRepository';
import { Transaction } from '../types/Transaction';

const DATA_DIR = path.join(__dirname, '../data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

interface TransactionsData {
    transactions: Transaction[];
}

export class JsonTransactionRepository implements ITransactionRepository {
    private async readTransactions(): Promise<Transaction[]> {
        try {
            const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
            const parsed: TransactionsData = JSON.parse(data);
            return parsed.transactions || [];
        } catch (error) {
            // Si el archivo no existe, retornar array vacío
            return [];
        }
    }

    private async writeTransactions(transactions: Transaction[]): Promise<void> {
        const data: TransactionsData = { transactions };
        await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(data, null, 2));
    }

    async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const transactions = await this.readTransactions();

        const newTransaction: Transaction = {
            ...transaction,
            id: uuidv4(),
        };

        transactions.push(newTransaction);
        await this.writeTransactions(transactions);

        return newTransaction;
    }

    async findByUserId(userId: string): Promise<Transaction[]> {
        const transactions = await this.readTransactions();
        return transactions.filter((t) => t.userId === userId);
    }
}
