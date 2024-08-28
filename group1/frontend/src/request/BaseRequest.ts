import {User} from "./User";

/**
 * Base class for all requests
 */
export class BaseRequest {
    constructor(user: User) {
        this.user = user;
    }

    public user: User;
}