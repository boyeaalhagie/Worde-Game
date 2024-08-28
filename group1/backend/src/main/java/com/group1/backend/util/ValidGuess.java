package com.group1.backend.util;

import com.group1.backend.game.LetterStatus;

import java.util.*;

/**
 * Represents a valid guess
 */
public class ValidGuess {
    private int length;
    private LetterStatus[] letters;

    private String word;

    /**
     * Create a new valid guess
     * @param word The word guessed
     * @param letterStatuses The statuses of each letter in the word
     */
    public ValidGuess(String word, ArrayList<LetterStatus> letterStatuses) {
        this.word = word;
        letters = letterStatuses.toArray(new LetterStatus[0]);
    }

    /**
     * Get the length of the guess
     * @return The length of the guess
     */
    public int length() {
        return length;
    }

    /**
     * Get the status of a letter in the guess
     * @param index The index of the letter
     * @return The status of the letter
     */
    public LetterStatus getLetter(int index) {
        if (index < 0 || index >= length) {
            throw new IndexOutOfBoundsException(index);
        }

        return letters[index];
    }

    public LetterStatus[] getLetters() {
        return letters;
    }

    public boolean fits(String targetWord) {
        if (this.word.length() != targetWord.length()) throw new IllegalArgumentException(
                word + " cannot be checked against " + targetWord + " (" + this.length() + " vs " + targetWord.length() + ")."
        );

        List<Character> lettersLeft = new ArrayList<>(targetWord.chars()
                .mapToObj(c -> (char) c)
                .toList());

        int i = 0;
        for (LetterStatus letter : this.letters) {
            if (letter.getAccuracy() == LetterStatus.Accuracy.CORRECT) {
                if (lettersLeft.get(i) != letter.getLetter()) return false;
                lettersLeft.set(i, '*');
            }
            ++i;
        }

        i = 0;
        for (LetterStatus letter : this.letters) {
            if (letter.getAccuracy() == LetterStatus.Accuracy.MISPLACED) {
                int index = lettersLeft.indexOf(letter.getLetter());
                if (index < 0 || targetWord.charAt(i) == letter.getLetter()) return false;
                lettersLeft.set(index, '*');
            }
            ++i;
        }

        i = 0;
        for (LetterStatus letter : this.letters) {
            if (letter.getAccuracy() == LetterStatus.Accuracy.WRONG) {
                if (lettersLeft.contains(letter.getLetter())) return false;
                if (targetWord.charAt(i) == letter.getLetter()) return false;
            }
            ++i;
        }

        return true;
    }

    /**
     * Get the word guessed
     * @return The word guessed
     */
    public String getWord() {
        return word;
    }
}
