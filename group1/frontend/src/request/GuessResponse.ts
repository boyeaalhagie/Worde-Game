import {LetterStatus} from "./LetterStatus";

/**
 * Returned by `/guess`
 */
export class GuessResponse {
    public numGuesses: number;
    public isValid: boolean;
    public isGameEnd: boolean;
    public isCorrectWord: boolean;
    public letterStatuses: Array<LetterStatus>;

    /**
     * @deprecated This constructor should not be used.
     */
    constructor() {
        this.numGuesses = -1.0;
        this.isValid = false;
        this.isGameEnd = false;
        this.isCorrectWord = false;
        this.letterStatuses = [];
    }


    /**
     * Converts an axios response to a GuessResponse
     * @param res the axios response
     * @returns the GuessResponse
     */
    public static fromAxiosResponse(res: GuessResponse): GuessResponse {
        if (res.isValid || res.letterStatuses) {
            res.letterStatuses = res.letterStatuses?.map((letterStatus: any) => {
                return LetterStatus.fromAxiosResponse(letterStatus);
            });
        }
        return res; 
    }
    
}