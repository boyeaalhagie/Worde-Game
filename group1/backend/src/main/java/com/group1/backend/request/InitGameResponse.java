package com.group1.backend.request;

import com.group1.backend.controller.WordleController;
import com.group1.backend.game.Game;
import com.group1.backend.util.ValidGuess;

import java.util.ArrayList;
import java.util.List;

/**
 * {@link WordleController} returns this upon receiving an {@link InitGameRequest}
 * at {@link WordleController#initGame(InitGameRequest) initGame}
 */
public class InitGameResponse {
    public int wordLength;
    public List<GuessResponse> prevGuesses;

    /**
     * Should be used when a game is initialized.
     * @param wordLength the length of the word
     * @param prevGuesses the previous guesses made
     */
    public InitGameResponse(int wordLength, List<GuessResponse> prevGuesses) {
        this.wordLength = wordLength;
        this.prevGuesses = prevGuesses;
    }

    /**
     * Should be used when a game is initialized.
     * @param game the game to initialize from
     */
    public static InitGameResponse fromGame(Game game) {
        return new InitGameResponse(
                game.getCorrectWord().length(),
                game.getGuessResponses()
        );
    }
}
