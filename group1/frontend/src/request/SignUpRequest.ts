/**
 * Should be sent to /sign-up
 */
export class SignUpRequest {
    public username?: string;

    constructor(username?: string) {
        this.username = username;
    }
}