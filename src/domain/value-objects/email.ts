import { ValueObject } from '../../shared/types/common.js';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private static hasConsecutiveDots(email: string): boolean {
    return email.includes('..');
  }

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    super(normalized);
  }

  public static isValid(email: unknown): boolean {
    if (typeof email !== 'string') return false; // must be a string
    if (email.length === 0 || email.length > 254) return false; // check length
    if (Email.hasConsecutiveDots(email)) return false; // consecutive dots
    return Email.EMAIL_REGEX.test(email); // regex validation
  }


  public static create(email: string): Email {
    return new Email(email);
  }

  public getDomain(): string {
    return this.value.split('@')[1];
  }

  public getLocalPart(): string {
    return this.value.split('@')[0];
  }
}
