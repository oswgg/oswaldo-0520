import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../interfaces/IPasswordHasher';

export class BcryptHasher implements IPasswordHasher {
    private readonly saltRounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async verify(hash: string, password: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
