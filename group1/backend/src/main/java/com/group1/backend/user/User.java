package com.group1.backend.user;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
/**
 * Base interface for all users, guests and named
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Guest.class, name = "Guest"),
        @JsonSubTypes.Type(value = NamedUser.class, name = "NamedUser")
})
public interface User {
    /**
     * Get the ID associated with the user
     * @return The username of the user
     */
    String getUserId();
    /**
     * Get the display name of the user
     * @return The username of the user
     */
    String getDisplayName();
    /**
     * Get the privilege level of the user
     * @return The privilege level of the user
     */
    int getPrivileges();
    /**
     * Check if the user is equal to another user
     * @param obj The user to compare to
     * @return True if the users are equal
     */
    boolean equals(Object obj);
    /**
     * Get the hash code of the user
     * @return The hash code of the user
     */
    int hashCode();
}
