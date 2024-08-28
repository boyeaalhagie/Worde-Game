package com.group1.backend.database;

import java.sql.*;

/**
 * Represents a connection to a database.
 */
public class Database implements AutoCloseable {
    private static final String REMOTE_DB_PATH = "tcp://135.148.121.116:9092/./backend";
    private static final String BACKUP_DB_PATH = "./src/main/resources/backend.mv.db";

    private Connection connection;
    private final Statement statement;

    private boolean connectedRemote;

    /**
     * Create a new Database with the given path.
     * @param path The path to the database.
     * @throws SQLException if the database fails to establish
     */
    public Database(String path) throws SQLException {
        try {
            Class.forName("org.h2.Driver");

            try {
                System.out.println("Connecting to remote database...");
                this.connection = DriverManager.getConnection(
                        "jdbc:h2:" + path,
                        "wordle",
                        "password"
                );
                System.out.println("Successfully connected to remote database at " + path);

                connectedRemote = true;
            } catch (SQLException e) {
                System.err.println("ERROR: Could not connect to remote database! " + e.getMessage());

                System.out.println("Connecting to backup local database...");
                this.connection = DriverManager.getConnection(
                        "jdbc:h2:" + BACKUP_DB_PATH
                );
                System.out.println("Successfully connected to backup local database at " + BACKUP_DB_PATH);

                connectedRemote = false;
            }

            this.statement = connection.createStatement();
        } catch (SQLException e) {
            throw new SQLException("Failed to establish local database!" + e.getMessage());
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Create a new Database with the default remote path.
     * @throws SQLException if the database fails to establish
     */
    public Database() throws SQLException {
        this(REMOTE_DB_PATH);
    }

    /**
     * Get the statement for the database.
     * @return The statement for the database.
     */
    public Statement getStatement() {
        return statement;
    }

    /**
     * Get the connection for the database.
     * @return The connection for the database.
     */
    public Connection getConnection() {
        return connection;
    }

    /**
     * Check if the database is connected to a remote server.
     * @return True if the database is connected to a remote server, false otherwise.
     */
    public boolean isConnectedRemote() {
        return connectedRemote;
    }

    /**
     * Close the database connection.
     * @throws SQLException if the database fails to close
     */
    @Override
    public void close() throws SQLException {
        this.statement.close();
        this.connection.close();
    }
}
