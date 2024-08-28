package com.group1.backend.history;

import com.group1.backend.database.Database;
import com.group1.backend.game.Game;
import com.group1.backend.user.User;
import com.group1.backend.util.ValidGuess;

import java.sql.*;
import java.util.List;

/**
 * Manages the history of past games for each user.
 */
public class History {
    private final Database database;

    /**
     * Create a new History with the given database.
     * @param database The database to initialize and use
     */
    public History(Database database) {
        this.database = database;
        this.initDatabase();
    }

    private void initDatabase() {
        Statement statement = database.getStatement();
        try {
            // If you add/remove any columns, the current database
            // must be deleted or updated to reflect those changes.
            statement.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS user2past_games (" +
                            "user_id VARCHAR(36)," +
                            "past_games INTEGER ARRAY" +
                    ");"
            );

            statement.executeUpdate(
                    "CREATE TABLE IF NOT EXISTS past_games (" +
                            "game_id INTEGER AUTO_INCREMENT," +
                            "user_id VARCHAR(36)," +
                            "reference_word VARCHAR(10)," +
                            "won BOOLEAN," +
                            "guesses VARCHAR(10) ARRAY[6]" +
                    ");"
            );
        } catch (SQLException e) {
            System.out.println("Could not initialize database tables!" + e.getMessage());
        }
    }

    /**
     * Add a game to the history of past games.
     * @param game The game to add.
     */
    public void addGame(Game game) {
        if (!game.isComplete()) throw new IllegalArgumentException(
                "Game is not finished yet!"
        );

        int gameId = add_game_to_past_games(game);
        if (gameId < 0) return;

        insert_if_absent(game.getUser());
        add_past_game_to_user(game.getUser(), gameId);
    }

    /**
     * @return the game id if it was successful, -1 otherwise.
     */
    private int add_game_to_past_games(Game game) {
        int gameId = -1;
        try (PreparedStatement stmt = database.getConnection().prepareStatement(
                "INSERT INTO past_games (user_id, reference_word, won, guesses) VALUES (" +
                        "CAST(? AS VARCHAR(36))," +         // user_id
                        "CAST(? AS VARCHAR(10))," +         // reference_word
                        "CAST(? as BOOLEAN)," +             // won
                        "CAST(? AS VARCHAR(10) ARRAY[6])" + // guesses
                ");",
                Statement.RETURN_GENERATED_KEYS
        )) {
            stmt.setString(1, game.getUser().getUserId());
            stmt.setString(2, game.getCorrectWord());
            stmt.setBoolean(3, game.isWon());

            String[] guesses = new String[6];
            List<String> guessWords = game.getGuesses().stream().map(ValidGuess::getWord).toList();

            int numWords = Math.min(guessWords.size(), 6);
            for (int i = 0; i < numWords; i++) {
                guesses[i] = guessWords.get(i);
            }

            Array guessesArr = database.getConnection().createArrayOf("VARCHAR(10)", guesses);
            stmt.setArray(4, guessesArr);

            stmt.executeUpdate();

            ResultSet generated = stmt.getGeneratedKeys();
            generated.next();
            gameId = generated.getInt(1);
        } catch (SQLException e) {
            System.out.println("Failed to add game! " + e);
        }

        return gameId;
    }

    // Insert a new array for the user if they don't have one
    private void insert_if_absent(User user) {
        try (PreparedStatement stmt = database.getConnection().prepareStatement(
                "INSERT INTO user2past_games SELECT * FROM (" +
                        "SELECT CAST(? AS VARCHAR(36)), ARRAY []" +
                ") x WHERE NOT EXISTS(SELECT * FROM user2past_games);"
        )) {
            stmt.setString(1, user.getUserId());
            stmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println("Failed to associate completed game with user!" + e.getMessage());
        }
    }

    private void add_past_game_to_user(User user, int gameId) {
        try (PreparedStatement stmt = database.getConnection().prepareStatement(
                "SELECT ARRAY_APPEND(past_games, ?) FROM user2past_games WHERE user_id = ?"
        )) {
            stmt.setInt(1, gameId);
            stmt.setString(2, user.getUserId());
            ResultSet res = stmt.executeQuery();

            if (!res.next()) throw new SQLException("Did not create new row for user!");
            if (res.next()) throw new IllegalStateException("Duplicate users in user2past_games table!");
        } catch (SQLException e) {
            System.out.println("Failed to associate completed game with user!" + e.getMessage());
        }
    }
}
