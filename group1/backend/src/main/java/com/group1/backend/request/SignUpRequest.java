package com.group1.backend.request;

import org.springframework.lang.Nullable;

/**
 * Represents a signup request from the frontend
 */
public class SignUpRequest {
    public @Nullable String username;

    /**
     * @return the username of the user
     */
    @Nullable
    public String getUsername() {
        return username;
    }

}
