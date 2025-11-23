// Common types used across the application

export interface Entity<T> {
  readonly id: T;
  equals(entity: Entity<T>): boolean;
}

export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }

  public equals(other: ValueObject<T>): boolean {
    if (!other) return false;
    if (other.constructor !== this.constructor) return false;

    // For string-based ValueObjects
    if (typeof this.value === 'string' && typeof other.value === 'string') {
      return this.value === other.value;
    }

    // Fallback for objects
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }


  public toString(): string {
    return String(this.value);
  }

  public hashCode(): number {
    let hash = 5381;
    const str = this.toString();
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // convert to unsigned 32-bit
  }
}



