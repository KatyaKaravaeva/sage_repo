package com.hse.sage.utils;

public class StringUtils {

    public static String unquoteAndUnescape(String input) {
        if (input != null && input.length() >= 2 && input.startsWith("\"") && input.endsWith("\"")) {
            String unquotedString = input.substring(1, input.length() - 1);
            unquotedString = unquotedString.replace("\\\"", "\"");
            unquotedString = unquotedString.replace("\\n", "");

            return unquotedString;
        }
        return input;
    }

}
