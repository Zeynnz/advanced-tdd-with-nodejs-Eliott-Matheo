import { ValueObject } from '../../shared/types/common.js';
import { AntiSpamPort } from '../ports/anti-spam.port.js';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private static hasConsecutiveDots(email: string): boolean {
    return email.includes('..');
  }

  // keep constructor as-is (can be new Email(...) internally)
  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    super(normalized);
  }


  public static isValid(email: string): boolean {
    return (
        email.length > 0 &&
        email.length <= 254 &&
        !Email.hasConsecutiveDots(email) &&
        Email.EMAIL_REGEX.test(email)
    );
  }

  public static create(email: string): Email {
    return new Email(email);
  }


  public static async createWithAntiSpamCheck(
      email: string,
      antiSpamService: AntiSpamPort
  ): Promise<Email> {
    // Format validation (sync)
    if (!Email.isValid(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    // Anti-spam check (side effect, async)
    const isBlocked = await antiSpamService.isBlocked(email);
    if (isBlocked) {
      throw new Error(`Email is blocked or blacklisted: ${email}`);
    }

    return new Email(email);
  }

  public getDomain(): string {
    return this.value.split('@')[1];
  }

  public getLocalPart(): string {
    return this.value.split('@')[0];
  }
}
