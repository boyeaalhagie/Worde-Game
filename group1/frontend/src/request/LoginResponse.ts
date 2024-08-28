import {User} from "./User";

/**
 * Represents the backend's response to a log in request
 */
export class LoginResponse {
    public success: boolean;
    public user?: User;

    /**
     * @deprecated This constructor should not be used.
     */
    constructor() {
        this.success = false;
    }
}