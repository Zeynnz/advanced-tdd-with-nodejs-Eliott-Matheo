import { Email } from 'domain/value-objects/email';
import {ValueObject} from "../../../../src/shared/types";

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('TEST@EXAMPLE.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = new Email('  test@example.com  ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw error for invalid email format', () => {
      expect(() => new Email('invalid-email')).toThrow('Invalid email format');
      expect(() => new Email('')).toThrow('Invalid email format');
      expect(() => new Email('test@')).toThrow('Invalid email format');
      expect(() => new Email('@example.com')).toThrow('Invalid email format');
    });
  });

  describe('isValid', () => {
    it('should return true for valid emails', () => {
      expect(Email.isValid('test@example.com')).toBe(true);
      expect(Email.isValid('user.name@domain.co.uk')).toBe(true);
      expect(Email.isValid('test+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      // @ts-ignore
      expect(Email.isValid(false)).toBe(false);
      expect(Email.isValid('')).toBe(false);
      expect(Email.isValid('invalid')).toBe(false);
      expect(Email.isValid('test@')).toBe(false);
      expect(Email.isValid('@example.com')).toBe(false);
      expect(Email.isValid('test..test@example.com')).toBe(false);
    });
  });

  describe('create', () => {
    it('should create email using static factory method', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('TEST@EXAMPLE.COM');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('isValid - Edge Cases', () => {

    it('should return false if input is not a string', () => {
      // Non-string input
      // @ts-ignore
      expect(Email.isValid(false)).toBe(false);
      // @ts-ignore
      expect(Email.isValid(123)).toBe(false);
      // @ts-ignore
      expect(Email.isValid(null)).toBe(false);
      // @ts-ignore
      expect(Email.isValid(undefined)).toBe(false);
    });

    it('should return false if email length exceeds 254 characters', () => {
      const longEmail = 'a'.repeat(245) + '@example.com'; // 245 + 12 = 257 > 254
      expect(Email.isValid(longEmail)).toBe(false);
    });

    it('should return false if email is only spaces', () => {
      expect(Email.isValid('    ')).toBe(false);
    });

  });
  describe('Email Domain Methods', () => {
    it('should return the correct domain for a simple email', () => {
      const email = new Email('test@example.com');
      expect(email.getDomain()).toBe('example.com');
      expect(email.getLocalPart()).toBe('test');
    });

    it('should handle emails with dots in the local part', () => {
      const email = new Email('first.last@example.com');
      expect(email.getDomain()).toBe('example.com');
      expect(email.getLocalPart()).toBe('first.last');
    });

    it('should handle emails with plus sign in the local part', () => {
      const email = new Email('user+tag@example.com');
      expect(email.getDomain()).toBe('example.com');
      expect(email.getLocalPart()).toBe('user+tag');
    });

    it('should handle emails with subdomains', () => {
      const email = new Email('user@mail.sub.example.com');
      expect(email.getDomain()).toBe('mail.sub.example.com');
      expect(email.getLocalPart()).toBe('user');
    });

    it('should trim and lowercase the email before returning domain/local parts', () => {
      const email = new Email('  USER@Example.COM  ');
      expect(email.getDomain()).toBe('example.com');
      expect(email.getLocalPart()).toBe('user');
    });
  });

  describe('Email ValueObject - toString and hashCode', () => {
    it('toString should return normalized email', () => {
      const email = new Email('Test@Example.com');
      expect(email.toString()).toBe('test@example.com');
    });

    it('hashCode should be consistent for same email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('TEST@EXAMPLE.COM');
      expect(email1.hashCode()).toBe(email2.hashCode());
    });

    it('hashCode should differ for different emails', () => {
      const email1 = new Email('user1@example.com');
      const email2 = new Email('user2@example.com');
      expect(email1.hashCode()).not.toBe(email2.hashCode());
    });
  });

  describe('Email equals() improvements', () => {
    it('should return true for same email value', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('TEST@EXAMPLE.COM'); // normalized
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different email values', () => {
      const email1 = new Email('user1@example.com');
      const email2 = new Email('user2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false for different VO types', () => {
      const email = new Email('test@example.com');
      const fakeVO = new (class extends ValueObject<string>{})('test@example.com');
      expect(email.equals(fakeVO)).toBe(false);
    });
  });




});
