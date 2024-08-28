package com.group1.backend.request;

import com.group1.backend.user.User;

/**
 * Base class for all requests
 */
public class BaseRequest {
    private User user;

    public User getUser() {
        return user;
    }
}
