package com.hse.sage.document;

import lombok.Data;

@Data
public class TestCase {
    private int id;
    private String stdin;
    private String expected;
    private String visibility;
}