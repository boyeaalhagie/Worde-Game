import {User} from "./User";

export class ShowAiHintResponse{
    public hint: string;
    public user?: User;

    /**
     * @deprecated This constructor should not be used.
     */
    constructor() {
        this.hint= "";
    }

    /**
     * Converts an axios response to a GuessResponse
     * @param res the axios response
     * @returns the GuessResponse
     */
    public static fromAxiosResponse(res: ShowAiHintResponse): ShowAiHintResponse {
        return res;
    }
}