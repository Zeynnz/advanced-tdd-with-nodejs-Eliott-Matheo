import { Email } from '../../../../src/domain';
import { MockAntiSpamAdapter } from '../../../../src/infrastructure/external-services/mock-anti-spam.adapter.js';

describe('Email with Anti-Spam Validation', () => {
    let mockAntiSpam: MockAntiSpamAdapter;

    beforeEach(() => {
        mockAntiSpam = new MockAntiSpamAdapter();
    });

    describe('createWithAntiSpamCheck()', () => {
        it('should create email for valid, non-blocked emails (multiple examples)', async () => {
            const allowed = [
                'user@gmail.com',
                'john@company.com',
                'test@example.org'
            ];

            for (const addr of allowed) {
                const email = await Email.createWithAntiSpamCheck(addr, mockAntiSpam);
                expect(email.getValue()).toBe(addr);
            }
        });

        it('should reject email with blocked pattern (e.g., starts with "blocked@")', async () => {
            await expect(
                Email.createWithAntiSpamCheck('blocked@example.com', mockAntiSpam)
            ).rejects.toThrow('Email is blocked or blacklisted');
        });

        it('should reject email from blocked domain (e.g., spam.com)', async () => {
            await expect(
                Email.createWithAntiSpamCheck('user@spam.com', mockAntiSpam)
            ).rejects.toThrow('Email is blocked or blacklisted');
        });

        it('should reject other blocked examples', async () => {
            await expect(
                Email.createWithAntiSpamCheck('spam@anywhere.com', mockAntiSpam)
            ).rejects.toThrow('Email is blocked or blacklisted');
            await expect(
                Email.createWithAntiSpamCheck('test@fake.com', mockAntiSpam)
            ).rejects.toThrow('Email is blocked or blacklisted');
        });
    });

    describe('create() vs createWithAntiSpamCheck()', () => {
        it('should show difference: create allows but createWithAntiSpamCheck rejects blocked@example.com', async () => {
            const simpleEmail = Email.create('blocked@example.com');
            expect(simpleEmail.getValue()).toBe('blocked@example.com');

            await expect(
                Email.createWithAntiSpamCheck('blocked@example.com', mockAntiSpam)
            ).rejects.toThrow('Email is blocked or blacklisted');
        });

        it('createWithAntiSpamCheck should throw invalid format for malformed email', async () => {
            await expect(
                Email.createWithAntiSpamCheck('not-an-email', mockAntiSpam)
            ).rejects.toThrow('Invalid email format');
        });
    });
});
