package com.group1.backend.request;

import com.group1.backend.user.User;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

/**
 * Represents a login response to be sent to the frontend
 */
public class LoginResponse {
    public boolean success;

    public @Nullable User user;

    /**
     * Returns a successful login response
     * @param user the user that logged in
     * @return a successful login response
     */
    public static LoginResponse success(@NonNull User user) {
        return new LoginResponse(user, true);
    }

    /**
     * Returns a failed login response
     * @return a failed login response
     */
    public static LoginResponse failure() {
        return new LoginResponse(null, false);
    }

    private LoginResponse(@Nullable User user, boolean success) {
        this.success = success;
        this.user = user;
    }
}
