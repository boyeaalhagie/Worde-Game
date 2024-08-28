package com.group1.backend.request;

import com.group1.backend.controller.WordleController;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

/**
 * {@link WordleController} listens for this at
 * {@link WordleController#handleWordChange(ChangeListRequest) changeListRequest}
 */
public class ChangeListRequest extends BaseRequest {
    public ArrayList<String> file;

    public List<String> getWordList() {
        return file;
    }


}
