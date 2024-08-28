import {BaseRequest} from "./BaseRequest";
import {User} from "./User";

/**
 * Should be used to POST to /guess
 */
export class ShowHintRequest extends BaseRequest {
    constructor(user: User) {
        super(user);

    }

}
