import { Email } from '../../../src/domain';
import { ExternalApiAntiSpamAdapter } from '../../../src/infrastructure/external-services/external-api-anti-spam.adapter';

describe('Email with Real Anti-Spam Service (Integration)', () => {
    let realAntiSpam: ExternalApiAntiSpamAdapter;

    beforeEach(() => {
        // configure API key in your CI/env when running integration tests
        const apiKey = process.env.ANTI_SPAM_API_KEY || 'test-key';
        realAntiSpam = new ExternalApiAntiSpamAdapter(apiKey);
    });

    describe('createWithAntiSpamCheck() with real service', () => {
        it('should validate email with real anti-spam service (integration)', async () => {
            // This will call the real API endpoint configured in the adapter.
            // If you don't have a real endpoint accessible, consider mocking fetch or
            // skipping integration tests in CI unless credentials are present.
            const email = await Email.createWithAntiSpamCheck(
                'user@gmail.com',
                realAntiSpam
            );
            expect(email.getValue()).toBe('user@gmail.com');
        });

        it('should fail open (allow) if API returns an error (integration expectation)', async () => {
            // Behavior depends on ExternalApiAntiSpamAdapter implementation.
            // With the current adapter implementation, API failures return false (allow).
            // So an obviously malformed but syntactically valid email should still be created
            // if the remote service fails.
            const email = await Email.createWithAntiSpamCheck(
                'maybe@unknown-domain.example',
                realAntiSpam
            );
            expect(email.getValue()).toBe('maybe@unknown-domain.example');
        });
    });
});
