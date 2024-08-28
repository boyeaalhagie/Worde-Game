import {GuessResponse} from "./GuessResponse";

/**
 * Returned by `/initGame`
 */
export class InitGameResponse {
    public wordLength: number;
    public prevGuesses: Array<GuessResponse>;

    /**
     * @deprecated This constructor should not be used.
     */
    constructor() {
        this.wordLength = -1;
        this.prevGuesses = []
    }

    /**
     * Converts an axios response to a InitGameResponse
     * @param arr The axios response
     */
    public static fromAxiosResponse(arr: InitGameResponse): InitGameResponse {
        if(arr != null){
            arr.prevGuesses = arr.prevGuesses.map((res: GuessResponse) => {
                return GuessResponse.fromAxiosResponse(res);
            })
        }
        return arr;
    }
}