import {BaseRequest} from "./BaseRequest";
import {User} from "./User";

/**
 * Represents a request to change the list of words
 */
export class ChangeListRequest extends BaseRequest {
    constructor(user: User, file: Array<string>) {
        super(user)
        this.file = file;
    }

    public file: Array<string>;
}