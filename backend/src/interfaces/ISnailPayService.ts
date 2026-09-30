import { ChargeRequest, ChargeResponse } from '@oswaldo/dtos';

export interface ISnailPayService {
    processPayment(request: ChargeRequest, userId: string, email: string): Promise<ChargeResponse>;
    setSystemError(enabled: boolean): void;
}
