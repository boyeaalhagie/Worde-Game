package com.group1.backend.request;

import com.group1.backend.controller.WordleController;

/**
 * {@link WordleController} listens for this at
 * {@link WordleController#handleGuess(GuessRequest) handleGuess}
 */
public class GuessRequest extends BaseRequest {
    private String word;

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }
}
