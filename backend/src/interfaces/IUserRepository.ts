import { User } from '../types/User';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: Omit<User, 'id'>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    incrementSessionCounter(id: string): Promise<User | null>;
}
