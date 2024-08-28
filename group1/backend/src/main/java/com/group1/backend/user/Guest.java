package com.group1.backend.user;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

/**
 * Represents a guest user
 */
public class Guest implements User {
    private final @JsonProperty("uuid") String uuid;

    /**
     * Create a new guest user
     */
    public Guest() {
        this.uuid = UUID.randomUUID().toString();
    }

    @Override
    public String getUserId() {
        return this.uuid;
    }

    @Override
    public String getDisplayName() {
        return "Guest";
    }

    @Override
    public int getPrivileges() {
        return 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Guest guest = (Guest) o;

        return uuid.equals(guest.uuid);
    }

    @Override
    public int hashCode() {
        return uuid.hashCode();
    }
}
