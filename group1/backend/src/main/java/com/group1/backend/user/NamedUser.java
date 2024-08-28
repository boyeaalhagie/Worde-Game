package com.group1.backend.user;

import java.util.Objects;

/**
 * Represents a user with an account associated with it
 */
public class NamedUser implements User {
    private final String username;
    private final int privileges;

    // Currently, username MUST be unique.
    public NamedUser(String username, int privileges) {
        this.username = username;
        this.privileges = privileges;
    }

    /**
     * Create a new user with no additional privileges
     * @param username the username of the user
     */
    public NamedUser(String username) {
        this(username, 0);
    }

    @Override
    public String getUserId() {
        return username;
    }

    @Override
    public String getDisplayName() {
        return username;
    }

    @Override
    public int getPrivileges() {
        return privileges;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        NamedUser namedUser = (NamedUser) o;

        return Objects.equals(username, namedUser.username);
    }

    @Override
    public int hashCode() {
        return username != null ? username.hashCode() : 0;
    }
}
