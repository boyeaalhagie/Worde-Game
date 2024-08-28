import {BaseRequest} from "./BaseRequest";
import {User} from "./User";

/**
 * Should be used to POST to /guess
 */
export class GuessRequest extends BaseRequest {
    constructor(user: User, word: string) {
        super(user);
        this.word = word;


    }

    public word: string


}