import { ChargeRequest, ChargeResponse } from '@oswaldo/dtos';

export interface ISnailPayService {
    processPayment(request: ChargeRequest): Promise<ChargeResponse>;
    setSystemError(enabled: boolean): void;
}
