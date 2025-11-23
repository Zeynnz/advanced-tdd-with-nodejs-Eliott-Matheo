import { User } from '../../../../src/domain';
import { MockAntiSpamAdapter } from '../../../../src/infrastructure/external-services/mock-anti-spam.adapter.js';

describe('User Creation with Anti-Spam Validation', () => {
    let mockAntiSpam: MockAntiSpamAdapter;

    beforeEach(() => {
        mockAntiSpam = new MockAntiSpamAdapter();
    });

    describe('createWithValidation()', () => {
        it('should create user with valid email', async () => {
            const user = await User.createWithValidation(
                'john@gmail.com',
                'John Doe',
                mockAntiSpam
            );

            expect(user.email.getValue()).toBe('john@gmail.com');
            expect(user.name.getValue()).toBe('John Doe');
            expect(user.id).toBeDefined();
        });

        it('should reject user with blocked email', async () => {
            await expect(
                User.createWithValidation(
                    'blocked@example.com',
                    'Spammer',
                    mockAntiSpam
                )
            ).rejects.toThrow('Email is blocked or blacklisted');
        });

        it('should reject user with invalid email format', async () => {
            await expect(
                User.createWithValidation(
                    'not-an-email',
                    'Invalid User',
                    mockAntiSpam
                )
            ).rejects.toThrow('Invalid email format');
        });
    });

    describe('Dependency Injection Benefits', () => {
        it('should work with any AntiSpamPort implementation (mock used here)', async () => {
            const user = await User.createWithValidation(
                'user@gmail.com',
                'Test User',
                mockAntiSpam
            );

            expect(user).toBeDefined();
        });
    });
});
