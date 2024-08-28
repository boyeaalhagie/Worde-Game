package com.group1.backend.request;

import com.group1.backend.controller.WordleController;
import com.group1.backend.game.LetterStatus;
import org.springframework.lang.Nullable;

import java.util.List;

/**
 * {@link WordleController} returns this upon receiving an {@link GuessRequest}
 * at {@link WordleController#handleGuess(GuessRequest) handleGuess}
 */
public class GuessResponse {
    //TODO: Change to non-static reference once gameplay added
    public int numGuesses;
    public boolean isValid;
    public boolean isGameEnd;
    public boolean isCorrectWord;


    @Nullable
    public List<LetterStatus> letterStatuses;
    public String hint;

    /**
     * Should be used when any guess is correct.
     */
    public static GuessResponse correct(int numGuessed, List<LetterStatus> letterStatuses) {
        return new GuessResponse(
                numGuessed,
                true,
                true,
                true,
                letterStatuses
        );
    }

    /**
     * Should be used when any guess is invalid.
     */
    public static GuessResponse invalid(int numGuessed) {
        return new GuessResponse(
                numGuessed,
                false,
                false,
                false,
                null
        );
    }

    /**
     * Should be used when a non-last (1st-5th) guess is valid, but incorrect.
     */
    public static GuessResponse validIncorrect(int numGuessed, List<LetterStatus> letterStatuses) {
        return new GuessResponse(
                numGuessed,
                true,
                false,
                false,
                letterStatuses
        );
    }

    /**
     * Should be used when the last (6th) guess is valid, but incorrect.
     */
    public static GuessResponse lastIncorrect(int numGuessed, List<LetterStatus> letterStatuses) {
        return new GuessResponse(
                numGuessed,
                true,
                true,
                false,
                letterStatuses
        );
    }

    private GuessResponse(int numGuessed, boolean isValid, boolean isGameEnd, boolean isCorrectWord, List<LetterStatus> statuses) {
        this.numGuesses = numGuessed;
        this.isValid = isValid;
        this.isGameEnd = isGameEnd;
        this.isCorrectWord = isCorrectWord;
        this.letterStatuses = statuses;
    }


    public void setHint(String randomWord) {
        this.hint = randomWord;
    }
}
