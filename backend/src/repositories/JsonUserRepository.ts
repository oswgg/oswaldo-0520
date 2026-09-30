import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../types/User';

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

interface UsersData {
    users: User[];
}

export class JsonUserRepository implements IUserRepository {
    private async readUsers(): Promise<User[]> {
        try {
            const data = await fs.readFile(USERS_FILE, 'utf-8');
            const parsed: UsersData = JSON.parse(data);
            return parsed.users || [];
        } catch (error) {
            // Si el archivo no existe, retornar array vacío
            return [];
        }
    }

    private async writeUsers(users: User[]): Promise<void> {
        const data: UsersData = { users };
        await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
    }

    async findById(id: string): Promise<User | null> {
        const users = await this.readUsers();
        return users.find((user) => user.id === id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const users = await this.readUsers();
        return users.find((user) => user.email === email) || null;
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        const users = await this.readUsers();

        // Verificar que el email no exista
        const existingUser = users.find((u) => u.email === user.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const newUser: User = {
            ...user,
            id: uuidv4(),
        };

        users.push(newUser);
        await this.writeUsers(users);

        return newUser;
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        const users = await this.readUsers();
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            return null;
        }

        users[userIndex] = {
            ...users[userIndex],
            ...data,
        };

        await this.writeUsers(users);

        return users[userIndex];
    }

    async incrementSessionCounter(id: string): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) {
            return null;
        }

        return this.update(id, {
            sessionCounter: user.sessionCounter + 1,
        });
    }
}
