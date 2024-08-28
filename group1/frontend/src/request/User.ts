/**
 * Base interface for all user types
 */
export interface User {
    getUserId(): string;
    getDisplayName(): string;
    getPrivileges(): number;
}

/**
 * A user that has a username and specified privileges
 */
export class NamedUser implements User {
    readonly type: string = "NamedUser";
    username: string;
    privileges: number;

    constructor(username: string, privileges?: number) {
        this.username = username;
        this.privileges = privileges ?? 0;
    }

    getDisplayName(): string {
        return this.username;
    }

    getUserId(): string {
        return this.username;
    }

    getPrivileges(): number {
        return this.privileges;
    }
}

/**
 * A user that is not logged into a specific account
 */
export class Guest implements User {
    readonly type: string = "Guest";
    uuid: string;

    constructor(uuid: string) {
        this.uuid = uuid;
    }

    getDisplayName(): string {
        return "Guest";
    }

    getUserId(): string {
        return this.uuid;
    }

    getPrivileges(): number {
        return 0;
    }
}

export function parseUserJson(json: string): User {
    const obj = JSON.parse(json);

    if (obj["type"] == "Guest") {
        return new Guest(obj["uuid"]);
    } else {
        return new NamedUser(obj["username"], obj["privileges"]);
    }
}