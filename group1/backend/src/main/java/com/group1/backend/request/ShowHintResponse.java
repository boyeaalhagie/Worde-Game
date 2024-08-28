package com.group1.backend.request;

import com.group1.backend.controller.WordleController;

/**
 * {@link WordleController} returns this upon receiving an {@link ShowHintRequest}
 * at {@link WordleController#getHint(ShowHintRequest) initGame}
 */
public class ShowHintResponse {
    public String hint;


    public ShowHintResponse(String hint) {
        this.hint = hint;
    }



}
