import {BaseRequest} from "./BaseRequest";
import {User} from "./User";

/**
 * Should be used to POST to /guess
 */
export class ShowAiHintRequest extends BaseRequest {
    constructor(user: User) {
        super(user);

    }

}
