import {User} from "./User";

/**
 * Returned by /sign-up
 */
export class SignUpResponse {
    public success: boolean;
    public userAlreadyExists: boolean;
    public user?: User;

    /**
     * @deprecated This constructor should not be used.
     */
    constructor() {
        this.success = false;
        this.userAlreadyExists = false;
    }
}