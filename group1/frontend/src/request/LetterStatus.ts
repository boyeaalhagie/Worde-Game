/**
 * Representation of every possible keyboard letter
 */
export type Letter =
    'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' |
    'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' |
    'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' |
    'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

/**
 * Represents the accuracy of a specific letter in a word
 */
export enum Accuracy {
    Wrong,
    Misplaced,
    Correct,
}

/**
 * Contains all the information about a letter in a word
 */
export class LetterStatus {
    public letter: Letter;
    public accuracy: Accuracy;

    constructor(letter: Letter, accuracy: Accuracy) {
        this.letter = letter;
        this.accuracy = accuracy;
    }

    public static fromAxiosResponse(response: any): LetterStatus {
        if (response.accuracy === "CORRECT"){
            return new LetterStatus(response.letter, Accuracy.Correct);
        } else if (response.accuracy === "MISPLACED"){
            return new LetterStatus(response.letter, Accuracy.Misplaced);
        } else if (response.accuracy === "WRONG"){
            return new LetterStatus(response.letter, Accuracy.Wrong);
        }
        throw new Error("Invalid accuracy: " + response.accuracy);
    }

}