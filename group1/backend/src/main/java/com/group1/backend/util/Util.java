package com.group1.backend.util;

import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

public class Util {
    public static void fillStatement(PreparedStatement stmt, String... params) throws SQLException {
        for (int i = 0; i < params.length; i++) {
            stmt.setString(i+1, params[i]);
        }
    }

    @SuppressWarnings("unchecked")
    public static <T> List<T> sqlArrayToList(Array array) throws SQLException {
        return (List<T>) Arrays.asList((Object[]) array.getArray());
    }
}
