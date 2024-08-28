package com.group1.backend.request;

import org.springframework.lang.Nullable;

/**
 * Represents a login request from the frontend
 */
public class LoginRequest {
    public boolean isGuest;
    public @Nullable String username;

    /**
     * @return true if the user is a guest, false if they are logged in
     */
    public boolean isGuest() {
        return isGuest;
    }

    /**
     * @return the username of the user, or null if they are a guest
     */
    @Nullable
    public String getUsername() {
        return username;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "isGuest=" + isGuest +
                ", username='" + username + '\'' +
                '}';
    }
}
