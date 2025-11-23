import {AntiSpamPort} from "@domain/ports/anti-spam.port";

export class EmailWithoutSpan {
    private _antiSpamPort: AntiSpamPort;
    private _value: string;

    private constructor(email: string, antiSpamPort: AntiSpamPort) {
        this._value = email.trim().toLowerCase();
        this._antiSpamPort = antiSpamPort;
    }

    static isEmailFormatValid(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    public async isValid(): Promise<boolean> {
        return !(await this._antiSpamPort.isBlocked(this._value));
    }

    static async create(email: string, antiSpamPort: AntiSpamPort) {
        const normalized = email.trim().toLowerCase();

        if (!this.isEmailFormatValid(normalized)) {
            throw new Error(`Invalid email format: ${email}`);
        }

        const isBlocked = await antiSpamPort.isBlocked(normalized);
        if (isBlocked) {
            throw new Error(
                `Email is blocked by anti-spam service: ${normalized}`
            );
        }

        return new EmailWithoutSpan(normalized, antiSpamPort);
    }

    getValue() {
        return this._value;
    }
}
