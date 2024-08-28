import {BaseRequest} from "./BaseRequest";
import {User} from "./User";

/**
 * Represents a request to change the length of the word
 */
export class ChangeLengthRequest extends BaseRequest {
    constructor(user: User, size: number) {
        super(user)
        this.size = size;
    }

    public size: number;
}