/**
 * Represents a request to log into a user account
 */
export class LoginRequest {
    public isGuest: boolean;
    public username?: string;

    constructor(isGuest: boolean, username?: string) {
        this.isGuest = isGuest;
        this.username = username;
    }
}