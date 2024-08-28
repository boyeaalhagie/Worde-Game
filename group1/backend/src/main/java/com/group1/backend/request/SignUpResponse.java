package com.group1.backend.request;

import com.group1.backend.user.User;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

/**
 * Represents a signup response to be sent to the frontend
 */
public class SignUpResponse {
    public boolean success;

    public boolean userAlreadyExists;

    public @Nullable User user;

    /**
     * Returns a successful signup response
     * @param user the user that signed up
     * @return a successful signup response
     */
    public static SignUpResponse success(@NonNull User user) {
        return new SignUpResponse(user, true, false);
    }

    /**
     * Returns a generic failed signup response
     * @return a failed signup response
     */
    public static SignUpResponse genericFailure() {
        return new SignUpResponse(null, false, false);
    }

    /**
     * Returns a failed signup response for when the user already exists
     * @return a failed signup response
     */
    public static SignUpResponse alreadyExists() {
        return new SignUpResponse(null, false, true);
    }

    private SignUpResponse(@Nullable User user, boolean success, boolean userAlreadyExists) {
        this.success = success;
        this.userAlreadyExists = userAlreadyExists;
        this.user = user;
    }
}
