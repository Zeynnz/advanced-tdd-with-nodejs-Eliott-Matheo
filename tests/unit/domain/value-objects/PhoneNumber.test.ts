import { PhoneNumber } from 'domain/value-objects/phone-number';

describe('PhoneNumber Value Object', () => {
    describe('constructor', () => {
        it('should create a valid phone number', () => {
            const phone = new PhoneNumber('+1 (234) 567-8901');
            expect(phone.getValue()).toBe('+12345678901');
        });

        it('should normalize phone number format', () => {
            const phone = new PhoneNumber('  (123) 456-7890  ');
            expect(phone.getValue()).toBe('1234567890');
        });

        it('should throw error for invalid phone numbers', () => {
            expect(() => new PhoneNumber('12345')).toThrow();
            expect(() => new PhoneNumber('123-ABC-7890')).toThrow();
            expect(() => new PhoneNumber('')).toThrow();
        });
    });

    describe('getCountryCode', () => {
        it('should extract country code', () => {
            expect(new PhoneNumber('+12345678901').getCountryCode()).toBe('123');
            expect(new PhoneNumber('+19876543210').getCountryCode()).toBe('198');
            expect(new PhoneNumber('0123456789').getCountryCode()).toBe('012');
        });
    });

    describe('equals', () => {
        it('should return true for equal phone numbers', () => {
            const p1 = new PhoneNumber('+1 (234) 567-8901');
            const p2 = new PhoneNumber('+12345678901');
            expect(p1.equals(p2)).toBe(true);
        });

        it('should return false for different phone numbers', () => {
            const p1 = new PhoneNumber('+12345678901');
            const p2 = new PhoneNumber('+19876543210');
            expect(p1.equals(p2)).toBe(false);
        });
    });
});
