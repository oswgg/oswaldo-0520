import * as argon2 from 'argon2';
import { IPasswordHasher } from '../../interfaces/IPasswordHasher';

export class Argon2Hasher implements IPasswordHasher {
    private readonly options = {
        memoryCost: 65536, // 64 MB
        timeCost: 3, // 3 iteraciones
        parallelism: 2, // 2 hilos
        hashLength: 32,
    };

    async hash(password: string): Promise<string> {
        return argon2.hash(password, this.options);
    }

    async verify(hash: string, password: string): Promise<boolean> {
        try {
            return await argon2.verify(hash, password);
        } catch (error) {
            return false;
        }
    }
}
