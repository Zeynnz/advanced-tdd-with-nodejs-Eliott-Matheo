// src/domain/value-objects/phone-number.ts
import { ValueObject } from '../../shared/types/common.js';

export class PhoneNumber extends ValueObject<string> {
    private static readonly PHONE_REGEX = /^\+?[0-9\s\-()]{10,}$/;

    constructor(phoneNumber: string) {
        const normalized = PhoneNumber.normalize(phoneNumber);

        if (!PhoneNumber.isValid(normalized)) {
            throw new Error(`Invalid phone number: ${phoneNumber}`);
        }

        super(normalized);
    }

    public static normalize(phoneNumber: string): string {
        // Keep leading + if exists
        const hasPlus = phoneNumber.trim().startsWith('+');
        let cleaned = phoneNumber.replace(/[\s\-()]/g, '');
        if (hasPlus && !cleaned.startsWith('+')) {
            cleaned = '+' + cleaned;
        }
        return cleaned;
    }

    public static isValid(phoneNumber: string): boolean {
        if (typeof phoneNumber !== 'string') return false;
        if (!PhoneNumber.PHONE_REGEX.test(phoneNumber)) return false;

        // Count digits (ignore + if exists)
        const digits = phoneNumber.replace(/\D/g, '');
        return digits.length >= 10;
    }

    public getCountryCode(): string {
        // Country code is first 1-3 digits after optional +
        const num = this.value.startsWith('+') ? this.value.slice(1) : this.value;
        return num.slice(0, Math.min(3, num.length));
    }
}
