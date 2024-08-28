package com.group1.backend.game;

/**`
 * Represents the status of a letter in a word
 */
public class LetterStatus {
    private final char letter;
    private final Accuracy accuracy;

    /**
     * Create a new dummy LetterStatus
     * @deprecated Use the constructor that takes a letter and accuracy
     */
    @Deprecated
    public static LetterStatus dummyStatus() {
        return new LetterStatus('h', Accuracy.WRONG);
    }

    /**
     * Create a new LetterStatus with the given letter and accuracy
     * @param letter The letter
     * @param accuracy The accuracy
     */
    public LetterStatus(char letter, Accuracy accuracy) {
        this.letter = letter;
        this.accuracy = accuracy;
    }

    /**
     * Get the letter
     * @return The letter
     */
    public char getLetter() {
        return letter;
    }

    /**
     * Get the accuracy
     * @return The accuracy
     */
    public Accuracy getAccuracy() {
        return accuracy;
    }

    /**
     * Represents the accuracy of a letter
     */
    public enum Accuracy {
        WRONG,
        MISPLACED,
        CORRECT,
    }

    @Override
    public String toString() {
        if(accuracy == Accuracy.WRONG){
            return "WRONG";
        }else if(accuracy == Accuracy.MISPLACED){
            return "MISPLACED";
        }else if(accuracy == Accuracy.CORRECT){
            return "CORRECT";
        }

        return "Unassigned";
    }
}
