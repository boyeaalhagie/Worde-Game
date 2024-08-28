package com.group1.backend.request;

import com.group1.backend.controller.WordleController;

import java.util.ArrayList;
import java.util.List;

/**
 * {@link WordleController} listens for this at
 * {@link WordleController#handleLengthChange(ChangeLengthRequest) changeLengthRequest}
 */
public class ChangeLengthRequest extends BaseRequest {
    public int size;

    public int getWordList() {
        return size;
    }


}
